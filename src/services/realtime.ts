import { AppwriteException, Client, JSONbig } from '../client';
import { Channel, ActionableChannel, ResolvedChannel } from '../channel';
import { Query } from '../query';
import { ID } from '../id';
import { Platform } from 'react-native';

export type RealtimeSubscriptionUpdate = {
    channels?: (string | Channel<any> | ActionableChannel | ResolvedChannel)[];
    queries?: (string | Query)[];
}

export type RealtimeSubscription = {
    /**
     * Remove this subscription only. Keeps the WebSocket open so other subscriptions keep receiving events.
     * Use `Realtime.disconnect()` to close the connection entirely.
     */
    unsubscribe: () => Promise<void>;

    /**
     * Replace the channels and/or queries for this subscription on the server without re-creating it.
     */
    update: (changes: RealtimeSubscriptionUpdate) => Promise<void>;

    /**
     * Alias of `unsubscribe()` plus legacy auto-disconnect when this was the last active subscription.
     * Prefer `unsubscribe()` for per-subscription teardown and `Realtime.disconnect()` for full shutdown.
     */
    close: () => Promise<void>;
}

export type RealtimeCallback<T = any> = {
    channels: Set<string>;
    queries: string[]; // Array of query strings
    callback: (event: RealtimeResponseEvent<T>) => void;
}

export type RealtimeResponse = {
    type: string;
    data?: any;
}

export type RealtimeResponseEvent<T = any> = {
    events: string[];
    channels: string[];
    timestamp: string;
    payload: T;
    subscriptions: string[]; // Backend-provided subscription IDs
}

export type RealtimeResponseConnected = {
    channels: string[];
    user?: object;
}

export type RealtimeRequest = {
    type: 'authentication' | 'subscribe' | 'unsubscribe' | 'presence';
    data: any;
}

export type RealtimePresence = {
    $id: string;
    $sequence?: string | number;
    $createdAt: string;
    $updatedAt: string;
    $permissions: string[];
    userInternalId: string;
    userId: string;
    status?: string;
    source: string;
    metadata?: Record<string, any>;
}

export type RealtimePresenceCreate = {
    status: string;
    presenceId: string;
    permissions?: string[];
    metadata?: Record<string, any>;
}

type RealtimeRequestSubscribeRow = {
    subscriptionId?: string;
    channels: string[];
    queries: string[];
}

export enum RealtimeCode {
    NORMAL_CLOSURE = 1000,
    POLICY_VIOLATION = 1008,
    UNKNOWN_ERROR = -1
}

export class Realtime {
    private readonly TYPE_ERROR = 'error';
    private readonly TYPE_EVENT = 'event';
    private readonly TYPE_PONG = 'pong';
    private readonly TYPE_CONNECTED = 'connected';
    private readonly DEBOUNCE_MS = 1;
    private readonly HEARTBEAT_INTERVAL = 20000; // 20 seconds in milliseconds

    private client: Client;
    private socket?: WebSocket;
    private activeSubscriptions = new Map<string, RealtimeCallback<any>>();
    private pendingSubscribes = new Map<string, RealtimeRequestSubscribeRow>();
    private pendingPresence?: Record<string, any>;
    private appConnected = false;
    private heartbeatTimer?: number;
    // Single-flight lock for createSocket(). When set, concurrent callers join
    // this promise instead of issuing a second `new WebSocket(...)`. Cleared
    // after the underlying connect resolves or rejects.
    private socketCreationPromise?: Promise<void>;

    private subCallDepth = 0;
    private reconnectAttempts = 0;
    private connectionId = 0;
    private reconnect = true;

    private onErrorCallbacks: Array<(error?: Error, statusCode?: number) => void> = [];
    private onCloseCallbacks: Array<() => void> = [];
    private onOpenCallbacks: Array<() => void> = [];

    constructor(client: Client) {
        this.client = client;
    }

    /**
     * Register a callback function to be called when an error occurs
     *
     * @param {Function} callback - Callback function to handle errors
     * @returns {void}
     */
    public onError(callback: (error?: Error, statusCode?: number) => void): void {
        this.onErrorCallbacks.push(callback);
    }

    /**
     * Register a callback function to be called when the connection closes
     *
     * @param {Function} callback - Callback function to handle connection close
     * @returns {void}
     */
    public onClose(callback: () => void): void {
        this.onCloseCallbacks.push(callback);
    }

    /**
     * Register a callback function to be called when the connection opens
     *
     * @param {Function} callback - Callback function to handle connection open
     * @returns {void}
     */
    public onOpen(callback: () => void): void {
        this.onOpenCallbacks.push(callback);
    }

    private startHeartbeat(): void {
        this.stopHeartbeat();
        this.heartbeatTimer = window?.setInterval(() => {
            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(JSONbig.stringify({ type: 'ping' }));
            }
        }, this.HEARTBEAT_INTERVAL);
    }

    private stopHeartbeat(): void {
        if (this.heartbeatTimer) {
            window?.clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = undefined;
        }
    }

    /**
     * Idempotent socket opener. Both `subscribe()` and `upsertPresence()` can
     * call this; the single-flight lock (`socketCreationPromise`) guarantees
     * only one `new WebSocket(...)` is ever in flight, so concurrent callers
     * join the same connection attempt instead of opening duplicates.
     *
     * Returns early when a healthy socket is already present.
     */
    private async createSocket(): Promise<void> {
        // Fast path: a usable socket is already there. No need to open another.
        if (this.socket && this.socket.readyState < WebSocket.CLOSING) {
            return;
        }
        // Another caller is already opening one — join it.
        if (this.socketCreationPromise) {
            return this.socketCreationPromise;
        }
        this.socketCreationPromise = this.createSocketLocked().finally(() => {
            this.socketCreationPromise = undefined;
        });
        return this.socketCreationPromise;
    }

    private async createSocketLocked(): Promise<void> {
        // Nothing to do if there's neither a subscription nor a queued presence
        // that needs the wire. (Reconnect cleanup path also flows through here.)
        if (this.activeSubscriptions.size === 0 && !this.pendingPresence) {
            this.reconnect = false;
            await this.closeSocket();
            return;
        }

        const projectId = this.client.config.project;
        if (!projectId) {
            throw new AppwriteException('Missing project ID');
        }

        // URL carries only the project; channels/queries are sent via the subscribe message.
        const queryParams = `project=${projectId}`;

        const endpoint =
            this.client.config.endpointRealtime !== ''
                ? this.client.config.endpointRealtime
                : this.client.config.endpoint || '';
        const realtimeEndpoint = endpoint
            .replace('https://', 'wss://')
            .replace('http://', 'ws://');
        const url = `${realtimeEndpoint}/realtime?${queryParams}`;

        if (this.socket) {
            this.reconnect = false;
            if (this.socket.readyState < WebSocket.CLOSING) {
                await this.closeSocket();
            }
            // Ensure reconnect isn't stuck false if close event was missed.
            this.reconnect = true;
        }

        return new Promise((resolve, reject) => {
            // Re-check the entry guard synchronously. `disconnect()` may have
            // run during the `await this.closeSocket()` above (or any other
            // await between the original guard and here), clearing every
            // subscription and the pending presence. In that case opening a
            // fresh socket would leak a connection with nothing attached.
            if (this.activeSubscriptions.size === 0 && !this.pendingPresence) {
                resolve();
                return;
            }
            try {
                const connectionId = ++this.connectionId;
                const WebSocketCtor: any = WebSocket;
                const socket = (this.socket = new WebSocketCtor(url, undefined, {
                    headers: {
                        Origin: `appwrite-${Platform.OS}://${this.client.config.platform}`
                    }
                }));

                socket.addEventListener('open', () => {
                    if (connectionId !== this.connectionId) {
                        return;
                    }
                    this.reconnectAttempts = 0;
                    this.onOpenCallbacks.forEach(callback => callback());
                    this.startHeartbeat();
                    resolve();
                });

                socket.addEventListener('message', (event: MessageEvent) => {
                    if (connectionId !== this.connectionId) {
                        return;
                    }
                    try {
                        const message = JSONbig.parse(event.data) as RealtimeResponse;
                        this.handleMessage(message);
                    } catch (error) {
                        console.error('Failed to parse message:', error);
                    }
                });

                socket.addEventListener('close', async (event: CloseEvent) => {
                    if (connectionId !== this.connectionId || socket !== this.socket) {
                        return;
                    }
                    this.appConnected = false;
                    this.stopHeartbeat();
                    this.onCloseCallbacks.forEach(callback => callback());

                    if (!this.reconnect || event.code === RealtimeCode.POLICY_VIOLATION) {
                        this.reconnect = true;
                        return;
                    }

                    const timeout = this.getTimeout();
                    console.log(`Realtime disconnected. Re-connecting in ${timeout / 1000} seconds.`);

                    await this.sleep(timeout);
                    this.reconnectAttempts++;

                    try {
                        await this.createSocket();
                    } catch (error) {
                        console.error('Failed to reconnect:', error);
                    }
                });

                socket.addEventListener('error', (event: Event) => {
                    if (connectionId !== this.connectionId || socket !== this.socket) {
                        return;
                    }
                    this.stopHeartbeat();
                    const error = new Error('WebSocket error');
                    console.error('WebSocket error:', error.message);
                    this.onErrorCallbacks.forEach(callback => callback(error));
                    reject(error);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    private async closeSocket(): Promise<void> {
        this.stopHeartbeat();

        if (this.socket) {
            return new Promise((resolve) => {
                if (!this.socket) {
                    resolve();
                    return;
                }

                if (this.socket.readyState === WebSocket.OPEN ||
                    this.socket.readyState === WebSocket.CONNECTING) {
                    this.socket.addEventListener('close', () => {
                        resolve();
                    }, { once: true });
                    this.socket.close(RealtimeCode.NORMAL_CLOSURE);
                } else {
                    resolve();
                }
            });
        }
    }

    private getTimeout(): number {
        if (this.reconnectAttempts < 5) {
            return 1000;
        } else if (this.reconnectAttempts < 15) {
            return 5000;
        } else if (this.reconnectAttempts < 100) {
            return 10000;
        } else {
            return 60000;
        }
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private sendUnsubscribeMessage(subscriptionIds: string[]): void {
        const ids = subscriptionIds.filter(id => typeof id === 'string' && id.length > 0);
        if (ids.length === 0) {
            return;
        }
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
            return;
        }
        this.socket.send(JSONbig.stringify(<RealtimeRequest>{
            type: 'unsubscribe',
            data: ids.map(subscriptionId => ({ subscriptionId }))
        }));
    }

    private generateUniqueSubscriptionId(): string {
        const attempts = this.activeSubscriptions.size + 1;
        for (let i = 0; i < attempts; i++) {
            const id = ID.unique();
            if (!this.activeSubscriptions.has(id)) {
                return id;
            }
        }
        throw new AppwriteException('Failed to generate unique subscription id');
    }

    private enqueuePendingSubscribe(subscriptionId: string): void {
        const subscription = this.activeSubscriptions.get(subscriptionId);
        if (!subscription) {
            return;
        }
        this.pendingSubscribes.set(subscriptionId, {
            subscriptionId,
            channels: Array.from(subscription.channels),
            queries: subscription.queries ?? []
        });
    }

    /**
     * Close the WebSocket connection and drop all active subscriptions client-side.
     * Use this instead of calling `unsubscribe()` on every subscription when you want to tear everything down.
     */
    public async disconnect(): Promise<void> {
        this.activeSubscriptions.clear();
        this.pendingSubscribes.clear();
        this.pendingPresence = undefined;
        this.appConnected = false;
        this.reconnect = false;
        // Drop the in-flight single-flight slot. Promises can't be cancelled,
        // so the underlying createSocketLocked() promise may stay pending
        // forever — e.g. when closeSocket() below tears down a CONNECTING
        // socket, the `close` event fires but `open`/`error` never do, and
        // the inner `new Promise(...)` only resolves on those. Without this
        // line, the next subscribe()/upsertPresence() would join the orphan
        // promise via the single-flight gate and hang, leaving its pending
        // subscription queued with no socket ever opened. Mirrors the Swift
        // template's socketCreationTask cancel in disconnect().
        this.socketCreationPromise = undefined;
        await this.closeSocket();
    }

    private sendPendingSubscribes(): void {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
            return;
        }
        // The WebSocket 'open' event fires when the TCP/upgrade handshake
        // completes — but the server only accepts `subscribe` frames after
        // it has emitted its own application-level `connected` event (which
        // flips `appConnected` to true in handleResponseConnected). Sending
        // before then triggers a policy-violation close on real Appwrite,
        // which reconnects, which sends early again — i.e. a duplicate-
        // socket loop. handleResponseConnected re-enqueues every active
        // subscription and calls this method again once it's safe, so the
        // queued rows are guaranteed to be sent.
        if (!this.appConnected) {
            return;
        }

        if (this.pendingSubscribes.size < 1) {
            return;
        }

        const rows = Array.from(this.pendingSubscribes.values());
        this.pendingSubscribes.clear();

        this.socket.send(JSONbig.stringify(<RealtimeRequest>{
            type: 'subscribe',
            data: rows
        }));
    }

    /**
     * Convert a channel value to a string
     *
     * @private
     * @param {string | Channel<any> | ActionableChannel | ResolvedChannel} channel - Channel value (string or Channel builder instance)
     * @returns {string} Channel string representation
     */
    private channelToString(channel: string | Channel<any> | ActionableChannel | ResolvedChannel): string {
        if (typeof channel === 'string') {
            return channel;
        }
        // All Channel instances have toString() method
        if (channel && typeof (channel as Channel<any>).toString === 'function') {
            return (channel as Channel<any>).toString();
        }
        return String(channel);
    }

    /**
     * Subscribe to a single channel
     *
     * @param {string | Channel<any> | ActionableChannel | ResolvedChannel} channel - Channel name to subscribe to (string or Channel builder instance)
     * @param {Function} callback - Callback function to handle events
     * @returns {Promise<RealtimeSubscription>} Subscription object with close method
     */
    public async subscribe(
        channel: string | Channel<any> | ActionableChannel | ResolvedChannel,
        callback: (event: RealtimeResponseEvent<any>) => void,
        queries?: (string | Query)[]
    ): Promise<RealtimeSubscription>;

    /**
     * Subscribe to multiple channels
     *
     * @param {(string | Channel<any> | ActionableChannel | ResolvedChannel)[]} channels - Array of channel names to subscribe to (strings or Channel builder instances)
     * @param {Function} callback - Callback function to handle events
     * @returns {Promise<RealtimeSubscription>} Subscription object with close method
     */
    public async subscribe(
        channels: (string | Channel<any> | ActionableChannel | ResolvedChannel)[],
        callback: (event: RealtimeResponseEvent<any>) => void,
        queries?: (string | Query)[]
    ): Promise<RealtimeSubscription>;

    /**
     * Subscribe to a single channel with typed payload
     *
     * @param {string | Channel<any> | ActionableChannel | ResolvedChannel} channel - Channel name to subscribe to (string or Channel builder instance)
     * @param {Function} callback - Callback function to handle events with typed payload
     * @returns {Promise<RealtimeSubscription>} Subscription object with close method
     */
    public async subscribe<T>(
        channel: string | Channel<any> | ActionableChannel | ResolvedChannel,
        callback: (event: RealtimeResponseEvent<T>) => void,
        queries?: (string | Query)[]
    ): Promise<RealtimeSubscription>;

    /**
     * Subscribe to multiple channels with typed payload
     *
     * @param {(string | Channel<any> | ActionableChannel | ResolvedChannel)[]} channels - Array of channel names to subscribe to (strings or Channel builder instances)
     * @param {Function} callback - Callback function to handle events with typed payload
     * @returns {Promise<RealtimeSubscription>} Subscription object with close method
     */
    public async subscribe<T>(
        channels: (string | Channel<any> | ActionableChannel | ResolvedChannel)[],
        callback: (event: RealtimeResponseEvent<T>) => void,
        queries?: (string | Query)[]
    ): Promise<RealtimeSubscription>;

    public async subscribe<T = any>(
        channelsOrChannel: string | Channel<any> | ActionableChannel | ResolvedChannel | (string | Channel<any> | ActionableChannel | ResolvedChannel)[],
        callback: (event: RealtimeResponseEvent<T>) => void,
        queries: (string | Query)[] = []
    ): Promise<RealtimeSubscription> {
        const channelArray = Array.isArray(channelsOrChannel)
            ? channelsOrChannel
            : [channelsOrChannel];
        
        // Convert all channels to strings
        const channelStrings = channelArray.map(ch => this.channelToString(ch));
        const channels = new Set(channelStrings);

        // Convert queries to array of strings
        // Ensure each query is a separate string in the array
        const queryStrings: string[] = [];
        for (const q of (queries ?? [])) {
            if (Array.isArray(q)) {
                // Handle nested arrays: [[q1, q2]] -> [q1, q2]
                for (const inner of q) {
                    queryStrings.push(typeof inner === 'string' ? inner : inner.toString());
                }
            } else {
                queryStrings.push(typeof q === 'string' ? q : q.toString());
            }
        }

        const subscriptionId = this.generateUniqueSubscriptionId();

        this.activeSubscriptions.set(subscriptionId, {
            channels,
            queries: queryStrings,
            callback
        });
        this.enqueuePendingSubscribe(subscriptionId);

        this.subCallDepth++;
        try {
            await this.sleep(this.DEBOUNCE_MS);

            if (this.subCallDepth === 1) {
                if (!this.socket || this.socket.readyState > WebSocket.OPEN) {
                    await this.createSocket();
                } else if (this.socket.readyState === WebSocket.OPEN) {
                    this.sendPendingSubscribes();
                }
            }
        } finally {
            this.subCallDepth--;
        }

        const unsubscribe = async (): Promise<void> => {
            if (!this.activeSubscriptions.has(subscriptionId)) {
                return;
            }
            this.activeSubscriptions.delete(subscriptionId);
            this.pendingSubscribes.delete(subscriptionId);
            this.sendUnsubscribeMessage([subscriptionId]);
        };

        const update = async (changes: RealtimeSubscriptionUpdate): Promise<void> => {
            const subscription = this.activeSubscriptions.get(subscriptionId);
            if (!subscription) {
                return;
            }

            if (changes.channels !== undefined) {
                const nextChannelStrings = changes.channels.map(ch => this.channelToString(ch));
                subscription.channels = new Set(nextChannelStrings);
            }

            if (changes.queries !== undefined) {
                const nextQueries: string[] = [];
                for (const q of changes.queries) {
                    if (Array.isArray(q)) {
                        for (const inner of q) {
                            nextQueries.push(typeof inner === 'string' ? inner : (inner as Query).toString());
                        }
                    } else {
                        nextQueries.push(typeof q === 'string' ? q : q.toString());
                    }
                }
                subscription.queries = nextQueries;
            }

            this.enqueuePendingSubscribe(subscriptionId);

            this.subCallDepth++;
            try {
                await this.sleep(this.DEBOUNCE_MS);

                if (this.subCallDepth === 1) {
                    if (!this.socket || this.socket.readyState > WebSocket.OPEN) {
                        await this.createSocket();
                    } else if (this.socket.readyState === WebSocket.OPEN) {
                        this.sendPendingSubscribes();
                    }
                }
            } finally {
                this.subCallDepth--;
            }
        };

        const close = async (): Promise<void> => {
            await unsubscribe();
            if (this.activeSubscriptions.size === 0) {
                this.reconnect = false;
                await this.closeSocket();
            }
        };

        return { unsubscribe, update, close };
    }

    /**
     * Fire-and-forget presence upsert. Records the latest payload in state so
     * that — if the WebSocket isn't open yet, or later reconnects — only the
     * most recent presence is automatically (re)sent on the next `connected`
     * event. Repeated calls while the socket is closed collapse to the latest
     * payload (older ones are discarded).
     *
     * Returns a `Promise<void>` for API consistency; the promise resolves as
     * soon as the payload has been stored and the opportunistic send attempted.
     *
     * @param {RealtimePresenceCreate} params - Presence payload (status and presenceId required, permissions/metadata optional)
     */
    public async upsertPresence(params: RealtimePresenceCreate): Promise<void> {
        const data: Record<string, any> = {
            status: params.status,
            presenceId: params.presenceId,
        };
        if (params.permissions !== undefined) {
            data.permissions = params.permissions;
        }
        if (params.metadata !== undefined) {
            data.metadata = params.metadata;
        }

        this.pendingPresence = data;

        // Both subscribe() and upsertPresence() may need to open the socket.
        // createSocket() is single-flight (see `socketCreationPromise`), so
        // calling it here is a no-op when a connection is already in flight or
        // healthy. Fire-and-forget keeps the documented fire-and-forget shape
        // of upsertPresence: the returned Promise resolves as soon as the
        // payload is stored.
        if (!this.socket || this.socket.readyState >= WebSocket.CLOSING) {
            this.createSocket().catch((error) => {
                console.error('Failed to open realtime socket for presence:', error);
            });
        }

        // Opportunistic send for the case where the socket is already past the
        // `connected` handshake. The gate inside flushPendingPresence keeps
        // this a no-op until appConnected flips to true.
        this.flushPendingPresence();
    }

    private flushPendingPresence(): void {
        if (!this.pendingPresence) {
            return;
        }
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
            return;
        }
        if (!this.appConnected) {
            return;
        }
        this.socket.send(JSONbig.stringify(<RealtimeRequest>{
            type: 'presence',
            data: this.pendingPresence
        }));
    }

    private handleMessage(message: RealtimeResponse): void {
        if (!message.type) {
            return;
        }

        switch (message.type) {
            case this.TYPE_CONNECTED:
                this.handleResponseConnected(message);
                break;
            case this.TYPE_ERROR:
                this.handleResponseError(message);
                break;
            case this.TYPE_EVENT:
                this.handleResponseEvent(message);
                break;
            case this.TYPE_PONG:
                // Handle pong response if needed
                break;
        }
    }

    private handleResponseConnected(message: RealtimeResponse): void {
        if (!message.data) {
            return;
        }

        const messageData = message.data as RealtimeResponseConnected;

        let session = this.client.config.session;
        if (!session) {
            try {
                const cookie = JSONbig.parse(window.localStorage.getItem('cookieFallback') ?? '{}');
                session = cookie?.[`a_session_${this.client.config.project}`];
            } catch (error) {
                console.error('Failed to parse cookie fallback:', error);
            }
        }

        if (session && !messageData.user) {
            this.socket?.send(JSONbig.stringify(<RealtimeRequest>{
                type: 'authentication',
                data: {
                    session
                }
            }));
        }

        for (const subscriptionId of this.activeSubscriptions.keys()) {
            this.enqueuePendingSubscribe(subscriptionId);
        }
        this.appConnected = true;
        this.sendPendingSubscribes();
        this.flushPendingPresence();
    }

    private handleResponseError(message: RealtimeResponse): void {
        const error = new AppwriteException(
            message.data?.message || 'Unknown error'
        );
        const statusCode = message.data?.code;
        this.onErrorCallbacks.forEach(callback => callback(error, statusCode));
    }

    private handleResponseEvent(message: RealtimeResponse): void {
        const data = message.data;
        if (!data) {
            return;
        }

        const channels = data.channels as string[];
        const events = data.events as string[];
        const payload = data.payload;
        const timestamp = data.timestamp as string;
        const subscriptions = data.subscriptions as string[] | undefined;

        if (!channels || !events || !payload || !subscriptions || subscriptions.length === 0) {
            return;
        }

        for (const subscriptionId of subscriptions) {
            const subscription = this.activeSubscriptions.get(subscriptionId);
            if (!subscription) {
                continue;
            }
            subscription.callback({
                events,
                channels,
                timestamp,
                payload,
                subscriptions
            });
        }
    }
}

import { Models } from './models';
import { Service } from './service';
import { Platform } from 'react-native';
import { Query } from './query';
import JSONbigModule from 'json-bigint';
const JSONbigParser = JSONbigModule({ storeAsString: false });
const JSONbigSerializer = JSONbigModule({ useNativeBigInt: true });

const MAX_SAFE = BigInt(Number.MAX_SAFE_INTEGER);
const MIN_SAFE = BigInt(Number.MIN_SAFE_INTEGER);
const MAX_INT64 = BigInt('9223372036854775807');
const MIN_INT64 = BigInt('-9223372036854775808');

function isBigNumber(value: any): boolean {
    return value !== null
        && typeof value === 'object'
        && value._isBigNumber === true
        && typeof value.isInteger === 'function'
        && typeof value.toFixed === 'function'
        && typeof value.toNumber === 'function';
}

function reviver(_key: string, value: any): any {
    if (isBigNumber(value)) {
        if (value.isInteger()) {
            const str = value.toFixed();
            const bi = BigInt(str);
            if (bi >= MIN_SAFE && bi <= MAX_SAFE) {
                return Number(str);
            }
            if (bi >= MIN_INT64 && bi <= MAX_INT64) {
                return bi;
            }
            return value.toNumber();
        }
        return value.toNumber();
    }
    return value;
}

const JSONbig = {
    parse: (text: string) => JSONbigParser.parse(text, reviver),
    stringify: JSONbigSerializer.stringify
};

type Payload = {
    [key: string]: any;
}

type Headers = {
    [key: string]: string;
}

type RealtimeResponse = {
    type: 'error' | 'event' | 'connected' | 'response' | 'pong';
    data: RealtimeResponseAuthenticated | RealtimeResponseConnected | RealtimeResponseError | RealtimeResponseEvent<unknown> | undefined;
}

type RealtimeRequest = {
    type: 'authentication' | 'subscribe';
    data: RealtimeRequestAuthenticate | RealtimeRequestSubscribe[];
}

type RealtimeRequestSubscribe = {
    subscriptionId?: string;
    channels: string[];
    queries: string[];
}

type RealtimeResponseAction = {
    to?: string;
    success?: boolean;
    subscriptions?: Array<{
        subscriptionId?: string;
        channels?: string[];
        queries?: string[];
    }>;
}

export type RealtimeResponseEvent<T extends unknown> = {
    events: string[];
    channels: string[];
    timestamp: number;
    payload: T;
    subscriptions?: string[];
}

type RealtimeResponseError = {
    code: number;
    message: string;
}

type RealtimeResponseConnected = {
    channels: string[];
    user?: object;
}

type RealtimeResponseAuthenticated = {
    to: string;
    success: boolean;
    user: object;
}

type RealtimeRequestAuthenticate = {
    session: string;
}

type Realtime = {
    socket?: WebSocket;

    /**
     * Timeout for reconnect operations.
     */
    timeout?: number;

    /**
     * Heartbeat interval for the realtime connection.
    */
    heartbeat?: number;

    url?: string;
    lastMessage?: RealtimeResponse;
    subscriptions: Map<number, {
        channels: string[];
        queries: string[];
        callback: (payload: RealtimeResponseEvent<any>) => void
    }>;
    slotToSubscriptionId: Map<number, string>;
    subscriptionIdToSlot: Map<string, number>;
    pendingSubscribeSlots: number[];
    subscriptionsCounter: number;
    reconnect: boolean;
    reconnectAttempts: number;
    getTimeout: () => number;
    connect: () => void;
    createSocket: () => void;
    createHeartbeat: () => void;
    sendSubscribeMessage: () => void;
    onMessage: (event: MessageEvent) => void;
}

export type UploadProgress = {
    $id: string;
    progress: number;
    sizeUploaded: number;
    chunksTotal: number;
    chunksUploaded: number;
}

class AppwriteException extends Error {
    code: number;
    response: string;
    type: string;
    constructor(message: string, code: number = 0, type: string = '', response: string = '') {
        super(message);
        this.name = 'AppwriteException';
        this.message = message;
        this.code = code;
        this.type = type;
        this.response = response;
    }
}

class Client {
    config = {
        endpoint: 'https://cloud.appwrite.io/v1',
        endpointRealtime: '',
        project: '',
        jwt: '',
        locale: '',
        session: '',
        devkey: '',
        impersonateuserid: '',
        impersonateuseremail: '',
        impersonateuserphone: '',
        platform: '',
    };
    headers: Headers = {
        'x-sdk-name': 'React Native',
        'x-sdk-platform': 'client',
        'x-sdk-language': 'reactnative',
        'x-sdk-version': '0.29.0',
        'X-Appwrite-Response-Format': '1.9.2',
    };

    /**
     * Get Headers
     *
     * Returns a copy of the current request headers, including any
     * authentication headers. Handle with care.
     *
     * @returns {Headers}
     */
    getHeaders(): Headers {
        return { ...this.headers };
    }

    /**
     * Set Endpoint
     *
     * Your project endpoint
     *
     * @param {string} endpoint
     *
     * @returns {this}
     */
    setEndpoint(endpoint: string): this {
        if (!endpoint || typeof endpoint !== 'string') {
            throw new AppwriteException('Endpoint must be a valid string');
        }

        if (!endpoint.startsWith('http://') && !endpoint.startsWith('https://')) {
            throw new AppwriteException('Invalid endpoint URL: ' + endpoint);
        }

        this.config.endpoint = endpoint;
        this.config.endpointRealtime = endpoint.replace('https://', 'wss://').replace('http://', 'ws://');

        return this;
    }

    /**
     * Set Realtime Endpoint
     *
     * @param {string} endpointRealtime
     *
     * @returns {this}
     */
    setEndpointRealtime(endpointRealtime: string): this {
        if (!endpointRealtime || typeof endpointRealtime !== 'string') {
            throw new AppwriteException('Endpoint must be a valid string');
        }

        if (!endpointRealtime.startsWith('ws://') && !endpointRealtime.startsWith('wss://')) {
            throw new AppwriteException('Invalid realtime endpoint URL: ' + endpointRealtime);
        }

        this.config.endpointRealtime = endpointRealtime;
        return this;
    }

    /**
     * Set platform
     * 
     * Set platform. Will be used as origin for all requests.
     * 
     * @param {string} platform
     * @returns {this}
     */
    setPlatform(platform: string): this {
        this.config.platform = platform;

        return this;
    }

    /**
     * Set Project
     *
     * Your project ID
     *
     * @param value string
     *
     * @return {this}
     */
    setProject(value: string): this {
        this.headers['X-Appwrite-Project'] = value;
        this.config.project = value;
        return this;
    }

    /**
     * Set JWT
     *
     * Your secret JSON Web Token
     *
     * @param value string
     *
     * @return {this}
     */
    setJWT(value: string): this {
        this.headers['X-Appwrite-JWT'] = value;
        this.config.jwt = value;
        return this;
    }

    /**
     * Set Locale
     *
     * @param value string
     *
     * @return {this}
     */
    setLocale(value: string): this {
        this.headers['X-Appwrite-Locale'] = value;
        this.config.locale = value;
        return this;
    }

    /**
     * Set Session
     *
     * The user session to authenticate with
     *
     * @param value string
     *
     * @return {this}
     */
    setSession(value: string): this {
        this.headers['X-Appwrite-Session'] = value;
        this.config.session = value;
        return this;
    }

    /**
     * Set DevKey
     *
     * Your secret dev API key
     *
     * @param value string
     *
     * @return {this}
     */
    setDevKey(value: string): this {
        this.headers['X-Appwrite-Dev-Key'] = value;
        this.config.devkey = value;
        return this;
    }

    /**
     * Set ImpersonateUserId
     *
     * Impersonate a user by ID on an already user-authenticated request. Requires
     * the current request to be authenticated as a user with impersonator
     * capability; X-Appwrite-Key alone is not sufficient. Impersonator users are
     * intentionally granted users.read so they can discover a target before
     * impersonation begins. Internal audit logs still attribute actions to the
     * original impersonator and record the impersonated target only in internal
     * audit payload data.
     *
     * @param value string
     *
     * @return {this}
     */
    setImpersonateUserId(value: string): this {
        this.headers['X-Appwrite-Impersonate-User-Id'] = value;
        this.config.impersonateuserid = value;
        return this;
    }

    /**
     * Set ImpersonateUserEmail
     *
     * Impersonate a user by email on an already user-authenticated request.
     * Requires the current request to be authenticated as a user with
     * impersonator capability; X-Appwrite-Key alone is not sufficient.
     * Impersonator users are intentionally granted users.read so they can
     * discover a target before impersonation begins. Internal audit logs still
     * attribute actions to the original impersonator and record the impersonated
     * target only in internal audit payload data.
     *
     * @param value string
     *
     * @return {this}
     */
    setImpersonateUserEmail(value: string): this {
        this.headers['X-Appwrite-Impersonate-User-Email'] = value;
        this.config.impersonateuseremail = value;
        return this;
    }

    /**
     * Set ImpersonateUserPhone
     *
     * Impersonate a user by phone on an already user-authenticated request.
     * Requires the current request to be authenticated as a user with
     * impersonator capability; X-Appwrite-Key alone is not sufficient.
     * Impersonator users are intentionally granted users.read so they can
     * discover a target before impersonation begins. Internal audit logs still
     * attribute actions to the original impersonator and record the impersonated
     * target only in internal audit payload data.
     *
     * @param value string
     *
     * @return {this}
     */
    setImpersonateUserPhone(value: string): this {
        this.headers['X-Appwrite-Impersonate-User-Phone'] = value;
        this.config.impersonateuserphone = value;
        return this;
    }


    private realtime: Realtime = {
        socket: undefined,
        timeout: undefined,
        heartbeat: undefined,
        url: '',
        subscriptions: new Map(),
        slotToSubscriptionId: new Map(),
        subscriptionIdToSlot: new Map(),
        pendingSubscribeSlots: [],
        subscriptionsCounter: 0,
        reconnect: true,
        reconnectAttempts: 0,
        lastMessage: undefined,
        connect: () => {
            clearTimeout(this.realtime.timeout);
            this.realtime.timeout = window?.setTimeout(() => {
                this.realtime.createSocket();
            }, 50);
        },
        getTimeout: () => {
            switch (true) {
                case this.realtime.reconnectAttempts < 5:
                    return 1000;
                case this.realtime.reconnectAttempts < 15:
                    return 5000;
                case this.realtime.reconnectAttempts < 100:
                    return 10_000;
                default:
                    return 60_000;
            }
        },
        createHeartbeat: () => {
            if (this.realtime.heartbeat) {
                clearTimeout(this.realtime.heartbeat);
            }

            this.realtime.heartbeat = window?.setInterval(() => {
                this.realtime.socket?.send(JSONbig.stringify({
                    type: 'ping'
                }));
            }, 20_000);
        },
        createSocket: () => {
            if (this.realtime.subscriptions.size < 1) {
                this.realtime.reconnect = false;
                this.realtime.socket?.close();
                return;
            }

            const channels = new URLSearchParams();
            channels.set('project', this.config.project);

            const url = this.config.endpointRealtime + '/realtime?' + channels.toString();

            if (
                url !== this.realtime.url || // Check if URL is present
                !this.realtime.socket || // Check if WebSocket has not been created
                this.realtime.socket?.readyState > WebSocket.OPEN // Check if WebSocket is CLOSING (3) or CLOSED (4)
            ) {
                if (
                    this.realtime.socket &&
                    this.realtime.socket?.readyState < WebSocket.CLOSING // Close WebSocket if it is CONNECTING (0) or OPEN (1)
                ) {
                    this.realtime.reconnect = false;
                    this.realtime.socket.close();
                }

                this.realtime.url = url;
                // @ts-ignore
                this.realtime.socket = new WebSocket(url, undefined, {
                    headers: {
                        Origin: `appwrite-${Platform.OS}://${this.config.platform}`
                    }
                });
                this.realtime.socket.addEventListener('message', this.realtime.onMessage);
                this.realtime.socket.addEventListener('open', _event => {
                    this.realtime.reconnectAttempts = 0;
                    this.realtime.createHeartbeat();
                });
                this.realtime.socket.addEventListener('close', event => {
                    if (
                        !this.realtime.reconnect ||
                        (
                            this.realtime?.lastMessage?.type === 'error' && // Check if last message was of type error
                            (<RealtimeResponseError>this.realtime?.lastMessage.data).code === 1008 // Check for policy violation 1008
                        )
                    ) {
                        this.realtime.reconnect = true;
                        return;
                    }

                    const timeout = this.realtime.getTimeout();
                    console.error(`Realtime got disconnected. Reconnect will be attempted in ${timeout / 1000} seconds.`, event.reason);

                    setTimeout(() => {
                        this.realtime.reconnectAttempts++;
                        this.realtime.createSocket();
                    }, timeout);
                })
            } else if (this.realtime.socket?.readyState === WebSocket.OPEN) {
                // URL is unchanged; re-send subscribe message to apply updated queries.
                this.realtime.sendSubscribeMessage();
            }
        },
        sendSubscribeMessage: () => {
            if (!this.realtime.socket || this.realtime.socket.readyState !== WebSocket.OPEN) {
                return;
            }

            const rows: RealtimeRequestSubscribe[] = [];
            this.realtime.pendingSubscribeSlots = [];

            this.realtime.subscriptions.forEach((sub, slot) => {
                const queries = sub.queries ?? [];

                const row: RealtimeRequestSubscribe = {
                    channels: sub.channels,
                    queries
                };
                const knownSubscriptionId = this.realtime.slotToSubscriptionId.get(slot);
                if (knownSubscriptionId) {
                    row.subscriptionId = knownSubscriptionId;
                }

                rows.push(row);
                this.realtime.pendingSubscribeSlots.push(slot);
            });

            if (rows.length < 1) {
                return;
            }

            this.realtime.socket.send(JSONbig.stringify(<RealtimeRequest>{
                type: 'subscribe',
                data: rows
            }));
        },
        onMessage: (event) => {
            try {
                const message: RealtimeResponse = JSONbig.parse(event.data);
                this.realtime.lastMessage = message;
                switch (message.type) {
                    case 'connected': {
                        const messageData = <RealtimeResponseConnected>message.data;

                        let session = this.config.session;
                        if (!session) {
                            const cookie = JSONbig.parse(window.localStorage.getItem('cookieFallback') ?? '{}');
                            session = cookie?.[`a_session_${this.config.project}`];
                        }
                        if (session && !messageData?.user) {
                            this.realtime.socket?.send(JSONbig.stringify(<RealtimeRequest>{
                                type: 'authentication',
                                data: {
                                    session
                                }
                            }));
                        }

                        this.realtime.sendSubscribeMessage();
                        break;
                    }
                    case 'response': {
                        const action = message.data as RealtimeResponseAction;
                        if (action?.to !== 'subscribe' || !Array.isArray(action.subscriptions)) {
                            break;
                        }

                        action.subscriptions.forEach((subscription, index) => {
                            const subscriptionId = subscription?.subscriptionId;
                            const slot = this.realtime.pendingSubscribeSlots[index];
                            if (!subscriptionId || slot === undefined) {
                                return;
                            }

                            this.realtime.slotToSubscriptionId.set(slot, subscriptionId);
                            this.realtime.subscriptionIdToSlot.set(subscriptionId, slot);
                        });
                        break;
                    }
                    case 'event':
                        const data = <RealtimeResponseEvent<unknown>>message.data;
                        if (data?.channels) {
                            if (data.subscriptions && data.subscriptions.length > 0) {
                                data.subscriptions.forEach((subscriptionId) => {
                                    const slot = this.realtime.subscriptionIdToSlot.get(subscriptionId);
                                    if (slot !== undefined) {
                                        const subscription = this.realtime.subscriptions.get(slot);
                                        if (subscription) {
                                            setTimeout(() => subscription.callback(data));
                                        }
                                    }
                                });
                            } else {
                                this.realtime.subscriptions.forEach(subscription => {
                                    if (data.channels.some(channel => subscription.channels.includes(channel))) {
                                        setTimeout(() => subscription.callback(data));
                                    }
                                });
                            }
                        }
                        break;
                    case 'pong':
                        break; // Handle pong response if needed
                    case 'error':
                        throw message.data;
                    default:
                        break;
                }
            } catch (e) {
                console.error(e);
            }
        }
    }

    /**
     * Subscribes to Appwrite events and passes you the payload in realtime.
     * 
     * @param {string|string[]} channels 
     * Channel to subscribe - pass a single channel as a string or multiple with an array of strings.
     * 
     * Possible channels are:
     * - account
     * - collections
     * - collections.[ID]
     * - collections.[ID].documents
     * - documents
     * - documents.[ID]
     * - files
     * - files.[ID]
     * - executions
     * - executions.[ID]
     * - functions.[ID]
     * - teams
     * - teams.[ID]
     * - memberships
     * - memberships.[ID]
     * @param {(payload: RealtimeMessage) => void} callback Is called on every realtime update.
     * @returns {() => void} Unsubscribes from events.
     */
    subscribe<T extends unknown>(
        channels: string | string[],
        callback: (payload: RealtimeResponseEvent<T>) => void,
        queries: (string | Query)[] = []
    ): () => void {
        let channelArray = typeof channels === 'string' ? [channels] : channels;

        const queryStrings = (queries ?? []).map(q => typeof q === 'string' ? q : q.toString());

        const counter = this.realtime.subscriptionsCounter++;
        this.realtime.subscriptions.set(counter, {
            channels: channelArray,
            queries: queryStrings,
            callback
        });

        this.realtime.connect();

        return () => {
            const subscriptionId = this.realtime.slotToSubscriptionId.get(counter);
            this.realtime.subscriptions.delete(counter);
            this.realtime.slotToSubscriptionId.delete(counter);
            if (subscriptionId) {
                this.realtime.subscriptionIdToSlot.delete(subscriptionId);
            }
            this.realtime.connect();
        }
    }

    async call(method: string, url: URL, headers: Headers = {}, params: Payload = {}, responseType = 'json'): Promise<any> {
        method = method.toUpperCase();

        headers = Object.assign({}, this.headers, headers);
        headers.Origin = `appwrite-${Platform.OS}://${this.config.platform}`

        let options: RequestInit = {
            method,
            headers,
        };

        if (headers['X-Appwrite-Dev-Key'] === undefined) {
            options.credentials = 'include';
        }

        if (method === 'GET') {
            for (const [key, value] of Object.entries(Service.flatten(params))) {
                url.searchParams.append(key, value);
            }
        } else {
            switch (headers['content-type']) {
                case 'application/json':
                    options.body = JSONbig.stringify(params);
                    break;

                case 'multipart/form-data':
                    let formData = new FormData();

                    for (const key in params) {
                        if (Array.isArray(params[key])) {
                            params[key].forEach((value: any) => {
                                formData.append(key + '[]', value);
                            })
                        } else {
                            formData.append(key, params[key]);
                        }
                    }

                    options.body = formData;
                    delete headers['content-type'];
                    break;
            }
        }

        try {
            let data = null;

            const response = await fetch(url.toString(), options);

            const warnings = response.headers.get('x-appwrite-warning');
            if (warnings) {
                warnings.split(';').forEach((warning: string) => console.warn('Warning: ' + warning));
            }

            if (response.headers.get('content-type')?.includes('application/json')) {
                data = JSONbig.parse(await response.text());
            } else if (responseType === 'arrayBuffer') {
                data = await response.arrayBuffer();
            } else {
                data = {
                    message: await response.text()
                };
            }

            if (400 <= response.status) {
                let responseText = '';
                if (response.headers.get('content-type')?.includes('application/json')) {
                    responseText = JSONbig.stringify(data);
                } else {
                    responseText = data?.message;
                }
                throw new AppwriteException(data?.message, response.status, data?.type, responseText);
            }

            const cookieFallback = response.headers.get('X-Fallback-Cookies');

            if (typeof window !== 'undefined' && window.localStorage && cookieFallback) {
                window.console.warn('Appwrite is using localStorage for session management. Increase your security by adding a custom domain as your API endpoint.');
                window.localStorage.setItem('cookieFallback', cookieFallback);
            }

            if (data && typeof data === 'object') {
                data.toString = () => JSONbig.stringify(data);
            }

            return data;
        } catch (e) {
            if (e instanceof AppwriteException) {
                throw e;
            }
            throw new AppwriteException((<Error>e).message);
        }
    }
}

export { Client, AppwriteException };
export type { Models, Payload };

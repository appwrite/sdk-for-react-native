import '../lib/polyfills';

import { Buffer } from 'buffer';
// The RN/Metro build of `mqtt` (dist/mqtt.esm.js, picked via the package's
// "react-native" export condition) exposes ONLY a default export — there is no
// named `MqttClient` at runtime, so importing it as a value yields undefined
// ("undefined cannot be used as a constructor"). Import the default and read the
// class off it; keep MqttClient as a type-only import (erased at runtime).
import mqtt, {
    type IClientOptions,
    type IConnackPacket,
    type IPublishPacket,
    type MqttClient,
} from 'mqtt';
import {
    AppState,
    NativeEventEmitter,
    NativeModules,
    Platform,
} from 'react-native';

import { Client } from '../client';
import { createTcpStream } from '../lib/tcp-stream';
import { Service } from '../service';
import type { ResolvedTopic, Topic } from '../topic';

/** A message delivered on a subscribed topic (the MQTT analog of a Realtime event). */
export interface PushMessage {
    topic: string;
    /** The payload decoded as UTF-8 text, as it was sent. */
    data: string;
    /** The raw payload, for binary messages. */
    payload: Buffer;
    qos: number;
}

export type MessageCallback = (message: PushMessage) => void | Promise<void>;

/** What Android background delivery can rely on; see {@link Push.backgroundStatus}. */
export interface PushBackgroundStatus {
    /** The app may schedule exact alarms (`SCHEDULE_EXACT_ALARM`, granted). */
    exactAlarms: boolean;
    /** The app is exempt from battery optimisation. */
    ignoringBatteryOptimizations: boolean;
    /** Foreground mode ({@link Push.setForeground}) keeps the connection open in a service. */
    foregroundService: boolean;
    /** Wake-ups may be deferred by Doze, so messages can arrive late while the app is closed. */
    bestEffort: boolean;
}

/** A background notification the user tapped. */
export interface PushNotificationOpened {
    /** The topic the message was published to. */
    topic: string;
    /** The `data` sent with the message (e.g. `createPush`), parsed; `{}` when it had none. */
    data: Record<string, unknown>;
}

/** Per-subscription options passed to `subscribe` and `PushSubscription.update`. */
export interface SubscribeOptions {
    /**
     * Keep receiving this subscription's messages while the app is backgrounded or closed,
     * posting a local notification per message. Defaults to false.
     *
     * On Android the SDK's native module (autolinked; it does not run in Expo Go) saves the
     * subscription and keeps delivering after the app is killed, the device restarts or the app
     * updates, until it is unsubscribed or {@link Push.close} is called: a scheduled job and
     * alarm wake the app every 15 to 60 seconds to reconnect, and the broker replays what was
     * sent in between (`retry`). {@link Push.setForeground} adds a foreground service for
     * immediate delivery. It reconnects with the credential saved at subscribe time, so use a
     * session rather than a short-lived JWT.
     *
     * Elsewhere it runs the connection in a background task via
     * `react-native-background-actions` and posts notifications via `expo-notifications`,
     * both peer dependencies.
     */
    background?: boolean;
    /** Notification title for this subscription's messages. Defaults to the message topic. */
    title?: string;
    /**
     * Also post the background notification while the app is on screen. Defaults to false:
     * while the app is visible it shows the message itself through the callback, so
     * notifications are posted only while it is backgrounded or closed.
     */
    notifyInForeground?: boolean;
    /**
     * Retry delivery of messages missed while disconnected. `true` (the default) subscribes
     * at QoS 1 so the broker holds this topic's messages and redelivers them on reconnect;
     * `false` uses QoS 0 (at-most-once, may be lost). Per-subscription — the connection
     * always keeps its session (clean start off).
     */
    retry?: boolean;
}

/**
 * Handle for a live subscription. `unsubscribe()` drops it (and closes the connection
 * once the last one is gone); `update()` toggles this subscription's background/title
 * without resubscribing.
 */
export interface PushSubscription {
    unsubscribe(): void;
    update(options: SubscribeOptions): void;
}

type AuthMethod = 'appwrite-jwt' | 'appwrite-session' | '';

// Fixed connection tuning — not exposed as options.
const KEEP_ALIVE_SECONDS = 60;
const RECONNECT_PERIOD_MS = 2000;

/**
 * Appwrite native push service — the Realtime analog over an MQTT broker, without
 * FCM or APNS. While the app is in the foreground the connection stays open and each
 * message is handed to your callback; a subscription can also opt into background
 * delivery (Android foreground service + local notification per message).
 *
 * The connection has no tunables — it always keeps its session (clean start off) so the
 * broker can redeliver missed messages, and reliability is chosen per subscription via
 * `retry`. TLS (and skipping cert verification via a `?tlsInsecure=true` query
 * flag) is derived from the endpoint URL, so the whole connection is described in one
 * place. `subscribe` opens the connection lazily and returns a {@link PushSubscription}
 * handle (unlike Realtime's bare
 * unsubscribe callable — Push carries per-subscription state). The credential is read off
 * the client — set a JWT or session on it (`Client.setJWT` / `Client.setSession`), the
 * same way every other service reads auth.
 *
 *     const client = new Client().setEndpoint(...).setProject(...).setJWT(jwt);
 *     const push = new Push(client);
 *     const sub = await push.subscribe('user/123/#', (m) =>
 *       console.log(m.topic, m.data),
 *     );
 *     // sub.update({ background: true }); sub.unsubscribe();
 */
export class Push extends Service {
    private readonly host: string;
    private readonly port: number;
    private readonly tls: boolean;
    private readonly tlsInsecure: boolean;

    private mqtt: MqttClient | null = null;
    private connecting: Promise<void> | null = null;
    /** Set once the first CONNACK lands, so 'connect' events after are reconnects. */
    private everConnected = false;

    /** Whether the background task (outside Android) is currently running. */
    private backgroundActive = false;

    /** The native Android module that hosts background delivery; null elsewhere. */
    private readonly native: NativePush | null = nativePush();
    /** Whether the subscriptions currently live on the native module's connection. */
    private nativeActive = false;
    private nativeOpen = false;
    /** Bumped when the subscriptions move to the native host, superseding an open() in flight. */
    private connectionEpoch = 0;
    /** Bumped by close(), so a subscribe that was waiting on a connection stops instead of reopening it. */
    private closeGeneration = 0;
    private nativeEvents: { remove(): void }[] | null = null;

    private onOpenCb?: () => void;
    private onCloseCb?: () => void;
    private onErrorCb?: (error: Error) => void;
    /** Errors already handed to onError, so one failure is reported once. */
    private reported = new WeakSet<Error>();
    /** mqtt.js connect errors mapped to the error handed out for them (see connectError). */
    private connectErrors = new WeakMap<Error, Error>();
    /** True while the first connect is in flight: its errors go to the waiting caller. */
    private opening = false;

    // Local id -> subscription state. The id is never sent to the broker; it only lets
    // the same topic carry more than one callback (each with its own options).
    /**
     * The client id when the credential names no user (and none was set): random, but kept for
     * this instance so reconnects resume the same broker session.
     */
    private readonly fallbackClientId = randomId();

    private cookieSession = '';
    private connectedKey = '';

    private readonly subscriptions = new Map<
        string,
        {
            topic: string;
            callback: MessageCallback;
            background: boolean;
            title?: string;
            notifyInForeground: boolean;
            qos: 0 | 1;
        }
    >();

    constructor(client: Client) {
        super(client);

        // The broker location comes from Client.setPushEndpoint() when set (e.g.
        // "mqtts://host:8883"), otherwise from the regular endpoint.
        let endpointHost = '';
        let endpointSecure = false;
        let endpointPort: number | null = null;
        let endpointInsecure = false;
        try {
            const url = new URL(
                client.config.endpointPush || client.config.endpoint || '',
            );
            endpointHost = url.hostname;
            endpointSecure = ['https:', 'wss:', 'mqtts:', 'ssl:'].includes(
                url.protocol,
            );
            // Take the port from the push endpoint only (a regular http/https endpoint's
            // port is the API port, not the broker's).
            endpointPort =
                client.config.endpointPush && url.port
                    ? Number(url.port)
                    : null;
            // Skip TLS cert verification (self-signed brokers / testing) via a query flag
            // on the push endpoint, e.g. "mqtts://host:8883?tlsInsecure=true" — so the
            // whole connection is described by one URL, not a second config knob.
            const insecure = url.searchParams.get('tlsInsecure');
            endpointInsecure = insecure === 'true' || insecure === '1';
        } catch {
            // leave defaults
        }

        // When no explicit push endpoint is set, default to a `push.` host on the regular
        // endpoint (mirroring how realtime derives from the endpoint, on the push subdomain).
        if (endpointHost && !client.config.endpointPush) {
            endpointHost = `push.${endpointHost}`;
        }
        this.host = endpointHost || 'localhost';
        // Secure by default: TLS on when the endpoint scheme is secure, so the credential
        // in the CONNECT packet is not sent over a plaintext socket.
        this.tls = endpointSecure;
        this.port = endpointPort ?? (this.tls ? 8883 : 1883);
        this.tlsInsecure = endpointInsecure;

        // Resume background delivery saved by an earlier run now, instead of at its next
        // scheduled wake-up, with the current session: a rotated session of the same user
        // replaces the saved one, and signed out (no session cookie) drops the saved
        // subscriptions.
        if (this.native) {
            this.resumeNative(this.native).catch((err) => this.report(err));
        }
    }

    // The broker subscription for a filter uses the highest QoS any local subscription on
    // it wants, so a QoS-0 subscription never downgrades a QoS-1 one sharing the filter.
    private effectiveQos(filter: string): 0 | 1 {
        for (const sub of this.subscriptions.values()) {
            if (sub.topic === filter && sub.qos === 1) {
                return 1;
            }
        }
        return 0;
    }

    /** Register a callback invoked when the connection opens (CONNACK success). */
    onOpen(callback: () => void): this {
        this.onOpenCb = callback;
        return this;
    }

    /** Register a callback invoked when the connection closes. */
    onClose(callback: () => void): this {
        this.onCloseCb = callback;
        return this;
    }

    /** Register a callback invoked on a connection error. */
    onError(callback: (error: Error) => void): this {
        this.onErrorCb = callback;
        // On Android, a refused credential that stopped background delivery while no callback
        // was registered is delivered now.
        this.native
            ?.setErrorCallback(true)
            .then((stopped) => {
                if (stopped) {
                    this.report(new Error(stopped));
                }
            })
            .catch((err) => this.report(err));
        return this;
    }

    /**
     * Android: run background delivery in a foreground service (with a quiet ongoing
     * notification), for immediate delivery even after the app is killed and during Doze,
     * instead of only the scheduled wake-ups. Saved, so it applies after restarts too. Call it
     * while the app is in the foreground: Android 12+ refuses to start the service from the
     * background. It only affects `background: true` subscriptions. A no-op elsewhere.
     */
    async setForeground(enabled: boolean): Promise<void> {
        await this.native?.setForeground(enabled);
    }

    /**
     * Android: what background delivery can rely on. When `bestEffort` is true the scheduled
     * wake-ups are inexact and Doze can defer them, so messages may arrive late while the app is
     * closed; explain why, then ask with {@link requestExactAlarms} or
     * {@link requestIgnoreBatteryOptimizations}. Null elsewhere.
     */
    async backgroundStatus(): Promise<PushBackgroundStatus | null> {
        const json = await this.native?.backgroundStatus();
        return json ? (JSON.parse(json) as PushBackgroundStatus) : null;
    }

    /**
     * Android 12+: open the system screen where the user allows exact alarms, for punctual
     * background wake-ups. Call it from a user action, never on its own. Resolves false when
     * there is nothing to ask: already allowed, older Android, the app does not declare
     * `SCHEDULE_EXACT_ALARM`, or not Android.
     */
    async requestExactAlarms(): Promise<boolean> {
        return (await this.native?.requestExactAlarms()) ?? false;
    }

    /**
     * Android: ask the user to exempt the app from battery optimisation. Call it from a user
     * action. Resolves false when there is nothing to ask: already exempt, the app does not
     * declare `REQUEST_IGNORE_BATTERY_OPTIMIZATIONS`, or not Android.
     */
    async requestIgnoreBatteryOptimizations(): Promise<boolean> {
        return (
            (await this.native?.requestIgnoreBatteryOptimizations()) ?? false
        );
    }

    /**
     * The background notification whose tap launched the app, or null. Call it once at startup:
     * on Android a tap is reported only once. Elsewhere it reads `expo-notifications`.
     *
     * ```ts
     * const opened = await push.getInitialNotification();
     * if (opened) openSale(opened.data.saleId);
     * ```
     */
    async getInitialNotification(): Promise<PushNotificationOpened | null> {
        if (Platform.OS === 'android') {
            const json = await this.native?.getInitialNotification();
            if (!json) {
                return null;
            }
            const opened = JSON.parse(json) as NativeOpened;
            return toOpened(opened.topic, opened.payload);
        }
        const notifications = expoNotifications();
        if (!notifications) {
            return null;
        }
        const response = await notifications.getLastNotificationResponseAsync();
        const opened = response ? openedFromExpo(response) : null;
        if (opened) {
            await notifications.clearLastNotificationResponseAsync?.();
        }
        return opened;
    }

    /**
     * Call [callback] each time the user taps a background notification while the app is
     * running, including in the background. Returns a function that stops listening. The tap
     * that launched the app comes from `getInitialNotification()` instead.
     *
     * ```ts
     * const stop = push.onNotificationOpened(({ data }) => openSale(data.saleId));
     * ```
     */
    onNotificationOpened(
        callback: (opened: PushNotificationOpened) => void,
    ): () => void {
        if (Platform.OS === 'android') {
            if (!this.native) {
                return () => undefined;
            }
            const native = this.native;
            const emitter = new NativeEventEmitter(native);
            const subscription = emitter.addListener(
                'AppwritePushOpened',
                (event: NativeOpened) =>
                    callback(toOpened(event.topic, event.payload)),
            );
            native.listenOpened(true).catch((err) => this.report(err));
            let listening = true;
            return () => {
                if (!listening) {
                    return;
                }
                listening = false;
                subscription.remove();
                native.listenOpened(false).catch((err) => this.report(err));
            };
        }
        const notifications = expoNotifications();
        if (!notifications) {
            return () => undefined;
        }
        const listener = (
            response: import('expo-notifications').NotificationResponse,
        ): void => {
            const opened = openedFromExpo(response);
            if (opened) {
                callback(opened);
            }
        };
        const subscription =
            notifications.addNotificationResponseReceivedListener(listener);
        return () => subscription.remove();
    }

    /**
     * The signed-in user's own topic, `users/<userId>`, for a topic-less subscribe. The id comes
     * from the credential the connection authenticates with: the JWT when one is set (never
     * the session, which could belong to a different user), else the session.
     */
    private userTopic(): string {
        const { jwt, session } = this.client.config;
        const userId = jwt
            ? userIdFromJwt(jwt)
            : userIdFromSession(session || this.cookieSession);
        if (!userId) {
            throw new Error(
                'subscribe() without a topic needs a signed-in user: set a JWT or session on the client',
            );
        }
        return `users/${userId}`;
    }

    /**
     * Hand an error to the onError callback, once per error. These errors happen outside any
     * call (reconnects, broker DISCONNECTs, background re-subscribes), so they are never
     * thrown, which would crash the app from inside mqtt.js: with no callback registered
     * they are logged, like Realtime does.
     */
    private report(error: unknown): void {
        if (error instanceof SupersededError) {
            // Internal: a connection superseded by the native host, not a failure.
            return;
        }
        const err = toError(error);
        if (this.reported.has(err)) {
            return;
        }
        this.reported.add(err);
        if (!this.onErrorCb) {
            console.error('Appwrite Push error:', err);
            return;
        }
        try {
            this.onErrorCb(err);
        } catch (callbackError) {
            console.error('Appwrite Push onError threw:', callbackError);
        }
    }

    /**
     * For a call that fails to its caller: report the error to onError when a callback is
     * registered, then throw it to the caller, who can catch it.
     */
    private fail(error: unknown): never {
        const err = toError(error);
        if (this.onErrorCb) {
            this.report(err);
        }
        throw err;
    }

    // --- realtime-like API ---

    /**
     * Subscribe to one or more topics. Resolves to a {@link PushSubscription} handle.
     *
     * Each topic is a string or a `Topic` builder, e.g.
     * `Topic.path(['user', userId]).all()`.
     *
     * Called with only a callback, `subscribe((message) => {...}, options)` subscribes to the
     * signed-in user's own topic, `users/<userId>`, like FCM/APNs delivery to a device. The
     * user id is read from the JWT (or session) set on the client. This form defaults to
     * `background: true` and `retry: true` (QoS 1); pass either in the options to override.
     * The default falls back to foreground delivery when background delivery is unavailable
     * (no native module on Android, e.g. Expo Go; the peer dependencies elsewhere); an explicit
     * `background: true` still requires it, and any other background startup failure is thrown.
     *
     * Awaiting resolves only once the broker has acked every SUBSCRIBE (SUBACK):
     * the broker only starts routing a topic once its subscription is registered,
     * so publishing before the ack races the message ahead of the subscription and
     * it is dropped (no retained replay on MQTT). Awaiting here makes
     * subscribe-then-publish reliable.
     *
     * Pass `{ background: true, title }` to also keep receiving while backgrounded and
     * post a notification per matching message, and `{ retry: false }` for
     * at-most-once (QoS 0) delivery; toggle either later with the handle's `update`.
     */
    subscribe(
        callback: MessageCallback,
        options?: SubscribeOptions,
    ): Promise<PushSubscription>;
    subscribe(
        topics:
            string | Topic | ResolvedTopic | (string | Topic | ResolvedTopic)[],
        callback: MessageCallback,
        options?: SubscribeOptions,
    ): Promise<PushSubscription>;
    async subscribe(
        topicsOrCallback:
            | string
            | Topic
            | ResolvedTopic
            | (string | Topic | ResolvedTopic)[]
            | MessageCallback,
        callbackOrOptions?: MessageCallback | SubscribeOptions,
        topicOptions: SubscribeOptions = {},
    ): Promise<PushSubscription> {
        // Every failure reaches onError (when registered) and is thrown to the caller.
        try {
            return await this.subscribeWith(
                topicsOrCallback,
                callbackOrOptions,
                topicOptions,
            );
        } catch (err) {
            this.fail(err);
        }
    }

    private async subscribeWith(
        topicsOrCallback:
            | string
            | Topic
            | ResolvedTopic
            | (string | Topic | ResolvedTopic)[]
            | MessageCallback,
        callbackOrOptions: MessageCallback | SubscribeOptions | undefined,
        topicOptions: SubscribeOptions,
    ): Promise<PushSubscription> {
        const generation = this.closeGeneration;
        await this.loadCookieSession();
        this.throwIfClosedSince(generation);
        // Topic-less form: subscribe(callback, options) targets the signed-in user's topic.
        const userForm = typeof topicsOrCallback === 'function';
        const topics = userForm ? this.userTopic() : topicsOrCallback;
        const callback = (
            userForm ? topicsOrCallback : callbackOrOptions
        ) as MessageCallback;
        const options = (
            userForm ? (callbackOrOptions ?? {}) : topicOptions
        ) as SubscribeOptions;
        const topicList = (Array.isArray(topics) ? topics : [topics]).map(
            (topic) => topic.toString(),
        );
        // The user topic defaults to background delivery, like FCM/APNs; topics default off.
        let background = options.background ?? userForm;
        const qos: 0 | 1 = (options.retry ?? true) ? 1 : 0;
        livePushes.add(this);

        // Only an explicit `background: true` requires background delivery: when background is
        // just the user topic's default and it is unavailable, deliver in the foreground
        // instead. Any other background startup failure still throws.
        if (
            background &&
            options.background === undefined &&
            !this.backgroundAvailable()
        ) {
            background = false;
        }

        if (background && Platform.OS === 'android' && !this.native) {
            throw new Error(
                "background delivery needs the SDK's native Android module: rebuild the app " +
                    '(native modules do not run in Expo Go)',
            );
        }

        // Android: the native module hosts the connection while any subscription, live or saved
        // by an earlier run, wants background. Two connections with the same client id would
        // take over each other's broker session, so every subscription, of every Push, moves
        // there.
        if (
            this.native &&
            (background ||
                nativeHosts.size > 0 ||
                (await this.native.hasSaved()))
        ) {
            this.throwIfClosedSince(generation);
            const ids = topicList.map((topic) => {
                const id = randomId();
                this.subscriptions.set(id, {
                    topic,
                    callback,
                    background,
                    title: options.title,
                    notifyInForeground: options.notifyInForeground ?? false,
                    qos,
                });
                return id;
            });
            try {
                await this.hostNative();
            } catch (err) {
                for (const id of ids) {
                    this.subscriptions.delete(id);
                }
                await this.reconcileNative();
                throw err;
            }
            return this.handle(ids);
        }

        // Start the background task before connecting so a missing peer dependency surfaces a
        // clear error up front, matching the connection failure path.
        if (background) {
            await this.startBackground();
        }
        this.throwIfClosedSince(generation);

        let client: MqttClient;
        try {
            client = await this.connect();
        } catch (err) {
            // Another Push moved this one's subscriptions to the native host meanwhile: this
            // subscribe goes there too.
            if (err instanceof SupersededError) {
                this.throwIfClosedSince(generation);
                return this.subscribeWith(
                    topicsOrCallback,
                    callbackOrOptions,
                    topicOptions,
                );
            }
            throw err;
        }
        const epoch = this.connectionEpoch;

        const ids: string[] = [];
        const acks: Promise<void>[] = [];
        for (const topic of topicList) {
            const id = randomId();
            ids.push(id);
            this.subscriptions.set(id, {
                topic,
                callback,
                background,
                title: options.title,
                notifyInForeground: options.notifyInForeground ?? false,
                qos,
            });
            acks.push(
                new Promise<void>((resolve, reject) => {
                    client.subscribe(
                        topic,
                        { qos: this.effectiveQos(topic) },
                        (err) => (err ? reject(err) : resolve()),
                    );
                }),
            );
        }

        // If any topic's subscribe fails, roll this call's registrations back (and drop
        // any now-unused broker filter) so a failed subscribe leaks no callback, then rethrow.
        try {
            await Promise.all(acks);
        } catch (err) {
            // Another Push moved this one's subscriptions to the native host while it waited for
            // SUBACK, which closed the connection: this subscribe continues there.
            if (this.nativeActive) {
                try {
                    await this.hostNative();
                } catch (hostErr) {
                    for (const id of ids) {
                        this.subscriptions.delete(id);
                    }
                    await this.reconcileNative();
                    throw hostErr;
                }
                return this.handle(ids);
            }
            if (epoch !== this.connectionEpoch) {
                for (const id of ids) {
                    this.subscriptions.delete(id);
                }
                this.throwIfClosedSince(generation);
                return this.subscribeWith(
                    topicsOrCallback,
                    callbackOrOptions,
                    topicOptions,
                );
            }
            this.unsubscribeInProcess(ids);
            throw err;
        }

        return this.handle(ids);
    }

    /**
     * The handle for a subscribe call's subscriptions. Each call goes to wherever they live now:
     * they move to the native module (Android) when a background subscription is added later,
     * and back when none is left.
     */
    private handle(ids: string[]): PushSubscription {
        return {
            unsubscribe: () =>
                this.nativeActive
                    ? this.unsubscribeNative(ids)
                    : this.unsubscribeInProcess(ids),
            update: (next: SubscribeOptions) =>
                this.nativeActive
                    ? this.updateNative(ids, next)
                    : this.updateInProcess(ids, next),
        };
    }

    private unsubscribeInProcess(ids: string[]): void {
        // Filters whose removed sub was QoS 1: their effective QoS may now drop.
        const maybeDowngrade = new Set<string>();
        for (const id of ids) {
            const entry = this.subscriptions.get(id);
            this.subscriptions.delete(id);
            if (entry?.qos === 1) {
                maybeDowngrade.add(entry.topic);
            }
            // Only unsubscribe the broker filter once its last local callback is gone.
            const stillUsed = [...this.subscriptions.values()].some(
                (s) => s.topic === entry?.topic,
            );
            const connection = this.mqtt;
            if (entry && connection && !stillUsed) {
                connection.unsubscribe(entry.topic, (err) => {
                    // Closing the connection (the last subscription is gone) fails its
                    // in-flight requests on purpose; that is not an error to report.
                    if (err && this.mqtt === connection) {
                        this.report(err);
                    }
                });
            }
        }
        // A filter that lost its last QoS-1 sub but still has QoS-0 subs must be
        // re-SUBSCRIBEd at the lower QoS, or the broker keeps replaying to at-most-once subs.
        for (const filter of maybeDowngrade) {
            const stillUsed = [...this.subscriptions.values()].some(
                (s) => s.topic === filter,
            );
            if (stillUsed && this.effectiveQos(filter) === 0) {
                this.mqtt?.subscribe(filter, { qos: 0 }, (err) => {
                    if (err) {
                        this.report(err);
                    }
                });
            }
        }
        if (this.subscriptions.size === 0) {
            this.teardown();
        } else {
            // A removed sub may have been the last background one.
            this.syncBackground();
        }
    }

    private updateInProcess(ids: string[], next: SubscribeOptions): void {
        const changedFilters = new Set<string>();
        // Remember the pre-update QoS per id so a rejected re-SUBSCRIBE can be rolled back.
        const previous = new Map<string, 0 | 1>();
        for (const id of ids) {
            const entry = this.subscriptions.get(id);
            if (!entry) {
                continue;
            }
            if (next.background !== undefined) {
                entry.background = next.background;
            }
            if (next.title !== undefined) {
                entry.title = next.title;
            }
            if (next.notifyInForeground !== undefined) {
                entry.notifyInForeground = next.notifyInForeground;
            }
            if (next.retry !== undefined) {
                const q: 0 | 1 = next.retry ? 1 : 0;
                if (q !== entry.qos) {
                    previous.set(id, entry.qos);
                    entry.qos = q;
                    changedFilters.add(entry.topic);
                }
            }
        }
        // Re-SUBSCRIBE the affected filters at their new effective QoS (a SUBSCRIBE to an
        // existing filter just updates its QoS — no unsubscribe gap). If the broker rejects
        // it, the old subscription still stands, so restore the local QoS to match and
        // surface the error rather than silently assuming the change took effect.
        for (const filter of changedFilters) {
            this.mqtt?.subscribe(
                filter,
                { qos: this.effectiveQos(filter) },
                (err) => {
                    if (!err) {
                        return;
                    }
                    for (const [id, q] of previous) {
                        const entry = this.subscriptions.get(id);
                        if (entry && entry.topic === filter) {
                            entry.qos = q;
                        }
                    }
                    this.report(err);
                },
            );
        }
        // Turning background on moves the subscriptions to the native module on Android.
        this.syncBackground();
    }

    private unsubscribeNative(ids: string[]): void {
        for (const id of ids) {
            this.subscriptions.delete(id);
        }
        this.reconcileNative().catch((err) => this.report(err));
    }

    private updateNative(ids: string[], next: SubscribeOptions): void {
        for (const id of ids) {
            const entry = this.subscriptions.get(id);
            if (!entry) {
                continue;
            }
            if (next.background !== undefined) {
                entry.background = next.background;
            }
            if (next.title !== undefined) {
                entry.title = next.title;
            }
            if (next.notifyInForeground !== undefined) {
                entry.notifyInForeground = next.notifyInForeground;
            }
            if (next.retry !== undefined) {
                entry.qos = next.retry ? 1 : 0;
            }
        }
        this.reconcileNative().catch((err) => this.report(err));
    }

    /** After an in-process change: the native module on Android, the background task elsewhere. */
    private syncBackground(): void {
        if (this.native) {
            this.reconcileNative().catch((err) => this.report(err));
        } else {
            this.syncBackgroundService();
        }
    }

    /** Whether background delivery can run: the native module on Android, the peers elsewhere. */
    private backgroundAvailable(): boolean {
        return Platform.OS === 'android'
            ? this.native !== null
            : backgroundPeersInstalled();
    }

    /**
     * Host every subscription of every Push on the native module's connection, closing this
     * one's in-process connection. Resolves once the connection is up and every filter is
     * subscribed (SUBACK), or rejects with why not.
     */
    private hostNative(): Promise<void> {
        const native = this.native!;
        const key = this.credentialKey();
        // The native host carries one connection, so it serves one credential: instances hosted
        // for another move back to their own connection. Instances with this credential share
        // its client id, so their in-process connections would take over the broker session:
        // they move to the native host too.
        for (const push of nativeHosts) {
            if (push.credentialKey() !== key) {
                push.leaveToInProcess();
                if (push.hasBackgroundSubs()) {
                    push.report(new Error(BACKGROUND_DISPLACED));
                }
            }
        }
        // Once moved, they stay: if hosting fails, the native host keeps their subscriptions and
        // retries on its scheduled runs, and a second connection with the same client id would
        // take over its broker session.
        for (const push of livePushes) {
            if (push.subscriptions.size > 0 && push.credentialKey() === key) {
                push.joinNative(native);
            }
        }
        this.joinNative(native);
        // Instances that joined an open connection hear onOpen now; the others when it opens.
        return enqueueNative(() => this.sendToNative(native)).then((open) => {
            if (open) {
                for (const push of nativeHosts) {
                    push.nativeConnection(true);
                }
            }
        });
    }

    /** This Push's view of the native host's connection, reported once per change. */
    private nativeConnection(open: boolean): void {
        if (!this.nativeActive || this.nativeOpen === open) {
            return;
        }
        this.nativeOpen = open;
        if (open) {
            this.onOpenCb?.();
        } else {
            this.onCloseCb?.();
        }
    }

    /**
     * Host every native host's subscriptions with this Push's credential. Resolves with whether
     * the connection is open (false when there was nothing to host).
     */
    private async sendToNative(native: NativePush): Promise<boolean> {
        // Host what is subscribed when this runs, so a close() or an unsubscribe queued
        // meanwhile is not undone by an older request.
        const subscriptions = [...nativeHosts].flatMap((push) =>
            push.nativeEntries(),
        );
        if (subscriptions.length === 0) {
            return false;
        }
        if ([...nativeHosts].some((push) => push.hasBackgroundSubs())) {
            requestNotificationPermission();
        }
        const { authMethod, credential } = this.credential();
        const config = {
            host: this.host,
            port: this.port,
            tls: this.tls,
            tlsInsecure: this.tlsInsecure,
            clientId: this.client.config.pushClientId || '',
            authMethod,
            credential,
            project: this.client.config.project ?? '',
            // A session from the cookie store: background runs re-read it there, so they follow
            // a rotated session while no JS runs.
            sessionCookieUrl:
                credential === this.cookieSession && !this.client.config.jwt
                    ? (this.client.config.endpoint ?? '')
                    : '',
        };
        await native.setErrorCallback(
            [...nativeHosts].some((push) => push.onErrorCb !== undefined),
        );
        const open = await native.host(
            JSON.stringify(config),
            JSON.stringify(subscriptions),
        );
        return open === true;
    }

    /** Move this Push's subscriptions onto the native host, closing its own connection. */
    private joinNative(native: NativePush): void {
        // An open() still in flight sees this and closes what it opened.
        this.connectionEpoch++;
        if (this.mqtt) {
            this.mqtt.end(true);
            this.mqtt = null;
        }
        this.connecting = null;
        this.everConnected = false;
        this.listenNative(native);
        nativeHosts.add(this);
        if (!this.nativeActive) {
            this.nativeOpen = false;
        }
        this.nativeActive = true;
    }

    /** Move this Push's subscriptions back onto its own connection. */
    private leaveToInProcess(): void {
        nativeHosts.delete(this);
        this.nativeActive = false;
        this.connect()
            .then(() => this.resubscribeAll())
            .catch((err) => this.report(err));
    }

    /** Identifies the connection this Push authenticates: one native host serves one. */
    private credentialKey(): string {
        try {
            const { authMethod, credential } = this.credential();
            return [
                this.host,
                this.port,
                this.client.config.project ?? '',
                this.client.config.pushClientId ?? '',
                authMethod,
                credential,
            ].join('|');
        } catch {
            return '';
        }
    }

    /** This Push's subscriptions in the native module's format. */
    private nativeEntries(): object[] {
        return [...this.subscriptions].map(([id, sub]) => ({
            id,
            topic: sub.topic,
            background: sub.background,
            title: sub.title ?? null,
            retry: sub.qos === 1,
            notifyInForeground: sub.notifyInForeground,
        }));
    }

    /**
     * After an unsubscribe or update: keep the native module hosting while any subscription,
     * live (of any Push) or saved, wants background, else move the live ones back in-process.
     */
    private async reconcileNative(): Promise<void> {
        const native = this.native;
        if (!native) {
            return;
        }
        if (this.subscriptions.size === 0) {
            // This Push has nothing left; saved subscriptions keep delivering in the background.
            if (this.nativeActive) {
                await this.leaveNative(native);
            }
            return;
        }
        const wanted =
            [...nativeHosts, this].some((push) => push.hasBackgroundSubs()) ||
            (await native.hasSaved());
        if (wanted) {
            await this.hostNative();
            return;
        }
        // Nothing wants background: every Push moves back to its own connection.
        const hosts = [...nativeHosts];
        nativeHosts.clear();
        for (const push of hosts) {
            push.nativeActive = false;
        }
        await enqueueNative(() => native.release());
        for (const push of hosts) {
            if (push.subscriptions.size > 0) {
                await push.connect();
                push.resubscribeAll();
            }
        }
    }

    /** Stop hosting this Push natively; the others' subscriptions stay hosted. */
    private leaveNative(native: NativePush): Promise<void> {
        nativeHosts.delete(this);
        this.nativeActive = false;
        const [other] = nativeHosts;
        return other
            ? other.hostNative()
            : enqueueNative(() => native.release());
    }

    /**
     * Route the native module's messages to their subscriptions, and its errors to onError. A
     * message is acknowledged once its callback has run, as on the in-process connection.
     */
    private listenNative(native: NativePush): void {
        if (this.nativeEvents) {
            return;
        }
        const emitter = new NativeEventEmitter(native);
        this.nativeEvents = [
            emitter.addListener(
                'AppwritePushMessage',
                (event: NativeMessage) => {
                    const sub = this.subscriptions.get(event.id);
                    if (!sub) {
                        return;
                    }
                    const payload = Buffer.from(event.payload, 'base64');
                    const message: PushMessage = {
                        topic: event.topic,
                        data: payload.toString('utf8'),
                        payload,
                        qos: event.qos,
                    };
                    Promise.resolve()
                        .then(() => sub.callback(message))
                        .catch((err) => this.report(err))
                        .finally(() => native.ack(event.ackToken));
                },
            ),
            emitter.addListener(
                'AppwritePushError',
                (event: { message: string }) =>
                    this.report(new Error(event.message)),
            ),
            emitter.addListener(
                'AppwritePushConnection',
                (event: { connected: boolean }) =>
                    this.nativeConnection(event.connected),
            ),
        ];
    }

    /**
     * Tear down the connection and drop all subscriptions. On Android, closing the last Push
     * that uses background delivery also stops it, including subscriptions saved by an earlier
     * run: call it on sign-out. While other Push instances still use it, it keeps delivering
     * their subscriptions and the saved ones.
     */
    close(): void {
        this.connectionEpoch++;
        this.closeGeneration++;
        this.teardown();
        const native = this.native;
        if (!native) {
            return;
        }
        nativeHosts.delete(this);
        this.nativeActive = false;
        this.nativeEvents?.forEach((subscription) => subscription.remove());
        this.nativeEvents = null;
        const [other] = nativeHosts;
        if (other) {
            other.hostNative().catch((err) => other.report(err));
            return;
        }
        enqueueNative(() => native.stop()).catch((err) => this.report(err));
    }

    /** Close the in-process connection and drop the live subscriptions. */
    private teardown(): void {
        livePushes.delete(this);
        if (this.mqtt) {
            this.mqtt.end(true);
            this.mqtt = null;
        }
        this.connecting = null;
        this.everConnected = false;
        this.subscriptions.clear();
        this.stopBackground();
    }

    /** Throws once close() has run since `generation` was read, so a subscribe started before it stops. */
    private throwIfClosedSince(generation: number): void {
        if (generation !== this.closeGeneration) {
            throw closedError();
        }
    }

    /** True while any live subscription has opted into background delivery. */
    private hasBackgroundSubs(): boolean {
        for (const sub of this.subscriptions.values()) {
            if (sub.background) {
                return true;
            }
        }
        return false;
    }

    // Reconcile the reference-counted foreground service with whether any live
    // subscription still wants background delivery.
    private syncBackgroundService(): void {
        const want = this.hasBackgroundSubs();
        if (want && !this.backgroundActive) {
            this.startBackground().catch((err) => this.report(err));
        } else if (!want && this.backgroundActive) {
            this.stopBackground();
        }
    }

    /** Stop the Android foreground service if it is running (no-op otherwise). */
    private stopBackground(): void {
        if (!this.backgroundActive) {
            return;
        }
        this.backgroundActive = false;
        try {
            /* eslint-disable @typescript-eslint/no-require-imports */
            const backgroundActions: typeof import('react-native-background-actions').default =
                require('react-native-background-actions').default;
            /* eslint-enable @typescript-eslint/no-require-imports */
            backgroundActions.stop().catch((err) => this.report(err));
        } catch {
            // not installed or already stopped
        }
    }

    /**
     * Start the Android foreground service (keeps the process alive so the in-process
     * MQTT socket keeps delivering) and request notification permission. No-op after
     * the first call.
     */
    private async startBackground(): Promise<void> {
        if (this.backgroundActive) {
            return;
        }
        this.backgroundActive = true;
        try {
            /* eslint-disable @typescript-eslint/no-require-imports */
            const notifications: typeof import('expo-notifications') = require('expo-notifications');
            const backgroundActions: typeof import('react-native-background-actions').default =
                require('react-native-background-actions').default;
            /* eslint-enable @typescript-eslint/no-require-imports */
            await notifications.requestPermissionsAsync();
            await notifications.setNotificationChannelAsync('appwrite-push', {
                name: 'Notifications',
                importance: notifications.AndroidImportance.HIGH,
            });
            if (!backgroundActions.isRunning()) {
                await backgroundActions.start(
                    // The MQTT client runs in this same JS context; the task only has to
                    // stay pending to keep the foreground service (and process) alive.
                    () => new Promise<void>(() => undefined),
                    {
                        taskName: 'appwritePush',
                        taskTitle: 'Appwrite',
                        taskDesc: 'Listening for messages',
                        // taskIcon is required by react-native-background-actions — without
                        // it start() throws "Task icon not found". ic_launcher/mipmap exists
                        // in every Expo/RN Android app, so it is a safe default.
                        taskIcon: { name: 'ic_launcher', type: 'mipmap' },
                        // Match the dataSync foregroundServiceType the config plugin injects
                        // into the manifest, so the service is valid on Android 14+.
                        foregroundServiceType: ['dataSync'],
                    },
                );
            }
        } catch (err) {
            this.backgroundActive = false;
            // Surface the real failure (e.g. a missing taskIcon, or a missing peer module)
            // instead of assuming it is always a missing dependency.
            const detail = err instanceof Error ? err.message : String(err);
            throw new Error(
                `background delivery failed to start: ${detail} (it needs the ` +
                    '"react-native-background-actions" and "expo-notifications" peer ' +
                    'dependencies)',
                { cause: err },
            );
        }
    }

    /** Post a local notification for a message a background subscription matched. */
    private async notify(message: PushMessage, title: string): Promise<void> {
        try {
            /* eslint-disable @typescript-eslint/no-require-imports */
            const notifications: typeof import('expo-notifications') = require('expo-notifications');
            /* eslint-enable @typescript-eslint/no-require-imports */
            const content = notificationContent(message);
            const raw = !content.present;
            await notifications.scheduleNotificationAsync({
                content: {
                    title: content.title ?? title,
                    body: content.body ?? (raw ? message.data : null),
                    data: { topic: message.topic, payload: message.data },
                },
                trigger: null,
            });
        } catch {
            // expo-notifications not installed; skip.
        }
    }

    /**
     * Re-register every active subscription. Called on each reconnect: with
     * a fresh (or cleared) session the broker keeps no subscriptions, so a reconnected client starts with
     * zero subscriptions and would otherwise silently stop receiving.
     */
    private resubscribeAll(): void {
        const client = this.mqtt;
        if (!client) {
            return;
        }
        const filters = new Set(
            [...this.subscriptions.values()].map((s) => s.topic),
        );
        for (const filter of filters) {
            client.subscribe(
                filter,
                { qos: this.effectiveQos(filter) },
                (err) => {
                    if (err) {
                        this.report(err);
                    }
                },
            );
        }
    }

    // --- internals ---

    private connect(): Promise<MqttClient> {
        if (
            (this.mqtt || this.connecting) &&
            this.connectedKey !== this.credentialKey()
        ) {
            this.connectionEpoch++;
            this.mqtt?.end(true);
            this.mqtt = null;
            this.connecting = null;
            this.everConnected = this.subscriptions.size > 0;
        }
        if (this.mqtt && !this.connecting) {
            return Promise.resolve(this.mqtt);
        }
        if (!this.connecting) {
            const connecting = this.open();
            this.connecting = connecting;
            // A failed open must not poison future attempts — clear the cached
            // in-flight promise so a later subscribe/publish can retry.
            connecting.catch(() => {
                if (this.connecting === connecting) {
                    this.connecting = null;
                }
            });
        }
        return this.connecting.then(() => this.mqtt!);
    }

    /**
     * Resume saved native delivery with the current credential. Only a cookie lookup that
     * succeeded and found no session counts as signed out; a failed or impossible lookup keeps
     * the saved subscriptions.
     */
    private async resumeNative(native: NativePush): Promise<void> {
        const { jwt, session, endpoint, project } = this.client.config;
        let signedOut = false;
        if (!jwt && !session) {
            const lookup = await lookupSessionCookie(endpoint, project);
            this.cookieSession = lookup.session;
            signedOut = lookup.found === false;
        }
        const current = this.currentCredential();
        await native.resume(
            current?.authMethod ?? null,
            current?.credential ?? null,
            signedOut,
        );
    }

    private async loadCookieSession(): Promise<void> {
        const { jwt, session, endpoint, project } = this.client.config;
        if (jwt || session) {
            return;
        }
        this.cookieSession = await sessionCookie(endpoint, project);
    }

    /** The credential the connection would use, or null when there is none. */
    private currentCredential(): {
        authMethod: AuthMethod;
        credential: string;
    } | null {
        try {
            return this.credential();
        } catch {
            return null;
        }
    }

    /** The credential set on the client (via Client.setJWT / setSession). */
    private credential(): { authMethod: AuthMethod; credential: string } {
        if (this.client.config.jwt) {
            return {
                authMethod: 'appwrite-jwt',
                credential: this.client.config.jwt,
            };
        }
        const session = this.client.config.session || this.cookieSession;
        if (session) {
            return {
                authMethod: 'appwrite-session',
                credential: session,
            };
        }
        throw new Error(
            'No credential set on the client; call Client.setJWT() or Client.setSession() first.',
        );
    }

    private async open(): Promise<void> {
        const { authMethod, credential } = this.credential();
        this.connectedKey = this.credentialKey();
        const epoch = this.connectionEpoch;

        const project = this.client.config.project ?? '';
        // Client id, when the app did not set one with Client.setPushClientId(). Unlike the
        // native SDKs (which send an empty id and let the broker derive a stable one), mqtt.js
        // rejects an empty id with clean start off, so derive a stable per-user id here from the
        // credential this connection authenticates with: the JWT's userId, or the session's user
        // id. A stable id keeps the broker's replay cursor resuming across restarts. The
        // credential itself is never used as the id.
        // On Android the native module's per-user-and-install id is used, so this connection
        // and the background one share the broker session.
        const clientId =
            this.client.config.pushClientId ||
            (this.native
                ? await this.native.defaultClientId(authMethod, credential)
                : (authMethod === 'appwrite-jwt'
                      ? userIdFromJwt(credential)
                      : userIdFromSession(credential)) ||
                  this.fallbackClientId);
        // The subscriptions moved to the native host while this was waiting: its connection
        // would share the host's client id and take over the broker session.
        if (epoch !== this.connectionEpoch) {
            throw new SupersededError();
        }

        const options: IClientOptions = {
            clientId,
            protocolVersion: 5,
            clean: false, // always keep the session so the broker can replay QoS-1 topics
            keepalive: KEEP_ALIVE_SECONDS,
            reconnectPeriod: RECONNECT_PERIOD_MS,
            manualConnect: true,
            // Enhanced auth carried in CONNECT properties.
            properties: {
                authenticationMethod: authMethod,
                authenticationData: Buffer.from(credential),
                userProperties: { projectId: project },
            },
            // Ack QoS 1 deliveries by hand, after the callback has processed the
            // message. On the broker a subscriber's PUBACK is what advances its replay
            // cursor, so acking automatically on arrival — before the callback runs —
            // would advance past a message a failing callback never actually handled.
            customHandleAcks: (_topic, _message, packet, cb) => {
                this.dispatch(packet as IPublishPacket)
                    // cb(0): send the PUBACK now that the callback has processed it.
                    .then(() => cb(0))
                    // On failure, do not ack: the message stays unacked and the broker
                    // replays it on reconnect (at-least-once).
                    .catch((err) => {
                        this.report(err);
                        cb(toError(err));
                    });
            },
        };

        // Raw TCP only: build the transport from a native socket, never a WebSocket.
        const client = new mqtt.MqttClient(
            () =>
                createTcpStream({
                    host: this.host,
                    port: this.port,
                    tls: this.tls,
                    tlsInsecure: this.tlsInsecure,
                }),
            options,
        );
        this.mqtt = client;

        // Dispatch QoS 0 deliveries (which never reach customHandleAcks). QoS 1/2 are
        // dispatched from customHandleAcks; ignore them here to avoid a double dispatch.
        client.on('message', (_topic, _payload, packet) => {
            if (packet.qos === 0) {
                this.dispatch(packet).catch((err) => this.report(err));
            }
        });

        // Persistent lifecycle listeners. On a reconnect the broker has no session for
        // us on a cleared session, so we must re-register every subscription.
        client.on('connect', () => {
            if (this.everConnected) {
                this.resubscribeAll();
            }
            this.everConnected = true;
            this.onOpenCb?.();
        });
        client.on('close', () => this.onCloseCb?.());
        // The broker explains a refused CONNECT (CONNACK) or a server-initiated DISCONNECT
        // with an MQTT 5 Reason String. mqtt.js reports only the reason code, so capture the
        // string off the packet (packetreceive fires before mqtt.js handles it) and hand it
        // to onError as the error message.
        let refusedReason: string | undefined;
        client.on('packetreceive', (packet) => {
            if (packet.cmd === 'connack') {
                refusedReason =
                    (packet.reasonCode ?? 0) !== 0
                        ? packet.properties?.reasonString
                        : undefined;
            }
        });
        // A persistent error listener also prevents mqtt.js from throwing on
        // post-connect errors once the one-shot handler below is removed.
        client.on('error', (err) => {
            if (epoch !== this.connectionEpoch) {
                return;
            }
            const error = this.connectError(err, refusedReason);
            // While the first connect is pending its caller receives the error (and reports it
            // through fail()); afterwards, e.g. on reconnect, report it here.
            if (!this.opening) {
                this.report(error);
            }
        });
        client.on('disconnect', (packet) => {
            if ((packet.reasonCode ?? 0) !== 0) {
                this.report(
                    new Error(
                        packet.properties?.reasonString ??
                            `Disconnected by the broker (reason ${packet.reasonCode})`,
                    ),
                );
            }
        });

        this.opening = true;
        await new Promise<void>((resolve, reject) => {
            const onConnect = (packet: IConnackPacket) => {
                cleanup();
                if (epoch !== this.connectionEpoch) {
                    reject(new SupersededError());
                    return;
                }
                // reasonCode (v5) / returnCode (v3) of 0 means accepted.
                const rc = packet.reasonCode ?? packet.returnCode ?? 0;
                if (rc !== 0) {
                    this.teardown();
                    reject(
                        new Error(
                            refusedReason ??
                                `MQTT authentication failed (CONNACK reason ${rc})`,
                        ),
                    );
                } else {
                    resolve();
                }
            };
            const onError = (err: Error) => {
                cleanup();
                if (epoch !== this.connectionEpoch) {
                    reject(new SupersededError());
                    return;
                }
                this.teardown();
                reject(this.connectError(err, refusedReason));
            };
            // The subscriptions moved to the native host, which ended this client before CONNACK.
            const onClose = () => {
                if (epoch !== this.connectionEpoch) {
                    cleanup();
                    reject(new SupersededError());
                }
            };
            const cleanup = () => {
                if (epoch === this.connectionEpoch) {
                    this.opening = false;
                }
                client.removeListener('connect', onConnect);
                client.removeListener('error', onError);
                client.removeListener('close', onClose);
            };
            client.on('connect', onConnect);
            client.on('error', onError);
            client.on('close', onClose);
            client.connect();
        });
    }

    /**
     * The error for a failed connect: the broker's Reason String when it sent one (a refused
     * CONNACK), else mqtt.js's error. Memoized so both error listeners hand out the same
     * object and it is reported once.
     */
    private connectError(err: unknown, reason: string | undefined): Error {
        const source = toError(err);
        let error = this.connectErrors.get(source);
        if (!error) {
            error = reason ? new Error(reason) : source;
            this.connectErrors.set(source, error);
        }
        return error;
    }

    /** Fan a delivered packet out to every subscription whose filter matches. */
    private async dispatch(packet: IPublishPacket): Promise<void> {
        const payload = Buffer.isBuffer(packet.payload)
            ? packet.payload
            : Buffer.from(packet.payload);
        const message: PushMessage = {
            topic: packet.topic.toString(),
            data: payload.toString('utf8'),
            payload,
            qos: packet.qos,
        };
        const serverTitle = notificationContent(message).title;
        const postedTitles = new Set<string>();
        // While the app is on screen it shows the message itself: only subscriptions that
        // opted in with notifyInForeground also post a notification then.
        const foreground = AppState.currentState === 'active';
        for (const sub of this.subscriptions.values()) {
            if (matches(sub.topic, message.topic)) {
                await sub.callback(message);
                // Notification is per-subscription: only subs that opted in post one, each
                // title once. A title the server sent replaces theirs, so it posts once.
                const title = serverTitle ?? sub.title ?? message.topic;
                if (
                    sub.background &&
                    (!foreground || sub.notifyInForeground) &&
                    !postedTitles.has(title)
                ) {
                    postedTitles.add(title);
                    await this.notify(message, title);
                }
            }
        }
    }
}

/** The SDK's native Android module (see android/), which hosts background delivery. */
interface NativePush {
    /** Resolves with whether the connection is open once every filter is subscribed. */
    host(config: string, subscriptions: string): Promise<boolean | null>;
    ack(token: string): void;
    release(): Promise<void>;
    stop(): Promise<void>;
    setForeground(enabled: boolean): Promise<void>;
    hasSaved(): Promise<boolean>;
    resume(
        authMethod: string | null,
        credential: string | null,
        signedOutWhenMissing: boolean,
    ): Promise<void>;
    /** {@link PushBackgroundStatus} as JSON. */
    backgroundStatus(): Promise<string>;
    requestExactAlarms(): Promise<boolean>;
    requestIgnoreBatteryOptimizations(): Promise<boolean>;
    setErrorCallback(registered: boolean): Promise<string | null>;
    defaultClientId(authMethod: string, credential: string): Promise<string>;
    /** The tapped notification that launched the app, as {@link NativeOpened} JSON. */
    getInitialNotification(): Promise<string | null>;
    listenOpened(listening: boolean): Promise<void>;
    addListener(eventName: string): void;
    removeListeners(count: number): void;
}

/** A tapped notification the native module reports: its topic and raw payload. */
interface NativeOpened {
    topic: string;
    payload: string;
}

/** A message the native module delivers for a hosted subscription. */
interface NativeMessage {
    id: string;
    topic: string;
    payload: string;
    qos: number;
    ackToken: string;
}

/**
 * Every Push on Android shares the one native host (one connection per client id), which hosts
 * the union of their subscriptions. Native calls run one at a time in call order, so a sign-out
 * is never undone by a subscribe still on its way.
 */
const nativeHosts = new Set<Push>();
/** Every Push with live subscriptions, so the native host can take over their connections. */
const livePushes = new Set<Push>();
let nativeQueue: Promise<unknown> = Promise.resolve();

let notificationPermissionRequested = false;

/**
 * Android 13+: ask once per run for the notification permission that background messages are
 * posted with. It does not wait for the answer, and a denial only leaves notifications off.
 */
function requestNotificationPermission(): void {
    if (
        notificationPermissionRequested ||
        Platform.OS !== 'android' ||
        Number(Platform.Version) < 33
    ) {
        return;
    }
    notificationPermissionRequested = true;
    // Required here rather than imported: react-native-web, which web builds alias, lacks it.
    /* eslint-disable @typescript-eslint/no-require-imports */
    const reactNative: typeof import('react-native') = require('react-native');
    /* eslint-enable @typescript-eslint/no-require-imports */
    const { PermissionsAndroid } = reactNative;
    const permission = PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS;
    PermissionsAndroid.check(permission)
        .then((granted) =>
            granted ? undefined : PermissionsAndroid.request(permission),
        )
        .catch(() => undefined);
}

/** A tapped notification's topic and message `data`, parsed from its payload. */
function toOpened(topic: string, payload: string): PushNotificationOpened {
    let data: unknown;
    try {
        data = (JSON.parse(payload) as { data?: unknown })?.data;
    } catch {
        data = undefined;
    }
    return {
        topic,
        data:
            typeof data === 'object' && data !== null && !Array.isArray(data)
                ? (data as Record<string, unknown>)
                : {},
    };
}

/** A tap on a notification this SDK posted through expo-notifications, else null. */
function openedFromExpo(
    response: import('expo-notifications').NotificationResponse,
): PushNotificationOpened | null {
    const data = response.notification.request.content.data;
    return typeof data?.topic === 'string' && typeof data.payload === 'string'
        ? toOpened(data.topic, data.payload)
        : null;
}

/** expo-notifications when the app has installed it, else null. */
function expoNotifications(): typeof import('expo-notifications') | null {
    try {
        /* eslint-disable @typescript-eslint/no-require-imports */
        return require('expo-notifications');
        /* eslint-enable @typescript-eslint/no-require-imports */
    } catch {
        return null;
    }
}

/** What a message's `notification` block asks a background notification to show. */
interface NotificationContent {
    /** Whether the message has a `notification` block at all. */
    present: boolean;
    title?: string;
    body?: string;
    image?: string;
}

/** The server's `notification` block in a message; empty when the payload has none or is not JSON. */
function notificationContent(message: PushMessage): NotificationContent {
    let notification: unknown;
    try {
        notification = (JSON.parse(message.data) as { notification?: unknown })
            ?.notification;
    } catch {
        return { present: false };
    }
    if (typeof notification !== 'object' || notification === null) {
        return { present: false };
    }
    const field = (name: string): string | undefined => {
        const value = (notification as Record<string, unknown>)[name];
        return typeof value === 'string' && value !== '' ? value : undefined;
    };
    return {
        present: true,
        title: field('title'),
        body: field('body'),
        image: field('image'),
    };
}

function enqueueNative<T>(op: () => Promise<T>): Promise<T> {
    const result = nativeQueue.then(op);
    nativeQueue = result.catch(() => undefined);
    return result;
}

/** The native module on Android when the app was built with it (not in Expo Go), else null. */
function nativePush(): NativePush | null {
    if (Platform.OS !== 'android') {
        return null;
    }
    return (NativeModules?.AppwritePush as NativePush | undefined) ?? null;
}

/**
 * Reported to a Push whose background delivery stopped because a Push with another credential
 * took over the native host, which carries one connection and so serves one credential.
 */
const BACKGROUND_DISPLACED =
    'Background delivery stopped: a Push with another credential started background delivery, ' +
    'and the device hosts one. These subscriptions still deliver while the app runs.';

/** An in-process connect superseded by the native host or by a connect with another credential. */
function closedError(): Error {
    return new Error('Push was closed before the subscription was established');
}

class SupersededError extends Error {
    constructor() {
        super('The push connection was superseded');
    }
}

/** Normalize anything thrown or passed to an error handler into an `Error`. */
function toError(error: unknown): Error {
    return error instanceof Error ? error : new Error(String(error));
}

/**
 * The userId claim from an Appwrite JWT, used as the default MQTT client id so the
 * broker's replay cursor is stable per user. Returns '' when the token is not a decodable JWT
 * (e.g. a plain string), so the caller can fall back to the session or raw credential.
 */
function userIdFromJwt(jwt?: string): string {
    if (!jwt) {
        return '';
    }
    const parts = jwt.split('.');
    if (parts.length < 2) {
        return '';
    }
    try {
        const json = Buffer.from(
            parts[1].replace(/-/g, '+').replace(/_/g, '/'),
            'base64',
        ).toString('utf-8');
        const payload = JSON.parse(json);
        return typeof payload.userId === 'string' ? payload.userId : '';
    } catch {
        return '';
    }
}

/**
 * Whether the optional background-delivery peers (`expo-notifications` and
 * `react-native-background-actions`) are installed.
 */
function backgroundPeersInstalled(): boolean {
    try {
        /* eslint-disable @typescript-eslint/no-require-imports */
        require('expo-notifications');
        require('react-native-background-actions');
        /* eslint-enable @typescript-eslint/no-require-imports */
        return true;
    } catch {
        return false;
    }
}

interface NativeCookies {
    session(url: string, project: string): Promise<string | null>;
}

async function sessionCookie(
    endpoint: string | undefined,
    project: string | undefined,
): Promise<string> {
    return (await lookupSessionCookie(endpoint, project)).session;
}

/**
 * Look up the session cookie. `found` is false only when the lookup succeeded and there is no
 * session, and null when it could not be looked up (no cookie module, endpoint or project, or
 * the lookup failed).
 */
async function lookupSessionCookie(
    endpoint: string | undefined,
    project: string | undefined,
): Promise<{ found: boolean | null; session: string }> {
    const cookies = NativeModules?.AppwriteCookies as NativeCookies | undefined;
    if (!cookies || !endpoint || !project) {
        return { found: null, session: '' };
    }
    try {
        const value = await cookies.session(endpoint, project);
        return value
            ? { found: true, session: decodeURIComponent(value) }
            : { found: false, session: '' };
    } catch {
        return { found: null, session: '' };
    }
}

/**
 * The user id inside a session secret, which is base64 of JSON `{"id": <userId>, "secret": ...}`.
 * Returns '' when the value is not such a secret.
 */
function userIdFromSession(session?: string): string {
    if (!session) {
        return '';
    }
    try {
        const payload = JSON.parse(
            Buffer.from(session, 'base64').toString('utf-8'),
        );
        return typeof payload.id === 'string' ? payload.id : '';
    } catch {
        return '';
    }
}

/** A hex id, uuid4-like enough for a client-generated subId / client id suffix. */
function randomId(): string {
    let out = '';
    for (let i = 0; i < 32; i++) {
        out += Math.floor(Math.random() * 16).toString(16);
    }
    return out;
}

/** MQTT topic-filter match with '+' (single level) and '#' (multi level). */
function matches(filter: string, topic: string): boolean {
    const filterParts = filter.split('/');
    const topicParts = topic.split('/');
    for (let i = 0; i < filterParts.length; i++) {
        const part = filterParts[i];
        if (part === '#') {
            return true;
        }
        if (i >= topicParts.length) {
            return false;
        }
        if (part !== '+' && part !== topicParts[i]) {
            return false;
        }
    }
    return filterParts.length === topicParts.length;
}

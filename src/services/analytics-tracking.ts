import { AppState, Dimensions, NativeModules, Platform } from 'react-native';

import { fileSystem } from '../lib/file-system';
import type { Analytics } from './analytics';

/**
 * Auto-tracking helpers for the generated `Analytics` service: install, update
 * and app-lifecycle events, push helpers, and manual `screenView` / `track`
 * calls, all sent through `Analytics.createEvent`.
 *
 * ```ts
 * const tracking = new Tracking(new Analytics(client), '<PROPERTY_ID>');
 * tracking.start();
 *
 * const navigationRef = createNavigationContainerRef();
 * <NavigationContainer ref={navigationRef} {...trackNavigation(tracking, navigationRef)}>
 * ```
 *
 * Auto-emitted event names follow `snake_case` + lowercase (`screen_view`,
 * `app_backgrounded`, `app_foregrounded`, `first_open`, etc.). Prop keys use
 * camelCase to match the endpoint's parameter naming.
 *
 * Engagement time is reported as a **delta** attached to each
 * `app_backgrounded` event, covering only the foreground time accrued since
 * the last resume, the same way the Web and Flutter helpers report it.
 */

export type TrackingEventOptions = {
    props?: Record<string, unknown>;
    url?: string; // absolute, or a path resolved against `Tracking.url`
    engagementTime?: number; // seconds since the previous flush
    interactive?: boolean; // false keeps telemetry from ending a bounce
};

export type TrackingOptions = {
    /**
     * Base URL events are reported under; screen names resolve against it.
     * Defaults to the page origin on the web and `app://<platform>` elsewhere,
     * since the endpoint only accepts absolute URLs.
     */
    url?: string;
};

export type ScreenViewOptions = {
    className?: string;
    props?: Record<string, unknown>;
};

export type PushTrackingOptions = {
    /** The Appwrite Messaging message id. */
    messageId?: string;
    campaign?: string;
};

/** The slice of a React Navigation container ref that screen tracking reads. */
export type TrackedNavigationRef = {
    getCurrentRoute(): { name: string } | undefined;
};

export type NavigationTrackingOptions = {
    /** Screen name for a route; return undefined to skip it. Defaults to the route name. */
    screenName?: (route: { name: string }) => string | undefined;
    /** Your own `NavigationContainer` handlers, called after the screen is reported. */
    onReady?(): void;
    onStateChange?(state: unknown): void;
};

/** The SDK's native cookie module, which also exports the app's version. */
type NativeCookies = {
    appVersion?: string;
    session(url: string, project: string): Promise<string | null>;
};

type InstallEvent = { name: string; props?: Record<string, string> };

// Monotonic where available, so a wall-clock change does not skew engagement time.
const now = (): number =>
    typeof performance !== 'undefined' ? performance.now() : Date.now();

/**
 * Resolve `reference` against `base` as RFC 3986 does (`new URL` semantics, without
 * dot-segment removal), percent-encoding its path. React Native's URL polyfill cannot.
 */
function resolveUrl(base: string, reference: string): string {
    if (/^[a-z][a-z0-9+.-]*:/i.test(reference)) {
        return reference;
    }
    // Keep escapes already in the name rather than encoding their `%` again.
    const path = encodeURI(reference).replace(/%25([0-9a-f]{2})/gi, '%$1');
    const [, origin = base, basePath = ''] =
        /^([a-z][a-z0-9+.-]*:\/\/[^/?#]*)([^?#]*)/i.exec(base) ?? [];
    if (path.startsWith('/')) {
        return origin + path;
    }
    const directory =
        basePath === ''
            ? '/'
            : basePath.slice(0, basePath.lastIndexOf('/') + 1);
    return origin + directory + path;
}

// One install check per app run, shared by every Tracking, so overlapping starts send once.
let installCheck: Promise<void> | undefined;

export class Tracking {
    private readonly analytics: Analytics;
    private readonly propertyId: string;

    /** Base URL events are reported under. */
    readonly url: string;

    private lifecycle?: { remove(): void };
    private foregroundSince?: number;
    // Sub-second engagement left over from the previous flush, so many short
    // foreground stretches do not each lose a fraction to truncation.
    private engagementCarryMs = 0;

    /**
     * @param analytics - The generated `Analytics` service events are sent through.
     * @param propertyId - Analytics property every event is recorded against.
     */
    constructor(
        analytics: Analytics,
        propertyId: string,
        options: TrackingOptions = {},
    ) {
        this.analytics = analytics;
        this.propertyId = propertyId;
        this.url =
            options.url ??
            (Platform.OS === 'web' && typeof window !== 'undefined'
                ? window.location.origin
                : `app://${Platform.OS}`);
    }

    /**
     * Start the default auto-tracking set: app-lifecycle events, as
     * `enableAutoLifecycleEvents`, plus `first_open` and `app_updated`. Screen
     * tracking is opt-in via `trackNavigation`.
     *
     * `first_open` is sent once per install, `app_updated` (with
     * `previousVersion` and `version`) on the first start after the app's
     * version changes. Both rely on a marker file in the app's documents
     * directory, so a reinstall or "clear data" counts as a new install. An
     * existing install upgrading to this SDK is not counted when it has a saved
     * session; without one its first start after the upgrade counts once.
     * Neither event is sent on the web, and `app_updated` needs the SDK's native
     * module (not in Expo Go). The event is saved until the endpoint accepts it,
     * so a failed send is retried on the next app start. The check runs once per
     * run, whatever the number of `Tracking` instances or `start` calls.
     */
    public start(): void {
        this.enableAutoLifecycleEvents();
        installCheck ??= this.trackInstall().catch((error) => {
            console.warn('Tracking: failed to record the install', error);
        });
    }

    private async trackInstall(): Promise<void> {
        const FileSystem = fileSystem();
        if (!FileSystem.documentDirectory) {
            return;
        }
        const cookies = NativeModules?.AppwriteCookies as
            NativeCookies | undefined;
        const { endpoint, project } = this.analytics.client.config;
        const directory = FileSystem.documentDirectory;
        const read = async (path: string): Promise<string | null> =>
            (await FileSystem.getInfoAsync(path)).exists
                ? await FileSystem.readAsStringAsync(path)
                : null;
        // The install event (`{"name", "props"}` JSON), kept next to the marker until it is sent.
        const pending = `${directory}appwrite_tracking_pending`;
        const sendPending = async (json: string): Promise<void> => {
            const event = JSON.parse(json) as InstallEvent;
            // A crash after a successful send but before clearing sends it once more.
            if (
                await this.send(event.name, {
                    props: event.props,
                    interactive: false,
                })
            ) {
                await FileSystem.deleteAsync(pending, { idempotent: true });
            }
        };
        const marker = `${directory}appwrite_tracking_install`;
        // Empty without the native module, which also leaves app_updated unsent.
        const version = cookies?.appVersion ?? '';
        const saved = await read(pending);
        if (saved !== null) {
            const event = JSON.parse(saved) as InstallEvent;
            // Rolled back to where the unsent update started: no net change to report.
            if (
                event.name === 'app_updated' &&
                version !== '' &&
                event.props?.previousVersion === version
            ) {
                await FileSystem.writeAsStringAsync(marker, version);
                await FileSystem.deleteAsync(pending, { idempotent: true });
                return;
            }
            // An unsent update followed by another upgrade is reported as one previous → current update.
            const json =
                event.name === 'app_updated' &&
                version !== '' &&
                event.props?.version !== version
                    ? JSON.stringify({
                          ...event,
                          props: { ...event.props, version },
                      })
                    : saved;
            if (json !== saved) {
                await FileSystem.writeAsStringAsync(pending, json);
            }
            // A crash may have come between the two writes: finish the marker, keep the decision.
            await FileSystem.writeAsStringAsync(marker, version);
            await sendPending(json);
            return;
        }
        // Before the marker: the app's first request can save a session meanwhile.
        const ranBefore = cookies
            ? (await cookies.session(endpoint, project).catch(() => null)) !==
              null
            : false;
        const previous = await read(marker);
        if (previous === version) {
            return;
        }
        const install: InstallEvent | undefined =
            previous === null
                ? ranBefore
                    ? undefined
                    : { name: 'first_open' }
                : previous !== '' && version !== ''
                  ? {
                        name: 'app_updated',
                        props: { previousVersion: previous, version },
                    }
                  : undefined;
        // Pending before the marker, so neither a crash nor a failed send loses it.
        const json = install ? JSON.stringify(install) : undefined;
        if (json) {
            await FileSystem.writeAsStringAsync(pending, json);
        }
        await FileSystem.writeAsStringAsync(marker, version);
        if (json) {
            await sendPending(json);
        }
    }

    /**
     * Start emitting `app_backgrounded` and `app_foregrounded` events when the
     * app changes state. Idempotent — repeat calls no-op.
     */
    public enableAutoLifecycleEvents(): void {
        if (this.lifecycle) {
            return;
        }
        // A headless start (a background push task) has no foreground time to count.
        this.foregroundSince =
            AppState.currentState === 'background' ? undefined : now();
        this.engagementCarryMs = 0;
        this.lifecycle = AppState.addEventListener('change', (state) => {
            if (state === 'background') {
                const since = this.foregroundSince;
                if (since === undefined) {
                    return;
                }
                this.foregroundSince = undefined;
                const elapsed = this.engagementCarryMs + now() - since;
                const seconds = Math.floor(elapsed / 1000);
                this.engagementCarryMs = elapsed - seconds * 1000;
                this.track('app_backgrounded', {
                    engagementTime: seconds > 0 ? seconds : undefined,
                    interactive: false,
                });
            } else if (state === 'active') {
                // iOS `inactive` -> `active` (app switcher, control centre) never
                // reached the background, so the interval is still open.
                if (this.foregroundSince !== undefined) {
                    return;
                }
                this.foregroundSince = now();
                this.track('app_foregrounded', { interactive: false });
            }
        });
    }

    /**
     * Stop emitting lifecycle events. Safe to call when auto-lifecycle was
     * never enabled.
     */
    public disableAutoLifecycleEvents(): void {
        this.lifecycle?.remove();
        this.lifecycle = undefined;
        this.foregroundSince = undefined;
        this.engagementCarryMs = 0;
    }

    /**
     * Track an event manually. Request failures are swallowed so tracking
     * never surfaces errors to the host app.
     */
    public track(name: string, options: TrackingEventOptions = {}): void {
        void this.send(name, options);
    }

    /** Send an event; resolves true once the server accepted it (2xx). */
    private async send(
        name: string,
        options: TrackingEventOptions,
    ): Promise<boolean> {
        try {
            await this.analytics.createEvent({
                propertyId: this.propertyId,
                name,
                url:
                    options.url === undefined
                        ? this.url
                        : resolveUrl(this.url, options.url),
                // Density-independent pixels, matching the Web helper's `innerWidth`.
                screenWidth:
                    Math.round(Dimensions.get('window').width) || undefined,
                engagementTime: options.engagementTime,
                interactive: options.interactive,
                // The endpoint takes props as a flat alternating key/value list.
                props: options.props
                    ? Object.entries(options.props).flatMap(([key, value]) =>
                          value === undefined || value === null
                              ? []
                              : [key, String(value)],
                      )
                    : undefined,
            });
            return true;
        } catch (error) {
            console.warn('Tracking: failed to send event', error);
            return false;
        }
    }

    /**
     * Send a `screen_view` event with `screen`, optional `screenClass` and any
     * caller-supplied props. `name` is also the event URL's path.
     */
    public screenView(name: string, options: ScreenViewOptions = {}): void {
        this.track('screen_view', {
            url: name,
            props: {
                screen: name,
                screenClass: options.className,
                ...options.props,
            },
        });
    }

    /**
     * Send `push_received` for a push notification the device got. Call it from
     * your push handler; best effort, since on iOS, and on Android while the app
     * is killed, the app's code often does not run when a notification arrives.
     */
    public pushReceived(options: PushTrackingOptions = {}): void {
        this.track('push_received', {
            props: {
                messageId: options.messageId || undefined,
                campaign: options.campaign,
            },
            interactive: false,
        });
    }

    /** Send `push_opened` when the user taps a push notification. */
    public pushOpened(options: PushTrackingOptions = {}): void {
        this.track('push_opened', {
            props: {
                messageId: options.messageId || undefined,
                campaign: options.campaign,
            },
            interactive: true,
        });
    }
}

/**
 * Send a `screen_view` through `tracking` for every screen React Navigation
 * shows. Spread the result onto `NavigationContainer` next to its `ref`:
 *
 * ```tsx
 * <NavigationContainer ref={navigationRef} {...trackNavigation(tracking, navigationRef)}>
 * ```
 *
 * Pass your own `onReady` / `onStateChange` in `options` rather than on the
 * container, which would replace these. A screen is reported when its name
 * differs from the previous one, so param changes and nested state updates on
 * the same screen are not counted twice.
 */
export function trackNavigation(
    tracking: Tracking,
    ref: TrackedNavigationRef,
    options: NavigationTrackingOptions = {},
): { onReady: () => void; onStateChange: (state: unknown) => void } {
    const screenName = options.screenName ?? ((route) => route.name);
    let previous: string | undefined;
    const report = (): void => {
        const route = ref.getCurrentRoute();
        const name = route ? screenName(route) : undefined;
        if (!name || name === previous) {
            return;
        }
        tracking.track('screen_view', {
            url: name,
            props: { screen: name, previous },
        });
        previous = name;
    };
    return {
        onReady: () => {
            report();
            options.onReady?.();
        },
        onStateChange: (state) => {
            report();
            options.onStateChange?.(state);
        },
    };
}

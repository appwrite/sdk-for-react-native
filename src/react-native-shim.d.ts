declare module 'react-native' {
    export const Platform: {
        readonly OS: string;
    };

    // The slice of the native module API the Push service uses on Android.
    export const NativeModules: Record<string, unknown> | undefined;

    export interface EmitterSubscription {
        remove(): void;
    }

    export class NativeEventEmitter {
        constructor(nativeModule?: unknown);
        addListener<T>(
            eventType: string,
            listener: (event: T) => void,
        ): EmitterSubscription;
    }
}

// `react-native-tcp-socket` is an optional peer dependency (a native module),
// so it is not installed when type-checking the SDK in isolation. Declare just
// the slice of its API the MQTT transport uses so `tsc` resolves the import.
declare module 'react-native-tcp-socket' {
    import type { Buffer } from 'buffer';

    export interface Socket {
        setNoDelay(noDelay?: boolean): Socket;
        write(
            buffer: string | Buffer,
            encoding?: unknown,
            cb?: (err?: Error) => void,
        ): boolean;
        destroy(error?: Error): void;
        resume(): Socket;
        pause(): Socket;
        on(event: 'data', listener: (data: Buffer | string) => void): Socket;
        on(event: 'error', listener: (error: Error) => void): Socket;
        on(
            event: 'connect' | 'secureConnect' | 'close',
            listener: () => void,
        ): Socket;
    }

    export interface TcpSocketConnectOpts {
        host?: string;
        port: number;
    }

    export interface TLSSocketOptions extends TcpSocketConnectOpts {
        rejectUnauthorized?: boolean;
    }

    interface TcpSocketStatic {
        createConnection(
            options: TcpSocketConnectOpts,
            callback?: () => void,
        ): Socket;
        connectTLS(options: TLSSocketOptions, callback?: () => void): Socket;
    }

    const TcpSockets: TcpSocketStatic;
    export default TcpSockets;
}

// Optional peer dependencies used only by Push.setForeground() (Android foreground
// service + local notifications). Declared so `tsc` resolves the dynamic imports even
// when the app has not installed them; at runtime the imports are guarded.
declare module 'react-native-background-actions' {
    interface BackgroundTaskOptions {
        taskName: string;
        taskTitle: string;
        taskDesc: string;
        // Required by react-native-background-actions for its ongoing notification;
        // omitting it makes start() throw "Task icon not found".
        taskIcon: { name: string; type: string };
        foregroundServiceType?: string[];
    }

    interface BackgroundActions {
        start(
            task: (args?: unknown) => Promise<void>,
            options: BackgroundTaskOptions,
        ): Promise<void>;
        stop(): Promise<void>;
        isRunning(): boolean;
    }

    const backgroundActions: BackgroundActions;
    export default backgroundActions;
}

declare module 'expo-notifications' {
    export const AndroidImportance: { readonly HIGH: number };

    export function requestPermissionsAsync(): Promise<{ granted: boolean }>;
    export function setNotificationChannelAsync(
        channelId: string,
        channel: { name: string; importance: number },
    ): Promise<unknown>;
    export function scheduleNotificationAsync(request: {
        content: { title: string; body: string };
        trigger: null;
    }): Promise<string>;
}

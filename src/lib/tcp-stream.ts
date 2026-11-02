import './polyfills';

import { Buffer } from 'buffer';
import { Duplex } from 'readable-stream';
import { NativeModules, Platform } from 'react-native';
import type TcpSocketType from 'react-native-tcp-socket';
import type { Socket } from 'react-native-tcp-socket';
import type { IStream } from 'mqtt';

export interface TcpStreamOptions {
    host: string;
    port: number;
    /** Wrap the connection in TLS (mqtts). */
    tls: boolean;
    /**
     * Skip certificate validation. A broker behind a certificate that does not
     * chain to a public root either pins its root or turns validation off for
     * testing.
     */
    tlsInsecure: boolean;
}

/** The slice of the SDK's native Android module that verifies a TLS server. */
interface NativeTls {
    /**
     * The PEM certificate `host`:`port` presents, once Android has verified it for `host`: chain
     * and hostname (subjectAltName). Rejects otherwise.
     */
    verifiedCertificate(host: string, port: number): Promise<string>;
}

/**
 * A Node-style Duplex over a raw TCP (or TLS) socket, for MQTT.js to run on.
 *
 * React Native has no `net` module, so MQTT.js cannot open a TCP connection on its
 * own. `react-native-tcp-socket` provides the native socket; this adapts its
 * EventEmitter-shaped `Socket` into the `readable-stream` Duplex MQTT.js pipes
 * through its parser and writes packets to.
 */
export function createTcpStream({
    host,
    port,
    tls,
    tlsInsecure,
}: TcpStreamOptions): IStream {
    // `react-native-tcp-socket` is an optional peer. Requiring it inside try/catch marks it
    // as an optional dependency for Metro, so merely importing the SDK (without native push)
    // does not fail the bundler when the peer is absent; it is also only required lazily here,
    // when a native push connection is actually opened. A missing peer surfaces as a clear
    // error at that point rather than a Metro resolution failure on any SDK import.
    /* eslint-disable @typescript-eslint/no-require-imports */
    let TcpSocket: typeof TcpSocketType;
    try {
        // react-native-tcp-socket is a CommonJS module (module.exports = { ... }) with no
        // `.default`, so read that off first and fall back to the module for ESM interop.
        const mod = require('react-native-tcp-socket');
        TcpSocket = mod.default ?? mod;
    } catch {
        throw new Error(
            "Native push requires the optional peer 'react-native-tcp-socket'. Install it to use Push on React Native.",
        );
    }
    /* eslint-enable @typescript-eslint/no-require-imports */

    // Android's native TLS socket validates the certificate chain but never the hostname
    // (iOS checks it natively). So the SDK's native module first verifies the server the way
    // HTTPS does, and the socket then trusts only the certificate it verified: a server that
    // presents any other fails the handshake before anything, the CONNECT credential included,
    // is written to it.
    const checkHost = tls && !tlsInsecure && Platform.OS !== 'ios';

    let socket: Socket | undefined;
    let connected = false;
    // Writes MQTT.js issues before the socket is ready are held here and flushed on
    // connect, so the CONNECT packet is never dropped on the opening socket.
    const pending: { chunk: Buffer; cb: (err?: Error | null) => void }[] = [];

    const duplex = new Duplex({
        // A closed native socket ends both halves so MQTT.js sees 'close' and reconnects.
        allowHalfOpen: false,
        read() {
            if (connected) {
                socket?.resume();
            }
        },
        write(chunk: Buffer, _encoding, cb) {
            if (!connected || !socket) {
                pending.push({ chunk, cb });
                return;
            }
            socket.write(chunk, undefined, (err) => cb(err ?? null));
        },
        destroy(err, cb) {
            socket?.destroy();
            cb(err);
        },
    });

    const open = (ca?: string) => {
        const onConnect = () => {
            connected = true;
            for (const { chunk, cb } of pending) {
                opened.write(chunk, undefined, (err) => cb(err ?? null));
            }
            pending.length = 0;
        };
        // TLS must go through connectTLS(): plain Socket.connect() ignores a `tls`
        // option entirely (it never performs a handshake), so sending MQTT bytes into
        // the mqtts listener that way hangs until the broker's connack timeout. connectTLS
        // returns a TLSSocket that does the handshake and emits 'secureConnect' when ready.
        const opened = tls
            ? TcpSocket.connectTLS(
                  // NB: react-native-tcp-socket disables certificate validation ONLY via
                  // `rejectUnauthorized: false` (its native BlindTrustManager). The documented
                  // `tlsCheckValidity` field is a dead type annotation the Android code ignores.
                  // A string `ca` replaces the trusted roots with that one certificate.
                  {
                      host,
                      port,
                      rejectUnauthorized: !tlsInsecure,
                      ...(ca ? { ca } : {}),
                  },
                  onConnect,
              )
            : TcpSocket.createConnection({ host, port }, onConnect);
        socket = opened;
        opened.setNoDelay(true);
        opened.on('data', (data) => {
            // The native socket delivers Buffers by default (no encoding set); guard the
            // string case just in case, decoding it as raw bytes.
            const buf =
                typeof data === 'string' ? Buffer.from(data, 'binary') : data;
            if (!duplex.push(buf)) {
                opened.pause();
            }
        });
        opened.on('error', (err) => duplex.destroy(err));
        opened.on('close', () => {
            duplex.push(null);
        });
    };

    if (!checkHost) {
        open();
    } else {
        const native = NativeModules?.AppwritePush as
            Partial<NativeTls> | undefined;
        if (!native?.verifiedCertificate) {
            // Fail on the next tick, once MQTT.js has attached its error listener.
            queueMicrotask(() =>
                duplex.destroy(
                    new Error(
                        "Verifying the push server's TLS certificate needs the SDK's native Android module. Rebuild the app with it linked.",
                    ),
                ),
            );
        } else {
            native.verifiedCertificate(host, port).then(
                (certificate) => {
                    if (!duplex.destroyed) {
                        open(certificate);
                    }
                },
                (err: unknown) =>
                    duplex.destroy(
                        err instanceof Error ? err : new Error(String(err)),
                    ),
            );
        }
    }

    return duplex as unknown as IStream;
}

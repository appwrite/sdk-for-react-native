import './polyfills';

import { Buffer } from 'buffer';
import { Duplex } from 'readable-stream';
import { NativeModules, Platform } from 'react-native';
import type TcpSocketType from 'react-native-tcp-socket';
import type { TLSSocket } from 'react-native-tcp-socket';
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

/** The most a server may send before it is verified; a broker sends nothing before CONNACK. */
const MAX_UNVERIFIED_BYTES = 64 * 1024;

/** The slice of the SDK's native Android module that verifies a TLS server. */
interface NativeTls {
    /**
     * The SHA-256 fingerprint of the certificate `host`:`port` presents, once Android has
     * verified it for `host`: chain and hostname (subjectAltName). Rejects otherwise.
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
    // (iOS checks it natively). Its peer certificate carries no subjectAltName to check, so the
    // SDK's native module verifies the server the way HTTPS does and returns the fingerprint of
    // the certificate it verified; this socket's certificate must be that one before anything,
    // the CONNECT credential included, is written to it.
    const checkHost = tls && !tlsInsecure && Platform.OS !== 'ios';

    let connected = false;
    // Writes MQTT.js issues before the TCP handshake completes are held here and
    // flushed on connect, so the CONNECT packet is never dropped on the opening socket.
    const pending: { chunk: Buffer; cb: (err?: Error | null) => void }[] = [];
    // Bytes the server sends before it is verified are held here too, so MQTT.js never parses
    // a packet from an unverified peer; they are dropped with the socket if verification fails.
    // Reading pauses on the first of them, so only what was already in flight lands here.
    const inbound: Buffer[] = [];
    let inboundBytes = 0;

    // TLS must go through connectTLS(): plain Socket.connect() ignores a `tls`
    // option entirely (it never performs a handshake), so sending MQTT bytes into
    // the mqtts listener that way hangs until the broker's connack timeout. connectTLS
    // returns a TLSSocket that does the handshake and emits 'secureConnect' when ready.
    const socket = tls
        ? TcpSocket.connectTLS(
              // NB: react-native-tcp-socket disables certificate validation ONLY via
              // `rejectUnauthorized: false` (its native BlindTrustManager). The documented
              // `tlsCheckValidity` field is a dead type annotation the Android code ignores.
              {
                  host,
                  port,
                  rejectUnauthorized: !tlsInsecure,
              } as Parameters<typeof TcpSocket.connectTLS>[0],
              () => {
                  /* secureConnect — the handler below flushes the queue */
              },
          )
        : TcpSocket.createConnection({ host, port }, () => {});
    socket.setNoDelay(true);

    const duplex = new Duplex({
        // A closed native socket ends both halves so MQTT.js sees 'close' and reconnects.
        allowHalfOpen: false,
        read() {
            if (connected) {
                socket.resume();
            }
        },
        write(chunk: Buffer, _encoding, cb) {
            if (!connected) {
                pending.push({ chunk, cb });
                return;
            }
            socket.write(chunk, undefined, (err) => cb(err ?? null));
        },
        destroy(err, cb) {
            socket.destroy();
            cb(err);
        },
    });

    const onConnect = () => {
        if (connected) {
            return;
        }
        connected = true;
        for (const { chunk, cb } of pending) {
            socket.write(chunk, undefined, (err) => cb(err ?? null));
        }
        pending.length = 0;
        for (const buf of inbound) {
            duplex.push(buf);
        }
        inbound.length = 0;
        socket.resume();
    };
    const onSecureConnect = () => {
        if (!checkHost) {
            onConnect();
            return;
        }
        const native = NativeModules?.AppwritePush as
            Partial<NativeTls> | undefined;
        if (!native?.verifiedCertificate) {
            duplex.destroy(
                new Error(
                    "Verifying the push server's TLS certificate needs the SDK's native Android module. Rebuild the app with it linked.",
                ),
            );
            return;
        }
        Promise.all([
            (socket as TLSSocket).getPeerCertificate().catch(() => {
                throw new Error(
                    `Could not read the push server's TLS certificate to verify it for '${host}'.`,
                );
            }),
            native.verifiedCertificate(host, port),
        ])
            .then(([certificate, verified]) => {
                const fingerprint = certificate?.fingerprint256;
                if (
                    !fingerprint ||
                    fingerprint.toUpperCase() !== verified.toUpperCase()
                ) {
                    throw new Error(
                        `The push server's TLS certificate is not the one verified for '${host}'.`,
                    );
                }
                // The socket may have closed while this was verifying.
                if (!duplex.destroyed) {
                    onConnect();
                }
            })
            .catch((err: unknown) =>
                duplex.destroy(
                    err instanceof Error ? err : new Error(String(err)),
                ),
            );
    };
    // A TLS socket is ready only once the handshake completes ('secureConnect').
    if (tls) {
        socket.on('secureConnect', onSecureConnect);
    } else {
        socket.on('connect', onConnect);
    }

    socket.on('data', (data) => {
        // The native socket delivers Buffers by default (no encoding set); guard the
        // string case just in case, decoding it as raw bytes.
        const buf =
            typeof data === 'string' ? Buffer.from(data, 'binary') : data;
        if (!connected) {
            socket.pause();
            inbound.push(buf);
            inboundBytes += buf.length;
            if (inboundBytes > MAX_UNVERIFIED_BYTES) {
                duplex.destroy(
                    new Error(
                        'The push server sent too much data before it was verified.',
                    ),
                );
            }
            return;
        }
        if (!duplex.push(buf)) {
            socket.pause();
        }
    });
    socket.on('error', (err) => duplex.destroy(err));
    socket.on('close', () => {
        duplex.push(null);
    });

    return duplex as unknown as IStream;
}

import './polyfills';

import { Buffer } from 'buffer';
import { Duplex } from 'readable-stream';
import type TcpSocketType from 'react-native-tcp-socket';
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

    let connected = false;
    // Writes MQTT.js issues before the TCP handshake completes are held here and
    // flushed on connect, so the CONNECT packet is never dropped on the opening socket.
    const pending: { chunk: Buffer; cb: (err?: Error | null) => void }[] = [];

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
        read() {
            socket.resume();
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
    };
    socket.on('connect', onConnect);
    socket.on('secureConnect', onConnect);

    socket.on('data', (data) => {
        // The native socket delivers Buffers by default (no encoding set); guard the
        // string case just in case, decoding it as raw bytes.
        const buf =
            typeof data === 'string' ? Buffer.from(data, 'binary') : data;
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

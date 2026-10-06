// Node-core globals that `mqtt` and `readable-stream` expect but React Native's
// runtime does not provide. Imported for side effects by the MQTT modules so the
// transport works without the app entry having to set anything up. Each shim is
// installed only when missing, so it never clobbers a real (or Node) global.
import { Buffer } from 'buffer';
import process from 'process';

const g = globalThis as unknown as {
    Buffer?: typeof Buffer;
    process?: NodeJS.Process;
};

if (typeof g.Buffer === 'undefined') {
    g.Buffer = Buffer;
}

if (typeof g.process === 'undefined') {
    g.process = process as unknown as NodeJS.Process;
}

// readable-stream schedules work on process.nextTick; RN's process may lack it.
if (typeof g.process.nextTick !== 'function') {
    g.process.nextTick = ((
        cb: (...a: unknown[]) => void,
        ...args: unknown[]
    ) => {
        setTimeout(() => cb(...args), 0);
    }) as typeof process.nextTick;
}

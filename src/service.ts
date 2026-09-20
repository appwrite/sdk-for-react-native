import { Client } from './client';
import type { FilePart, Payload } from './client';

export class Service {
    static CHUNK_SIZE = 5 * 1024 * 1024; // 5MB

    client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    static flatten(data: Payload, prefix = ''): Payload {
        let output: Payload = {};

        for (const [key, value] of Object.entries(data)) {
            const finalKey = prefix ? prefix + '[' + key + ']' : key;
            if (Array.isArray(value)) {
                output = { ...output, ...Service.flatten(value, finalKey) };
            } else {
                output[finalKey] = value;
            }
        }

        return output;
    }

    static filePart(
        uri: string,
        name: string,
        type: string,
        read: () => Promise<string>,
    ): FilePart {
        return {
            uri,
            name,
            type,
            bytes: async () => Service.decodeBase64(await read()),
        };
    }

    static decodeBase64(data: string): Uint8Array {
        const binary = atob(data);
        const bytes = new Uint8Array(binary.length);
        for (let index = 0; index < binary.length; index++) {
            bytes[index] = binary.charCodeAt(index);
        }
        return bytes;
    }
}

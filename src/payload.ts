interface ReactNativeFileObject {
    uri: string;
    type?: string;
    name?: string;
}

export class Payload {
    public uri: string;
    public size: number;
    public filename?: string;
    public type?: string;

    constructor(uri: string, filename?: string, type?: string, size?: number) {
        this.uri = uri;
        this.filename = filename;
        this.type = type;
        
        if (size === undefined) {
            const base64Data = uri.split(',')[1];
            const binary = atob(base64Data);
            this.size = binary.length;
        } else {
            this.size = size;
        }
    }

    public toBinary(offset: number = 0, length?: number): Uint8Array {
        const base64Data = this.uri.split(',')[1];
        const binary = atob(base64Data);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        if (offset === 0 && length === undefined) {
            return bytes;
        } else if (length === undefined) {
            return bytes.subarray(offset);
        } else {
            return bytes.subarray(offset, offset + length);
        }
    }

    public toFileObject(): ReactNativeFileObject {
        return {
            uri: this.uri,
            type: this.type,
            name: this.filename,
        };
    }

    public toJson<T = unknown>(): T {
        return JSON.parse(this.toString());
    }

    public toString(): string {
        const binary = this.toBinary();
        return new TextDecoder().decode(binary);
    }

    public static fromJson(object: any, name?: string): Payload {
        const jsonString = JSON.stringify(object);
        const base64Data = btoa(jsonString);
        const dataUri = `data:application/json;base64,${base64Data}`;
        return new Payload(dataUri, name, 'application/json');
    }

    public static fromString(text: string, name?: string, type?: string): Payload {
        const base64Data = btoa(text);
        const dataUri = `data:${type || 'text/plain'};base64,${base64Data}`;
        return new Payload(dataUri, name, type || 'text/plain');
    }

    public static fromBinary(binary: Uint8Array, name?: string, type?: string): Payload {
        const base64Data = btoa(String.fromCharCode(...binary));
        const dataUri = `data:${type || 'application/octet-stream'};base64,${base64Data}`;
        return new Payload(dataUri, name, type || 'application/octet-stream');
    }

    public static fromFileObject(file: ReactNativeFileObject): Payload {
        return new Payload(file.uri, file.name, file.type);
    }
}

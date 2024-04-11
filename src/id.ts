export class ID {
    // Generate an hex ID based on timestamp
    // Recreated from https://www.php.net/manual/en/function.uniqid.php
    static #hexTimestamp(): string {
        const now = new Date();
        const sec = Math.floor(now.getTime() / 1000);
        const msec = now.getMilliseconds();

        // Convert to hexadecimal
        const hexTimestamp = sec.toString(16) + msec.toString(16).padStart(5, '0');
        return hexTimestamp;
    }

    public static custom(id: string): string {
        return id
    }

    public static unique(padding: number = 7): string {
        // Generate a unique ID with padding to have a longer ID
        const baseId = ID.#hexTimestamp();
        let randomPadding = '';
        for (let i = 0; i < padding; i++) {
            const randomHexDigit = Math.floor(Math.random() * 16).toString(16);
            randomPadding += randomHexDigit;
        }
        return baseId + randomPadding;
    }
}

/**
 * Validate the levels passed to `path()`: a non-empty array of non-empty strings, none holding
 * the level separator `/` or the MQTT wildcards `+` and `#`.
 */
function levelsOf(levels: unknown): string[] {
    if (!Array.isArray(levels)) {
        throw new Error("path() expects an array, e.g. path(['user'])");
    }
    if (levels.length === 0) {
        throw new Error('path() needs at least one level');
    }
    return levels.map((level: unknown, index: number) => {
        if (typeof level !== 'string') {
            const type = level === null ? 'null' : typeof level;
            throw new Error(
                `level at index ${index} must be a string, got ${type}`,
            );
        }
        if (level === '') {
            throw new Error(`empty level at index ${index}`);
        }
        if (level.includes('/')) {
            const parts = level
                .split('/')
                .map((part) => `'${part}'`)
                .join(', ');
            throw new Error(
                `"${level}" contains "/", split it: path([${parts}])`,
            );
        }
        if (level.includes('+')) {
            throw new Error(`"${level}" contains "+", not allowed in a topic`);
        }
        if (level.includes('#')) {
            throw new Error(`"${level}" contains "#", not allowed in a topic`);
        }
        if (level.includes('\0')) {
            throw new Error(`level at index ${index} contains a NUL character`);
        }
        return level;
    });
}

/**
 * Helper to build MQTT topics for `Push`, level by level.
 *
 *     Topic.path(['user', userId, 'notification']); // "user/123/notification"
 *     Topic.path(['org', orgId]).path(['logs']); // "org/42/logs"
 */
export class Topic {
    private constructor(private readonly levels: readonly string[]) {}

    /** Start a topic with the given levels, e.g. `Topic.path(['user', userId])`. */
    static path(levels: string[]): Topic {
        return new Topic(levelsOf(levels));
    }

    /** Append the given levels. */
    path(levels: string[]): Topic {
        return new Topic([...this.levels, ...levelsOf(levels)]);
    }

    toString(): string {
        return this.levels.join('/');
    }
}

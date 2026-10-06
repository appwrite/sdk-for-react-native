/**
 * Validate the levels passed to `path()`: a non-empty array of non-empty strings, none holding
 * the level separator `/` or the wildcards `+` and `#` (use `any()` and `all()` for those).
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
        if (level === '+') {
            throw new Error('"+" is reserved, use any()');
        }
        if (level.includes('+')) {
            throw new Error(`"${level}" contains "+", use any() for wildcards`);
        }
        if (level === '#') {
            throw new Error('"#" is reserved, use all()');
        }
        if (level.includes('#')) {
            throw new Error(`"${level}" contains "#", use all() for wildcards`);
        }
        return level;
    });
}

/**
 * Helper to build MQTT topics for `Push`, level by level.
 *
 *     Topic.path(['user', userId, 'notification']); // "user/123/notification"
 *     Topic.path(['user']).any().path(['notification']); // "user/+/notification"
 *     Topic.path(['org']).any().path(['logs']).all(); // "org/+/logs/#"
 *
 * `any()` matches exactly one level and `all()` everything below, at any depth (including the
 * parent itself). `all()` ends the topic, so it returns a {@link ResolvedTopic}.
 */
export class Topic {
    private constructor(private readonly levels: readonly string[]) {}

    /** Start a topic with the given levels, e.g. `Topic.path(['user', userId])`. */
    static path(levels: string[]): Topic {
        return new Topic(levelsOf(levels));
    }

    /** Start a topic with a single-level wildcard (`+`). */
    static any(): Topic {
        return new Topic(['+']);
    }

    /** The multi-level wildcard alone (`#`): matches every topic. */
    static all(): ResolvedTopic {
        return new ResolvedTopic(['#']);
    }

    /** Append the given levels. */
    path(levels: string[]): Topic {
        return new Topic([...this.levels, ...levelsOf(levels)]);
    }

    /** Append a single-level wildcard (`+`): matches exactly one level. */
    any(): Topic {
        return new Topic([...this.levels, '+']);
    }

    /** Append the multi-level wildcard (`#`) and end the topic. */
    all(): ResolvedTopic {
        return new ResolvedTopic([...this.levels, '#']);
    }

    toString(): string {
        return this.levels.join('/');
    }
}

/** A topic ended by `all()`: nothing can be appended after the `#` wildcard. */
export class ResolvedTopic {
    /** @internal Created by {@link Topic.all}. */
    constructor(private readonly levels: readonly string[]) {}

    toString(): string {
        return this.levels.join('/');
    }
}

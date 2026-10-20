import type * as Legacy from 'expo-file-system/legacy';

export type FileSystem = typeof Legacy;

export function fileSystem(): FileSystem {
    /* eslint-disable @typescript-eslint/no-require-imports */
    try {
        return require('expo-file-system/legacy');
    } catch {
        return require('expo-file-system');
    }
    /* eslint-enable @typescript-eslint/no-require-imports */
}

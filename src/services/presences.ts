import { Service } from '../service';
import { AppwriteException, Client } from '../client';
import type { Models } from '../models';
import type { UploadProgress, Payload } from '../client';
import * as FileSystem from 'expo-file-system';
import { Platform as RNPlatform } from 'react-native';


export class Presences extends Service {

     constructor(client: Client)
     {
        super(client);
     }

    /**
     * List presence logs. Expired entries are filtered out automatically.
     * 
     *
     * @param {string[]} params.queries - Array of query strings generated using the Query class provided by the SDK.
     * @param {boolean} params.total - When set to false, the total count returned will be 0 and will not be calculated.
     * @param {number} params.ttl - TTL (seconds) for caching list responses. Responses are stored in an in-memory key-value cache, keyed per project, collection, schema version (attributes and indexes), caller authorization roles, and the exact query — so users with different permissions never share cached entries. Schema changes invalidate cached entries automatically; document writes do not, so choose a TTL you are comfortable serving as stale data. Set to 0 to disable caching. Must be between 0 and 86400 (24 hours).
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    list<Presence extends Models.Presence = Models.DefaultPresence>(params?: { queries?: string[], total?: boolean, ttl?: number  }): Promise<Models.PresenceList<Presence>>;
    /**
     * List presence logs. Expired entries are filtered out automatically.
     * 
     *
     * @param {string[]} queries - Array of query strings generated using the Query class provided by the SDK.
     * @param {boolean} total - When set to false, the total count returned will be 0 and will not be calculated.
     * @param {number} ttl - TTL (seconds) for caching list responses. Responses are stored in an in-memory key-value cache, keyed per project, collection, schema version (attributes and indexes), caller authorization roles, and the exact query — so users with different permissions never share cached entries. Schema changes invalidate cached entries automatically; document writes do not, so choose a TTL you are comfortable serving as stale data. Set to 0 to disable caching. Must be between 0 and 86400 (24 hours).
     * @throws {AppwriteException}
     * @returns {Promise<Models.PresenceList<Presence>>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    list<Presence extends Models.Presence = Models.DefaultPresence>(queries?: string[], total?: boolean, ttl?: number): Promise<Models.PresenceList<Presence>>;
    list<Presence extends Models.Presence = Models.DefaultPresence>(
        paramsOrFirst?: { queries?: string[], total?: boolean, ttl?: number } | string[],
        ...rest: [(boolean)?, (number)?]    
    ): Promise<Models.PresenceList<Presence>> {
        let params: { queries?: string[], total?: boolean, ttl?: number };

        if (!paramsOrFirst || (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { queries?: string[], total?: boolean, ttl?: number };
        } else {
            params = {
                queries: paramsOrFirst as string[],
                total: rest[0] as boolean,
                ttl: rest[1] as number            
            };
        }

        const queries = params.queries;
        const total = params.total;
        const ttl = params.ttl;

        const apiPath = '/presences';
        const payload: Payload = {};

        if (typeof queries !== 'undefined') {
            payload['queries'] = queries;
        }

        if (typeof total !== 'undefined') {
            payload['total'] = total;
        }

        if (typeof ttl !== 'undefined') {
            payload['ttl'] = ttl;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('get', uri, {
        }, payload);
    }

    /**
     * Get a presence log by its unique ID. Entries whose `expiresAt` is in the past are treated as not found.
     * 
     *
     * @param {string} params.presenceId - Presence unique ID.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    get<Presence extends Models.Presence = Models.DefaultPresence>(params: { presenceId: string  }): Promise<Presence>;
    /**
     * Get a presence log by its unique ID. Entries whose `expiresAt` is in the past are treated as not found.
     * 
     *
     * @param {string} presenceId - Presence unique ID.
     * @throws {AppwriteException}
     * @returns {Promise<Presence>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    get<Presence extends Models.Presence = Models.DefaultPresence>(presenceId: string): Promise<Presence>;
    get<Presence extends Models.Presence = Models.DefaultPresence>(
        paramsOrFirst: { presenceId: string } | string    
    ): Promise<Presence> {
        let params: { presenceId: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { presenceId: string };
        } else {
            params = {
                presenceId: paramsOrFirst as string            
            };
        }

        const presenceId = params.presenceId;

        if (typeof presenceId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "presenceId"');
        }

        const apiPath = '/presences/{presenceId}'.replace('{presenceId}', presenceId);
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('get', uri, {
        }, payload);
    }

    /**
     * Create or update a presence log by its user ID.
     * 
     *
     * @param {string} params.presenceId - Presence unique ID.
     * @param {string} params.status - Presence status.
     * @param {string[]} params.permissions - An array of permissions strings. By default, only the current user is granted all permissions. [Learn more about permissions](https://appwrite.io/docs/permissions).
     * @param {string} params.expiresAt - Presence expiry datetime.
     * @param {object} params.metadata - Presence metadata object.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    upsert<Presence extends Models.Presence = Models.DefaultPresence>(params: { presenceId: string, status: string, permissions?: string[], expiresAt?: string, metadata?: object  }): Promise<Presence>;
    /**
     * Create or update a presence log by its user ID.
     * 
     *
     * @param {string} presenceId - Presence unique ID.
     * @param {string} status - Presence status.
     * @param {string[]} permissions - An array of permissions strings. By default, only the current user is granted all permissions. [Learn more about permissions](https://appwrite.io/docs/permissions).
     * @param {string} expiresAt - Presence expiry datetime.
     * @param {object} metadata - Presence metadata object.
     * @throws {AppwriteException}
     * @returns {Promise<Presence>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    upsert<Presence extends Models.Presence = Models.DefaultPresence>(presenceId: string, status: string, permissions?: string[], expiresAt?: string, metadata?: object): Promise<Presence>;
    upsert<Presence extends Models.Presence = Models.DefaultPresence>(
        paramsOrFirst: { presenceId: string, status: string, permissions?: string[], expiresAt?: string, metadata?: object } | string,
        ...rest: [(string)?, (string[])?, (string)?, (object)?]    
    ): Promise<Presence> {
        let params: { presenceId: string, status: string, permissions?: string[], expiresAt?: string, metadata?: object };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { presenceId: string, status: string, permissions?: string[], expiresAt?: string, metadata?: object };
        } else {
            params = {
                presenceId: paramsOrFirst as string,
                status: rest[0] as string,
                permissions: rest[1] as string[],
                expiresAt: rest[2] as string,
                metadata: rest[3] as object            
            };
        }

        const presenceId = params.presenceId;
        const status = params.status;
        const permissions = params.permissions;
        const expiresAt = params.expiresAt;
        const metadata = params.metadata;

        if (typeof presenceId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "presenceId"');
        }

        if (typeof status === 'undefined') {
            throw new AppwriteException('Missing required parameter: "status"');
        }

        const apiPath = '/presences/{presenceId}'.replace('{presenceId}', presenceId);
        const payload: Payload = {};

        if (typeof status !== 'undefined') {
            payload['status'] = status;
        }

        if (typeof permissions !== 'undefined') {
            payload['permissions'] = permissions;
        }

        if (typeof expiresAt !== 'undefined') {
            payload['expiresAt'] = expiresAt;
        }

        if (typeof metadata !== 'undefined') {
            payload['metadata'] = metadata;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('put', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Update a presence log by its unique ID. Using the patch method you can pass only specific fields that will get updated.
     * 
     *
     * @param {string} params.presenceId - Presence unique ID.
     * @param {string} params.status - Presence status.
     * @param {string} params.expiresAt - Presence expiry datetime.
     * @param {object} params.metadata - Presence metadata object.
     * @param {string[]} params.permissions - An array of permissions strings. By default, only the current user is granted all permissions. [Learn more about permissions](https://appwrite.io/docs/permissions).
     * @param {boolean} params.purge - When true, purge cached responses used by list presences endpoint.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    update<Presence extends Models.Presence = Models.DefaultPresence>(params: { presenceId: string, status?: string, expiresAt?: string, metadata?: object, permissions?: string[], purge?: boolean  }): Promise<Presence>;
    /**
     * Update a presence log by its unique ID. Using the patch method you can pass only specific fields that will get updated.
     * 
     *
     * @param {string} presenceId - Presence unique ID.
     * @param {string} status - Presence status.
     * @param {string} expiresAt - Presence expiry datetime.
     * @param {object} metadata - Presence metadata object.
     * @param {string[]} permissions - An array of permissions strings. By default, only the current user is granted all permissions. [Learn more about permissions](https://appwrite.io/docs/permissions).
     * @param {boolean} purge - When true, purge cached responses used by list presences endpoint.
     * @throws {AppwriteException}
     * @returns {Promise<Presence>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    update<Presence extends Models.Presence = Models.DefaultPresence>(presenceId: string, status?: string, expiresAt?: string, metadata?: object, permissions?: string[], purge?: boolean): Promise<Presence>;
    update<Presence extends Models.Presence = Models.DefaultPresence>(
        paramsOrFirst: { presenceId: string, status?: string, expiresAt?: string, metadata?: object, permissions?: string[], purge?: boolean } | string,
        ...rest: [(string)?, (string)?, (object)?, (string[])?, (boolean)?]    
    ): Promise<Presence> {
        let params: { presenceId: string, status?: string, expiresAt?: string, metadata?: object, permissions?: string[], purge?: boolean };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { presenceId: string, status?: string, expiresAt?: string, metadata?: object, permissions?: string[], purge?: boolean };
        } else {
            params = {
                presenceId: paramsOrFirst as string,
                status: rest[0] as string,
                expiresAt: rest[1] as string,
                metadata: rest[2] as object,
                permissions: rest[3] as string[],
                purge: rest[4] as boolean            
            };
        }

        const presenceId = params.presenceId;
        const status = params.status;
        const expiresAt = params.expiresAt;
        const metadata = params.metadata;
        const permissions = params.permissions;
        const purge = params.purge;

        if (typeof presenceId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "presenceId"');
        }

        const apiPath = '/presences/{presenceId}'.replace('{presenceId}', presenceId);
        const payload: Payload = {};

        if (typeof status !== 'undefined') {
            payload['status'] = status;
        }

        if (typeof expiresAt !== 'undefined') {
            payload['expiresAt'] = expiresAt;
        }

        if (typeof metadata !== 'undefined') {
            payload['metadata'] = metadata;
        }

        if (typeof permissions !== 'undefined') {
            payload['permissions'] = permissions;
        }

        if (typeof purge !== 'undefined') {
            payload['purge'] = purge;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('patch', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Delete a presence log by its unique ID.
     * 
     *
     * @param {string} params.presenceId - Presence unique ID.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    delete(params: { presenceId: string  }): Promise<{}>;
    /**
     * Delete a presence log by its unique ID.
     * 
     *
     * @param {string} presenceId - Presence unique ID.
     * @throws {AppwriteException}
     * @returns {Promise<{}>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    delete(presenceId: string): Promise<{}>;
    delete(
        paramsOrFirst: { presenceId: string } | string    
    ): Promise<{}> {
        let params: { presenceId: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { presenceId: string };
        } else {
            params = {
                presenceId: paramsOrFirst as string            
            };
        }

        const presenceId = params.presenceId;

        if (typeof presenceId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "presenceId"');
        }

        const apiPath = '/presences/{presenceId}'.replace('{presenceId}', presenceId);
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('delete', uri, {
            'content-type': 'application/json',
        }, payload);
    }
};

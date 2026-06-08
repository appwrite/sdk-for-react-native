import { Service } from '../service';
import { AppwriteException, Client } from '../client';
import type { Models } from '../models';
import type { UploadProgress, Payload } from '../client';
import * as FileSystem from 'expo-file-system';
import { Platform as RNPlatform } from 'react-native';


export class Apps extends Service {

     constructor(client: Client)
     {
        super(client);
     }

    /**
     * List applications.
     *
     * @param {string[]} params.queries - Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.
     * @param {boolean} params.total - When set to false, the total count returned will be 0 and will not be calculated.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    list(params?: { queries?: string[], total?: boolean  }): Promise<Models.AppsList>;
    /**
     * List applications.
     *
     * @param {string[]} queries - Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.
     * @param {boolean} total - When set to false, the total count returned will be 0 and will not be calculated.
     * @throws {AppwriteException}
     * @returns {Promise<Models.AppsList>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    list(queries?: string[], total?: boolean): Promise<Models.AppsList>;
    list(
        paramsOrFirst?: { queries?: string[], total?: boolean } | string[],
        ...rest: [(boolean)?]    
    ): Promise<Models.AppsList> {
        let params: { queries?: string[], total?: boolean };

        if (!paramsOrFirst || (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { queries?: string[], total?: boolean };
        } else {
            params = {
                queries: paramsOrFirst as string[],
                total: rest[0] as boolean            
            };
        }

        const queries = params.queries;
        const total = params.total;

        const apiPath = '/apps';
        const payload: Payload = {};

        if (typeof queries !== 'undefined') {
            payload['queries'] = queries;
        }

        if (typeof total !== 'undefined') {
            payload['total'] = total;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('get', uri, {
            'X-Appwrite-Project': this.client.config.project,
            'accept': 'application/json',
        }, payload);
    }

    /**
     * Create a new application.
     *
     * @param {string} params.appId - Application ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.
     * @param {string} params.name - Application name.
     * @param {string[]} params.redirectUris - Redirect URIs (array of valid URLs).
     * @param {boolean} params.enabled - Is application enabled?
     * @param {string} params.type - OAuth2 client type. Use `public` for SPAs, mobile, and native apps that cannot keep a `client_secret` — PKCE is then required at the token endpoint. Use `confidential` for server-side clients that present a `client_secret`. Defaults to `confidential`.
     * @param {boolean} params.deviceFlow - Allow this client to use the OAuth2 Device Authorization Grant (RFC 8628) for input-constrained devices such as TVs and CLIs. Defaults to false.
     * @param {string} params.teamId - Team unique ID.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    create(params: { appId: string, name: string, redirectUris: string[], enabled?: boolean, type?: string, deviceFlow?: boolean, teamId?: string  }): Promise<Models.App>;
    /**
     * Create a new application.
     *
     * @param {string} appId - Application ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.
     * @param {string} name - Application name.
     * @param {string[]} redirectUris - Redirect URIs (array of valid URLs).
     * @param {boolean} enabled - Is application enabled?
     * @param {string} type - OAuth2 client type. Use `public` for SPAs, mobile, and native apps that cannot keep a `client_secret` — PKCE is then required at the token endpoint. Use `confidential` for server-side clients that present a `client_secret`. Defaults to `confidential`.
     * @param {boolean} deviceFlow - Allow this client to use the OAuth2 Device Authorization Grant (RFC 8628) for input-constrained devices such as TVs and CLIs. Defaults to false.
     * @param {string} teamId - Team unique ID.
     * @throws {AppwriteException}
     * @returns {Promise<Models.App>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    create(appId: string, name: string, redirectUris: string[], enabled?: boolean, type?: string, deviceFlow?: boolean, teamId?: string): Promise<Models.App>;
    create(
        paramsOrFirst: { appId: string, name: string, redirectUris: string[], enabled?: boolean, type?: string, deviceFlow?: boolean, teamId?: string } | string,
        ...rest: [(string)?, (string[])?, (boolean)?, (string)?, (boolean)?, (string)?]    
    ): Promise<Models.App> {
        let params: { appId: string, name: string, redirectUris: string[], enabled?: boolean, type?: string, deviceFlow?: boolean, teamId?: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { appId: string, name: string, redirectUris: string[], enabled?: boolean, type?: string, deviceFlow?: boolean, teamId?: string };
        } else {
            params = {
                appId: paramsOrFirst as string,
                name: rest[0] as string,
                redirectUris: rest[1] as string[],
                enabled: rest[2] as boolean,
                type: rest[3] as string,
                deviceFlow: rest[4] as boolean,
                teamId: rest[5] as string            
            };
        }

        const appId = params.appId;
        const name = params.name;
        const redirectUris = params.redirectUris;
        const enabled = params.enabled;
        const type = params.type;
        const deviceFlow = params.deviceFlow;
        const teamId = params.teamId;

        if (typeof appId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "appId"');
        }

        if (typeof name === 'undefined') {
            throw new AppwriteException('Missing required parameter: "name"');
        }

        if (typeof redirectUris === 'undefined') {
            throw new AppwriteException('Missing required parameter: "redirectUris"');
        }

        const apiPath = '/apps';
        const payload: Payload = {};

        if (typeof appId !== 'undefined') {
            payload['appId'] = appId;
        }

        if (typeof name !== 'undefined') {
            payload['name'] = name;
        }

        if (typeof redirectUris !== 'undefined') {
            payload['redirectUris'] = redirectUris;
        }

        if (typeof enabled !== 'undefined') {
            payload['enabled'] = enabled;
        }

        if (typeof type !== 'undefined') {
            payload['type'] = type;
        }

        if (typeof deviceFlow !== 'undefined') {
            payload['deviceFlow'] = deviceFlow;
        }

        if (typeof teamId !== 'undefined') {
            payload['teamId'] = teamId;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('post', uri, {
            'X-Appwrite-Project': this.client.config.project,
            'content-type': 'application/json',
            'accept': 'application/json',
        }, payload);
    }

    /**
     * Get an application by its unique ID.
     *
     * @param {string} params.appId - Application unique ID.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    get(params: { appId: string  }): Promise<Models.App>;
    /**
     * Get an application by its unique ID.
     *
     * @param {string} appId - Application unique ID.
     * @throws {AppwriteException}
     * @returns {Promise<Models.App>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    get(appId: string): Promise<Models.App>;
    get(
        paramsOrFirst: { appId: string } | string    
    ): Promise<Models.App> {
        let params: { appId: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { appId: string };
        } else {
            params = {
                appId: paramsOrFirst as string            
            };
        }

        const appId = params.appId;

        if (typeof appId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "appId"');
        }

        const apiPath = '/apps/{appId}'.replace('{appId}', appId);
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('get', uri, {
            'X-Appwrite-Project': this.client.config.project,
            'accept': 'application/json',
        }, payload);
    }

    /**
     * Update an application by its unique ID.
     *
     * @param {string} params.appId - Application unique ID.
     * @param {string} params.name - Application name.
     * @param {boolean} params.enabled - Is application enabled?
     * @param {string[]} params.redirectUris - Redirect URIs (array of valid URLs).
     * @param {string} params.type - OAuth2 client type. Use `public` for SPAs, mobile, and native apps that cannot keep a `client_secret` — PKCE is then required at the token endpoint. Use `confidential` for server-side clients that present a `client_secret`. Defaults to `confidential`.
     * @param {boolean} params.deviceFlow - Allow this client to use the OAuth2 Device Authorization Grant (RFC 8628) for input-constrained devices such as TVs and CLIs. Defaults to false.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    update(params: { appId: string, name: string, enabled?: boolean, redirectUris?: string[], type?: string, deviceFlow?: boolean  }): Promise<Models.App>;
    /**
     * Update an application by its unique ID.
     *
     * @param {string} appId - Application unique ID.
     * @param {string} name - Application name.
     * @param {boolean} enabled - Is application enabled?
     * @param {string[]} redirectUris - Redirect URIs (array of valid URLs).
     * @param {string} type - OAuth2 client type. Use `public` for SPAs, mobile, and native apps that cannot keep a `client_secret` — PKCE is then required at the token endpoint. Use `confidential` for server-side clients that present a `client_secret`. Defaults to `confidential`.
     * @param {boolean} deviceFlow - Allow this client to use the OAuth2 Device Authorization Grant (RFC 8628) for input-constrained devices such as TVs and CLIs. Defaults to false.
     * @throws {AppwriteException}
     * @returns {Promise<Models.App>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    update(appId: string, name: string, enabled?: boolean, redirectUris?: string[], type?: string, deviceFlow?: boolean): Promise<Models.App>;
    update(
        paramsOrFirst: { appId: string, name: string, enabled?: boolean, redirectUris?: string[], type?: string, deviceFlow?: boolean } | string,
        ...rest: [(string)?, (boolean)?, (string[])?, (string)?, (boolean)?]    
    ): Promise<Models.App> {
        let params: { appId: string, name: string, enabled?: boolean, redirectUris?: string[], type?: string, deviceFlow?: boolean };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { appId: string, name: string, enabled?: boolean, redirectUris?: string[], type?: string, deviceFlow?: boolean };
        } else {
            params = {
                appId: paramsOrFirst as string,
                name: rest[0] as string,
                enabled: rest[1] as boolean,
                redirectUris: rest[2] as string[],
                type: rest[3] as string,
                deviceFlow: rest[4] as boolean            
            };
        }

        const appId = params.appId;
        const name = params.name;
        const enabled = params.enabled;
        const redirectUris = params.redirectUris;
        const type = params.type;
        const deviceFlow = params.deviceFlow;

        if (typeof appId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "appId"');
        }

        if (typeof name === 'undefined') {
            throw new AppwriteException('Missing required parameter: "name"');
        }

        const apiPath = '/apps/{appId}'.replace('{appId}', appId);
        const payload: Payload = {};

        if (typeof name !== 'undefined') {
            payload['name'] = name;
        }

        if (typeof enabled !== 'undefined') {
            payload['enabled'] = enabled;
        }

        if (typeof redirectUris !== 'undefined') {
            payload['redirectUris'] = redirectUris;
        }

        if (typeof type !== 'undefined') {
            payload['type'] = type;
        }

        if (typeof deviceFlow !== 'undefined') {
            payload['deviceFlow'] = deviceFlow;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('put', uri, {
            'X-Appwrite-Project': this.client.config.project,
            'content-type': 'application/json',
            'accept': 'application/json',
        }, payload);
    }

    /**
     * Delete an application by its unique ID.
     *
     * @param {string} params.appId - Application unique ID.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    delete(params: { appId: string  }): Promise<{}>;
    /**
     * Delete an application by its unique ID.
     *
     * @param {string} appId - Application unique ID.
     * @throws {AppwriteException}
     * @returns {Promise<{}>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    delete(appId: string): Promise<{}>;
    delete(
        paramsOrFirst: { appId: string } | string    
    ): Promise<{}> {
        let params: { appId: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { appId: string };
        } else {
            params = {
                appId: paramsOrFirst as string            
            };
        }

        const appId = params.appId;

        if (typeof appId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "appId"');
        }

        const apiPath = '/apps/{appId}'.replace('{appId}', appId);
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('delete', uri, {
            'X-Appwrite-Project': this.client.config.project,
            'content-type': 'application/json',
            'accept': 'application/json',
        }, payload);
    }

    /**
     * List client secrets for an application.
     *
     * @param {string} params.appId - Application unique ID.
     * @param {string[]} params.queries - Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.
     * @param {boolean} params.total - When set to false, the total count returned will be 0 and will not be calculated.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    listSecrets(params: { appId: string, queries?: string[], total?: boolean  }): Promise<Models.AppSecretList>;
    /**
     * List client secrets for an application.
     *
     * @param {string} appId - Application unique ID.
     * @param {string[]} queries - Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.
     * @param {boolean} total - When set to false, the total count returned will be 0 and will not be calculated.
     * @throws {AppwriteException}
     * @returns {Promise<Models.AppSecretList>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    listSecrets(appId: string, queries?: string[], total?: boolean): Promise<Models.AppSecretList>;
    listSecrets(
        paramsOrFirst: { appId: string, queries?: string[], total?: boolean } | string,
        ...rest: [(string[])?, (boolean)?]    
    ): Promise<Models.AppSecretList> {
        let params: { appId: string, queries?: string[], total?: boolean };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { appId: string, queries?: string[], total?: boolean };
        } else {
            params = {
                appId: paramsOrFirst as string,
                queries: rest[0] as string[],
                total: rest[1] as boolean            
            };
        }

        const appId = params.appId;
        const queries = params.queries;
        const total = params.total;

        if (typeof appId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "appId"');
        }

        const apiPath = '/apps/{appId}/secrets'.replace('{appId}', appId);
        const payload: Payload = {};

        if (typeof queries !== 'undefined') {
            payload['queries'] = queries;
        }

        if (typeof total !== 'undefined') {
            payload['total'] = total;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('get', uri, {
            'X-Appwrite-Project': this.client.config.project,
            'accept': 'application/json',
        }, payload);
    }

    /**
     * Create a new client secret for an application.
     *
     * @param {string} params.appId - Application unique ID.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    createSecret(params: { appId: string  }): Promise<Models.AppSecretPlaintext>;
    /**
     * Create a new client secret for an application.
     *
     * @param {string} appId - Application unique ID.
     * @throws {AppwriteException}
     * @returns {Promise<Models.AppSecretPlaintext>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    createSecret(appId: string): Promise<Models.AppSecretPlaintext>;
    createSecret(
        paramsOrFirst: { appId: string } | string    
    ): Promise<Models.AppSecretPlaintext> {
        let params: { appId: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { appId: string };
        } else {
            params = {
                appId: paramsOrFirst as string            
            };
        }

        const appId = params.appId;

        if (typeof appId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "appId"');
        }

        const apiPath = '/apps/{appId}/secrets'.replace('{appId}', appId);
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('post', uri, {
            'X-Appwrite-Project': this.client.config.project,
            'content-type': 'application/json',
            'accept': 'application/json',
        }, payload);
    }

    /**
     * Get an application client secret by its unique ID.
     *
     * @param {string} params.appId - Application unique ID.
     * @param {string} params.secretId - Secret unique ID.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    getSecret(params: { appId: string, secretId: string  }): Promise<Models.AppSecret>;
    /**
     * Get an application client secret by its unique ID.
     *
     * @param {string} appId - Application unique ID.
     * @param {string} secretId - Secret unique ID.
     * @throws {AppwriteException}
     * @returns {Promise<Models.AppSecret>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    getSecret(appId: string, secretId: string): Promise<Models.AppSecret>;
    getSecret(
        paramsOrFirst: { appId: string, secretId: string } | string,
        ...rest: [(string)?]    
    ): Promise<Models.AppSecret> {
        let params: { appId: string, secretId: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { appId: string, secretId: string };
        } else {
            params = {
                appId: paramsOrFirst as string,
                secretId: rest[0] as string            
            };
        }

        const appId = params.appId;
        const secretId = params.secretId;

        if (typeof appId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "appId"');
        }

        if (typeof secretId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "secretId"');
        }

        const apiPath = '/apps/{appId}/secrets/{secretId}'.replace('{appId}', appId).replace('{secretId}', secretId);
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('get', uri, {
            'X-Appwrite-Project': this.client.config.project,
            'accept': 'application/json',
        }, payload);
    }

    /**
     * Delete an application client secret by its unique ID.
     *
     * @param {string} params.appId - Application unique ID.
     * @param {string} params.secretId - Secret unique ID.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    deleteSecret(params: { appId: string, secretId: string  }): Promise<{}>;
    /**
     * Delete an application client secret by its unique ID.
     *
     * @param {string} appId - Application unique ID.
     * @param {string} secretId - Secret unique ID.
     * @throws {AppwriteException}
     * @returns {Promise<{}>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    deleteSecret(appId: string, secretId: string): Promise<{}>;
    deleteSecret(
        paramsOrFirst: { appId: string, secretId: string } | string,
        ...rest: [(string)?]    
    ): Promise<{}> {
        let params: { appId: string, secretId: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { appId: string, secretId: string };
        } else {
            params = {
                appId: paramsOrFirst as string,
                secretId: rest[0] as string            
            };
        }

        const appId = params.appId;
        const secretId = params.secretId;

        if (typeof appId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "appId"');
        }

        if (typeof secretId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "secretId"');
        }

        const apiPath = '/apps/{appId}/secrets/{secretId}'.replace('{appId}', appId).replace('{secretId}', secretId);
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('delete', uri, {
            'X-Appwrite-Project': this.client.config.project,
            'content-type': 'application/json',
            'accept': 'application/json',
        }, payload);
    }

    /**
     * Transfer an application to another team by its unique ID.
     *
     * @param {string} params.appId - Application unique ID.
     * @param {string} params.teamId - Team ID of the team to transfer application to.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    updateTeam(params: { appId: string, teamId: string  }): Promise<Models.App>;
    /**
     * Transfer an application to another team by its unique ID.
     *
     * @param {string} appId - Application unique ID.
     * @param {string} teamId - Team ID of the team to transfer application to.
     * @throws {AppwriteException}
     * @returns {Promise<Models.App>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    updateTeam(appId: string, teamId: string): Promise<Models.App>;
    updateTeam(
        paramsOrFirst: { appId: string, teamId: string } | string,
        ...rest: [(string)?]    
    ): Promise<Models.App> {
        let params: { appId: string, teamId: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { appId: string, teamId: string };
        } else {
            params = {
                appId: paramsOrFirst as string,
                teamId: rest[0] as string            
            };
        }

        const appId = params.appId;
        const teamId = params.teamId;

        if (typeof appId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "appId"');
        }

        if (typeof teamId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "teamId"');
        }

        const apiPath = '/apps/{appId}/team'.replace('{appId}', appId);
        const payload: Payload = {};

        if (typeof teamId !== 'undefined') {
            payload['teamId'] = teamId;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('patch', uri, {
            'X-Appwrite-Project': this.client.config.project,
            'content-type': 'application/json',
            'accept': 'application/json',
        }, payload);
    }

    /**
     * Revoke all tokens for an application by its unique ID.
     *
     * @param {string} params.appId - Application unique ID.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    deleteTokens(params: { appId: string  }): Promise<{}>;
    /**
     * Revoke all tokens for an application by its unique ID.
     *
     * @param {string} appId - Application unique ID.
     * @throws {AppwriteException}
     * @returns {Promise<{}>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    deleteTokens(appId: string): Promise<{}>;
    deleteTokens(
        paramsOrFirst: { appId: string } | string    
    ): Promise<{}> {
        let params: { appId: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { appId: string };
        } else {
            params = {
                appId: paramsOrFirst as string            
            };
        }

        const appId = params.appId;

        if (typeof appId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "appId"');
        }

        const apiPath = '/apps/{appId}/tokens'.replace('{appId}', appId);
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('delete', uri, {
            'X-Appwrite-Project': this.client.config.project,
            'content-type': 'application/json',
            'accept': 'application/json',
        }, payload);
    }
};

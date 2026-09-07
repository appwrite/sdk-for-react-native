import { Service } from '../service';
import { AppwriteException, Client } from '../client';
import type { Models } from '../models';
import type { Payload } from '../client';

export class Organization extends Service {
    constructor(client: Client) {
        super(client);
    }

    /**
     * List app installations on the organization. Any organization member can read installations.
     *
     * @param {string[]} params.queries - Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.
     * @param {boolean} params.total - When set to false, the total count returned will be 0 and will not be calculated.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    listInstallations(params?: {
        queries?: string[];
        total?: boolean;
    }): Promise<Models.AppInstallationList>;
    /**
     * List app installations on the organization. Any organization member can read installations.
     *
     * @param {string[]} queries - Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.
     * @param {boolean} total - When set to false, the total count returned will be 0 and will not be calculated.
     * @throws {AppwriteException}
     * @returns {Promise<Models.AppInstallationList>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    listInstallations(
        queries?: string[],
        total?: boolean,
    ): Promise<Models.AppInstallationList>;
    listInstallations(
        paramsOrFirst?: { queries?: string[]; total?: boolean } | string[],
        ...rest: [boolean?]
    ): Promise<Models.AppInstallationList> {
        let params: { queries?: string[]; total?: boolean };

        if (
            (typeof paramsOrFirst === 'undefined' && rest.length === 0) ||
            (paramsOrFirst &&
                typeof paramsOrFirst === 'object' &&
                !Array.isArray(paramsOrFirst))
        ) {
            params = (paramsOrFirst || {}) as {
                queries?: string[];
                total?: boolean;
            };
        } else {
            params = {
                queries: paramsOrFirst as string[],
                total: rest[0] as boolean,
            };
        }

        const queries = params.queries;
        const total = params.total;

        const apiPath = '/organization/installations';
        const payload: Payload = {};

        if (typeof queries !== 'undefined') {
            payload['queries'] = queries;
        }

        if (typeof total !== 'undefined') {
            payload['total'] = total;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call(
            'get',
            uri,
            {
                'X-Appwrite-Project': this.client.config.project,
                accept: 'application/json',
            },
            payload,
        );
    }

    /**
     * Install an app on the organization. Only organization members with the owner role can install apps. The installation is granted the scopes the app currently requests.
     *
     * @param {string} params.appId - Application unique ID.
     * @param {string} params.authorizationDetails - Authorization details granted to the installation as a JSON array of objects, each with a `type` and app-defined fields. The Appwrite Console stores authorized project IDs here.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    createInstallation(params: {
        appId: string;
        authorizationDetails?: string;
    }): Promise<Models.AppInstallation>;
    /**
     * Install an app on the organization. Only organization members with the owner role can install apps. The installation is granted the scopes the app currently requests.
     *
     * @param {string} appId - Application unique ID.
     * @param {string} authorizationDetails - Authorization details granted to the installation as a JSON array of objects, each with a `type` and app-defined fields. The Appwrite Console stores authorized project IDs here.
     * @throws {AppwriteException}
     * @returns {Promise<Models.AppInstallation>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    createInstallation(
        appId: string,
        authorizationDetails?: string,
    ): Promise<Models.AppInstallation>;
    createInstallation(
        paramsOrFirst:
            { appId: string; authorizationDetails?: string } | string,
        ...rest: [string?]
    ): Promise<Models.AppInstallation> {
        let params: { appId: string; authorizationDetails?: string };

        if (
            paramsOrFirst &&
            typeof paramsOrFirst === 'object' &&
            !Array.isArray(paramsOrFirst)
        ) {
            params = (paramsOrFirst || {}) as {
                appId: string;
                authorizationDetails?: string;
            };
        } else {
            params = {
                appId: paramsOrFirst as string,
                authorizationDetails: rest[0] as string,
            };
        }

        const appId = params.appId;
        const authorizationDetails = params.authorizationDetails;

        if (typeof appId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "appId"');
        }

        const apiPath = '/organization/installations';
        const payload: Payload = {};

        if (typeof appId !== 'undefined') {
            payload['appId'] = appId;
        }

        if (typeof authorizationDetails !== 'undefined') {
            payload['authorizationDetails'] = authorizationDetails;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call(
            'post',
            uri,
            {
                'X-Appwrite-Project': this.client.config.project,
                'content-type': 'application/json',
                accept: 'application/json',
            },
            payload,
        );
    }

    /**
     * Get an app installation on the organization by its unique ID. Any organization member can read installations.
     *
     * @param {string} params.installationId - Installation unique ID.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    getInstallation(params: {
        installationId: string;
    }): Promise<Models.AppInstallation>;
    /**
     * Get an app installation on the organization by its unique ID. Any organization member can read installations.
     *
     * @param {string} installationId - Installation unique ID.
     * @throws {AppwriteException}
     * @returns {Promise<Models.AppInstallation>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    getInstallation(installationId: string): Promise<Models.AppInstallation>;
    getInstallation(
        paramsOrFirst: { installationId: string } | string,
    ): Promise<Models.AppInstallation> {
        let params: { installationId: string };

        if (
            paramsOrFirst &&
            typeof paramsOrFirst === 'object' &&
            !Array.isArray(paramsOrFirst)
        ) {
            params = (paramsOrFirst || {}) as { installationId: string };
        } else {
            params = {
                installationId: paramsOrFirst as string,
            };
        }

        const installationId = params.installationId;

        if (typeof installationId === 'undefined') {
            throw new AppwriteException(
                'Missing required parameter: "installationId"',
            );
        }

        const apiPath = '/organization/installations/{installationId}'.replace(
            '{installationId}',
            encodeURIComponent(String(installationId)),
        );
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call(
            'get',
            uri,
            {
                'X-Appwrite-Project': this.client.config.project,
                accept: 'application/json',
            },
            payload,
        );
    }

    /**
     * Update an app installation on the organization. Only organization members with the owner role can update installations. The installation's granted scopes are refreshed to the scopes the app currently requests; previously issued installation access tokens are revoked.
     *
     * @param {string} params.installationId - Installation unique ID.
     * @param {string} params.authorizationDetails - Authorization details granted to the installation as a JSON array of objects, each with a `type` and app-defined fields. Omit to keep the current value.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    updateInstallation(params: {
        installationId: string;
        authorizationDetails?: string;
    }): Promise<Models.AppInstallation>;
    /**
     * Update an app installation on the organization. Only organization members with the owner role can update installations. The installation's granted scopes are refreshed to the scopes the app currently requests; previously issued installation access tokens are revoked.
     *
     * @param {string} installationId - Installation unique ID.
     * @param {string} authorizationDetails - Authorization details granted to the installation as a JSON array of objects, each with a `type` and app-defined fields. Omit to keep the current value.
     * @throws {AppwriteException}
     * @returns {Promise<Models.AppInstallation>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    updateInstallation(
        installationId: string,
        authorizationDetails?: string,
    ): Promise<Models.AppInstallation>;
    updateInstallation(
        paramsOrFirst:
            { installationId: string; authorizationDetails?: string } | string,
        ...rest: [string?]
    ): Promise<Models.AppInstallation> {
        let params: { installationId: string; authorizationDetails?: string };

        if (
            paramsOrFirst &&
            typeof paramsOrFirst === 'object' &&
            !Array.isArray(paramsOrFirst)
        ) {
            params = (paramsOrFirst || {}) as {
                installationId: string;
                authorizationDetails?: string;
            };
        } else {
            params = {
                installationId: paramsOrFirst as string,
                authorizationDetails: rest[0] as string,
            };
        }

        const installationId = params.installationId;
        const authorizationDetails = params.authorizationDetails;

        if (typeof installationId === 'undefined') {
            throw new AppwriteException(
                'Missing required parameter: "installationId"',
            );
        }

        const apiPath = '/organization/installations/{installationId}'.replace(
            '{installationId}',
            encodeURIComponent(String(installationId)),
        );
        const payload: Payload = {};

        if (typeof authorizationDetails !== 'undefined') {
            payload['authorizationDetails'] = authorizationDetails;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call(
            'put',
            uri,
            {
                'X-Appwrite-Project': this.client.config.project,
                'content-type': 'application/json',
                accept: 'application/json',
            },
            payload,
        );
    }

    /**
     * Uninstall an app from the organization by its installation ID. Only organization members with the owner role can remove installations. Previously issued installation access tokens are revoked.
     *
     * @param {string} params.installationId - Installation unique ID.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    deleteInstallation(params: { installationId: string }): Promise<{}>;
    /**
     * Uninstall an app from the organization by its installation ID. Only organization members with the owner role can remove installations. Previously issued installation access tokens are revoked.
     *
     * @param {string} installationId - Installation unique ID.
     * @throws {AppwriteException}
     * @returns {Promise<{}>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    deleteInstallation(installationId: string): Promise<{}>;
    deleteInstallation(
        paramsOrFirst: { installationId: string } | string,
    ): Promise<{}> {
        let params: { installationId: string };

        if (
            paramsOrFirst &&
            typeof paramsOrFirst === 'object' &&
            !Array.isArray(paramsOrFirst)
        ) {
            params = (paramsOrFirst || {}) as { installationId: string };
        } else {
            params = {
                installationId: paramsOrFirst as string,
            };
        }

        const installationId = params.installationId;

        if (typeof installationId === 'undefined') {
            throw new AppwriteException(
                'Missing required parameter: "installationId"',
            );
        }

        const apiPath = '/organization/installations/{installationId}'.replace(
            '{installationId}',
            encodeURIComponent(String(installationId)),
        );
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call(
            'delete',
            uri,
            {
                'X-Appwrite-Project': this.client.config.project,
                'content-type': 'application/json',
                accept: 'application/json',
            },
            payload,
        );
    }
}

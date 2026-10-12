import { Service } from '../service';
import { AppwriteException, Client } from '../client';
import type { Models } from '../models';
import type { Payload } from '../client';

export class Apps extends Service {
    constructor(client: Client) {
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
    list(params?: {
        queries?: string[];
        total?: boolean;
    }): Promise<Models.AppsList>;
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
        paramsOrFirst?: { queries?: string[]; total?: boolean } | string[],
        ...rest: [boolean?]
    ): Promise<Models.AppsList> {
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

        const apiPath = '/apps';
        const apiPayload: Payload = {};

        if (typeof queries !== 'undefined') {
            apiPayload['queries'] = queries;
        }

        if (typeof total !== 'undefined') {
            apiPayload['total'] = total;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call(
            'get',
            uri,
            {
                'X-Appwrite-Project': this.client.config.project,
                accept: 'application/json',
            },
            apiPayload,
        );
    }

    /**
     * Create a new application.
     *
     * @param {string} params.appId - Application ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.
     * @param {string} params.name - Application name.
     * @param {string[]} params.redirectUris - Redirect URIs. Each must be an https URL, an http loopback URL (localhost, 127.0.0.1, [::1]), or a private-use scheme URI (e.g. com.example.app:/oauth), and must not contain a fragment.
     * @param {string} params.description - Application description shown to users during OAuth2 consent.
     * @param {string} params.clientUri - Application homepage URL shown to users during OAuth2 consent.
     * @param {string} params.logoUri - Application logo URL shown to users during OAuth2 consent.
     * @param {string} params.privacyPolicyUrl - Application privacy policy URL shown to users during OAuth2 consent.
     * @param {string} params.termsUrl - Application terms of service URL shown to users during OAuth2 consent.
     * @param {string[]} params.contacts - Application support or security contact emails. Maximum of 100 contacts are allowed.
     * @param {string} params.tagline - Application tagline shown to users during OAuth2 consent.
     * @param {string[]} params.tags - Application tags shown to users during OAuth2 consent. Maximum of 100 tags are allowed, each up to 64 characters long.
     * @param {string[]} params.images - Application image URLs shown to users during OAuth2 consent. Maximum of 100 images are allowed.
     * @param {string} params.supportUrl - Application support URL shown to users during OAuth2 consent.
     * @param {string} params.dataDeletionUrl - Application data deletion URL shown to users during OAuth2 consent.
     * @param {string[]} params.postLogoutRedirectUris - Post-logout redirect URIs for OpenID Connect RP-Initiated Logout. Each must be an https URL, an http loopback URL, or a private-use scheme URI, and must not contain a fragment. After ending the user session, the logout endpoint only redirects to URIs in this list.
     * @param {boolean} params.enabled - Is application enabled?
     * @param {string} params.type - OAuth2 client type. Use `public` for SPAs, mobile, and native apps that cannot keep a `client_secret` — PKCE is then required at the token endpoint. Use `confidential` for server-side clients that present a `client_secret`. Defaults to `confidential`.
     * @param {boolean} params.deviceFlow - Allow this client to use the OAuth2 Device Authorization Grant (RFC 8628) for input-constrained devices such as TVs and CLIs. Defaults to false.
     * @param {string} params.teamId - Team unique ID.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    create(params: {
        appId: string;
        name: string;
        redirectUris: string[];
        description?: string;
        clientUri?: string;
        logoUri?: string;
        privacyPolicyUrl?: string;
        termsUrl?: string;
        contacts?: string[];
        tagline?: string;
        tags?: string[];
        images?: string[];
        supportUrl?: string;
        dataDeletionUrl?: string;
        postLogoutRedirectUris?: string[];
        enabled?: boolean;
        type?: string;
        deviceFlow?: boolean;
        teamId?: string;
    }): Promise<Models.App>;
    /**
     * Create a new application.
     *
     * @param {string} appId - Application ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.
     * @param {string} name - Application name.
     * @param {string[]} redirectUris - Redirect URIs. Each must be an https URL, an http loopback URL (localhost, 127.0.0.1, [::1]), or a private-use scheme URI (e.g. com.example.app:/oauth), and must not contain a fragment.
     * @param {string} description - Application description shown to users during OAuth2 consent.
     * @param {string} clientUri - Application homepage URL shown to users during OAuth2 consent.
     * @param {string} logoUri - Application logo URL shown to users during OAuth2 consent.
     * @param {string} privacyPolicyUrl - Application privacy policy URL shown to users during OAuth2 consent.
     * @param {string} termsUrl - Application terms of service URL shown to users during OAuth2 consent.
     * @param {string[]} contacts - Application support or security contact emails. Maximum of 100 contacts are allowed.
     * @param {string} tagline - Application tagline shown to users during OAuth2 consent.
     * @param {string[]} tags - Application tags shown to users during OAuth2 consent. Maximum of 100 tags are allowed, each up to 64 characters long.
     * @param {string[]} images - Application image URLs shown to users during OAuth2 consent. Maximum of 100 images are allowed.
     * @param {string} supportUrl - Application support URL shown to users during OAuth2 consent.
     * @param {string} dataDeletionUrl - Application data deletion URL shown to users during OAuth2 consent.
     * @param {string[]} postLogoutRedirectUris - Post-logout redirect URIs for OpenID Connect RP-Initiated Logout. Each must be an https URL, an http loopback URL, or a private-use scheme URI, and must not contain a fragment. After ending the user session, the logout endpoint only redirects to URIs in this list.
     * @param {boolean} enabled - Is application enabled?
     * @param {string} type - OAuth2 client type. Use `public` for SPAs, mobile, and native apps that cannot keep a `client_secret` — PKCE is then required at the token endpoint. Use `confidential` for server-side clients that present a `client_secret`. Defaults to `confidential`.
     * @param {boolean} deviceFlow - Allow this client to use the OAuth2 Device Authorization Grant (RFC 8628) for input-constrained devices such as TVs and CLIs. Defaults to false.
     * @param {string} teamId - Team unique ID.
     * @throws {AppwriteException}
     * @returns {Promise<Models.App>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    create(
        appId: string,
        name: string,
        redirectUris: string[],
        description?: string,
        clientUri?: string,
        logoUri?: string,
        privacyPolicyUrl?: string,
        termsUrl?: string,
        contacts?: string[],
        tagline?: string,
        tags?: string[],
        images?: string[],
        supportUrl?: string,
        dataDeletionUrl?: string,
        postLogoutRedirectUris?: string[],
        enabled?: boolean,
        type?: string,
        deviceFlow?: boolean,
        teamId?: string,
    ): Promise<Models.App>;
    create(
        paramsOrFirst:
            | {
                  appId: string;
                  name: string;
                  redirectUris: string[];
                  description?: string;
                  clientUri?: string;
                  logoUri?: string;
                  privacyPolicyUrl?: string;
                  termsUrl?: string;
                  contacts?: string[];
                  tagline?: string;
                  tags?: string[];
                  images?: string[];
                  supportUrl?: string;
                  dataDeletionUrl?: string;
                  postLogoutRedirectUris?: string[];
                  enabled?: boolean;
                  type?: string;
                  deviceFlow?: boolean;
                  teamId?: string;
              }
            | string,
        ...rest: [
            string?,
            string[]?,
            string?,
            string?,
            string?,
            string?,
            string?,
            string[]?,
            string?,
            string[]?,
            string[]?,
            string?,
            string?,
            string[]?,
            boolean?,
            string?,
            boolean?,
            string?,
        ]
    ): Promise<Models.App> {
        let params: {
            appId: string;
            name: string;
            redirectUris: string[];
            description?: string;
            clientUri?: string;
            logoUri?: string;
            privacyPolicyUrl?: string;
            termsUrl?: string;
            contacts?: string[];
            tagline?: string;
            tags?: string[];
            images?: string[];
            supportUrl?: string;
            dataDeletionUrl?: string;
            postLogoutRedirectUris?: string[];
            enabled?: boolean;
            type?: string;
            deviceFlow?: boolean;
            teamId?: string;
        };

        if (
            paramsOrFirst &&
            typeof paramsOrFirst === 'object' &&
            !Array.isArray(paramsOrFirst)
        ) {
            params = (paramsOrFirst || {}) as {
                appId: string;
                name: string;
                redirectUris: string[];
                description?: string;
                clientUri?: string;
                logoUri?: string;
                privacyPolicyUrl?: string;
                termsUrl?: string;
                contacts?: string[];
                tagline?: string;
                tags?: string[];
                images?: string[];
                supportUrl?: string;
                dataDeletionUrl?: string;
                postLogoutRedirectUris?: string[];
                enabled?: boolean;
                type?: string;
                deviceFlow?: boolean;
                teamId?: string;
            };
        } else {
            params = {
                appId: paramsOrFirst as string,
                name: rest[0] as string,
                redirectUris: rest[1] as string[],
                description: rest[2] as string,
                clientUri: rest[3] as string,
                logoUri: rest[4] as string,
                privacyPolicyUrl: rest[5] as string,
                termsUrl: rest[6] as string,
                contacts: rest[7] as string[],
                tagline: rest[8] as string,
                tags: rest[9] as string[],
                images: rest[10] as string[],
                supportUrl: rest[11] as string,
                dataDeletionUrl: rest[12] as string,
                postLogoutRedirectUris: rest[13] as string[],
                enabled: rest[14] as boolean,
                type: rest[15] as string,
                deviceFlow: rest[16] as boolean,
                teamId: rest[17] as string,
            };
        }

        const appId = params.appId;
        const name = params.name;
        const redirectUris = params.redirectUris;
        const description = params.description;
        const clientUri = params.clientUri;
        const logoUri = params.logoUri;
        const privacyPolicyUrl = params.privacyPolicyUrl;
        const termsUrl = params.termsUrl;
        const contacts = params.contacts;
        const tagline = params.tagline;
        const tags = params.tags;
        const images = params.images;
        const supportUrl = params.supportUrl;
        const dataDeletionUrl = params.dataDeletionUrl;
        const postLogoutRedirectUris = params.postLogoutRedirectUris;
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
            throw new AppwriteException(
                'Missing required parameter: "redirectUris"',
            );
        }

        const apiPath = '/apps';
        const apiPayload: Payload = {};

        if (typeof appId !== 'undefined') {
            apiPayload['appId'] = appId;
        }

        if (typeof name !== 'undefined') {
            apiPayload['name'] = name;
        }

        if (typeof description !== 'undefined') {
            apiPayload['description'] = description;
        }

        if (typeof clientUri !== 'undefined') {
            apiPayload['clientUri'] = clientUri;
        }

        if (typeof logoUri !== 'undefined') {
            apiPayload['logoUri'] = logoUri;
        }

        if (typeof privacyPolicyUrl !== 'undefined') {
            apiPayload['privacyPolicyUrl'] = privacyPolicyUrl;
        }

        if (typeof termsUrl !== 'undefined') {
            apiPayload['termsUrl'] = termsUrl;
        }

        if (typeof contacts !== 'undefined') {
            apiPayload['contacts'] = contacts;
        }

        if (typeof tagline !== 'undefined') {
            apiPayload['tagline'] = tagline;
        }

        if (typeof tags !== 'undefined') {
            apiPayload['tags'] = tags;
        }

        if (typeof images !== 'undefined') {
            apiPayload['images'] = images;
        }

        if (typeof supportUrl !== 'undefined') {
            apiPayload['supportUrl'] = supportUrl;
        }

        if (typeof dataDeletionUrl !== 'undefined') {
            apiPayload['dataDeletionUrl'] = dataDeletionUrl;
        }

        if (typeof redirectUris !== 'undefined') {
            apiPayload['redirectUris'] = redirectUris;
        }

        if (typeof postLogoutRedirectUris !== 'undefined') {
            apiPayload['postLogoutRedirectUris'] = postLogoutRedirectUris;
        }

        if (typeof enabled !== 'undefined') {
            apiPayload['enabled'] = enabled;
        }

        if (typeof type !== 'undefined') {
            apiPayload['type'] = type;
        }

        if (typeof deviceFlow !== 'undefined') {
            apiPayload['deviceFlow'] = deviceFlow;
        }

        if (typeof teamId !== 'undefined') {
            apiPayload['teamId'] = teamId;
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
            apiPayload,
        );
    }

    /**
     * List scopes an application can request when installed on a team.
     *
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    listInstallationScopes(): Promise<Models.AppScopeList> {
        const apiPath = '/apps/scopes/installations';
        const apiPayload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call(
            'get',
            uri,
            {
                'X-Appwrite-Project': this.client.config.project,
                accept: 'application/json',
            },
            apiPayload,
        );
    }

    /**
     * List scopes an application can request during the OAuth2 flow.
     *
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    listOAuth2Scopes(): Promise<Models.AppScopeList> {
        const apiPath = '/apps/scopes/oauth2';
        const apiPayload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call(
            'get',
            uri,
            {
                'X-Appwrite-Project': this.client.config.project,
                accept: 'application/json',
            },
            apiPayload,
        );
    }

    /**
     * Get an application by its unique ID.
     *
     * @param {string} params.appId - Application unique ID.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    get(params: { appId: string }): Promise<Models.App>;
    /**
     * Get an application by its unique ID.
     *
     * @param {string} appId - Application unique ID.
     * @throws {AppwriteException}
     * @returns {Promise<Models.App>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    get(appId: string): Promise<Models.App>;
    get(paramsOrFirst: { appId: string } | string): Promise<Models.App> {
        let params: { appId: string };

        if (
            paramsOrFirst &&
            typeof paramsOrFirst === 'object' &&
            !Array.isArray(paramsOrFirst)
        ) {
            params = (paramsOrFirst || {}) as { appId: string };
        } else {
            params = {
                appId: paramsOrFirst as string,
            };
        }

        const appId = params.appId;

        if (typeof appId === 'undefined' || appId === '') {
            throw new AppwriteException('Missing required parameter: "appId"');
        }

        const apiPath = '/apps/{appId}'.replace(
            '{appId}',
            encodeURIComponent(String(appId)),
        );
        const apiPayload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call(
            'get',
            uri,
            {
                'X-Appwrite-Project': this.client.config.project,
                accept: 'application/json',
            },
            apiPayload,
        );
    }

    /**
     * Update an application by its unique ID.
     *
     * @param {string} params.appId - Application unique ID.
     * @param {string} params.name - Application name.
     * @param {string} params.description - Application description shown to users during OAuth2 consent.
     * @param {string} params.clientUri - Application homepage URL shown to users during OAuth2 consent.
     * @param {string} params.logoUri - Application logo URL shown to users during OAuth2 consent.
     * @param {string} params.privacyPolicyUrl - Application privacy policy URL shown to users during OAuth2 consent.
     * @param {string} params.termsUrl - Application terms of service URL shown to users during OAuth2 consent.
     * @param {string[]} params.contacts - Application support or security contact emails. Maximum of 100 contacts are allowed.
     * @param {string} params.tagline - Application tagline shown to users during OAuth2 consent.
     * @param {string[]} params.tags - Application tags shown to users during OAuth2 consent. Maximum of 100 tags are allowed, each up to 64 characters long.
     * @param {string[]} params.images - Application image URLs shown to users during OAuth2 consent. Maximum of 100 images are allowed.
     * @param {string} params.supportUrl - Application support URL shown to users during OAuth2 consent.
     * @param {string} params.dataDeletionUrl - Application data deletion URL shown to users during OAuth2 consent.
     * @param {boolean} params.enabled - Is application enabled?
     * @param {string[]} params.redirectUris - Redirect URIs. Each must be an https URL, an http loopback URL (localhost, 127.0.0.1, [::1]), or a private-use scheme URI (e.g. com.example.app:/oauth), and must not contain a fragment.
     * @param {string[]} params.postLogoutRedirectUris - Post-logout redirect URIs for OpenID Connect RP-Initiated Logout. Each must be an https URL, an http loopback URL, or a private-use scheme URI, and must not contain a fragment. After ending the user session, the logout endpoint only redirects to URIs in this list.
     * @param {string} params.type - OAuth2 client type. Use `public` for SPAs, mobile, and native apps that cannot keep a `client_secret` — PKCE is then required at the token endpoint. Use `confidential` for server-side clients that present a `client_secret`. Defaults to `confidential`.
     * @param {boolean} params.deviceFlow - Allow this client to use the OAuth2 Device Authorization Grant (RFC 8628) for input-constrained devices such as TVs and CLIs. Defaults to false.
     * @param {string[]} params.installationScopes - Scopes the application requests when installed on a team. Only scopes allowed by the project's OAuth2 server installation scopes configuration are accepted; use the list installation scopes endpoint to discover available values. Maximum of 100 scopes are allowed.
     * @param {string} params.installationRedirectUrl - URL users are redirected to after creating or updating an installation of this application. Must be an https URL, an http loopback URL (localhost, 127.0.0.1, [::1]), or a private-use scheme URI, and must not contain a fragment. Leave empty for no redirect.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    update(params: {
        appId: string;
        name: string;
        description?: string;
        clientUri?: string;
        logoUri?: string;
        privacyPolicyUrl?: string;
        termsUrl?: string;
        contacts?: string[];
        tagline?: string;
        tags?: string[];
        images?: string[];
        supportUrl?: string;
        dataDeletionUrl?: string;
        enabled?: boolean;
        redirectUris?: string[];
        postLogoutRedirectUris?: string[];
        type?: string;
        deviceFlow?: boolean;
        installationScopes?: string[];
        installationRedirectUrl?: string;
    }): Promise<Models.App>;
    /**
     * Update an application by its unique ID.
     *
     * @param {string} appId - Application unique ID.
     * @param {string} name - Application name.
     * @param {string} description - Application description shown to users during OAuth2 consent.
     * @param {string} clientUri - Application homepage URL shown to users during OAuth2 consent.
     * @param {string} logoUri - Application logo URL shown to users during OAuth2 consent.
     * @param {string} privacyPolicyUrl - Application privacy policy URL shown to users during OAuth2 consent.
     * @param {string} termsUrl - Application terms of service URL shown to users during OAuth2 consent.
     * @param {string[]} contacts - Application support or security contact emails. Maximum of 100 contacts are allowed.
     * @param {string} tagline - Application tagline shown to users during OAuth2 consent.
     * @param {string[]} tags - Application tags shown to users during OAuth2 consent. Maximum of 100 tags are allowed, each up to 64 characters long.
     * @param {string[]} images - Application image URLs shown to users during OAuth2 consent. Maximum of 100 images are allowed.
     * @param {string} supportUrl - Application support URL shown to users during OAuth2 consent.
     * @param {string} dataDeletionUrl - Application data deletion URL shown to users during OAuth2 consent.
     * @param {boolean} enabled - Is application enabled?
     * @param {string[]} redirectUris - Redirect URIs. Each must be an https URL, an http loopback URL (localhost, 127.0.0.1, [::1]), or a private-use scheme URI (e.g. com.example.app:/oauth), and must not contain a fragment.
     * @param {string[]} postLogoutRedirectUris - Post-logout redirect URIs for OpenID Connect RP-Initiated Logout. Each must be an https URL, an http loopback URL, or a private-use scheme URI, and must not contain a fragment. After ending the user session, the logout endpoint only redirects to URIs in this list.
     * @param {string} type - OAuth2 client type. Use `public` for SPAs, mobile, and native apps that cannot keep a `client_secret` — PKCE is then required at the token endpoint. Use `confidential` for server-side clients that present a `client_secret`. Defaults to `confidential`.
     * @param {boolean} deviceFlow - Allow this client to use the OAuth2 Device Authorization Grant (RFC 8628) for input-constrained devices such as TVs and CLIs. Defaults to false.
     * @param {string[]} installationScopes - Scopes the application requests when installed on a team. Only scopes allowed by the project's OAuth2 server installation scopes configuration are accepted; use the list installation scopes endpoint to discover available values. Maximum of 100 scopes are allowed.
     * @param {string} installationRedirectUrl - URL users are redirected to after creating or updating an installation of this application. Must be an https URL, an http loopback URL (localhost, 127.0.0.1, [::1]), or a private-use scheme URI, and must not contain a fragment. Leave empty for no redirect.
     * @throws {AppwriteException}
     * @returns {Promise<Models.App>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    update(
        appId: string,
        name: string,
        description?: string,
        clientUri?: string,
        logoUri?: string,
        privacyPolicyUrl?: string,
        termsUrl?: string,
        contacts?: string[],
        tagline?: string,
        tags?: string[],
        images?: string[],
        supportUrl?: string,
        dataDeletionUrl?: string,
        enabled?: boolean,
        redirectUris?: string[],
        postLogoutRedirectUris?: string[],
        type?: string,
        deviceFlow?: boolean,
        installationScopes?: string[],
        installationRedirectUrl?: string,
    ): Promise<Models.App>;
    update(
        paramsOrFirst:
            | {
                  appId: string;
                  name: string;
                  description?: string;
                  clientUri?: string;
                  logoUri?: string;
                  privacyPolicyUrl?: string;
                  termsUrl?: string;
                  contacts?: string[];
                  tagline?: string;
                  tags?: string[];
                  images?: string[];
                  supportUrl?: string;
                  dataDeletionUrl?: string;
                  enabled?: boolean;
                  redirectUris?: string[];
                  postLogoutRedirectUris?: string[];
                  type?: string;
                  deviceFlow?: boolean;
                  installationScopes?: string[];
                  installationRedirectUrl?: string;
              }
            | string,
        ...rest: [
            string?,
            string?,
            string?,
            string?,
            string?,
            string?,
            string[]?,
            string?,
            string[]?,
            string[]?,
            string?,
            string?,
            boolean?,
            string[]?,
            string[]?,
            string?,
            boolean?,
            string[]?,
            string?,
        ]
    ): Promise<Models.App> {
        let params: {
            appId: string;
            name: string;
            description?: string;
            clientUri?: string;
            logoUri?: string;
            privacyPolicyUrl?: string;
            termsUrl?: string;
            contacts?: string[];
            tagline?: string;
            tags?: string[];
            images?: string[];
            supportUrl?: string;
            dataDeletionUrl?: string;
            enabled?: boolean;
            redirectUris?: string[];
            postLogoutRedirectUris?: string[];
            type?: string;
            deviceFlow?: boolean;
            installationScopes?: string[];
            installationRedirectUrl?: string;
        };

        if (
            paramsOrFirst &&
            typeof paramsOrFirst === 'object' &&
            !Array.isArray(paramsOrFirst)
        ) {
            params = (paramsOrFirst || {}) as {
                appId: string;
                name: string;
                description?: string;
                clientUri?: string;
                logoUri?: string;
                privacyPolicyUrl?: string;
                termsUrl?: string;
                contacts?: string[];
                tagline?: string;
                tags?: string[];
                images?: string[];
                supportUrl?: string;
                dataDeletionUrl?: string;
                enabled?: boolean;
                redirectUris?: string[];
                postLogoutRedirectUris?: string[];
                type?: string;
                deviceFlow?: boolean;
                installationScopes?: string[];
                installationRedirectUrl?: string;
            };
        } else {
            params = {
                appId: paramsOrFirst as string,
                name: rest[0] as string,
                description: rest[1] as string,
                clientUri: rest[2] as string,
                logoUri: rest[3] as string,
                privacyPolicyUrl: rest[4] as string,
                termsUrl: rest[5] as string,
                contacts: rest[6] as string[],
                tagline: rest[7] as string,
                tags: rest[8] as string[],
                images: rest[9] as string[],
                supportUrl: rest[10] as string,
                dataDeletionUrl: rest[11] as string,
                enabled: rest[12] as boolean,
                redirectUris: rest[13] as string[],
                postLogoutRedirectUris: rest[14] as string[],
                type: rest[15] as string,
                deviceFlow: rest[16] as boolean,
                installationScopes: rest[17] as string[],
                installationRedirectUrl: rest[18] as string,
            };
        }

        const appId = params.appId;
        const name = params.name;
        const description = params.description;
        const clientUri = params.clientUri;
        const logoUri = params.logoUri;
        const privacyPolicyUrl = params.privacyPolicyUrl;
        const termsUrl = params.termsUrl;
        const contacts = params.contacts;
        const tagline = params.tagline;
        const tags = params.tags;
        const images = params.images;
        const supportUrl = params.supportUrl;
        const dataDeletionUrl = params.dataDeletionUrl;
        const enabled = params.enabled;
        const redirectUris = params.redirectUris;
        const postLogoutRedirectUris = params.postLogoutRedirectUris;
        const type = params.type;
        const deviceFlow = params.deviceFlow;
        const installationScopes = params.installationScopes;
        const installationRedirectUrl = params.installationRedirectUrl;

        if (typeof appId === 'undefined' || appId === '') {
            throw new AppwriteException('Missing required parameter: "appId"');
        }

        if (typeof name === 'undefined') {
            throw new AppwriteException('Missing required parameter: "name"');
        }

        const apiPath = '/apps/{appId}'.replace(
            '{appId}',
            encodeURIComponent(String(appId)),
        );
        const apiPayload: Payload = {};

        if (typeof name !== 'undefined') {
            apiPayload['name'] = name;
        }

        if (typeof description !== 'undefined') {
            apiPayload['description'] = description;
        }

        if (typeof clientUri !== 'undefined') {
            apiPayload['clientUri'] = clientUri;
        }

        if (typeof logoUri !== 'undefined') {
            apiPayload['logoUri'] = logoUri;
        }

        if (typeof privacyPolicyUrl !== 'undefined') {
            apiPayload['privacyPolicyUrl'] = privacyPolicyUrl;
        }

        if (typeof termsUrl !== 'undefined') {
            apiPayload['termsUrl'] = termsUrl;
        }

        if (typeof contacts !== 'undefined') {
            apiPayload['contacts'] = contacts;
        }

        if (typeof tagline !== 'undefined') {
            apiPayload['tagline'] = tagline;
        }

        if (typeof tags !== 'undefined') {
            apiPayload['tags'] = tags;
        }

        if (typeof images !== 'undefined') {
            apiPayload['images'] = images;
        }

        if (typeof supportUrl !== 'undefined') {
            apiPayload['supportUrl'] = supportUrl;
        }

        if (typeof dataDeletionUrl !== 'undefined') {
            apiPayload['dataDeletionUrl'] = dataDeletionUrl;
        }

        if (typeof enabled !== 'undefined') {
            apiPayload['enabled'] = enabled;
        }

        if (typeof redirectUris !== 'undefined') {
            apiPayload['redirectUris'] = redirectUris;
        }

        if (typeof postLogoutRedirectUris !== 'undefined') {
            apiPayload['postLogoutRedirectUris'] = postLogoutRedirectUris;
        }

        if (typeof type !== 'undefined') {
            apiPayload['type'] = type;
        }

        if (typeof deviceFlow !== 'undefined') {
            apiPayload['deviceFlow'] = deviceFlow;
        }

        if (typeof installationScopes !== 'undefined') {
            apiPayload['installationScopes'] = installationScopes;
        }

        if (typeof installationRedirectUrl !== 'undefined') {
            apiPayload['installationRedirectUrl'] = installationRedirectUrl;
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
            apiPayload,
        );
    }

    /**
     * Delete an application by its unique ID.
     *
     * @param {string} params.appId - Application unique ID.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    delete(params: { appId: string }): Promise<{}>;
    /**
     * Delete an application by its unique ID.
     *
     * @param {string} appId - Application unique ID.
     * @throws {AppwriteException}
     * @returns {Promise<{}>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    delete(appId: string): Promise<{}>;
    delete(paramsOrFirst: { appId: string } | string): Promise<{}> {
        let params: { appId: string };

        if (
            paramsOrFirst &&
            typeof paramsOrFirst === 'object' &&
            !Array.isArray(paramsOrFirst)
        ) {
            params = (paramsOrFirst || {}) as { appId: string };
        } else {
            params = {
                appId: paramsOrFirst as string,
            };
        }

        const appId = params.appId;

        if (typeof appId === 'undefined' || appId === '') {
            throw new AppwriteException('Missing required parameter: "appId"');
        }

        const apiPath = '/apps/{appId}'.replace(
            '{appId}',
            encodeURIComponent(String(appId)),
        );
        const apiPayload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call(
            'delete',
            uri,
            {
                'X-Appwrite-Project': this.client.config.project,
                'content-type': 'application/json',
                accept: 'application/json',
            },
            apiPayload,
        );
    }

    /**
     * List installations of an application. Requires an app key sent in the `X-Appwrite-Key` header alongside the `X-Appwrite-App` header, or a caller with update access to the app.
     *
     * @param {string} params.appId - Application unique ID.
     * @param {string[]} params.queries - Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.
     * @param {boolean} params.total - When set to false, the total count returned will be 0 and will not be calculated.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    listInstallations(params: {
        appId: string;
        queries?: string[];
        total?: boolean;
    }): Promise<Models.AppInstallationList>;
    /**
     * List installations of an application. Requires an app key sent in the `X-Appwrite-Key` header alongside the `X-Appwrite-App` header, or a caller with update access to the app.
     *
     * @param {string} appId - Application unique ID.
     * @param {string[]} queries - Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.
     * @param {boolean} total - When set to false, the total count returned will be 0 and will not be calculated.
     * @throws {AppwriteException}
     * @returns {Promise<Models.AppInstallationList>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    listInstallations(
        appId: string,
        queries?: string[],
        total?: boolean,
    ): Promise<Models.AppInstallationList>;
    listInstallations(
        paramsOrFirst:
            { appId: string; queries?: string[]; total?: boolean } | string,
        ...rest: [string[]?, boolean?]
    ): Promise<Models.AppInstallationList> {
        let params: { appId: string; queries?: string[]; total?: boolean };

        if (
            paramsOrFirst &&
            typeof paramsOrFirst === 'object' &&
            !Array.isArray(paramsOrFirst)
        ) {
            params = (paramsOrFirst || {}) as {
                appId: string;
                queries?: string[];
                total?: boolean;
            };
        } else {
            params = {
                appId: paramsOrFirst as string,
                queries: rest[0] as string[],
                total: rest[1] as boolean,
            };
        }

        const appId = params.appId;
        const queries = params.queries;
        const total = params.total;

        if (typeof appId === 'undefined' || appId === '') {
            throw new AppwriteException('Missing required parameter: "appId"');
        }

        const apiPath = '/apps/{appId}/installations'.replace(
            '{appId}',
            encodeURIComponent(String(appId)),
        );
        const apiPayload: Payload = {};

        if (typeof queries !== 'undefined') {
            apiPayload['queries'] = queries;
        }

        if (typeof total !== 'undefined') {
            apiPayload['total'] = total;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call(
            'get',
            uri,
            {
                'X-Appwrite-Project': this.client.config.project,
                accept: 'application/json',
            },
            apiPayload,
        );
    }

    /**
     * Get an installation of an application by its unique ID. Requires an app key sent in the `X-Appwrite-Key` header alongside the `X-Appwrite-App` header, or a caller with update access to the app.
     *
     * @param {string} params.appId - Application unique ID.
     * @param {string} params.installationId - Installation unique ID.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    getInstallation(params: {
        appId: string;
        installationId: string;
    }): Promise<Models.AppInstallation>;
    /**
     * Get an installation of an application by its unique ID. Requires an app key sent in the `X-Appwrite-Key` header alongside the `X-Appwrite-App` header, or a caller with update access to the app.
     *
     * @param {string} appId - Application unique ID.
     * @param {string} installationId - Installation unique ID.
     * @throws {AppwriteException}
     * @returns {Promise<Models.AppInstallation>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    getInstallation(
        appId: string,
        installationId: string,
    ): Promise<Models.AppInstallation>;
    getInstallation(
        paramsOrFirst: { appId: string; installationId: string } | string,
        ...rest: [string?]
    ): Promise<Models.AppInstallation> {
        let params: { appId: string; installationId: string };

        if (
            paramsOrFirst &&
            typeof paramsOrFirst === 'object' &&
            !Array.isArray(paramsOrFirst)
        ) {
            params = (paramsOrFirst || {}) as {
                appId: string;
                installationId: string;
            };
        } else {
            params = {
                appId: paramsOrFirst as string,
                installationId: rest[0] as string,
            };
        }

        const appId = params.appId;
        const installationId = params.installationId;

        if (typeof appId === 'undefined' || appId === '') {
            throw new AppwriteException('Missing required parameter: "appId"');
        }

        if (typeof installationId === 'undefined' || installationId === '') {
            throw new AppwriteException(
                'Missing required parameter: "installationId"',
            );
        }

        const apiPath = '/apps/{appId}/installations/{installationId}'
            .replace('{appId}', encodeURIComponent(String(appId)))
            .replace(
                '{installationId}',
                encodeURIComponent(String(installationId)),
            );
        const apiPayload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call(
            'get',
            uri,
            {
                'X-Appwrite-Project': this.client.config.project,
                accept: 'application/json',
            },
            apiPayload,
        );
    }

    /**
     * Delete an installation of an application by its unique ID. Requires a caller with update access to the app. Previously issued installation access tokens are revoked.
     *
     * @param {string} params.appId - Application unique ID.
     * @param {string} params.installationId - Installation unique ID.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    deleteInstallation(params: {
        appId: string;
        installationId: string;
    }): Promise<{}>;
    /**
     * Delete an installation of an application by its unique ID. Requires a caller with update access to the app. Previously issued installation access tokens are revoked.
     *
     * @param {string} appId - Application unique ID.
     * @param {string} installationId - Installation unique ID.
     * @throws {AppwriteException}
     * @returns {Promise<{}>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    deleteInstallation(appId: string, installationId: string): Promise<{}>;
    deleteInstallation(
        paramsOrFirst: { appId: string; installationId: string } | string,
        ...rest: [string?]
    ): Promise<{}> {
        let params: { appId: string; installationId: string };

        if (
            paramsOrFirst &&
            typeof paramsOrFirst === 'object' &&
            !Array.isArray(paramsOrFirst)
        ) {
            params = (paramsOrFirst || {}) as {
                appId: string;
                installationId: string;
            };
        } else {
            params = {
                appId: paramsOrFirst as string,
                installationId: rest[0] as string,
            };
        }

        const appId = params.appId;
        const installationId = params.installationId;

        if (typeof appId === 'undefined' || appId === '') {
            throw new AppwriteException('Missing required parameter: "appId"');
        }

        if (typeof installationId === 'undefined' || installationId === '') {
            throw new AppwriteException(
                'Missing required parameter: "installationId"',
            );
        }

        const apiPath = '/apps/{appId}/installations/{installationId}'
            .replace('{appId}', encodeURIComponent(String(appId)))
            .replace(
                '{installationId}',
                encodeURIComponent(String(installationId)),
            );
        const apiPayload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call(
            'delete',
            uri,
            {
                'X-Appwrite-Project': this.client.config.project,
                'content-type': 'application/json',
                accept: 'application/json',
            },
            apiPayload,
        );
    }

    /**
     * Create a token for an installation of an application. Requires an app key sent in the `X-Appwrite-Key` header alongside the `X-Appwrite-App` header, or a caller with update access to the app. The returned token carries the scopes and authorization details granted to the installation, and can be used as an `Authorization: Bearer` header everywhere OAuth2 access tokens are accepted. Multiple tokens can be active for the same installation at once; each token stays valid until it expires or the installation is updated or deleted.
     *
     * @param {string} params.appId - Application unique ID.
     * @param {string} params.installationId - Installation unique ID.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    createInstallationToken(params: {
        appId: string;
        installationId: string;
    }): Promise<Models.Oauth2Token>;
    /**
     * Create a token for an installation of an application. Requires an app key sent in the `X-Appwrite-Key` header alongside the `X-Appwrite-App` header, or a caller with update access to the app. The returned token carries the scopes and authorization details granted to the installation, and can be used as an `Authorization: Bearer` header everywhere OAuth2 access tokens are accepted. Multiple tokens can be active for the same installation at once; each token stays valid until it expires or the installation is updated or deleted.
     *
     * @param {string} appId - Application unique ID.
     * @param {string} installationId - Installation unique ID.
     * @throws {AppwriteException}
     * @returns {Promise<Models.Oauth2Token>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    createInstallationToken(
        appId: string,
        installationId: string,
    ): Promise<Models.Oauth2Token>;
    createInstallationToken(
        paramsOrFirst: { appId: string; installationId: string } | string,
        ...rest: [string?]
    ): Promise<Models.Oauth2Token> {
        let params: { appId: string; installationId: string };

        if (
            paramsOrFirst &&
            typeof paramsOrFirst === 'object' &&
            !Array.isArray(paramsOrFirst)
        ) {
            params = (paramsOrFirst || {}) as {
                appId: string;
                installationId: string;
            };
        } else {
            params = {
                appId: paramsOrFirst as string,
                installationId: rest[0] as string,
            };
        }

        const appId = params.appId;
        const installationId = params.installationId;

        if (typeof appId === 'undefined' || appId === '') {
            throw new AppwriteException('Missing required parameter: "appId"');
        }

        if (typeof installationId === 'undefined' || installationId === '') {
            throw new AppwriteException(
                'Missing required parameter: "installationId"',
            );
        }

        const apiPath = '/apps/{appId}/installations/{installationId}/tokens'
            .replace('{appId}', encodeURIComponent(String(appId)))
            .replace(
                '{installationId}',
                encodeURIComponent(String(installationId)),
            );
        const apiPayload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call(
            'post',
            uri,
            {
                'X-Appwrite-Project': this.client.config.project,
                'content-type': 'application/json',
                accept: 'application/json',
            },
            apiPayload,
        );
    }

    /**
     * List app keys for an application.
     *
     * @param {string} params.appId - Application unique ID.
     * @param {string[]} params.queries - Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.
     * @param {boolean} params.total - When set to false, the total count returned will be 0 and will not be calculated.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    listKeys(params: {
        appId: string;
        queries?: string[];
        total?: boolean;
    }): Promise<Models.AppKeyList>;
    /**
     * List app keys for an application.
     *
     * @param {string} appId - Application unique ID.
     * @param {string[]} queries - Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.
     * @param {boolean} total - When set to false, the total count returned will be 0 and will not be calculated.
     * @throws {AppwriteException}
     * @returns {Promise<Models.AppKeyList>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    listKeys(
        appId: string,
        queries?: string[],
        total?: boolean,
    ): Promise<Models.AppKeyList>;
    listKeys(
        paramsOrFirst:
            { appId: string; queries?: string[]; total?: boolean } | string,
        ...rest: [string[]?, boolean?]
    ): Promise<Models.AppKeyList> {
        let params: { appId: string; queries?: string[]; total?: boolean };

        if (
            paramsOrFirst &&
            typeof paramsOrFirst === 'object' &&
            !Array.isArray(paramsOrFirst)
        ) {
            params = (paramsOrFirst || {}) as {
                appId: string;
                queries?: string[];
                total?: boolean;
            };
        } else {
            params = {
                appId: paramsOrFirst as string,
                queries: rest[0] as string[],
                total: rest[1] as boolean,
            };
        }

        const appId = params.appId;
        const queries = params.queries;
        const total = params.total;

        if (typeof appId === 'undefined' || appId === '') {
            throw new AppwriteException('Missing required parameter: "appId"');
        }

        const apiPath = '/apps/{appId}/keys'.replace(
            '{appId}',
            encodeURIComponent(String(appId)),
        );
        const apiPayload: Payload = {};

        if (typeof queries !== 'undefined') {
            apiPayload['queries'] = queries;
        }

        if (typeof total !== 'undefined') {
            apiPayload['total'] = total;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call(
            'get',
            uri,
            {
                'X-Appwrite-Project': this.client.config.project,
                accept: 'application/json',
            },
            apiPayload,
        );
    }

    /**
     * Create a new app key for an application. App keys carry no scopes; send one in the `X-Appwrite-Key` header alongside the `X-Appwrite-App` header to list the application's installations and create installation access tokens.
     *
     * @param {string} params.appId - Application unique ID.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    createKey(params: { appId: string }): Promise<Models.AppKey>;
    /**
     * Create a new app key for an application. App keys carry no scopes; send one in the `X-Appwrite-Key` header alongside the `X-Appwrite-App` header to list the application's installations and create installation access tokens.
     *
     * @param {string} appId - Application unique ID.
     * @throws {AppwriteException}
     * @returns {Promise<Models.AppKey>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    createKey(appId: string): Promise<Models.AppKey>;
    createKey(
        paramsOrFirst: { appId: string } | string,
    ): Promise<Models.AppKey> {
        let params: { appId: string };

        if (
            paramsOrFirst &&
            typeof paramsOrFirst === 'object' &&
            !Array.isArray(paramsOrFirst)
        ) {
            params = (paramsOrFirst || {}) as { appId: string };
        } else {
            params = {
                appId: paramsOrFirst as string,
            };
        }

        const appId = params.appId;

        if (typeof appId === 'undefined' || appId === '') {
            throw new AppwriteException('Missing required parameter: "appId"');
        }

        const apiPath = '/apps/{appId}/keys'.replace(
            '{appId}',
            encodeURIComponent(String(appId)),
        );
        const apiPayload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call(
            'post',
            uri,
            {
                'X-Appwrite-Project': this.client.config.project,
                'content-type': 'application/json',
                accept: 'application/json',
            },
            apiPayload,
        );
    }

    /**
     * Get an app key by its unique ID.
     *
     * @param {string} params.appId - Application unique ID.
     * @param {string} params.keyId - App key unique ID.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    getKey(params: { appId: string; keyId: string }): Promise<Models.AppKey>;
    /**
     * Get an app key by its unique ID.
     *
     * @param {string} appId - Application unique ID.
     * @param {string} keyId - App key unique ID.
     * @throws {AppwriteException}
     * @returns {Promise<Models.AppKey>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    getKey(appId: string, keyId: string): Promise<Models.AppKey>;
    getKey(
        paramsOrFirst: { appId: string; keyId: string } | string,
        ...rest: [string?]
    ): Promise<Models.AppKey> {
        let params: { appId: string; keyId: string };

        if (
            paramsOrFirst &&
            typeof paramsOrFirst === 'object' &&
            !Array.isArray(paramsOrFirst)
        ) {
            params = (paramsOrFirst || {}) as { appId: string; keyId: string };
        } else {
            params = {
                appId: paramsOrFirst as string,
                keyId: rest[0] as string,
            };
        }

        const appId = params.appId;
        const keyId = params.keyId;

        if (typeof appId === 'undefined' || appId === '') {
            throw new AppwriteException('Missing required parameter: "appId"');
        }

        if (typeof keyId === 'undefined' || keyId === '') {
            throw new AppwriteException('Missing required parameter: "keyId"');
        }

        const apiPath = '/apps/{appId}/keys/{keyId}'
            .replace('{appId}', encodeURIComponent(String(appId)))
            .replace('{keyId}', encodeURIComponent(String(keyId)));
        const apiPayload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call(
            'get',
            uri,
            {
                'X-Appwrite-Project': this.client.config.project,
                accept: 'application/json',
            },
            apiPayload,
        );
    }

    /**
     * Delete an app key by its unique ID.
     *
     * @param {string} params.appId - Application unique ID.
     * @param {string} params.keyId - App key unique ID.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    deleteKey(params: { appId: string; keyId: string }): Promise<{}>;
    /**
     * Delete an app key by its unique ID.
     *
     * @param {string} appId - Application unique ID.
     * @param {string} keyId - App key unique ID.
     * @throws {AppwriteException}
     * @returns {Promise<{}>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    deleteKey(appId: string, keyId: string): Promise<{}>;
    deleteKey(
        paramsOrFirst: { appId: string; keyId: string } | string,
        ...rest: [string?]
    ): Promise<{}> {
        let params: { appId: string; keyId: string };

        if (
            paramsOrFirst &&
            typeof paramsOrFirst === 'object' &&
            !Array.isArray(paramsOrFirst)
        ) {
            params = (paramsOrFirst || {}) as { appId: string; keyId: string };
        } else {
            params = {
                appId: paramsOrFirst as string,
                keyId: rest[0] as string,
            };
        }

        const appId = params.appId;
        const keyId = params.keyId;

        if (typeof appId === 'undefined' || appId === '') {
            throw new AppwriteException('Missing required parameter: "appId"');
        }

        if (typeof keyId === 'undefined' || keyId === '') {
            throw new AppwriteException('Missing required parameter: "keyId"');
        }

        const apiPath = '/apps/{appId}/keys/{keyId}'
            .replace('{appId}', encodeURIComponent(String(appId)))
            .replace('{keyId}', encodeURIComponent(String(keyId)));
        const apiPayload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call(
            'delete',
            uri,
            {
                'X-Appwrite-Project': this.client.config.project,
                'content-type': 'application/json',
                accept: 'application/json',
            },
            apiPayload,
        );
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
    listSecrets(params: {
        appId: string;
        queries?: string[];
        total?: boolean;
    }): Promise<Models.AppSecretList>;
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
    listSecrets(
        appId: string,
        queries?: string[],
        total?: boolean,
    ): Promise<Models.AppSecretList>;
    listSecrets(
        paramsOrFirst:
            { appId: string; queries?: string[]; total?: boolean } | string,
        ...rest: [string[]?, boolean?]
    ): Promise<Models.AppSecretList> {
        let params: { appId: string; queries?: string[]; total?: boolean };

        if (
            paramsOrFirst &&
            typeof paramsOrFirst === 'object' &&
            !Array.isArray(paramsOrFirst)
        ) {
            params = (paramsOrFirst || {}) as {
                appId: string;
                queries?: string[];
                total?: boolean;
            };
        } else {
            params = {
                appId: paramsOrFirst as string,
                queries: rest[0] as string[],
                total: rest[1] as boolean,
            };
        }

        const appId = params.appId;
        const queries = params.queries;
        const total = params.total;

        if (typeof appId === 'undefined' || appId === '') {
            throw new AppwriteException('Missing required parameter: "appId"');
        }

        const apiPath = '/apps/{appId}/secrets'.replace(
            '{appId}',
            encodeURIComponent(String(appId)),
        );
        const apiPayload: Payload = {};

        if (typeof queries !== 'undefined') {
            apiPayload['queries'] = queries;
        }

        if (typeof total !== 'undefined') {
            apiPayload['total'] = total;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call(
            'get',
            uri,
            {
                'X-Appwrite-Project': this.client.config.project,
                accept: 'application/json',
            },
            apiPayload,
        );
    }

    /**
     * Create a new client secret for an application.
     *
     * @param {string} params.appId - Application unique ID.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    createSecret(params: { appId: string }): Promise<Models.AppSecretPlaintext>;
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
        paramsOrFirst: { appId: string } | string,
    ): Promise<Models.AppSecretPlaintext> {
        let params: { appId: string };

        if (
            paramsOrFirst &&
            typeof paramsOrFirst === 'object' &&
            !Array.isArray(paramsOrFirst)
        ) {
            params = (paramsOrFirst || {}) as { appId: string };
        } else {
            params = {
                appId: paramsOrFirst as string,
            };
        }

        const appId = params.appId;

        if (typeof appId === 'undefined' || appId === '') {
            throw new AppwriteException('Missing required parameter: "appId"');
        }

        const apiPath = '/apps/{appId}/secrets'.replace(
            '{appId}',
            encodeURIComponent(String(appId)),
        );
        const apiPayload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call(
            'post',
            uri,
            {
                'X-Appwrite-Project': this.client.config.project,
                'content-type': 'application/json',
                accept: 'application/json',
            },
            apiPayload,
        );
    }

    /**
     * Get an application client secret by its unique ID.
     *
     * @param {string} params.appId - Application unique ID.
     * @param {string} params.secretId - Secret unique ID.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    getSecret(params: {
        appId: string;
        secretId: string;
    }): Promise<Models.AppSecret>;
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
        paramsOrFirst: { appId: string; secretId: string } | string,
        ...rest: [string?]
    ): Promise<Models.AppSecret> {
        let params: { appId: string; secretId: string };

        if (
            paramsOrFirst &&
            typeof paramsOrFirst === 'object' &&
            !Array.isArray(paramsOrFirst)
        ) {
            params = (paramsOrFirst || {}) as {
                appId: string;
                secretId: string;
            };
        } else {
            params = {
                appId: paramsOrFirst as string,
                secretId: rest[0] as string,
            };
        }

        const appId = params.appId;
        const secretId = params.secretId;

        if (typeof appId === 'undefined' || appId === '') {
            throw new AppwriteException('Missing required parameter: "appId"');
        }

        if (typeof secretId === 'undefined' || secretId === '') {
            throw new AppwriteException(
                'Missing required parameter: "secretId"',
            );
        }

        const apiPath = '/apps/{appId}/secrets/{secretId}'
            .replace('{appId}', encodeURIComponent(String(appId)))
            .replace('{secretId}', encodeURIComponent(String(secretId)));
        const apiPayload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call(
            'get',
            uri,
            {
                'X-Appwrite-Project': this.client.config.project,
                accept: 'application/json',
            },
            apiPayload,
        );
    }

    /**
     * Delete an application client secret by its unique ID.
     *
     * @param {string} params.appId - Application unique ID.
     * @param {string} params.secretId - Secret unique ID.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    deleteSecret(params: { appId: string; secretId: string }): Promise<{}>;
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
        paramsOrFirst: { appId: string; secretId: string } | string,
        ...rest: [string?]
    ): Promise<{}> {
        let params: { appId: string; secretId: string };

        if (
            paramsOrFirst &&
            typeof paramsOrFirst === 'object' &&
            !Array.isArray(paramsOrFirst)
        ) {
            params = (paramsOrFirst || {}) as {
                appId: string;
                secretId: string;
            };
        } else {
            params = {
                appId: paramsOrFirst as string,
                secretId: rest[0] as string,
            };
        }

        const appId = params.appId;
        const secretId = params.secretId;

        if (typeof appId === 'undefined' || appId === '') {
            throw new AppwriteException('Missing required parameter: "appId"');
        }

        if (typeof secretId === 'undefined' || secretId === '') {
            throw new AppwriteException(
                'Missing required parameter: "secretId"',
            );
        }

        const apiPath = '/apps/{appId}/secrets/{secretId}'
            .replace('{appId}', encodeURIComponent(String(appId)))
            .replace('{secretId}', encodeURIComponent(String(secretId)));
        const apiPayload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call(
            'delete',
            uri,
            {
                'X-Appwrite-Project': this.client.config.project,
                'content-type': 'application/json',
                accept: 'application/json',
            },
            apiPayload,
        );
    }

    /**
     * Transfer an application to another team by its unique ID.
     *
     * @param {string} params.appId - Application unique ID.
     * @param {string} params.teamId - Team ID of the team to transfer application to.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    updateTeam(params: { appId: string; teamId: string }): Promise<Models.App>;
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
        paramsOrFirst: { appId: string; teamId: string } | string,
        ...rest: [string?]
    ): Promise<Models.App> {
        let params: { appId: string; teamId: string };

        if (
            paramsOrFirst &&
            typeof paramsOrFirst === 'object' &&
            !Array.isArray(paramsOrFirst)
        ) {
            params = (paramsOrFirst || {}) as { appId: string; teamId: string };
        } else {
            params = {
                appId: paramsOrFirst as string,
                teamId: rest[0] as string,
            };
        }

        const appId = params.appId;
        const teamId = params.teamId;

        if (typeof appId === 'undefined' || appId === '') {
            throw new AppwriteException('Missing required parameter: "appId"');
        }

        if (typeof teamId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "teamId"');
        }

        const apiPath = '/apps/{appId}/team'.replace(
            '{appId}',
            encodeURIComponent(String(appId)),
        );
        const apiPayload: Payload = {};

        if (typeof teamId !== 'undefined') {
            apiPayload['teamId'] = teamId;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call(
            'patch',
            uri,
            {
                'X-Appwrite-Project': this.client.config.project,
                'content-type': 'application/json',
                accept: 'application/json',
            },
            apiPayload,
        );
    }

    /**
     * Revoke all tokens for an application by its unique ID.
     *
     * @param {string} params.appId - Application unique ID.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    deleteTokens(params: { appId: string }): Promise<{}>;
    /**
     * Revoke all tokens for an application by its unique ID.
     *
     * @param {string} appId - Application unique ID.
     * @throws {AppwriteException}
     * @returns {Promise<{}>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    deleteTokens(appId: string): Promise<{}>;
    deleteTokens(paramsOrFirst: { appId: string } | string): Promise<{}> {
        let params: { appId: string };

        if (
            paramsOrFirst &&
            typeof paramsOrFirst === 'object' &&
            !Array.isArray(paramsOrFirst)
        ) {
            params = (paramsOrFirst || {}) as { appId: string };
        } else {
            params = {
                appId: paramsOrFirst as string,
            };
        }

        const appId = params.appId;

        if (typeof appId === 'undefined' || appId === '') {
            throw new AppwriteException('Missing required parameter: "appId"');
        }

        const apiPath = '/apps/{appId}/tokens'.replace(
            '{appId}',
            encodeURIComponent(String(appId)),
        );
        const apiPayload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call(
            'delete',
            uri,
            {
                'X-Appwrite-Project': this.client.config.project,
                'content-type': 'application/json',
                accept: 'application/json',
            },
            apiPayload,
        );
    }
}

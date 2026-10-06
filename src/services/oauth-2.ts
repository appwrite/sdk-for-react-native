import { Service } from '../service';
import { AppwriteException, Client } from '../client';
import type { Models } from '../models';
import type { Payload } from '../client';

export class Oauth2 extends Service {
    constructor(client: Client) {
        super(client);
    }

    /**
     * Approve an OAuth2 grant after the user gives consent. Returns the `redirectUrl` the end user should be sent to. The consent screen may optionally pass enriched `authorization_details` to record the concrete resources the user selected. You can pass Accept header of `application/json` to receive a JSON response instead of a redirect.
     *
     * @param {string} params.grantId - Grant ID made during authorization, provided to consent screen in URL search params.
     * @param {string} params.authorizationDetails - Enriched `authorization_details` the user consented to, replacing what the client requested. Each entry must use a `type` the project accepts. Optional; omit to keep the originally requested details.
     * @param {string} params.scope - Space-separated scopes the user consented to. Must be a subset of the scopes originally requested; identity scopes such as `openid` are always retained. Optional; omit to keep the originally requested scopes.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    approve(params: {
        grantId: string;
        authorizationDetails?: string;
        scope?: string;
    }): Promise<Models.Oauth2Approve>;
    /**
     * Approve an OAuth2 grant after the user gives consent. Returns the `redirectUrl` the end user should be sent to. The consent screen may optionally pass enriched `authorization_details` to record the concrete resources the user selected. You can pass Accept header of `application/json` to receive a JSON response instead of a redirect.
     *
     * @param {string} grantId - Grant ID made during authorization, provided to consent screen in URL search params.
     * @param {string} authorizationDetails - Enriched `authorization_details` the user consented to, replacing what the client requested. Each entry must use a `type` the project accepts. Optional; omit to keep the originally requested details.
     * @param {string} scope - Space-separated scopes the user consented to. Must be a subset of the scopes originally requested; identity scopes such as `openid` are always retained. Optional; omit to keep the originally requested scopes.
     * @throws {AppwriteException}
     * @returns {Promise<Models.Oauth2Approve>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    approve(
        grantId: string,
        authorizationDetails?: string,
        scope?: string,
    ): Promise<Models.Oauth2Approve>;
    approve(
        paramsOrFirst:
            | { grantId: string; authorizationDetails?: string; scope?: string }
            | string,
        ...rest: [string?, string?]
    ): Promise<Models.Oauth2Approve> {
        let params: {
            grantId: string;
            authorizationDetails?: string;
            scope?: string;
        };

        if (
            paramsOrFirst &&
            typeof paramsOrFirst === 'object' &&
            !Array.isArray(paramsOrFirst)
        ) {
            params = (paramsOrFirst || {}) as {
                grantId: string;
                authorizationDetails?: string;
                scope?: string;
            };
        } else {
            params = {
                grantId: paramsOrFirst as string,
                authorizationDetails: rest[0] as string,
                scope: rest[1] as string,
            };
        }

        const grantId = params.grantId;
        const authorizationDetails = params.authorizationDetails;
        const scope = params.scope;

        if (typeof grantId === 'undefined') {
            throw new AppwriteException(
                'Missing required parameter: "grantId"',
            );
        }

        const apiPath = '/oauth2/{project_id}/approve'.replace(
            '{project_id}',
            encodeURIComponent(String(this.client.config.project)),
        );
        const apiPayload: Payload = {};

        if (typeof grantId !== 'undefined') {
            apiPayload['grant_id'] = grantId;
        }

        if (typeof authorizationDetails !== 'undefined') {
            apiPayload['authorization_details'] = authorizationDetails;
        }

        if (typeof scope !== 'undefined') {
            apiPayload['scope'] = scope;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call(
            'post',
            uri,
            {
                'content-type': 'application/json',
                accept: 'application/json',
            },
            apiPayload,
        );
    }

    /**
     * Begin the OAuth2 authorization flow. When called without a session, the user is redirected to the consent screen without grant ID. When called with a session, the redirect URL includes param for grant ID. You can pass Accept header of `application/json` to receive a JSON response instead of a redirect.
     *
     * @param {string} params.clientId - OAuth2 client ID. Either a registered app ID or an HTTPS client ID metadata document URL.
     * @param {string} params.redirectUri - Redirect URI where visitor will be redirected after authorization, whether successful or not.
     * @param {string} params.responseType - OAuth2 / OIDC response type. One of `code` (Authorization Code Flow), `id_token` (Implicit Flow, OIDC login only), or `code id_token` (Hybrid Flow).
     * @param {string} params.scope - Space-separated OAuth2 scopes. Can include project scopes, and built-in scopes: `openid`, `email`, `profile`, `phone`.
     * @param {string} params.state - OAuth2 state. You receive this back in the redirect URI.
     * @param {string} params.nonce - OIDC nonce parameter to prevent replay attacks. Required when response_type includes `id_token`.
     * @param {string} params.codeChallenge - PKCE code challenge. Required when OAuth2 app is public.
     * @param {string} params.codeChallengeMethod - PKCE code challenge method. Required when OAuth2 app is public.
     * @param {string} params.prompt - OIDC prompt parameter for customization of consent screen. Space-separated list of: none, login, consent, select_account.
     * @param {number} params.maxAge - OIDC max_age paraleter for customization of consent screen. Maximum allowable elapsed time in seconds since the user last authenticated. If exceeded, re-authentication is required.
     * @param {string} params.authorizationDetails - Rich authorization request. JSON array of objects, each with a `type` and project-defined fields
     * @param {string} params.resource - RFC 8707 resource indicator URI or URI list. Each value must be an absolute URI without a fragment.
     * @param {string} params.audience - Compatibility alias for a single OAuth2 resource indicator URI.
     * @param {string} params.requestUri - OAuth2 authorization request handle returned by the pushed authorization request endpoint.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    authorize(params?: {
        clientId?: string;
        redirectUri?: string;
        responseType?: string;
        scope?: string;
        state?: string;
        nonce?: string;
        codeChallenge?: string;
        codeChallengeMethod?: string;
        prompt?: string;
        maxAge?: number;
        authorizationDetails?: string;
        resource?: string;
        audience?: string;
        requestUri?: string;
    }): Promise<Models.Oauth2Authorize>;
    /**
     * Begin the OAuth2 authorization flow. When called without a session, the user is redirected to the consent screen without grant ID. When called with a session, the redirect URL includes param for grant ID. You can pass Accept header of `application/json` to receive a JSON response instead of a redirect.
     *
     * @param {string} clientId - OAuth2 client ID. Either a registered app ID or an HTTPS client ID metadata document URL.
     * @param {string} redirectUri - Redirect URI where visitor will be redirected after authorization, whether successful or not.
     * @param {string} responseType - OAuth2 / OIDC response type. One of `code` (Authorization Code Flow), `id_token` (Implicit Flow, OIDC login only), or `code id_token` (Hybrid Flow).
     * @param {string} scope - Space-separated OAuth2 scopes. Can include project scopes, and built-in scopes: `openid`, `email`, `profile`, `phone`.
     * @param {string} state - OAuth2 state. You receive this back in the redirect URI.
     * @param {string} nonce - OIDC nonce parameter to prevent replay attacks. Required when response_type includes `id_token`.
     * @param {string} codeChallenge - PKCE code challenge. Required when OAuth2 app is public.
     * @param {string} codeChallengeMethod - PKCE code challenge method. Required when OAuth2 app is public.
     * @param {string} prompt - OIDC prompt parameter for customization of consent screen. Space-separated list of: none, login, consent, select_account.
     * @param {number} maxAge - OIDC max_age paraleter for customization of consent screen. Maximum allowable elapsed time in seconds since the user last authenticated. If exceeded, re-authentication is required.
     * @param {string} authorizationDetails - Rich authorization request. JSON array of objects, each with a `type` and project-defined fields
     * @param {string} resource - RFC 8707 resource indicator URI or URI list. Each value must be an absolute URI without a fragment.
     * @param {string} audience - Compatibility alias for a single OAuth2 resource indicator URI.
     * @param {string} requestUri - OAuth2 authorization request handle returned by the pushed authorization request endpoint.
     * @throws {AppwriteException}
     * @returns {Promise<Models.Oauth2Authorize>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    authorize(
        clientId?: string,
        redirectUri?: string,
        responseType?: string,
        scope?: string,
        state?: string,
        nonce?: string,
        codeChallenge?: string,
        codeChallengeMethod?: string,
        prompt?: string,
        maxAge?: number,
        authorizationDetails?: string,
        resource?: string,
        audience?: string,
        requestUri?: string,
    ): Promise<Models.Oauth2Authorize>;
    authorize(
        paramsOrFirst?:
            | {
                  clientId?: string;
                  redirectUri?: string;
                  responseType?: string;
                  scope?: string;
                  state?: string;
                  nonce?: string;
                  codeChallenge?: string;
                  codeChallengeMethod?: string;
                  prompt?: string;
                  maxAge?: number;
                  authorizationDetails?: string;
                  resource?: string;
                  audience?: string;
                  requestUri?: string;
              }
            | string,
        ...rest: [
            string?,
            string?,
            string?,
            string?,
            string?,
            string?,
            string?,
            string?,
            number?,
            string?,
            string?,
            string?,
            string?,
        ]
    ): Promise<Models.Oauth2Authorize> {
        let params: {
            clientId?: string;
            redirectUri?: string;
            responseType?: string;
            scope?: string;
            state?: string;
            nonce?: string;
            codeChallenge?: string;
            codeChallengeMethod?: string;
            prompt?: string;
            maxAge?: number;
            authorizationDetails?: string;
            resource?: string;
            audience?: string;
            requestUri?: string;
        };

        if (
            (typeof paramsOrFirst === 'undefined' && rest.length === 0) ||
            (paramsOrFirst &&
                typeof paramsOrFirst === 'object' &&
                !Array.isArray(paramsOrFirst))
        ) {
            params = (paramsOrFirst || {}) as {
                clientId?: string;
                redirectUri?: string;
                responseType?: string;
                scope?: string;
                state?: string;
                nonce?: string;
                codeChallenge?: string;
                codeChallengeMethod?: string;
                prompt?: string;
                maxAge?: number;
                authorizationDetails?: string;
                resource?: string;
                audience?: string;
                requestUri?: string;
            };
        } else {
            params = {
                clientId: paramsOrFirst as string,
                redirectUri: rest[0] as string,
                responseType: rest[1] as string,
                scope: rest[2] as string,
                state: rest[3] as string,
                nonce: rest[4] as string,
                codeChallenge: rest[5] as string,
                codeChallengeMethod: rest[6] as string,
                prompt: rest[7] as string,
                maxAge: rest[8] as number,
                authorizationDetails: rest[9] as string,
                resource: rest[10] as string,
                audience: rest[11] as string,
                requestUri: rest[12] as string,
            };
        }

        const clientId = params.clientId;
        const redirectUri = params.redirectUri;
        const responseType = params.responseType;
        const scope = params.scope;
        const state = params.state;
        const nonce = params.nonce;
        const codeChallenge = params.codeChallenge;
        const codeChallengeMethod = params.codeChallengeMethod;
        const prompt = params.prompt;
        const maxAge = params.maxAge;
        const authorizationDetails = params.authorizationDetails;
        const resource = params.resource;
        const audience = params.audience;
        const requestUri = params.requestUri;

        const apiPath = '/oauth2/{project_id}/authorize'.replace(
            '{project_id}',
            encodeURIComponent(String(this.client.config.project)),
        );
        const apiPayload: Payload = {};

        if (typeof clientId !== 'undefined') {
            apiPayload['client_id'] = clientId;
        }

        if (typeof redirectUri !== 'undefined') {
            apiPayload['redirect_uri'] = redirectUri;
        }

        if (typeof responseType !== 'undefined') {
            apiPayload['response_type'] = responseType;
        }

        if (typeof scope !== 'undefined') {
            apiPayload['scope'] = scope;
        }

        if (typeof state !== 'undefined') {
            apiPayload['state'] = state;
        }

        if (typeof nonce !== 'undefined') {
            apiPayload['nonce'] = nonce;
        }

        if (typeof codeChallenge !== 'undefined') {
            apiPayload['code_challenge'] = codeChallenge;
        }

        if (typeof codeChallengeMethod !== 'undefined') {
            apiPayload['code_challenge_method'] = codeChallengeMethod;
        }

        if (typeof prompt !== 'undefined') {
            apiPayload['prompt'] = prompt;
        }

        if (typeof maxAge !== 'undefined') {
            apiPayload['max_age'] = maxAge;
        }

        if (typeof authorizationDetails !== 'undefined') {
            apiPayload['authorization_details'] = authorizationDetails;
        }

        if (typeof resource !== 'undefined') {
            apiPayload['resource'] = resource;
        }

        if (typeof audience !== 'undefined') {
            apiPayload['audience'] = audience;
        }

        if (typeof requestUri !== 'undefined') {
            apiPayload['request_uri'] = requestUri;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call(
            'get',
            uri,
            {
                accept: 'application/json',
            },
            apiPayload,
        );
    }

    /**
     * Begin the OAuth2 authorization flow. When called without a session, the user is redirected to the consent screen without grant ID. When called with a session, the redirect URL includes param for grant ID. You can pass Accept header of `application/json` to receive a JSON response instead of a redirect.
     *
     * @param {string} params.clientId - OAuth2 client ID. Either a registered app ID or an HTTPS client ID metadata document URL.
     * @param {string} params.redirectUri - Redirect URI where visitor will be redirected after authorization, whether successful or not.
     * @param {string} params.responseType - OAuth2 / OIDC response type. One of `code` (Authorization Code Flow), `id_token` (Implicit Flow, OIDC login only), or `code id_token` (Hybrid Flow).
     * @param {string} params.scope - Space-separated OAuth2 scopes. Can include project scopes, and built-in scopes: `openid`, `email`, `profile`, `phone`.
     * @param {string} params.state - OAuth2 state. You receive this back in the redirect URI.
     * @param {string} params.nonce - OIDC nonce parameter to prevent replay attacks. Required when response_type includes `id_token`.
     * @param {string} params.codeChallenge - PKCE code challenge. Required when OAuth2 app is public.
     * @param {string} params.codeChallengeMethod - PKCE code challenge method. Required when OAuth2 app is public.
     * @param {string} params.prompt - OIDC prompt parameter for customization of consent screen. Space-separated list of: none, login, consent, select_account.
     * @param {number} params.maxAge - OIDC max_age paraleter for customization of consent screen. Maximum allowable elapsed time in seconds since the user last authenticated. If exceeded, re-authentication is required.
     * @param {string} params.authorizationDetails - Rich authorization request. JSON array of objects, each with a `type` and project-defined fields
     * @param {string} params.resource - RFC 8707 resource indicator URI or URI list. Each value must be an absolute URI without a fragment.
     * @param {string} params.audience - Compatibility alias for a single OAuth2 resource indicator URI.
     * @param {string} params.requestUri - OAuth2 authorization request handle returned by the pushed authorization request endpoint.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    authorizePost(params?: {
        clientId?: string;
        redirectUri?: string;
        responseType?: string;
        scope?: string;
        state?: string;
        nonce?: string;
        codeChallenge?: string;
        codeChallengeMethod?: string;
        prompt?: string;
        maxAge?: number;
        authorizationDetails?: string;
        resource?: string;
        audience?: string;
        requestUri?: string;
    }): Promise<Models.Oauth2Authorize>;
    /**
     * Begin the OAuth2 authorization flow. When called without a session, the user is redirected to the consent screen without grant ID. When called with a session, the redirect URL includes param for grant ID. You can pass Accept header of `application/json` to receive a JSON response instead of a redirect.
     *
     * @param {string} clientId - OAuth2 client ID. Either a registered app ID or an HTTPS client ID metadata document URL.
     * @param {string} redirectUri - Redirect URI where visitor will be redirected after authorization, whether successful or not.
     * @param {string} responseType - OAuth2 / OIDC response type. One of `code` (Authorization Code Flow), `id_token` (Implicit Flow, OIDC login only), or `code id_token` (Hybrid Flow).
     * @param {string} scope - Space-separated OAuth2 scopes. Can include project scopes, and built-in scopes: `openid`, `email`, `profile`, `phone`.
     * @param {string} state - OAuth2 state. You receive this back in the redirect URI.
     * @param {string} nonce - OIDC nonce parameter to prevent replay attacks. Required when response_type includes `id_token`.
     * @param {string} codeChallenge - PKCE code challenge. Required when OAuth2 app is public.
     * @param {string} codeChallengeMethod - PKCE code challenge method. Required when OAuth2 app is public.
     * @param {string} prompt - OIDC prompt parameter for customization of consent screen. Space-separated list of: none, login, consent, select_account.
     * @param {number} maxAge - OIDC max_age paraleter for customization of consent screen. Maximum allowable elapsed time in seconds since the user last authenticated. If exceeded, re-authentication is required.
     * @param {string} authorizationDetails - Rich authorization request. JSON array of objects, each with a `type` and project-defined fields
     * @param {string} resource - RFC 8707 resource indicator URI or URI list. Each value must be an absolute URI without a fragment.
     * @param {string} audience - Compatibility alias for a single OAuth2 resource indicator URI.
     * @param {string} requestUri - OAuth2 authorization request handle returned by the pushed authorization request endpoint.
     * @throws {AppwriteException}
     * @returns {Promise<Models.Oauth2Authorize>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    authorizePost(
        clientId?: string,
        redirectUri?: string,
        responseType?: string,
        scope?: string,
        state?: string,
        nonce?: string,
        codeChallenge?: string,
        codeChallengeMethod?: string,
        prompt?: string,
        maxAge?: number,
        authorizationDetails?: string,
        resource?: string,
        audience?: string,
        requestUri?: string,
    ): Promise<Models.Oauth2Authorize>;
    authorizePost(
        paramsOrFirst?:
            | {
                  clientId?: string;
                  redirectUri?: string;
                  responseType?: string;
                  scope?: string;
                  state?: string;
                  nonce?: string;
                  codeChallenge?: string;
                  codeChallengeMethod?: string;
                  prompt?: string;
                  maxAge?: number;
                  authorizationDetails?: string;
                  resource?: string;
                  audience?: string;
                  requestUri?: string;
              }
            | string,
        ...rest: [
            string?,
            string?,
            string?,
            string?,
            string?,
            string?,
            string?,
            string?,
            number?,
            string?,
            string?,
            string?,
            string?,
        ]
    ): Promise<Models.Oauth2Authorize> {
        let params: {
            clientId?: string;
            redirectUri?: string;
            responseType?: string;
            scope?: string;
            state?: string;
            nonce?: string;
            codeChallenge?: string;
            codeChallengeMethod?: string;
            prompt?: string;
            maxAge?: number;
            authorizationDetails?: string;
            resource?: string;
            audience?: string;
            requestUri?: string;
        };

        if (
            (typeof paramsOrFirst === 'undefined' && rest.length === 0) ||
            (paramsOrFirst &&
                typeof paramsOrFirst === 'object' &&
                !Array.isArray(paramsOrFirst))
        ) {
            params = (paramsOrFirst || {}) as {
                clientId?: string;
                redirectUri?: string;
                responseType?: string;
                scope?: string;
                state?: string;
                nonce?: string;
                codeChallenge?: string;
                codeChallengeMethod?: string;
                prompt?: string;
                maxAge?: number;
                authorizationDetails?: string;
                resource?: string;
                audience?: string;
                requestUri?: string;
            };
        } else {
            params = {
                clientId: paramsOrFirst as string,
                redirectUri: rest[0] as string,
                responseType: rest[1] as string,
                scope: rest[2] as string,
                state: rest[3] as string,
                nonce: rest[4] as string,
                codeChallenge: rest[5] as string,
                codeChallengeMethod: rest[6] as string,
                prompt: rest[7] as string,
                maxAge: rest[8] as number,
                authorizationDetails: rest[9] as string,
                resource: rest[10] as string,
                audience: rest[11] as string,
                requestUri: rest[12] as string,
            };
        }

        const clientId = params.clientId;
        const redirectUri = params.redirectUri;
        const responseType = params.responseType;
        const scope = params.scope;
        const state = params.state;
        const nonce = params.nonce;
        const codeChallenge = params.codeChallenge;
        const codeChallengeMethod = params.codeChallengeMethod;
        const prompt = params.prompt;
        const maxAge = params.maxAge;
        const authorizationDetails = params.authorizationDetails;
        const resource = params.resource;
        const audience = params.audience;
        const requestUri = params.requestUri;

        const apiPath = '/oauth2/{project_id}/authorize'.replace(
            '{project_id}',
            encodeURIComponent(String(this.client.config.project)),
        );
        const apiPayload: Payload = {};

        if (typeof clientId !== 'undefined') {
            apiPayload['client_id'] = clientId;
        }

        if (typeof redirectUri !== 'undefined') {
            apiPayload['redirect_uri'] = redirectUri;
        }

        if (typeof responseType !== 'undefined') {
            apiPayload['response_type'] = responseType;
        }

        if (typeof scope !== 'undefined') {
            apiPayload['scope'] = scope;
        }

        if (typeof state !== 'undefined') {
            apiPayload['state'] = state;
        }

        if (typeof nonce !== 'undefined') {
            apiPayload['nonce'] = nonce;
        }

        if (typeof codeChallenge !== 'undefined') {
            apiPayload['code_challenge'] = codeChallenge;
        }

        if (typeof codeChallengeMethod !== 'undefined') {
            apiPayload['code_challenge_method'] = codeChallengeMethod;
        }

        if (typeof prompt !== 'undefined') {
            apiPayload['prompt'] = prompt;
        }

        if (typeof maxAge !== 'undefined') {
            apiPayload['max_age'] = maxAge;
        }

        if (typeof authorizationDetails !== 'undefined') {
            apiPayload['authorization_details'] = authorizationDetails;
        }

        if (typeof resource !== 'undefined') {
            apiPayload['resource'] = resource;
        }

        if (typeof audience !== 'undefined') {
            apiPayload['audience'] = audience;
        }

        if (typeof requestUri !== 'undefined') {
            apiPayload['request_uri'] = requestUri;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call(
            'post',
            uri,
            {
                'content-type': 'application/json',
                accept: 'application/json',
            },
            apiPayload,
        );
    }

    /**
     * Start the OAuth2 Device Authorization Grant. Returns the device code, user code, verification URL, expiration, and polling interval.
     *
     * @param {string} params.clientId - OAuth2 client ID. Either a registered app ID or an HTTPS client ID metadata document URL.
     * @param {string} params.scope - Space-separated OAuth2 scopes. Can include project scopes, and built-in scopes: `openid`, `email`, `profile`.
     * @param {string} params.authorizationDetails - Rich authorization request. JSON array of objects, each with a `type` and project-defined fields
     * @param {string} params.resource - RFC 8707 resource indicator URI or URI list. Each value must be an absolute URI without a fragment.
     * @param {string} params.audience - Compatibility alias for a single OAuth2 resource indicator URI.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    createDeviceAuthorization(params?: {
        clientId?: string;
        scope?: string;
        authorizationDetails?: string;
        resource?: string;
        audience?: string;
    }): Promise<Models.Oauth2DeviceAuthorization>;
    /**
     * Start the OAuth2 Device Authorization Grant. Returns the device code, user code, verification URL, expiration, and polling interval.
     *
     * @param {string} clientId - OAuth2 client ID. Either a registered app ID or an HTTPS client ID metadata document URL.
     * @param {string} scope - Space-separated OAuth2 scopes. Can include project scopes, and built-in scopes: `openid`, `email`, `profile`.
     * @param {string} authorizationDetails - Rich authorization request. JSON array of objects, each with a `type` and project-defined fields
     * @param {string} resource - RFC 8707 resource indicator URI or URI list. Each value must be an absolute URI without a fragment.
     * @param {string} audience - Compatibility alias for a single OAuth2 resource indicator URI.
     * @throws {AppwriteException}
     * @returns {Promise<Models.Oauth2DeviceAuthorization>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    createDeviceAuthorization(
        clientId?: string,
        scope?: string,
        authorizationDetails?: string,
        resource?: string,
        audience?: string,
    ): Promise<Models.Oauth2DeviceAuthorization>;
    createDeviceAuthorization(
        paramsOrFirst?:
            | {
                  clientId?: string;
                  scope?: string;
                  authorizationDetails?: string;
                  resource?: string;
                  audience?: string;
              }
            | string,
        ...rest: [string?, string?, string?, string?]
    ): Promise<Models.Oauth2DeviceAuthorization> {
        let params: {
            clientId?: string;
            scope?: string;
            authorizationDetails?: string;
            resource?: string;
            audience?: string;
        };

        if (
            (typeof paramsOrFirst === 'undefined' && rest.length === 0) ||
            (paramsOrFirst &&
                typeof paramsOrFirst === 'object' &&
                !Array.isArray(paramsOrFirst))
        ) {
            params = (paramsOrFirst || {}) as {
                clientId?: string;
                scope?: string;
                authorizationDetails?: string;
                resource?: string;
                audience?: string;
            };
        } else {
            params = {
                clientId: paramsOrFirst as string,
                scope: rest[0] as string,
                authorizationDetails: rest[1] as string,
                resource: rest[2] as string,
                audience: rest[3] as string,
            };
        }

        const clientId = params.clientId;
        const scope = params.scope;
        const authorizationDetails = params.authorizationDetails;
        const resource = params.resource;
        const audience = params.audience;

        const apiPath = '/oauth2/{project_id}/device_authorization'.replace(
            '{project_id}',
            encodeURIComponent(String(this.client.config.project)),
        );
        const apiPayload: Payload = {};

        if (typeof clientId !== 'undefined') {
            apiPayload['client_id'] = clientId;
        }

        if (typeof scope !== 'undefined') {
            apiPayload['scope'] = scope;
        }

        if (typeof authorizationDetails !== 'undefined') {
            apiPayload['authorization_details'] = authorizationDetails;
        }

        if (typeof resource !== 'undefined') {
            apiPayload['resource'] = resource;
        }

        if (typeof audience !== 'undefined') {
            apiPayload['audience'] = audience;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call(
            'post',
            uri,
            {
                'content-type': 'application/json',
                accept: 'application/json',
            },
            apiPayload,
        );
    }

    /**
     * Exchange a device flow user code for an OAuth2 grant. The authenticated user is bound to the pending grant. Pass the returned grant ID to the get grant endpoint to render the consent screen, then to the approve or reject endpoint to complete the flow.
     *
     * @param {string} params.userCode - User code displayed on the device.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    createGrant(params: { userCode: string }): Promise<Models.Oauth2Grant>;
    /**
     * Exchange a device flow user code for an OAuth2 grant. The authenticated user is bound to the pending grant. Pass the returned grant ID to the get grant endpoint to render the consent screen, then to the approve or reject endpoint to complete the flow.
     *
     * @param {string} userCode - User code displayed on the device.
     * @throws {AppwriteException}
     * @returns {Promise<Models.Oauth2Grant>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    createGrant(userCode: string): Promise<Models.Oauth2Grant>;
    createGrant(
        paramsOrFirst: { userCode: string } | string,
    ): Promise<Models.Oauth2Grant> {
        let params: { userCode: string };

        if (
            paramsOrFirst &&
            typeof paramsOrFirst === 'object' &&
            !Array.isArray(paramsOrFirst)
        ) {
            params = (paramsOrFirst || {}) as { userCode: string };
        } else {
            params = {
                userCode: paramsOrFirst as string,
            };
        }

        const userCode = params.userCode;

        if (typeof userCode === 'undefined') {
            throw new AppwriteException(
                'Missing required parameter: "userCode"',
            );
        }

        const apiPath = '/oauth2/{project_id}/grants'.replace(
            '{project_id}',
            encodeURIComponent(String(this.client.config.project)),
        );
        const apiPayload: Payload = {};

        if (typeof userCode !== 'undefined') {
            apiPayload['user_code'] = userCode;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call(
            'post',
            uri,
            {
                'content-type': 'application/json',
                accept: 'application/json',
            },
            apiPayload,
        );
    }

    /**
     * Get an OAuth2 grant by its ID. Used by the consent screen to display the details of the authorization the user is being asked to approve. A grant can only be read by the user it belongs to, or by server SDK.
     *
     * @param {string} params.grantId - Grant ID made during authorization, provided to consent screen in URL search params.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    getGrant(params: { grantId: string }): Promise<Models.Oauth2Grant>;
    /**
     * Get an OAuth2 grant by its ID. Used by the consent screen to display the details of the authorization the user is being asked to approve. A grant can only be read by the user it belongs to, or by server SDK.
     *
     * @param {string} grantId - Grant ID made during authorization, provided to consent screen in URL search params.
     * @throws {AppwriteException}
     * @returns {Promise<Models.Oauth2Grant>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    getGrant(grantId: string): Promise<Models.Oauth2Grant>;
    getGrant(
        paramsOrFirst: { grantId: string } | string,
    ): Promise<Models.Oauth2Grant> {
        let params: { grantId: string };

        if (
            paramsOrFirst &&
            typeof paramsOrFirst === 'object' &&
            !Array.isArray(paramsOrFirst)
        ) {
            params = (paramsOrFirst || {}) as { grantId: string };
        } else {
            params = {
                grantId: paramsOrFirst as string,
            };
        }

        const grantId = params.grantId;

        if (typeof grantId === 'undefined' || grantId === '') {
            throw new AppwriteException(
                'Missing required parameter: "grantId"',
            );
        }

        const apiPath = '/oauth2/{project_id}/grants/{grant_id}'
            .replace(
                '{project_id}',
                encodeURIComponent(String(this.client.config.project)),
            )
            .replace('{grant_id}', encodeURIComponent(String(grantId)));
        const apiPayload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call(
            'get',
            uri,
            {
                accept: 'application/json',
            },
            apiPayload,
        );
    }

    /**
     * OpenID Connect RP-Initiated Logout. Ends the user session and revokes the tokens issued to the app identified by the `id_token_hint`, then redirects the user to `post_logout_redirect_uri` when it matches a URI registered on the app.
     *
     * @param {string} params.idTokenHint - ID Token previously issued to the app, used as proof of the logout request. Required to end the session; signature and issuer are validated while expiry is ignored.
     * @param {string} params.logoutHint - Hint about the user that is logging out. Accepted for OIDC compatibility.
     * @param {string} params.clientId - OAuth2 client ID. When both `client_id` and `id_token_hint` are provided, they must identify the same app.
     * @param {string} params.postLogoutRedirectUri - URI to redirect the user to after logout. Must exactly match a URI registered in the app's `postLogoutRedirectUris`.
     * @param {string} params.state - Opaque value passed back unchanged in the `state` query param of the post-logout redirect.
     * @param {string} params.uiLocales - Preferred languages for any logout UI, as space-separated BCP47 tags. Accepted for OIDC compatibility.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    logout(params?: {
        idTokenHint?: string;
        logoutHint?: string;
        clientId?: string;
        postLogoutRedirectUri?: string;
        state?: string;
        uiLocales?: string;
    }): Promise<{}>;
    /**
     * OpenID Connect RP-Initiated Logout. Ends the user session and revokes the tokens issued to the app identified by the `id_token_hint`, then redirects the user to `post_logout_redirect_uri` when it matches a URI registered on the app.
     *
     * @param {string} idTokenHint - ID Token previously issued to the app, used as proof of the logout request. Required to end the session; signature and issuer are validated while expiry is ignored.
     * @param {string} logoutHint - Hint about the user that is logging out. Accepted for OIDC compatibility.
     * @param {string} clientId - OAuth2 client ID. When both `client_id` and `id_token_hint` are provided, they must identify the same app.
     * @param {string} postLogoutRedirectUri - URI to redirect the user to after logout. Must exactly match a URI registered in the app's `postLogoutRedirectUris`.
     * @param {string} state - Opaque value passed back unchanged in the `state` query param of the post-logout redirect.
     * @param {string} uiLocales - Preferred languages for any logout UI, as space-separated BCP47 tags. Accepted for OIDC compatibility.
     * @throws {AppwriteException}
     * @returns {Promise<{}>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    logout(
        idTokenHint?: string,
        logoutHint?: string,
        clientId?: string,
        postLogoutRedirectUri?: string,
        state?: string,
        uiLocales?: string,
    ): Promise<{}>;
    logout(
        paramsOrFirst?:
            | {
                  idTokenHint?: string;
                  logoutHint?: string;
                  clientId?: string;
                  postLogoutRedirectUri?: string;
                  state?: string;
                  uiLocales?: string;
              }
            | string,
        ...rest: [string?, string?, string?, string?, string?]
    ): Promise<{}> {
        let params: {
            idTokenHint?: string;
            logoutHint?: string;
            clientId?: string;
            postLogoutRedirectUri?: string;
            state?: string;
            uiLocales?: string;
        };

        if (
            (typeof paramsOrFirst === 'undefined' && rest.length === 0) ||
            (paramsOrFirst &&
                typeof paramsOrFirst === 'object' &&
                !Array.isArray(paramsOrFirst))
        ) {
            params = (paramsOrFirst || {}) as {
                idTokenHint?: string;
                logoutHint?: string;
                clientId?: string;
                postLogoutRedirectUri?: string;
                state?: string;
                uiLocales?: string;
            };
        } else {
            params = {
                idTokenHint: paramsOrFirst as string,
                logoutHint: rest[0] as string,
                clientId: rest[1] as string,
                postLogoutRedirectUri: rest[2] as string,
                state: rest[3] as string,
                uiLocales: rest[4] as string,
            };
        }

        const idTokenHint = params.idTokenHint;
        const logoutHint = params.logoutHint;
        const clientId = params.clientId;
        const postLogoutRedirectUri = params.postLogoutRedirectUri;
        const state = params.state;
        const uiLocales = params.uiLocales;

        const apiPath = '/oauth2/{project_id}/logout'.replace(
            '{project_id}',
            encodeURIComponent(String(this.client.config.project)),
        );
        const apiPayload: Payload = {};

        if (typeof idTokenHint !== 'undefined') {
            apiPayload['id_token_hint'] = idTokenHint;
        }

        if (typeof logoutHint !== 'undefined') {
            apiPayload['logout_hint'] = logoutHint;
        }

        if (typeof clientId !== 'undefined') {
            apiPayload['client_id'] = clientId;
        }

        if (typeof postLogoutRedirectUri !== 'undefined') {
            apiPayload['post_logout_redirect_uri'] = postLogoutRedirectUri;
        }

        if (typeof state !== 'undefined') {
            apiPayload['state'] = state;
        }

        if (typeof uiLocales !== 'undefined') {
            apiPayload['ui_locales'] = uiLocales;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call(
            'get',
            uri,
            {
                accept: 'application/json',
            },
            apiPayload,
        );
    }

    /**
     * OpenID Connect RP-Initiated Logout. Ends the user session and revokes the tokens issued to the app identified by the `id_token_hint`, then redirects the user to `post_logout_redirect_uri` when it matches a URI registered on the app.
     *
     * @param {string} params.idTokenHint - ID Token previously issued to the app, used as proof of the logout request. Required to end the session; signature and issuer are validated while expiry is ignored.
     * @param {string} params.logoutHint - Hint about the user that is logging out. Accepted for OIDC compatibility.
     * @param {string} params.clientId - OAuth2 client ID. When both `client_id` and `id_token_hint` are provided, they must identify the same app.
     * @param {string} params.postLogoutRedirectUri - URI to redirect the user to after logout. Must exactly match a URI registered in the app's `postLogoutRedirectUris`.
     * @param {string} params.state - Opaque value passed back unchanged in the `state` query param of the post-logout redirect.
     * @param {string} params.uiLocales - Preferred languages for any logout UI, as space-separated BCP47 tags. Accepted for OIDC compatibility.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    logoutPost(params?: {
        idTokenHint?: string;
        logoutHint?: string;
        clientId?: string;
        postLogoutRedirectUri?: string;
        state?: string;
        uiLocales?: string;
    }): Promise<{}>;
    /**
     * OpenID Connect RP-Initiated Logout. Ends the user session and revokes the tokens issued to the app identified by the `id_token_hint`, then redirects the user to `post_logout_redirect_uri` when it matches a URI registered on the app.
     *
     * @param {string} idTokenHint - ID Token previously issued to the app, used as proof of the logout request. Required to end the session; signature and issuer are validated while expiry is ignored.
     * @param {string} logoutHint - Hint about the user that is logging out. Accepted for OIDC compatibility.
     * @param {string} clientId - OAuth2 client ID. When both `client_id` and `id_token_hint` are provided, they must identify the same app.
     * @param {string} postLogoutRedirectUri - URI to redirect the user to after logout. Must exactly match a URI registered in the app's `postLogoutRedirectUris`.
     * @param {string} state - Opaque value passed back unchanged in the `state` query param of the post-logout redirect.
     * @param {string} uiLocales - Preferred languages for any logout UI, as space-separated BCP47 tags. Accepted for OIDC compatibility.
     * @throws {AppwriteException}
     * @returns {Promise<{}>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    logoutPost(
        idTokenHint?: string,
        logoutHint?: string,
        clientId?: string,
        postLogoutRedirectUri?: string,
        state?: string,
        uiLocales?: string,
    ): Promise<{}>;
    logoutPost(
        paramsOrFirst?:
            | {
                  idTokenHint?: string;
                  logoutHint?: string;
                  clientId?: string;
                  postLogoutRedirectUri?: string;
                  state?: string;
                  uiLocales?: string;
              }
            | string,
        ...rest: [string?, string?, string?, string?, string?]
    ): Promise<{}> {
        let params: {
            idTokenHint?: string;
            logoutHint?: string;
            clientId?: string;
            postLogoutRedirectUri?: string;
            state?: string;
            uiLocales?: string;
        };

        if (
            (typeof paramsOrFirst === 'undefined' && rest.length === 0) ||
            (paramsOrFirst &&
                typeof paramsOrFirst === 'object' &&
                !Array.isArray(paramsOrFirst))
        ) {
            params = (paramsOrFirst || {}) as {
                idTokenHint?: string;
                logoutHint?: string;
                clientId?: string;
                postLogoutRedirectUri?: string;
                state?: string;
                uiLocales?: string;
            };
        } else {
            params = {
                idTokenHint: paramsOrFirst as string,
                logoutHint: rest[0] as string,
                clientId: rest[1] as string,
                postLogoutRedirectUri: rest[2] as string,
                state: rest[3] as string,
                uiLocales: rest[4] as string,
            };
        }

        const idTokenHint = params.idTokenHint;
        const logoutHint = params.logoutHint;
        const clientId = params.clientId;
        const postLogoutRedirectUri = params.postLogoutRedirectUri;
        const state = params.state;
        const uiLocales = params.uiLocales;

        const apiPath = '/oauth2/{project_id}/logout'.replace(
            '{project_id}',
            encodeURIComponent(String(this.client.config.project)),
        );
        const apiPayload: Payload = {};

        if (typeof idTokenHint !== 'undefined') {
            apiPayload['id_token_hint'] = idTokenHint;
        }

        if (typeof logoutHint !== 'undefined') {
            apiPayload['logout_hint'] = logoutHint;
        }

        if (typeof clientId !== 'undefined') {
            apiPayload['client_id'] = clientId;
        }

        if (typeof postLogoutRedirectUri !== 'undefined') {
            apiPayload['post_logout_redirect_uri'] = postLogoutRedirectUri;
        }

        if (typeof state !== 'undefined') {
            apiPayload['state'] = state;
        }

        if (typeof uiLocales !== 'undefined') {
            apiPayload['ui_locales'] = uiLocales;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call(
            'post',
            uri,
            {
                'content-type': 'application/json',
                accept: 'application/json',
            },
            apiPayload,
        );
    }

    /**
     * List the organizations the OAuth2 access token can access. Resolves the token's `organization` authorization details, expanding the `*` wildcard into the concrete set of organizations the user can see.
     *
     * @param {number} params.limit - Maximum number of organizations to return. Between 1 and 5000.
     * @param {number} params.offset - Number of organizations to skip before returning results. Used for pagination.
     * @param {string} params.search - Search term to filter your list results. Max length: 256 chars.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    listOrganizations(params?: {
        limit?: number;
        offset?: number;
        search?: string;
    }): Promise<Models.Oauth2OrganizationList>;
    /**
     * List the organizations the OAuth2 access token can access. Resolves the token's `organization` authorization details, expanding the `*` wildcard into the concrete set of organizations the user can see.
     *
     * @param {number} limit - Maximum number of organizations to return. Between 1 and 5000.
     * @param {number} offset - Number of organizations to skip before returning results. Used for pagination.
     * @param {string} search - Search term to filter your list results. Max length: 256 chars.
     * @throws {AppwriteException}
     * @returns {Promise<Models.Oauth2OrganizationList>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    listOrganizations(
        limit?: number,
        offset?: number,
        search?: string,
    ): Promise<Models.Oauth2OrganizationList>;
    listOrganizations(
        paramsOrFirst?:
            { limit?: number; offset?: number; search?: string } | number,
        ...rest: [number?, string?]
    ): Promise<Models.Oauth2OrganizationList> {
        let params: { limit?: number; offset?: number; search?: string };

        if (
            (typeof paramsOrFirst === 'undefined' && rest.length === 0) ||
            (paramsOrFirst &&
                typeof paramsOrFirst === 'object' &&
                !Array.isArray(paramsOrFirst))
        ) {
            params = (paramsOrFirst || {}) as {
                limit?: number;
                offset?: number;
                search?: string;
            };
        } else {
            params = {
                limit: paramsOrFirst as number,
                offset: rest[0] as number,
                search: rest[1] as string,
            };
        }

        const limit = params.limit;
        const offset = params.offset;
        const search = params.search;

        const apiPath = '/oauth2/{project_id}/organizations'.replace(
            '{project_id}',
            encodeURIComponent(String(this.client.config.project)),
        );
        const apiPayload: Payload = {};

        if (typeof limit !== 'undefined') {
            apiPayload['limit'] = limit;
        }

        if (typeof offset !== 'undefined') {
            apiPayload['offset'] = offset;
        }

        if (typeof search !== 'undefined') {
            apiPayload['search'] = search;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call(
            'get',
            uri,
            {
                accept: 'application/json',
            },
            apiPayload,
        );
    }

    /**
     * Store an OAuth2 authorization request server-side and receive a short-lived request_uri handle for the authorize endpoint.
     *
     * @param {string} params.clientId - OAuth2 client ID. Either a registered app ID or an HTTPS client ID metadata document URL.
     * @param {string} params.redirectUri - Redirect URI where visitor will be redirected after authorization, whether successful or not.
     * @param {string} params.responseType - OAuth2 / OIDC response type.
     * @param {string} params.scope - Space-separated OAuth2 scopes. Can include project scopes, and built-in scopes: `openid`, `email`, `profile`, `phone`.
     * @param {string} params.state - OAuth2 state. You receive this back in the redirect URI.
     * @param {string} params.nonce - OIDC nonce parameter to prevent replay attacks. Required when response_type includes `id_token`.
     * @param {string} params.codeChallenge - PKCE code challenge. Required when OAuth2 app is public.
     * @param {string} params.codeChallengeMethod - PKCE code challenge method. Required when OAuth2 app is public.
     * @param {string} params.prompt - OIDC prompt parameter for customization of consent screen. Space-separated list of: none, login, consent, select_account.
     * @param {number} params.maxAge - OIDC max_age parameter for customization of consent screen.
     * @param {string} params.authorizationDetails - Rich authorization request. JSON array of objects, each with a `type` and project-defined fields
     * @param {string} params.resource - RFC 8707 resource indicator URI or URI list. Each value must be an absolute URI without a fragment.
     * @param {string} params.audience - Compatibility alias for a single OAuth2 resource indicator URI.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    createPAR(params: {
        clientId: string;
        redirectUri: string;
        responseType: string;
        scope?: string;
        state?: string;
        nonce?: string;
        codeChallenge?: string;
        codeChallengeMethod?: string;
        prompt?: string;
        maxAge?: number;
        authorizationDetails?: string;
        resource?: string;
        audience?: string;
    }): Promise<Models.Oauth2PAR>;
    /**
     * Store an OAuth2 authorization request server-side and receive a short-lived request_uri handle for the authorize endpoint.
     *
     * @param {string} clientId - OAuth2 client ID. Either a registered app ID or an HTTPS client ID metadata document URL.
     * @param {string} redirectUri - Redirect URI where visitor will be redirected after authorization, whether successful or not.
     * @param {string} responseType - OAuth2 / OIDC response type.
     * @param {string} scope - Space-separated OAuth2 scopes. Can include project scopes, and built-in scopes: `openid`, `email`, `profile`, `phone`.
     * @param {string} state - OAuth2 state. You receive this back in the redirect URI.
     * @param {string} nonce - OIDC nonce parameter to prevent replay attacks. Required when response_type includes `id_token`.
     * @param {string} codeChallenge - PKCE code challenge. Required when OAuth2 app is public.
     * @param {string} codeChallengeMethod - PKCE code challenge method. Required when OAuth2 app is public.
     * @param {string} prompt - OIDC prompt parameter for customization of consent screen. Space-separated list of: none, login, consent, select_account.
     * @param {number} maxAge - OIDC max_age parameter for customization of consent screen.
     * @param {string} authorizationDetails - Rich authorization request. JSON array of objects, each with a `type` and project-defined fields
     * @param {string} resource - RFC 8707 resource indicator URI or URI list. Each value must be an absolute URI without a fragment.
     * @param {string} audience - Compatibility alias for a single OAuth2 resource indicator URI.
     * @throws {AppwriteException}
     * @returns {Promise<Models.Oauth2PAR>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    createPAR(
        clientId: string,
        redirectUri: string,
        responseType: string,
        scope?: string,
        state?: string,
        nonce?: string,
        codeChallenge?: string,
        codeChallengeMethod?: string,
        prompt?: string,
        maxAge?: number,
        authorizationDetails?: string,
        resource?: string,
        audience?: string,
    ): Promise<Models.Oauth2PAR>;
    createPAR(
        paramsOrFirst:
            | {
                  clientId: string;
                  redirectUri: string;
                  responseType: string;
                  scope?: string;
                  state?: string;
                  nonce?: string;
                  codeChallenge?: string;
                  codeChallengeMethod?: string;
                  prompt?: string;
                  maxAge?: number;
                  authorizationDetails?: string;
                  resource?: string;
                  audience?: string;
              }
            | string,
        ...rest: [
            string?,
            string?,
            string?,
            string?,
            string?,
            string?,
            string?,
            string?,
            number?,
            string?,
            string?,
            string?,
        ]
    ): Promise<Models.Oauth2PAR> {
        let params: {
            clientId: string;
            redirectUri: string;
            responseType: string;
            scope?: string;
            state?: string;
            nonce?: string;
            codeChallenge?: string;
            codeChallengeMethod?: string;
            prompt?: string;
            maxAge?: number;
            authorizationDetails?: string;
            resource?: string;
            audience?: string;
        };

        if (
            paramsOrFirst &&
            typeof paramsOrFirst === 'object' &&
            !Array.isArray(paramsOrFirst)
        ) {
            params = (paramsOrFirst || {}) as {
                clientId: string;
                redirectUri: string;
                responseType: string;
                scope?: string;
                state?: string;
                nonce?: string;
                codeChallenge?: string;
                codeChallengeMethod?: string;
                prompt?: string;
                maxAge?: number;
                authorizationDetails?: string;
                resource?: string;
                audience?: string;
            };
        } else {
            params = {
                clientId: paramsOrFirst as string,
                redirectUri: rest[0] as string,
                responseType: rest[1] as string,
                scope: rest[2] as string,
                state: rest[3] as string,
                nonce: rest[4] as string,
                codeChallenge: rest[5] as string,
                codeChallengeMethod: rest[6] as string,
                prompt: rest[7] as string,
                maxAge: rest[8] as number,
                authorizationDetails: rest[9] as string,
                resource: rest[10] as string,
                audience: rest[11] as string,
            };
        }

        const clientId = params.clientId;
        const redirectUri = params.redirectUri;
        const responseType = params.responseType;
        const scope = params.scope;
        const state = params.state;
        const nonce = params.nonce;
        const codeChallenge = params.codeChallenge;
        const codeChallengeMethod = params.codeChallengeMethod;
        const prompt = params.prompt;
        const maxAge = params.maxAge;
        const authorizationDetails = params.authorizationDetails;
        const resource = params.resource;
        const audience = params.audience;

        if (typeof clientId === 'undefined') {
            throw new AppwriteException(
                'Missing required parameter: "clientId"',
            );
        }

        if (typeof redirectUri === 'undefined') {
            throw new AppwriteException(
                'Missing required parameter: "redirectUri"',
            );
        }

        if (typeof responseType === 'undefined') {
            throw new AppwriteException(
                'Missing required parameter: "responseType"',
            );
        }

        const apiPath = '/oauth2/{project_id}/par'.replace(
            '{project_id}',
            encodeURIComponent(String(this.client.config.project)),
        );
        const apiPayload: Payload = {};

        if (typeof clientId !== 'undefined') {
            apiPayload['client_id'] = clientId;
        }

        if (typeof redirectUri !== 'undefined') {
            apiPayload['redirect_uri'] = redirectUri;
        }

        if (typeof responseType !== 'undefined') {
            apiPayload['response_type'] = responseType;
        }

        if (typeof scope !== 'undefined') {
            apiPayload['scope'] = scope;
        }

        if (typeof state !== 'undefined') {
            apiPayload['state'] = state;
        }

        if (typeof nonce !== 'undefined') {
            apiPayload['nonce'] = nonce;
        }

        if (typeof codeChallenge !== 'undefined') {
            apiPayload['code_challenge'] = codeChallenge;
        }

        if (typeof codeChallengeMethod !== 'undefined') {
            apiPayload['code_challenge_method'] = codeChallengeMethod;
        }

        if (typeof prompt !== 'undefined') {
            apiPayload['prompt'] = prompt;
        }

        if (typeof maxAge !== 'undefined') {
            apiPayload['max_age'] = maxAge;
        }

        if (typeof authorizationDetails !== 'undefined') {
            apiPayload['authorization_details'] = authorizationDetails;
        }

        if (typeof resource !== 'undefined') {
            apiPayload['resource'] = resource;
        }

        if (typeof audience !== 'undefined') {
            apiPayload['audience'] = audience;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call(
            'post',
            uri,
            {
                'content-type': 'application/json',
                accept: 'application/json',
            },
            apiPayload,
        );
    }

    /**
     * List the projects the OAuth2 access token can access. Resolves the token's `project` authorization details, expanding the `*` wildcard into the concrete set of projects the user can see.
     *
     * @param {number} params.limit - Maximum number of projects to return. Between 1 and 5000.
     * @param {number} params.offset - Number of projects to skip before returning results. Used for pagination.
     * @param {string} params.search - Search term to filter your list results. Max length: 256 chars.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    listProjects(params?: {
        limit?: number;
        offset?: number;
        search?: string;
    }): Promise<Models.Oauth2ProjectList>;
    /**
     * List the projects the OAuth2 access token can access. Resolves the token's `project` authorization details, expanding the `*` wildcard into the concrete set of projects the user can see.
     *
     * @param {number} limit - Maximum number of projects to return. Between 1 and 5000.
     * @param {number} offset - Number of projects to skip before returning results. Used for pagination.
     * @param {string} search - Search term to filter your list results. Max length: 256 chars.
     * @throws {AppwriteException}
     * @returns {Promise<Models.Oauth2ProjectList>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    listProjects(
        limit?: number,
        offset?: number,
        search?: string,
    ): Promise<Models.Oauth2ProjectList>;
    listProjects(
        paramsOrFirst?:
            { limit?: number; offset?: number; search?: string } | number,
        ...rest: [number?, string?]
    ): Promise<Models.Oauth2ProjectList> {
        let params: { limit?: number; offset?: number; search?: string };

        if (
            (typeof paramsOrFirst === 'undefined' && rest.length === 0) ||
            (paramsOrFirst &&
                typeof paramsOrFirst === 'object' &&
                !Array.isArray(paramsOrFirst))
        ) {
            params = (paramsOrFirst || {}) as {
                limit?: number;
                offset?: number;
                search?: string;
            };
        } else {
            params = {
                limit: paramsOrFirst as number,
                offset: rest[0] as number,
                search: rest[1] as string,
            };
        }

        const limit = params.limit;
        const offset = params.offset;
        const search = params.search;

        const apiPath = '/oauth2/{project_id}/projects'.replace(
            '{project_id}',
            encodeURIComponent(String(this.client.config.project)),
        );
        const apiPayload: Payload = {};

        if (typeof limit !== 'undefined') {
            apiPayload['limit'] = limit;
        }

        if (typeof offset !== 'undefined') {
            apiPayload['offset'] = offset;
        }

        if (typeof search !== 'undefined') {
            apiPayload['search'] = search;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call(
            'get',
            uri,
            {
                accept: 'application/json',
            },
            apiPayload,
        );
    }

    /**
     * Reject an OAuth2 grant when the user denies consent. Returns the `redirectUrl` the end user should be sent to with an `access_denied` error. You can pass Accept header of `application/json` to receive a JSON response instead of a redirect.
     *
     * @param {string} params.grantId - Grant ID made during authorization, provided to consent screen in URL search params.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    reject(params: { grantId: string }): Promise<Models.Oauth2Reject>;
    /**
     * Reject an OAuth2 grant when the user denies consent. Returns the `redirectUrl` the end user should be sent to with an `access_denied` error. You can pass Accept header of `application/json` to receive a JSON response instead of a redirect.
     *
     * @param {string} grantId - Grant ID made during authorization, provided to consent screen in URL search params.
     * @throws {AppwriteException}
     * @returns {Promise<Models.Oauth2Reject>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    reject(grantId: string): Promise<Models.Oauth2Reject>;
    reject(
        paramsOrFirst: { grantId: string } | string,
    ): Promise<Models.Oauth2Reject> {
        let params: { grantId: string };

        if (
            paramsOrFirst &&
            typeof paramsOrFirst === 'object' &&
            !Array.isArray(paramsOrFirst)
        ) {
            params = (paramsOrFirst || {}) as { grantId: string };
        } else {
            params = {
                grantId: paramsOrFirst as string,
            };
        }

        const grantId = params.grantId;

        if (typeof grantId === 'undefined') {
            throw new AppwriteException(
                'Missing required parameter: "grantId"',
            );
        }

        const apiPath = '/oauth2/{project_id}/reject'.replace(
            '{project_id}',
            encodeURIComponent(String(this.client.config.project)),
        );
        const apiPayload: Payload = {};

        if (typeof grantId !== 'undefined') {
            apiPayload['grant_id'] = grantId;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call(
            'post',
            uri,
            {
                'content-type': 'application/json',
                accept: 'application/json',
            },
            apiPayload,
        );
    }

    /**
     * Revoke an OAuth2 access token or refresh token.
     *
     * @param {string} params.token - The access or refresh token to revoke.
     * @param {string} params.tokenTypeHint - Type of token to revoke (access_token or refresh_token).
     * @param {string} params.clientId - OAuth2 client ID. Either a registered app ID or an HTTPS client ID metadata document URL.
     * @param {string} params.clientSecret - OAuth2 client secret. Required for confidential apps; omitted for public apps.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    revoke(params: {
        token: string;
        tokenTypeHint?: string;
        clientId?: string;
        clientSecret?: string;
    }): Promise<{}>;
    /**
     * Revoke an OAuth2 access token or refresh token.
     *
     * @param {string} token - The access or refresh token to revoke.
     * @param {string} tokenTypeHint - Type of token to revoke (access_token or refresh_token).
     * @param {string} clientId - OAuth2 client ID. Either a registered app ID or an HTTPS client ID metadata document URL.
     * @param {string} clientSecret - OAuth2 client secret. Required for confidential apps; omitted for public apps.
     * @throws {AppwriteException}
     * @returns {Promise<{}>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    revoke(
        token: string,
        tokenTypeHint?: string,
        clientId?: string,
        clientSecret?: string,
    ): Promise<{}>;
    revoke(
        paramsOrFirst:
            | {
                  token: string;
                  tokenTypeHint?: string;
                  clientId?: string;
                  clientSecret?: string;
              }
            | string,
        ...rest: [string?, string?, string?]
    ): Promise<{}> {
        let params: {
            token: string;
            tokenTypeHint?: string;
            clientId?: string;
            clientSecret?: string;
        };

        if (
            paramsOrFirst &&
            typeof paramsOrFirst === 'object' &&
            !Array.isArray(paramsOrFirst)
        ) {
            params = (paramsOrFirst || {}) as {
                token: string;
                tokenTypeHint?: string;
                clientId?: string;
                clientSecret?: string;
            };
        } else {
            params = {
                token: paramsOrFirst as string,
                tokenTypeHint: rest[0] as string,
                clientId: rest[1] as string,
                clientSecret: rest[2] as string,
            };
        }

        const token = params.token;
        const tokenTypeHint = params.tokenTypeHint;
        const clientId = params.clientId;
        const clientSecret = params.clientSecret;

        if (typeof token === 'undefined') {
            throw new AppwriteException('Missing required parameter: "token"');
        }

        const apiPath = '/oauth2/{project_id}/revoke'.replace(
            '{project_id}',
            encodeURIComponent(String(this.client.config.project)),
        );
        const apiPayload: Payload = {};

        if (typeof token !== 'undefined') {
            apiPayload['token'] = token;
        }

        if (typeof tokenTypeHint !== 'undefined') {
            apiPayload['token_type_hint'] = tokenTypeHint;
        }

        if (typeof clientId !== 'undefined') {
            apiPayload['client_id'] = clientId;
        }

        if (typeof clientSecret !== 'undefined') {
            apiPayload['client_secret'] = clientSecret;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call(
            'post',
            uri,
            {
                'content-type': 'application/json',
                accept: 'application/json',
            },
            apiPayload,
        );
    }

    /**
     * Exchange an OAuth2 authorization code, refresh token, or device code for access and refresh tokens.
     *
     * @param {string} params.grantType - OAuth2 grant type. Can be one of: `authorization_code`, `refresh_token`, `urn:ietf:params:oauth:grant-type:device_code`.
     * @param {string} params.code - Authorization code to be exchanged for access and refresh tokens. Required for `authorization_code` grant type.
     * @param {string} params.refreshToken - Refresh token to be exchanged for a new access and refresh tokens. Required for `refresh_token` grant type.
     * @param {string} params.deviceCode - Device code obtained from the device authorization endpoint. Required for `urn:ietf:params:oauth:grant-type:device_code` grant type.
     * @param {string} params.clientId - OAuth2 client ID. Either a registered app ID or an HTTPS client ID metadata document URL.
     * @param {string} params.clientSecret - OAuth2 client secret. Required for confidential apps.
     * @param {string} params.codeVerifier - PKCE code verifier. Required for public apps.
     * @param {string} params.redirectUri - Redirect URI. Required for `authorization_code` grant type.
     * @param {string} params.resource - RFC 8707 resource indicator URI or URI list. Each value must be an absolute URI without a fragment.
     * @param {string} params.audience - Compatibility alias for a single OAuth2 resource indicator URI.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    createToken(params: {
        grantType: string;
        code?: string;
        refreshToken?: string;
        deviceCode?: string;
        clientId?: string;
        clientSecret?: string;
        codeVerifier?: string;
        redirectUri?: string;
        resource?: string;
        audience?: string;
    }): Promise<Models.Oauth2Token>;
    /**
     * Exchange an OAuth2 authorization code, refresh token, or device code for access and refresh tokens.
     *
     * @param {string} grantType - OAuth2 grant type. Can be one of: `authorization_code`, `refresh_token`, `urn:ietf:params:oauth:grant-type:device_code`.
     * @param {string} code - Authorization code to be exchanged for access and refresh tokens. Required for `authorization_code` grant type.
     * @param {string} refreshToken - Refresh token to be exchanged for a new access and refresh tokens. Required for `refresh_token` grant type.
     * @param {string} deviceCode - Device code obtained from the device authorization endpoint. Required for `urn:ietf:params:oauth:grant-type:device_code` grant type.
     * @param {string} clientId - OAuth2 client ID. Either a registered app ID or an HTTPS client ID metadata document URL.
     * @param {string} clientSecret - OAuth2 client secret. Required for confidential apps.
     * @param {string} codeVerifier - PKCE code verifier. Required for public apps.
     * @param {string} redirectUri - Redirect URI. Required for `authorization_code` grant type.
     * @param {string} resource - RFC 8707 resource indicator URI or URI list. Each value must be an absolute URI without a fragment.
     * @param {string} audience - Compatibility alias for a single OAuth2 resource indicator URI.
     * @throws {AppwriteException}
     * @returns {Promise<Models.Oauth2Token>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    createToken(
        grantType: string,
        code?: string,
        refreshToken?: string,
        deviceCode?: string,
        clientId?: string,
        clientSecret?: string,
        codeVerifier?: string,
        redirectUri?: string,
        resource?: string,
        audience?: string,
    ): Promise<Models.Oauth2Token>;
    createToken(
        paramsOrFirst:
            | {
                  grantType: string;
                  code?: string;
                  refreshToken?: string;
                  deviceCode?: string;
                  clientId?: string;
                  clientSecret?: string;
                  codeVerifier?: string;
                  redirectUri?: string;
                  resource?: string;
                  audience?: string;
              }
            | string,
        ...rest: [
            string?,
            string?,
            string?,
            string?,
            string?,
            string?,
            string?,
            string?,
            string?,
        ]
    ): Promise<Models.Oauth2Token> {
        let params: {
            grantType: string;
            code?: string;
            refreshToken?: string;
            deviceCode?: string;
            clientId?: string;
            clientSecret?: string;
            codeVerifier?: string;
            redirectUri?: string;
            resource?: string;
            audience?: string;
        };

        if (
            paramsOrFirst &&
            typeof paramsOrFirst === 'object' &&
            !Array.isArray(paramsOrFirst)
        ) {
            params = (paramsOrFirst || {}) as {
                grantType: string;
                code?: string;
                refreshToken?: string;
                deviceCode?: string;
                clientId?: string;
                clientSecret?: string;
                codeVerifier?: string;
                redirectUri?: string;
                resource?: string;
                audience?: string;
            };
        } else {
            params = {
                grantType: paramsOrFirst as string,
                code: rest[0] as string,
                refreshToken: rest[1] as string,
                deviceCode: rest[2] as string,
                clientId: rest[3] as string,
                clientSecret: rest[4] as string,
                codeVerifier: rest[5] as string,
                redirectUri: rest[6] as string,
                resource: rest[7] as string,
                audience: rest[8] as string,
            };
        }

        const grantType = params.grantType;
        const code = params.code;
        const refreshToken = params.refreshToken;
        const deviceCode = params.deviceCode;
        const clientId = params.clientId;
        const clientSecret = params.clientSecret;
        const codeVerifier = params.codeVerifier;
        const redirectUri = params.redirectUri;
        const resource = params.resource;
        const audience = params.audience;

        if (typeof grantType === 'undefined') {
            throw new AppwriteException(
                'Missing required parameter: "grantType"',
            );
        }

        const apiPath = '/oauth2/{project_id}/token'.replace(
            '{project_id}',
            encodeURIComponent(String(this.client.config.project)),
        );
        const apiPayload: Payload = {};

        if (typeof grantType !== 'undefined') {
            apiPayload['grant_type'] = grantType;
        }

        if (typeof code !== 'undefined') {
            apiPayload['code'] = code;
        }

        if (typeof refreshToken !== 'undefined') {
            apiPayload['refresh_token'] = refreshToken;
        }

        if (typeof deviceCode !== 'undefined') {
            apiPayload['device_code'] = deviceCode;
        }

        if (typeof clientId !== 'undefined') {
            apiPayload['client_id'] = clientId;
        }

        if (typeof clientSecret !== 'undefined') {
            apiPayload['client_secret'] = clientSecret;
        }

        if (typeof codeVerifier !== 'undefined') {
            apiPayload['code_verifier'] = codeVerifier;
        }

        if (typeof redirectUri !== 'undefined') {
            apiPayload['redirect_uri'] = redirectUri;
        }

        if (typeof resource !== 'undefined') {
            apiPayload['resource'] = resource;
        }

        if (typeof audience !== 'undefined') {
            apiPayload['audience'] = audience;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call(
            'post',
            uri,
            {
                'content-type': 'application/json',
                accept: 'application/json',
            },
            apiPayload,
        );
    }
}

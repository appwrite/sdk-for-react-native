import { Service } from '../service';
import { AppwriteException, Client } from '../client';
import type { Models } from '../models';
import type { UploadProgress, Payload } from '../client';
import * as FileSystem from 'expo-file-system';
import { Platform as RNPlatform } from 'react-native';


export class Oauth2 extends Service {

     constructor(client: Client)
     {
        super(client);
     }

    /**
     * Approve an OAuth2 grant after the user gives consent. Returns the `redirectUrl` the end user should be sent to. The consent screen may optionally pass enriched `authorization_details` to record the concrete resources the user selected. You can pass Accept header of `application/json` to receive a JSON response instead of a redirect.
     *
     * @param {string} params.projectId - Project ID in which OAuth2 client that created grant during authorization exists.
     * @param {string} params.grantId - Grant ID made during authorization, provided to consent screen in URL search params.
     * @param {string} params.authorizationDetails - Enriched `authorization_details` the user consented to, replacing what the client requested. Each entry must use a `type` the project accepts. Optional; omit to keep the originally requested details.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    approve(params: { projectId: string, grantId: string, authorizationDetails?: string  }): Promise<Models.Oauth2Approve>;
    /**
     * Approve an OAuth2 grant after the user gives consent. Returns the `redirectUrl` the end user should be sent to. The consent screen may optionally pass enriched `authorization_details` to record the concrete resources the user selected. You can pass Accept header of `application/json` to receive a JSON response instead of a redirect.
     *
     * @param {string} projectId - Project ID in which OAuth2 client that created grant during authorization exists.
     * @param {string} grantId - Grant ID made during authorization, provided to consent screen in URL search params.
     * @param {string} authorizationDetails - Enriched `authorization_details` the user consented to, replacing what the client requested. Each entry must use a `type` the project accepts. Optional; omit to keep the originally requested details.
     * @throws {AppwriteException}
     * @returns {Promise<Models.Oauth2Approve>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    approve(projectId: string, grantId: string, authorizationDetails?: string): Promise<Models.Oauth2Approve>;
    approve(
        paramsOrFirst: { projectId: string, grantId: string, authorizationDetails?: string } | string,
        ...rest: [(string)?, (string)?]    
    ): Promise<Models.Oauth2Approve> {
        let params: { projectId: string, grantId: string, authorizationDetails?: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { projectId: string, grantId: string, authorizationDetails?: string };
        } else {
            params = {
                projectId: paramsOrFirst as string,
                grantId: rest[0] as string,
                authorizationDetails: rest[1] as string            
            };
        }

        const projectId = params.projectId;
        const grantId = params.grantId;
        const authorizationDetails = params.authorizationDetails;

        if (typeof projectId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "projectId"');
        }

        if (typeof grantId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "grantId"');
        }

        const apiPath = '/oauth2/{project_id}/approve'.replace('{project_id}', projectId);
        const payload: Payload = {};

        if (typeof grantId !== 'undefined') {
            payload['grant_id'] = grantId;
        }

        if (typeof authorizationDetails !== 'undefined') {
            payload['authorization_details'] = authorizationDetails;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        uri.searchParams.append('project', this.client.config.project);
        return this.client.call('post', uri, {
            'content-type': 'application/json',
            'accept': 'application/json',
        }, payload);
    }

    /**
     * Begin the OAuth2 authorization flow. When called without a session, the user is redirected to the consent screen without grant ID. When called with a session, the redirect URL includes param for grant ID. You can pass Accept header of `application/json` to receive a JSON response instead of a redirect.
     *
     * @param {string} params.projectId - Project ID in which OAuth2 client exists.
     * @param {string} params.clientId - OAuth2 client ID.
     * @param {string} params.redirectUri - Redirect URI where visitor will be redirected after authorization, whether successful or not.
     * @param {string} params.responseType - OAuth2 / OIDC response type. One of `code` (Authorization Code Flow), `id_token` (Implicit Flow, OIDC login only), or `code id_token` (Hybrid Flow).
     * @param {string} params.scope - Space-separated OAuth2 scopes. Can include project scopes, and built-in scopes: `openid`, `email`, `profile`.
     * @param {string} params.state - OAuth2 state. You receive this back in the redirect URI.
     * @param {string} params.nonce - OIDC nonce parameter to prevent replay attacks. Required when response_type includes `id_token`.
     * @param {string} params.codeChallenge - PKCE code challenge. Required when OAuth2 app is public.
     * @param {string} params.codeChallengeMethod - PKCE code challenge method. Required when OAuth2 app is public.
     * @param {string} params.prompt - OIDC prompt parameter for customization of consent screen. Space-separated list of: none, login, consent, select_account.
     * @param {number} params.maxAge - OIDC max_age paraleter for customization of consent screen. Maximum allowable elapsed time in seconds since the user last authenticated. If exceeded, re-authentication is required.
     * @param {string} params.authorizationDetails - Rich authorization request. JSON array of objects, each with a `type` and project-defined fields
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    authorize(params: { projectId: string, clientId: string, redirectUri: string, responseType: string, scope: string, state?: string, nonce?: string, codeChallenge?: string, codeChallengeMethod?: string, prompt?: string, maxAge?: number, authorizationDetails?: string  }): Promise<Models.Oauth2Authorize>;
    /**
     * Begin the OAuth2 authorization flow. When called without a session, the user is redirected to the consent screen without grant ID. When called with a session, the redirect URL includes param for grant ID. You can pass Accept header of `application/json` to receive a JSON response instead of a redirect.
     *
     * @param {string} projectId - Project ID in which OAuth2 client exists.
     * @param {string} clientId - OAuth2 client ID.
     * @param {string} redirectUri - Redirect URI where visitor will be redirected after authorization, whether successful or not.
     * @param {string} responseType - OAuth2 / OIDC response type. One of `code` (Authorization Code Flow), `id_token` (Implicit Flow, OIDC login only), or `code id_token` (Hybrid Flow).
     * @param {string} scope - Space-separated OAuth2 scopes. Can include project scopes, and built-in scopes: `openid`, `email`, `profile`.
     * @param {string} state - OAuth2 state. You receive this back in the redirect URI.
     * @param {string} nonce - OIDC nonce parameter to prevent replay attacks. Required when response_type includes `id_token`.
     * @param {string} codeChallenge - PKCE code challenge. Required when OAuth2 app is public.
     * @param {string} codeChallengeMethod - PKCE code challenge method. Required when OAuth2 app is public.
     * @param {string} prompt - OIDC prompt parameter for customization of consent screen. Space-separated list of: none, login, consent, select_account.
     * @param {number} maxAge - OIDC max_age paraleter for customization of consent screen. Maximum allowable elapsed time in seconds since the user last authenticated. If exceeded, re-authentication is required.
     * @param {string} authorizationDetails - Rich authorization request. JSON array of objects, each with a `type` and project-defined fields
     * @throws {AppwriteException}
     * @returns {Promise<Models.Oauth2Authorize>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    authorize(projectId: string, clientId: string, redirectUri: string, responseType: string, scope: string, state?: string, nonce?: string, codeChallenge?: string, codeChallengeMethod?: string, prompt?: string, maxAge?: number, authorizationDetails?: string): Promise<Models.Oauth2Authorize>;
    authorize(
        paramsOrFirst: { projectId: string, clientId: string, redirectUri: string, responseType: string, scope: string, state?: string, nonce?: string, codeChallenge?: string, codeChallengeMethod?: string, prompt?: string, maxAge?: number, authorizationDetails?: string } | string,
        ...rest: [(string)?, (string)?, (string)?, (string)?, (string)?, (string)?, (string)?, (string)?, (string)?, (number)?, (string)?]    
    ): Promise<Models.Oauth2Authorize> {
        let params: { projectId: string, clientId: string, redirectUri: string, responseType: string, scope: string, state?: string, nonce?: string, codeChallenge?: string, codeChallengeMethod?: string, prompt?: string, maxAge?: number, authorizationDetails?: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { projectId: string, clientId: string, redirectUri: string, responseType: string, scope: string, state?: string, nonce?: string, codeChallenge?: string, codeChallengeMethod?: string, prompt?: string, maxAge?: number, authorizationDetails?: string };
        } else {
            params = {
                projectId: paramsOrFirst as string,
                clientId: rest[0] as string,
                redirectUri: rest[1] as string,
                responseType: rest[2] as string,
                scope: rest[3] as string,
                state: rest[4] as string,
                nonce: rest[5] as string,
                codeChallenge: rest[6] as string,
                codeChallengeMethod: rest[7] as string,
                prompt: rest[8] as string,
                maxAge: rest[9] as number,
                authorizationDetails: rest[10] as string            
            };
        }

        const projectId = params.projectId;
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

        if (typeof projectId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "projectId"');
        }

        if (typeof clientId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "clientId"');
        }

        if (typeof redirectUri === 'undefined') {
            throw new AppwriteException('Missing required parameter: "redirectUri"');
        }

        if (typeof responseType === 'undefined') {
            throw new AppwriteException('Missing required parameter: "responseType"');
        }

        if (typeof scope === 'undefined') {
            throw new AppwriteException('Missing required parameter: "scope"');
        }

        const apiPath = '/oauth2/{project_id}/authorize'.replace('{project_id}', projectId);
        const payload: Payload = {};

        if (typeof clientId !== 'undefined') {
            payload['client_id'] = clientId;
        }

        if (typeof redirectUri !== 'undefined') {
            payload['redirect_uri'] = redirectUri;
        }

        if (typeof responseType !== 'undefined') {
            payload['response_type'] = responseType;
        }

        if (typeof scope !== 'undefined') {
            payload['scope'] = scope;
        }

        if (typeof state !== 'undefined') {
            payload['state'] = state;
        }

        if (typeof nonce !== 'undefined') {
            payload['nonce'] = nonce;
        }

        if (typeof codeChallenge !== 'undefined') {
            payload['code_challenge'] = codeChallenge;
        }

        if (typeof codeChallengeMethod !== 'undefined') {
            payload['code_challenge_method'] = codeChallengeMethod;
        }

        if (typeof prompt !== 'undefined') {
            payload['prompt'] = prompt;
        }

        if (typeof maxAge !== 'undefined') {
            payload['max_age'] = maxAge;
        }

        if (typeof authorizationDetails !== 'undefined') {
            payload['authorization_details'] = authorizationDetails;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        uri.searchParams.append('project', this.client.config.project);
        return this.client.call('get', uri, {
            'accept': 'application/json',
        }, payload);
    }

    /**
     * Exchange a device flow user code for an OAuth2 grant. The authenticated user is bound to the pending grant. Pass the returned grant ID to the get grant endpoint to render the consent screen, then to the approve or reject endpoint to complete the flow.
     *
     * @param {string} params.projectId - Project ID in which OAuth2 client exists.
     * @param {string} params.userCode - User code displayed on the device.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    createGrant(params: { projectId: string, userCode: string  }): Promise<Models.Oauth2Grant>;
    /**
     * Exchange a device flow user code for an OAuth2 grant. The authenticated user is bound to the pending grant. Pass the returned grant ID to the get grant endpoint to render the consent screen, then to the approve or reject endpoint to complete the flow.
     *
     * @param {string} projectId - Project ID in which OAuth2 client exists.
     * @param {string} userCode - User code displayed on the device.
     * @throws {AppwriteException}
     * @returns {Promise<Models.Oauth2Grant>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    createGrant(projectId: string, userCode: string): Promise<Models.Oauth2Grant>;
    createGrant(
        paramsOrFirst: { projectId: string, userCode: string } | string,
        ...rest: [(string)?]    
    ): Promise<Models.Oauth2Grant> {
        let params: { projectId: string, userCode: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { projectId: string, userCode: string };
        } else {
            params = {
                projectId: paramsOrFirst as string,
                userCode: rest[0] as string            
            };
        }

        const projectId = params.projectId;
        const userCode = params.userCode;

        if (typeof projectId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "projectId"');
        }

        if (typeof userCode === 'undefined') {
            throw new AppwriteException('Missing required parameter: "userCode"');
        }

        const apiPath = '/oauth2/{project_id}/grants'.replace('{project_id}', projectId);
        const payload: Payload = {};

        if (typeof userCode !== 'undefined') {
            payload['user_code'] = userCode;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('post', uri, {
            'X-Appwrite-Project': this.client.config.project,
            'content-type': 'application/json',
            'accept': 'application/json',
        }, payload);
    }

    /**
     * Get an OAuth2 grant by its ID. Used by the consent screen to display the details of the authorization the user is being asked to approve. A grant can only be read by the user it belongs to, or by server SDK.
     *
     * @param {string} params.projectId - Project ID in which OAuth2 client that created grant during authorization exists.
     * @param {string} params.grantId - Grant ID made during authorization, provided to consent screen in URL search params.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    getGrant(params: { projectId: string, grantId: string  }): Promise<Models.Oauth2Grant>;
    /**
     * Get an OAuth2 grant by its ID. Used by the consent screen to display the details of the authorization the user is being asked to approve. A grant can only be read by the user it belongs to, or by server SDK.
     *
     * @param {string} projectId - Project ID in which OAuth2 client that created grant during authorization exists.
     * @param {string} grantId - Grant ID made during authorization, provided to consent screen in URL search params.
     * @throws {AppwriteException}
     * @returns {Promise<Models.Oauth2Grant>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    getGrant(projectId: string, grantId: string): Promise<Models.Oauth2Grant>;
    getGrant(
        paramsOrFirst: { projectId: string, grantId: string } | string,
        ...rest: [(string)?]    
    ): Promise<Models.Oauth2Grant> {
        let params: { projectId: string, grantId: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { projectId: string, grantId: string };
        } else {
            params = {
                projectId: paramsOrFirst as string,
                grantId: rest[0] as string            
            };
        }

        const projectId = params.projectId;
        const grantId = params.grantId;

        if (typeof projectId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "projectId"');
        }

        if (typeof grantId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "grantId"');
        }

        const apiPath = '/oauth2/{project_id}/grants/{grant_id}'.replace('{project_id}', projectId).replace('{grant_id}', grantId);
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('get', uri, {
            'X-Appwrite-Project': this.client.config.project,
            'accept': 'application/json',
        }, payload);
    }

    /**
     * Reject an OAuth2 grant when the user denies consent. Returns the `redirectUrl` the end user should be sent to with an `access_denied` error. You can pass Accept header of `application/json` to receive a JSON response instead of a redirect.
     *
     * @param {string} params.projectId - Project ID in which OAuth2 client that created grant during authorization exists.
     * @param {string} params.grantId - Grant ID made during authorization, provided to consent screen in URL search params.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    reject(params: { projectId: string, grantId: string  }): Promise<Models.Oauth2Reject>;
    /**
     * Reject an OAuth2 grant when the user denies consent. Returns the `redirectUrl` the end user should be sent to with an `access_denied` error. You can pass Accept header of `application/json` to receive a JSON response instead of a redirect.
     *
     * @param {string} projectId - Project ID in which OAuth2 client that created grant during authorization exists.
     * @param {string} grantId - Grant ID made during authorization, provided to consent screen in URL search params.
     * @throws {AppwriteException}
     * @returns {Promise<Models.Oauth2Reject>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    reject(projectId: string, grantId: string): Promise<Models.Oauth2Reject>;
    reject(
        paramsOrFirst: { projectId: string, grantId: string } | string,
        ...rest: [(string)?]    
    ): Promise<Models.Oauth2Reject> {
        let params: { projectId: string, grantId: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { projectId: string, grantId: string };
        } else {
            params = {
                projectId: paramsOrFirst as string,
                grantId: rest[0] as string            
            };
        }

        const projectId = params.projectId;
        const grantId = params.grantId;

        if (typeof projectId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "projectId"');
        }

        if (typeof grantId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "grantId"');
        }

        const apiPath = '/oauth2/{project_id}/reject'.replace('{project_id}', projectId);
        const payload: Payload = {};

        if (typeof grantId !== 'undefined') {
            payload['grant_id'] = grantId;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        uri.searchParams.append('project', this.client.config.project);
        return this.client.call('post', uri, {
            'content-type': 'application/json',
            'accept': 'application/json',
        }, payload);
    }
};

import { Service } from '../service';
import { AppwriteException, Client } from '../client';
import type { Models } from '../models';
import type { UploadProgress, Payload } from '../client';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

import { AuthenticatorType } from '../enums/authenticator-type';
import { AuthenticationFactor } from '../enums/authentication-factor';
import { OAuthProvider } from '../enums/o-auth-provider';

export class Account extends Service {

     constructor(client: Client)
     {
        super(client);
     }

    /**
     * Get the currently logged in user.
     *
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    get<Preferences extends Models.Preferences = Models.DefaultPreferences>(): Promise<Models.User<Preferences>> {
        const apiPath = '/account';
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('get', uri, {
        }, payload);
    }

    /**
     * Use this endpoint to allow a new user to register a new account in your project. After the user registration completes successfully, you can use the [/account/verfication](https://appwrite.io/docs/references/cloud/client-web/account#createVerification) route to start verifying the user email address. To allow the new user to login to their new account, you need to create a new [account session](https://appwrite.io/docs/references/cloud/client-web/account#createEmailSession).
     *
     * @param {string} params.userId - User ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.
     * @param {string} params.email - User email.
     * @param {string} params.password - New user password. Must be between 8 and 256 chars.
     * @param {string} params.name - User name. Max length: 128 chars.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    create<Preferences extends Models.Preferences = Models.DefaultPreferences>(params: { userId: string, email: string, password: string, name?: string  }): Promise<Models.User<Preferences>>;
    /**
     * Use this endpoint to allow a new user to register a new account in your project. After the user registration completes successfully, you can use the [/account/verfication](https://appwrite.io/docs/references/cloud/client-web/account#createVerification) route to start verifying the user email address. To allow the new user to login to their new account, you need to create a new [account session](https://appwrite.io/docs/references/cloud/client-web/account#createEmailSession).
     *
     * @param {string} userId - User ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.
     * @param {string} email - User email.
     * @param {string} password - New user password. Must be between 8 and 256 chars.
     * @param {string} name - User name. Max length: 128 chars.
     * @throws {AppwriteException}
     * @returns {Promise<Models.User<Preferences>>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    create<Preferences extends Models.Preferences = Models.DefaultPreferences>(userId: string, email: string, password: string, name?: string): Promise<Models.User<Preferences>>;
    create<Preferences extends Models.Preferences = Models.DefaultPreferences>(
        paramsOrFirst: { userId: string, email: string, password: string, name?: string } | string,
        ...rest: [(string)?, (string)?, (string)?]    
    ): Promise<Models.User<Preferences>> {
        let params: { userId: string, email: string, password: string, name?: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { userId: string, email: string, password: string, name?: string };
        } else {
            params = {
                userId: paramsOrFirst as string,
                email: rest[0] as string,
                password: rest[1] as string,
                name: rest[2] as string            
            };
        }

        const userId = params.userId;
        const email = params.email;
        const password = params.password;
        const name = params.name;

        if (typeof userId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "userId"');
        }

        if (typeof email === 'undefined') {
            throw new AppwriteException('Missing required parameter: "email"');
        }

        if (typeof password === 'undefined') {
            throw new AppwriteException('Missing required parameter: "password"');
        }

        const apiPath = '/account';
        const payload: Payload = {};

        if (typeof userId !== 'undefined') {
            payload['userId'] = userId;
        }

        if (typeof email !== 'undefined') {
            payload['email'] = email;
        }

        if (typeof password !== 'undefined') {
            payload['password'] = password;
        }

        if (typeof name !== 'undefined') {
            payload['name'] = name;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('post', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Update currently logged in user account email address. After changing user address, the user confirmation status will get reset. A new confirmation email is not sent automatically however you can use the send confirmation email endpoint again to send the confirmation email. For security measures, user password is required to complete this request.
     * This endpoint can also be used to convert an anonymous account to a normal one, by passing an email address and a new password.
     * 
     *
     * @param {string} params.email - User email.
     * @param {string} params.password - User password. Must be at least 8 chars.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    updateEmail<Preferences extends Models.Preferences = Models.DefaultPreferences>(params: { email: string, password: string  }): Promise<Models.User<Preferences>>;
    /**
     * Update currently logged in user account email address. After changing user address, the user confirmation status will get reset. A new confirmation email is not sent automatically however you can use the send confirmation email endpoint again to send the confirmation email. For security measures, user password is required to complete this request.
     * This endpoint can also be used to convert an anonymous account to a normal one, by passing an email address and a new password.
     * 
     *
     * @param {string} email - User email.
     * @param {string} password - User password. Must be at least 8 chars.
     * @throws {AppwriteException}
     * @returns {Promise<Models.User<Preferences>>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    updateEmail<Preferences extends Models.Preferences = Models.DefaultPreferences>(email: string, password: string): Promise<Models.User<Preferences>>;
    updateEmail<Preferences extends Models.Preferences = Models.DefaultPreferences>(
        paramsOrFirst: { email: string, password: string } | string,
        ...rest: [(string)?]    
    ): Promise<Models.User<Preferences>> {
        let params: { email: string, password: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { email: string, password: string };
        } else {
            params = {
                email: paramsOrFirst as string,
                password: rest[0] as string            
            };
        }

        const email = params.email;
        const password = params.password;

        if (typeof email === 'undefined') {
            throw new AppwriteException('Missing required parameter: "email"');
        }

        if (typeof password === 'undefined') {
            throw new AppwriteException('Missing required parameter: "password"');
        }

        const apiPath = '/account/email';
        const payload: Payload = {};

        if (typeof email !== 'undefined') {
            payload['email'] = email;
        }

        if (typeof password !== 'undefined') {
            payload['password'] = password;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('patch', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Get the list of identities for the currently logged in user.
     *
     * @param {string[]} params.queries - Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: userId, provider, providerUid, providerEmail, providerAccessTokenExpiry
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    listIdentities(params?: { queries?: string[]  }): Promise<Models.IdentityList>;
    /**
     * Get the list of identities for the currently logged in user.
     *
     * @param {string[]} queries - Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: userId, provider, providerUid, providerEmail, providerAccessTokenExpiry
     * @throws {AppwriteException}
     * @returns {Promise<Models.IdentityList>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    listIdentities(queries?: string[]): Promise<Models.IdentityList>;
    listIdentities(
        paramsOrFirst?: { queries?: string[] } | string[]    
    ): Promise<Models.IdentityList> {
        let params: { queries?: string[] };

        if (!paramsOrFirst || (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { queries?: string[] };
        } else {
            params = {
                queries: paramsOrFirst as string[]            
            };
        }

        const queries = params.queries;

        const apiPath = '/account/identities';
        const payload: Payload = {};

        if (typeof queries !== 'undefined') {
            payload['queries'] = queries;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('get', uri, {
        }, payload);
    }

    /**
     * Delete an identity by its unique ID.
     *
     * @param {string} params.identityId - Identity ID.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    deleteIdentity(params: { identityId: string  }): Promise<{}>;
    /**
     * Delete an identity by its unique ID.
     *
     * @param {string} identityId - Identity ID.
     * @throws {AppwriteException}
     * @returns {Promise<{}>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    deleteIdentity(identityId: string): Promise<{}>;
    deleteIdentity(
        paramsOrFirst: { identityId: string } | string    
    ): Promise<{}> {
        let params: { identityId: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { identityId: string };
        } else {
            params = {
                identityId: paramsOrFirst as string            
            };
        }

        const identityId = params.identityId;

        if (typeof identityId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "identityId"');
        }

        const apiPath = '/account/identities/{identityId}'.replace('{identityId}', identityId);
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('delete', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Use this endpoint to create a JSON Web Token. You can use the resulting JWT to authenticate on behalf of the current user when working with the Appwrite server-side API and SDKs. The JWT secret is valid for 15 minutes from its creation and will be invalid if the user will logout in that time frame.
     *
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    createJWT(): Promise<Models.Jwt> {
        const apiPath = '/account/jwts';
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('post', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Get the list of latest security activity logs for the currently logged in user. Each log returns user IP address, location and date and time of log.
     *
     * @param {string[]} params.queries - Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    listLogs(params?: { queries?: string[]  }): Promise<Models.LogList>;
    /**
     * Get the list of latest security activity logs for the currently logged in user. Each log returns user IP address, location and date and time of log.
     *
     * @param {string[]} queries - Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset
     * @throws {AppwriteException}
     * @returns {Promise<Models.LogList>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    listLogs(queries?: string[]): Promise<Models.LogList>;
    listLogs(
        paramsOrFirst?: { queries?: string[] } | string[]    
    ): Promise<Models.LogList> {
        let params: { queries?: string[] };

        if (!paramsOrFirst || (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { queries?: string[] };
        } else {
            params = {
                queries: paramsOrFirst as string[]            
            };
        }

        const queries = params.queries;

        const apiPath = '/account/logs';
        const payload: Payload = {};

        if (typeof queries !== 'undefined') {
            payload['queries'] = queries;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('get', uri, {
        }, payload);
    }

    /**
     * Enable or disable MFA on an account.
     *
     * @param {boolean} params.mfa - Enable or disable MFA.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    updateMFA<Preferences extends Models.Preferences = Models.DefaultPreferences>(params: { mfa: boolean  }): Promise<Models.User<Preferences>>;
    /**
     * Enable or disable MFA on an account.
     *
     * @param {boolean} mfa - Enable or disable MFA.
     * @throws {AppwriteException}
     * @returns {Promise<Models.User<Preferences>>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    updateMFA<Preferences extends Models.Preferences = Models.DefaultPreferences>(mfa: boolean): Promise<Models.User<Preferences>>;
    updateMFA<Preferences extends Models.Preferences = Models.DefaultPreferences>(
        paramsOrFirst: { mfa: boolean } | boolean    
    ): Promise<Models.User<Preferences>> {
        let params: { mfa: boolean };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { mfa: boolean };
        } else {
            params = {
                mfa: paramsOrFirst as boolean            
            };
        }

        const mfa = params.mfa;

        if (typeof mfa === 'undefined') {
            throw new AppwriteException('Missing required parameter: "mfa"');
        }

        const apiPath = '/account/mfa';
        const payload: Payload = {};

        if (typeof mfa !== 'undefined') {
            payload['mfa'] = mfa;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('patch', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Add an authenticator app to be used as an MFA factor. Verify the authenticator using the [verify authenticator](/docs/references/cloud/client-web/account#updateMfaAuthenticator) method.
     *
     * @param {AuthenticatorType} params.type - Type of authenticator. Must be `totp`
     * @throws {AppwriteException}
     * @returns {Promise}
     * @deprecated This API has been deprecated since 1.8.0. Please use `Account.createMFAAuthenticator` instead.
     */
    createMfaAuthenticator(params: { type: AuthenticatorType  }): Promise<Models.MfaType>;
    /**
     * Add an authenticator app to be used as an MFA factor. Verify the authenticator using the [verify authenticator](/docs/references/cloud/client-web/account#updateMfaAuthenticator) method.
     *
     * @param {AuthenticatorType} type - Type of authenticator. Must be `totp`
     * @throws {AppwriteException}
     * @returns {Promise<Models.MfaType>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    createMfaAuthenticator(type: AuthenticatorType): Promise<Models.MfaType>;
    createMfaAuthenticator(
        paramsOrFirst: { type: AuthenticatorType } | AuthenticatorType    
    ): Promise<Models.MfaType> {
        let params: { type: AuthenticatorType };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst) && 'type' in paramsOrFirst)) {
            params = (paramsOrFirst || {}) as { type: AuthenticatorType };
        } else {
            params = {
                type: paramsOrFirst as AuthenticatorType            
            };
        }

        const type = params.type;

        if (typeof type === 'undefined') {
            throw new AppwriteException('Missing required parameter: "type"');
        }

        const apiPath = '/account/mfa/authenticators/{type}'.replace('{type}', type);
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('post', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Add an authenticator app to be used as an MFA factor. Verify the authenticator using the [verify authenticator](/docs/references/cloud/client-web/account#updateMfaAuthenticator) method.
     *
     * @param {AuthenticatorType} params.type - Type of authenticator. Must be `totp`
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    createMFAAuthenticator(params: { type: AuthenticatorType  }): Promise<Models.MfaType>;
    /**
     * Add an authenticator app to be used as an MFA factor. Verify the authenticator using the [verify authenticator](/docs/references/cloud/client-web/account#updateMfaAuthenticator) method.
     *
     * @param {AuthenticatorType} type - Type of authenticator. Must be `totp`
     * @throws {AppwriteException}
     * @returns {Promise<Models.MfaType>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    createMFAAuthenticator(type: AuthenticatorType): Promise<Models.MfaType>;
    createMFAAuthenticator(
        paramsOrFirst: { type: AuthenticatorType } | AuthenticatorType    
    ): Promise<Models.MfaType> {
        let params: { type: AuthenticatorType };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst) && 'type' in paramsOrFirst)) {
            params = (paramsOrFirst || {}) as { type: AuthenticatorType };
        } else {
            params = {
                type: paramsOrFirst as AuthenticatorType            
            };
        }

        const type = params.type;

        if (typeof type === 'undefined') {
            throw new AppwriteException('Missing required parameter: "type"');
        }

        const apiPath = '/account/mfa/authenticators/{type}'.replace('{type}', type);
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('post', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Verify an authenticator app after adding it using the [add authenticator](/docs/references/cloud/client-web/account#createMfaAuthenticator) method.
     *
     * @param {AuthenticatorType} params.type - Type of authenticator.
     * @param {string} params.otp - Valid verification token.
     * @throws {AppwriteException}
     * @returns {Promise}
     * @deprecated This API has been deprecated since 1.8.0. Please use `Account.updateMFAAuthenticator` instead.
     */
    updateMfaAuthenticator<Preferences extends Models.Preferences = Models.DefaultPreferences>(params: { type: AuthenticatorType, otp: string  }): Promise<Models.User<Preferences>>;
    /**
     * Verify an authenticator app after adding it using the [add authenticator](/docs/references/cloud/client-web/account#createMfaAuthenticator) method.
     *
     * @param {AuthenticatorType} type - Type of authenticator.
     * @param {string} otp - Valid verification token.
     * @throws {AppwriteException}
     * @returns {Promise<Models.User<Preferences>>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    updateMfaAuthenticator<Preferences extends Models.Preferences = Models.DefaultPreferences>(type: AuthenticatorType, otp: string): Promise<Models.User<Preferences>>;
    updateMfaAuthenticator<Preferences extends Models.Preferences = Models.DefaultPreferences>(
        paramsOrFirst: { type: AuthenticatorType, otp: string } | AuthenticatorType,
        ...rest: [(string)?]    
    ): Promise<Models.User<Preferences>> {
        let params: { type: AuthenticatorType, otp: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst) && 'type' in paramsOrFirst)) {
            params = (paramsOrFirst || {}) as { type: AuthenticatorType, otp: string };
        } else {
            params = {
                type: paramsOrFirst as AuthenticatorType,
                otp: rest[0] as string            
            };
        }

        const type = params.type;
        const otp = params.otp;

        if (typeof type === 'undefined') {
            throw new AppwriteException('Missing required parameter: "type"');
        }

        if (typeof otp === 'undefined') {
            throw new AppwriteException('Missing required parameter: "otp"');
        }

        const apiPath = '/account/mfa/authenticators/{type}'.replace('{type}', type);
        const payload: Payload = {};

        if (typeof otp !== 'undefined') {
            payload['otp'] = otp;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('put', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Verify an authenticator app after adding it using the [add authenticator](/docs/references/cloud/client-web/account#createMfaAuthenticator) method.
     *
     * @param {AuthenticatorType} params.type - Type of authenticator.
     * @param {string} params.otp - Valid verification token.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    updateMFAAuthenticator<Preferences extends Models.Preferences = Models.DefaultPreferences>(params: { type: AuthenticatorType, otp: string  }): Promise<Models.User<Preferences>>;
    /**
     * Verify an authenticator app after adding it using the [add authenticator](/docs/references/cloud/client-web/account#createMfaAuthenticator) method.
     *
     * @param {AuthenticatorType} type - Type of authenticator.
     * @param {string} otp - Valid verification token.
     * @throws {AppwriteException}
     * @returns {Promise<Models.User<Preferences>>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    updateMFAAuthenticator<Preferences extends Models.Preferences = Models.DefaultPreferences>(type: AuthenticatorType, otp: string): Promise<Models.User<Preferences>>;
    updateMFAAuthenticator<Preferences extends Models.Preferences = Models.DefaultPreferences>(
        paramsOrFirst: { type: AuthenticatorType, otp: string } | AuthenticatorType,
        ...rest: [(string)?]    
    ): Promise<Models.User<Preferences>> {
        let params: { type: AuthenticatorType, otp: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst) && 'type' in paramsOrFirst)) {
            params = (paramsOrFirst || {}) as { type: AuthenticatorType, otp: string };
        } else {
            params = {
                type: paramsOrFirst as AuthenticatorType,
                otp: rest[0] as string            
            };
        }

        const type = params.type;
        const otp = params.otp;

        if (typeof type === 'undefined') {
            throw new AppwriteException('Missing required parameter: "type"');
        }

        if (typeof otp === 'undefined') {
            throw new AppwriteException('Missing required parameter: "otp"');
        }

        const apiPath = '/account/mfa/authenticators/{type}'.replace('{type}', type);
        const payload: Payload = {};

        if (typeof otp !== 'undefined') {
            payload['otp'] = otp;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('put', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Delete an authenticator for a user by ID.
     *
     * @param {AuthenticatorType} params.type - Type of authenticator.
     * @throws {AppwriteException}
     * @returns {Promise}
     * @deprecated This API has been deprecated since 1.8.0. Please use `Account.deleteMFAAuthenticator` instead.
     */
    deleteMfaAuthenticator(params: { type: AuthenticatorType  }): Promise<{}>;
    /**
     * Delete an authenticator for a user by ID.
     *
     * @param {AuthenticatorType} type - Type of authenticator.
     * @throws {AppwriteException}
     * @returns {Promise<{}>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    deleteMfaAuthenticator(type: AuthenticatorType): Promise<{}>;
    deleteMfaAuthenticator(
        paramsOrFirst: { type: AuthenticatorType } | AuthenticatorType    
    ): Promise<{}> {
        let params: { type: AuthenticatorType };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst) && 'type' in paramsOrFirst)) {
            params = (paramsOrFirst || {}) as { type: AuthenticatorType };
        } else {
            params = {
                type: paramsOrFirst as AuthenticatorType            
            };
        }

        const type = params.type;

        if (typeof type === 'undefined') {
            throw new AppwriteException('Missing required parameter: "type"');
        }

        const apiPath = '/account/mfa/authenticators/{type}'.replace('{type}', type);
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('delete', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Delete an authenticator for a user by ID.
     *
     * @param {AuthenticatorType} params.type - Type of authenticator.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    deleteMFAAuthenticator(params: { type: AuthenticatorType  }): Promise<{}>;
    /**
     * Delete an authenticator for a user by ID.
     *
     * @param {AuthenticatorType} type - Type of authenticator.
     * @throws {AppwriteException}
     * @returns {Promise<{}>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    deleteMFAAuthenticator(type: AuthenticatorType): Promise<{}>;
    deleteMFAAuthenticator(
        paramsOrFirst: { type: AuthenticatorType } | AuthenticatorType    
    ): Promise<{}> {
        let params: { type: AuthenticatorType };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst) && 'type' in paramsOrFirst)) {
            params = (paramsOrFirst || {}) as { type: AuthenticatorType };
        } else {
            params = {
                type: paramsOrFirst as AuthenticatorType            
            };
        }

        const type = params.type;

        if (typeof type === 'undefined') {
            throw new AppwriteException('Missing required parameter: "type"');
        }

        const apiPath = '/account/mfa/authenticators/{type}'.replace('{type}', type);
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('delete', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Begin the process of MFA verification after sign-in. Finish the flow with [updateMfaChallenge](/docs/references/cloud/client-web/account#updateMfaChallenge) method.
     *
     * @param {AuthenticationFactor} params.factor - Factor used for verification. Must be one of following: `email`, `phone`, `totp`, `recoveryCode`.
     * @throws {AppwriteException}
     * @returns {Promise}
     * @deprecated This API has been deprecated since 1.8.0. Please use `Account.createMFAChallenge` instead.
     */
    createMfaChallenge(params: { factor: AuthenticationFactor  }): Promise<Models.MfaChallenge>;
    /**
     * Begin the process of MFA verification after sign-in. Finish the flow with [updateMfaChallenge](/docs/references/cloud/client-web/account#updateMfaChallenge) method.
     *
     * @param {AuthenticationFactor} factor - Factor used for verification. Must be one of following: `email`, `phone`, `totp`, `recoveryCode`.
     * @throws {AppwriteException}
     * @returns {Promise<Models.MfaChallenge>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    createMfaChallenge(factor: AuthenticationFactor): Promise<Models.MfaChallenge>;
    createMfaChallenge(
        paramsOrFirst: { factor: AuthenticationFactor } | AuthenticationFactor    
    ): Promise<Models.MfaChallenge> {
        let params: { factor: AuthenticationFactor };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst) && 'factor' in paramsOrFirst)) {
            params = (paramsOrFirst || {}) as { factor: AuthenticationFactor };
        } else {
            params = {
                factor: paramsOrFirst as AuthenticationFactor            
            };
        }

        const factor = params.factor;

        if (typeof factor === 'undefined') {
            throw new AppwriteException('Missing required parameter: "factor"');
        }

        const apiPath = '/account/mfa/challenge';
        const payload: Payload = {};

        if (typeof factor !== 'undefined') {
            payload['factor'] = factor;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('post', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Begin the process of MFA verification after sign-in. Finish the flow with [updateMfaChallenge](/docs/references/cloud/client-web/account#updateMfaChallenge) method.
     *
     * @param {AuthenticationFactor} params.factor - Factor used for verification. Must be one of following: `email`, `phone`, `totp`, `recoveryCode`.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    createMFAChallenge(params: { factor: AuthenticationFactor  }): Promise<Models.MfaChallenge>;
    /**
     * Begin the process of MFA verification after sign-in. Finish the flow with [updateMfaChallenge](/docs/references/cloud/client-web/account#updateMfaChallenge) method.
     *
     * @param {AuthenticationFactor} factor - Factor used for verification. Must be one of following: `email`, `phone`, `totp`, `recoveryCode`.
     * @throws {AppwriteException}
     * @returns {Promise<Models.MfaChallenge>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    createMFAChallenge(factor: AuthenticationFactor): Promise<Models.MfaChallenge>;
    createMFAChallenge(
        paramsOrFirst: { factor: AuthenticationFactor } | AuthenticationFactor    
    ): Promise<Models.MfaChallenge> {
        let params: { factor: AuthenticationFactor };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst) && 'factor' in paramsOrFirst)) {
            params = (paramsOrFirst || {}) as { factor: AuthenticationFactor };
        } else {
            params = {
                factor: paramsOrFirst as AuthenticationFactor            
            };
        }

        const factor = params.factor;

        if (typeof factor === 'undefined') {
            throw new AppwriteException('Missing required parameter: "factor"');
        }

        const apiPath = '/account/mfa/challenge';
        const payload: Payload = {};

        if (typeof factor !== 'undefined') {
            payload['factor'] = factor;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('post', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Complete the MFA challenge by providing the one-time password. Finish the process of MFA verification by providing the one-time password. To begin the flow, use [createMfaChallenge](/docs/references/cloud/client-web/account#createMfaChallenge) method.
     *
     * @param {string} params.challengeId - ID of the challenge.
     * @param {string} params.otp - Valid verification token.
     * @throws {AppwriteException}
     * @returns {Promise}
     * @deprecated This API has been deprecated since 1.8.0. Please use `Account.updateMFAChallenge` instead.
     */
    updateMfaChallenge(params: { challengeId: string, otp: string  }): Promise<Models.Session>;
    /**
     * Complete the MFA challenge by providing the one-time password. Finish the process of MFA verification by providing the one-time password. To begin the flow, use [createMfaChallenge](/docs/references/cloud/client-web/account#createMfaChallenge) method.
     *
     * @param {string} challengeId - ID of the challenge.
     * @param {string} otp - Valid verification token.
     * @throws {AppwriteException}
     * @returns {Promise<Models.Session>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    updateMfaChallenge(challengeId: string, otp: string): Promise<Models.Session>;
    updateMfaChallenge(
        paramsOrFirst: { challengeId: string, otp: string } | string,
        ...rest: [(string)?]    
    ): Promise<Models.Session> {
        let params: { challengeId: string, otp: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { challengeId: string, otp: string };
        } else {
            params = {
                challengeId: paramsOrFirst as string,
                otp: rest[0] as string            
            };
        }

        const challengeId = params.challengeId;
        const otp = params.otp;

        if (typeof challengeId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "challengeId"');
        }

        if (typeof otp === 'undefined') {
            throw new AppwriteException('Missing required parameter: "otp"');
        }

        const apiPath = '/account/mfa/challenge';
        const payload: Payload = {};

        if (typeof challengeId !== 'undefined') {
            payload['challengeId'] = challengeId;
        }

        if (typeof otp !== 'undefined') {
            payload['otp'] = otp;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('put', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Complete the MFA challenge by providing the one-time password. Finish the process of MFA verification by providing the one-time password. To begin the flow, use [createMfaChallenge](/docs/references/cloud/client-web/account#createMfaChallenge) method.
     *
     * @param {string} params.challengeId - ID of the challenge.
     * @param {string} params.otp - Valid verification token.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    updateMFAChallenge(params: { challengeId: string, otp: string  }): Promise<Models.Session>;
    /**
     * Complete the MFA challenge by providing the one-time password. Finish the process of MFA verification by providing the one-time password. To begin the flow, use [createMfaChallenge](/docs/references/cloud/client-web/account#createMfaChallenge) method.
     *
     * @param {string} challengeId - ID of the challenge.
     * @param {string} otp - Valid verification token.
     * @throws {AppwriteException}
     * @returns {Promise<Models.Session>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    updateMFAChallenge(challengeId: string, otp: string): Promise<Models.Session>;
    updateMFAChallenge(
        paramsOrFirst: { challengeId: string, otp: string } | string,
        ...rest: [(string)?]    
    ): Promise<Models.Session> {
        let params: { challengeId: string, otp: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { challengeId: string, otp: string };
        } else {
            params = {
                challengeId: paramsOrFirst as string,
                otp: rest[0] as string            
            };
        }

        const challengeId = params.challengeId;
        const otp = params.otp;

        if (typeof challengeId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "challengeId"');
        }

        if (typeof otp === 'undefined') {
            throw new AppwriteException('Missing required parameter: "otp"');
        }

        const apiPath = '/account/mfa/challenge';
        const payload: Payload = {};

        if (typeof challengeId !== 'undefined') {
            payload['challengeId'] = challengeId;
        }

        if (typeof otp !== 'undefined') {
            payload['otp'] = otp;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('put', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * List the factors available on the account to be used as a MFA challange.
     *
     * @throws {AppwriteException}
     * @returns {Promise}
     * @deprecated This API has been deprecated since 1.8.0. Please use `Account.listMFAFactors` instead.
     */
    listMfaFactors(): Promise<Models.MfaFactors> {
        const apiPath = '/account/mfa/factors';
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('get', uri, {
        }, payload);
    }

    /**
     * List the factors available on the account to be used as a MFA challange.
     *
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    listMFAFactors(): Promise<Models.MfaFactors> {
        const apiPath = '/account/mfa/factors';
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('get', uri, {
        }, payload);
    }

    /**
     * Get recovery codes that can be used as backup for MFA flow. Before getting codes, they must be generated using [createMfaRecoveryCodes](/docs/references/cloud/client-web/account#createMfaRecoveryCodes) method. An OTP challenge is required to read recovery codes.
     *
     * @throws {AppwriteException}
     * @returns {Promise}
     * @deprecated This API has been deprecated since 1.8.0. Please use `Account.getMFARecoveryCodes` instead.
     */
    getMfaRecoveryCodes(): Promise<Models.MfaRecoveryCodes> {
        const apiPath = '/account/mfa/recovery-codes';
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('get', uri, {
        }, payload);
    }

    /**
     * Get recovery codes that can be used as backup for MFA flow. Before getting codes, they must be generated using [createMfaRecoveryCodes](/docs/references/cloud/client-web/account#createMfaRecoveryCodes) method. An OTP challenge is required to read recovery codes.
     *
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    getMFARecoveryCodes(): Promise<Models.MfaRecoveryCodes> {
        const apiPath = '/account/mfa/recovery-codes';
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('get', uri, {
        }, payload);
    }

    /**
     * Generate recovery codes as backup for MFA flow. It's recommended to generate and show then immediately after user successfully adds their authehticator. Recovery codes can be used as a MFA verification type in [createMfaChallenge](/docs/references/cloud/client-web/account#createMfaChallenge) method.
     *
     * @throws {AppwriteException}
     * @returns {Promise}
     * @deprecated This API has been deprecated since 1.8.0. Please use `Account.createMFARecoveryCodes` instead.
     */
    createMfaRecoveryCodes(): Promise<Models.MfaRecoveryCodes> {
        const apiPath = '/account/mfa/recovery-codes';
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('post', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Generate recovery codes as backup for MFA flow. It's recommended to generate and show then immediately after user successfully adds their authehticator. Recovery codes can be used as a MFA verification type in [createMfaChallenge](/docs/references/cloud/client-web/account#createMfaChallenge) method.
     *
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    createMFARecoveryCodes(): Promise<Models.MfaRecoveryCodes> {
        const apiPath = '/account/mfa/recovery-codes';
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('post', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Regenerate recovery codes that can be used as backup for MFA flow. Before regenerating codes, they must be first generated using [createMfaRecoveryCodes](/docs/references/cloud/client-web/account#createMfaRecoveryCodes) method. An OTP challenge is required to regenreate recovery codes.
     *
     * @throws {AppwriteException}
     * @returns {Promise}
     * @deprecated This API has been deprecated since 1.8.0. Please use `Account.updateMFARecoveryCodes` instead.
     */
    updateMfaRecoveryCodes(): Promise<Models.MfaRecoveryCodes> {
        const apiPath = '/account/mfa/recovery-codes';
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('patch', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Regenerate recovery codes that can be used as backup for MFA flow. Before regenerating codes, they must be first generated using [createMfaRecoveryCodes](/docs/references/cloud/client-web/account#createMfaRecoveryCodes) method. An OTP challenge is required to regenreate recovery codes.
     *
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    updateMFARecoveryCodes(): Promise<Models.MfaRecoveryCodes> {
        const apiPath = '/account/mfa/recovery-codes';
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('patch', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Update currently logged in user account name.
     *
     * @param {string} params.name - User name. Max length: 128 chars.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    updateName<Preferences extends Models.Preferences = Models.DefaultPreferences>(params: { name: string  }): Promise<Models.User<Preferences>>;
    /**
     * Update currently logged in user account name.
     *
     * @param {string} name - User name. Max length: 128 chars.
     * @throws {AppwriteException}
     * @returns {Promise<Models.User<Preferences>>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    updateName<Preferences extends Models.Preferences = Models.DefaultPreferences>(name: string): Promise<Models.User<Preferences>>;
    updateName<Preferences extends Models.Preferences = Models.DefaultPreferences>(
        paramsOrFirst: { name: string } | string    
    ): Promise<Models.User<Preferences>> {
        let params: { name: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { name: string };
        } else {
            params = {
                name: paramsOrFirst as string            
            };
        }

        const name = params.name;

        if (typeof name === 'undefined') {
            throw new AppwriteException('Missing required parameter: "name"');
        }

        const apiPath = '/account/name';
        const payload: Payload = {};

        if (typeof name !== 'undefined') {
            payload['name'] = name;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('patch', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Update currently logged in user password. For validation, user is required to pass in the new password, and the old password. For users created with OAuth, Team Invites and Magic URL, oldPassword is optional.
     *
     * @param {string} params.password - New user password. Must be at least 8 chars.
     * @param {string} params.oldPassword - Current user password. Must be at least 8 chars.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    updatePassword<Preferences extends Models.Preferences = Models.DefaultPreferences>(params: { password: string, oldPassword?: string  }): Promise<Models.User<Preferences>>;
    /**
     * Update currently logged in user password. For validation, user is required to pass in the new password, and the old password. For users created with OAuth, Team Invites and Magic URL, oldPassword is optional.
     *
     * @param {string} password - New user password. Must be at least 8 chars.
     * @param {string} oldPassword - Current user password. Must be at least 8 chars.
     * @throws {AppwriteException}
     * @returns {Promise<Models.User<Preferences>>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    updatePassword<Preferences extends Models.Preferences = Models.DefaultPreferences>(password: string, oldPassword?: string): Promise<Models.User<Preferences>>;
    updatePassword<Preferences extends Models.Preferences = Models.DefaultPreferences>(
        paramsOrFirst: { password: string, oldPassword?: string } | string,
        ...rest: [(string)?]    
    ): Promise<Models.User<Preferences>> {
        let params: { password: string, oldPassword?: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { password: string, oldPassword?: string };
        } else {
            params = {
                password: paramsOrFirst as string,
                oldPassword: rest[0] as string            
            };
        }

        const password = params.password;
        const oldPassword = params.oldPassword;

        if (typeof password === 'undefined') {
            throw new AppwriteException('Missing required parameter: "password"');
        }

        const apiPath = '/account/password';
        const payload: Payload = {};

        if (typeof password !== 'undefined') {
            payload['password'] = password;
        }

        if (typeof oldPassword !== 'undefined') {
            payload['oldPassword'] = oldPassword;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('patch', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Update the currently logged in user's phone number. After updating the phone number, the phone verification status will be reset. A confirmation SMS is not sent automatically, however you can use the [POST /account/verification/phone](https://appwrite.io/docs/references/cloud/client-web/account#createPhoneVerification) endpoint to send a confirmation SMS.
     *
     * @param {string} params.phone - Phone number. Format this number with a leading '+' and a country code, e.g., +16175551212.
     * @param {string} params.password - User password. Must be at least 8 chars.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    updatePhone<Preferences extends Models.Preferences = Models.DefaultPreferences>(params: { phone: string, password: string  }): Promise<Models.User<Preferences>>;
    /**
     * Update the currently logged in user's phone number. After updating the phone number, the phone verification status will be reset. A confirmation SMS is not sent automatically, however you can use the [POST /account/verification/phone](https://appwrite.io/docs/references/cloud/client-web/account#createPhoneVerification) endpoint to send a confirmation SMS.
     *
     * @param {string} phone - Phone number. Format this number with a leading '+' and a country code, e.g., +16175551212.
     * @param {string} password - User password. Must be at least 8 chars.
     * @throws {AppwriteException}
     * @returns {Promise<Models.User<Preferences>>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    updatePhone<Preferences extends Models.Preferences = Models.DefaultPreferences>(phone: string, password: string): Promise<Models.User<Preferences>>;
    updatePhone<Preferences extends Models.Preferences = Models.DefaultPreferences>(
        paramsOrFirst: { phone: string, password: string } | string,
        ...rest: [(string)?]    
    ): Promise<Models.User<Preferences>> {
        let params: { phone: string, password: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { phone: string, password: string };
        } else {
            params = {
                phone: paramsOrFirst as string,
                password: rest[0] as string            
            };
        }

        const phone = params.phone;
        const password = params.password;

        if (typeof phone === 'undefined') {
            throw new AppwriteException('Missing required parameter: "phone"');
        }

        if (typeof password === 'undefined') {
            throw new AppwriteException('Missing required parameter: "password"');
        }

        const apiPath = '/account/phone';
        const payload: Payload = {};

        if (typeof phone !== 'undefined') {
            payload['phone'] = phone;
        }

        if (typeof password !== 'undefined') {
            payload['password'] = password;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('patch', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Get the preferences as a key-value object for the currently logged in user.
     *
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    getPrefs<Preferences extends Models.Preferences = Models.DefaultPreferences>(): Promise<Preferences> {
        const apiPath = '/account/prefs';
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('get', uri, {
        }, payload);
    }

    /**
     * Update currently logged in user account preferences. The object you pass is stored as is, and replaces any previous value. The maximum allowed prefs size is 64kB and throws error if exceeded.
     *
     * @param {Partial<Preferences>} params.prefs - Prefs key-value JSON object.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    updatePrefs<Preferences extends Models.Preferences = Models.DefaultPreferences>(params: { prefs: Partial<Preferences>  }): Promise<Models.User<Preferences>>;
    /**
     * Update currently logged in user account preferences. The object you pass is stored as is, and replaces any previous value. The maximum allowed prefs size is 64kB and throws error if exceeded.
     *
     * @param {Partial<Preferences>} prefs - Prefs key-value JSON object.
     * @throws {AppwriteException}
     * @returns {Promise<Models.User<Preferences>>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    updatePrefs<Preferences extends Models.Preferences = Models.DefaultPreferences>(prefs: Partial<Preferences>): Promise<Models.User<Preferences>>;
    updatePrefs<Preferences extends Models.Preferences = Models.DefaultPreferences>(
        paramsOrFirst: { prefs: Partial<Preferences> } | Partial<Preferences>    
    ): Promise<Models.User<Preferences>> {
        let params: { prefs: Partial<Preferences> };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst) && 'prefs' in paramsOrFirst)) {
            params = (paramsOrFirst || {}) as { prefs: Partial<Preferences> };
        } else {
            params = {
                prefs: paramsOrFirst as Partial<Preferences>            
            };
        }

        const prefs = params.prefs;

        if (typeof prefs === 'undefined') {
            throw new AppwriteException('Missing required parameter: "prefs"');
        }

        const apiPath = '/account/prefs';
        const payload: Payload = {};

        if (typeof prefs !== 'undefined') {
            payload['prefs'] = prefs;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('patch', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Sends the user an email with a temporary secret key for password reset. When the user clicks the confirmation link he is redirected back to your app password reset URL with the secret key and email address values attached to the URL query string. Use the query string params to submit a request to the [PUT /account/recovery](https://appwrite.io/docs/references/cloud/client-web/account#updateRecovery) endpoint to complete the process. The verification link sent to the user's email address is valid for 1 hour.
     *
     * @param {string} params.email - User email.
     * @param {string} params.url - URL to redirect the user back to your app from the recovery email. Only URLs from hostnames in your project platform list are allowed. This requirement helps to prevent an [open redirect](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) attack against your project API.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    createRecovery(params: { email: string, url: string  }): Promise<Models.Token>;
    /**
     * Sends the user an email with a temporary secret key for password reset. When the user clicks the confirmation link he is redirected back to your app password reset URL with the secret key and email address values attached to the URL query string. Use the query string params to submit a request to the [PUT /account/recovery](https://appwrite.io/docs/references/cloud/client-web/account#updateRecovery) endpoint to complete the process. The verification link sent to the user's email address is valid for 1 hour.
     *
     * @param {string} email - User email.
     * @param {string} url - URL to redirect the user back to your app from the recovery email. Only URLs from hostnames in your project platform list are allowed. This requirement helps to prevent an [open redirect](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) attack against your project API.
     * @throws {AppwriteException}
     * @returns {Promise<Models.Token>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    createRecovery(email: string, url: string): Promise<Models.Token>;
    createRecovery(
        paramsOrFirst: { email: string, url: string } | string,
        ...rest: [(string)?]    
    ): Promise<Models.Token> {
        let params: { email: string, url: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { email: string, url: string };
        } else {
            params = {
                email: paramsOrFirst as string,
                url: rest[0] as string            
            };
        }

        const email = params.email;
        const url = params.url;

        if (typeof email === 'undefined') {
            throw new AppwriteException('Missing required parameter: "email"');
        }

        if (typeof url === 'undefined') {
            throw new AppwriteException('Missing required parameter: "url"');
        }

        const apiPath = '/account/recovery';
        const payload: Payload = {};

        if (typeof email !== 'undefined') {
            payload['email'] = email;
        }

        if (typeof url !== 'undefined') {
            payload['url'] = url;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('post', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Use this endpoint to complete the user account password reset. Both the **userId** and **secret** arguments will be passed as query parameters to the redirect URL you have provided when sending your request to the [POST /account/recovery](https://appwrite.io/docs/references/cloud/client-web/account#createRecovery) endpoint.
     * 
     * Please note that in order to avoid a [Redirect Attack](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.md) the only valid redirect URLs are the ones from domains you have set when adding your platforms in the console interface.
     *
     * @param {string} params.userId - User ID.
     * @param {string} params.secret - Valid reset token.
     * @param {string} params.password - New user password. Must be between 8 and 256 chars.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    updateRecovery(params: { userId: string, secret: string, password: string  }): Promise<Models.Token>;
    /**
     * Use this endpoint to complete the user account password reset. Both the **userId** and **secret** arguments will be passed as query parameters to the redirect URL you have provided when sending your request to the [POST /account/recovery](https://appwrite.io/docs/references/cloud/client-web/account#createRecovery) endpoint.
     * 
     * Please note that in order to avoid a [Redirect Attack](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.md) the only valid redirect URLs are the ones from domains you have set when adding your platforms in the console interface.
     *
     * @param {string} userId - User ID.
     * @param {string} secret - Valid reset token.
     * @param {string} password - New user password. Must be between 8 and 256 chars.
     * @throws {AppwriteException}
     * @returns {Promise<Models.Token>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    updateRecovery(userId: string, secret: string, password: string): Promise<Models.Token>;
    updateRecovery(
        paramsOrFirst: { userId: string, secret: string, password: string } | string,
        ...rest: [(string)?, (string)?]    
    ): Promise<Models.Token> {
        let params: { userId: string, secret: string, password: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { userId: string, secret: string, password: string };
        } else {
            params = {
                userId: paramsOrFirst as string,
                secret: rest[0] as string,
                password: rest[1] as string            
            };
        }

        const userId = params.userId;
        const secret = params.secret;
        const password = params.password;

        if (typeof userId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "userId"');
        }

        if (typeof secret === 'undefined') {
            throw new AppwriteException('Missing required parameter: "secret"');
        }

        if (typeof password === 'undefined') {
            throw new AppwriteException('Missing required parameter: "password"');
        }

        const apiPath = '/account/recovery';
        const payload: Payload = {};

        if (typeof userId !== 'undefined') {
            payload['userId'] = userId;
        }

        if (typeof secret !== 'undefined') {
            payload['secret'] = secret;
        }

        if (typeof password !== 'undefined') {
            payload['password'] = password;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('put', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Get the list of active sessions across different devices for the currently logged in user.
     *
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    listSessions(): Promise<Models.SessionList> {
        const apiPath = '/account/sessions';
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('get', uri, {
        }, payload);
    }

    /**
     * Delete all sessions from the user account and remove any sessions cookies from the end client.
     *
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    deleteSessions(): Promise<{}> {
        const apiPath = '/account/sessions';
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('delete', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Use this endpoint to allow a new user to register an anonymous account in your project. This route will also create a new session for the user. To allow the new user to convert an anonymous account to a normal account, you need to update its [email and password](https://appwrite.io/docs/references/cloud/client-web/account#updateEmail) or create an [OAuth2 session](https://appwrite.io/docs/references/cloud/client-web/account#CreateOAuth2Session).
     *
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    createAnonymousSession(): Promise<Models.Session> {
        const apiPath = '/account/sessions/anonymous';
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('post', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Allow the user to login into their account by providing a valid email and password combination. This route will create a new session for the user.
     * 
     * A user is limited to 10 active sessions at a time by default. [Learn more about session limits](https://appwrite.io/docs/authentication-security#limits).
     *
     * @param {string} params.email - User email.
     * @param {string} params.password - User password. Must be at least 8 chars.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    createEmailPasswordSession(params: { email: string, password: string  }): Promise<Models.Session>;
    /**
     * Allow the user to login into their account by providing a valid email and password combination. This route will create a new session for the user.
     * 
     * A user is limited to 10 active sessions at a time by default. [Learn more about session limits](https://appwrite.io/docs/authentication-security#limits).
     *
     * @param {string} email - User email.
     * @param {string} password - User password. Must be at least 8 chars.
     * @throws {AppwriteException}
     * @returns {Promise<Models.Session>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    createEmailPasswordSession(email: string, password: string): Promise<Models.Session>;
    createEmailPasswordSession(
        paramsOrFirst: { email: string, password: string } | string,
        ...rest: [(string)?]    
    ): Promise<Models.Session> {
        let params: { email: string, password: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { email: string, password: string };
        } else {
            params = {
                email: paramsOrFirst as string,
                password: rest[0] as string            
            };
        }

        const email = params.email;
        const password = params.password;

        if (typeof email === 'undefined') {
            throw new AppwriteException('Missing required parameter: "email"');
        }

        if (typeof password === 'undefined') {
            throw new AppwriteException('Missing required parameter: "password"');
        }

        const apiPath = '/account/sessions/email';
        const payload: Payload = {};

        if (typeof email !== 'undefined') {
            payload['email'] = email;
        }

        if (typeof password !== 'undefined') {
            payload['password'] = password;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('post', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Use this endpoint to create a session from token. Provide the **userId** and **secret** parameters from the successful response of authentication flows initiated by token creation. For example, magic URL and phone login.
     *
     * @param {string} params.userId - User ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.
     * @param {string} params.secret - Valid verification token.
     * @throws {AppwriteException}
     * @returns {Promise}
     * @deprecated This API has been deprecated.
     */
    updateMagicURLSession(params: { userId: string, secret: string  }): Promise<Models.Session>;
    /**
     * Use this endpoint to create a session from token. Provide the **userId** and **secret** parameters from the successful response of authentication flows initiated by token creation. For example, magic URL and phone login.
     *
     * @param {string} userId - User ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.
     * @param {string} secret - Valid verification token.
     * @throws {AppwriteException}
     * @returns {Promise<Models.Session>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    updateMagicURLSession(userId: string, secret: string): Promise<Models.Session>;
    updateMagicURLSession(
        paramsOrFirst: { userId: string, secret: string } | string,
        ...rest: [(string)?]    
    ): Promise<Models.Session> {
        let params: { userId: string, secret: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { userId: string, secret: string };
        } else {
            params = {
                userId: paramsOrFirst as string,
                secret: rest[0] as string            
            };
        }

        const userId = params.userId;
        const secret = params.secret;

        if (typeof userId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "userId"');
        }

        if (typeof secret === 'undefined') {
            throw new AppwriteException('Missing required parameter: "secret"');
        }

        const apiPath = '/account/sessions/magic-url';
        const payload: Payload = {};

        if (typeof userId !== 'undefined') {
            payload['userId'] = userId;
        }

        if (typeof secret !== 'undefined') {
            payload['secret'] = secret;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('put', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Allow the user to login to their account using the OAuth2 provider of their choice. Each OAuth2 provider should be enabled from the Appwrite console first. Use the success and failure arguments to provide a redirect URL's back to your app when login is completed.
     * 
     * If there is already an active session, the new session will be attached to the logged-in account. If there are no active sessions, the server will attempt to look for a user with the same email address as the email received from the OAuth2 provider and attach the new session to the existing user. If no matching user is found - the server will create a new user.
     * 
     * A user is limited to 10 active sessions at a time by default. [Learn more about session limits](https://appwrite.io/docs/authentication-security#limits).
     * 
     *
     * @param {OAuthProvider} params.provider - OAuth2 Provider. Currently, supported providers are: amazon, apple, auth0, authentik, autodesk, bitbucket, bitly, box, dailymotion, discord, disqus, dropbox, etsy, facebook, figma, github, gitlab, google, linkedin, microsoft, notion, oidc, okta, paypal, paypalSandbox, podio, salesforce, slack, spotify, stripe, tradeshift, tradeshiftBox, twitch, wordpress, yahoo, yammer, yandex, zoho, zoom.
     * @param {string} params.success - URL to redirect back to your app after a successful login attempt.  Only URLs from hostnames in your project's platform list are allowed. This requirement helps to prevent an [open redirect](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) attack against your project API.
     * @param {string} params.failure - URL to redirect back to your app after a failed login attempt.  Only URLs from hostnames in your project's platform list are allowed. This requirement helps to prevent an [open redirect](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) attack against your project API.
     * @param {string[]} params.scopes - A list of custom OAuth2 scopes. Check each provider internal docs for a list of supported scopes. Maximum of 100 scopes are allowed, each 4096 characters long.
     * @throws {AppwriteException}
     * @returns {void|string}
     */
    createOAuth2Session(params: { provider: OAuthProvider, success?: string, failure?: string, scopes?: string[]  }): void | URL;
    /**
     * Allow the user to login to their account using the OAuth2 provider of their choice. Each OAuth2 provider should be enabled from the Appwrite console first. Use the success and failure arguments to provide a redirect URL's back to your app when login is completed.
     * 
     * If there is already an active session, the new session will be attached to the logged-in account. If there are no active sessions, the server will attempt to look for a user with the same email address as the email received from the OAuth2 provider and attach the new session to the existing user. If no matching user is found - the server will create a new user.
     * 
     * A user is limited to 10 active sessions at a time by default. [Learn more about session limits](https://appwrite.io/docs/authentication-security#limits).
     * 
     *
     * @param {OAuthProvider} provider - OAuth2 Provider. Currently, supported providers are: amazon, apple, auth0, authentik, autodesk, bitbucket, bitly, box, dailymotion, discord, disqus, dropbox, etsy, facebook, figma, github, gitlab, google, linkedin, microsoft, notion, oidc, okta, paypal, paypalSandbox, podio, salesforce, slack, spotify, stripe, tradeshift, tradeshiftBox, twitch, wordpress, yahoo, yammer, yandex, zoho, zoom.
     * @param {string} success - URL to redirect back to your app after a successful login attempt.  Only URLs from hostnames in your project's platform list are allowed. This requirement helps to prevent an [open redirect](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) attack against your project API.
     * @param {string} failure - URL to redirect back to your app after a failed login attempt.  Only URLs from hostnames in your project's platform list are allowed. This requirement helps to prevent an [open redirect](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) attack against your project API.
     * @param {string[]} scopes - A list of custom OAuth2 scopes. Check each provider internal docs for a list of supported scopes. Maximum of 100 scopes are allowed, each 4096 characters long.
     * @throws {AppwriteException}
     * @returns {void | URL}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    createOAuth2Session(provider: OAuthProvider, success?: string, failure?: string, scopes?: string[]): void | URL;
    createOAuth2Session(
        paramsOrFirst: { provider: OAuthProvider, success?: string, failure?: string, scopes?: string[] } | OAuthProvider,
        ...rest: [(string)?, (string)?, (string[])?]    
    ): void | URL {
        let params: { provider: OAuthProvider, success?: string, failure?: string, scopes?: string[] };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst) && 'provider' in paramsOrFirst)) {
            params = (paramsOrFirst || {}) as { provider: OAuthProvider, success?: string, failure?: string, scopes?: string[] };
        } else {
            params = {
                provider: paramsOrFirst as OAuthProvider,
                success: rest[0] as string,
                failure: rest[1] as string,
                scopes: rest[2] as string[]            
            };
        }

        const provider = params.provider;
        const success = params.success;
        const failure = params.failure;
        const scopes = params.scopes;

        if (typeof provider === 'undefined') {
            throw new AppwriteException('Missing required parameter: "provider"');
        }

        const apiPath = '/account/sessions/oauth2/{provider}'.replace('{provider}', provider);
        const payload: Payload = {};

        if (typeof success !== 'undefined') {
            payload['success'] = success;
        }

        if (typeof failure !== 'undefined') {
            payload['failure'] = failure;
        }

        if (typeof scopes !== 'undefined') {
            payload['scopes'] = scopes;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        payload['project'] = this.client.config.project;


        for (const [key, value] of Object.entries(Service.flatten(payload))) {
            uri.searchParams.append(key, value);
        }
        return uri;
    }

    /**
     * Use this endpoint to create a session from token. Provide the **userId** and **secret** parameters from the successful response of authentication flows initiated by token creation. For example, magic URL and phone login.
     *
     * @param {string} params.userId - User ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.
     * @param {string} params.secret - Valid verification token.
     * @throws {AppwriteException}
     * @returns {Promise}
     * @deprecated This API has been deprecated.
     */
    updatePhoneSession(params: { userId: string, secret: string  }): Promise<Models.Session>;
    /**
     * Use this endpoint to create a session from token. Provide the **userId** and **secret** parameters from the successful response of authentication flows initiated by token creation. For example, magic URL and phone login.
     *
     * @param {string} userId - User ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.
     * @param {string} secret - Valid verification token.
     * @throws {AppwriteException}
     * @returns {Promise<Models.Session>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    updatePhoneSession(userId: string, secret: string): Promise<Models.Session>;
    updatePhoneSession(
        paramsOrFirst: { userId: string, secret: string } | string,
        ...rest: [(string)?]    
    ): Promise<Models.Session> {
        let params: { userId: string, secret: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { userId: string, secret: string };
        } else {
            params = {
                userId: paramsOrFirst as string,
                secret: rest[0] as string            
            };
        }

        const userId = params.userId;
        const secret = params.secret;

        if (typeof userId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "userId"');
        }

        if (typeof secret === 'undefined') {
            throw new AppwriteException('Missing required parameter: "secret"');
        }

        const apiPath = '/account/sessions/phone';
        const payload: Payload = {};

        if (typeof userId !== 'undefined') {
            payload['userId'] = userId;
        }

        if (typeof secret !== 'undefined') {
            payload['secret'] = secret;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('put', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Use this endpoint to create a session from token. Provide the **userId** and **secret** parameters from the successful response of authentication flows initiated by token creation. For example, magic URL and phone login.
     *
     * @param {string} params.userId - User ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.
     * @param {string} params.secret - Secret of a token generated by login methods. For example, the `createMagicURLToken` or `createPhoneToken` methods.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    createSession(params: { userId: string, secret: string  }): Promise<Models.Session>;
    /**
     * Use this endpoint to create a session from token. Provide the **userId** and **secret** parameters from the successful response of authentication flows initiated by token creation. For example, magic URL and phone login.
     *
     * @param {string} userId - User ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.
     * @param {string} secret - Secret of a token generated by login methods. For example, the `createMagicURLToken` or `createPhoneToken` methods.
     * @throws {AppwriteException}
     * @returns {Promise<Models.Session>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    createSession(userId: string, secret: string): Promise<Models.Session>;
    createSession(
        paramsOrFirst: { userId: string, secret: string } | string,
        ...rest: [(string)?]    
    ): Promise<Models.Session> {
        let params: { userId: string, secret: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { userId: string, secret: string };
        } else {
            params = {
                userId: paramsOrFirst as string,
                secret: rest[0] as string            
            };
        }

        const userId = params.userId;
        const secret = params.secret;

        if (typeof userId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "userId"');
        }

        if (typeof secret === 'undefined') {
            throw new AppwriteException('Missing required parameter: "secret"');
        }

        const apiPath = '/account/sessions/token';
        const payload: Payload = {};

        if (typeof userId !== 'undefined') {
            payload['userId'] = userId;
        }

        if (typeof secret !== 'undefined') {
            payload['secret'] = secret;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('post', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Use this endpoint to get a logged in user's session using a Session ID. Inputting 'current' will return the current session being used.
     *
     * @param {string} params.sessionId - Session ID. Use the string 'current' to get the current device session.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    getSession(params: { sessionId: string  }): Promise<Models.Session>;
    /**
     * Use this endpoint to get a logged in user's session using a Session ID. Inputting 'current' will return the current session being used.
     *
     * @param {string} sessionId - Session ID. Use the string 'current' to get the current device session.
     * @throws {AppwriteException}
     * @returns {Promise<Models.Session>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    getSession(sessionId: string): Promise<Models.Session>;
    getSession(
        paramsOrFirst: { sessionId: string } | string    
    ): Promise<Models.Session> {
        let params: { sessionId: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { sessionId: string };
        } else {
            params = {
                sessionId: paramsOrFirst as string            
            };
        }

        const sessionId = params.sessionId;

        if (typeof sessionId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "sessionId"');
        }

        const apiPath = '/account/sessions/{sessionId}'.replace('{sessionId}', sessionId);
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('get', uri, {
        }, payload);
    }

    /**
     * Use this endpoint to extend a session's length. Extending a session is useful when session expiry is short. If the session was created using an OAuth provider, this endpoint refreshes the access token from the provider.
     *
     * @param {string} params.sessionId - Session ID. Use the string 'current' to update the current device session.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    updateSession(params: { sessionId: string  }): Promise<Models.Session>;
    /**
     * Use this endpoint to extend a session's length. Extending a session is useful when session expiry is short. If the session was created using an OAuth provider, this endpoint refreshes the access token from the provider.
     *
     * @param {string} sessionId - Session ID. Use the string 'current' to update the current device session.
     * @throws {AppwriteException}
     * @returns {Promise<Models.Session>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    updateSession(sessionId: string): Promise<Models.Session>;
    updateSession(
        paramsOrFirst: { sessionId: string } | string    
    ): Promise<Models.Session> {
        let params: { sessionId: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { sessionId: string };
        } else {
            params = {
                sessionId: paramsOrFirst as string            
            };
        }

        const sessionId = params.sessionId;

        if (typeof sessionId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "sessionId"');
        }

        const apiPath = '/account/sessions/{sessionId}'.replace('{sessionId}', sessionId);
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('patch', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Logout the user. Use 'current' as the session ID to logout on this device, use a session ID to logout on another device. If you're looking to logout the user on all devices, use [Delete Sessions](https://appwrite.io/docs/references/cloud/client-web/account#deleteSessions) instead.
     *
     * @param {string} params.sessionId - Session ID. Use the string 'current' to delete the current device session.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    deleteSession(params: { sessionId: string  }): Promise<{}>;
    /**
     * Logout the user. Use 'current' as the session ID to logout on this device, use a session ID to logout on another device. If you're looking to logout the user on all devices, use [Delete Sessions](https://appwrite.io/docs/references/cloud/client-web/account#deleteSessions) instead.
     *
     * @param {string} sessionId - Session ID. Use the string 'current' to delete the current device session.
     * @throws {AppwriteException}
     * @returns {Promise<{}>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    deleteSession(sessionId: string): Promise<{}>;
    deleteSession(
        paramsOrFirst: { sessionId: string } | string    
    ): Promise<{}> {
        let params: { sessionId: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { sessionId: string };
        } else {
            params = {
                sessionId: paramsOrFirst as string            
            };
        }

        const sessionId = params.sessionId;

        if (typeof sessionId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "sessionId"');
        }

        const apiPath = '/account/sessions/{sessionId}'.replace('{sessionId}', sessionId);
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('delete', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Block the currently logged in user account. Behind the scene, the user record is not deleted but permanently blocked from any access. To completely delete a user, use the Users API instead.
     *
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    updateStatus<Preferences extends Models.Preferences = Models.DefaultPreferences>(): Promise<Models.User<Preferences>> {
        const apiPath = '/account/status';
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('patch', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Use this endpoint to register a device for push notifications. Provide a target ID (custom or generated using ID.unique()), a device identifier (usually a device token), and optionally specify which provider should send notifications to this target. The target is automatically linked to the current session and includes device information like brand and model.
     *
     * @param {string} params.targetId - Target ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.
     * @param {string} params.identifier - The target identifier (token, email, phone etc.)
     * @param {string} params.providerId - Provider ID. Message will be sent to this target from the specified provider ID. If no provider ID is set the first setup provider will be used.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    createPushTarget(params: { targetId: string, identifier: string, providerId?: string  }): Promise<Models.Target>;
    /**
     * Use this endpoint to register a device for push notifications. Provide a target ID (custom or generated using ID.unique()), a device identifier (usually a device token), and optionally specify which provider should send notifications to this target. The target is automatically linked to the current session and includes device information like brand and model.
     *
     * @param {string} targetId - Target ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.
     * @param {string} identifier - The target identifier (token, email, phone etc.)
     * @param {string} providerId - Provider ID. Message will be sent to this target from the specified provider ID. If no provider ID is set the first setup provider will be used.
     * @throws {AppwriteException}
     * @returns {Promise<Models.Target>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    createPushTarget(targetId: string, identifier: string, providerId?: string): Promise<Models.Target>;
    createPushTarget(
        paramsOrFirst: { targetId: string, identifier: string, providerId?: string } | string,
        ...rest: [(string)?, (string)?]    
    ): Promise<Models.Target> {
        let params: { targetId: string, identifier: string, providerId?: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { targetId: string, identifier: string, providerId?: string };
        } else {
            params = {
                targetId: paramsOrFirst as string,
                identifier: rest[0] as string,
                providerId: rest[1] as string            
            };
        }

        const targetId = params.targetId;
        const identifier = params.identifier;
        const providerId = params.providerId;

        if (typeof targetId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "targetId"');
        }

        if (typeof identifier === 'undefined') {
            throw new AppwriteException('Missing required parameter: "identifier"');
        }

        const apiPath = '/account/targets/push';
        const payload: Payload = {};

        if (typeof targetId !== 'undefined') {
            payload['targetId'] = targetId;
        }

        if (typeof identifier !== 'undefined') {
            payload['identifier'] = identifier;
        }

        if (typeof providerId !== 'undefined') {
            payload['providerId'] = providerId;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('post', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Update the currently logged in user's push notification target. You can modify the target's identifier (device token) and provider ID (token, email, phone etc.). The target must exist and belong to the current user. If you change the provider ID, notifications will be sent through the new messaging provider instead.
     *
     * @param {string} params.targetId - Target ID.
     * @param {string} params.identifier - The target identifier (token, email, phone etc.)
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    updatePushTarget(params: { targetId: string, identifier: string  }): Promise<Models.Target>;
    /**
     * Update the currently logged in user's push notification target. You can modify the target's identifier (device token) and provider ID (token, email, phone etc.). The target must exist and belong to the current user. If you change the provider ID, notifications will be sent through the new messaging provider instead.
     *
     * @param {string} targetId - Target ID.
     * @param {string} identifier - The target identifier (token, email, phone etc.)
     * @throws {AppwriteException}
     * @returns {Promise<Models.Target>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    updatePushTarget(targetId: string, identifier: string): Promise<Models.Target>;
    updatePushTarget(
        paramsOrFirst: { targetId: string, identifier: string } | string,
        ...rest: [(string)?]    
    ): Promise<Models.Target> {
        let params: { targetId: string, identifier: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { targetId: string, identifier: string };
        } else {
            params = {
                targetId: paramsOrFirst as string,
                identifier: rest[0] as string            
            };
        }

        const targetId = params.targetId;
        const identifier = params.identifier;

        if (typeof targetId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "targetId"');
        }

        if (typeof identifier === 'undefined') {
            throw new AppwriteException('Missing required parameter: "identifier"');
        }

        const apiPath = '/account/targets/{targetId}/push'.replace('{targetId}', targetId);
        const payload: Payload = {};

        if (typeof identifier !== 'undefined') {
            payload['identifier'] = identifier;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('put', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Delete a push notification target for the currently logged in user. After deletion, the device will no longer receive push notifications. The target must exist and belong to the current user.
     *
     * @param {string} params.targetId - Target ID.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    deletePushTarget(params: { targetId: string  }): Promise<{}>;
    /**
     * Delete a push notification target for the currently logged in user. After deletion, the device will no longer receive push notifications. The target must exist and belong to the current user.
     *
     * @param {string} targetId - Target ID.
     * @throws {AppwriteException}
     * @returns {Promise<{}>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    deletePushTarget(targetId: string): Promise<{}>;
    deletePushTarget(
        paramsOrFirst: { targetId: string } | string    
    ): Promise<{}> {
        let params: { targetId: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { targetId: string };
        } else {
            params = {
                targetId: paramsOrFirst as string            
            };
        }

        const targetId = params.targetId;

        if (typeof targetId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "targetId"');
        }

        const apiPath = '/account/targets/{targetId}/push'.replace('{targetId}', targetId);
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('delete', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Sends the user an email with a secret key for creating a session. If the email address has never been used, a **new account is created** using the provided `userId`. Otherwise, if the email address is already attached to an account, the **user ID is ignored**. Then, the user will receive an email with the one-time password. Use the returned user ID and secret and submit a request to the [POST /v1/account/sessions/token](https://appwrite.io/docs/references/cloud/client-web/account#createSession) endpoint to complete the login process. The secret sent to the user's email is valid for 15 minutes.
     * 
     * A user is limited to 10 active sessions at a time by default. [Learn more about session limits](https://appwrite.io/docs/authentication-security#limits).
     * 
     *
     * @param {string} params.userId - User ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars. If the email address has never been used, a new account is created using the provided userId. Otherwise, if the email address is already attached to an account, the user ID is ignored.
     * @param {string} params.email - User email.
     * @param {boolean} params.phrase - Toggle for security phrase. If enabled, email will be send with a randomly generated phrase and the phrase will also be included in the response. Confirming phrases match increases the security of your authentication flow.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    createEmailToken(params: { userId: string, email: string, phrase?: boolean  }): Promise<Models.Token>;
    /**
     * Sends the user an email with a secret key for creating a session. If the email address has never been used, a **new account is created** using the provided `userId`. Otherwise, if the email address is already attached to an account, the **user ID is ignored**. Then, the user will receive an email with the one-time password. Use the returned user ID and secret and submit a request to the [POST /v1/account/sessions/token](https://appwrite.io/docs/references/cloud/client-web/account#createSession) endpoint to complete the login process. The secret sent to the user's email is valid for 15 minutes.
     * 
     * A user is limited to 10 active sessions at a time by default. [Learn more about session limits](https://appwrite.io/docs/authentication-security#limits).
     * 
     *
     * @param {string} userId - User ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars. If the email address has never been used, a new account is created using the provided userId. Otherwise, if the email address is already attached to an account, the user ID is ignored.
     * @param {string} email - User email.
     * @param {boolean} phrase - Toggle for security phrase. If enabled, email will be send with a randomly generated phrase and the phrase will also be included in the response. Confirming phrases match increases the security of your authentication flow.
     * @throws {AppwriteException}
     * @returns {Promise<Models.Token>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    createEmailToken(userId: string, email: string, phrase?: boolean): Promise<Models.Token>;
    createEmailToken(
        paramsOrFirst: { userId: string, email: string, phrase?: boolean } | string,
        ...rest: [(string)?, (boolean)?]    
    ): Promise<Models.Token> {
        let params: { userId: string, email: string, phrase?: boolean };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { userId: string, email: string, phrase?: boolean };
        } else {
            params = {
                userId: paramsOrFirst as string,
                email: rest[0] as string,
                phrase: rest[1] as boolean            
            };
        }

        const userId = params.userId;
        const email = params.email;
        const phrase = params.phrase;

        if (typeof userId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "userId"');
        }

        if (typeof email === 'undefined') {
            throw new AppwriteException('Missing required parameter: "email"');
        }

        const apiPath = '/account/tokens/email';
        const payload: Payload = {};

        if (typeof userId !== 'undefined') {
            payload['userId'] = userId;
        }

        if (typeof email !== 'undefined') {
            payload['email'] = email;
        }

        if (typeof phrase !== 'undefined') {
            payload['phrase'] = phrase;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('post', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Sends the user an email with a secret key for creating a session. If the provided user ID has not been registered, a new user will be created. When the user clicks the link in the email, the user is redirected back to the URL you provided with the secret key and userId values attached to the URL query string. Use the query string parameters to submit a request to the [POST /v1/account/sessions/token](https://appwrite.io/docs/references/cloud/client-web/account#createSession) endpoint to complete the login process. The link sent to the user's email address is valid for 1 hour.
     * 
     * A user is limited to 10 active sessions at a time by default. [Learn more about session limits](https://appwrite.io/docs/authentication-security#limits).
     * 
     *
     * @param {string} params.userId - Unique Id. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars. If the email address has never been used, a new account is created using the provided userId. Otherwise, if the email address is already attached to an account, the user ID is ignored.
     * @param {string} params.email - User email.
     * @param {string} params.url - URL to redirect the user back to your app from the magic URL login. Only URLs from hostnames in your project platform list are allowed. This requirement helps to prevent an [open redirect](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) attack against your project API.
     * @param {boolean} params.phrase - Toggle for security phrase. If enabled, email will be send with a randomly generated phrase and the phrase will also be included in the response. Confirming phrases match increases the security of your authentication flow.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    createMagicURLToken(params: { userId: string, email: string, url?: string, phrase?: boolean  }): Promise<Models.Token>;
    /**
     * Sends the user an email with a secret key for creating a session. If the provided user ID has not been registered, a new user will be created. When the user clicks the link in the email, the user is redirected back to the URL you provided with the secret key and userId values attached to the URL query string. Use the query string parameters to submit a request to the [POST /v1/account/sessions/token](https://appwrite.io/docs/references/cloud/client-web/account#createSession) endpoint to complete the login process. The link sent to the user's email address is valid for 1 hour.
     * 
     * A user is limited to 10 active sessions at a time by default. [Learn more about session limits](https://appwrite.io/docs/authentication-security#limits).
     * 
     *
     * @param {string} userId - Unique Id. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars. If the email address has never been used, a new account is created using the provided userId. Otherwise, if the email address is already attached to an account, the user ID is ignored.
     * @param {string} email - User email.
     * @param {string} url - URL to redirect the user back to your app from the magic URL login. Only URLs from hostnames in your project platform list are allowed. This requirement helps to prevent an [open redirect](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) attack against your project API.
     * @param {boolean} phrase - Toggle for security phrase. If enabled, email will be send with a randomly generated phrase and the phrase will also be included in the response. Confirming phrases match increases the security of your authentication flow.
     * @throws {AppwriteException}
     * @returns {Promise<Models.Token>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    createMagicURLToken(userId: string, email: string, url?: string, phrase?: boolean): Promise<Models.Token>;
    createMagicURLToken(
        paramsOrFirst: { userId: string, email: string, url?: string, phrase?: boolean } | string,
        ...rest: [(string)?, (string)?, (boolean)?]    
    ): Promise<Models.Token> {
        let params: { userId: string, email: string, url?: string, phrase?: boolean };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { userId: string, email: string, url?: string, phrase?: boolean };
        } else {
            params = {
                userId: paramsOrFirst as string,
                email: rest[0] as string,
                url: rest[1] as string,
                phrase: rest[2] as boolean            
            };
        }

        const userId = params.userId;
        const email = params.email;
        const url = params.url;
        const phrase = params.phrase;

        if (typeof userId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "userId"');
        }

        if (typeof email === 'undefined') {
            throw new AppwriteException('Missing required parameter: "email"');
        }

        const apiPath = '/account/tokens/magic-url';
        const payload: Payload = {};

        if (typeof userId !== 'undefined') {
            payload['userId'] = userId;
        }

        if (typeof email !== 'undefined') {
            payload['email'] = email;
        }

        if (typeof url !== 'undefined') {
            payload['url'] = url;
        }

        if (typeof phrase !== 'undefined') {
            payload['phrase'] = phrase;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('post', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Allow the user to login to their account using the OAuth2 provider of their choice. Each OAuth2 provider should be enabled from the Appwrite console first. Use the success and failure arguments to provide a redirect URL's back to your app when login is completed. 
     * 
     * If authentication succeeds, `userId` and `secret` of a token will be appended to the success URL as query parameters. These can be used to create a new session using the [Create session](https://appwrite.io/docs/references/cloud/client-web/account#createSession) endpoint.
     * 
     * A user is limited to 10 active sessions at a time by default. [Learn more about session limits](https://appwrite.io/docs/authentication-security#limits).
     *
     * @param {OAuthProvider} params.provider - OAuth2 Provider. Currently, supported providers are: amazon, apple, auth0, authentik, autodesk, bitbucket, bitly, box, dailymotion, discord, disqus, dropbox, etsy, facebook, figma, github, gitlab, google, linkedin, microsoft, notion, oidc, okta, paypal, paypalSandbox, podio, salesforce, slack, spotify, stripe, tradeshift, tradeshiftBox, twitch, wordpress, yahoo, yammer, yandex, zoho, zoom.
     * @param {string} params.success - URL to redirect back to your app after a successful login attempt.  Only URLs from hostnames in your project's platform list are allowed. This requirement helps to prevent an [open redirect](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) attack against your project API.
     * @param {string} params.failure - URL to redirect back to your app after a failed login attempt.  Only URLs from hostnames in your project's platform list are allowed. This requirement helps to prevent an [open redirect](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) attack against your project API.
     * @param {string[]} params.scopes - A list of custom OAuth2 scopes. Check each provider internal docs for a list of supported scopes. Maximum of 100 scopes are allowed, each 4096 characters long.
     * @throws {AppwriteException}
     * @returns {void|string}
     */
    createOAuth2Token(params: { provider: OAuthProvider, success?: string, failure?: string, scopes?: string[]  }): void | URL;
    /**
     * Allow the user to login to their account using the OAuth2 provider of their choice. Each OAuth2 provider should be enabled from the Appwrite console first. Use the success and failure arguments to provide a redirect URL's back to your app when login is completed. 
     * 
     * If authentication succeeds, `userId` and `secret` of a token will be appended to the success URL as query parameters. These can be used to create a new session using the [Create session](https://appwrite.io/docs/references/cloud/client-web/account#createSession) endpoint.
     * 
     * A user is limited to 10 active sessions at a time by default. [Learn more about session limits](https://appwrite.io/docs/authentication-security#limits).
     *
     * @param {OAuthProvider} provider - OAuth2 Provider. Currently, supported providers are: amazon, apple, auth0, authentik, autodesk, bitbucket, bitly, box, dailymotion, discord, disqus, dropbox, etsy, facebook, figma, github, gitlab, google, linkedin, microsoft, notion, oidc, okta, paypal, paypalSandbox, podio, salesforce, slack, spotify, stripe, tradeshift, tradeshiftBox, twitch, wordpress, yahoo, yammer, yandex, zoho, zoom.
     * @param {string} success - URL to redirect back to your app after a successful login attempt.  Only URLs from hostnames in your project's platform list are allowed. This requirement helps to prevent an [open redirect](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) attack against your project API.
     * @param {string} failure - URL to redirect back to your app after a failed login attempt.  Only URLs from hostnames in your project's platform list are allowed. This requirement helps to prevent an [open redirect](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) attack against your project API.
     * @param {string[]} scopes - A list of custom OAuth2 scopes. Check each provider internal docs for a list of supported scopes. Maximum of 100 scopes are allowed, each 4096 characters long.
     * @throws {AppwriteException}
     * @returns {void | URL}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    createOAuth2Token(provider: OAuthProvider, success?: string, failure?: string, scopes?: string[]): void | URL;
    createOAuth2Token(
        paramsOrFirst: { provider: OAuthProvider, success?: string, failure?: string, scopes?: string[] } | OAuthProvider,
        ...rest: [(string)?, (string)?, (string[])?]    
    ): void | URL {
        let params: { provider: OAuthProvider, success?: string, failure?: string, scopes?: string[] };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst) && 'provider' in paramsOrFirst)) {
            params = (paramsOrFirst || {}) as { provider: OAuthProvider, success?: string, failure?: string, scopes?: string[] };
        } else {
            params = {
                provider: paramsOrFirst as OAuthProvider,
                success: rest[0] as string,
                failure: rest[1] as string,
                scopes: rest[2] as string[]            
            };
        }

        const provider = params.provider;
        const success = params.success;
        const failure = params.failure;
        const scopes = params.scopes;

        if (typeof provider === 'undefined') {
            throw new AppwriteException('Missing required parameter: "provider"');
        }

        const apiPath = '/account/tokens/oauth2/{provider}'.replace('{provider}', provider);
        const payload: Payload = {};

        if (typeof success !== 'undefined') {
            payload['success'] = success;
        }

        if (typeof failure !== 'undefined') {
            payload['failure'] = failure;
        }

        if (typeof scopes !== 'undefined') {
            payload['scopes'] = scopes;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        payload['project'] = this.client.config.project;


        for (const [key, value] of Object.entries(Service.flatten(payload))) {
            uri.searchParams.append(key, value);
        }
        return uri;
    }

    /**
     * Sends the user an SMS with a secret key for creating a session. If the provided user ID has not be registered, a new user will be created. Use the returned user ID and secret and submit a request to the [POST /v1/account/sessions/token](https://appwrite.io/docs/references/cloud/client-web/account#createSession) endpoint to complete the login process. The secret sent to the user's phone is valid for 15 minutes.
     * 
     * A user is limited to 10 active sessions at a time by default. [Learn more about session limits](https://appwrite.io/docs/authentication-security#limits).
     *
     * @param {string} params.userId - Unique Id. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars. If the phone number has never been used, a new account is created using the provided userId. Otherwise, if the phone number is already attached to an account, the user ID is ignored.
     * @param {string} params.phone - Phone number. Format this number with a leading '+' and a country code, e.g., +16175551212.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    createPhoneToken(params: { userId: string, phone: string  }): Promise<Models.Token>;
    /**
     * Sends the user an SMS with a secret key for creating a session. If the provided user ID has not be registered, a new user will be created. Use the returned user ID and secret and submit a request to the [POST /v1/account/sessions/token](https://appwrite.io/docs/references/cloud/client-web/account#createSession) endpoint to complete the login process. The secret sent to the user's phone is valid for 15 minutes.
     * 
     * A user is limited to 10 active sessions at a time by default. [Learn more about session limits](https://appwrite.io/docs/authentication-security#limits).
     *
     * @param {string} userId - Unique Id. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars. If the phone number has never been used, a new account is created using the provided userId. Otherwise, if the phone number is already attached to an account, the user ID is ignored.
     * @param {string} phone - Phone number. Format this number with a leading '+' and a country code, e.g., +16175551212.
     * @throws {AppwriteException}
     * @returns {Promise<Models.Token>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    createPhoneToken(userId: string, phone: string): Promise<Models.Token>;
    createPhoneToken(
        paramsOrFirst: { userId: string, phone: string } | string,
        ...rest: [(string)?]    
    ): Promise<Models.Token> {
        let params: { userId: string, phone: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { userId: string, phone: string };
        } else {
            params = {
                userId: paramsOrFirst as string,
                phone: rest[0] as string            
            };
        }

        const userId = params.userId;
        const phone = params.phone;

        if (typeof userId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "userId"');
        }

        if (typeof phone === 'undefined') {
            throw new AppwriteException('Missing required parameter: "phone"');
        }

        const apiPath = '/account/tokens/phone';
        const payload: Payload = {};

        if (typeof userId !== 'undefined') {
            payload['userId'] = userId;
        }

        if (typeof phone !== 'undefined') {
            payload['phone'] = phone;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('post', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Use this endpoint to send a verification message to your user email address to confirm they are the valid owners of that address. Both the **userId** and **secret** arguments will be passed as query parameters to the URL you have provided to be attached to the verification email. The provided URL should redirect the user back to your app and allow you to complete the verification process by verifying both the **userId** and **secret** parameters. Learn more about how to [complete the verification process](https://appwrite.io/docs/references/cloud/client-web/account#updateVerification). The verification link sent to the user's email address is valid for 7 days.
     * 
     * Please note that in order to avoid a [Redirect Attack](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.md), the only valid redirect URLs are the ones from domains you have set when adding your platforms in the console interface.
     * 
     *
     * @param {string} params.url - URL to redirect the user back to your app from the verification email. Only URLs from hostnames in your project platform list are allowed. This requirement helps to prevent an [open redirect](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) attack against your project API.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    createVerification(params: { url: string  }): Promise<Models.Token>;
    /**
     * Use this endpoint to send a verification message to your user email address to confirm they are the valid owners of that address. Both the **userId** and **secret** arguments will be passed as query parameters to the URL you have provided to be attached to the verification email. The provided URL should redirect the user back to your app and allow you to complete the verification process by verifying both the **userId** and **secret** parameters. Learn more about how to [complete the verification process](https://appwrite.io/docs/references/cloud/client-web/account#updateVerification). The verification link sent to the user's email address is valid for 7 days.
     * 
     * Please note that in order to avoid a [Redirect Attack](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.md), the only valid redirect URLs are the ones from domains you have set when adding your platforms in the console interface.
     * 
     *
     * @param {string} url - URL to redirect the user back to your app from the verification email. Only URLs from hostnames in your project platform list are allowed. This requirement helps to prevent an [open redirect](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) attack against your project API.
     * @throws {AppwriteException}
     * @returns {Promise<Models.Token>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    createVerification(url: string): Promise<Models.Token>;
    createVerification(
        paramsOrFirst: { url: string } | string    
    ): Promise<Models.Token> {
        let params: { url: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { url: string };
        } else {
            params = {
                url: paramsOrFirst as string            
            };
        }

        const url = params.url;

        if (typeof url === 'undefined') {
            throw new AppwriteException('Missing required parameter: "url"');
        }

        const apiPath = '/account/verification';
        const payload: Payload = {};

        if (typeof url !== 'undefined') {
            payload['url'] = url;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('post', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Use this endpoint to complete the user email verification process. Use both the **userId** and **secret** parameters that were attached to your app URL to verify the user email ownership. If confirmed this route will return a 200 status code.
     *
     * @param {string} params.userId - User ID.
     * @param {string} params.secret - Valid verification token.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    updateVerification(params: { userId: string, secret: string  }): Promise<Models.Token>;
    /**
     * Use this endpoint to complete the user email verification process. Use both the **userId** and **secret** parameters that were attached to your app URL to verify the user email ownership. If confirmed this route will return a 200 status code.
     *
     * @param {string} userId - User ID.
     * @param {string} secret - Valid verification token.
     * @throws {AppwriteException}
     * @returns {Promise<Models.Token>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    updateVerification(userId: string, secret: string): Promise<Models.Token>;
    updateVerification(
        paramsOrFirst: { userId: string, secret: string } | string,
        ...rest: [(string)?]    
    ): Promise<Models.Token> {
        let params: { userId: string, secret: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { userId: string, secret: string };
        } else {
            params = {
                userId: paramsOrFirst as string,
                secret: rest[0] as string            
            };
        }

        const userId = params.userId;
        const secret = params.secret;

        if (typeof userId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "userId"');
        }

        if (typeof secret === 'undefined') {
            throw new AppwriteException('Missing required parameter: "secret"');
        }

        const apiPath = '/account/verification';
        const payload: Payload = {};

        if (typeof userId !== 'undefined') {
            payload['userId'] = userId;
        }

        if (typeof secret !== 'undefined') {
            payload['secret'] = secret;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('put', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Use this endpoint to send a verification SMS to the currently logged in user. This endpoint is meant for use after updating a user's phone number using the [accountUpdatePhone](https://appwrite.io/docs/references/cloud/client-web/account#updatePhone) endpoint. Learn more about how to [complete the verification process](https://appwrite.io/docs/references/cloud/client-web/account#updatePhoneVerification). The verification code sent to the user's phone number is valid for 15 minutes.
     *
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    createPhoneVerification(): Promise<Models.Token> {
        const apiPath = '/account/verification/phone';
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('post', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Use this endpoint to complete the user phone verification process. Use the **userId** and **secret** that were sent to your user's phone number to verify the user email ownership. If confirmed this route will return a 200 status code.
     *
     * @param {string} params.userId - User ID.
     * @param {string} params.secret - Valid verification token.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    updatePhoneVerification(params: { userId: string, secret: string  }): Promise<Models.Token>;
    /**
     * Use this endpoint to complete the user phone verification process. Use the **userId** and **secret** that were sent to your user's phone number to verify the user email ownership. If confirmed this route will return a 200 status code.
     *
     * @param {string} userId - User ID.
     * @param {string} secret - Valid verification token.
     * @throws {AppwriteException}
     * @returns {Promise<Models.Token>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    updatePhoneVerification(userId: string, secret: string): Promise<Models.Token>;
    updatePhoneVerification(
        paramsOrFirst: { userId: string, secret: string } | string,
        ...rest: [(string)?]    
    ): Promise<Models.Token> {
        let params: { userId: string, secret: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { userId: string, secret: string };
        } else {
            params = {
                userId: paramsOrFirst as string,
                secret: rest[0] as string            
            };
        }

        const userId = params.userId;
        const secret = params.secret;

        if (typeof userId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "userId"');
        }

        if (typeof secret === 'undefined') {
            throw new AppwriteException('Missing required parameter: "secret"');
        }

        const apiPath = '/account/verification/phone';
        const payload: Payload = {};

        if (typeof userId !== 'undefined') {
            payload['userId'] = userId;
        }

        if (typeof secret !== 'undefined') {
            payload['secret'] = secret;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('put', uri, {
            'content-type': 'application/json',
        }, payload);
    }
};

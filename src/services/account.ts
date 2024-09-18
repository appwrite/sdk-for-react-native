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
     * Get account
     *
     * Get the currently logged in user.
     *
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async get<Preferences extends Models.Preferences>(): Promise<Models.User<Preferences>> {
        const apiPath = '/account';
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return await this.client.call('get', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Create account
     *
     * Use this endpoint to allow a new user to register a new account in your
     * project. After the user registration completes successfully, you can use
     * the
     * [/account/verfication](https://appwrite.io/docs/references/cloud/client-web/account#createVerification)
     * route to start verifying the user email address. To allow the new user to
     * login to their new account, you need to create a new [account
     * session](https://appwrite.io/docs/references/cloud/client-web/account#createEmailSession).
     *
     * @param {string} userId
     * @param {string} email
     * @param {string} password
     * @param {string} name
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async create<Preferences extends Models.Preferences>(userId: string, email: string, password: string, name?: string): Promise<Models.User<Preferences>> {
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
        return await this.client.call('post', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Update email
     *
     * Update currently logged in user account email address. After changing user
     * address, the user confirmation status will get reset. A new confirmation
     * email is not sent automatically however you can use the send confirmation
     * email endpoint again to send the confirmation email. For security measures,
     * user password is required to complete this request.
     * This endpoint can also be used to convert an anonymous account to a normal
     * one, by passing an email address and a new password.
     * 
     *
     * @param {string} email
     * @param {string} password
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async updateEmail<Preferences extends Models.Preferences>(email: string, password: string): Promise<Models.User<Preferences>> {
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
        return await this.client.call('patch', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * List Identities
     *
     * Get the list of identities for the currently logged in user.
     *
     * @param {string[]} queries
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async listIdentities(queries?: string[]): Promise<Models.IdentityList> {
        const apiPath = '/account/identities';
        const payload: Payload = {};

        if (typeof queries !== 'undefined') {
            payload['queries'] = queries;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return await this.client.call('get', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Delete identity
     *
     * Delete an identity by its unique ID.
     *
     * @param {string} identityId
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async deleteIdentity(identityId: string): Promise<{}> {
        if (typeof identityId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "identityId"');
        }

        const apiPath = '/account/identities/{identityId}'.replace('{identityId}', identityId);
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return await this.client.call('delete', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Create JWT
     *
     * Use this endpoint to create a JSON Web Token. You can use the resulting JWT
     * to authenticate on behalf of the current user when working with the
     * Appwrite server-side API and SDKs. The JWT secret is valid for 15 minutes
     * from its creation and will be invalid if the user will logout in that time
     * frame.
     *
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async createJWT(): Promise<Models.Jwt> {
        const apiPath = '/account/jwts';
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return await this.client.call('post', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * List logs
     *
     * Get the list of latest security activity logs for the currently logged in
     * user. Each log returns user IP address, location and date and time of log.
     *
     * @param {string[]} queries
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async listLogs(queries?: string[]): Promise<Models.LogList> {
        const apiPath = '/account/logs';
        const payload: Payload = {};

        if (typeof queries !== 'undefined') {
            payload['queries'] = queries;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return await this.client.call('get', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Update MFA
     *
     * Enable or disable MFA on an account.
     *
     * @param {boolean} mfa
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async updateMFA<Preferences extends Models.Preferences>(mfa: boolean): Promise<Models.User<Preferences>> {
        if (typeof mfa === 'undefined') {
            throw new AppwriteException('Missing required parameter: "mfa"');
        }

        const apiPath = '/account/mfa';
        const payload: Payload = {};

        if (typeof mfa !== 'undefined') {
            payload['mfa'] = mfa;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return await this.client.call('patch', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Create Authenticator
     *
     * Add an authenticator app to be used as an MFA factor. Verify the
     * authenticator using the [verify
     * authenticator](/docs/references/cloud/client-web/account#updateMfaAuthenticator)
     * method.
     *
     * @param {AuthenticatorType} type
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async createMfaAuthenticator(type: AuthenticatorType): Promise<Models.MfaType> {
        if (typeof type === 'undefined') {
            throw new AppwriteException('Missing required parameter: "type"');
        }

        const apiPath = '/account/mfa/authenticators/{type}'.replace('{type}', type);
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return await this.client.call('post', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Verify Authenticator
     *
     * Verify an authenticator app after adding it using the [add
     * authenticator](/docs/references/cloud/client-web/account#createMfaAuthenticator)
     * method.
     *
     * @param {AuthenticatorType} type
     * @param {string} otp
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async updateMfaAuthenticator<Preferences extends Models.Preferences>(type: AuthenticatorType, otp: string): Promise<Models.User<Preferences>> {
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
        return await this.client.call('put', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Delete Authenticator
     *
     * Delete an authenticator for a user by ID.
     *
     * @param {AuthenticatorType} type
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async deleteMfaAuthenticator(type: AuthenticatorType): Promise<{}> {
        if (typeof type === 'undefined') {
            throw new AppwriteException('Missing required parameter: "type"');
        }

        const apiPath = '/account/mfa/authenticators/{type}'.replace('{type}', type);
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return await this.client.call('delete', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Create MFA Challenge
     *
     * Begin the process of MFA verification after sign-in. Finish the flow with
     * [updateMfaChallenge](/docs/references/cloud/client-web/account#updateMfaChallenge)
     * method.
     *
     * @param {AuthenticationFactor} factor
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async createMfaChallenge(factor: AuthenticationFactor): Promise<Models.MfaChallenge> {
        if (typeof factor === 'undefined') {
            throw new AppwriteException('Missing required parameter: "factor"');
        }

        const apiPath = '/account/mfa/challenge';
        const payload: Payload = {};

        if (typeof factor !== 'undefined') {
            payload['factor'] = factor;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return await this.client.call('post', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Create MFA Challenge (confirmation)
     *
     * Complete the MFA challenge by providing the one-time password. Finish the
     * process of MFA verification by providing the one-time password. To begin
     * the flow, use
     * [createMfaChallenge](/docs/references/cloud/client-web/account#createMfaChallenge)
     * method.
     *
     * @param {string} challengeId
     * @param {string} otp
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async updateMfaChallenge(challengeId: string, otp: string): Promise<{}> {
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
        return await this.client.call('put', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * List Factors
     *
     * List the factors available on the account to be used as a MFA challange.
     *
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async listMfaFactors(): Promise<Models.MfaFactors> {
        const apiPath = '/account/mfa/factors';
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return await this.client.call('get', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Get MFA Recovery Codes
     *
     * Get recovery codes that can be used as backup for MFA flow. Before getting
     * codes, they must be generated using
     * [createMfaRecoveryCodes](/docs/references/cloud/client-web/account#createMfaRecoveryCodes)
     * method. An OTP challenge is required to read recovery codes.
     *
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async getMfaRecoveryCodes(): Promise<Models.MfaRecoveryCodes> {
        const apiPath = '/account/mfa/recovery-codes';
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return await this.client.call('get', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Create MFA Recovery Codes
     *
     * Generate recovery codes as backup for MFA flow. It's recommended to
     * generate and show then immediately after user successfully adds their
     * authehticator. Recovery codes can be used as a MFA verification type in
     * [createMfaChallenge](/docs/references/cloud/client-web/account#createMfaChallenge)
     * method.
     *
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async createMfaRecoveryCodes(): Promise<Models.MfaRecoveryCodes> {
        const apiPath = '/account/mfa/recovery-codes';
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return await this.client.call('post', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Regenerate MFA Recovery Codes
     *
     * Regenerate recovery codes that can be used as backup for MFA flow. Before
     * regenerating codes, they must be first generated using
     * [createMfaRecoveryCodes](/docs/references/cloud/client-web/account#createMfaRecoveryCodes)
     * method. An OTP challenge is required to regenreate recovery codes.
     *
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async updateMfaRecoveryCodes(): Promise<Models.MfaRecoveryCodes> {
        const apiPath = '/account/mfa/recovery-codes';
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return await this.client.call('patch', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Update name
     *
     * Update currently logged in user account name.
     *
     * @param {string} name
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async updateName<Preferences extends Models.Preferences>(name: string): Promise<Models.User<Preferences>> {
        if (typeof name === 'undefined') {
            throw new AppwriteException('Missing required parameter: "name"');
        }

        const apiPath = '/account/name';
        const payload: Payload = {};

        if (typeof name !== 'undefined') {
            payload['name'] = name;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return await this.client.call('patch', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Update password
     *
     * Update currently logged in user password. For validation, user is required
     * to pass in the new password, and the old password. For users created with
     * OAuth, Team Invites and Magic URL, oldPassword is optional.
     *
     * @param {string} password
     * @param {string} oldPassword
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async updatePassword<Preferences extends Models.Preferences>(password: string, oldPassword?: string): Promise<Models.User<Preferences>> {
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
        return await this.client.call('patch', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Update phone
     *
     * Update the currently logged in user's phone number. After updating the
     * phone number, the phone verification status will be reset. A confirmation
     * SMS is not sent automatically, however you can use the [POST
     * /account/verification/phone](https://appwrite.io/docs/references/cloud/client-web/account#createPhoneVerification)
     * endpoint to send a confirmation SMS.
     *
     * @param {string} phone
     * @param {string} password
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async updatePhone<Preferences extends Models.Preferences>(phone: string, password: string): Promise<Models.User<Preferences>> {
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
        return await this.client.call('patch', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Get account preferences
     *
     * Get the preferences as a key-value object for the currently logged in user.
     *
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async getPrefs<Preferences extends Models.Preferences>(): Promise<Preferences> {
        const apiPath = '/account/prefs';
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return await this.client.call('get', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Update preferences
     *
     * Update currently logged in user account preferences. The object you pass is
     * stored as is, and replaces any previous value. The maximum allowed prefs
     * size is 64kB and throws error if exceeded.
     *
     * @param {object} prefs
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async updatePrefs<Preferences extends Models.Preferences>(prefs: object): Promise<Models.User<Preferences>> {
        if (typeof prefs === 'undefined') {
            throw new AppwriteException('Missing required parameter: "prefs"');
        }

        const apiPath = '/account/prefs';
        const payload: Payload = {};

        if (typeof prefs !== 'undefined') {
            payload['prefs'] = prefs;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return await this.client.call('patch', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Create password recovery
     *
     * Sends the user an email with a temporary secret key for password reset.
     * When the user clicks the confirmation link he is redirected back to your
     * app password reset URL with the secret key and email address values
     * attached to the URL query string. Use the query string params to submit a
     * request to the [PUT
     * /account/recovery](https://appwrite.io/docs/references/cloud/client-web/account#updateRecovery)
     * endpoint to complete the process. The verification link sent to the user's
     * email address is valid for 1 hour.
     *
     * @param {string} email
     * @param {string} url
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async createRecovery(email: string, url: string): Promise<Models.Token> {
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
        return await this.client.call('post', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Create password recovery (confirmation)
     *
     * Use this endpoint to complete the user account password reset. Both the
     * **userId** and **secret** arguments will be passed as query parameters to
     * the redirect URL you have provided when sending your request to the [POST
     * /account/recovery](https://appwrite.io/docs/references/cloud/client-web/account#createRecovery)
     * endpoint.
     * 
     * Please note that in order to avoid a [Redirect
     * Attack](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.md)
     * the only valid redirect URLs are the ones from domains you have set when
     * adding your platforms in the console interface.
     *
     * @param {string} userId
     * @param {string} secret
     * @param {string} password
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async updateRecovery(userId: string, secret: string, password: string): Promise<Models.Token> {
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
        return await this.client.call('put', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * List sessions
     *
     * Get the list of active sessions across different devices for the currently
     * logged in user.
     *
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async listSessions(): Promise<Models.SessionList> {
        const apiPath = '/account/sessions';
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return await this.client.call('get', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Delete sessions
     *
     * Delete all sessions from the user account and remove any sessions cookies
     * from the end client.
     *
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async deleteSessions(): Promise<{}> {
        const apiPath = '/account/sessions';
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return await this.client.call('delete', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Create anonymous session
     *
     * Use this endpoint to allow a new user to register an anonymous account in
     * your project. This route will also create a new session for the user. To
     * allow the new user to convert an anonymous account to a normal account, you
     * need to update its [email and
     * password](https://appwrite.io/docs/references/cloud/client-web/account#updateEmail)
     * or create an [OAuth2
     * session](https://appwrite.io/docs/references/cloud/client-web/account#CreateOAuth2Session).
     *
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async createAnonymousSession(): Promise<Models.Session> {
        const apiPath = '/account/sessions/anonymous';
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return await this.client.call('post', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Create email password session
     *
     * Allow the user to login into their account by providing a valid email and
     * password combination. This route will create a new session for the user.
     * 
     * A user is limited to 10 active sessions at a time by default. [Learn more
     * about session
     * limits](https://appwrite.io/docs/authentication-security#limits).
     *
     * @param {string} email
     * @param {string} password
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async createEmailPasswordSession(email: string, password: string): Promise<Models.Session> {
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
        return await this.client.call('post', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Update magic URL session
     *
     * Use this endpoint to create a session from token. Provide the **userId**
     * and **secret** parameters from the successful response of authentication
     * flows initiated by token creation. For example, magic URL and phone login.
     *
     * @param {string} userId
     * @param {string} secret
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async updateMagicURLSession(userId: string, secret: string): Promise<Models.Session> {
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
        return await this.client.call('put', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Create OAuth2 session
     *
     * Allow the user to login to their account using the OAuth2 provider of their
     * choice. Each OAuth2 provider should be enabled from the Appwrite console
     * first. Use the success and failure arguments to provide a redirect URL's
     * back to your app when login is completed.
     * 
     * If there is already an active session, the new session will be attached to
     * the logged-in account. If there are no active sessions, the server will
     * attempt to look for a user with the same email address as the email
     * received from the OAuth2 provider and attach the new session to the
     * existing user. If no matching user is found - the server will create a new
     * user.
     * 
     * A user is limited to 10 active sessions at a time by default. [Learn more
     * about session
     * limits](https://appwrite.io/docs/authentication-security#limits).
     * 
     *
     * @param {OAuthProvider} provider
     * @param {string} success
     * @param {string} failure
     * @param {string[]} scopes
     * @throws {AppwriteException}
     * @returns {void|string}
    */
    createOAuth2Session(provider: OAuthProvider, success?: string, failure?: string, scopes?: string[]): void | URL {
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
     * Update phone session
     *
     * Use this endpoint to create a session from token. Provide the **userId**
     * and **secret** parameters from the successful response of authentication
     * flows initiated by token creation. For example, magic URL and phone login.
     *
     * @param {string} userId
     * @param {string} secret
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async updatePhoneSession(userId: string, secret: string): Promise<Models.Session> {
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
        return await this.client.call('put', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Create session
     *
     * Use this endpoint to create a session from token. Provide the **userId**
     * and **secret** parameters from the successful response of authentication
     * flows initiated by token creation. For example, magic URL and phone login.
     *
     * @param {string} userId
     * @param {string} secret
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async createSession(userId: string, secret: string): Promise<Models.Session> {
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
        return await this.client.call('post', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Get session
     *
     * Use this endpoint to get a logged in user's session using a Session ID.
     * Inputting 'current' will return the current session being used.
     *
     * @param {string} sessionId
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async getSession(sessionId: string): Promise<Models.Session> {
        if (typeof sessionId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "sessionId"');
        }

        const apiPath = '/account/sessions/{sessionId}'.replace('{sessionId}', sessionId);
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return await this.client.call('get', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Update session
     *
     * Use this endpoint to extend a session's length. Extending a session is
     * useful when session expiry is short. If the session was created using an
     * OAuth provider, this endpoint refreshes the access token from the provider.
     *
     * @param {string} sessionId
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async updateSession(sessionId: string): Promise<Models.Session> {
        if (typeof sessionId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "sessionId"');
        }

        const apiPath = '/account/sessions/{sessionId}'.replace('{sessionId}', sessionId);
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return await this.client.call('patch', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Delete session
     *
     * Logout the user. Use 'current' as the session ID to logout on this device,
     * use a session ID to logout on another device. If you're looking to logout
     * the user on all devices, use [Delete
     * Sessions](https://appwrite.io/docs/references/cloud/client-web/account#deleteSessions)
     * instead.
     *
     * @param {string} sessionId
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async deleteSession(sessionId: string): Promise<{}> {
        if (typeof sessionId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "sessionId"');
        }

        const apiPath = '/account/sessions/{sessionId}'.replace('{sessionId}', sessionId);
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return await this.client.call('delete', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Update status
     *
     * Block the currently logged in user account. Behind the scene, the user
     * record is not deleted but permanently blocked from any access. To
     * completely delete a user, use the Users API instead.
     *
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async updateStatus<Preferences extends Models.Preferences>(): Promise<Models.User<Preferences>> {
        const apiPath = '/account/status';
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return await this.client.call('patch', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Create push target
     *
     *
     * @param {string} targetId
     * @param {string} identifier
     * @param {string} providerId
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async createPushTarget(targetId: string, identifier: string, providerId?: string): Promise<Models.Target> {
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
        return await this.client.call('post', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Update push target
     *
     *
     * @param {string} targetId
     * @param {string} identifier
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async updatePushTarget(targetId: string, identifier: string): Promise<Models.Target> {
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
        return await this.client.call('put', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Delete push target
     *
     *
     * @param {string} targetId
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async deletePushTarget(targetId: string): Promise<{}> {
        if (typeof targetId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "targetId"');
        }

        const apiPath = '/account/targets/{targetId}/push'.replace('{targetId}', targetId);
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return await this.client.call('delete', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Create email token (OTP)
     *
     * Sends the user an email with a secret key for creating a session. If the
     * provided user ID has not be registered, a new user will be created. Use the
     * returned user ID and secret and submit a request to the [POST
     * /v1/account/sessions/token](https://appwrite.io/docs/references/cloud/client-web/account#createSession)
     * endpoint to complete the login process. The secret sent to the user's email
     * is valid for 15 minutes.
     * 
     * A user is limited to 10 active sessions at a time by default. [Learn more
     * about session
     * limits](https://appwrite.io/docs/authentication-security#limits).
     *
     * @param {string} userId
     * @param {string} email
     * @param {boolean} phrase
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async createEmailToken(userId: string, email: string, phrase?: boolean): Promise<Models.Token> {
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
        return await this.client.call('post', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Create magic URL token
     *
     * Sends the user an email with a secret key for creating a session. If the
     * provided user ID has not been registered, a new user will be created. When
     * the user clicks the link in the email, the user is redirected back to the
     * URL you provided with the secret key and userId values attached to the URL
     * query string. Use the query string parameters to submit a request to the
     * [POST
     * /v1/account/sessions/token](https://appwrite.io/docs/references/cloud/client-web/account#createSession)
     * endpoint to complete the login process. The link sent to the user's email
     * address is valid for 1 hour. If you are on a mobile device you can leave
     * the URL parameter empty, so that the login completion will be handled by
     * your Appwrite instance by default.
     * 
     * A user is limited to 10 active sessions at a time by default. [Learn more
     * about session
     * limits](https://appwrite.io/docs/authentication-security#limits).
     * 
     *
     * @param {string} userId
     * @param {string} email
     * @param {string} url
     * @param {boolean} phrase
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async createMagicURLToken(userId: string, email: string, url?: string, phrase?: boolean): Promise<Models.Token> {
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
        return await this.client.call('post', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Create OAuth2 token
     *
     * Allow the user to login to their account using the OAuth2 provider of their
     * choice. Each OAuth2 provider should be enabled from the Appwrite console
     * first. Use the success and failure arguments to provide a redirect URL's
     * back to your app when login is completed. 
     * 
     * If authentication succeeds, `userId` and `secret` of a token will be
     * appended to the success URL as query parameters. These can be used to
     * create a new session using the [Create
     * session](https://appwrite.io/docs/references/cloud/client-web/account#createSession)
     * endpoint.
     * 
     * A user is limited to 10 active sessions at a time by default. [Learn more
     * about session
     * limits](https://appwrite.io/docs/authentication-security#limits).
     *
     * @param {OAuthProvider} provider
     * @param {string} success
     * @param {string} failure
     * @param {string[]} scopes
     * @throws {AppwriteException}
     * @returns {void|string}
    */
    createOAuth2Token(provider: OAuthProvider, success?: string, failure?: string, scopes?: string[]): void | URL {
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
     * Create phone token
     *
     * Sends the user an SMS with a secret key for creating a session. If the
     * provided user ID has not be registered, a new user will be created. Use the
     * returned user ID and secret and submit a request to the [POST
     * /v1/account/sessions/token](https://appwrite.io/docs/references/cloud/client-web/account#createSession)
     * endpoint to complete the login process. The secret sent to the user's phone
     * is valid for 15 minutes.
     * 
     * A user is limited to 10 active sessions at a time by default. [Learn more
     * about session
     * limits](https://appwrite.io/docs/authentication-security#limits).
     *
     * @param {string} userId
     * @param {string} phone
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async createPhoneToken(userId: string, phone: string): Promise<Models.Token> {
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
        return await this.client.call('post', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Create email verification
     *
     * Use this endpoint to send a verification message to your user email address
     * to confirm they are the valid owners of that address. Both the **userId**
     * and **secret** arguments will be passed as query parameters to the URL you
     * have provided to be attached to the verification email. The provided URL
     * should redirect the user back to your app and allow you to complete the
     * verification process by verifying both the **userId** and **secret**
     * parameters. Learn more about how to [complete the verification
     * process](https://appwrite.io/docs/references/cloud/client-web/account#updateVerification).
     * The verification link sent to the user's email address is valid for 7 days.
     * 
     * Please note that in order to avoid a [Redirect
     * Attack](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.md),
     * the only valid redirect URLs are the ones from domains you have set when
     * adding your platforms in the console interface.
     * 
     *
     * @param {string} url
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async createVerification(url: string): Promise<Models.Token> {
        if (typeof url === 'undefined') {
            throw new AppwriteException('Missing required parameter: "url"');
        }

        const apiPath = '/account/verification';
        const payload: Payload = {};

        if (typeof url !== 'undefined') {
            payload['url'] = url;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return await this.client.call('post', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Create email verification (confirmation)
     *
     * Use this endpoint to complete the user email verification process. Use both
     * the **userId** and **secret** parameters that were attached to your app URL
     * to verify the user email ownership. If confirmed this route will return a
     * 200 status code.
     *
     * @param {string} userId
     * @param {string} secret
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async updateVerification(userId: string, secret: string): Promise<Models.Token> {
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
        return await this.client.call('put', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Create phone verification
     *
     * Use this endpoint to send a verification SMS to the currently logged in
     * user. This endpoint is meant for use after updating a user's phone number
     * using the
     * [accountUpdatePhone](https://appwrite.io/docs/references/cloud/client-web/account#updatePhone)
     * endpoint. Learn more about how to [complete the verification
     * process](https://appwrite.io/docs/references/cloud/client-web/account#updatePhoneVerification).
     * The verification code sent to the user's phone number is valid for 15
     * minutes.
     *
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async createPhoneVerification(): Promise<Models.Token> {
        const apiPath = '/account/verification/phone';
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return await this.client.call('post', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Update phone verification (confirmation)
     *
     * Use this endpoint to complete the user phone verification process. Use the
     * **userId** and **secret** that were sent to your user's phone number to
     * verify the user email ownership. If confirmed this route will return a 200
     * status code.
     *
     * @param {string} userId
     * @param {string} secret
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async updatePhoneVerification(userId: string, secret: string): Promise<Models.Token> {
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
        return await this.client.call('put', uri, {
            'content-type': 'application/json',
        }, payload);
    }
};

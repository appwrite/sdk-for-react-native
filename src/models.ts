import { ExecutionResourceType } from './enums/execution-resource-type';
import { ExecutionTrigger } from './enums/execution-trigger';
import { ExecutionStatus } from './enums/execution-status';

export namespace Models {
    declare const __default: unique symbol;

    /**
     * Rows List
     */
    export type RowList<Row extends Models.Row = Models.DefaultRow> = {
        /**
         * Total number of rows that matched your query.
         */
        total: number;
        /**
         * List of rows.
         */
        rows: Row[];
    };

    /**
     * Documents List
     */
    export type DocumentList<
        Document extends Models.Document = Models.DefaultDocument,
    > = {
        /**
         * Total number of documents that matched your query.
         */
        total: number;
        /**
         * List of documents.
         */
        documents: Document[];
    };

    /**
     * Presences List
     */
    export type PresenceList = {
        /**
         * Total number of presences that matched your query.
         */
        total: number;
        /**
         * List of presences.
         */
        presences: Presence[];
    };

    /**
     * Sessions List
     */
    export type SessionList = {
        /**
         * Total number of sessions that matched your query.
         */
        total: number;
        /**
         * List of sessions.
         */
        sessions: Session[];
    };

    /**
     * Identities List
     */
    export type IdentityList = {
        /**
         * Total number of identities that matched your query.
         */
        total: number;
        /**
         * List of identities.
         */
        identities: Identity[];
    };

    /**
     * Files List
     */
    export type FileList = {
        /**
         * Total number of files that matched your query.
         */
        total: number;
        /**
         * List of files.
         */
        files: File[];
    };

    /**
     * Teams List
     */
    export type TeamList<
        Preferences extends Models.Preferences = Models.DefaultPreferences,
    > = {
        /**
         * Total number of teams that matched your query.
         */
        total: number;
        /**
         * List of teams.
         */
        teams: Team<Preferences>[];
    };

    /**
     * Memberships List
     */
    export type MembershipList = {
        /**
         * Total number of memberships that matched your query.
         */
        total: number;
        /**
         * List of memberships.
         */
        memberships: Membership[];
    };

    /**
     * Executions List
     */
    export type ExecutionList = {
        /**
         * Total number of executions that matched your query.
         */
        total: number;
        /**
         * List of executions.
         */
        executions: Execution[];
    };

    /**
     * Countries List
     */
    export type CountryList = {
        /**
         * Total number of countries that matched your query.
         */
        total: number;
        /**
         * List of countries.
         */
        countries: Country[];
    };

    /**
     * Continents List
     */
    export type ContinentList = {
        /**
         * Total number of continents that matched your query.
         */
        total: number;
        /**
         * List of continents.
         */
        continents: Continent[];
    };

    /**
     * Languages List
     */
    export type LanguageList = {
        /**
         * Total number of languages that matched your query.
         */
        total: number;
        /**
         * List of languages.
         */
        languages: Language[];
    };

    /**
     * Currencies List
     */
    export type CurrencyList = {
        /**
         * Total number of currencies that matched your query.
         */
        total: number;
        /**
         * List of currencies.
         */
        currencies: Currency[];
    };

    /**
     * Phones List
     */
    export type PhoneList = {
        /**
         * Total number of phones that matched your query.
         */
        total: number;
        /**
         * List of phones.
         */
        phones: Phone[];
    };

    /**
     * Locale codes list
     */
    export type LocaleCodeList = {
        /**
         * Total number of localeCodes that matched your query.
         */
        total: number;
        /**
         * List of localeCodes.
         */
        localeCodes: LocaleCode[];
    };

    /**
     * Transaction List
     */
    export type TransactionList = {
        /**
         * Total number of transactions that matched your query.
         */
        total: number;
        /**
         * List of transactions.
         */
        transactions: Transaction[];
    };

    /**
     * Row
     */
    export type Row = {
        /**
         * Row ID.
         */
        $id: string;
        /**
         * Row sequence ID.
         */
        $sequence: string;
        /**
         * Table ID.
         */
        $tableId: string;
        /**
         * Database ID.
         */
        $databaseId: string;
        /**
         * Row creation date in ISO 8601 format.
         */
        $createdAt: string;
        /**
         * Row update date in ISO 8601 format.
         */
        $updatedAt: string;
        /**
         * Row permissions. [Learn more about permissions](https://appwrite.io/docs/permissions).
         */
        $permissions: string[];
    };

    export type DefaultRow = Row & {
        [key: string]: any;
        [__default]: true;
    };

    /**
     * Document
     */
    export type Document = {
        /**
         * Document ID.
         */
        $id: string;
        /**
         * Document sequence ID.
         */
        $sequence: string;
        /**
         * Collection ID.
         */
        $collectionId: string;
        /**
         * Database ID.
         */
        $databaseId: string;
        /**
         * Document creation date in ISO 8601 format.
         */
        $createdAt: string;
        /**
         * Document update date in ISO 8601 format.
         */
        $updatedAt: string;
        /**
         * Document permissions. [Learn more about permissions](https://appwrite.io/docs/permissions).
         */
        $permissions: string[];
    };

    export type DefaultDocument = Document & {
        [key: string]: any;
        [__default]: true;
    };

    /**
     * Presence
     */
    export type Presence = {
        /**
         * Presence ID.
         */
        $id: string;
        /**
         * Presence creation date in ISO 8601 format.
         */
        $createdAt: string;
        /**
         * Presence update date in ISO 8601 format.
         */
        $updatedAt: string;
        /**
         * Presence permissions. [Learn more about permissions](https://appwrite.io/docs/permissions).
         */
        $permissions: string[];
        /**
         * User ID.
         */
        userId: string;
        /**
         * Presence status.
         */
        status?: string;
        /**
         * Presence source.
         */
        source: string;
        /**
         * Presence expiry date in ISO 8601 format.
         */
        expiresAt?: string;
        /**
         * Presence metadata.
         */
        metadata?: object;
    };

    /**
     * User
     */
    export type User<
        Preferences extends Models.Preferences = Models.DefaultPreferences,
    > = {
        /**
         * User ID.
         */
        $id: string;
        /**
         * User creation date in ISO 8601 format.
         */
        $createdAt: string;
        /**
         * User update date in ISO 8601 format.
         */
        $updatedAt: string;
        /**
         * User name.
         */
        name: string;
        /**
         * Hashed user password.
         */
        password?: string;
        /**
         * Password hashing algorithm.
         */
        hash?: string;
        /**
         * Password hashing algorithm configuration.
         */
        hashOptions?: object;
        /**
         * User registration date in ISO 8601 format.
         */
        registration: string;
        /**
         * User status. Pass `true` for enabled and `false` for disabled.
         */
        status: boolean;
        /**
         * Labels for the user.
         */
        labels: string[];
        /**
         * Password update time in ISO 8601 format.
         */
        passwordUpdate: string;
        /**
         * User email address.
         */
        email: string;
        /**
         * User phone number in E.164 format.
         */
        phone: string;
        /**
         * Email verification status.
         */
        emailVerification: boolean;
        /**
         * Canonical form of the user email address.
         */
        emailCanonical?: string;
        /**
         * Whether the user email is from a free email provider.
         */
        emailIsFree?: boolean;
        /**
         * Whether the user email is from a disposable email provider.
         */
        emailIsDisposable?: boolean;
        /**
         * Whether the user email is from a corporate domain.
         */
        emailIsCorporate?: boolean;
        /**
         * Whether the user email is in its canonical form.
         */
        emailIsCanonical?: boolean;
        /**
         * Whether the password was found in a known data breach the last time it was checked. Null when the password has never been checked.
         */
        passwordPwned?: boolean;
        /**
         * Phone verification status.
         */
        phoneVerification: boolean;
        /**
         * Multi factor authentication status.
         */
        mfa: boolean;
        /**
         * User preferences as a key-value object
         */
        prefs: Preferences;
        /**
         * A user-owned message receiver. A single user may have multiple e.g. emails, phones, and a browser. Each target is registered with a single provider.
         */
        targets: Target[];
        /**
         * Most recent access date in ISO 8601 format. This attribute is only updated again after 24 hours.
         */
        accessedAt: string;
        /**
         * Whether the user can impersonate other users.
         */
        impersonator?: boolean;
        /**
         * ID of the original actor performing the impersonation. Present only when the current request is impersonating another user. Internal audit logs attribute the action to this user, while the impersonated target is recorded only in internal audit payload data.
         */
        impersonatorUserId?: string;
    };

    /**
     * AlgoMD5
     */
    export type AlgoMd5 = {
        /**
         * Algo type.
         */
        type: string;
    };

    /**
     * AlgoSHA
     */
    export type AlgoSha = {
        /**
         * Algo type.
         */
        type: string;
    };

    /**
     * AlgoPHPass
     */
    export type AlgoPhpass = {
        /**
         * Algo type.
         */
        type: string;
    };

    /**
     * AlgoBcrypt
     */
    export type AlgoBcrypt = {
        /**
         * Algo type.
         */
        type: string;
    };

    /**
     * AlgoScrypt
     */
    export type AlgoScrypt = {
        /**
         * Algo type.
         */
        type: string;
        /**
         * CPU complexity of computed hash.
         */
        costCpu: number;
        /**
         * Memory complexity of computed hash.
         */
        costMemory: number;
        /**
         * Parallelization of computed hash.
         */
        costParallel: number;
        /**
         * Length used to compute hash.
         */
        length: number;
    };

    /**
     * AlgoScryptModified
     */
    export type AlgoScryptModified = {
        /**
         * Algo type.
         */
        type: string;
        /**
         * Salt used to compute hash.
         */
        salt: string;
        /**
         * Separator used to compute hash.
         */
        saltSeparator: string;
        /**
         * Key used to compute hash.
         */
        signerKey: string;
    };

    /**
     * AlgoArgon2
     */
    export type AlgoArgon2 = {
        /**
         * Algo type.
         */
        type: string;
        /**
         * Memory used to compute hash.
         */
        memoryCost: number;
        /**
         * Amount of time consumed to compute hash
         */
        timeCost: number;
        /**
         * Number of threads used to compute hash.
         */
        threads: number;
    };

    /**
     * Account
     */
    export type Account<
        Preferences extends Models.Preferences = Models.DefaultPreferences,
    > = {
        /**
         * User ID.
         */
        $id: string;
        /**
         * User creation date in ISO 8601 format.
         */
        $createdAt: string;
        /**
         * User update date in ISO 8601 format.
         */
        $updatedAt: string;
        /**
         * User name.
         */
        name: string;
        /**
         * User registration date in ISO 8601 format.
         */
        registration: string;
        /**
         * User status. Pass `true` for enabled and `false` for disabled.
         */
        status: boolean;
        /**
         * Labels for the user.
         */
        labels: string[];
        /**
         * Password update time in ISO 8601 format.
         */
        passwordUpdate: string;
        /**
         * User email address.
         */
        email: string;
        /**
         * User phone number in E.164 format.
         */
        phone: string;
        /**
         * Email verification status.
         */
        emailVerification: boolean;
        /**
         * Canonical form of the user email address.
         */
        emailCanonical?: string;
        /**
         * Whether the user email is from a free email provider.
         */
        emailIsFree?: boolean;
        /**
         * Whether the user email is from a disposable email provider.
         */
        emailIsDisposable?: boolean;
        /**
         * Whether the user email is from a corporate domain.
         */
        emailIsCorporate?: boolean;
        /**
         * Whether the user email is in its canonical form.
         */
        emailIsCanonical?: boolean;
        /**
         * Whether the password was found in a known data breach the last time it was checked. Null when the password has never been checked.
         */
        passwordPwned?: boolean;
        /**
         * Phone verification status.
         */
        phoneVerification: boolean;
        /**
         * Multi factor authentication status.
         */
        mfa: boolean;
        /**
         * User preferences as a key-value object
         */
        prefs: Preferences;
        /**
         * A user-owned message receiver. A single user may have multiple e.g. emails, phones, and a browser. Each target is registered with a single provider.
         */
        targets: Target[];
        /**
         * Most recent access date in ISO 8601 format. This attribute is only updated again after 24 hours.
         */
        accessedAt: string;
        /**
         * Whether the user can impersonate other users.
         */
        impersonator?: boolean;
        /**
         * ID of the original actor performing the impersonation. Present only when the current request is impersonating another user. Internal audit logs attribute the action to this user, while the impersonated target is recorded only in internal audit payload data.
         */
        impersonatorUserId?: string;
    };

    /**
     * Preferences
     */
    export type Preferences = {};

    export type DefaultPreferences = Preferences & {
        [key: string]: any;
        [__default]: true;
    };

    /**
     * Session
     */
    export type Session = {
        /**
         * Session ID.
         */
        $id: string;
        /**
         * Session creation date in ISO 8601 format.
         */
        $createdAt: string;
        /**
         * Session update date in ISO 8601 format.
         */
        $updatedAt: string;
        /**
         * User ID.
         */
        userId: string;
        /**
         * Session expiration date in ISO 8601 format.
         */
        expire: string;
        /**
         * Session Provider.
         */
        provider: string;
        /**
         * Session Provider User ID.
         */
        providerUid: string;
        /**
         * Session Provider Access Token.
         */
        providerAccessToken: string;
        /**
         * The date of when the access token expires in ISO 8601 format.
         */
        providerAccessTokenExpiry: string;
        /**
         * Session Provider Refresh Token.
         */
        providerRefreshToken: string;
        /**
         * IP in use when the session was created.
         */
        ip: string;
        /**
         * Operating system code name. View list of [available options](https://github.com/appwrite/appwrite/blob/master/docs/lists/os.json).
         */
        osCode: string;
        /**
         * Operating system name.
         */
        osName: string;
        /**
         * Operating system version.
         */
        osVersion: string;
        /**
         * Client type.
         */
        clientType: string;
        /**
         * Client code name. View list of [available options](https://github.com/appwrite/appwrite/blob/master/docs/lists/clients.json).
         */
        clientCode: string;
        /**
         * Client name.
         */
        clientName: string;
        /**
         * Client version.
         */
        clientVersion: string;
        /**
         * Client engine name.
         */
        clientEngine: string;
        /**
         * Client engine name.
         */
        clientEngineVersion: string;
        /**
         * Device name.
         */
        deviceName: string;
        /**
         * Device brand name.
         */
        deviceBrand: string;
        /**
         * Device model name.
         */
        deviceModel: string;
        /**
         * Country two-character ISO 3166-1 alpha code.
         */
        countryCode: string;
        /**
         * Country name.
         */
        countryName: string;
        /**
         * Returns true if this the current user session.
         */
        current: boolean;
        /**
         * Returns a list of active session factors.
         */
        factors: string[];
        /**
         * Secret used to authenticate the user. Only included if the request was made with an API key
         */
        secret: string;
        /**
         * Most recent date in ISO 8601 format when the session successfully passed MFA challenge.
         */
        mfaUpdatedAt: string;
    };

    /**
     * Identity
     */
    export type Identity = {
        /**
         * Identity ID.
         */
        $id: string;
        /**
         * Identity creation date in ISO 8601 format.
         */
        $createdAt: string;
        /**
         * Identity update date in ISO 8601 format.
         */
        $updatedAt: string;
        /**
         * User ID.
         */
        userId: string;
        /**
         * Identity Provider.
         */
        provider: string;
        /**
         * ID of the User in the Identity Provider.
         */
        providerUid: string;
        /**
         * Email of the User in the Identity Provider.
         */
        providerEmail: string;
        /**
         * Identity Provider Access Token.
         */
        providerAccessToken: string;
        /**
         * The date of when the access token expires in ISO 8601 format.
         */
        providerAccessTokenExpiry: string;
        /**
         * Identity Provider Refresh Token.
         */
        providerRefreshToken: string;
        /**
         * Identity Provider ID token (JWT) from the most recent native sign-in. Empty for identities created through the browser OAuth2 flow.
         */
        providerIdToken: string;
    };

    /**
     * Token
     */
    export type Token = {
        /**
         * Token ID.
         */
        $id: string;
        /**
         * Token creation date in ISO 8601 format.
         */
        $createdAt: string;
        /**
         * User ID.
         */
        userId: string;
        /**
         * Token secret key. This will return an empty string unless the response is returned using an API key or as part of a webhook payload.
         */
        secret: string;
        /**
         * Token expiration date in ISO 8601 format.
         */
        expire: string;
        /**
         * Security phrase of a token. Empty if security phrase was not requested when creating a token. It includes randomly generated phrase which is also sent in the external resource such as email.
         */
        phrase: string;
    };

    /**
     * JWT
     */
    export type Jwt = {
        /**
         * JWT encoded string.
         */
        jwt: string;
    };

    /**
     * Locale
     */
    export type Locale = {
        /**
         * User IP address.
         */
        ip: string;
        /**
         * Country code in [ISO 3166-1](http://en.wikipedia.org/wiki/ISO_3166-1) two-character format
         */
        countryCode: string;
        /**
         * Country name. This field support localization.
         */
        country: string;
        /**
         * Continent code. A two character continent code "AF" for Africa, "AN" for Antarctica, "AS" for Asia, "EU" for Europe, "NA" for North America, "OC" for Oceania, and "SA" for South America.
         */
        continentCode: string;
        /**
         * Continent name. This field support localization.
         */
        continent: string;
        /**
         * True if country is part of the European Union.
         */
        eu: boolean;
        /**
         * Currency code in [ISO 4217-1](http://en.wikipedia.org/wiki/ISO_4217) three-character format
         */
        currency: string;
        /**
         * City
         */
        city?: string;
        /**
         * Name of timezone
         */
        timeZone?: string;
        /**
         * Postal code
         */
        postalCode?: string;
        /**
         * Latitude
         */
        latitude?: number;
        /**
         * Longitude
         */
        longitude?: number;
        /**
         * Autonomous System Number (ASN) of the IP
         */
        autonomousSystemNumber?: string;
        /**
         * Organization that owns the ASN
         */
        autonomousSystemOrganization?: string;
        /**
         * Internet service provider of the IP
         */
        isp?: string;
        /**
         * Connection type of the IP (e.g. cable, cellular, corporate)
         */
        connectionType?: string;
        /**
         * User type classification of the IP (e.g. residential, business, hosting)
         */
        connectionUsageType?: string;
        /**
         * Registered organization of the IP
         */
        connectionOrganization?: string;
    };

    /**
     * LocaleCode
     */
    export type LocaleCode = {
        /**
         * Locale codes in [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)
         */
        code: string;
        /**
         * Locale name
         */
        name: string;
    };

    /**
     * File
     */
    export type File = {
        /**
         * File ID.
         */
        $id: string;
        /**
         * Bucket ID.
         */
        bucketId: string;
        /**
         * File creation date in ISO 8601 format.
         */
        $createdAt: string;
        /**
         * File update date in ISO 8601 format.
         */
        $updatedAt: string;
        /**
         * File permissions. [Learn more about permissions](https://appwrite.io/docs/permissions).
         */
        $permissions: string[];
        /**
         * File name.
         */
        name: string;
        /**
         * Virtual folder containing the file, with a trailing slash. Empty for the bucket root.
         */
        folder: string;
        /**
         * Full virtual path of the file: the folder followed by the file name.
         */
        key: string;
        /**
         * File MD5 signature.
         */
        signature: string;
        /**
         * File mime type.
         */
        mimeType: string;
        /**
         * File original size in bytes.
         */
        sizeOriginal: number;
        /**
         * File actual stored size in bytes after compression and/or encryption.
         */
        sizeActual: number;
        /**
         * Total number of chunks available
         */
        chunksTotal: number;
        /**
         * Total number of chunks uploaded
         */
        chunksUploaded: number;
        /**
         * Whether file contents are encrypted at rest.
         */
        encryption: boolean;
        /**
         * Compression algorithm used for the file. Will be one of none, [gzip](https://en.wikipedia.org/wiki/Gzip), or [zstd](https://en.wikipedia.org/wiki/Zstd).
         */
        compression: string;
    };

    /**
     * Team
     */
    export type Team<
        Preferences extends Models.Preferences = Models.DefaultPreferences,
    > = {
        /**
         * Team ID.
         */
        $id: string;
        /**
         * Team creation date in ISO 8601 format.
         */
        $createdAt: string;
        /**
         * Team update date in ISO 8601 format.
         */
        $updatedAt: string;
        /**
         * Team name.
         */
        name: string;
        /**
         * Total number of team members.
         */
        total: number;
        /**
         * Team preferences as a key-value object
         */
        prefs: Preferences;
    };

    /**
     * Membership
     */
    export type Membership = {
        /**
         * Membership ID.
         */
        $id: string;
        /**
         * Membership creation date in ISO 8601 format.
         */
        $createdAt: string;
        /**
         * Membership update date in ISO 8601 format.
         */
        $updatedAt: string;
        /**
         * User ID.
         */
        userId: string;
        /**
         * User name. Hide this attribute by toggling membership privacy in the Console.
         */
        userName: string;
        /**
         * User email address. Hide this attribute by toggling membership privacy in the Console.
         */
        userEmail: string;
        /**
         * User phone number. Hide this attribute by toggling membership privacy in the Console.
         */
        userPhone: string;
        /**
         * Team ID.
         */
        teamId: string;
        /**
         * Team name.
         */
        teamName: string;
        /**
         * Date, the user has been invited to join the team in ISO 8601 format.
         */
        invited: string;
        /**
         * Date, the user has accepted the invitation to join the team in ISO 8601 format.
         */
        joined: string;
        /**
         * User confirmation status, true if the user has joined the team or false otherwise.
         */
        confirm: boolean;
        /**
         * Multi factor authentication status, true if the user has MFA enabled or false otherwise. Hide this attribute by toggling membership privacy in the Console.
         */
        mfa: boolean;
        /**
         * Most recent access date in ISO 8601 format. Show this attribute by toggling membership privacy in the Console.
         */
        userAccessedAt: string;
        /**
         * User list of roles
         */
        roles: string[];
    };

    /**
     * Execution
     */
    export type Execution = {
        /**
         * Execution ID.
         */
        $id: string;
        /**
         * Execution creation date in ISO 8601 format.
         */
        $createdAt: string;
        /**
         * Execution update date in ISO 8601 format.
         */
        $updatedAt: string;
        /**
         * Execution roles.
         */
        $permissions: string[];
        /**
         * Function or site ID.
         */
        resourceId: string;
        /**
         * Execution resource type.
         */
        resourceType: ExecutionResourceType;
        /**
         * Deployment ID used to create the execution.
         */
        deploymentId: string;
        /**
         * The trigger that caused the resource to execute. Possible values can be: `http`, `schedule`, or `event`.
         */
        trigger: ExecutionTrigger;
        /**
         * The status of the resource execution. Possible values can be: `waiting`, `processing`, `completed`, `failed`, or `scheduled`.
         */
        status: ExecutionStatus;
        /**
         * HTTP request method type.
         */
        requestMethod: string;
        /**
         * HTTP request path and query.
         */
        requestPath: string;
        /**
         * HTTP request headers as a key-value object. This will return only whitelisted headers. All headers are returned if execution is created as synchronous.
         */
        requestHeaders: Headers[];
        /**
         * HTTP response status code.
         */
        responseStatusCode: number;
        /**
         * HTTP response body. This will return empty unless execution is created as synchronous.
         */
        responseBody: string;
        /**
         * HTTP response headers as a key-value object. This will return only whitelisted headers. All headers are returned if execution is created as synchronous.
         */
        responseHeaders: Headers[];
        /**
         * Resource logs. Includes the last 4,000 characters. This will return an empty string unless the response is returned using an API key or as part of a webhook payload.
         */
        logs: string;
        /**
         * Resource errors. Includes the last 4,000 characters. This will return an empty string unless the response is returned using an API key or as part of a webhook payload.
         */
        errors: string;
        /**
         * Total time the resource(function/site) took to respond, in seconds.
         */
        duration: number;
        /**
         * The scheduled time for execution. If left empty, execution will be queued immediately.
         */
        scheduledAt?: string;
    };

    /**
     * Country
     */
    export type Country = {
        /**
         * Country name.
         */
        name: string;
        /**
         * Country two-character ISO 3166-1 alpha code.
         */
        code: string;
    };

    /**
     * Continent
     */
    export type Continent = {
        /**
         * Continent name.
         */
        name: string;
        /**
         * Continent two letter code.
         */
        code: string;
    };

    /**
     * Language
     */
    export type Language = {
        /**
         * Language name.
         */
        name: string;
        /**
         * Language two-character ISO 639-1 codes.
         */
        code: string;
        /**
         * Language native name.
         */
        nativeName: string;
    };

    /**
     * Currency
     */
    export type Currency = {
        /**
         * Currency symbol.
         */
        symbol: string;
        /**
         * Currency name.
         */
        name: string;
        /**
         * Currency native symbol.
         */
        symbolNative: string;
        /**
         * Number of decimal digits.
         */
        decimalDigits: number;
        /**
         * Currency digit rounding.
         */
        rounding: number;
        /**
         * Currency code in [ISO 4217-1](http://en.wikipedia.org/wiki/ISO_4217) three-character format.
         */
        code: string;
        /**
         * Currency plural name
         */
        namePlural: string;
    };

    /**
     * Phone
     */
    export type Phone = {
        /**
         * Phone code.
         */
        code: string;
        /**
         * Country two-character ISO 3166-1 alpha code.
         */
        countryCode: string;
        /**
         * Country name.
         */
        countryName: string;
    };

    /**
     * Headers
     */
    export type Headers = {
        /**
         * Header name.
         */
        name: string;
        /**
         * Header value.
         */
        value: string;
    };

    /**
     * MFA Challenge
     */
    export type MfaChallenge = {
        /**
         * Token ID.
         */
        $id: string;
        /**
         * Token creation date in ISO 8601 format.
         */
        $createdAt: string;
        /**
         * User ID.
         */
        userId: string;
        /**
         * Token expiration date in ISO 8601 format.
         */
        expire: string;
    };

    /**
     * MFA Recovery Codes
     */
    export type MfaRecoveryCodes = {
        /**
         * Recovery codes.
         */
        recoveryCodes: string[];
    };

    /**
     * MFAType
     */
    export type MfaType = {
        /**
         * Secret token used for TOTP factor.
         */
        secret: string;
        /**
         * URI for authenticator apps.
         */
        uri: string;
    };

    /**
     * MFAFactors
     */
    export type MfaFactors = {
        /**
         * Can TOTP be used for MFA challenge for this account.
         */
        totp: boolean;
        /**
         * Can phone (SMS) be used for MFA challenge for this account.
         */
        phone: boolean;
        /**
         * Can email be used for MFA challenge for this account.
         */
        email: boolean;
        /**
         * Can recovery code be used for MFA challenge for this account.
         */
        recoveryCode: boolean;
        /**
         * Can custom factor be used for MFA challenge for this account.
         */
        custom: boolean;
    };

    /**
     * Transaction
     */
    export type Transaction = {
        /**
         * Transaction ID.
         */
        $id: string;
        /**
         * Transaction creation time in ISO 8601 format.
         */
        $createdAt: string;
        /**
         * Transaction update date in ISO 8601 format.
         */
        $updatedAt: string;
        /**
         * Current status of the transaction. One of: pending, committing, committed, rolled_back, failed.
         */
        status: string;
        /**
         * Number of operations in the transaction.
         */
        operations: number;
        /**
         * Expiration time in ISO 8601 format.
         */
        expiresAt: string;
    };

    /**
     * Subscriber
     */
    export type Subscriber = {
        /**
         * Subscriber ID.
         */
        $id: string;
        /**
         * Subscriber creation time in ISO 8601 format.
         */
        $createdAt: string;
        /**
         * Subscriber update date in ISO 8601 format.
         */
        $updatedAt: string;
        /**
         * Target ID.
         */
        targetId: string;
        /**
         * Target.
         */
        target: Target;
        /**
         * Topic ID.
         */
        userId: string;
        /**
         * User Name.
         */
        userName: string;
        /**
         * Topic ID.
         */
        topicId: string;
        /**
         * The target provider type. Can be one of the following: `email`, `sms` or `push`.
         */
        providerType: string;
    };

    /**
     * Target
     */
    export type Target = {
        /**
         * Target ID.
         */
        $id: string;
        /**
         * Target creation time in ISO 8601 format.
         */
        $createdAt: string;
        /**
         * Target update date in ISO 8601 format.
         */
        $updatedAt: string;
        /**
         * Target Name.
         */
        name: string;
        /**
         * User ID.
         */
        userId: string;
        /**
         * Provider ID.
         */
        providerId?: string;
        /**
         * The target provider type. Can be one of the following: `email`, `sms` or `push`.
         */
        providerType: string;
        /**
         * The target identifier.
         */
        identifier: string;
        /**
         * Is the target expired.
         */
        expired: boolean;
    };

    /**
     * App
     */
    export type App = {
        /**
         * App ID.
         */
        $id: string;
        /**
         * App creation time in ISO 8601 format.
         */
        $createdAt: string;
        /**
         * App update date in ISO 8601 format.
         */
        $updatedAt: string;
        /**
         * Application name.
         */
        name: string;
        /**
         * Application description shown to users during OAuth2 consent.
         */
        description: string;
        /**
         * Application homepage URL shown to users during OAuth2 consent.
         */
        clientUri: string;
        /**
         * Application logo URL shown to users during OAuth2 consent.
         */
        logoUri: string;
        /**
         * Application privacy policy URL shown to users during OAuth2 consent.
         */
        privacyPolicyUrl: string;
        /**
         * Application terms of service URL shown to users during OAuth2 consent.
         */
        termsUrl: string;
        /**
         * Application support or security contact emails.
         */
        contacts: string[];
        /**
         * Application tagline shown to users during OAuth2 consent.
         */
        tagline: string;
        /**
         * Application tags shown to users during OAuth2 consent.
         */
        tags: string[];
        /**
         * Application labels. Read-only for clients; only a server SDK using a project API key can update them.
         */
        labels: string[];
        /**
         * Application image URLs shown to users during OAuth2 consent.
         */
        images: string[];
        /**
         * Application support URL shown to users during OAuth2 consent.
         */
        supportUrl: string;
        /**
         * Application data deletion URL shown to users during OAuth2 consent.
         */
        dataDeletionUrl: string;
        /**
         * List of authorized redirect URIs. These URIs can be used to redirect users after they authenticate.
         */
        redirectUris: string[];
        /**
         * List of authorized post-logout redirect URIs for OpenID Connect RP-Initiated Logout. The logout endpoint only redirects users to URIs in this list after ending their session.
         */
        postLogoutRedirectUris: string[];
        /**
         * Whether the app is enabled or not.
         */
        enabled: boolean;
        /**
         * OAuth2 client type. `public` for SPAs, mobile, and native apps that cannot keep a client secret (PKCE required); `confidential` for server-side clients that authenticate with a client secret.
         */
        type: string;
        /**
         * Whether this client may use the OAuth2 Device Authorization Grant (RFC 8628).
         */
        deviceFlow: boolean;
        /**
         * ID of team that owns the application, if owned by team. Otherwise, user ID will be used.
         */
        teamId: string;
        /**
         * ID of user who owns the application, if owned by user. Otherwise, team ID will be used.
         */
        userId: string;
        /**
         * Scopes the application requests when installed on a team. Organization-level and project-level scopes only.
         */
        installationScopes: string[];
        /**
         * URL users are redirected to after creating or updating an installation of this application. Empty for no redirect.
         */
        installationRedirectUrl: string;
        /**
         * List of application secrets.
         */
        secrets: AppSecret[];
    };

    /**
     * AppSecret
     */
    export type AppSecret = {
        /**
         * Secret ID.
         */
        $id: string;
        /**
         * Secret creation time in ISO 8601 format.
         */
        $createdAt: string;
        /**
         * Secret update time in ISO 8601 format.
         */
        $updatedAt: string;
        /**
         * Application ID this secret belongs to.
         */
        appId: string;
        /**
         * Always empty. The application client secret is returned only once, in the response of the createSecret method.
         */
        secret: string;
        /**
         * Last few characters of the client secret, used to help identify it.
         */
        hint: string;
        /**
         * ID of the user who created the secret.
         */
        createdById: string;
        /**
         * Name of the user who created the secret.
         */
        createdByName: string;
        /**
         * Time the secret was last used for authentication in ISO 8601 format. Null if never used.
         */
        lastAccessedAt?: string;
    };

    /**
     * AppSecretPlaintext
     */
    export type AppSecretPlaintext = {
        /**
         * Secret ID.
         */
        $id: string;
        /**
         * Secret creation time in ISO 8601 format.
         */
        $createdAt: string;
        /**
         * Secret update time in ISO 8601 format.
         */
        $updatedAt: string;
        /**
         * Application ID this secret belongs to.
         */
        appId: string;
        /**
         * Application client secret. Returned only when the secret is created; subsequent reads always return an empty value.
         */
        secret: string;
        /**
         * Last few characters of the client secret, used to help identify it.
         */
        hint: string;
        /**
         * ID of the user who created the secret.
         */
        createdById: string;
        /**
         * Name of the user who created the secret.
         */
        createdByName: string;
        /**
         * Time the secret was last used for authentication in ISO 8601 format. Null if never used.
         */
        lastAccessedAt?: string;
    };

    /**
     * AppScope
     */
    export type AppScope = {
        /**
         * Scope value as requested by apps.
         */
        value: string;
        /**
         * Human-readable description of what the scope grants.
         */
        description: string;
        /**
         * What the scope grants access to. One of `account`, `project`, or `organization`. Only `project` and `organization` scopes are installable.
         */
        type: string;
        /**
         * Scope category, used to group scopes on consent and installation screens.
         */
        category: string;
        /**
         * Whether the scope is deprecated. Deprecated scopes can still be requested but should not be offered for new grants.
         */
        deprecated: boolean;
    };

    /**
     * AppInstallation
     */
    export type AppInstallation = {
        /**
         * Installation ID.
         */
        $id: string;
        /**
         * Installation creation time in ISO 8601 format.
         */
        $createdAt: string;
        /**
         * Installation update time in ISO 8601 format.
         */
        $updatedAt: string;
        /**
         * ID of the installed application.
         */
        appId: string;
        /**
         * ID of the team the application is installed on.
         */
        teamId: string;
        /**
         * Scopes granted to the application. Snapshot of the application's installation scopes taken when the installation was created or last updated.
         */
        scopes: string[];
        /**
         * Authorization details granted to the application. Rich authorization request (RFC 9396) style entries; the Appwrite Console stores authorized project IDs here.
         */
        authorizationDetails: Record<string, any>[];
        /**
         * ID of the user who created the installation.
         */
        createdById: string;
        /**
         * Name of the user who created the installation.
         */
        createdByName: string;
        /**
         * Time an access token was last issued for the installation in ISO 8601 format. Null if never used.
         */
        lastAccessedAt?: string;
    };

    /**
     * AppKey
     */
    export type AppKey = {
        /**
         * App key ID.
         */
        $id: string;
        /**
         * App key creation time in ISO 8601 format.
         */
        $createdAt: string;
        /**
         * App key update time in ISO 8601 format.
         */
        $updatedAt: string;
        /**
         * Application ID this app key belongs to.
         */
        appId: string;
        /**
         * App key secret.
         */
        secret: string;
        /**
         * Last few characters of the app key secret, used to help identify it.
         */
        hint: string;
        /**
         * ID of the user who created the app key.
         */
        createdById: string;
        /**
         * Name of the user who created the app key.
         */
        createdByName: string;
        /**
         * Time the app key was last used for authentication in ISO 8601 format. Null if never used.
         */
        lastAccessedAt?: string;
    };

    /**
     * OAuth2 Authorize
     */
    export type Oauth2Authorize = {
        /**
         * OAuth2 grant ID. Set when the user must give explicit consent; pass it to the approve or reject endpoint. Empty when a redirect URL is returned instead.
         */
        grantId: string;
        /**
         * URL the end user should be redirected to when the flow can complete without consent. Empty when consent is still required.
         */
        redirectUrl: string;
    };

    /**
     * OAuth2 Approve
     */
    export type Oauth2Approve = {
        /**
         * URL the end user should be redirected to after the grant is approved, carrying the authorization `code` and/or `id_token` along with the original `state`.
         */
        redirectUrl: string;
    };

    /**
     * OAuth2 Reject
     */
    export type Oauth2Reject = {
        /**
         * URL the end user should be redirected to after the grant is rejected, carrying an `access_denied` error.
         */
        redirectUrl: string;
    };

    /**
     * OAuth2 Grant
     */
    export type Oauth2Grant = {
        /**
         * Grant ID.
         */
        $id: string;
        /**
         * Grant creation time in ISO 8601 format.
         */
        $createdAt: string;
        /**
         * Grant update date in ISO 8601 format.
         */
        $updatedAt: string;
        /**
         * ID of the user the grant belongs to.
         */
        userId: string;
        /**
         * ID of the OAuth2 client (app) the grant was requested for.
         */
        appId: string;
        /**
         * Requested OAuth2 scopes the user is being asked to consent to.
         */
        scopes: string[];
        /**
         * Requested RFC 8707 resource indicators the user is being asked to consent to.
         */
        resources: string[];
        /**
         * Requested authorization_details the user is being asked to consent to, as a JSON string. Each entry has a `type` plus project-defined fields.
         */
        authorizationDetails: string;
        /**
         * OIDC prompt directive the consent screen should honor. Space-separated list of: login, consent, select_account.
         */
        prompt: string;
        /**
         * Redirect URI the user will be sent to after the flow completes.
         */
        redirectUri: string;
        /**
         * Unix timestamp of when the user last authenticated.
         */
        authTime: number;
        /**
         * Grant expiration time in ISO 8601 format.
         */
        expire: string;
    };

    /**
     * OAuth2 Device Authorization
     */
    export type Oauth2DeviceAuthorization = {
        /**
         * Device verification code used by the client to poll the token endpoint.
         */
        device_code: string;
        /**
         * Short code the end user enters on the verification page.
         */
        user_code: string;
        /**
         * URL where the end user enters the user code.
         */
        verification_uri: string;
        /**
         * Verification URL with the user code prefilled as a query parameter.
         */
        verification_uri_complete: string;
        /**
         * Lifetime of the device code and user code in seconds.
         */
        expires_in: number;
        /**
         * Minimum polling interval for the token endpoint in seconds.
         */
        interval: number;
    };

    /**
     * OAuth2 PAR
     */
    export type Oauth2PAR = {
        /**
         * Authorization request handle to pass to the authorize endpoint.
         */
        request_uri: string;
        /**
         * Lifetime of the authorization request handle in seconds.
         */
        expires_in: number;
    };

    /**
     * OAuth2 Token
     */
    export type Oauth2Token = {
        /**
         * OAuth2 access token.
         */
        access_token: string;
        /**
         * OAuth2 token type.
         */
        token_type: string;
        /**
         * Access token lifetime in seconds.
         */
        expires_in: number;
        /**
         * OAuth2 refresh token.
         */
        refresh_token: string;
        /**
         * Space-separated scopes granted to the access token.
         */
        scope: string;
        /**
         * Granted RFC 9396 authorization details as a JSON string.
         */
        authorization_details?: string;
        /**
         * OpenID Connect ID token. Returned when the `openid` scope is granted.
         */
        id_token?: string;
    };

    /**
     * OAuth2 Consent
     */
    export type Oauth2Consent = {
        /**
         * Consent ID.
         */
        $id: string;
        /**
         * Consent creation time in ISO 8601 format.
         */
        $createdAt: string;
        /**
         * Consent update date in ISO 8601 format.
         */
        $updatedAt: string;
        /**
         * ID of the user the consent belongs to.
         */
        userId: string;
        /**
         * ID of the registered app the consent was given to. Empty for URL-form (CIMD) clients.
         */
        appId: string;
        /**
         * Client ID metadata document URL of the client the consent was given to. Empty for registered apps.
         */
        cimdUrl: string;
        /**
         * OAuth2 scopes the user consented to.
         */
        scopes: string[];
        /**
         * RFC 8707 resource indicators the user consented to.
         */
        resources: string[];
        /**
         * Authorization details the user consented to, as a JSON string. Each entry has a `type` plus project-defined fields.
         */
        authorizationDetails: string;
        /**
         * Consent expiration time in ISO 8601 format. Empty when the consent has no token-bound expiry yet.
         */
        expire: string;
    };

    /**
     * OAuth2 Consent Token
     */
    export type Oauth2ConsentToken = {
        /**
         * Token family ID.
         */
        $id: string;
        /**
         * Token creation time in ISO 8601 format.
         */
        $createdAt: string;
        /**
         * Token update date in ISO 8601 format. Refreshing the token family updates this.
         */
        $updatedAt: string;
        /**
         * ID of the consent the token family was issued under.
         */
        consentId: string;
        /**
         * ID of the user the token family belongs to.
         */
        userId: string;
        /**
         * ID of the registered app the token family was issued to. Empty for URL-form (CIMD) clients.
         */
        appId: string;
        /**
         * Client ID metadata document URL of the client the token family was issued to. Empty for registered apps.
         */
        cimdUrl: string;
        /**
         * OAuth2 scopes granted on the token family.
         */
        scopes: string[];
        /**
         * RFC 8707 resource indicators granted on the token family.
         */
        resources: string[];
        /**
         * Authorization details granted on the token family, as a JSON string. Each entry has a `type` plus project-defined fields.
         */
        authorizationDetails: string;
        /**
         * Expiration time of the current access token of this family in ISO 8601 format.
         */
        expire: string;
    };

    /**
     * OAuth2 Project
     */
    export type Oauth2Project = {
        /**
         * Project ID.
         */
        $id: string;
        /**
         * Region ID the project is deployed in.
         */
        region: string;
        /**
         * API endpoint of the region the project is deployed in. Empty when the region has no public hostname configured.
         */
        endpoint: string;
    };

    /**
     * OAuth2 Organization
     */
    export type Oauth2Organization = {
        /**
         * Organization ID.
         */
        $id: string;
    };

    /**
     * OAuth2 accessible projects list
     */
    export type Oauth2ProjectList = {
        /**
         * Total number of projects that matched your query.
         */
        total: number;
        /**
         * List of projects.
         */
        projects: Oauth2Project[];
    };

    /**
     * OAuth2 accessible organizations list
     */
    export type Oauth2OrganizationList = {
        /**
         * Total number of organizations that matched your query.
         */
        total: number;
        /**
         * List of organizations.
         */
        organizations: Oauth2Organization[];
    };

    /**
     * OAuth2 consents list
     */
    export type Oauth2ConsentList = {
        /**
         * Total number of consents that matched your query.
         */
        total: number;
        /**
         * List of consents.
         */
        consents: Oauth2Consent[];
    };

    /**
     * OAuth2 consent tokens list
     */
    export type Oauth2ConsentTokenList = {
        /**
         * Total number of tokens that matched your query.
         */
        total: number;
        /**
         * List of tokens.
         */
        tokens: Oauth2ConsentToken[];
    };

    /**
     * Apps list
     */
    export type AppsList = {
        /**
         * Total number of apps that matched your query.
         */
        total: number;
        /**
         * List of apps.
         */
        apps: App[];
    };

    /**
     * App secrets list
     */
    export type AppSecretList = {
        /**
         * Total number of secrets that matched your query.
         */
        total: number;
        /**
         * List of secrets.
         */
        secrets: AppSecret[];
    };

    /**
     * App scopes list
     */
    export type AppScopeList = {
        /**
         * Total number of scopes that matched your query.
         */
        total: number;
        /**
         * List of scopes.
         */
        scopes: AppScope[];
    };

    /**
     * App installations list
     */
    export type AppInstallationList = {
        /**
         * Total number of installations that matched your query.
         */
        total: number;
        /**
         * List of installations.
         */
        installations: AppInstallation[];
    };

    /**
     * App keys list
     */
    export type AppKeyList = {
        /**
         * Total number of keys that matched your query.
         */
        total: number;
        /**
         * List of keys.
         */
        keys: AppKey[];
    };
}

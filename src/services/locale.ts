import { Service } from '../service';
import { Client } from '../client';
import type { Models } from '../models';
import type { Payload } from '../client';

export class Locale extends Service {
    constructor(client: Client) {
        super(client);
    }

    /**
     * Get the current user location based on IP. Returns an object with user country code, country name, continent name, continent code, ip address and suggested currency. You can use the locale header to get the data in a supported language.
     *
     * ([IP Geolocation by DB-IP](https://db-ip.com))
     *
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    get(): Promise<Models.Locale> {
        const apiPath = '/locale';
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
     * List of all locale codes in [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes).
     *
     * @param {boolean} params.total - When set to false, the total count returned will be 0 and will not be calculated.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    listCodes(params?: { total?: boolean }): Promise<Models.LocaleCodeList>;
    /**
     * List of all locale codes in [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes).
     *
     * @param {boolean} total - When set to false, the total count returned will be 0 and will not be calculated.
     * @throws {AppwriteException}
     * @returns {Promise<Models.LocaleCodeList>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    listCodes(total?: boolean): Promise<Models.LocaleCodeList>;
    listCodes(
        paramsOrFirst?: { total?: boolean } | boolean,
    ): Promise<Models.LocaleCodeList> {
        let params: { total?: boolean };

        if (
            typeof paramsOrFirst === 'undefined' ||
            (paramsOrFirst &&
                typeof paramsOrFirst === 'object' &&
                !Array.isArray(paramsOrFirst))
        ) {
            params = (paramsOrFirst || {}) as { total?: boolean };
        } else {
            params = {
                total: paramsOrFirst as boolean,
            };
        }

        const total = params.total;

        const apiPath = '/locale/codes';
        const apiPayload: Payload = {};

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
     * List of all continents. You can use the locale header to get the data in a supported language.
     *
     * @param {boolean} params.total - When set to false, the total count returned will be 0 and will not be calculated.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    listContinents(params?: { total?: boolean }): Promise<Models.ContinentList>;
    /**
     * List of all continents. You can use the locale header to get the data in a supported language.
     *
     * @param {boolean} total - When set to false, the total count returned will be 0 and will not be calculated.
     * @throws {AppwriteException}
     * @returns {Promise<Models.ContinentList>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    listContinents(total?: boolean): Promise<Models.ContinentList>;
    listContinents(
        paramsOrFirst?: { total?: boolean } | boolean,
    ): Promise<Models.ContinentList> {
        let params: { total?: boolean };

        if (
            typeof paramsOrFirst === 'undefined' ||
            (paramsOrFirst &&
                typeof paramsOrFirst === 'object' &&
                !Array.isArray(paramsOrFirst))
        ) {
            params = (paramsOrFirst || {}) as { total?: boolean };
        } else {
            params = {
                total: paramsOrFirst as boolean,
            };
        }

        const total = params.total;

        const apiPath = '/locale/continents';
        const apiPayload: Payload = {};

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
     * List of all countries. You can use the locale header to get the data in a supported language.
     *
     * @param {boolean} params.total - When set to false, the total count returned will be 0 and will not be calculated.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    listCountries(params?: { total?: boolean }): Promise<Models.CountryList>;
    /**
     * List of all countries. You can use the locale header to get the data in a supported language.
     *
     * @param {boolean} total - When set to false, the total count returned will be 0 and will not be calculated.
     * @throws {AppwriteException}
     * @returns {Promise<Models.CountryList>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    listCountries(total?: boolean): Promise<Models.CountryList>;
    listCountries(
        paramsOrFirst?: { total?: boolean } | boolean,
    ): Promise<Models.CountryList> {
        let params: { total?: boolean };

        if (
            typeof paramsOrFirst === 'undefined' ||
            (paramsOrFirst &&
                typeof paramsOrFirst === 'object' &&
                !Array.isArray(paramsOrFirst))
        ) {
            params = (paramsOrFirst || {}) as { total?: boolean };
        } else {
            params = {
                total: paramsOrFirst as boolean,
            };
        }

        const total = params.total;

        const apiPath = '/locale/countries';
        const apiPayload: Payload = {};

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
     * List of all countries that are currently members of the EU. You can use the locale header to get the data in a supported language.
     *
     * @param {boolean} params.total - When set to false, the total count returned will be 0 and will not be calculated.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    listCountriesEU(params?: { total?: boolean }): Promise<Models.CountryList>;
    /**
     * List of all countries that are currently members of the EU. You can use the locale header to get the data in a supported language.
     *
     * @param {boolean} total - When set to false, the total count returned will be 0 and will not be calculated.
     * @throws {AppwriteException}
     * @returns {Promise<Models.CountryList>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    listCountriesEU(total?: boolean): Promise<Models.CountryList>;
    listCountriesEU(
        paramsOrFirst?: { total?: boolean } | boolean,
    ): Promise<Models.CountryList> {
        let params: { total?: boolean };

        if (
            typeof paramsOrFirst === 'undefined' ||
            (paramsOrFirst &&
                typeof paramsOrFirst === 'object' &&
                !Array.isArray(paramsOrFirst))
        ) {
            params = (paramsOrFirst || {}) as { total?: boolean };
        } else {
            params = {
                total: paramsOrFirst as boolean,
            };
        }

        const total = params.total;

        const apiPath = '/locale/countries/eu';
        const apiPayload: Payload = {};

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
     * List of all countries phone codes. You can use the locale header to get the data in a supported language.
     *
     * @param {boolean} params.total - When set to false, the total count returned will be 0 and will not be calculated.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    listCountriesPhones(params?: {
        total?: boolean;
    }): Promise<Models.PhoneList>;
    /**
     * List of all countries phone codes. You can use the locale header to get the data in a supported language.
     *
     * @param {boolean} total - When set to false, the total count returned will be 0 and will not be calculated.
     * @throws {AppwriteException}
     * @returns {Promise<Models.PhoneList>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    listCountriesPhones(total?: boolean): Promise<Models.PhoneList>;
    listCountriesPhones(
        paramsOrFirst?: { total?: boolean } | boolean,
    ): Promise<Models.PhoneList> {
        let params: { total?: boolean };

        if (
            typeof paramsOrFirst === 'undefined' ||
            (paramsOrFirst &&
                typeof paramsOrFirst === 'object' &&
                !Array.isArray(paramsOrFirst))
        ) {
            params = (paramsOrFirst || {}) as { total?: boolean };
        } else {
            params = {
                total: paramsOrFirst as boolean,
            };
        }

        const total = params.total;

        const apiPath = '/locale/countries/phones';
        const apiPayload: Payload = {};

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
     * List of all currencies, including currency symbol, name, plural, and decimal digits for all major and minor currencies. You can use the locale header to get the data in a supported language.
     *
     * @param {boolean} params.total - When set to false, the total count returned will be 0 and will not be calculated.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    listCurrencies(params?: { total?: boolean }): Promise<Models.CurrencyList>;
    /**
     * List of all currencies, including currency symbol, name, plural, and decimal digits for all major and minor currencies. You can use the locale header to get the data in a supported language.
     *
     * @param {boolean} total - When set to false, the total count returned will be 0 and will not be calculated.
     * @throws {AppwriteException}
     * @returns {Promise<Models.CurrencyList>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    listCurrencies(total?: boolean): Promise<Models.CurrencyList>;
    listCurrencies(
        paramsOrFirst?: { total?: boolean } | boolean,
    ): Promise<Models.CurrencyList> {
        let params: { total?: boolean };

        if (
            typeof paramsOrFirst === 'undefined' ||
            (paramsOrFirst &&
                typeof paramsOrFirst === 'object' &&
                !Array.isArray(paramsOrFirst))
        ) {
            params = (paramsOrFirst || {}) as { total?: boolean };
        } else {
            params = {
                total: paramsOrFirst as boolean,
            };
        }

        const total = params.total;

        const apiPath = '/locale/currencies';
        const apiPayload: Payload = {};

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
     * List of all languages classified by ISO 639-1 including 2-letter code, name in English, and name in the respective language.
     *
     * @param {boolean} params.total - When set to false, the total count returned will be 0 and will not be calculated.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    listLanguages(params?: { total?: boolean }): Promise<Models.LanguageList>;
    /**
     * List of all languages classified by ISO 639-1 including 2-letter code, name in English, and name in the respective language.
     *
     * @param {boolean} total - When set to false, the total count returned will be 0 and will not be calculated.
     * @throws {AppwriteException}
     * @returns {Promise<Models.LanguageList>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    listLanguages(total?: boolean): Promise<Models.LanguageList>;
    listLanguages(
        paramsOrFirst?: { total?: boolean } | boolean,
    ): Promise<Models.LanguageList> {
        let params: { total?: boolean };

        if (
            typeof paramsOrFirst === 'undefined' ||
            (paramsOrFirst &&
                typeof paramsOrFirst === 'object' &&
                !Array.isArray(paramsOrFirst))
        ) {
            params = (paramsOrFirst || {}) as { total?: boolean };
        } else {
            params = {
                total: paramsOrFirst as boolean,
            };
        }

        const total = params.total;

        const apiPath = '/locale/languages';
        const apiPayload: Payload = {};

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
}

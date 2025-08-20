import { Service } from '../service';
import { AppwriteException, Client } from '../client';
import type { Models } from '../models';
import type { UploadProgress, Payload } from '../client';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';


export class TablesDb extends Service {

     constructor(client: Client)
     {
        super(client);
     }

    /**
     * Get a list of all the user's rows in a given table. You can use the query params to filter your results.
     *
     * @param {string} databaseId - Database ID.
     * @param {string} tableId - Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tables#tablesCreate).
     * @param {string[]} queries - Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    listRows<Row extends Models.Row = Models.DefaultRow>(params: { databaseId: string, tableId: string, queries?: string[]  }): Promise<Models.RowList<Row>>;
    /**
     * @deprecated Parameter-based methods will be removed in the upcoming version.
     * Please use the object based method instead for better developer experience.
     *
     * @example
     * // Old (deprecated)
     * listRows<Row extends Models.Row = Models.DefaultRow>(databaseId: string, tableId: string, queries?: string[]): Promise<Models.RowList<Row>>;
     *
     * // New (object based)
     * listRows<Row extends Models.Row = Models.DefaultRow>(params: { databaseId: string, tableId: string, queries?: string[]  }): Promise<Models.RowList<Row>>;
     */
    listRows<Row extends Models.Row = Models.DefaultRow>(databaseId: string, tableId: string, queries?: string[]): Promise<Models.RowList<Row>>;
    listRows<Row extends Models.Row = Models.DefaultRow>(
        paramsOrFirst: { databaseId: string, tableId: string, queries?: string[] } | string,
        ...rest: [(string)?, (string[])?]    
    ): Promise<Models.RowList<Row>> {
        let params: { databaseId: string, tableId: string, queries?: string[] };

        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst as { databaseId: string, tableId: string, queries?: string[] };
        } else {
            params = {
                databaseId: paramsOrFirst as string,
                tableId: rest[0] as string,
                queries: rest[1] as string[]            
            };
        }

        const databaseId = params.databaseId;
        const tableId = params.tableId;
        const queries = params.queries;

        if (typeof databaseId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "databaseId"');
        }

        if (typeof tableId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "tableId"');
        }

        const apiPath = '/tablesdb/{databaseId}/tables/{tableId}/rows'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
        const payload: Payload = {};

        if (typeof queries !== 'undefined') {
            payload['queries'] = queries;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('get', uri, {
        }, payload);
    }

    /**
     * Create a new Row. Before using this route, you should create a new table resource using either a [server integration](https://appwrite.io/docs/server/databases#databasesCreateTable) API or directly from your database console.
     *
     * @param {string} databaseId - Database ID.
     * @param {string} tableId - Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tables#tablesCreate). Make sure to define columns before creating rows.
     * @param {string} rowId - Row ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.
     * @param {object} data - Row data as JSON object.
     * @param {string[]} permissions - An array of permissions strings. By default, only the current user is granted all permissions. [Learn more about permissions](https://appwrite.io/docs/permissions).
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    createRow<Row extends Models.Row = Models.DefaultRow>(params: { databaseId: string, tableId: string, rowId: string, data: object, permissions?: string[]  }): Promise<Row>;
    /**
     * @deprecated Parameter-based methods will be removed in the upcoming version.
     * Please use the object based method instead for better developer experience.
     *
     * @example
     * // Old (deprecated)
     * createRow<Row extends Models.Row = Models.DefaultRow>(databaseId: string, tableId: string, rowId: string, data: object, permissions?: string[]): Promise<Row>;
     *
     * // New (object based)
     * createRow<Row extends Models.Row = Models.DefaultRow>(params: { databaseId: string, tableId: string, rowId: string, data: object, permissions?: string[]  }): Promise<Row>;
     */
    createRow<Row extends Models.Row = Models.DefaultRow>(databaseId: string, tableId: string, rowId: string, data: object, permissions?: string[]): Promise<Row>;
    createRow<Row extends Models.Row = Models.DefaultRow>(
        paramsOrFirst: { databaseId: string, tableId: string, rowId: string, data: object, permissions?: string[] } | string,
        ...rest: [(string)?, (string)?, (object)?, (string[])?]    
    ): Promise<Row> {
        let params: { databaseId: string, tableId: string, rowId: string, data: object, permissions?: string[] };

        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst as { databaseId: string, tableId: string, rowId: string, data: object, permissions?: string[] };
        } else {
            params = {
                databaseId: paramsOrFirst as string,
                tableId: rest[0] as string,
                rowId: rest[1] as string,
                data: rest[2] as object,
                permissions: rest[3] as string[]            
            };
        }

        const databaseId = params.databaseId;
        const tableId = params.tableId;
        const rowId = params.rowId;
        const data = params.data;
        const permissions = params.permissions;

        if (typeof databaseId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "databaseId"');
        }

        if (typeof tableId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "tableId"');
        }

        if (typeof rowId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "rowId"');
        }

        if (typeof data === 'undefined') {
            throw new AppwriteException('Missing required parameter: "data"');
        }

        const apiPath = '/tablesdb/{databaseId}/tables/{tableId}/rows'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
        const payload: Payload = {};

        if (typeof rowId !== 'undefined') {
            payload['rowId'] = rowId;
        }

        if (typeof data !== 'undefined') {
            payload['data'] = data;
        }

        if (typeof permissions !== 'undefined') {
            payload['permissions'] = permissions;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('post', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Get a row by its unique ID. This endpoint response returns a JSON object with the row data.
     *
     * @param {string} databaseId - Database ID.
     * @param {string} tableId - Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tables#tablesCreate).
     * @param {string} rowId - Row ID.
     * @param {string[]} queries - Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    getRow<Row extends Models.Row = Models.DefaultRow>(params: { databaseId: string, tableId: string, rowId: string, queries?: string[]  }): Promise<Row>;
    /**
     * @deprecated Parameter-based methods will be removed in the upcoming version.
     * Please use the object based method instead for better developer experience.
     *
     * @example
     * // Old (deprecated)
     * getRow<Row extends Models.Row = Models.DefaultRow>(databaseId: string, tableId: string, rowId: string, queries?: string[]): Promise<Row>;
     *
     * // New (object based)
     * getRow<Row extends Models.Row = Models.DefaultRow>(params: { databaseId: string, tableId: string, rowId: string, queries?: string[]  }): Promise<Row>;
     */
    getRow<Row extends Models.Row = Models.DefaultRow>(databaseId: string, tableId: string, rowId: string, queries?: string[]): Promise<Row>;
    getRow<Row extends Models.Row = Models.DefaultRow>(
        paramsOrFirst: { databaseId: string, tableId: string, rowId: string, queries?: string[] } | string,
        ...rest: [(string)?, (string)?, (string[])?]    
    ): Promise<Row> {
        let params: { databaseId: string, tableId: string, rowId: string, queries?: string[] };

        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst as { databaseId: string, tableId: string, rowId: string, queries?: string[] };
        } else {
            params = {
                databaseId: paramsOrFirst as string,
                tableId: rest[0] as string,
                rowId: rest[1] as string,
                queries: rest[2] as string[]            
            };
        }

        const databaseId = params.databaseId;
        const tableId = params.tableId;
        const rowId = params.rowId;
        const queries = params.queries;

        if (typeof databaseId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "databaseId"');
        }

        if (typeof tableId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "tableId"');
        }

        if (typeof rowId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "rowId"');
        }

        const apiPath = '/tablesdb/{databaseId}/tables/{tableId}/rows/{rowId}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{rowId}', rowId);
        const payload: Payload = {};

        if (typeof queries !== 'undefined') {
            payload['queries'] = queries;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('get', uri, {
        }, payload);
    }

    /**
     * Create or update a Row. Before using this route, you should create a new table resource using either a [server integration](https://appwrite.io/docs/server/databases#databasesCreateTable) API or directly from your database console.
     *
     * @param {string} databaseId - Database ID.
     * @param {string} tableId - Table ID.
     * @param {string} rowId - Row ID.
     * @param {object} data - Row data as JSON object. Include all required columns of the row to be created or updated.
     * @param {string[]} permissions - An array of permissions strings. By default, the current permissions are inherited. [Learn more about permissions](https://appwrite.io/docs/permissions).
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    upsertRow<Row extends Models.Row = Models.DefaultRow>(params: { databaseId: string, tableId: string, rowId: string, data?: object, permissions?: string[]  }): Promise<Row>;
    /**
     * @deprecated Parameter-based methods will be removed in the upcoming version.
     * Please use the object based method instead for better developer experience.
     *
     * @example
     * // Old (deprecated)
     * upsertRow<Row extends Models.Row = Models.DefaultRow>(databaseId: string, tableId: string, rowId: string, data?: object, permissions?: string[]): Promise<Row>;
     *
     * // New (object based)
     * upsertRow<Row extends Models.Row = Models.DefaultRow>(params: { databaseId: string, tableId: string, rowId: string, data?: object, permissions?: string[]  }): Promise<Row>;
     */
    upsertRow<Row extends Models.Row = Models.DefaultRow>(databaseId: string, tableId: string, rowId: string, data?: object, permissions?: string[]): Promise<Row>;
    upsertRow<Row extends Models.Row = Models.DefaultRow>(
        paramsOrFirst: { databaseId: string, tableId: string, rowId: string, data?: object, permissions?: string[] } | string,
        ...rest: [(string)?, (string)?, (object)?, (string[])?]    
    ): Promise<Row> {
        let params: { databaseId: string, tableId: string, rowId: string, data?: object, permissions?: string[] };

        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst as { databaseId: string, tableId: string, rowId: string, data?: object, permissions?: string[] };
        } else {
            params = {
                databaseId: paramsOrFirst as string,
                tableId: rest[0] as string,
                rowId: rest[1] as string,
                data: rest[2] as object,
                permissions: rest[3] as string[]            
            };
        }

        const databaseId = params.databaseId;
        const tableId = params.tableId;
        const rowId = params.rowId;
        const data = params.data;
        const permissions = params.permissions;

        if (typeof databaseId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "databaseId"');
        }

        if (typeof tableId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "tableId"');
        }

        if (typeof rowId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "rowId"');
        }

        const apiPath = '/tablesdb/{databaseId}/tables/{tableId}/rows/{rowId}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{rowId}', rowId);
        const payload: Payload = {};

        if (typeof data !== 'undefined') {
            payload['data'] = data;
        }

        if (typeof permissions !== 'undefined') {
            payload['permissions'] = permissions;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('put', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Update a row by its unique ID. Using the patch method you can pass only specific fields that will get updated.
     *
     * @param {string} databaseId - Database ID.
     * @param {string} tableId - Table ID.
     * @param {string} rowId - Row ID.
     * @param {object} data - Row data as JSON object. Include only columns and value pairs to be updated.
     * @param {string[]} permissions - An array of permissions strings. By default, the current permissions are inherited. [Learn more about permissions](https://appwrite.io/docs/permissions).
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    updateRow<Row extends Models.Row = Models.DefaultRow>(params: { databaseId: string, tableId: string, rowId: string, data?: object, permissions?: string[]  }): Promise<Row>;
    /**
     * @deprecated Parameter-based methods will be removed in the upcoming version.
     * Please use the object based method instead for better developer experience.
     *
     * @example
     * // Old (deprecated)
     * updateRow<Row extends Models.Row = Models.DefaultRow>(databaseId: string, tableId: string, rowId: string, data?: object, permissions?: string[]): Promise<Row>;
     *
     * // New (object based)
     * updateRow<Row extends Models.Row = Models.DefaultRow>(params: { databaseId: string, tableId: string, rowId: string, data?: object, permissions?: string[]  }): Promise<Row>;
     */
    updateRow<Row extends Models.Row = Models.DefaultRow>(databaseId: string, tableId: string, rowId: string, data?: object, permissions?: string[]): Promise<Row>;
    updateRow<Row extends Models.Row = Models.DefaultRow>(
        paramsOrFirst: { databaseId: string, tableId: string, rowId: string, data?: object, permissions?: string[] } | string,
        ...rest: [(string)?, (string)?, (object)?, (string[])?]    
    ): Promise<Row> {
        let params: { databaseId: string, tableId: string, rowId: string, data?: object, permissions?: string[] };

        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst as { databaseId: string, tableId: string, rowId: string, data?: object, permissions?: string[] };
        } else {
            params = {
                databaseId: paramsOrFirst as string,
                tableId: rest[0] as string,
                rowId: rest[1] as string,
                data: rest[2] as object,
                permissions: rest[3] as string[]            
            };
        }

        const databaseId = params.databaseId;
        const tableId = params.tableId;
        const rowId = params.rowId;
        const data = params.data;
        const permissions = params.permissions;

        if (typeof databaseId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "databaseId"');
        }

        if (typeof tableId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "tableId"');
        }

        if (typeof rowId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "rowId"');
        }

        const apiPath = '/tablesdb/{databaseId}/tables/{tableId}/rows/{rowId}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{rowId}', rowId);
        const payload: Payload = {};

        if (typeof data !== 'undefined') {
            payload['data'] = data;
        }

        if (typeof permissions !== 'undefined') {
            payload['permissions'] = permissions;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('patch', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Delete a row by its unique ID.
     *
     * @param {string} databaseId - Database ID.
     * @param {string} tableId - Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tables#tablesCreate).
     * @param {string} rowId - Row ID.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    deleteRow(params: { databaseId: string, tableId: string, rowId: string  }): Promise<{}>;
    /**
     * @deprecated Parameter-based methods will be removed in the upcoming version.
     * Please use the object based method instead for better developer experience.
     *
     * @example
     * // Old (deprecated)
     * deleteRow(databaseId: string, tableId: string, rowId: string): Promise<{}>;
     *
     * // New (object based)
     * deleteRow(params: { databaseId: string, tableId: string, rowId: string  }): Promise<{}>;
     */
    deleteRow(databaseId: string, tableId: string, rowId: string): Promise<{}>;
    deleteRow(
        paramsOrFirst: { databaseId: string, tableId: string, rowId: string } | string,
        ...rest: [(string)?, (string)?]    
    ): Promise<{}> {
        let params: { databaseId: string, tableId: string, rowId: string };

        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst as { databaseId: string, tableId: string, rowId: string };
        } else {
            params = {
                databaseId: paramsOrFirst as string,
                tableId: rest[0] as string,
                rowId: rest[1] as string            
            };
        }

        const databaseId = params.databaseId;
        const tableId = params.tableId;
        const rowId = params.rowId;

        if (typeof databaseId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "databaseId"');
        }

        if (typeof tableId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "tableId"');
        }

        if (typeof rowId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "rowId"');
        }

        const apiPath = '/tablesdb/{databaseId}/tables/{tableId}/rows/{rowId}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{rowId}', rowId);
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('delete', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Decrement a specific column of a row by a given value.
     *
     * @param {string} databaseId - Database ID.
     * @param {string} tableId - Table ID.
     * @param {string} rowId - Row ID.
     * @param {string} column - Column key.
     * @param {number} value - Value to increment the column by. The value must be a number.
     * @param {number} min - Minimum value for the column. If the current value is lesser than this value, an exception will be thrown.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    decrementRowColumn<Row extends Models.Row = Models.DefaultRow>(params: { databaseId: string, tableId: string, rowId: string, column: string, value?: number, min?: number  }): Promise<Row>;
    /**
     * @deprecated Parameter-based methods will be removed in the upcoming version.
     * Please use the object based method instead for better developer experience.
     *
     * @example
     * // Old (deprecated)
     * decrementRowColumn<Row extends Models.Row = Models.DefaultRow>(databaseId: string, tableId: string, rowId: string, column: string, value?: number, min?: number): Promise<Row>;
     *
     * // New (object based)
     * decrementRowColumn<Row extends Models.Row = Models.DefaultRow>(params: { databaseId: string, tableId: string, rowId: string, column: string, value?: number, min?: number  }): Promise<Row>;
     */
    decrementRowColumn<Row extends Models.Row = Models.DefaultRow>(databaseId: string, tableId: string, rowId: string, column: string, value?: number, min?: number): Promise<Row>;
    decrementRowColumn<Row extends Models.Row = Models.DefaultRow>(
        paramsOrFirst: { databaseId: string, tableId: string, rowId: string, column: string, value?: number, min?: number } | string,
        ...rest: [(string)?, (string)?, (string)?, (number)?, (number)?]    
    ): Promise<Row> {
        let params: { databaseId: string, tableId: string, rowId: string, column: string, value?: number, min?: number };

        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst as { databaseId: string, tableId: string, rowId: string, column: string, value?: number, min?: number };
        } else {
            params = {
                databaseId: paramsOrFirst as string,
                tableId: rest[0] as string,
                rowId: rest[1] as string,
                column: rest[2] as string,
                value: rest[3] as number,
                min: rest[4] as number            
            };
        }

        const databaseId = params.databaseId;
        const tableId = params.tableId;
        const rowId = params.rowId;
        const column = params.column;
        const value = params.value;
        const min = params.min;

        if (typeof databaseId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "databaseId"');
        }

        if (typeof tableId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "tableId"');
        }

        if (typeof rowId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "rowId"');
        }

        if (typeof column === 'undefined') {
            throw new AppwriteException('Missing required parameter: "column"');
        }

        const apiPath = '/tablesdb/{databaseId}/tables/{tableId}/rows/{rowId}/{column}/decrement'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{rowId}', rowId).replace('{column}', column);
        const payload: Payload = {};

        if (typeof value !== 'undefined') {
            payload['value'] = value;
        }

        if (typeof min !== 'undefined') {
            payload['min'] = min;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('patch', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Increment a specific column of a row by a given value.
     *
     * @param {string} databaseId - Database ID.
     * @param {string} tableId - Table ID.
     * @param {string} rowId - Row ID.
     * @param {string} column - Column key.
     * @param {number} value - Value to increment the column by. The value must be a number.
     * @param {number} max - Maximum value for the column. If the current value is greater than this value, an error will be thrown.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    incrementRowColumn<Row extends Models.Row = Models.DefaultRow>(params: { databaseId: string, tableId: string, rowId: string, column: string, value?: number, max?: number  }): Promise<Row>;
    /**
     * @deprecated Parameter-based methods will be removed in the upcoming version.
     * Please use the object based method instead for better developer experience.
     *
     * @example
     * // Old (deprecated)
     * incrementRowColumn<Row extends Models.Row = Models.DefaultRow>(databaseId: string, tableId: string, rowId: string, column: string, value?: number, max?: number): Promise<Row>;
     *
     * // New (object based)
     * incrementRowColumn<Row extends Models.Row = Models.DefaultRow>(params: { databaseId: string, tableId: string, rowId: string, column: string, value?: number, max?: number  }): Promise<Row>;
     */
    incrementRowColumn<Row extends Models.Row = Models.DefaultRow>(databaseId: string, tableId: string, rowId: string, column: string, value?: number, max?: number): Promise<Row>;
    incrementRowColumn<Row extends Models.Row = Models.DefaultRow>(
        paramsOrFirst: { databaseId: string, tableId: string, rowId: string, column: string, value?: number, max?: number } | string,
        ...rest: [(string)?, (string)?, (string)?, (number)?, (number)?]    
    ): Promise<Row> {
        let params: { databaseId: string, tableId: string, rowId: string, column: string, value?: number, max?: number };

        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst as { databaseId: string, tableId: string, rowId: string, column: string, value?: number, max?: number };
        } else {
            params = {
                databaseId: paramsOrFirst as string,
                tableId: rest[0] as string,
                rowId: rest[1] as string,
                column: rest[2] as string,
                value: rest[3] as number,
                max: rest[4] as number            
            };
        }

        const databaseId = params.databaseId;
        const tableId = params.tableId;
        const rowId = params.rowId;
        const column = params.column;
        const value = params.value;
        const max = params.max;

        if (typeof databaseId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "databaseId"');
        }

        if (typeof tableId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "tableId"');
        }

        if (typeof rowId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "rowId"');
        }

        if (typeof column === 'undefined') {
            throw new AppwriteException('Missing required parameter: "column"');
        }

        const apiPath = '/tablesdb/{databaseId}/tables/{tableId}/rows/{rowId}/{column}/increment'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{rowId}', rowId).replace('{column}', column);
        const payload: Payload = {};

        if (typeof value !== 'undefined') {
            payload['value'] = value;
        }

        if (typeof max !== 'undefined') {
            payload['max'] = max;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('patch', uri, {
            'content-type': 'application/json',
        }, payload);
    }
};

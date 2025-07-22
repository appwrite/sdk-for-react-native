import { Service } from '../service';
import { AppwriteException, Client } from '../client';
import type { Models } from '../models';
import type { UploadProgress, Payload } from '../client';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';


export class Tables extends Service {

     constructor(client: Client)
     {
        super(client);
     }

    /**
     * Get a list of all the user's rows in a given table. You can use the query
     * params to filter your results.
     *
     * @param {string} databaseId
     * @param {string} tableId
     * @param {string[]} queries
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    listRows<Row extends Models.Row = Models.DefaultRow>(databaseId: string, tableId: string, queries?: string[]): Promise<Models.RowList<Row>> {
        if (typeof databaseId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "databaseId"');
        }

        if (typeof tableId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "tableId"');
        }

        const apiPath = '/databases/{databaseId}/tables/{tableId}/rows'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
        const payload: Payload = {};

        if (typeof queries !== 'undefined') {
            payload['queries'] = queries;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('get', uri, {
        }, payload);
    }

    /**
     * Create a new Row. Before using this route, you should create a new table
     * resource using either a [server
     * integration](https://appwrite.io/docs/server/databases#databasesCreateTable)
     * API or directly from your database console.
     *
     * @param {string} databaseId
     * @param {string} tableId
     * @param {string} rowId
     * @param {object} data
     * @param {string[]} permissions
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    createRow<Row extends Models.Row = Models.DefaultRow>(databaseId: string, tableId: string, rowId: string, data: object, permissions?: string[]): Promise<Row> {
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

        const apiPath = '/databases/{databaseId}/tables/{tableId}/rows'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
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
     * Create new Rows. Before using this route, you should create a new table
     * resource using either a [server
     * integration](https://appwrite.io/docs/server/databases#databasesCreateTable)
     * API or directly from your database console.
     *
     * @param {string} databaseId
     * @param {string} tableId
     * @param {object[]} rows
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    createRows<Row extends Models.Row = Models.DefaultRow>(databaseId: string, tableId: string, rows: object[]): Promise<Models.RowList<Row>> {
        if (typeof databaseId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "databaseId"');
        }

        if (typeof tableId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "tableId"');
        }

        if (typeof rows === 'undefined') {
            throw new AppwriteException('Missing required parameter: "rows"');
        }

        const apiPath = '/databases/{databaseId}/tables/{tableId}/rows'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
        const payload: Payload = {};

        if (typeof rows !== 'undefined') {
            payload['rows'] = rows;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('post', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Get a row by its unique ID. This endpoint response returns a JSON object
     * with the row data.
     *
     * @param {string} databaseId
     * @param {string} tableId
     * @param {string} rowId
     * @param {string[]} queries
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    getRow<Row extends Models.Row = Models.DefaultRow>(databaseId: string, tableId: string, rowId: string, queries?: string[]): Promise<Row> {
        if (typeof databaseId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "databaseId"');
        }

        if (typeof tableId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "tableId"');
        }

        if (typeof rowId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "rowId"');
        }

        const apiPath = '/databases/{databaseId}/tables/{tableId}/rows/{rowId}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{rowId}', rowId);
        const payload: Payload = {};

        if (typeof queries !== 'undefined') {
            payload['queries'] = queries;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('get', uri, {
        }, payload);
    }

    /**
     * Create or update a Row. Before using this route, you should create a new
     * table resource using either a [server
     * integration](https://appwrite.io/docs/server/databases#databasesCreateTable)
     * API or directly from your database console.
     *
     * @param {string} databaseId
     * @param {string} tableId
     * @param {string} rowId
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    upsertRow<Row extends Models.Row = Models.DefaultRow>(databaseId: string, tableId: string, rowId: string): Promise<Row> {
        if (typeof databaseId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "databaseId"');
        }

        if (typeof tableId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "tableId"');
        }

        if (typeof rowId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "rowId"');
        }

        const apiPath = '/databases/{databaseId}/tables/{tableId}/rows/{rowId}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{rowId}', rowId);
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('put', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Update a row by its unique ID. Using the patch method you can pass only
     * specific fields that will get updated.
     *
     * @param {string} databaseId
     * @param {string} tableId
     * @param {string} rowId
     * @param {object} data
     * @param {string[]} permissions
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    updateRow<Row extends Models.Row = Models.DefaultRow>(databaseId: string, tableId: string, rowId: string, data?: object, permissions?: string[]): Promise<Row> {
        if (typeof databaseId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "databaseId"');
        }

        if (typeof tableId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "tableId"');
        }

        if (typeof rowId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "rowId"');
        }

        const apiPath = '/databases/{databaseId}/tables/{tableId}/rows/{rowId}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{rowId}', rowId);
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
     * @param {string} databaseId
     * @param {string} tableId
     * @param {string} rowId
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    deleteRow(databaseId: string, tableId: string, rowId: string): Promise<{}> {
        if (typeof databaseId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "databaseId"');
        }

        if (typeof tableId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "tableId"');
        }

        if (typeof rowId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "rowId"');
        }

        const apiPath = '/databases/{databaseId}/tables/{tableId}/rows/{rowId}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{rowId}', rowId);
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('delete', uri, {
            'content-type': 'application/json',
        }, payload);
    }
};

import { Service } from '../service';
import { AppwriteException, Client } from '../client';
import type { Models } from '../models';
import type { UploadProgress, Payload } from '../client';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';


export class TablesDB extends Service {

     constructor(client: Client)
     {
        super(client);
     }

    /**
     * List transactions across all databases.
     *
     * @param {string[]} params.queries - Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries).
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    listTransactions(params?: { queries?: string[]  }): Promise<Models.TransactionList>;
    /**
     * List transactions across all databases.
     *
     * @param {string[]} queries - Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries).
     * @throws {AppwriteException}
     * @returns {Promise<Models.TransactionList>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    listTransactions(queries?: string[]): Promise<Models.TransactionList>;
    listTransactions(
        paramsOrFirst?: { queries?: string[] } | string[]    
    ): Promise<Models.TransactionList> {
        let params: { queries?: string[] };

        if (!paramsOrFirst || (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { queries?: string[] };
        } else {
            params = {
                queries: paramsOrFirst as string[]            
            };
        }

        const queries = params.queries;

        const apiPath = '/tablesdb/transactions';
        const payload: Payload = {};

        if (typeof queries !== 'undefined') {
            payload['queries'] = queries;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('get', uri, {
        }, payload);
    }

    /**
     * Create a new transaction.
     *
     * @param {number} params.ttl - Seconds before the transaction expires.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    createTransaction(params?: { ttl?: number  }): Promise<Models.Transaction>;
    /**
     * Create a new transaction.
     *
     * @param {number} ttl - Seconds before the transaction expires.
     * @throws {AppwriteException}
     * @returns {Promise<Models.Transaction>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    createTransaction(ttl?: number): Promise<Models.Transaction>;
    createTransaction(
        paramsOrFirst?: { ttl?: number } | number    
    ): Promise<Models.Transaction> {
        let params: { ttl?: number };

        if (!paramsOrFirst || (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { ttl?: number };
        } else {
            params = {
                ttl: paramsOrFirst as number            
            };
        }

        const ttl = params.ttl;

        const apiPath = '/tablesdb/transactions';
        const payload: Payload = {};

        if (typeof ttl !== 'undefined') {
            payload['ttl'] = ttl;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('post', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Get a transaction by its unique ID.
     *
     * @param {string} params.transactionId - Transaction ID.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    getTransaction(params: { transactionId: string  }): Promise<Models.Transaction>;
    /**
     * Get a transaction by its unique ID.
     *
     * @param {string} transactionId - Transaction ID.
     * @throws {AppwriteException}
     * @returns {Promise<Models.Transaction>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    getTransaction(transactionId: string): Promise<Models.Transaction>;
    getTransaction(
        paramsOrFirst: { transactionId: string } | string    
    ): Promise<Models.Transaction> {
        let params: { transactionId: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { transactionId: string };
        } else {
            params = {
                transactionId: paramsOrFirst as string            
            };
        }

        const transactionId = params.transactionId;

        if (typeof transactionId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "transactionId"');
        }

        const apiPath = '/tablesdb/transactions/{transactionId}'.replace('{transactionId}', transactionId);
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('get', uri, {
        }, payload);
    }

    /**
     * Update a transaction, to either commit or roll back its operations.
     *
     * @param {string} params.transactionId - Transaction ID.
     * @param {boolean} params.commit - Commit transaction?
     * @param {boolean} params.rollback - Rollback transaction?
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    updateTransaction(params: { transactionId: string, commit?: boolean, rollback?: boolean  }): Promise<Models.Transaction>;
    /**
     * Update a transaction, to either commit or roll back its operations.
     *
     * @param {string} transactionId - Transaction ID.
     * @param {boolean} commit - Commit transaction?
     * @param {boolean} rollback - Rollback transaction?
     * @throws {AppwriteException}
     * @returns {Promise<Models.Transaction>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    updateTransaction(transactionId: string, commit?: boolean, rollback?: boolean): Promise<Models.Transaction>;
    updateTransaction(
        paramsOrFirst: { transactionId: string, commit?: boolean, rollback?: boolean } | string,
        ...rest: [(boolean)?, (boolean)?]    
    ): Promise<Models.Transaction> {
        let params: { transactionId: string, commit?: boolean, rollback?: boolean };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { transactionId: string, commit?: boolean, rollback?: boolean };
        } else {
            params = {
                transactionId: paramsOrFirst as string,
                commit: rest[0] as boolean,
                rollback: rest[1] as boolean            
            };
        }

        const transactionId = params.transactionId;
        const commit = params.commit;
        const rollback = params.rollback;

        if (typeof transactionId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "transactionId"');
        }

        const apiPath = '/tablesdb/transactions/{transactionId}'.replace('{transactionId}', transactionId);
        const payload: Payload = {};

        if (typeof commit !== 'undefined') {
            payload['commit'] = commit;
        }

        if (typeof rollback !== 'undefined') {
            payload['rollback'] = rollback;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('patch', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Delete a transaction by its unique ID.
     *
     * @param {string} params.transactionId - Transaction ID.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    deleteTransaction(params: { transactionId: string  }): Promise<{}>;
    /**
     * Delete a transaction by its unique ID.
     *
     * @param {string} transactionId - Transaction ID.
     * @throws {AppwriteException}
     * @returns {Promise<{}>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    deleteTransaction(transactionId: string): Promise<{}>;
    deleteTransaction(
        paramsOrFirst: { transactionId: string } | string    
    ): Promise<{}> {
        let params: { transactionId: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { transactionId: string };
        } else {
            params = {
                transactionId: paramsOrFirst as string            
            };
        }

        const transactionId = params.transactionId;

        if (typeof transactionId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "transactionId"');
        }

        const apiPath = '/tablesdb/transactions/{transactionId}'.replace('{transactionId}', transactionId);
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('delete', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Create multiple operations in a single transaction.
     *
     * @param {string} params.transactionId - Transaction ID.
     * @param {object[]} params.operations - Array of staged operations.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    createOperations(params: { transactionId: string, operations?: object[]  }): Promise<Models.Transaction>;
    /**
     * Create multiple operations in a single transaction.
     *
     * @param {string} transactionId - Transaction ID.
     * @param {object[]} operations - Array of staged operations.
     * @throws {AppwriteException}
     * @returns {Promise<Models.Transaction>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    createOperations(transactionId: string, operations?: object[]): Promise<Models.Transaction>;
    createOperations(
        paramsOrFirst: { transactionId: string, operations?: object[] } | string,
        ...rest: [(object[])?]    
    ): Promise<Models.Transaction> {
        let params: { transactionId: string, operations?: object[] };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { transactionId: string, operations?: object[] };
        } else {
            params = {
                transactionId: paramsOrFirst as string,
                operations: rest[0] as object[]            
            };
        }

        const transactionId = params.transactionId;
        const operations = params.operations;

        if (typeof transactionId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "transactionId"');
        }

        const apiPath = '/tablesdb/transactions/{transactionId}/operations'.replace('{transactionId}', transactionId);
        const payload: Payload = {};

        if (typeof operations !== 'undefined') {
            payload['operations'] = operations;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('post', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Get a list of all the user's rows in a given table. You can use the query params to filter your results.
     *
     * @param {string} params.databaseId - Database ID.
     * @param {string} params.tableId - Table ID. You can create a new table using the TablesDB service [server integration](https://appwrite.io/docs/products/databases/tables#create-table).
     * @param {string[]} params.queries - Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.
     * @param {string} params.transactionId - Transaction ID to read uncommitted changes within the transaction.
     * @param {boolean} params.total - When set to false, the total count returned will be 0 and will not be calculated.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    listRows<Row extends Models.Row = Models.DefaultRow>(params: { databaseId: string, tableId: string, queries?: string[], transactionId?: string, total?: boolean  }): Promise<Models.RowList<Row>>;
    /**
     * Get a list of all the user's rows in a given table. You can use the query params to filter your results.
     *
     * @param {string} databaseId - Database ID.
     * @param {string} tableId - Table ID. You can create a new table using the TablesDB service [server integration](https://appwrite.io/docs/products/databases/tables#create-table).
     * @param {string[]} queries - Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.
     * @param {string} transactionId - Transaction ID to read uncommitted changes within the transaction.
     * @param {boolean} total - When set to false, the total count returned will be 0 and will not be calculated.
     * @throws {AppwriteException}
     * @returns {Promise<Models.RowList<Row>>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    listRows<Row extends Models.Row = Models.DefaultRow>(databaseId: string, tableId: string, queries?: string[], transactionId?: string, total?: boolean): Promise<Models.RowList<Row>>;
    listRows<Row extends Models.Row = Models.DefaultRow>(
        paramsOrFirst: { databaseId: string, tableId: string, queries?: string[], transactionId?: string, total?: boolean } | string,
        ...rest: [(string)?, (string[])?, (string)?, (boolean)?]    
    ): Promise<Models.RowList<Row>> {
        let params: { databaseId: string, tableId: string, queries?: string[], transactionId?: string, total?: boolean };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { databaseId: string, tableId: string, queries?: string[], transactionId?: string, total?: boolean };
        } else {
            params = {
                databaseId: paramsOrFirst as string,
                tableId: rest[0] as string,
                queries: rest[1] as string[],
                transactionId: rest[2] as string,
                total: rest[3] as boolean            
            };
        }

        const databaseId = params.databaseId;
        const tableId = params.tableId;
        const queries = params.queries;
        const transactionId = params.transactionId;
        const total = params.total;

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

        if (typeof transactionId !== 'undefined') {
            payload['transactionId'] = transactionId;
        }

        if (typeof total !== 'undefined') {
            payload['total'] = total;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('get', uri, {
        }, payload);
    }

    /**
     * Create a new Row. Before using this route, you should create a new table resource using either a [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable) API or directly from your database console.
     *
     * @param {string} params.databaseId - Database ID.
     * @param {string} params.tableId - Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable). Make sure to define columns before creating rows.
     * @param {string} params.rowId - Row ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.
     * @param {Row extends Models.DefaultRow ? Partial<Models.Row> & Record<string, any> : Partial<Models.Row> & Omit<Row, keyof Models.Row>} params.data - Row data as JSON object.
     * @param {string[]} params.permissions - An array of permissions strings. By default, only the current user is granted all permissions. [Learn more about permissions](https://appwrite.io/docs/permissions).
     * @param {string} params.transactionId - Transaction ID for staging the operation.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    createRow<Row extends Models.Row = Models.DefaultRow>(params: { databaseId: string, tableId: string, rowId: string, data: Row extends Models.DefaultRow ? Partial<Models.Row> & Record<string, any> : Partial<Models.Row> & Omit<Row, keyof Models.Row>, permissions?: string[], transactionId?: string  }): Promise<Row>;
    /**
     * Create a new Row. Before using this route, you should create a new table resource using either a [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable) API or directly from your database console.
     *
     * @param {string} databaseId - Database ID.
     * @param {string} tableId - Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable). Make sure to define columns before creating rows.
     * @param {string} rowId - Row ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.
     * @param {Row extends Models.DefaultRow ? Partial<Models.Row> & Record<string, any> : Partial<Models.Row> & Omit<Row, keyof Models.Row>} data - Row data as JSON object.
     * @param {string[]} permissions - An array of permissions strings. By default, only the current user is granted all permissions. [Learn more about permissions](https://appwrite.io/docs/permissions).
     * @param {string} transactionId - Transaction ID for staging the operation.
     * @throws {AppwriteException}
     * @returns {Promise<Row>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    createRow<Row extends Models.Row = Models.DefaultRow>(databaseId: string, tableId: string, rowId: string, data: Row extends Models.DefaultRow ? Partial<Models.Row> & Record<string, any> : Partial<Models.Row> & Omit<Row, keyof Models.Row>, permissions?: string[], transactionId?: string): Promise<Row>;
    createRow<Row extends Models.Row = Models.DefaultRow>(
        paramsOrFirst: { databaseId: string, tableId: string, rowId: string, data: Row extends Models.DefaultRow ? Partial<Models.Row> & Record<string, any> : Partial<Models.Row> & Omit<Row, keyof Models.Row>, permissions?: string[], transactionId?: string } | string,
        ...rest: [(string)?, (string)?, (Row extends Models.DefaultRow ? Partial<Models.Row> & Record<string, any> : Partial<Models.Row> & Omit<Row, keyof Models.Row>)?, (string[])?, (string)?]    
    ): Promise<Row> {
        let params: { databaseId: string, tableId: string, rowId: string, data: Row extends Models.DefaultRow ? Partial<Models.Row> & Record<string, any> : Partial<Models.Row> & Omit<Row, keyof Models.Row>, permissions?: string[], transactionId?: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { databaseId: string, tableId: string, rowId: string, data: Row extends Models.DefaultRow ? Partial<Models.Row> & Record<string, any> : Partial<Models.Row> & Omit<Row, keyof Models.Row>, permissions?: string[], transactionId?: string };
        } else {
            params = {
                databaseId: paramsOrFirst as string,
                tableId: rest[0] as string,
                rowId: rest[1] as string,
                data: rest[2] as Row extends Models.DefaultRow ? Partial<Models.Row> & Record<string, any> : Partial<Models.Row> & Omit<Row, keyof Models.Row>,
                permissions: rest[3] as string[],
                transactionId: rest[4] as string            
            };
        }

        const databaseId = params.databaseId;
        const tableId = params.tableId;
        const rowId = params.rowId;
        const data = params.data;
        const permissions = params.permissions;
        const transactionId = params.transactionId;

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

        if (typeof transactionId !== 'undefined') {
            payload['transactionId'] = transactionId;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('post', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Get a row by its unique ID. This endpoint response returns a JSON object with the row data.
     *
     * @param {string} params.databaseId - Database ID.
     * @param {string} params.tableId - Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).
     * @param {string} params.rowId - Row ID.
     * @param {string[]} params.queries - Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.
     * @param {string} params.transactionId - Transaction ID to read uncommitted changes within the transaction.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    getRow<Row extends Models.Row = Models.DefaultRow>(params: { databaseId: string, tableId: string, rowId: string, queries?: string[], transactionId?: string  }): Promise<Row>;
    /**
     * Get a row by its unique ID. This endpoint response returns a JSON object with the row data.
     *
     * @param {string} databaseId - Database ID.
     * @param {string} tableId - Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).
     * @param {string} rowId - Row ID.
     * @param {string[]} queries - Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.
     * @param {string} transactionId - Transaction ID to read uncommitted changes within the transaction.
     * @throws {AppwriteException}
     * @returns {Promise<Row>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    getRow<Row extends Models.Row = Models.DefaultRow>(databaseId: string, tableId: string, rowId: string, queries?: string[], transactionId?: string): Promise<Row>;
    getRow<Row extends Models.Row = Models.DefaultRow>(
        paramsOrFirst: { databaseId: string, tableId: string, rowId: string, queries?: string[], transactionId?: string } | string,
        ...rest: [(string)?, (string)?, (string[])?, (string)?]    
    ): Promise<Row> {
        let params: { databaseId: string, tableId: string, rowId: string, queries?: string[], transactionId?: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { databaseId: string, tableId: string, rowId: string, queries?: string[], transactionId?: string };
        } else {
            params = {
                databaseId: paramsOrFirst as string,
                tableId: rest[0] as string,
                rowId: rest[1] as string,
                queries: rest[2] as string[],
                transactionId: rest[3] as string            
            };
        }

        const databaseId = params.databaseId;
        const tableId = params.tableId;
        const rowId = params.rowId;
        const queries = params.queries;
        const transactionId = params.transactionId;

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

        if (typeof transactionId !== 'undefined') {
            payload['transactionId'] = transactionId;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('get', uri, {
        }, payload);
    }

    /**
     * Create or update a Row. Before using this route, you should create a new table resource using either a [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable) API or directly from your database console.
     *
     * @param {string} params.databaseId - Database ID.
     * @param {string} params.tableId - Table ID.
     * @param {string} params.rowId - Row ID.
     * @param {Row extends Models.DefaultRow ? Partial<Models.Row> & Record<string, any> : Partial<Models.Row> & Partial<Omit<Row, keyof Models.Row>>} params.data - Row data as JSON object. Include all required columns of the row to be created or updated.
     * @param {string[]} params.permissions - An array of permissions strings. By default, the current permissions are inherited. [Learn more about permissions](https://appwrite.io/docs/permissions).
     * @param {string} params.transactionId - Transaction ID for staging the operation.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    upsertRow<Row extends Models.Row = Models.DefaultRow>(params: { databaseId: string, tableId: string, rowId: string, data?: Row extends Models.DefaultRow ? Partial<Models.Row> & Record<string, any> : Partial<Models.Row> & Partial<Omit<Row, keyof Models.Row>>, permissions?: string[], transactionId?: string  }): Promise<Row>;
    /**
     * Create or update a Row. Before using this route, you should create a new table resource using either a [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable) API or directly from your database console.
     *
     * @param {string} databaseId - Database ID.
     * @param {string} tableId - Table ID.
     * @param {string} rowId - Row ID.
     * @param {Row extends Models.DefaultRow ? Partial<Models.Row> & Record<string, any> : Partial<Models.Row> & Partial<Omit<Row, keyof Models.Row>>} data - Row data as JSON object. Include all required columns of the row to be created or updated.
     * @param {string[]} permissions - An array of permissions strings. By default, the current permissions are inherited. [Learn more about permissions](https://appwrite.io/docs/permissions).
     * @param {string} transactionId - Transaction ID for staging the operation.
     * @throws {AppwriteException}
     * @returns {Promise<Row>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    upsertRow<Row extends Models.Row = Models.DefaultRow>(databaseId: string, tableId: string, rowId: string, data?: Row extends Models.DefaultRow ? Partial<Models.Row> & Record<string, any> : Partial<Models.Row> & Partial<Omit<Row, keyof Models.Row>>, permissions?: string[], transactionId?: string): Promise<Row>;
    upsertRow<Row extends Models.Row = Models.DefaultRow>(
        paramsOrFirst: { databaseId: string, tableId: string, rowId: string, data?: Row extends Models.DefaultRow ? Partial<Models.Row> & Record<string, any> : Partial<Models.Row> & Partial<Omit<Row, keyof Models.Row>>, permissions?: string[], transactionId?: string } | string,
        ...rest: [(string)?, (string)?, (Row extends Models.DefaultRow ? Partial<Models.Row> & Record<string, any> : Partial<Models.Row> & Partial<Omit<Row, keyof Models.Row>>)?, (string[])?, (string)?]    
    ): Promise<Row> {
        let params: { databaseId: string, tableId: string, rowId: string, data?: Row extends Models.DefaultRow ? Partial<Models.Row> & Record<string, any> : Partial<Models.Row> & Partial<Omit<Row, keyof Models.Row>>, permissions?: string[], transactionId?: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { databaseId: string, tableId: string, rowId: string, data?: Row extends Models.DefaultRow ? Partial<Models.Row> & Record<string, any> : Partial<Models.Row> & Partial<Omit<Row, keyof Models.Row>>, permissions?: string[], transactionId?: string };
        } else {
            params = {
                databaseId: paramsOrFirst as string,
                tableId: rest[0] as string,
                rowId: rest[1] as string,
                data: rest[2] as Row extends Models.DefaultRow ? Partial<Models.Row> & Record<string, any> : Partial<Models.Row> & Partial<Omit<Row, keyof Models.Row>>,
                permissions: rest[3] as string[],
                transactionId: rest[4] as string            
            };
        }

        const databaseId = params.databaseId;
        const tableId = params.tableId;
        const rowId = params.rowId;
        const data = params.data;
        const permissions = params.permissions;
        const transactionId = params.transactionId;

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

        if (typeof transactionId !== 'undefined') {
            payload['transactionId'] = transactionId;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('put', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Update a row by its unique ID. Using the patch method you can pass only specific fields that will get updated.
     *
     * @param {string} params.databaseId - Database ID.
     * @param {string} params.tableId - Table ID.
     * @param {string} params.rowId - Row ID.
     * @param {Row extends Models.DefaultRow ? Partial<Models.Row> & Record<string, any> : Partial<Models.Row> & Partial<Omit<Row, keyof Models.Row>>} params.data - Row data as JSON object. Include only columns and value pairs to be updated.
     * @param {string[]} params.permissions - An array of permissions strings. By default, the current permissions are inherited. [Learn more about permissions](https://appwrite.io/docs/permissions).
     * @param {string} params.transactionId - Transaction ID for staging the operation.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    updateRow<Row extends Models.Row = Models.DefaultRow>(params: { databaseId: string, tableId: string, rowId: string, data?: Row extends Models.DefaultRow ? Partial<Models.Row> & Record<string, any> : Partial<Models.Row> & Partial<Omit<Row, keyof Models.Row>>, permissions?: string[], transactionId?: string  }): Promise<Row>;
    /**
     * Update a row by its unique ID. Using the patch method you can pass only specific fields that will get updated.
     *
     * @param {string} databaseId - Database ID.
     * @param {string} tableId - Table ID.
     * @param {string} rowId - Row ID.
     * @param {Row extends Models.DefaultRow ? Partial<Models.Row> & Record<string, any> : Partial<Models.Row> & Partial<Omit<Row, keyof Models.Row>>} data - Row data as JSON object. Include only columns and value pairs to be updated.
     * @param {string[]} permissions - An array of permissions strings. By default, the current permissions are inherited. [Learn more about permissions](https://appwrite.io/docs/permissions).
     * @param {string} transactionId - Transaction ID for staging the operation.
     * @throws {AppwriteException}
     * @returns {Promise<Row>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    updateRow<Row extends Models.Row = Models.DefaultRow>(databaseId: string, tableId: string, rowId: string, data?: Row extends Models.DefaultRow ? Partial<Models.Row> & Record<string, any> : Partial<Models.Row> & Partial<Omit<Row, keyof Models.Row>>, permissions?: string[], transactionId?: string): Promise<Row>;
    updateRow<Row extends Models.Row = Models.DefaultRow>(
        paramsOrFirst: { databaseId: string, tableId: string, rowId: string, data?: Row extends Models.DefaultRow ? Partial<Models.Row> & Record<string, any> : Partial<Models.Row> & Partial<Omit<Row, keyof Models.Row>>, permissions?: string[], transactionId?: string } | string,
        ...rest: [(string)?, (string)?, (Row extends Models.DefaultRow ? Partial<Models.Row> & Record<string, any> : Partial<Models.Row> & Partial<Omit<Row, keyof Models.Row>>)?, (string[])?, (string)?]    
    ): Promise<Row> {
        let params: { databaseId: string, tableId: string, rowId: string, data?: Row extends Models.DefaultRow ? Partial<Models.Row> & Record<string, any> : Partial<Models.Row> & Partial<Omit<Row, keyof Models.Row>>, permissions?: string[], transactionId?: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { databaseId: string, tableId: string, rowId: string, data?: Row extends Models.DefaultRow ? Partial<Models.Row> & Record<string, any> : Partial<Models.Row> & Partial<Omit<Row, keyof Models.Row>>, permissions?: string[], transactionId?: string };
        } else {
            params = {
                databaseId: paramsOrFirst as string,
                tableId: rest[0] as string,
                rowId: rest[1] as string,
                data: rest[2] as Row extends Models.DefaultRow ? Partial<Models.Row> & Record<string, any> : Partial<Models.Row> & Partial<Omit<Row, keyof Models.Row>>,
                permissions: rest[3] as string[],
                transactionId: rest[4] as string            
            };
        }

        const databaseId = params.databaseId;
        const tableId = params.tableId;
        const rowId = params.rowId;
        const data = params.data;
        const permissions = params.permissions;
        const transactionId = params.transactionId;

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

        if (typeof transactionId !== 'undefined') {
            payload['transactionId'] = transactionId;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('patch', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Delete a row by its unique ID.
     *
     * @param {string} params.databaseId - Database ID.
     * @param {string} params.tableId - Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).
     * @param {string} params.rowId - Row ID.
     * @param {string} params.transactionId - Transaction ID for staging the operation.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    deleteRow(params: { databaseId: string, tableId: string, rowId: string, transactionId?: string  }): Promise<{}>;
    /**
     * Delete a row by its unique ID.
     *
     * @param {string} databaseId - Database ID.
     * @param {string} tableId - Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).
     * @param {string} rowId - Row ID.
     * @param {string} transactionId - Transaction ID for staging the operation.
     * @throws {AppwriteException}
     * @returns {Promise<{}>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    deleteRow(databaseId: string, tableId: string, rowId: string, transactionId?: string): Promise<{}>;
    deleteRow(
        paramsOrFirst: { databaseId: string, tableId: string, rowId: string, transactionId?: string } | string,
        ...rest: [(string)?, (string)?, (string)?]    
    ): Promise<{}> {
        let params: { databaseId: string, tableId: string, rowId: string, transactionId?: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { databaseId: string, tableId: string, rowId: string, transactionId?: string };
        } else {
            params = {
                databaseId: paramsOrFirst as string,
                tableId: rest[0] as string,
                rowId: rest[1] as string,
                transactionId: rest[2] as string            
            };
        }

        const databaseId = params.databaseId;
        const tableId = params.tableId;
        const rowId = params.rowId;
        const transactionId = params.transactionId;

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

        if (typeof transactionId !== 'undefined') {
            payload['transactionId'] = transactionId;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('delete', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Decrement a specific column of a row by a given value.
     *
     * @param {string} params.databaseId - Database ID.
     * @param {string} params.tableId - Table ID.
     * @param {string} params.rowId - Row ID.
     * @param {string} params.column - Column key.
     * @param {number} params.value - Value to increment the column by. The value must be a number.
     * @param {number} params.min - Minimum value for the column. If the current value is lesser than this value, an exception will be thrown.
     * @param {string} params.transactionId - Transaction ID for staging the operation.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    decrementRowColumn<Row extends Models.Row = Models.DefaultRow>(params: { databaseId: string, tableId: string, rowId: string, column: string, value?: number, min?: number, transactionId?: string  }): Promise<Row>;
    /**
     * Decrement a specific column of a row by a given value.
     *
     * @param {string} databaseId - Database ID.
     * @param {string} tableId - Table ID.
     * @param {string} rowId - Row ID.
     * @param {string} column - Column key.
     * @param {number} value - Value to increment the column by. The value must be a number.
     * @param {number} min - Minimum value for the column. If the current value is lesser than this value, an exception will be thrown.
     * @param {string} transactionId - Transaction ID for staging the operation.
     * @throws {AppwriteException}
     * @returns {Promise<Row>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    decrementRowColumn<Row extends Models.Row = Models.DefaultRow>(databaseId: string, tableId: string, rowId: string, column: string, value?: number, min?: number, transactionId?: string): Promise<Row>;
    decrementRowColumn<Row extends Models.Row = Models.DefaultRow>(
        paramsOrFirst: { databaseId: string, tableId: string, rowId: string, column: string, value?: number, min?: number, transactionId?: string } | string,
        ...rest: [(string)?, (string)?, (string)?, (number)?, (number)?, (string)?]    
    ): Promise<Row> {
        let params: { databaseId: string, tableId: string, rowId: string, column: string, value?: number, min?: number, transactionId?: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { databaseId: string, tableId: string, rowId: string, column: string, value?: number, min?: number, transactionId?: string };
        } else {
            params = {
                databaseId: paramsOrFirst as string,
                tableId: rest[0] as string,
                rowId: rest[1] as string,
                column: rest[2] as string,
                value: rest[3] as number,
                min: rest[4] as number,
                transactionId: rest[5] as string            
            };
        }

        const databaseId = params.databaseId;
        const tableId = params.tableId;
        const rowId = params.rowId;
        const column = params.column;
        const value = params.value;
        const min = params.min;
        const transactionId = params.transactionId;

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

        if (typeof transactionId !== 'undefined') {
            payload['transactionId'] = transactionId;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('patch', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Increment a specific column of a row by a given value.
     *
     * @param {string} params.databaseId - Database ID.
     * @param {string} params.tableId - Table ID.
     * @param {string} params.rowId - Row ID.
     * @param {string} params.column - Column key.
     * @param {number} params.value - Value to increment the column by. The value must be a number.
     * @param {number} params.max - Maximum value for the column. If the current value is greater than this value, an error will be thrown.
     * @param {string} params.transactionId - Transaction ID for staging the operation.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    incrementRowColumn<Row extends Models.Row = Models.DefaultRow>(params: { databaseId: string, tableId: string, rowId: string, column: string, value?: number, max?: number, transactionId?: string  }): Promise<Row>;
    /**
     * Increment a specific column of a row by a given value.
     *
     * @param {string} databaseId - Database ID.
     * @param {string} tableId - Table ID.
     * @param {string} rowId - Row ID.
     * @param {string} column - Column key.
     * @param {number} value - Value to increment the column by. The value must be a number.
     * @param {number} max - Maximum value for the column. If the current value is greater than this value, an error will be thrown.
     * @param {string} transactionId - Transaction ID for staging the operation.
     * @throws {AppwriteException}
     * @returns {Promise<Row>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    incrementRowColumn<Row extends Models.Row = Models.DefaultRow>(databaseId: string, tableId: string, rowId: string, column: string, value?: number, max?: number, transactionId?: string): Promise<Row>;
    incrementRowColumn<Row extends Models.Row = Models.DefaultRow>(
        paramsOrFirst: { databaseId: string, tableId: string, rowId: string, column: string, value?: number, max?: number, transactionId?: string } | string,
        ...rest: [(string)?, (string)?, (string)?, (number)?, (number)?, (string)?]    
    ): Promise<Row> {
        let params: { databaseId: string, tableId: string, rowId: string, column: string, value?: number, max?: number, transactionId?: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { databaseId: string, tableId: string, rowId: string, column: string, value?: number, max?: number, transactionId?: string };
        } else {
            params = {
                databaseId: paramsOrFirst as string,
                tableId: rest[0] as string,
                rowId: rest[1] as string,
                column: rest[2] as string,
                value: rest[3] as number,
                max: rest[4] as number,
                transactionId: rest[5] as string            
            };
        }

        const databaseId = params.databaseId;
        const tableId = params.tableId;
        const rowId = params.rowId;
        const column = params.column;
        const value = params.value;
        const max = params.max;
        const transactionId = params.transactionId;

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

        if (typeof transactionId !== 'undefined') {
            payload['transactionId'] = transactionId;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('patch', uri, {
            'content-type': 'application/json',
        }, payload);
    }
};

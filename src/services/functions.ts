import { Service } from '../service';
import { AppwriteException, Client } from '../client';
import type { Models } from '../models';
import type { UploadProgress, Payload } from '../client';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

import { ExecutionMethod } from '../enums/execution-method';

export class Functions extends Service {

     constructor(client: Client)
     {
        super(client);
     }

    /**
     * Get a list of all the current user function execution logs. You can use the
     * query params to filter your results.
     *
     * @param {string} functionId
     * @param {string[]} queries
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    listExecutions(functionId: string, queries?: string[]): Promise<Models.ExecutionList> {
        if (typeof functionId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "functionId"');
        }

        const apiPath = '/functions/{functionId}/executions'.replace('{functionId}', functionId);
        const payload: Payload = {};

        if (typeof queries !== 'undefined') {
            payload['queries'] = queries;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('get', uri, {
        }, payload);
    }

    /**
     * Trigger a function execution. The returned object will return you the
     * current execution status. You can ping the `Get Execution` endpoint to get
     * updates on the current execution status. Once this endpoint is called, your
     * function execution process will start asynchronously.
     *
     * @param {string} functionId
     * @param {string} body
     * @param {boolean} async
     * @param {string} xpath
     * @param {ExecutionMethod} method
     * @param {object} headers
     * @param {string} scheduledAt
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    createExecution(functionId: string, body?: string, async?: boolean, xpath?: string, method?: ExecutionMethod, headers?: object, scheduledAt?: string): Promise<Models.Execution> {
        if (typeof functionId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "functionId"');
        }

        const apiPath = '/functions/{functionId}/executions'.replace('{functionId}', functionId);
        const payload: Payload = {};

        if (typeof body !== 'undefined') {
            payload['body'] = body;
        }

        if (typeof async !== 'undefined') {
            payload['async'] = async;
        }

        if (typeof xpath !== 'undefined') {
            payload['path'] = xpath;
        }

        if (typeof method !== 'undefined') {
            payload['method'] = method;
        }

        if (typeof headers !== 'undefined') {
            payload['headers'] = headers;
        }

        if (typeof scheduledAt !== 'undefined') {
            payload['scheduledAt'] = scheduledAt;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('post', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Get a function execution log by its unique ID.
     *
     * @param {string} functionId
     * @param {string} executionId
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    getExecution(functionId: string, executionId: string): Promise<Models.Execution> {
        if (typeof functionId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "functionId"');
        }

        if (typeof executionId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "executionId"');
        }

        const apiPath = '/functions/{functionId}/executions/{executionId}'.replace('{functionId}', functionId).replace('{executionId}', executionId);
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('get', uri, {
        }, payload);
    }
};

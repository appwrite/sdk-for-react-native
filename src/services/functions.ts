import { Service } from '../service';
import { AppwriteException, Client } from '../client';
import { Payload } from '../payload';
import type { Models } from '../models';
import type { UploadProgress, Params } from '../client';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

                            import { ExecutionMethod } from '../enums/execution-method';

export class Functions extends Service {

     constructor(client: Client)
     {
        super(client);
     }

    /**
     * List executions
     *
     * Get a list of all the current user function execution logs. You can use the query params to filter your results.
     *
     * @param {string} functionId
     * @param {string[]} queries
     * @param {string} search
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async listExecutions(functionId: string,queries?: string[],search?: string): Promise<Models.ExecutionList> {
        if (typeof functionId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "functionId"');
        }

        const apiPath = '/functions/{functionId}/executions'.replace('{functionId}', functionId);
        const params: Params = {};

        if (typeof queries !== 'undefined') {
            params['queries'] = queries;
        }

        if (typeof search !== 'undefined') {
            params['search'] = search;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);

        const apiHeaders: { [header: string]: string } = {
            'content-type': 'application/json',
        }

        return await this.client.call('get', uri, apiHeaders, params);
    }

    /**
     * Create execution
     *
     * Trigger a function execution. The returned object will return you the current execution status. You can ping the `Get Execution` endpoint to get updates on the current execution status. Once this endpoint is called, your function execution process will start asynchronously.
     *
     * @param {string} functionId
     * @param {Payload} body
     * @param {boolean} async
     * @param {string} xpath
     * @param {ExecutionMethod} method
     * @param {object} headers
     * @param {string} scheduledAt
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async createExecution(functionId: string,body?: Payload,async?: boolean,xpath?: string,method?: ExecutionMethod,headers?: object,scheduledAt?: string, onProgress = (progress: UploadProgress) => {}): Promise<Models.Execution> {
        if (typeof functionId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "functionId"');
        }

        const apiPath = '/functions/{functionId}/executions'.replace('{functionId}', functionId);
        const params: Params = {};

        if (typeof body !== 'undefined') {
            params['body'] = body;
        }

        if (typeof async !== 'undefined') {
            params['async'] = async;
        }

        if (typeof xpath !== 'undefined') {
            params['path'] = xpath;
        }

        if (typeof method !== 'undefined') {
            params['method'] = method;
        }

        if (typeof headers !== 'undefined') {
            params['headers'] = headers;
        }

        if (typeof scheduledAt !== 'undefined') {
            params['scheduledAt'] = scheduledAt;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);

        const apiHeaders: { [header: string]: string } = {
            'content-type': 'multipart/form-data',
        }

        return await this.client.call('post', uri, apiHeaders, params);
    }

    /**
     * Get execution
     *
     * Get a function execution log by its unique ID.
     *
     * @param {string} functionId
     * @param {string} executionId
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async getExecution(functionId: string,executionId: string): Promise<Models.Execution> {
        if (typeof functionId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "functionId"');
        }

        if (typeof executionId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "executionId"');
        }

        const apiPath = '/functions/{functionId}/executions/{executionId}'.replace('{functionId}', functionId).replace('{executionId}', executionId);
        const params: Params = {};

        const uri = new URL(this.client.config.endpoint + apiPath);

        const apiHeaders: { [header: string]: string } = {
            'content-type': 'application/json',
        }

        return await this.client.call('get', uri, apiHeaders, params);
    }
};

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
     * Get a list of all the current user function execution logs. You can use the query params to filter your results.
     *
     * @param {string} params.functionId - Function ID.
     * @param {string[]} params.queries - Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: trigger, status, responseStatusCode, duration, requestMethod, requestPath, deploymentId
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    listExecutions(params: { functionId: string, queries?: string[]  }): Promise<Models.ExecutionList>;
    /**
     * Get a list of all the current user function execution logs. You can use the query params to filter your results.
     *
     * @param {string} functionId - Function ID.
     * @param {string[]} queries - Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: trigger, status, responseStatusCode, duration, requestMethod, requestPath, deploymentId
     * @throws {AppwriteException}
     * @returns {Promise<Models.ExecutionList>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    listExecutions(functionId: string, queries?: string[]): Promise<Models.ExecutionList>;
    listExecutions(
        paramsOrFirst: { functionId: string, queries?: string[] } | string,
        ...rest: [(string[])?]    
    ): Promise<Models.ExecutionList> {
        let params: { functionId: string, queries?: string[] };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { functionId: string, queries?: string[] };
        } else {
            params = {
                functionId: paramsOrFirst as string,
                queries: rest[0] as string[]            
            };
        }

        const functionId = params.functionId;
        const queries = params.queries;

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
     * Trigger a function execution. The returned object will return you the current execution status. You can ping the `Get Execution` endpoint to get updates on the current execution status. Once this endpoint is called, your function execution process will start asynchronously.
     *
     * @param {string} params.functionId - Function ID.
     * @param {string} params.body - HTTP body of execution. Default value is empty string.
     * @param {boolean} params.async - Execute code in the background. Default value is false.
     * @param {string} params.xpath - HTTP path of execution. Path can include query params. Default value is /
     * @param {ExecutionMethod} params.method - HTTP method of execution. Default value is GET.
     * @param {object} params.headers - HTTP headers of execution. Defaults to empty.
     * @param {string} params.scheduledAt - Scheduled execution time in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. DateTime value must be in future with precision in minutes.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    createExecution(params: { functionId: string, body?: string, async?: boolean, xpath?: string, method?: ExecutionMethod, headers?: object, scheduledAt?: string  }): Promise<Models.Execution>;
    /**
     * Trigger a function execution. The returned object will return you the current execution status. You can ping the `Get Execution` endpoint to get updates on the current execution status. Once this endpoint is called, your function execution process will start asynchronously.
     *
     * @param {string} functionId - Function ID.
     * @param {string} body - HTTP body of execution. Default value is empty string.
     * @param {boolean} async - Execute code in the background. Default value is false.
     * @param {string} xpath - HTTP path of execution. Path can include query params. Default value is /
     * @param {ExecutionMethod} method - HTTP method of execution. Default value is GET.
     * @param {object} headers - HTTP headers of execution. Defaults to empty.
     * @param {string} scheduledAt - Scheduled execution time in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. DateTime value must be in future with precision in minutes.
     * @throws {AppwriteException}
     * @returns {Promise<Models.Execution>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    createExecution(functionId: string, body?: string, async?: boolean, xpath?: string, method?: ExecutionMethod, headers?: object, scheduledAt?: string): Promise<Models.Execution>;
    createExecution(
        paramsOrFirst: { functionId: string, body?: string, async?: boolean, xpath?: string, method?: ExecutionMethod, headers?: object, scheduledAt?: string } | string,
        ...rest: [(string)?, (boolean)?, (string)?, (ExecutionMethod)?, (object)?, (string)?]    
    ): Promise<Models.Execution> {
        let params: { functionId: string, body?: string, async?: boolean, xpath?: string, method?: ExecutionMethod, headers?: object, scheduledAt?: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { functionId: string, body?: string, async?: boolean, xpath?: string, method?: ExecutionMethod, headers?: object, scheduledAt?: string };
        } else {
            params = {
                functionId: paramsOrFirst as string,
                body: rest[0] as string,
                async: rest[1] as boolean,
                xpath: rest[2] as string,
                method: rest[3] as ExecutionMethod,
                headers: rest[4] as object,
                scheduledAt: rest[5] as string            
            };
        }

        const functionId = params.functionId;
        const body = params.body;
        const async = params.async;
        const xpath = params.xpath;
        const method = params.method;
        const headers = params.headers;
        const scheduledAt = params.scheduledAt;

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
     * @param {string} params.functionId - Function ID.
     * @param {string} params.executionId - Execution ID.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    getExecution(params: { functionId: string, executionId: string  }): Promise<Models.Execution>;
    /**
     * Get a function execution log by its unique ID.
     *
     * @param {string} functionId - Function ID.
     * @param {string} executionId - Execution ID.
     * @throws {AppwriteException}
     * @returns {Promise<Models.Execution>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    getExecution(functionId: string, executionId: string): Promise<Models.Execution>;
    getExecution(
        paramsOrFirst: { functionId: string, executionId: string } | string,
        ...rest: [(string)?]    
    ): Promise<Models.Execution> {
        let params: { functionId: string, executionId: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { functionId: string, executionId: string };
        } else {
            params = {
                functionId: paramsOrFirst as string,
                executionId: rest[0] as string            
            };
        }

        const functionId = params.functionId;
        const executionId = params.executionId;

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

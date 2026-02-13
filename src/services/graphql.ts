import { Service } from '../service';
import { AppwriteException, Client } from '../client';
import type { Models } from '../models';
import type { UploadProgress, Payload } from '../client';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';


export class Graphql extends Service {

     constructor(client: Client)
     {
        super(client);
     }

    /**
     * Execute a GraphQL mutation.
     *
     * @param {object} params.query - The query or queries to execute.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    query(params: { query: object  }): Promise<{}>;
    /**
     * Execute a GraphQL mutation.
     *
     * @param {object} query - The query or queries to execute.
     * @throws {AppwriteException}
     * @returns {Promise<{}>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    query(query: object): Promise<{}>;
    query(
        paramsOrFirst: { query: object } | object    
    ): Promise<{}> {
        let params: { query: object };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst) && ('query' in paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { query: object };
        } else {
            params = {
                query: paramsOrFirst as object            
            };
        }

        const query = params.query;

        if (typeof query === 'undefined') {
            throw new AppwriteException('Missing required parameter: "query"');
        }

        const apiPath = '/graphql';
        const payload: Payload = {};

        if (typeof query !== 'undefined') {
            payload['query'] = query;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('post', uri, {
            'x-sdk-graphql': 'true',
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Execute a GraphQL mutation.
     *
     * @param {object} params.query - The query or queries to execute.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    mutation(params: { query: object  }): Promise<{}>;
    /**
     * Execute a GraphQL mutation.
     *
     * @param {object} query - The query or queries to execute.
     * @throws {AppwriteException}
     * @returns {Promise<{}>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    mutation(query: object): Promise<{}>;
    mutation(
        paramsOrFirst: { query: object } | object    
    ): Promise<{}> {
        let params: { query: object };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst) && ('query' in paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { query: object };
        } else {
            params = {
                query: paramsOrFirst as object            
            };
        }

        const query = params.query;

        if (typeof query === 'undefined') {
            throw new AppwriteException('Missing required parameter: "query"');
        }

        const apiPath = '/graphql/mutation';
        const payload: Payload = {};

        if (typeof query !== 'undefined') {
            payload['query'] = query;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('post', uri, {
            'x-sdk-graphql': 'true',
            'content-type': 'application/json',
        }, payload);
    }
};

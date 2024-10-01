import { Service } from '../service';
import { AppwriteException, Client } from '../client';
import { Payload } from '../payload';
import type { Models } from '../models';
import type { UploadProgress, Params } from '../client';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';


export class Graphql extends Service {

     constructor(client: Client)
     {
        super(client);
     }

    /**
     * GraphQL endpoint
     *
     * Execute a GraphQL mutation.
     *
     * @param {object} query
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async query(query: object): Promise<{}> {
        if (typeof query === 'undefined') {
            throw new AppwriteException('Missing required parameter: "query"');
        }

        const apiPath = '/graphql';
        const params: Params = {};

        if (typeof query !== 'undefined') {
            params['query'] = query;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);

        const apiHeaders: { [header: string]: string } = {
            'x-sdk-graphql': 'true',
            'content-type': 'application/json',
        }

        return await this.client.call('post', uri, apiHeaders, params);
    }

    /**
     * GraphQL endpoint
     *
     * Execute a GraphQL mutation.
     *
     * @param {object} query
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async mutation(query: object): Promise<{}> {
        if (typeof query === 'undefined') {
            throw new AppwriteException('Missing required parameter: "query"');
        }

        const apiPath = '/graphql/mutation';
        const params: Params = {};

        if (typeof query !== 'undefined') {
            params['query'] = query;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);

        const apiHeaders: { [header: string]: string } = {
            'x-sdk-graphql': 'true',
            'content-type': 'application/json',
        }

        return await this.client.call('post', uri, apiHeaders, params);
    }
};

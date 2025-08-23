import { Service } from '../service';
import { AppwriteException, Client } from '../client';
import type { Models } from '../models';
import type { UploadProgress, Payload } from '../client';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';


export class Messaging extends Service {

     constructor(client: Client)
     {
        super(client);
     }

    /**
     * Create a new subscriber.
     *
     * @param {string} params.topicId - Topic ID. The topic ID to subscribe to.
     * @param {string} params.subscriberId - Subscriber ID. Choose a custom Subscriber ID or a new Subscriber ID.
     * @param {string} params.targetId - Target ID. The target ID to link to the specified Topic ID.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    createSubscriber(params?: { topicId: string, subscriberId: string, targetId: string  }): Promise<Models.Subscriber>;
    /**
     * Create a new subscriber.
     *
     * @param {string} topicId - Topic ID. The topic ID to subscribe to.
     * @param {string} subscriberId - Subscriber ID. Choose a custom Subscriber ID or a new Subscriber ID.
     * @param {string} targetId - Target ID. The target ID to link to the specified Topic ID.
     * @throws {AppwriteException}
     * @returns {Promise<Models.Subscriber>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    createSubscriber(topicId: string, subscriberId: string, targetId: string): Promise<Models.Subscriber>;
    createSubscriber(
        paramsOrFirst: { topicId: string, subscriberId: string, targetId: string } | string,
        ...rest: [(string)?, (string)?]    
    ): Promise<Models.Subscriber> {
        let params: { topicId: string, subscriberId: string, targetId: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { topicId: string, subscriberId: string, targetId: string };
        } else {
            params = {
                topicId: paramsOrFirst as string,
                subscriberId: rest[0] as string,
                targetId: rest[1] as string            
            };
        }

        const topicId = params.topicId;
        const subscriberId = params.subscriberId;
        const targetId = params.targetId;

        if (typeof topicId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "topicId"');
        }

        if (typeof subscriberId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "subscriberId"');
        }

        if (typeof targetId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "targetId"');
        }

        const apiPath = '/messaging/topics/{topicId}/subscribers'.replace('{topicId}', topicId);
        const payload: Payload = {};

        if (typeof subscriberId !== 'undefined') {
            payload['subscriberId'] = subscriberId;
        }

        if (typeof targetId !== 'undefined') {
            payload['targetId'] = targetId;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('post', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Delete a subscriber by its unique ID.
     *
     * @param {string} params.topicId - Topic ID. The topic ID subscribed to.
     * @param {string} params.subscriberId - Subscriber ID.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    deleteSubscriber(params?: { topicId: string, subscriberId: string  }): Promise<{}>;
    /**
     * Delete a subscriber by its unique ID.
     *
     * @param {string} topicId - Topic ID. The topic ID subscribed to.
     * @param {string} subscriberId - Subscriber ID.
     * @throws {AppwriteException}
     * @returns {Promise<{}>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    deleteSubscriber(topicId: string, subscriberId: string): Promise<{}>;
    deleteSubscriber(
        paramsOrFirst: { topicId: string, subscriberId: string } | string,
        ...rest: [(string)?]    
    ): Promise<{}> {
        let params: { topicId: string, subscriberId: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { topicId: string, subscriberId: string };
        } else {
            params = {
                topicId: paramsOrFirst as string,
                subscriberId: rest[0] as string            
            };
        }

        const topicId = params.topicId;
        const subscriberId = params.subscriberId;

        if (typeof topicId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "topicId"');
        }

        if (typeof subscriberId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "subscriberId"');
        }

        const apiPath = '/messaging/topics/{topicId}/subscribers/{subscriberId}'.replace('{topicId}', topicId).replace('{subscriberId}', subscriberId);
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('delete', uri, {
            'content-type': 'application/json',
        }, payload);
    }
};

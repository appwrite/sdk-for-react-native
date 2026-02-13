import { Service } from '../service';
import { AppwriteException, Client } from '../client';
import type { Models } from '../models';
import type { UploadProgress, Payload } from '../client';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';


export class Organizations extends Service {

     constructor(client: Client)
     {
        super(client);
     }

    /**
     * Delete an organization.
     *
     * @param {string} params.organizationId - Team ID.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    delete(params: { organizationId: string  }): Promise<{}>;
    /**
     * Delete an organization.
     *
     * @param {string} organizationId - Team ID.
     * @throws {AppwriteException}
     * @returns {Promise<{}>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    delete(organizationId: string): Promise<{}>;
    delete(
        paramsOrFirst: { organizationId: string } | string    
    ): Promise<{}> {
        let params: { organizationId: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { organizationId: string };
        } else {
            params = {
                organizationId: paramsOrFirst as string            
            };
        }

        const organizationId = params.organizationId;

        if (typeof organizationId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "organizationId"');
        }

        const apiPath = '/organizations/{organizationId}'.replace('{organizationId}', organizationId);
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('delete', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Get a billing address using it's ID.
     *
     * @param {string} params.organizationId - Organization ID
     * @param {string} params.billingAddressId - Unique ID of billing address
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    getBillingAddress(params: { organizationId: string, billingAddressId: string  }): Promise<Models.BillingAddress>;
    /**
     * Get a billing address using it's ID.
     *
     * @param {string} organizationId - Organization ID
     * @param {string} billingAddressId - Unique ID of billing address
     * @throws {AppwriteException}
     * @returns {Promise<Models.BillingAddress>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    getBillingAddress(organizationId: string, billingAddressId: string): Promise<Models.BillingAddress>;
    getBillingAddress(
        paramsOrFirst: { organizationId: string, billingAddressId: string } | string,
        ...rest: [(string)?]    
    ): Promise<Models.BillingAddress> {
        let params: { organizationId: string, billingAddressId: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { organizationId: string, billingAddressId: string };
        } else {
            params = {
                organizationId: paramsOrFirst as string,
                billingAddressId: rest[0] as string            
            };
        }

        const organizationId = params.organizationId;
        const billingAddressId = params.billingAddressId;

        if (typeof organizationId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "organizationId"');
        }

        if (typeof billingAddressId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "billingAddressId"');
        }

        const apiPath = '/organizations/{organizationId}/billing-addresses/{billingAddressId}'.replace('{organizationId}', organizationId).replace('{billingAddressId}', billingAddressId);
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('get', uri, {
        }, payload);
    }

    /**
     * Get estimation for deleting an organization.
     *
     * @param {string} params.organizationId - Team ID.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    estimationDeleteOrganization(params: { organizationId: string  }): Promise<Models.EstimationDeleteOrganization>;
    /**
     * Get estimation for deleting an organization.
     *
     * @param {string} organizationId - Team ID.
     * @throws {AppwriteException}
     * @returns {Promise<Models.EstimationDeleteOrganization>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    estimationDeleteOrganization(organizationId: string): Promise<Models.EstimationDeleteOrganization>;
    estimationDeleteOrganization(
        paramsOrFirst: { organizationId: string } | string    
    ): Promise<Models.EstimationDeleteOrganization> {
        let params: { organizationId: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { organizationId: string };
        } else {
            params = {
                organizationId: paramsOrFirst as string            
            };
        }

        const organizationId = params.organizationId;

        if (typeof organizationId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "organizationId"');
        }

        const apiPath = '/organizations/{organizationId}/estimations/delete-organization'.replace('{organizationId}', organizationId);
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('patch', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Submit feedback about downgrading from a paid plan to a lower tier. This helps the team understand user experience and improve the platform.
     * 
     *
     * @param {string} params.organizationId - Organization Unique ID
     * @param {string} params.reason - Feedback reason
     * @param {string} params.message - Feedback message
     * @param {string} params.fromPlanId - Plan downgrading from
     * @param {string} params.toPlanId - Plan downgrading to
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    createDowngradeFeedback(params: { organizationId: string, reason: string, message: string, fromPlanId: string, toPlanId: string  }): Promise<Models.DowngradeFeedback>;
    /**
     * Submit feedback about downgrading from a paid plan to a lower tier. This helps the team understand user experience and improve the platform.
     * 
     *
     * @param {string} organizationId - Organization Unique ID
     * @param {string} reason - Feedback reason
     * @param {string} message - Feedback message
     * @param {string} fromPlanId - Plan downgrading from
     * @param {string} toPlanId - Plan downgrading to
     * @throws {AppwriteException}
     * @returns {Promise<Models.DowngradeFeedback>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    createDowngradeFeedback(organizationId: string, reason: string, message: string, fromPlanId: string, toPlanId: string): Promise<Models.DowngradeFeedback>;
    createDowngradeFeedback(
        paramsOrFirst: { organizationId: string, reason: string, message: string, fromPlanId: string, toPlanId: string } | string,
        ...rest: [(string)?, (string)?, (string)?, (string)?]    
    ): Promise<Models.DowngradeFeedback> {
        let params: { organizationId: string, reason: string, message: string, fromPlanId: string, toPlanId: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { organizationId: string, reason: string, message: string, fromPlanId: string, toPlanId: string };
        } else {
            params = {
                organizationId: paramsOrFirst as string,
                reason: rest[0] as string,
                message: rest[1] as string,
                fromPlanId: rest[2] as string,
                toPlanId: rest[3] as string            
            };
        }

        const organizationId = params.organizationId;
        const reason = params.reason;
        const message = params.message;
        const fromPlanId = params.fromPlanId;
        const toPlanId = params.toPlanId;

        if (typeof organizationId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "organizationId"');
        }

        if (typeof reason === 'undefined') {
            throw new AppwriteException('Missing required parameter: "reason"');
        }

        if (typeof message === 'undefined') {
            throw new AppwriteException('Missing required parameter: "message"');
        }

        if (typeof fromPlanId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "fromPlanId"');
        }

        if (typeof toPlanId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "toPlanId"');
        }

        const apiPath = '/organizations/{organizationId}/feedbacks/downgrade'.replace('{organizationId}', organizationId);
        const payload: Payload = {};

        if (typeof reason !== 'undefined') {
            payload['reason'] = reason;
        }

        if (typeof message !== 'undefined') {
            payload['message'] = message;
        }

        if (typeof fromPlanId !== 'undefined') {
            payload['fromPlanId'] = fromPlanId;
        }

        if (typeof toPlanId !== 'undefined') {
            payload['toPlanId'] = toPlanId;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('post', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Get an organization's payment method using it's payment method ID.
     *
     * @param {string} params.organizationId - Organization ID
     * @param {string} params.paymentMethodId - Unique ID of payment method
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    getPaymentMethod(params: { organizationId: string, paymentMethodId: string  }): Promise<Models.PaymentMethod>;
    /**
     * Get an organization's payment method using it's payment method ID.
     *
     * @param {string} organizationId - Organization ID
     * @param {string} paymentMethodId - Unique ID of payment method
     * @throws {AppwriteException}
     * @returns {Promise<Models.PaymentMethod>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    getPaymentMethod(organizationId: string, paymentMethodId: string): Promise<Models.PaymentMethod>;
    getPaymentMethod(
        paramsOrFirst: { organizationId: string, paymentMethodId: string } | string,
        ...rest: [(string)?]    
    ): Promise<Models.PaymentMethod> {
        let params: { organizationId: string, paymentMethodId: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { organizationId: string, paymentMethodId: string };
        } else {
            params = {
                organizationId: paramsOrFirst as string,
                paymentMethodId: rest[0] as string            
            };
        }

        const organizationId = params.organizationId;
        const paymentMethodId = params.paymentMethodId;

        if (typeof organizationId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "organizationId"');
        }

        if (typeof paymentMethodId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "paymentMethodId"');
        }

        const apiPath = '/organizations/{organizationId}/payment-methods/{paymentMethodId}'.replace('{organizationId}', organizationId).replace('{paymentMethodId}', paymentMethodId);
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('get', uri, {
        }, payload);
    }
};

import { Service } from '../service';
import { AppwriteException, Client } from '../client';
import type { Models } from '../models';
import type { UploadProgress, Payload } from '../client';
import * as FileSystem from 'expo-file-system';
import { Platform as RNPlatform } from 'react-native';


export class Advisor extends Service {

     constructor(client: Client)
     {
        super(client);
     }

    /**
     * Get a list of all the project's analyzer reports. You can use the query params to filter your results.
     * 
     *
     * @param {string[]} params.queries - Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: appId, type, targetType, target, analyzedAt
     * @param {boolean} params.total - When set to false, the total count returned will be 0 and will not be calculated.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    listReports(params?: { queries?: string[], total?: boolean  }): Promise<Models.ReportList>;
    /**
     * Get a list of all the project's analyzer reports. You can use the query params to filter your results.
     * 
     *
     * @param {string[]} queries - Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: appId, type, targetType, target, analyzedAt
     * @param {boolean} total - When set to false, the total count returned will be 0 and will not be calculated.
     * @throws {AppwriteException}
     * @returns {Promise<Models.ReportList>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    listReports(queries?: string[], total?: boolean): Promise<Models.ReportList>;
    listReports(
        paramsOrFirst?: { queries?: string[], total?: boolean } | string[],
        ...rest: [(boolean)?]    
    ): Promise<Models.ReportList> {
        let params: { queries?: string[], total?: boolean };

        if (!paramsOrFirst || (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { queries?: string[], total?: boolean };
        } else {
            params = {
                queries: paramsOrFirst as string[],
                total: rest[0] as boolean            
            };
        }

        const queries = params.queries;
        const total = params.total;

        const apiPath = '/reports';
        const payload: Payload = {};

        if (typeof queries !== 'undefined') {
            payload['queries'] = queries;
        }

        if (typeof total !== 'undefined') {
            payload['total'] = total;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('get', uri, {
        }, payload);
    }

    /**
     * Get an analyzer report by its unique ID. The response includes the report's metadata and the nested insights it produced.
     * 
     *
     * @param {string} params.reportId - Report ID.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    getReport(params: { reportId: string  }): Promise<Models.Report>;
    /**
     * Get an analyzer report by its unique ID. The response includes the report's metadata and the nested insights it produced.
     * 
     *
     * @param {string} reportId - Report ID.
     * @throws {AppwriteException}
     * @returns {Promise<Models.Report>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    getReport(reportId: string): Promise<Models.Report>;
    getReport(
        paramsOrFirst: { reportId: string } | string    
    ): Promise<Models.Report> {
        let params: { reportId: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { reportId: string };
        } else {
            params = {
                reportId: paramsOrFirst as string            
            };
        }

        const reportId = params.reportId;

        if (typeof reportId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "reportId"');
        }

        const apiPath = '/reports/{reportId}'.replace('{reportId}', reportId);
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('get', uri, {
        }, payload);
    }

    /**
     * List the insights produced under a single analyzer report. You can use the query params to filter your results further.
     * 
     *
     * @param {string} params.reportId - Parent report ID.
     * @param {string[]} params.queries - Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: type, severity, status, resourceType, resourceId, parentResourceType, parentResourceId, analyzedAt, dismissedAt, dismissedBy
     * @param {boolean} params.total - When set to false, the total count returned will be 0 and will not be calculated.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    listInsights(params: { reportId: string, queries?: string[], total?: boolean  }): Promise<Models.InsightList>;
    /**
     * List the insights produced under a single analyzer report. You can use the query params to filter your results further.
     * 
     *
     * @param {string} reportId - Parent report ID.
     * @param {string[]} queries - Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: type, severity, status, resourceType, resourceId, parentResourceType, parentResourceId, analyzedAt, dismissedAt, dismissedBy
     * @param {boolean} total - When set to false, the total count returned will be 0 and will not be calculated.
     * @throws {AppwriteException}
     * @returns {Promise<Models.InsightList>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    listInsights(reportId: string, queries?: string[], total?: boolean): Promise<Models.InsightList>;
    listInsights(
        paramsOrFirst: { reportId: string, queries?: string[], total?: boolean } | string,
        ...rest: [(string[])?, (boolean)?]    
    ): Promise<Models.InsightList> {
        let params: { reportId: string, queries?: string[], total?: boolean };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { reportId: string, queries?: string[], total?: boolean };
        } else {
            params = {
                reportId: paramsOrFirst as string,
                queries: rest[0] as string[],
                total: rest[1] as boolean            
            };
        }

        const reportId = params.reportId;
        const queries = params.queries;
        const total = params.total;

        if (typeof reportId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "reportId"');
        }

        const apiPath = '/reports/{reportId}/insights'.replace('{reportId}', reportId);
        const payload: Payload = {};

        if (typeof queries !== 'undefined') {
            payload['queries'] = queries;
        }

        if (typeof total !== 'undefined') {
            payload['total'] = total;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('get', uri, {
        }, payload);
    }

    /**
     * Get an insight by its unique ID, scoped to its parent report.
     * 
     *
     * @param {string} params.reportId - Parent report ID.
     * @param {string} params.insightId - Insight ID.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    getInsight(params: { reportId: string, insightId: string  }): Promise<Models.Insight>;
    /**
     * Get an insight by its unique ID, scoped to its parent report.
     * 
     *
     * @param {string} reportId - Parent report ID.
     * @param {string} insightId - Insight ID.
     * @throws {AppwriteException}
     * @returns {Promise<Models.Insight>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    getInsight(reportId: string, insightId: string): Promise<Models.Insight>;
    getInsight(
        paramsOrFirst: { reportId: string, insightId: string } | string,
        ...rest: [(string)?]    
    ): Promise<Models.Insight> {
        let params: { reportId: string, insightId: string };

        if ((paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst))) {
            params = (paramsOrFirst || {}) as { reportId: string, insightId: string };
        } else {
            params = {
                reportId: paramsOrFirst as string,
                insightId: rest[0] as string            
            };
        }

        const reportId = params.reportId;
        const insightId = params.insightId;

        if (typeof reportId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "reportId"');
        }

        if (typeof insightId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "insightId"');
        }

        const apiPath = '/reports/{reportId}/insights/{insightId}'.replace('{reportId}', reportId).replace('{insightId}', insightId);
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call('get', uri, {
        }, payload);
    }
};

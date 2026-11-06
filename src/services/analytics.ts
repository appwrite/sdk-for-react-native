import { Service } from '../service';
import { AppwriteException, Client, encodePath } from '../client';
import type { Payload } from '../client';

export class Analytics extends Service {
    constructor(client: Client) {
        super(client);
    }

    /**
     * Send a tracking event from a browser, native app, or server-side SDK.
     *
     * @param {string} params.propertyId - Analytics property ID.
     * @param {string} params.name - Event name. "pageview" and "screen_view" are counted as views, every other name is a custom event.
     * @param {string} params.url - Full page URL or screen identifier.
     * @param {string} params.domain - Hostname (e.g. example.com).
     * @param {string} params.referrer - Referrer URL.
     * @param {number} params.screenWidth - Viewport width in CSS pixels.
     * @param {string} params.sessionHash - Optional session hash (provided by SDK).
     * @param {number} params.scrollDepth - Scroll depth percentage 0-100.
     * @param {number} params.engagementTime - Engagement time in seconds, 0-4294967295.
     * @param {string[]} params.props - Custom string properties as a flat key=value list (max 32 entries, alternating key,value).
     * @param {string} params.userId - Override user ID. Pass an opaque ID, not personal data such as an email. Requires API-key auth with analytics.write scope.
     * @param {string} params.ip - Override IP address. Requires API-key auth with analytics.write scope.
     * @param {string} params.userAgent - Override user agent. Requires API-key auth with analytics.write scope.
     * @param {boolean | null} params.interactive - Whether this event is a visitor interaction that ends a bounce. Set false for telemetry such as heartbeats or background syncs. Defaults to true for custom events and false for the automatic engagement, scroll and app lifecycle events. Ignored for views.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    createEvent(params: {
        propertyId: string;
        name: string;
        url: string;
        domain?: string;
        referrer?: string;
        screenWidth?: number;
        sessionHash?: string;
        scrollDepth?: number;
        engagementTime?: number;
        props?: string[];
        userId?: string;
        ip?: string;
        userAgent?: string;
        interactive?: boolean | null;
    }): Promise<{}>;
    /**
     * Send a tracking event from a browser, native app, or server-side SDK.
     *
     * @param {string} propertyId - Analytics property ID.
     * @param {string} name - Event name. "pageview" and "screen_view" are counted as views, every other name is a custom event.
     * @param {string} url - Full page URL or screen identifier.
     * @param {string} domain - Hostname (e.g. example.com).
     * @param {string} referrer - Referrer URL.
     * @param {number} screenWidth - Viewport width in CSS pixels.
     * @param {string} sessionHash - Optional session hash (provided by SDK).
     * @param {number} scrollDepth - Scroll depth percentage 0-100.
     * @param {number} engagementTime - Engagement time in seconds, 0-4294967295.
     * @param {string[]} props - Custom string properties as a flat key=value list (max 32 entries, alternating key,value).
     * @param {string} userId - Override user ID. Pass an opaque ID, not personal data such as an email. Requires API-key auth with analytics.write scope.
     * @param {string} ip - Override IP address. Requires API-key auth with analytics.write scope.
     * @param {string} userAgent - Override user agent. Requires API-key auth with analytics.write scope.
     * @param {boolean | null} interactive - Whether this event is a visitor interaction that ends a bounce. Set false for telemetry such as heartbeats or background syncs. Defaults to true for custom events and false for the automatic engagement, scroll and app lifecycle events. Ignored for views.
     * @throws {AppwriteException}
     * @returns {Promise<{}>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    createEvent(
        propertyId: string,
        name: string,
        url: string,
        domain?: string,
        referrer?: string,
        screenWidth?: number,
        sessionHash?: string,
        scrollDepth?: number,
        engagementTime?: number,
        props?: string[],
        userId?: string,
        ip?: string,
        userAgent?: string,
        interactive?: boolean | null,
    ): Promise<{}>;
    createEvent(
        paramsOrFirst:
            | {
                  propertyId: string;
                  name: string;
                  url: string;
                  domain?: string;
                  referrer?: string;
                  screenWidth?: number;
                  sessionHash?: string;
                  scrollDepth?: number;
                  engagementTime?: number;
                  props?: string[];
                  userId?: string;
                  ip?: string;
                  userAgent?: string;
                  interactive?: boolean | null;
              }
            | string,
        ...rest: [
            string?,
            string?,
            string?,
            string?,
            number?,
            string?,
            number?,
            number?,
            string[]?,
            string?,
            string?,
            string?,
            (boolean | null)?,
        ]
    ): Promise<{}> {
        let params: {
            propertyId: string;
            name: string;
            url: string;
            domain?: string;
            referrer?: string;
            screenWidth?: number;
            sessionHash?: string;
            scrollDepth?: number;
            engagementTime?: number;
            props?: string[];
            userId?: string;
            ip?: string;
            userAgent?: string;
            interactive?: boolean | null;
        };

        if (
            paramsOrFirst &&
            typeof paramsOrFirst === 'object' &&
            !Array.isArray(paramsOrFirst)
        ) {
            params = (paramsOrFirst || {}) as {
                propertyId: string;
                name: string;
                url: string;
                domain?: string;
                referrer?: string;
                screenWidth?: number;
                sessionHash?: string;
                scrollDepth?: number;
                engagementTime?: number;
                props?: string[];
                userId?: string;
                ip?: string;
                userAgent?: string;
                interactive?: boolean | null;
            };
        } else {
            params = {
                propertyId: paramsOrFirst as string,
                name: rest[0] as string,
                url: rest[1] as string,
                domain: rest[2] as string,
                referrer: rest[3] as string,
                screenWidth: rest[4] as number,
                sessionHash: rest[5] as string,
                scrollDepth: rest[6] as number,
                engagementTime: rest[7] as number,
                props: rest[8] as string[],
                userId: rest[9] as string,
                ip: rest[10] as string,
                userAgent: rest[11] as string,
                interactive: rest[12] as boolean | null,
            };
        }

        const propertyId = params.propertyId;
        const name = params.name;
        const url = params.url;
        const domain = params.domain;
        const referrer = params.referrer;
        const screenWidth = params.screenWidth;
        const sessionHash = params.sessionHash;
        const scrollDepth = params.scrollDepth;
        const engagementTime = params.engagementTime;
        const props = params.props;
        const userId = params.userId;
        const ip = params.ip;
        const userAgent = params.userAgent;
        const interactive = params.interactive;

        if (typeof propertyId === 'undefined' || propertyId === '') {
            throw new AppwriteException(
                'Missing required parameter: "propertyId"',
            );
        }

        if (typeof name === 'undefined') {
            throw new AppwriteException('Missing required parameter: "name"');
        }

        if (typeof url === 'undefined') {
            throw new AppwriteException('Missing required parameter: "url"');
        }

        const apiPath = '/analytics/properties/{propertyId}/events'.replace(
            '{propertyId}',
            encodePath(propertyId),
        );
        const apiPayload: Payload = {};

        if (typeof name !== 'undefined') {
            apiPayload['name'] = name;
        }

        if (typeof url !== 'undefined') {
            apiPayload['url'] = url;
        }

        if (typeof domain !== 'undefined') {
            apiPayload['domain'] = domain;
        }

        if (typeof referrer !== 'undefined') {
            apiPayload['referrer'] = referrer;
        }

        if (typeof screenWidth !== 'undefined') {
            apiPayload['screenWidth'] = screenWidth;
        }

        if (typeof sessionHash !== 'undefined') {
            apiPayload['sessionHash'] = sessionHash;
        }

        if (typeof scrollDepth !== 'undefined') {
            apiPayload['scrollDepth'] = scrollDepth;
        }

        if (typeof engagementTime !== 'undefined') {
            apiPayload['engagementTime'] = engagementTime;
        }

        if (typeof props !== 'undefined') {
            apiPayload['props'] = props;
        }

        if (typeof userId !== 'undefined') {
            apiPayload['userId'] = userId;
        }

        if (typeof ip !== 'undefined') {
            apiPayload['ip'] = ip;
        }

        if (typeof userAgent !== 'undefined') {
            apiPayload['userAgent'] = userAgent;
        }

        if (typeof interactive !== 'undefined') {
            apiPayload['interactive'] = interactive;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call(
            'post',
            uri,
            {
                'X-Appwrite-Project': this.client.config.project,
                'content-type': 'application/json',
                accept: 'application/json',
            },
            apiPayload,
        );
    }
}

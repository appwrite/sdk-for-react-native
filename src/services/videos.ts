import { Service } from '../service';
import {
    AppwriteException,
    Client,
    applyDefaults,
    encodePath,
} from '../client';
import type { Models } from '../models';
import type { Payload } from '../client';

import { VideoOutput } from '../enums/video-output';
import { ImageFormat } from '../enums/image-format';
export class Videos extends Service {
    constructor(client: Client) {
        super(client);
    }

    /**
     * Get a list of videos in the current project. Sessions receive only videos they can read according to each video's `$permissions`. API keys and admins receive the full project catalog. Playback uses the same document read ACL plus the `videos.play` (or `videos.read`) scope: a guest can stream a video that grants `read("any")` or `read("guests")` even though guests lack `videos.read` and will not see it in this list.
     *
     *
     * @param {string[]} params.queries - Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: bucketId, fileId, name, size, format, duration, width, height, videoCodec, videoBitRate, audioCodec, audioBitRate, search
     * @param {boolean} params.total - When set to false, the total count returned will be 0 and will not be calculated.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    list(params?: {
        queries?: string[];
        total?: boolean;
    }): Promise<Models.VideoList>;
    /**
     * Get a list of videos in the current project. Sessions receive only videos they can read according to each video's `$permissions`. API keys and admins receive the full project catalog. Playback uses the same document read ACL plus the `videos.play` (or `videos.read`) scope: a guest can stream a video that grants `read("any")` or `read("guests")` even though guests lack `videos.read` and will not see it in this list.
     *
     *
     * @param {string[]} queries - Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: bucketId, fileId, name, size, format, duration, width, height, videoCodec, videoBitRate, audioCodec, audioBitRate, search
     * @param {boolean} total - When set to false, the total count returned will be 0 and will not be calculated.
     * @throws {AppwriteException}
     * @returns {Promise<Models.VideoList>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    list(queries?: string[], total?: boolean): Promise<Models.VideoList>;
    list(
        paramsOrFirst?: { queries?: string[]; total?: boolean } | string[],
        ...rest: [boolean?]
    ): Promise<Models.VideoList> {
        let params: { queries?: string[]; total?: boolean };

        if (
            (typeof paramsOrFirst === 'undefined' && rest.length === 0) ||
            (paramsOrFirst &&
                typeof paramsOrFirst === 'object' &&
                !Array.isArray(paramsOrFirst))
        ) {
            params = (paramsOrFirst || {}) as {
                queries?: string[];
                total?: boolean;
            };
        } else {
            params = {
                queries: paramsOrFirst as string[],
                total: rest[0] as boolean,
            };
        }

        const queries = params.queries;
        const total = params.total;

        const apiPath = '/videos';
        const apiPayload: Payload = {};

        if (typeof queries !== 'undefined') {
            apiPayload['queries'] = queries;
        }

        if (typeof total !== 'undefined') {
            apiPayload['total'] = total;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        const request = this.client.call(
            'get',
            uri,
            {
                'X-Appwrite-Project': this.client.config.project,
                accept: 'application/json',
            },
            apiPayload,
        );
        const defaults = {
            root: 'videoList',
            models: {
                videoList: {
                    defaults: {
                        total: 0,
                        videos: [],
                    },
                    properties: {
                        videos: {
                            items: 'video',
                        },
                    },
                },
                video: {
                    defaults: {
                        $id: '',
                        $createdAt: '',
                        $updatedAt: '',
                        $permissions: [],
                        bucketId: '',
                        fileId: '',
                        name: '',
                        size: 0,
                        format: '',
                        duration: 0,
                        width: 0,
                        height: 0,
                        aspectRatio: '',
                        videoCodec: '',
                        videoFormat: '',
                        videoFormatProfile: '',
                        videoBitRate: 0,
                        videoFrameRate: 0,
                        videoFrameRateMode: '',
                        audioCodec: '',
                        audioFormat: '',
                        audioBitRate: 0,
                        audioSampleRate: 0,
                        timelineStatus: 'pending',
                        timelineError: '',
                    },
                },
            },
        };

        return request.then((response) => applyDefaults(response, defaults));
    }

    /**
     * Create a video resource from an existing file in a storage bucket. The source file must be a video or audio file, and the caller must be able to read that file. Creating a video stores the document and queues timeline generation. The worker downloads the source, probes metadata, extracts embedded captions once, and deletes its working copy when finished. Sources with a video track also get a thumbnail timeline. Call create-rendition to package a streaming output.
     *
     * An optional `name` defaults to the source file name. An optional `permissions` array sets the video document ACL (list, get, update, delete, manage child resources, and playback). By default, only the current user is granted all permissions; API keys and admins create with empty permissions when omitted. Guests with `videos.play` can stream when the video grants them read (`read("any")` or `read("guests")`).
     *
     * Uploaded caption files stay listed alongside auto-extracted tracks for the same language; when the current default is an auto-extracted track with that code, the upload takes the default flag.
     *
     *
     * @param {string} params.videoId - Video ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.
     * @param {string} params.bucketId - Storage bucket unique ID holding the source file.
     * @param {string} params.fileId - Source file unique ID.
     * @param {string} params.name - Video name. Defaults to the source file name. Max length: 2048 chars.
     * @param {string[] | null} params.permissions - An array of permission strings. By default, only the current user is granted all permissions. [Learn more about permissions](https://appwrite.io/docs/permissions).
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    create(params: {
        videoId: string;
        bucketId: string;
        fileId: string;
        name?: string;
        permissions?: string[] | null;
    }): Promise<Models.Video>;
    /**
     * Create a video resource from an existing file in a storage bucket. The source file must be a video or audio file, and the caller must be able to read that file. Creating a video stores the document and queues timeline generation. The worker downloads the source, probes metadata, extracts embedded captions once, and deletes its working copy when finished. Sources with a video track also get a thumbnail timeline. Call create-rendition to package a streaming output.
     *
     * An optional `name` defaults to the source file name. An optional `permissions` array sets the video document ACL (list, get, update, delete, manage child resources, and playback). By default, only the current user is granted all permissions; API keys and admins create with empty permissions when omitted. Guests with `videos.play` can stream when the video grants them read (`read("any")` or `read("guests")`).
     *
     * Uploaded caption files stay listed alongside auto-extracted tracks for the same language; when the current default is an auto-extracted track with that code, the upload takes the default flag.
     *
     *
     * @param {string} videoId - Video ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.
     * @param {string} bucketId - Storage bucket unique ID holding the source file.
     * @param {string} fileId - Source file unique ID.
     * @param {string} name - Video name. Defaults to the source file name. Max length: 2048 chars.
     * @param {string[] | null} permissions - An array of permission strings. By default, only the current user is granted all permissions. [Learn more about permissions](https://appwrite.io/docs/permissions).
     * @throws {AppwriteException}
     * @returns {Promise<Models.Video>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    create(
        videoId: string,
        bucketId: string,
        fileId: string,
        name?: string,
        permissions?: string[] | null,
    ): Promise<Models.Video>;
    create(
        paramsOrFirst:
            | {
                  videoId: string;
                  bucketId: string;
                  fileId: string;
                  name?: string;
                  permissions?: string[] | null;
              }
            | string,
        ...rest: [string?, string?, string?, (string[] | null)?]
    ): Promise<Models.Video> {
        let params: {
            videoId: string;
            bucketId: string;
            fileId: string;
            name?: string;
            permissions?: string[] | null;
        };

        if (
            paramsOrFirst &&
            typeof paramsOrFirst === 'object' &&
            !Array.isArray(paramsOrFirst)
        ) {
            params = (paramsOrFirst || {}) as {
                videoId: string;
                bucketId: string;
                fileId: string;
                name?: string;
                permissions?: string[] | null;
            };
        } else {
            params = {
                videoId: paramsOrFirst as string,
                bucketId: rest[0] as string,
                fileId: rest[1] as string,
                name: rest[2] as string,
                permissions: rest[3] as string[] | null,
            };
        }

        const videoId = params.videoId;
        const bucketId = params.bucketId;
        const fileId = params.fileId;
        const name = params.name;
        const permissions = params.permissions;

        if (typeof videoId === 'undefined') {
            throw new AppwriteException(
                'Missing required parameter: "videoId"',
            );
        }

        if (typeof bucketId === 'undefined') {
            throw new AppwriteException(
                'Missing required parameter: "bucketId"',
            );
        }

        if (typeof fileId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "fileId"');
        }

        const apiPath = '/videos';
        const apiPayload: Payload = {};

        if (typeof videoId !== 'undefined') {
            apiPayload['videoId'] = videoId;
        }

        if (typeof bucketId !== 'undefined') {
            apiPayload['bucketId'] = bucketId;
        }

        if (typeof fileId !== 'undefined') {
            apiPayload['fileId'] = fileId;
        }

        if (typeof name !== 'undefined') {
            apiPayload['name'] = name;
        }

        if (typeof permissions !== 'undefined') {
            apiPayload['permissions'] = permissions;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        const request = this.client.call(
            'post',
            uri,
            {
                'X-Appwrite-Project': this.client.config.project,
                'content-type': 'application/json',
                accept: 'application/json',
            },
            apiPayload,
        );
        const defaults = {
            root: 'video',
            models: {
                video: {
                    defaults: {
                        $id: '',
                        $createdAt: '',
                        $updatedAt: '',
                        $permissions: [],
                        bucketId: '',
                        fileId: '',
                        name: '',
                        size: 0,
                        format: '',
                        duration: 0,
                        width: 0,
                        height: 0,
                        aspectRatio: '',
                        videoCodec: '',
                        videoFormat: '',
                        videoFormatProfile: '',
                        videoBitRate: 0,
                        videoFrameRate: 0,
                        videoFrameRateMode: '',
                        audioCodec: '',
                        audioFormat: '',
                        audioBitRate: 0,
                        audioSampleRate: 0,
                        timelineStatus: 'pending',
                        timelineError: '',
                    },
                },
            },
        };

        return request.then((response) => applyDefaults(response, defaults));
    }

    /**
     * Get a list of video encode codecs enabled on this instance. Each codec includes the output formats it may be packaged into.
     *
     *
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    listCodecs(): Promise<Models.VideoCodecList> {
        const apiPath = '/videos/codecs';
        const apiPayload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        const request = this.client.call(
            'get',
            uri,
            {
                'X-Appwrite-Project': this.client.config.project,
                accept: 'application/json',
            },
            apiPayload,
        );
        const defaults = {
            root: 'videoCodecList',
            models: {
                videoCodecList: {
                    defaults: {
                        total: 0,
                        codecs: [],
                    },
                    properties: {
                        codecs: {
                            items: 'videoCodec',
                        },
                    },
                },
                videoCodec: {
                    defaults: {
                        $id: '',
                        name: '',
                        outputs: [],
                    },
                },
            },
        };

        return request.then((response) => applyDefaults(response, defaults));
    }

    /**
     * Get a video by its unique ID. This endpoint response returns a JSON object with the video metadata.
     *
     *
     * @param {string} params.videoId - Video unique ID.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    get(params: { videoId: string }): Promise<Models.Video>;
    /**
     * Get a video by its unique ID. This endpoint response returns a JSON object with the video metadata.
     *
     *
     * @param {string} videoId - Video unique ID.
     * @throws {AppwriteException}
     * @returns {Promise<Models.Video>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    get(videoId: string): Promise<Models.Video>;
    get(paramsOrFirst: { videoId: string } | string): Promise<Models.Video> {
        let params: { videoId: string };

        if (
            paramsOrFirst &&
            typeof paramsOrFirst === 'object' &&
            !Array.isArray(paramsOrFirst)
        ) {
            params = (paramsOrFirst || {}) as { videoId: string };
        } else {
            params = {
                videoId: paramsOrFirst as string,
            };
        }

        const videoId = params.videoId;

        if (typeof videoId === 'undefined' || videoId === '') {
            throw new AppwriteException(
                'Missing required parameter: "videoId"',
            );
        }

        const apiPath = '/videos/{videoId}'.replace(
            '{videoId}',
            encodePath(videoId),
        );
        const apiPayload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        const request = this.client.call(
            'get',
            uri,
            {
                'X-Appwrite-Project': this.client.config.project,
                accept: 'application/json',
            },
            apiPayload,
        );
        const defaults = {
            root: 'video',
            models: {
                video: {
                    defaults: {
                        $id: '',
                        $createdAt: '',
                        $updatedAt: '',
                        $permissions: [],
                        bucketId: '',
                        fileId: '',
                        name: '',
                        size: 0,
                        format: '',
                        duration: 0,
                        width: 0,
                        height: 0,
                        aspectRatio: '',
                        videoCodec: '',
                        videoFormat: '',
                        videoFormatProfile: '',
                        videoBitRate: 0,
                        videoFrameRate: 0,
                        videoFrameRateMode: '',
                        audioCodec: '',
                        audioFormat: '',
                        audioBitRate: 0,
                        audioSampleRate: 0,
                        timelineStatus: 'pending',
                        timelineError: '',
                    },
                },
            },
        };

        return request.then((response) => applyDefaults(response, defaults));
    }

    /**
     * Update a video's name, permissions, or both. Only the fields you pass are changed: omit `name` to keep the current name and `permissions` to keep the current ACL. The caller must hold update permission on the video document. The source file cannot be replaced; delete the video and create a new one to point at a different file.
     *
     *
     * @param {string} params.videoId - Video unique ID.
     * @param {string | null} params.name - Video name. Max length: 2048 chars.
     * @param {string[] | null} params.permissions - An array of permission strings. By default, the current permissions are inherited. [Learn more about permissions](https://appwrite.io/docs/permissions).
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    update(params: {
        videoId: string;
        name?: string | null;
        permissions?: string[] | null;
    }): Promise<Models.Video>;
    /**
     * Update a video's name, permissions, or both. Only the fields you pass are changed: omit `name` to keep the current name and `permissions` to keep the current ACL. The caller must hold update permission on the video document. The source file cannot be replaced; delete the video and create a new one to point at a different file.
     *
     *
     * @param {string} videoId - Video unique ID.
     * @param {string | null} name - Video name. Max length: 2048 chars.
     * @param {string[] | null} permissions - An array of permission strings. By default, the current permissions are inherited. [Learn more about permissions](https://appwrite.io/docs/permissions).
     * @throws {AppwriteException}
     * @returns {Promise<Models.Video>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    update(
        videoId: string,
        name?: string | null,
        permissions?: string[] | null,
    ): Promise<Models.Video>;
    update(
        paramsOrFirst:
            | {
                  videoId: string;
                  name?: string | null;
                  permissions?: string[] | null;
              }
            | string,
        ...rest: [(string | null)?, (string[] | null)?]
    ): Promise<Models.Video> {
        let params: {
            videoId: string;
            name?: string | null;
            permissions?: string[] | null;
        };

        if (
            paramsOrFirst &&
            typeof paramsOrFirst === 'object' &&
            !Array.isArray(paramsOrFirst)
        ) {
            params = (paramsOrFirst || {}) as {
                videoId: string;
                name?: string | null;
                permissions?: string[] | null;
            };
        } else {
            params = {
                videoId: paramsOrFirst as string,
                name: rest[0] as string | null,
                permissions: rest[1] as string[] | null,
            };
        }

        const videoId = params.videoId;
        const name = params.name;
        const permissions = params.permissions;

        if (typeof videoId === 'undefined' || videoId === '') {
            throw new AppwriteException(
                'Missing required parameter: "videoId"',
            );
        }

        const apiPath = '/videos/{videoId}'.replace(
            '{videoId}',
            encodePath(videoId),
        );
        const apiPayload: Payload = {};

        if (typeof name !== 'undefined') {
            apiPayload['name'] = name;
        }

        if (typeof permissions !== 'undefined') {
            apiPayload['permissions'] = permissions;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        const request = this.client.call(
            'patch',
            uri,
            {
                'X-Appwrite-Project': this.client.config.project,
                'content-type': 'application/json',
                accept: 'application/json',
            },
            apiPayload,
        );
        const defaults = {
            root: 'video',
            models: {
                video: {
                    defaults: {
                        $id: '',
                        $createdAt: '',
                        $updatedAt: '',
                        $permissions: [],
                        bucketId: '',
                        fileId: '',
                        name: '',
                        size: 0,
                        format: '',
                        duration: 0,
                        width: 0,
                        height: 0,
                        aspectRatio: '',
                        videoCodec: '',
                        videoFormat: '',
                        videoFormatProfile: '',
                        videoBitRate: 0,
                        videoFrameRate: 0,
                        videoFrameRateMode: '',
                        audioCodec: '',
                        audioFormat: '',
                        audioBitRate: 0,
                        audioSampleRate: 0,
                        timelineStatus: 'pending',
                        timelineError: '',
                    },
                },
            },
        };

        return request.then((response) => applyDefaults(response, defaults));
    }

    /**
     * Delete a video by its unique ID. This also removes every rendition, caption, preview and transcoded artifact derived from it. Fails with `video_rendition_in_progress` while a rendition is started or ended, unless that rendition has not been updated within the rendition retention window. Fails with `video_timeline_in_progress` while the video's timeline is being generated, unless the video has not been updated within the same window.
     *
     *
     * @param {string} params.videoId - Video unique ID.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    delete(params: { videoId: string }): Promise<{}>;
    /**
     * Delete a video by its unique ID. This also removes every rendition, caption, preview and transcoded artifact derived from it. Fails with `video_rendition_in_progress` while a rendition is started or ended, unless that rendition has not been updated within the rendition retention window. Fails with `video_timeline_in_progress` while the video's timeline is being generated, unless the video has not been updated within the same window.
     *
     *
     * @param {string} videoId - Video unique ID.
     * @throws {AppwriteException}
     * @returns {Promise<{}>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    delete(videoId: string): Promise<{}>;
    delete(paramsOrFirst: { videoId: string } | string): Promise<{}> {
        let params: { videoId: string };

        if (
            paramsOrFirst &&
            typeof paramsOrFirst === 'object' &&
            !Array.isArray(paramsOrFirst)
        ) {
            params = (paramsOrFirst || {}) as { videoId: string };
        } else {
            params = {
                videoId: paramsOrFirst as string,
            };
        }

        const videoId = params.videoId;

        if (typeof videoId === 'undefined' || videoId === '') {
            throw new AppwriteException(
                'Missing required parameter: "videoId"',
            );
        }

        const apiPath = '/videos/{videoId}'.replace(
            '{videoId}',
            encodePath(videoId),
        );
        const apiPayload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call(
            'delete',
            uri,
            {
                'X-Appwrite-Project': this.client.config.project,
                'content-type': 'application/json',
                accept: 'application/json',
            },
            apiPayload,
        );
    }

    /**
     * Get a list of all the caption tracks attached to a video. You can use the query params to filter your results.
     *
     *
     * @param {string} params.videoId - Video unique ID.
     * @param {string[]} params.queries - Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, language, default, status, size, bucketId, fileId
     * @param {boolean} params.total - When set to false, the total count returned will be 0 and will not be calculated.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    listCaptions(params: {
        videoId: string;
        queries?: string[];
        total?: boolean;
    }): Promise<Models.VideoCaptionList>;
    /**
     * Get a list of all the caption tracks attached to a video. You can use the query params to filter your results.
     *
     *
     * @param {string} videoId - Video unique ID.
     * @param {string[]} queries - Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, language, default, status, size, bucketId, fileId
     * @param {boolean} total - When set to false, the total count returned will be 0 and will not be calculated.
     * @throws {AppwriteException}
     * @returns {Promise<Models.VideoCaptionList>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    listCaptions(
        videoId: string,
        queries?: string[],
        total?: boolean,
    ): Promise<Models.VideoCaptionList>;
    listCaptions(
        paramsOrFirst:
            { videoId: string; queries?: string[]; total?: boolean } | string,
        ...rest: [string[]?, boolean?]
    ): Promise<Models.VideoCaptionList> {
        let params: { videoId: string; queries?: string[]; total?: boolean };

        if (
            paramsOrFirst &&
            typeof paramsOrFirst === 'object' &&
            !Array.isArray(paramsOrFirst)
        ) {
            params = (paramsOrFirst || {}) as {
                videoId: string;
                queries?: string[];
                total?: boolean;
            };
        } else {
            params = {
                videoId: paramsOrFirst as string,
                queries: rest[0] as string[],
                total: rest[1] as boolean,
            };
        }

        const videoId = params.videoId;
        const queries = params.queries;
        const total = params.total;

        if (typeof videoId === 'undefined' || videoId === '') {
            throw new AppwriteException(
                'Missing required parameter: "videoId"',
            );
        }

        const apiPath = '/videos/{videoId}/captions'.replace(
            '{videoId}',
            encodePath(videoId),
        );
        const apiPayload: Payload = {};

        if (typeof queries !== 'undefined') {
            apiPayload['queries'] = queries;
        }

        if (typeof total !== 'undefined') {
            apiPayload['total'] = total;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        const request = this.client.call(
            'get',
            uri,
            {
                'X-Appwrite-Project': this.client.config.project,
                accept: 'application/json',
            },
            apiPayload,
        );
        const defaults = {
            root: 'videoCaptionList',
            models: {
                videoCaptionList: {
                    defaults: {
                        total: 0,
                        captions: [],
                    },
                    properties: {
                        captions: {
                            items: 'videoCaption',
                        },
                    },
                },
                videoCaption: {
                    defaults: {
                        $id: '',
                        $createdAt: '',
                        $updatedAt: '',
                        videoId: '',
                        bucketId: '',
                        fileId: '',
                        name: '',
                        language: '',
                        default: false,
                        embedded: false,
                        targetDuration: 0,
                        status: 'pending',
                        error: '',
                        size: 0,
                    },
                },
            },
        };

        return request.then((response) => applyDefaults(response, defaults));
    }

    /**
     * Add a caption track to a video from a WebVTT or SubRip file in a storage bucket. The file is normalised to WebVTT and segmented in the background. Subscribe to `videos.[videoId].captions.[captionId].update` for `started`, `ready`, and `error` status changes instead of only polling the caption document.
     *
     * Uploaded tracks are listed alongside auto-extracted embedded tracks (`embedded: true`). When the current default is an auto-extracted track for the same language code, the upload takes the default flag so players pick the authored file first. Auto-extracted tracks are never removed automatically — delete a track explicitly to remove it. Extraction runs once per video, so a deleted extracted track is not re-created.
     *
     *
     * @param {string} params.videoId - Video unique ID.
     * @param {string} params.bucketId - Storage bucket unique ID holding the caption file.
     * @param {string} params.fileId - Caption file unique ID.
     * @param {string} params.name - Caption display name. Allowed characters: a-z, A-Z, 0-9, space, and - . , ( ) _ '
     * @param {string} params.language - Caption ISO 639-2 three-letter language code.
     * @param {boolean} params.xdefault - Make this the default caption track for the video.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    createCaption(params: {
        videoId: string;
        bucketId: string;
        fileId: string;
        name: string;
        language: string;
        xdefault?: boolean;
    }): Promise<Models.VideoCaption>;
    /**
     * Add a caption track to a video from a WebVTT or SubRip file in a storage bucket. The file is normalised to WebVTT and segmented in the background. Subscribe to `videos.[videoId].captions.[captionId].update` for `started`, `ready`, and `error` status changes instead of only polling the caption document.
     *
     * Uploaded tracks are listed alongside auto-extracted embedded tracks (`embedded: true`). When the current default is an auto-extracted track for the same language code, the upload takes the default flag so players pick the authored file first. Auto-extracted tracks are never removed automatically — delete a track explicitly to remove it. Extraction runs once per video, so a deleted extracted track is not re-created.
     *
     *
     * @param {string} videoId - Video unique ID.
     * @param {string} bucketId - Storage bucket unique ID holding the caption file.
     * @param {string} fileId - Caption file unique ID.
     * @param {string} name - Caption display name. Allowed characters: a-z, A-Z, 0-9, space, and - . , ( ) _ '
     * @param {string} language - Caption ISO 639-2 three-letter language code.
     * @param {boolean} xdefault - Make this the default caption track for the video.
     * @throws {AppwriteException}
     * @returns {Promise<Models.VideoCaption>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    createCaption(
        videoId: string,
        bucketId: string,
        fileId: string,
        name: string,
        language: string,
        xdefault?: boolean,
    ): Promise<Models.VideoCaption>;
    createCaption(
        paramsOrFirst:
            | {
                  videoId: string;
                  bucketId: string;
                  fileId: string;
                  name: string;
                  language: string;
                  xdefault?: boolean;
              }
            | string,
        ...rest: [string?, string?, string?, string?, boolean?]
    ): Promise<Models.VideoCaption> {
        let params: {
            videoId: string;
            bucketId: string;
            fileId: string;
            name: string;
            language: string;
            xdefault?: boolean;
        };

        if (
            paramsOrFirst &&
            typeof paramsOrFirst === 'object' &&
            !Array.isArray(paramsOrFirst)
        ) {
            params = (paramsOrFirst || {}) as {
                videoId: string;
                bucketId: string;
                fileId: string;
                name: string;
                language: string;
                xdefault?: boolean;
            };
        } else {
            params = {
                videoId: paramsOrFirst as string,
                bucketId: rest[0] as string,
                fileId: rest[1] as string,
                name: rest[2] as string,
                language: rest[3] as string,
                xdefault: rest[4] as boolean,
            };
        }

        const videoId = params.videoId;
        const bucketId = params.bucketId;
        const fileId = params.fileId;
        const name = params.name;
        const language = params.language;
        const xdefault = params.xdefault;

        if (typeof videoId === 'undefined' || videoId === '') {
            throw new AppwriteException(
                'Missing required parameter: "videoId"',
            );
        }

        if (typeof bucketId === 'undefined') {
            throw new AppwriteException(
                'Missing required parameter: "bucketId"',
            );
        }

        if (typeof fileId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "fileId"');
        }

        if (typeof name === 'undefined') {
            throw new AppwriteException('Missing required parameter: "name"');
        }

        if (typeof language === 'undefined') {
            throw new AppwriteException(
                'Missing required parameter: "language"',
            );
        }

        const apiPath = '/videos/{videoId}/captions'.replace(
            '{videoId}',
            encodePath(videoId),
        );
        const apiPayload: Payload = {};

        if (typeof bucketId !== 'undefined') {
            apiPayload['bucketId'] = bucketId;
        }

        if (typeof fileId !== 'undefined') {
            apiPayload['fileId'] = fileId;
        }

        if (typeof name !== 'undefined') {
            apiPayload['name'] = name;
        }

        if (typeof language !== 'undefined') {
            apiPayload['language'] = language;
        }

        if (typeof xdefault !== 'undefined') {
            apiPayload['default'] = xdefault;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        const request = this.client.call(
            'post',
            uri,
            {
                'X-Appwrite-Project': this.client.config.project,
                'content-type': 'application/json',
                accept: 'application/json',
            },
            apiPayload,
        );
        const defaults = {
            root: 'videoCaption',
            models: {
                videoCaption: {
                    defaults: {
                        $id: '',
                        $createdAt: '',
                        $updatedAt: '',
                        videoId: '',
                        bucketId: '',
                        fileId: '',
                        name: '',
                        language: '',
                        default: false,
                        embedded: false,
                        targetDuration: 0,
                        status: 'pending',
                        error: '',
                        size: 0,
                    },
                },
            },
        };

        return request.then((response) => applyDefaults(response, defaults));
    }

    /**
     * Update a caption track by its unique ID. Pass only `name`, `language`, and/or `default` to retag an extracted track (for example `und` → `heb` for Hebrew) without replacing the file. Changing `bucketId`/`fileId` re-packages the track in the background.
     *
     *
     * @param {string} params.videoId - Video unique ID.
     * @param {string} params.captionId - Caption unique ID.
     * @param {string} params.bucketId - Storage bucket unique ID holding the caption file. Omit together with fileId to only update name, language, or default.
     * @param {string} params.fileId - Caption file unique ID. Omit together with bucketId to only update name, language, or default.
     * @param {string} params.name - Caption display name. Allowed characters: a-z, A-Z, 0-9, space, and - . , ( ) _ '
     * @param {string} params.language - Caption ISO 639-2 three-letter language code (for example `heb` for Hebrew).
     * @param {boolean | null} params.xdefault - Make this the default caption track for the video. Omit to leave unchanged.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    updateCaption(params: {
        videoId: string;
        captionId: string;
        bucketId?: string;
        fileId?: string;
        name?: string;
        language?: string;
        xdefault?: boolean | null;
    }): Promise<Models.VideoCaption>;
    /**
     * Update a caption track by its unique ID. Pass only `name`, `language`, and/or `default` to retag an extracted track (for example `und` → `heb` for Hebrew) without replacing the file. Changing `bucketId`/`fileId` re-packages the track in the background.
     *
     *
     * @param {string} videoId - Video unique ID.
     * @param {string} captionId - Caption unique ID.
     * @param {string} bucketId - Storage bucket unique ID holding the caption file. Omit together with fileId to only update name, language, or default.
     * @param {string} fileId - Caption file unique ID. Omit together with bucketId to only update name, language, or default.
     * @param {string} name - Caption display name. Allowed characters: a-z, A-Z, 0-9, space, and - . , ( ) _ '
     * @param {string} language - Caption ISO 639-2 three-letter language code (for example `heb` for Hebrew).
     * @param {boolean | null} xdefault - Make this the default caption track for the video. Omit to leave unchanged.
     * @throws {AppwriteException}
     * @returns {Promise<Models.VideoCaption>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    updateCaption(
        videoId: string,
        captionId: string,
        bucketId?: string,
        fileId?: string,
        name?: string,
        language?: string,
        xdefault?: boolean | null,
    ): Promise<Models.VideoCaption>;
    updateCaption(
        paramsOrFirst:
            | {
                  videoId: string;
                  captionId: string;
                  bucketId?: string;
                  fileId?: string;
                  name?: string;
                  language?: string;
                  xdefault?: boolean | null;
              }
            | string,
        ...rest: [
            string?,
            string?,
            string?,
            string?,
            string?,
            (boolean | null)?,
        ]
    ): Promise<Models.VideoCaption> {
        let params: {
            videoId: string;
            captionId: string;
            bucketId?: string;
            fileId?: string;
            name?: string;
            language?: string;
            xdefault?: boolean | null;
        };

        if (
            paramsOrFirst &&
            typeof paramsOrFirst === 'object' &&
            !Array.isArray(paramsOrFirst)
        ) {
            params = (paramsOrFirst || {}) as {
                videoId: string;
                captionId: string;
                bucketId?: string;
                fileId?: string;
                name?: string;
                language?: string;
                xdefault?: boolean | null;
            };
        } else {
            params = {
                videoId: paramsOrFirst as string,
                captionId: rest[0] as string,
                bucketId: rest[1] as string,
                fileId: rest[2] as string,
                name: rest[3] as string,
                language: rest[4] as string,
                xdefault: rest[5] as boolean | null,
            };
        }

        const videoId = params.videoId;
        const captionId = params.captionId;
        const bucketId = params.bucketId;
        const fileId = params.fileId;
        const name = params.name;
        const language = params.language;
        const xdefault = params.xdefault;

        if (typeof videoId === 'undefined' || videoId === '') {
            throw new AppwriteException(
                'Missing required parameter: "videoId"',
            );
        }

        if (typeof captionId === 'undefined' || captionId === '') {
            throw new AppwriteException(
                'Missing required parameter: "captionId"',
            );
        }

        const apiPath = '/videos/{videoId}/captions/{captionId}'
            .replace('{videoId}', encodePath(videoId))
            .replace('{captionId}', encodePath(captionId));
        const apiPayload: Payload = {};

        if (typeof bucketId !== 'undefined') {
            apiPayload['bucketId'] = bucketId;
        }

        if (typeof fileId !== 'undefined') {
            apiPayload['fileId'] = fileId;
        }

        if (typeof name !== 'undefined') {
            apiPayload['name'] = name;
        }

        if (typeof language !== 'undefined') {
            apiPayload['language'] = language;
        }

        if (typeof xdefault !== 'undefined') {
            apiPayload['default'] = xdefault;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        const request = this.client.call(
            'patch',
            uri,
            {
                'X-Appwrite-Project': this.client.config.project,
                'content-type': 'application/json',
                accept: 'application/json',
            },
            apiPayload,
        );
        const defaults = {
            root: 'videoCaption',
            models: {
                videoCaption: {
                    defaults: {
                        $id: '',
                        $createdAt: '',
                        $updatedAt: '',
                        videoId: '',
                        bucketId: '',
                        fileId: '',
                        name: '',
                        language: '',
                        default: false,
                        embedded: false,
                        targetDuration: 0,
                        status: 'pending',
                        error: '',
                        size: 0,
                    },
                },
            },
        };

        return request.then((response) => applyDefaults(response, defaults));
    }

    /**
     * Delete a caption track by its unique ID, along with its packaged segments.
     *
     *
     * @param {string} params.videoId - Video unique ID.
     * @param {string} params.captionId - Caption unique ID.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    deleteCaption(params: { videoId: string; captionId: string }): Promise<{}>;
    /**
     * Delete a caption track by its unique ID, along with its packaged segments.
     *
     *
     * @param {string} videoId - Video unique ID.
     * @param {string} captionId - Caption unique ID.
     * @throws {AppwriteException}
     * @returns {Promise<{}>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    deleteCaption(videoId: string, captionId: string): Promise<{}>;
    deleteCaption(
        paramsOrFirst: { videoId: string; captionId: string } | string,
        ...rest: [string?]
    ): Promise<{}> {
        let params: { videoId: string; captionId: string };

        if (
            paramsOrFirst &&
            typeof paramsOrFirst === 'object' &&
            !Array.isArray(paramsOrFirst)
        ) {
            params = (paramsOrFirst || {}) as {
                videoId: string;
                captionId: string;
            };
        } else {
            params = {
                videoId: paramsOrFirst as string,
                captionId: rest[0] as string,
            };
        }

        const videoId = params.videoId;
        const captionId = params.captionId;

        if (typeof videoId === 'undefined' || videoId === '') {
            throw new AppwriteException(
                'Missing required parameter: "videoId"',
            );
        }

        if (typeof captionId === 'undefined' || captionId === '') {
            throw new AppwriteException(
                'Missing required parameter: "captionId"',
            );
        }

        const apiPath = '/videos/{videoId}/captions/{captionId}'
            .replace('{videoId}', encodePath(videoId))
            .replace('{captionId}', encodePath(captionId));
        const apiPayload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call(
            'delete',
            uri,
            {
                'X-Appwrite-Project': this.client.config.project,
                'content-type': 'application/json',
                accept: 'application/json',
            },
            apiPayload,
        );
    }

    /**
     * Get the top-level streaming manifest for a video output: an HLS master playlist (`master.m3u8`) or a DASH MPD (`master.mpd`). Hand this URL to a player to begin adaptive playback.
     *
     * Guests can request this URL when they hold `videos.play` (or `videos.read`) **and** the video document grants them read. A video with `read("any")` or `read("guests")` is playable without a session.
     *
     * For CMAF renditions, use `getCmafHlsManifest` or `getCmafDashManifest`. Both masters point at the same fMP4 segment set.
     *
     *
     * @param {string} params.videoId - Video unique ID.
     * @throws {AppwriteException}
     * @returns {ArrayBuffer}
     */
    getCmafHlsManifest(params: { videoId: string }): Promise<ArrayBuffer>;
    /**
     * Get the top-level streaming manifest for a video output: an HLS master playlist (`master.m3u8`) or a DASH MPD (`master.mpd`). Hand this URL to a player to begin adaptive playback.
     *
     * Guests can request this URL when they hold `videos.play` (or `videos.read`) **and** the video document grants them read. A video with `read("any")` or `read("guests")` is playable without a session.
     *
     * For CMAF renditions, use `getCmafHlsManifest` or `getCmafDashManifest`. Both masters point at the same fMP4 segment set.
     *
     *
     * @param {string} videoId - Video unique ID.
     * @throws {AppwriteException}
     * @returns {Promise<ArrayBuffer>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    getCmafHlsManifest(videoId: string): Promise<ArrayBuffer>;
    getCmafHlsManifest(
        paramsOrFirst: { videoId: string } | string,
    ): Promise<ArrayBuffer> {
        let params: { videoId: string };

        if (
            paramsOrFirst &&
            typeof paramsOrFirst === 'object' &&
            !Array.isArray(paramsOrFirst)
        ) {
            params = (paramsOrFirst || {}) as { videoId: string };
        } else {
            params = {
                videoId: paramsOrFirst as string,
            };
        }

        const videoId = params.videoId;

        if (typeof videoId === 'undefined' || videoId === '') {
            throw new AppwriteException(
                'Missing required parameter: "videoId"',
            );
        }

        const apiPath = '/videos/{videoId}/outputs/cmaf/master.m3u8'.replace(
            '{videoId}',
            encodePath(videoId),
        );
        const apiPayload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        apiPayload['project'] = this.client.config.project;

        apiPayload['impersonateuserid'] = this.client.config.impersonateuserid;

        for (const [key, value] of Object.entries(
            Service.flatten(apiPayload),
        )) {
            uri.searchParams.append(key, value);
        }
        return this.client.call(
            'get',
            uri,
            {
                'X-Appwrite-Project': this.client.config.project,
                accept: '*/*',
            },
            apiPayload,
            'arrayBuffer',
        );
    }

    /**
     * Get the top-level streaming manifest for a video output: an HLS master playlist (`master.m3u8`) or a DASH MPD (`master.mpd`). Hand this URL to a player to begin adaptive playback.
     *
     * Guests can request this URL when they hold `videos.play` (or `videos.read`) **and** the video document grants them read. A video with `read("any")` or `read("guests")` is playable without a session.
     *
     * For CMAF renditions, use `getCmafHlsManifest` or `getCmafDashManifest`. Both masters point at the same fMP4 segment set.
     *
     *
     * @param {string} params.videoId - Video unique ID.
     * @throws {AppwriteException}
     * @returns {ArrayBuffer}
     */
    getCmafDashManifest(params: { videoId: string }): Promise<ArrayBuffer>;
    /**
     * Get the top-level streaming manifest for a video output: an HLS master playlist (`master.m3u8`) or a DASH MPD (`master.mpd`). Hand this URL to a player to begin adaptive playback.
     *
     * Guests can request this URL when they hold `videos.play` (or `videos.read`) **and** the video document grants them read. A video with `read("any")` or `read("guests")` is playable without a session.
     *
     * For CMAF renditions, use `getCmafHlsManifest` or `getCmafDashManifest`. Both masters point at the same fMP4 segment set.
     *
     *
     * @param {string} videoId - Video unique ID.
     * @throws {AppwriteException}
     * @returns {Promise<ArrayBuffer>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    getCmafDashManifest(videoId: string): Promise<ArrayBuffer>;
    getCmafDashManifest(
        paramsOrFirst: { videoId: string } | string,
    ): Promise<ArrayBuffer> {
        let params: { videoId: string };

        if (
            paramsOrFirst &&
            typeof paramsOrFirst === 'object' &&
            !Array.isArray(paramsOrFirst)
        ) {
            params = (paramsOrFirst || {}) as { videoId: string };
        } else {
            params = {
                videoId: paramsOrFirst as string,
            };
        }

        const videoId = params.videoId;

        if (typeof videoId === 'undefined' || videoId === '') {
            throw new AppwriteException(
                'Missing required parameter: "videoId"',
            );
        }

        const apiPath = '/videos/{videoId}/outputs/cmaf/master.mpd'.replace(
            '{videoId}',
            encodePath(videoId),
        );
        const apiPayload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        apiPayload['project'] = this.client.config.project;

        apiPayload['impersonateuserid'] = this.client.config.impersonateuserid;

        for (const [key, value] of Object.entries(
            Service.flatten(apiPayload),
        )) {
            uri.searchParams.append(key, value);
        }
        return this.client.call(
            'get',
            uri,
            {
                'X-Appwrite-Project': this.client.config.project,
                accept: '*/*',
            },
            apiPayload,
            'arrayBuffer',
        );
    }

    /**
     * Get the top-level streaming manifest for a video output: an HLS master playlist (`master.m3u8`) or a DASH MPD (`master.mpd`). Hand this URL to a player to begin adaptive playback.
     *
     * Guests can request this URL when they hold `videos.play` (or `videos.read`) **and** the video document grants them read. A video with `read("any")` or `read("guests")` is playable without a session.
     *
     * For CMAF renditions, use `getCmafHlsManifest` or `getCmafDashManifest`. Both masters point at the same fMP4 segment set.
     *
     *
     * @param {string} params.videoId - Video unique ID.
     * @throws {AppwriteException}
     * @returns {ArrayBuffer}
     */
    getDashManifest(params: { videoId: string }): Promise<ArrayBuffer>;
    /**
     * Get the top-level streaming manifest for a video output: an HLS master playlist (`master.m3u8`) or a DASH MPD (`master.mpd`). Hand this URL to a player to begin adaptive playback.
     *
     * Guests can request this URL when they hold `videos.play` (or `videos.read`) **and** the video document grants them read. A video with `read("any")` or `read("guests")` is playable without a session.
     *
     * For CMAF renditions, use `getCmafHlsManifest` or `getCmafDashManifest`. Both masters point at the same fMP4 segment set.
     *
     *
     * @param {string} videoId - Video unique ID.
     * @throws {AppwriteException}
     * @returns {Promise<ArrayBuffer>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    getDashManifest(videoId: string): Promise<ArrayBuffer>;
    getDashManifest(
        paramsOrFirst: { videoId: string } | string,
    ): Promise<ArrayBuffer> {
        let params: { videoId: string };

        if (
            paramsOrFirst &&
            typeof paramsOrFirst === 'object' &&
            !Array.isArray(paramsOrFirst)
        ) {
            params = (paramsOrFirst || {}) as { videoId: string };
        } else {
            params = {
                videoId: paramsOrFirst as string,
            };
        }

        const videoId = params.videoId;

        if (typeof videoId === 'undefined' || videoId === '') {
            throw new AppwriteException(
                'Missing required parameter: "videoId"',
            );
        }

        const apiPath = '/videos/{videoId}/outputs/dash/master.mpd'.replace(
            '{videoId}',
            encodePath(videoId),
        );
        const apiPayload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        apiPayload['project'] = this.client.config.project;

        apiPayload['impersonateuserid'] = this.client.config.impersonateuserid;

        for (const [key, value] of Object.entries(
            Service.flatten(apiPayload),
        )) {
            uri.searchParams.append(key, value);
        }
        return this.client.call(
            'get',
            uri,
            {
                'X-Appwrite-Project': this.client.config.project,
                accept: '*/*',
            },
            apiPayload,
            'arrayBuffer',
        );
    }

    /**
     * Get the top-level streaming manifest for a video output: an HLS master playlist (`master.m3u8`) or a DASH MPD (`master.mpd`). Hand this URL to a player to begin adaptive playback.
     *
     * Guests can request this URL when they hold `videos.play` (or `videos.read`) **and** the video document grants them read. A video with `read("any")` or `read("guests")` is playable without a session.
     *
     * For CMAF renditions, use `getCmafHlsManifest` or `getCmafDashManifest`. Both masters point at the same fMP4 segment set.
     *
     *
     * @param {string} params.videoId - Video unique ID.
     * @throws {AppwriteException}
     * @returns {ArrayBuffer}
     */
    getHlsManifest(params: { videoId: string }): Promise<ArrayBuffer>;
    /**
     * Get the top-level streaming manifest for a video output: an HLS master playlist (`master.m3u8`) or a DASH MPD (`master.mpd`). Hand this URL to a player to begin adaptive playback.
     *
     * Guests can request this URL when they hold `videos.play` (or `videos.read`) **and** the video document grants them read. A video with `read("any")` or `read("guests")` is playable without a session.
     *
     * For CMAF renditions, use `getCmafHlsManifest` or `getCmafDashManifest`. Both masters point at the same fMP4 segment set.
     *
     *
     * @param {string} videoId - Video unique ID.
     * @throws {AppwriteException}
     * @returns {Promise<ArrayBuffer>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    getHlsManifest(videoId: string): Promise<ArrayBuffer>;
    getHlsManifest(
        paramsOrFirst: { videoId: string } | string,
    ): Promise<ArrayBuffer> {
        let params: { videoId: string };

        if (
            paramsOrFirst &&
            typeof paramsOrFirst === 'object' &&
            !Array.isArray(paramsOrFirst)
        ) {
            params = (paramsOrFirst || {}) as { videoId: string };
        } else {
            params = {
                videoId: paramsOrFirst as string,
            };
        }

        const videoId = params.videoId;

        if (typeof videoId === 'undefined' || videoId === '') {
            throw new AppwriteException(
                'Missing required parameter: "videoId"',
            );
        }

        const apiPath = '/videos/{videoId}/outputs/hls/master.m3u8'.replace(
            '{videoId}',
            encodePath(videoId),
        );
        const apiPayload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        apiPayload['project'] = this.client.config.project;

        apiPayload['impersonateuserid'] = this.client.config.impersonateuserid;

        for (const [key, value] of Object.entries(
            Service.flatten(apiPayload),
        )) {
            uri.searchParams.append(key, value);
        }
        return this.client.call(
            'get',
            uri,
            {
                'X-Appwrite-Project': this.client.config.project,
                accept: '*/*',
            },
            apiPayload,
            'arrayBuffer',
        );
    }

    /**
     * Get the playable caption resource for a video output: an HLS captions playlist, or the WebVTT file itself for DASH.
     *
     * Guests can request this URL when they hold `videos.play` (or `videos.read`) **and** the video document grants them read.
     *
     *
     * @param {string} params.videoId - Video unique ID.
     * @param {VideoOutput} params.output - Streaming output format.
     * @param {string} params.captionId - Caption unique ID.
     * @throws {AppwriteException}
     * @returns {ArrayBuffer}
     */
    getCaptionManifest(params: {
        videoId: string;
        output: VideoOutput;
        captionId: string;
    }): Promise<ArrayBuffer>;
    /**
     * Get the playable caption resource for a video output: an HLS captions playlist, or the WebVTT file itself for DASH.
     *
     * Guests can request this URL when they hold `videos.play` (or `videos.read`) **and** the video document grants them read.
     *
     *
     * @param {string} videoId - Video unique ID.
     * @param {VideoOutput} output - Streaming output format.
     * @param {string} captionId - Caption unique ID.
     * @throws {AppwriteException}
     * @returns {Promise<ArrayBuffer>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    getCaptionManifest(
        videoId: string,
        output: VideoOutput,
        captionId: string,
    ): Promise<ArrayBuffer>;
    getCaptionManifest(
        paramsOrFirst:
            | { videoId: string; output: VideoOutput; captionId: string }
            | string,
        ...rest: [VideoOutput?, string?]
    ): Promise<ArrayBuffer> {
        let params: { videoId: string; output: VideoOutput; captionId: string };

        if (
            paramsOrFirst &&
            typeof paramsOrFirst === 'object' &&
            !Array.isArray(paramsOrFirst)
        ) {
            params = (paramsOrFirst || {}) as {
                videoId: string;
                output: VideoOutput;
                captionId: string;
            };
        } else {
            params = {
                videoId: paramsOrFirst as string,
                output: rest[0] as VideoOutput,
                captionId: rest[1] as string,
            };
        }

        const videoId = params.videoId;
        const output = params.output;
        const captionId = params.captionId;

        if (typeof videoId === 'undefined' || videoId === '') {
            throw new AppwriteException(
                'Missing required parameter: "videoId"',
            );
        }

        if (typeof output === 'undefined') {
            throw new AppwriteException('Missing required parameter: "output"');
        }

        if (typeof captionId === 'undefined' || captionId === '') {
            throw new AppwriteException(
                'Missing required parameter: "captionId"',
            );
        }

        const apiPath =
            '/videos/{videoId}/outputs/{output}/captions/{captionId}/manifest'
                .replace('{videoId}', encodePath(videoId))
                .replace('{output}', encodePath(output))
                .replace('{captionId}', encodePath(captionId));
        const apiPayload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        apiPayload['project'] = this.client.config.project;

        apiPayload['impersonateuserid'] = this.client.config.impersonateuserid;

        for (const [key, value] of Object.entries(
            Service.flatten(apiPayload),
        )) {
            uri.searchParams.append(key, value);
        }
        return this.client.call(
            'get',
            uri,
            {
                'X-Appwrite-Project': this.client.config.project,
                accept: '*/*',
            },
            apiPayload,
            'arrayBuffer',
        );
    }

    /**
     * Get a list of all the renditions of a video. You can use the query params to filter your results.
     *
     *
     * @param {string} params.videoId - Video unique ID.
     * @param {string[]} params.queries - Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: profileId, name, status, output, codec, width, height, videoBitRate, audioBitRate, size, startedAt, endedAt
     * @param {boolean} params.total - When set to false, the total count returned will be 0 and will not be calculated.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    listRenditions(params: {
        videoId: string;
        queries?: string[];
        total?: boolean;
    }): Promise<Models.VideoRenditionList>;
    /**
     * Get a list of all the renditions of a video. You can use the query params to filter your results.
     *
     *
     * @param {string} videoId - Video unique ID.
     * @param {string[]} queries - Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: profileId, name, status, output, codec, width, height, videoBitRate, audioBitRate, size, startedAt, endedAt
     * @param {boolean} total - When set to false, the total count returned will be 0 and will not be calculated.
     * @throws {AppwriteException}
     * @returns {Promise<Models.VideoRenditionList>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    listRenditions(
        videoId: string,
        queries?: string[],
        total?: boolean,
    ): Promise<Models.VideoRenditionList>;
    listRenditions(
        paramsOrFirst:
            { videoId: string; queries?: string[]; total?: boolean } | string,
        ...rest: [string[]?, boolean?]
    ): Promise<Models.VideoRenditionList> {
        let params: { videoId: string; queries?: string[]; total?: boolean };

        if (
            paramsOrFirst &&
            typeof paramsOrFirst === 'object' &&
            !Array.isArray(paramsOrFirst)
        ) {
            params = (paramsOrFirst || {}) as {
                videoId: string;
                queries?: string[];
                total?: boolean;
            };
        } else {
            params = {
                videoId: paramsOrFirst as string,
                queries: rest[0] as string[],
                total: rest[1] as boolean,
            };
        }

        const videoId = params.videoId;
        const queries = params.queries;
        const total = params.total;

        if (typeof videoId === 'undefined' || videoId === '') {
            throw new AppwriteException(
                'Missing required parameter: "videoId"',
            );
        }

        const apiPath = '/videos/{videoId}/renditions'.replace(
            '{videoId}',
            encodePath(videoId),
        );
        const apiPayload: Payload = {};

        if (typeof queries !== 'undefined') {
            apiPayload['queries'] = queries;
        }

        if (typeof total !== 'undefined') {
            apiPayload['total'] = total;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        const request = this.client.call(
            'get',
            uri,
            {
                'X-Appwrite-Project': this.client.config.project,
                accept: 'application/json',
            },
            apiPayload,
        );
        const defaults = {
            root: 'videoRenditionList',
            models: {
                videoRenditionList: {
                    defaults: {
                        total: 0,
                        renditions: [],
                    },
                    properties: {
                        renditions: {
                            items: 'videoRendition',
                        },
                    },
                },
                videoRendition: {
                    defaults: {
                        $id: '',
                        $createdAt: '',
                        $updatedAt: '',
                        videoId: '',
                        profileId: '',
                        name: '',
                        startedAt: '',
                        endedAt: '',
                        width: 0,
                        height: 0,
                        videoBitRate: 0,
                        audioBitRate: 0,
                        targetDuration: 0,
                        status: 'pending',
                        error: '',
                        progress: 0,
                        output: 'hls',
                        codec: 'h264',
                        size: 0,
                    },
                },
            },
        };

        return request.then((response) => applyDefaults(response, defaults));
    }

    /**
     * Get a rendition by its unique ID, including its current transcoding status and progress.
     *
     *
     * @param {string} params.videoId - Video unique ID.
     * @param {string} params.renditionId - Rendition unique ID.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    getRendition(params: {
        videoId: string;
        renditionId: string;
    }): Promise<Models.VideoRendition>;
    /**
     * Get a rendition by its unique ID, including its current transcoding status and progress.
     *
     *
     * @param {string} videoId - Video unique ID.
     * @param {string} renditionId - Rendition unique ID.
     * @throws {AppwriteException}
     * @returns {Promise<Models.VideoRendition>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    getRendition(
        videoId: string,
        renditionId: string,
    ): Promise<Models.VideoRendition>;
    getRendition(
        paramsOrFirst: { videoId: string; renditionId: string } | string,
        ...rest: [string?]
    ): Promise<Models.VideoRendition> {
        let params: { videoId: string; renditionId: string };

        if (
            paramsOrFirst &&
            typeof paramsOrFirst === 'object' &&
            !Array.isArray(paramsOrFirst)
        ) {
            params = (paramsOrFirst || {}) as {
                videoId: string;
                renditionId: string;
            };
        } else {
            params = {
                videoId: paramsOrFirst as string,
                renditionId: rest[0] as string,
            };
        }

        const videoId = params.videoId;
        const renditionId = params.renditionId;

        if (typeof videoId === 'undefined' || videoId === '') {
            throw new AppwriteException(
                'Missing required parameter: "videoId"',
            );
        }

        if (typeof renditionId === 'undefined' || renditionId === '') {
            throw new AppwriteException(
                'Missing required parameter: "renditionId"',
            );
        }

        const apiPath = '/videos/{videoId}/renditions/{renditionId}'
            .replace('{videoId}', encodePath(videoId))
            .replace('{renditionId}', encodePath(renditionId));
        const apiPayload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        const request = this.client.call(
            'get',
            uri,
            {
                'X-Appwrite-Project': this.client.config.project,
                accept: 'application/json',
            },
            apiPayload,
        );
        const defaults = {
            root: 'videoRendition',
            models: {
                videoRendition: {
                    defaults: {
                        $id: '',
                        $createdAt: '',
                        $updatedAt: '',
                        videoId: '',
                        profileId: '',
                        name: '',
                        startedAt: '',
                        endedAt: '',
                        width: 0,
                        height: 0,
                        videoBitRate: 0,
                        audioBitRate: 0,
                        targetDuration: 0,
                        status: 'pending',
                        error: '',
                        progress: 0,
                        output: 'hls',
                        codec: 'h264',
                        size: 0,
                    },
                },
            },
        };

        return request.then((response) => applyDefaults(response, defaults));
    }

    /**
     * Delete a rendition by its unique ID, along with its packaged segments and transcoded output. Fails with `video_rendition_in_progress` while the rendition is started or ended, unless it has not been updated within the rendition retention window.
     *
     *
     * @param {string} params.videoId - Video unique ID.
     * @param {string} params.renditionId - Rendition unique ID.
     * @throws {AppwriteException}
     * @returns {Promise}
     */
    deleteRendition(params: {
        videoId: string;
        renditionId: string;
    }): Promise<{}>;
    /**
     * Delete a rendition by its unique ID, along with its packaged segments and transcoded output. Fails with `video_rendition_in_progress` while the rendition is started or ended, unless it has not been updated within the rendition retention window.
     *
     *
     * @param {string} videoId - Video unique ID.
     * @param {string} renditionId - Rendition unique ID.
     * @throws {AppwriteException}
     * @returns {Promise<{}>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    deleteRendition(videoId: string, renditionId: string): Promise<{}>;
    deleteRendition(
        paramsOrFirst: { videoId: string; renditionId: string } | string,
        ...rest: [string?]
    ): Promise<{}> {
        let params: { videoId: string; renditionId: string };

        if (
            paramsOrFirst &&
            typeof paramsOrFirst === 'object' &&
            !Array.isArray(paramsOrFirst)
        ) {
            params = (paramsOrFirst || {}) as {
                videoId: string;
                renditionId: string;
            };
        } else {
            params = {
                videoId: paramsOrFirst as string,
                renditionId: rest[0] as string,
            };
        }

        const videoId = params.videoId;
        const renditionId = params.renditionId;

        if (typeof videoId === 'undefined' || videoId === '') {
            throw new AppwriteException(
                'Missing required parameter: "videoId"',
            );
        }

        if (typeof renditionId === 'undefined' || renditionId === '') {
            throw new AppwriteException(
                'Missing required parameter: "renditionId"',
            );
        }

        const apiPath = '/videos/{videoId}/renditions/{renditionId}'
            .replace('{videoId}', encodePath(videoId))
            .replace('{renditionId}', encodePath(renditionId));
        const apiPayload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return this.client.call(
            'delete',
            uri,
            {
                'X-Appwrite-Project': this.client.config.project,
                'content-type': 'application/json',
                accept: 'application/json',
            },
            apiPayload,
        );
    }

    /**
     * Get a single thumbnail sheet from a video's timeline as an image. You can resize the returned image and choose its output format.
     *
     * Guests can request this URL when they hold `videos.play` (or `videos.read`) **and** the video document grants them read.
     *
     *
     * @param {string} params.videoId - Video unique ID.
     * @param {string} params.thumbnailId - Thumbnail unique ID.
     * @param {number} params.width - Resize thumbnail image width, in pixels.
     * @param {number} params.height - Resize thumbnail image height, in pixels.
     * @param {ImageFormat} params.output - Output format type (jpeg, jpg, png, gif and webp).
     * @throws {AppwriteException}
     * @returns {ArrayBuffer}
     */
    getThumbnail(params: {
        videoId: string;
        thumbnailId: string;
        width?: number;
        height?: number;
        output?: ImageFormat;
    }): Promise<ArrayBuffer>;
    /**
     * Get a single thumbnail sheet from a video's timeline as an image. You can resize the returned image and choose its output format.
     *
     * Guests can request this URL when they hold `videos.play` (or `videos.read`) **and** the video document grants them read.
     *
     *
     * @param {string} videoId - Video unique ID.
     * @param {string} thumbnailId - Thumbnail unique ID.
     * @param {number} width - Resize thumbnail image width, in pixels.
     * @param {number} height - Resize thumbnail image height, in pixels.
     * @param {ImageFormat} output - Output format type (jpeg, jpg, png, gif and webp).
     * @throws {AppwriteException}
     * @returns {Promise<ArrayBuffer>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    getThumbnail(
        videoId: string,
        thumbnailId: string,
        width?: number,
        height?: number,
        output?: ImageFormat,
    ): Promise<ArrayBuffer>;
    getThumbnail(
        paramsOrFirst:
            | {
                  videoId: string;
                  thumbnailId: string;
                  width?: number;
                  height?: number;
                  output?: ImageFormat;
              }
            | string,
        ...rest: [string?, number?, number?, ImageFormat?]
    ): Promise<ArrayBuffer> {
        let params: {
            videoId: string;
            thumbnailId: string;
            width?: number;
            height?: number;
            output?: ImageFormat;
        };

        if (
            paramsOrFirst &&
            typeof paramsOrFirst === 'object' &&
            !Array.isArray(paramsOrFirst)
        ) {
            params = (paramsOrFirst || {}) as {
                videoId: string;
                thumbnailId: string;
                width?: number;
                height?: number;
                output?: ImageFormat;
            };
        } else {
            params = {
                videoId: paramsOrFirst as string,
                thumbnailId: rest[0] as string,
                width: rest[1] as number,
                height: rest[2] as number,
                output: rest[3] as ImageFormat,
            };
        }

        const videoId = params.videoId;
        const thumbnailId = params.thumbnailId;
        const width = params.width;
        const height = params.height;
        const output = params.output;

        if (typeof videoId === 'undefined' || videoId === '') {
            throw new AppwriteException(
                'Missing required parameter: "videoId"',
            );
        }

        if (typeof thumbnailId === 'undefined' || thumbnailId === '') {
            throw new AppwriteException(
                'Missing required parameter: "thumbnailId"',
            );
        }

        const apiPath = '/videos/{videoId}/thumbnails/{thumbnailId}'
            .replace('{videoId}', encodePath(videoId))
            .replace('{thumbnailId}', encodePath(thumbnailId));
        const apiPayload: Payload = {};

        if (typeof width !== 'undefined') {
            apiPayload['width'] = width;
        }

        if (typeof height !== 'undefined') {
            apiPayload['height'] = height;
        }

        if (typeof output !== 'undefined') {
            apiPayload['output'] = output;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        apiPayload['project'] = this.client.config.project;

        apiPayload['impersonateuserid'] = this.client.config.impersonateuserid;

        for (const [key, value] of Object.entries(
            Service.flatten(apiPayload),
        )) {
            uri.searchParams.append(key, value);
        }
        return this.client.call(
            'get',
            uri,
            {
                'X-Appwrite-Project': this.client.config.project,
                accept: 'image/*',
            },
            apiPayload,
            'arrayBuffer',
        );
    }

    /**
     * Get the WebVTT thumbnail timeline for a video, used to render scrubbing thumbnails in a player. Timeline generation is queued when the video is created. Subscribe to `videos.[videoId].timelines.update` for probe and terminal updates, or poll this endpoint until it returns a WebVTT document. Audio-only sources produce no timeline and this endpoint returns `video_timelines_not_found`.
     *
     * Guests can request this URL when they hold `videos.play` (or `videos.read`) **and** the video document grants them read. A video with `read("any")` or `read("guests")` is playable without a session.
     *
     *
     * @param {string} params.videoId - Video unique ID.
     * @throws {AppwriteException}
     * @returns {ArrayBuffer}
     */
    getTimeline(params: { videoId: string }): Promise<ArrayBuffer>;
    /**
     * Get the WebVTT thumbnail timeline for a video, used to render scrubbing thumbnails in a player. Timeline generation is queued when the video is created. Subscribe to `videos.[videoId].timelines.update` for probe and terminal updates, or poll this endpoint until it returns a WebVTT document. Audio-only sources produce no timeline and this endpoint returns `video_timelines_not_found`.
     *
     * Guests can request this URL when they hold `videos.play` (or `videos.read`) **and** the video document grants them read. A video with `read("any")` or `read("guests")` is playable without a session.
     *
     *
     * @param {string} videoId - Video unique ID.
     * @throws {AppwriteException}
     * @returns {Promise<ArrayBuffer>}
     * @deprecated Use the object parameter style method for a better developer experience.
     */
    getTimeline(videoId: string): Promise<ArrayBuffer>;
    getTimeline(
        paramsOrFirst: { videoId: string } | string,
    ): Promise<ArrayBuffer> {
        let params: { videoId: string };

        if (
            paramsOrFirst &&
            typeof paramsOrFirst === 'object' &&
            !Array.isArray(paramsOrFirst)
        ) {
            params = (paramsOrFirst || {}) as { videoId: string };
        } else {
            params = {
                videoId: paramsOrFirst as string,
            };
        }

        const videoId = params.videoId;

        if (typeof videoId === 'undefined' || videoId === '') {
            throw new AppwriteException(
                'Missing required parameter: "videoId"',
            );
        }

        const apiPath = '/videos/{videoId}/timeline'.replace(
            '{videoId}',
            encodePath(videoId),
        );
        const apiPayload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        apiPayload['project'] = this.client.config.project;

        apiPayload['impersonateuserid'] = this.client.config.impersonateuserid;

        for (const [key, value] of Object.entries(
            Service.flatten(apiPayload),
        )) {
            uri.searchParams.append(key, value);
        }
        return this.client.call(
            'get',
            uri,
            {
                'X-Appwrite-Project': this.client.config.project,
                accept: '*/*',
            },
            apiPayload,
            'arrayBuffer',
        );
    }

    /**
     * Get the top-level streaming manifest for a video output: an HLS master
     * playlist (`master.m3u8`) or a DASH MPD (`master.mpd`). Hand this URL to a
     * player to begin adaptive playback.
     *
     * Guests can request this URL when they hold `videos.play` (or `videos.read`)
     * **and** the video document grants them read. A video with `read(&quot;any&quot;)` or
     * `read(&quot;guests&quot;)` is playable without a session.
     *
     * For CMAF renditions, use `getCmafHlsManifest` or `getCmafDashManifest`.
     * Both masters point at the same fMP4 segment set.
     *
     *
     * @param {string} videoId
     * @throws {AppwriteException}
     * @returns {URL}
     */
    getCmafHlsManifestURL(videoId: string): URL {
        if (typeof videoId === 'undefined' || videoId === '') {
            throw new AppwriteException(
                'Missing required parameter: "videoId"',
            );
        }

        const apiPath = '/videos/{videoId}/outputs/cmaf/master.m3u8'.replace(
            '{videoId}',
            encodePath(videoId),
        );
        const apiPayload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        apiPayload['project'] = this.client.config.project;

        apiPayload['impersonateuserid'] = this.client.config.impersonateuserid;

        for (const [key, value] of Object.entries(
            Service.flatten(apiPayload),
        )) {
            uri.searchParams.append(key, value);
        }

        return uri;
    }

    /**
     * Get the top-level streaming manifest for a video output: an HLS master
     * playlist (`master.m3u8`) or a DASH MPD (`master.mpd`). Hand this URL to a
     * player to begin adaptive playback.
     *
     * Guests can request this URL when they hold `videos.play` (or `videos.read`)
     * **and** the video document grants them read. A video with `read(&quot;any&quot;)` or
     * `read(&quot;guests&quot;)` is playable without a session.
     *
     * For CMAF renditions, use `getCmafHlsManifest` or `getCmafDashManifest`.
     * Both masters point at the same fMP4 segment set.
     *
     *
     * @param {string} videoId
     * @throws {AppwriteException}
     * @returns {URL}
     */
    getCmafDashManifestURL(videoId: string): URL {
        if (typeof videoId === 'undefined' || videoId === '') {
            throw new AppwriteException(
                'Missing required parameter: "videoId"',
            );
        }

        const apiPath = '/videos/{videoId}/outputs/cmaf/master.mpd'.replace(
            '{videoId}',
            encodePath(videoId),
        );
        const apiPayload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        apiPayload['project'] = this.client.config.project;

        apiPayload['impersonateuserid'] = this.client.config.impersonateuserid;

        for (const [key, value] of Object.entries(
            Service.flatten(apiPayload),
        )) {
            uri.searchParams.append(key, value);
        }

        return uri;
    }

    /**
     * Get the top-level streaming manifest for a video output: an HLS master
     * playlist (`master.m3u8`) or a DASH MPD (`master.mpd`). Hand this URL to a
     * player to begin adaptive playback.
     *
     * Guests can request this URL when they hold `videos.play` (or `videos.read`)
     * **and** the video document grants them read. A video with `read(&quot;any&quot;)` or
     * `read(&quot;guests&quot;)` is playable without a session.
     *
     * For CMAF renditions, use `getCmafHlsManifest` or `getCmafDashManifest`.
     * Both masters point at the same fMP4 segment set.
     *
     *
     * @param {string} videoId
     * @throws {AppwriteException}
     * @returns {URL}
     */
    getDashManifestURL(videoId: string): URL {
        if (typeof videoId === 'undefined' || videoId === '') {
            throw new AppwriteException(
                'Missing required parameter: "videoId"',
            );
        }

        const apiPath = '/videos/{videoId}/outputs/dash/master.mpd'.replace(
            '{videoId}',
            encodePath(videoId),
        );
        const apiPayload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        apiPayload['project'] = this.client.config.project;

        apiPayload['impersonateuserid'] = this.client.config.impersonateuserid;

        for (const [key, value] of Object.entries(
            Service.flatten(apiPayload),
        )) {
            uri.searchParams.append(key, value);
        }

        return uri;
    }

    /**
     * Get the top-level streaming manifest for a video output: an HLS master
     * playlist (`master.m3u8`) or a DASH MPD (`master.mpd`). Hand this URL to a
     * player to begin adaptive playback.
     *
     * Guests can request this URL when they hold `videos.play` (or `videos.read`)
     * **and** the video document grants them read. A video with `read(&quot;any&quot;)` or
     * `read(&quot;guests&quot;)` is playable without a session.
     *
     * For CMAF renditions, use `getCmafHlsManifest` or `getCmafDashManifest`.
     * Both masters point at the same fMP4 segment set.
     *
     *
     * @param {string} videoId
     * @throws {AppwriteException}
     * @returns {URL}
     */
    getHlsManifestURL(videoId: string): URL {
        if (typeof videoId === 'undefined' || videoId === '') {
            throw new AppwriteException(
                'Missing required parameter: "videoId"',
            );
        }

        const apiPath = '/videos/{videoId}/outputs/hls/master.m3u8'.replace(
            '{videoId}',
            encodePath(videoId),
        );
        const apiPayload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        apiPayload['project'] = this.client.config.project;

        apiPayload['impersonateuserid'] = this.client.config.impersonateuserid;

        for (const [key, value] of Object.entries(
            Service.flatten(apiPayload),
        )) {
            uri.searchParams.append(key, value);
        }

        return uri;
    }

    /**
     * Get the playable caption resource for a video output: an HLS captions
     * playlist, or the WebVTT file itself for DASH.
     *
     * Guests can request this URL when they hold `videos.play` (or `videos.read`)
     * **and** the video document grants them read.
     *
     *
     * @param {string} videoId
     * @param {VideoOutput} output
     * @param {string} captionId
     * @throws {AppwriteException}
     * @returns {URL}
     */
    getCaptionManifestURL(
        videoId: string,
        output: VideoOutput,
        captionId: string,
    ): URL {
        if (typeof videoId === 'undefined' || videoId === '') {
            throw new AppwriteException(
                'Missing required parameter: "videoId"',
            );
        }

        if (typeof output === 'undefined') {
            throw new AppwriteException('Missing required parameter: "output"');
        }

        if (typeof captionId === 'undefined' || captionId === '') {
            throw new AppwriteException(
                'Missing required parameter: "captionId"',
            );
        }

        const apiPath =
            '/videos/{videoId}/outputs/{output}/captions/{captionId}/manifest'
                .replace('{videoId}', encodePath(videoId))
                .replace('{output}', encodePath(output))
                .replace('{captionId}', encodePath(captionId));
        const apiPayload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        apiPayload['project'] = this.client.config.project;

        apiPayload['impersonateuserid'] = this.client.config.impersonateuserid;

        for (const [key, value] of Object.entries(
            Service.flatten(apiPayload),
        )) {
            uri.searchParams.append(key, value);
        }

        return uri;
    }

    /**
     * Get a single thumbnail sheet from a video&#039;s timeline as an image. You can
     * resize the returned image and choose its output format.
     *
     * Guests can request this URL when they hold `videos.play` (or `videos.read`)
     * **and** the video document grants them read.
     *
     *
     * @param {string} videoId
     * @param {string} thumbnailId
     * @param {number} width
     * @param {number} height
     * @param {ImageFormat} output
     * @throws {AppwriteException}
     * @returns {URL}
     */
    getThumbnailURL(
        videoId: string,
        thumbnailId: string,
        width?: number,
        height?: number,
        output?: ImageFormat,
    ): URL {
        if (typeof videoId === 'undefined' || videoId === '') {
            throw new AppwriteException(
                'Missing required parameter: "videoId"',
            );
        }

        if (typeof thumbnailId === 'undefined' || thumbnailId === '') {
            throw new AppwriteException(
                'Missing required parameter: "thumbnailId"',
            );
        }

        const apiPath = '/videos/{videoId}/thumbnails/{thumbnailId}'
            .replace('{videoId}', encodePath(videoId))
            .replace('{thumbnailId}', encodePath(thumbnailId));
        const apiPayload: Payload = {};

        if (typeof width !== 'undefined') {
            apiPayload['width'] = width;
        }

        if (typeof height !== 'undefined') {
            apiPayload['height'] = height;
        }

        if (typeof output !== 'undefined') {
            apiPayload['output'] = output;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        apiPayload['project'] = this.client.config.project;

        apiPayload['impersonateuserid'] = this.client.config.impersonateuserid;

        for (const [key, value] of Object.entries(
            Service.flatten(apiPayload),
        )) {
            uri.searchParams.append(key, value);
        }

        return uri;
    }

    /**
     * Get the WebVTT thumbnail timeline for a video, used to render scrubbing
     * thumbnails in a player. Timeline generation is queued when the video is
     * created. Subscribe to `videos.[videoId].timelines.update` for probe and
     * terminal updates, or poll this endpoint until it returns a WebVTT document.
     * Audio-only sources produce no timeline and this endpoint returns
     * `video_timelines_not_found`.
     *
     * Guests can request this URL when they hold `videos.play` (or `videos.read`)
     * **and** the video document grants them read. A video with `read(&quot;any&quot;)` or
     * `read(&quot;guests&quot;)` is playable without a session.
     *
     *
     * @param {string} videoId
     * @throws {AppwriteException}
     * @returns {URL}
     */
    getTimelineURL(videoId: string): URL {
        if (typeof videoId === 'undefined' || videoId === '') {
            throw new AppwriteException(
                'Missing required parameter: "videoId"',
            );
        }

        const apiPath = '/videos/{videoId}/timeline'.replace(
            '{videoId}',
            encodePath(videoId),
        );
        const apiPayload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        apiPayload['project'] = this.client.config.project;

        apiPayload['impersonateuserid'] = this.client.config.impersonateuserid;

        for (const [key, value] of Object.entries(
            Service.flatten(apiPayload),
        )) {
            uri.searchParams.append(key, value);
        }

        return uri;
    }
}

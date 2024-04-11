import { Service } from '../service';
import { AppwriteException, Client } from '../client';
import type { Models } from '../models';
import type { UploadProgress, Payload } from '../client';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

import { ImageGravity } from '../enums/image-gravity';
import { ImageFormat } from '../enums/image-format';

export class Storage extends Service {

     constructor(client: Client)
     {
        super(client);
     }

    /**
     * List files
     *
     * Get a list of all the user files. You can use the query params to filter
     * your results.
     *
     * @param {string} bucketId
     * @param {string[]} queries
     * @param {string} search
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async listFiles(bucketId: string, queries?: string[], search?: string): Promise<Models.FileList> {
        if (typeof bucketId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "bucketId"');
        }

        const apiPath = '/storage/buckets/{bucketId}/files'.replace('{bucketId}', bucketId);
        const payload: Payload = {};

        if (typeof queries !== 'undefined') {
            payload['queries'] = queries;
        }

        if (typeof search !== 'undefined') {
            payload['search'] = search;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return await this.client.call('get', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Create file
     *
     * Create a new file. Before using this route, you should create a new bucket
     * resource using either a [server
     * integration](https://appwrite.io/docs/server/storage#storageCreateBucket)
     * API or directly from your Appwrite console.
     * 
     * Larger files should be uploaded using multiple requests with the
     * [content-range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Range)
     * header to send a partial request with a maximum supported chunk of `5MB`.
     * The `content-range` header values should always be in bytes.
     * 
     * When the first request is sent, the server will return the **File** object,
     * and the subsequent part request must include the file's **id** in
     * `x-appwrite-id` header to allow the server to know that the partial upload
     * is for the existing file and not for a new one.
     * 
     * If you're creating a new file using one of the Appwrite SDKs, all the
     * chunking logic will be managed by the SDK internally.
     * 
     *
     * @param {string} bucketId
     * @param {string} fileId
     * @param {any} file
     * @param {string[]} permissions
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async createFile(bucketId: string, fileId: string, file: any, permissions?: string[], onProgress = (progress: UploadProgress) => {}): Promise<Models.File> {
        if (typeof bucketId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "bucketId"');
        }

        if (typeof fileId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "fileId"');
        }

        if (typeof file === 'undefined') {
            throw new AppwriteException('Missing required parameter: "file"');
        }

        const apiPath = '/storage/buckets/{bucketId}/files'.replace('{bucketId}', bucketId);
        const payload: Payload = {};

        if (typeof fileId !== 'undefined') {
            payload['fileId'] = fileId;
        }

        if (typeof file !== 'undefined') {
            payload['file'] = file;
        }

        if (typeof permissions !== 'undefined') {
            payload['permissions'] = permissions;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);

        const size = file.size;

        if (size <= Service.CHUNK_SIZE) {
            return await this.client.call('post', uri, {
                'content-type': 'multipart/form-data',
            }, payload);
        }

        const apiHeaders: { [header: string]: string } = {
            'content-type': 'multipart/form-data',
        }

        let offset = 0;
        let response = undefined;
        if(fileId != 'unique()') {
            try {
                response = await this.client.call('GET', new URL(this.client.config.endpoint + apiPath + '/' + fileId), apiHeaders);
                offset = response.chunksUploaded * Service.CHUNK_SIZE;
            } catch(e) {
            }
        }

        let timestamp = new Date().getTime();
        while (offset < size) {
            let end = Math.min(offset + Service.CHUNK_SIZE - 1, size - 1);

            apiHeaders['content-range'] = 'bytes ' + offset + '-' + end + '/' + size;
            if (response && response.$id) {
                apiHeaders['x-appwrite-id'] = response.$id;
            }

            let chunk = await FileSystem.readAsStringAsync(file.uri, {
                encoding: FileSystem.EncodingType.Base64,
                position: offset,
                length: Service.CHUNK_SIZE
            });
            var path = `data:${file.type};base64,${chunk}`;
            if (Platform.OS.toLowerCase() === 'android') {
                path = FileSystem.cacheDirectory + '/tmp_chunk_' + timestamp;
                await FileSystem.writeAsStringAsync(path, chunk, {encoding: FileSystem.EncodingType.Base64});
            }

            payload['file'] = { uri: path, name: file.name, type: file.type };

            response = await this.client.call('post', uri, apiHeaders, payload);

            if (onProgress) {
                onProgress({
                    $id: response.$id,
                    progress: (offset / size) * 100,
                    sizeUploaded: offset,
                    chunksTotal: response.chunksTotal,
                    chunksUploaded: response.chunksUploaded
                });
            }
            offset += Service.CHUNK_SIZE;
        }
        return response;
    }

    /**
     * Get file
     *
     * Get a file by its unique ID. This endpoint response returns a JSON object
     * with the file metadata.
     *
     * @param {string} bucketId
     * @param {string} fileId
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async getFile(bucketId: string, fileId: string): Promise<Models.File> {
        if (typeof bucketId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "bucketId"');
        }

        if (typeof fileId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "fileId"');
        }

        const apiPath = '/storage/buckets/{bucketId}/files/{fileId}'.replace('{bucketId}', bucketId).replace('{fileId}', fileId);
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return await this.client.call('get', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Update file
     *
     * Update a file by its unique ID. Only users with write permissions have
     * access to update this resource.
     *
     * @param {string} bucketId
     * @param {string} fileId
     * @param {string} name
     * @param {string[]} permissions
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async updateFile(bucketId: string, fileId: string, name?: string, permissions?: string[]): Promise<Models.File> {
        if (typeof bucketId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "bucketId"');
        }

        if (typeof fileId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "fileId"');
        }

        const apiPath = '/storage/buckets/{bucketId}/files/{fileId}'.replace('{bucketId}', bucketId).replace('{fileId}', fileId);
        const payload: Payload = {};

        if (typeof name !== 'undefined') {
            payload['name'] = name;
        }

        if (typeof permissions !== 'undefined') {
            payload['permissions'] = permissions;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        return await this.client.call('put', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Delete File
     *
     * Delete a file by its unique ID. Only users with write permissions have
     * access to delete this resource.
     *
     * @param {string} bucketId
     * @param {string} fileId
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async deleteFile(bucketId: string, fileId: string): Promise<{}> {
        if (typeof bucketId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "bucketId"');
        }

        if (typeof fileId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "fileId"');
        }

        const apiPath = '/storage/buckets/{bucketId}/files/{fileId}'.replace('{bucketId}', bucketId).replace('{fileId}', fileId);
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        return await this.client.call('delete', uri, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Get file for download
     *
     * Get a file content by its unique ID. The endpoint response return with a
     * 'Content-Disposition: attachment' header that tells the browser to start
     * downloading the file to user downloads directory.
     *
     * @param {string} bucketId
     * @param {string} fileId
     * @throws {AppwriteException}
     * @returns {URL}
    */
    getFileDownload(bucketId: string, fileId: string): URL {
        if (typeof bucketId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "bucketId"');
        }

        if (typeof fileId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "fileId"');
        }

        const apiPath = '/storage/buckets/{bucketId}/files/{fileId}/download'.replace('{bucketId}', bucketId).replace('{fileId}', fileId);
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        payload['project'] = this.client.config.project;


        for (const [key, value] of Object.entries(Service.flatten(payload))) {
            uri.searchParams.append(key, value);
        }
        return uri;
    }

    /**
     * Get file preview
     *
     * Get a file preview image. Currently, this method supports preview for image
     * files (jpg, png, and gif), other supported formats, like pdf, docs, slides,
     * and spreadsheets, will return the file icon image. You can also pass query
     * string arguments for cutting and resizing your preview image. Preview is
     * supported only for image files smaller than 10MB.
     *
     * @param {string} bucketId
     * @param {string} fileId
     * @param {number} width
     * @param {number} height
     * @param {ImageGravity} gravity
     * @param {number} quality
     * @param {number} borderWidth
     * @param {string} borderColor
     * @param {number} borderRadius
     * @param {number} opacity
     * @param {number} rotation
     * @param {string} background
     * @param {ImageFormat} output
     * @throws {AppwriteException}
     * @returns {URL}
    */
    getFilePreview(bucketId: string, fileId: string, width?: number, height?: number, gravity?: ImageGravity, quality?: number, borderWidth?: number, borderColor?: string, borderRadius?: number, opacity?: number, rotation?: number, background?: string, output?: ImageFormat): URL {
        if (typeof bucketId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "bucketId"');
        }

        if (typeof fileId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "fileId"');
        }

        const apiPath = '/storage/buckets/{bucketId}/files/{fileId}/preview'.replace('{bucketId}', bucketId).replace('{fileId}', fileId);
        const payload: Payload = {};

        if (typeof width !== 'undefined') {
            payload['width'] = width;
        }

        if (typeof height !== 'undefined') {
            payload['height'] = height;
        }

        if (typeof gravity !== 'undefined') {
            payload['gravity'] = gravity;
        }

        if (typeof quality !== 'undefined') {
            payload['quality'] = quality;
        }

        if (typeof borderWidth !== 'undefined') {
            payload['borderWidth'] = borderWidth;
        }

        if (typeof borderColor !== 'undefined') {
            payload['borderColor'] = borderColor;
        }

        if (typeof borderRadius !== 'undefined') {
            payload['borderRadius'] = borderRadius;
        }

        if (typeof opacity !== 'undefined') {
            payload['opacity'] = opacity;
        }

        if (typeof rotation !== 'undefined') {
            payload['rotation'] = rotation;
        }

        if (typeof background !== 'undefined') {
            payload['background'] = background;
        }

        if (typeof output !== 'undefined') {
            payload['output'] = output;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);
        payload['project'] = this.client.config.project;


        for (const [key, value] of Object.entries(Service.flatten(payload))) {
            uri.searchParams.append(key, value);
        }
        return uri;
    }

    /**
     * Get file for view
     *
     * Get a file content by its unique ID. This endpoint is similar to the
     * download method but returns with no  'Content-Disposition: attachment'
     * header.
     *
     * @param {string} bucketId
     * @param {string} fileId
     * @throws {AppwriteException}
     * @returns {URL}
    */
    getFileView(bucketId: string, fileId: string): URL {
        if (typeof bucketId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "bucketId"');
        }

        if (typeof fileId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "fileId"');
        }

        const apiPath = '/storage/buckets/{bucketId}/files/{fileId}/view'.replace('{bucketId}', bucketId).replace('{fileId}', fileId);
        const payload: Payload = {};

        const uri = new URL(this.client.config.endpoint + apiPath);
        payload['project'] = this.client.config.project;


        for (const [key, value] of Object.entries(Service.flatten(payload))) {
            uri.searchParams.append(key, value);
        }
        return uri;
    }
};

import { Service } from '../service';
import { AppwriteException, Client } from '../client';
import { Payload } from '../payload';
import type { Models } from '../models';
import type { UploadProgress, Params } from '../client';
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
     * Get a list of all the user files. You can use the query params to filter your results.
     *
     * @param {string} bucketId
     * @param {string[]} queries
     * @param {string} search
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async listFiles(bucketId: string,queries?: string[],search?: string): Promise<Models.FileList> {
        if (typeof bucketId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "bucketId"');
        }

        const apiPath = '/storage/buckets/{bucketId}/files'.replace('{bucketId}', bucketId);
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
     * Create file
     *
     * Create a new file. Before using this route, you should create a new bucket resource using either a [server integration](https://appwrite.io/docs/server/storage#storageCreateBucket) API or directly from your Appwrite console.

Larger files should be uploaded using multiple requests with the [content-range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Range) header to send a partial request with a maximum supported chunk of `5MB`. The `content-range` header values should always be in bytes.

When the first request is sent, the server will return the **File** object, and the subsequent part request must include the file&#039;s **id** in `x-appwrite-id` header to allow the server to know that the partial upload is for the existing file and not for a new one.

If you&#039;re creating a new file using one of the Appwrite SDKs, all the chunking logic will be managed by the SDK internally.

     *
     * @param {string} bucketId
     * @param {string} fileId
     * @param {Payload} file
     * @param {string[]} permissions
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async createFile(bucketId: string,fileId: string,file: Payload,permissions?: string[], onProgress = (progress: UploadProgress) => {}): Promise<Models.File> {
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
        const params: Params = {};

        if (typeof fileId !== 'undefined') {
            params['fileId'] = fileId;
        }

        if (typeof file !== 'undefined') {
            params['file'] = file;
        }

        if (typeof permissions !== 'undefined') {
            params['permissions'] = permissions;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);

        const apiHeaders: { [header: string]: string } = {
            'content-type': 'multipart/form-data',
        }


        const size = file.size;

        if (size <= Service.CHUNK_SIZE) {
            params['file'] = file.toFileObject();
            return await this.client.call('post', uri, apiHeaders, params);
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

            let chunkBuffer = file.toBinary(offset, end - offset + 1);
            let chunk = btoa(String.fromCharCode(...chunkBuffer));

            var path = `data:$file.type};base64,${chunk}`;
            if (Platform.OS.toLowerCase() === 'android') {
                path = FileSystem.cacheDirectory + '/tmp_chunk_' + timestamp;
                await FileSystem.writeAsStringAsync(path, chunk, {encoding: FileSystem.EncodingType.Base64});
            }

            params['file'] = {
                uri: path,
                name: file.filename,
                type: file.type
            };

            response = await this.client.call('post', uri, apiHeaders, params);

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
     * Get a file by its unique ID. This endpoint response returns a JSON object with the file metadata.
     *
     * @param {string} bucketId
     * @param {string} fileId
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async getFile(bucketId: string,fileId: string): Promise<Models.File> {
        if (typeof bucketId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "bucketId"');
        }

        if (typeof fileId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "fileId"');
        }

        const apiPath = '/storage/buckets/{bucketId}/files/{fileId}'.replace('{bucketId}', bucketId).replace('{fileId}', fileId);
        const params: Params = {};

        const uri = new URL(this.client.config.endpoint + apiPath);

        const apiHeaders: { [header: string]: string } = {
            'content-type': 'application/json',
        }

        return await this.client.call('get', uri, apiHeaders, params);
    }

    /**
     * Update file
     *
     * Update a file by its unique ID. Only users with write permissions have access to update this resource.
     *
     * @param {string} bucketId
     * @param {string} fileId
     * @param {string} name
     * @param {string[]} permissions
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async updateFile(bucketId: string,fileId: string,name?: string,permissions?: string[]): Promise<Models.File> {
        if (typeof bucketId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "bucketId"');
        }

        if (typeof fileId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "fileId"');
        }

        const apiPath = '/storage/buckets/{bucketId}/files/{fileId}'.replace('{bucketId}', bucketId).replace('{fileId}', fileId);
        const params: Params = {};

        if (typeof name !== 'undefined') {
            params['name'] = name;
        }

        if (typeof permissions !== 'undefined') {
            params['permissions'] = permissions;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);

        const apiHeaders: { [header: string]: string } = {
            'content-type': 'application/json',
        }

        return await this.client.call('put', uri, apiHeaders, params);
    }

    /**
     * Delete file
     *
     * Delete a file by its unique ID. Only users with write permissions have access to delete this resource.
     *
     * @param {string} bucketId
     * @param {string} fileId
     * @throws {AppwriteException}
     * @returns {Promise}
    */
    async deleteFile(bucketId: string,fileId: string): Promise<{}> {
        if (typeof bucketId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "bucketId"');
        }

        if (typeof fileId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "fileId"');
        }

        const apiPath = '/storage/buckets/{bucketId}/files/{fileId}'.replace('{bucketId}', bucketId).replace('{fileId}', fileId);
        const params: Params = {};

        const uri = new URL(this.client.config.endpoint + apiPath);

        const apiHeaders: { [header: string]: string } = {
            'content-type': 'application/json',
        }

        return await this.client.call('delete', uri, apiHeaders, params);
    }

    /**
     * Get file for download
     *
     * Get a file content by its unique ID. The endpoint response return with a &#039;Content-Disposition: attachment&#039; header that tells the browser to start downloading the file to user downloads directory.
     *
     * @param {string} bucketId
     * @param {string} fileId
     * @throws {AppwriteException}
     * @returns {URL}
    */
    getFileDownload(bucketId: string,fileId: string): URL {
        if (typeof bucketId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "bucketId"');
        }

        if (typeof fileId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "fileId"');
        }

        const apiPath = '/storage/buckets/{bucketId}/files/{fileId}/download'.replace('{bucketId}', bucketId).replace('{fileId}', fileId);
        const params: Params = {};

        const uri = new URL(this.client.config.endpoint + apiPath);

        params['project'] = this.client.config.project;

        for (const [key, value] of Object.entries(Service.flatten(params))) {
            uri.searchParams.append(key, value);
        }
        return uri;
    }

    /**
     * Get file preview
     *
     * Get a file preview image. Currently, this method supports preview for image files (jpg, png, and gif), other supported formats, like pdf, docs, slides, and spreadsheets, will return the file icon image. You can also pass query string arguments for cutting and resizing your preview image. Preview is supported only for image files smaller than 10MB.
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
    getFilePreview(bucketId: string,fileId: string,width?: number,height?: number,gravity?: ImageGravity,quality?: number,borderWidth?: number,borderColor?: string,borderRadius?: number,opacity?: number,rotation?: number,background?: string,output?: ImageFormat): URL {
        if (typeof bucketId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "bucketId"');
        }

        if (typeof fileId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "fileId"');
        }

        const apiPath = '/storage/buckets/{bucketId}/files/{fileId}/preview'.replace('{bucketId}', bucketId).replace('{fileId}', fileId);
        const params: Params = {};

        if (typeof width !== 'undefined') {
            params['width'] = width;
        }

        if (typeof height !== 'undefined') {
            params['height'] = height;
        }

        if (typeof gravity !== 'undefined') {
            params['gravity'] = gravity;
        }

        if (typeof quality !== 'undefined') {
            params['quality'] = quality;
        }

        if (typeof borderWidth !== 'undefined') {
            params['borderWidth'] = borderWidth;
        }

        if (typeof borderColor !== 'undefined') {
            params['borderColor'] = borderColor;
        }

        if (typeof borderRadius !== 'undefined') {
            params['borderRadius'] = borderRadius;
        }

        if (typeof opacity !== 'undefined') {
            params['opacity'] = opacity;
        }

        if (typeof rotation !== 'undefined') {
            params['rotation'] = rotation;
        }

        if (typeof background !== 'undefined') {
            params['background'] = background;
        }

        if (typeof output !== 'undefined') {
            params['output'] = output;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);

        params['project'] = this.client.config.project;

        for (const [key, value] of Object.entries(Service.flatten(params))) {
            uri.searchParams.append(key, value);
        }
        return uri;
    }

    /**
     * Get file for view
     *
     * Get a file content by its unique ID. This endpoint is similar to the download method but returns with no  &#039;Content-Disposition: attachment&#039; header.
     *
     * @param {string} bucketId
     * @param {string} fileId
     * @throws {AppwriteException}
     * @returns {URL}
    */
    getFileView(bucketId: string,fileId: string): URL {
        if (typeof bucketId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "bucketId"');
        }

        if (typeof fileId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "fileId"');
        }

        const apiPath = '/storage/buckets/{bucketId}/files/{fileId}/view'.replace('{bucketId}', bucketId).replace('{fileId}', fileId);
        const params: Params = {};

        const uri = new URL(this.client.config.endpoint + apiPath);

        params['project'] = this.client.config.project;

        for (const [key, value] of Object.entries(Service.flatten(params))) {
            uri.searchParams.append(key, value);
        }
        return uri;
    }
};

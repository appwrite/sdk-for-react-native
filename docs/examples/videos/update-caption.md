```javascript
import { Client, Videos } from 'react-native-appwrite';

const client = new Client()
    .setEndpoint('https://<REGION>.cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('<YOUR_PROJECT_ID>'); // Your project ID

const videos = new Videos(client);

const result = await videos.updateCaption({
    videoId: '<VIDEO_ID>',
    captionId: '<CAPTION_ID>',
    bucketId: '<BUCKET_ID>', // optional
    fileId: '<FILE_ID>', // optional
    name: '<NAME>', // optional
    language: 'aar', // optional
    xdefault: false, // optional
});

console.log(result);
```

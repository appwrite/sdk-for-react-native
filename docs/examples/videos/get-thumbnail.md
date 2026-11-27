```javascript
import { Client, Videos, ImageFormat } from 'react-native-appwrite';

const client = new Client()
    .setEndpoint('https://<REGION>.cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('<YOUR_PROJECT_ID>'); // Your project ID

const videos = new Videos(client);

const result = await videos.getThumbnail({
    videoId: '<VIDEO_ID>',
    thumbnailId: '<THUMBNAIL_ID>',
    width: 0, // optional
    height: 0, // optional
    output: ImageFormat.Jpg, // optional
});

console.log(result);
```

```javascript
import { Client, Videos } from 'react-native-appwrite';

const client = new Client()
    .setEndpoint('https://<REGION>.cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('<YOUR_PROJECT_ID>'); // Your project ID

const videos = new Videos(client);

const result = await videos.deleteCaption({
    videoId: '<VIDEO_ID>',
    captionId: '<CAPTION_ID>',
});

console.log(result);
```

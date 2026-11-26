```javascript
import { Client, Videos, Permission, Role } from 'react-native-appwrite';

const client = new Client()
    .setEndpoint('https://<REGION>.cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('<YOUR_PROJECT_ID>'); // Your project ID

const videos = new Videos(client);

const result = await videos.update({
    videoId: '<VIDEO_ID>',
    name: '<NAME>', // optional
    permissions: [Permission.read(Role.any())], // optional
});

console.log(result);
```

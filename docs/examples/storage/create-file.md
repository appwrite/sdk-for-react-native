```javascript
import { Client, Storage, Permission, Role } from 'react-native-appwrite';

const client = new Client()
    .setEndpoint('https://<REGION>.cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('<YOUR_PROJECT_ID>'); // Your project ID

const storage = new Storage(client);

const result = await storage.createFile({
    bucketId: '<BUCKET_ID>',
    fileId: '<FILE_ID>',
    file: {
        name: 'image.png',
        type: 'image/png',
        size: 1024,
        uri: 'file:///path/to/image.png',
    },
    permissions: [Permission.read(Role.any())], // optional
    folder: 'photos/2026', // optional
});

console.log(result);
```

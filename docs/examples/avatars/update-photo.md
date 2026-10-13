```javascript
import { Client, Avatars } from 'react-native-appwrite';

const client = new Client()
    .setEndpoint('https://<REGION>.cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('<YOUR_PROJECT_ID>'); // Your project ID

const avatars = new Avatars(client);

const result = await avatars.updatePhoto({
    file: {
        name: 'image.png',
        type: 'image/png',
        size: 1024,
        uri: 'file:///path/to/image.png',
    },
});

console.log(result);
```

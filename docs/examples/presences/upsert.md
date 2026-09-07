```javascript
import { Client, Presences, Permission, Role } from 'react-native-appwrite';

const client = new Client()
    .setEndpoint('https://<REGION>.cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('<YOUR_PROJECT_ID>'); // Your project ID

const presences = new Presences(client);

const result = await presences.upsert({
    presenceId: '<PRESENCE_ID>',
    status: '<STATUS>',
    permissions: [Permission.read(Role.any())], // optional
    expiresAt: '2020-10-15T06:38:00.000+00:00', // optional
    metadata: {}, // optional
});

console.log(result);
```

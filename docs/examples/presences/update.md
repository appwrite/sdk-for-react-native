```javascript
import { Client, Presences, Permission, Role } from "react-native-appwrite";

const client = new Client()
    .setEndpoint('https://<REGION>.cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('<YOUR_PROJECT_ID>'); // Your project ID

const presences = new Presences(client);

const result = await presences.update({
    presenceId: '<PRESENCE_ID>',
    status: '<STATUS>', // optional
    expiresAt: '2020-10-15T06:38:00.000+00:00', // optional
    metadata: {}, // optional
    permissions: ["read("any")"], // optional
    purge: false // optional
});

console.log(result);
```

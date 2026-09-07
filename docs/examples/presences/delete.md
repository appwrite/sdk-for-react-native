```javascript
import { Client, Presences } from 'react-native-appwrite';

const client = new Client()
    .setEndpoint('https://<REGION>.cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('<YOUR_PROJECT_ID>'); // Your project ID

const presences = new Presences(client);

const result = await presences.delete({
    presenceId: '<PRESENCE_ID>',
});

console.log(result);
```

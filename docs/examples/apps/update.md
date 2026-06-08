```javascript
import { Client, Apps } from "react-native-appwrite";

const client = new Client()
    .setEndpoint('https://<REGION>.cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('<YOUR_PROJECT_ID>'); // Your project ID

const apps = new Apps(client);

const result = await apps.update({
    appId: '<APP_ID>',
    name: '<NAME>',
    enabled: false, // optional
    redirectUris: [], // optional
    type: 'public', // optional
    deviceFlow: false // optional
});

console.log(result);
```

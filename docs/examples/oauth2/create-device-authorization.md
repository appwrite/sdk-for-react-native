```javascript
import { Client, Oauth2 } from 'react-native-appwrite';

const client = new Client()
    .setEndpoint('https://<REGION>.cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('<YOUR_PROJECT_ID>'); // Your project ID

const oauth2 = new Oauth2(client);

const result = await oauth2.createDeviceAuthorization({
    clientId: '<CLIENT_ID>', // optional
    scope: '<SCOPE>', // optional
    authorizationDetails: '<AUTHORIZATION_DETAILS>', // optional
    resource: [], // optional
    audience: '<AUDIENCE>', // optional
});

console.log(result);
```

```javascript
import { Client, Oauth2 } from 'react-native-appwrite';

const client = new Client()
    .setEndpoint('https://<REGION>.cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('<YOUR_PROJECT_ID>'); // Your project ID

const oauth2 = new Oauth2(client);

const result = await oauth2.approve({
    grantId: '<GRANT_ID>',
    authorizationDetails: '<AUTHORIZATION_DETAILS>', // optional
    scope: '<SCOPE>', // optional
});

console.log(result);
```

```javascript
import { Client, Oauth2 } from 'react-native-appwrite';

const client = new Client()
    .setEndpoint('https://<REGION>.cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('<YOUR_PROJECT_ID>'); // Your project ID

const oauth2 = new Oauth2(client);

const result = await oauth2.createToken({
    grantType: '<GRANT_TYPE>',
    code: '<CODE>', // optional
    refreshToken: '<REFRESH_TOKEN>', // optional
    deviceCode: '<DEVICE_CODE>', // optional
    clientId: '<CLIENT_ID>', // optional
    clientSecret: '<CLIENT_SECRET>', // optional
    codeVerifier: '<CODE_VERIFIER>', // optional
    redirectUri: 'https://example.com', // optional
    resource: [], // optional
    audience: '<AUDIENCE>', // optional
});

console.log(result);
```

```javascript
import { Client, Oauth2 } from 'react-native-appwrite';

const client = new Client()
    .setEndpoint('https://<REGION>.cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('<YOUR_PROJECT_ID>'); // Your project ID

const oauth2 = new Oauth2(client);

const result = await oauth2.authorizePost({
    clientId: '<CLIENT_ID>', // optional
    redirectUri: 'https://example.com', // optional
    responseType: '', // optional
    scope: '<SCOPE>', // optional
    state: '<STATE>', // optional
    nonce: '<NONCE>', // optional
    codeChallenge: '<CODE_CHALLENGE>', // optional
    codeChallengeMethod: 's256', // optional
    prompt: '<PROMPT>', // optional
    maxAge: 0, // optional
    authorizationDetails: '<AUTHORIZATION_DETAILS>', // optional
    resource: [], // optional
    audience: '<AUDIENCE>', // optional
    requestUri: '<REQUEST_URI>', // optional
});

console.log(result);
```

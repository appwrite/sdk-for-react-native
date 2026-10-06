```javascript
import { Client, Oauth2 } from 'react-native-appwrite';

const client = new Client()
    .setEndpoint('https://<REGION>.cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('<YOUR_PROJECT_ID>'); // Your project ID

const oauth2 = new Oauth2(client);

const result = await oauth2.logout({
    idTokenHint: '<ID_TOKEN_HINT>', // optional
    logoutHint: '<LOGOUT_HINT>', // optional
    clientId: '<CLIENT_ID>', // optional
    postLogoutRedirectUri: 'https://example.com', // optional
    state: '<STATE>', // optional
    uiLocales: '<UI_LOCALES>', // optional
});

console.log(result);
```

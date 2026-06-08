```javascript
import { Client, Oauth2 } from "react-native-appwrite";

const client = new Client()
    .setEndpoint('https://<REGION>.cloud.appwrite.io/v1') // Your API Endpoint
    .setProjectQuery('<YOUR_PROJECT_ID>'); // Your project ID

const oauth2 = new Oauth2(client);

const result = await oauth2.approve({
    projectId: '<PROJECT_ID>',
    grantId: '<GRANT_ID>',
    authorizationDetails: '<AUTHORIZATION_DETAILS>' // optional
});

console.log(result);
```

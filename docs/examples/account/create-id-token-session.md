```javascript
import { Client, Account, IdTokenProvider } from 'react-native-appwrite';

const client = new Client()
    .setEndpoint('https://<REGION>.cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('<YOUR_PROJECT_ID>'); // Your project ID

const account = new Account(client);

const result = await account.createIdTokenSession({
    provider: IdTokenProvider.Apple,
    idToken: '<ID_TOKEN>',
    nonce: '<NONCE>', // optional
    accessToken: '<ACCESS_TOKEN>', // optional
    accessTokenExpiry: 0, // optional
    name: '<NAME>', // optional
});

console.log(result);
```

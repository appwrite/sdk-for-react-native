```javascript
import { Client, Organization } from 'react-native-appwrite';

const client = new Client()
    .setEndpoint('https://<REGION>.cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('<YOUR_PROJECT_ID>'); // Your project ID

const organization = new Organization(client);

const result = await organization.updateInstallation({
    installationId: '<INSTALLATION_ID>',
    authorizationDetails: '<AUTHORIZATION_DETAILS>', // optional
});

console.log(result);
```

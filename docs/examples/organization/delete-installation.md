```javascript
import { Client, Organization } from 'react-native-appwrite';

const client = new Client()
    .setEndpoint('https://<REGION>.cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('<YOUR_PROJECT_ID>'); // Your project ID

const organization = new Organization(client);

const result = await organization.deleteInstallation({
    installationId: '<INSTALLATION_ID>',
});

console.log(result);
```

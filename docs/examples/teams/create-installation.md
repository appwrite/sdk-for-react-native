```javascript
import { Client, Teams } from 'react-native-appwrite';

const client = new Client()
    .setEndpoint('https://<REGION>.cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('<YOUR_PROJECT_ID>'); // Your project ID

const teams = new Teams(client);

const result = await teams.createInstallation({
    teamId: '<TEAM_ID>',
    appId: '<APP_ID>',
    authorizationDetails: '<AUTHORIZATION_DETAILS>', // optional
});

console.log(result);
```

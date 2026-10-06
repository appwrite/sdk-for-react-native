```javascript
import { Client, Apps } from 'react-native-appwrite';

const client = new Client()
    .setEndpoint('https://<REGION>.cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('<YOUR_PROJECT_ID>'); // Your project ID

const apps = new Apps(client);

const result = await apps.create({
    appId: '<APP_ID>',
    name: '<NAME>',
    redirectUris: [],
    description: '<DESCRIPTION>', // optional
    clientUri: 'https://example.com', // optional
    logoUri: 'https://example.com', // optional
    privacyPolicyUrl: 'https://example.com', // optional
    termsUrl: 'https://example.com', // optional
    contacts: [], // optional
    tagline: '<TAGLINE>', // optional
    tags: [], // optional
    images: [], // optional
    supportUrl: 'https://example.com', // optional
    dataDeletionUrl: 'https://example.com', // optional
    postLogoutRedirectUris: [], // optional
    enabled: false, // optional
    type: 'public', // optional
    deviceFlow: false, // optional
    teamId: '<TEAM_ID>', // optional
});

console.log(result);
```

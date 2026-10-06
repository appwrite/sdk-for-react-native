```javascript
import { Client, Oauth2 } from 'react-native-appwrite';

const client = new Client()
    .setEndpoint('https://<REGION>.cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('<YOUR_PROJECT_ID>'); // Your project ID

const oauth2 = new Oauth2(client);

const result = await oauth2.listProjects({
    limit: 1, // optional
    offset: 0, // optional
    search: '<SEARCH>', // optional
});

console.log(result);
```

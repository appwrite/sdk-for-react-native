```javascript
import { Client, Apps } from "react-native-appwrite";

const client = new Client()
    .setEndpoint('https://<REGION>.cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('<YOUR_PROJECT_ID>'); // Your project ID

const apps = new Apps(client);

const result = await apps.getSecret({
    appId: '<APP_ID>',
    secretId: '<SECRET_ID>'
});

console.log(result);
```

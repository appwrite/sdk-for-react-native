```javascript
import { Client, Advisor } from "react-native-appwrite";

const client = new Client()
    .setEndpoint('https://<REGION>.cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('<YOUR_PROJECT_ID>'); // Your project ID

const advisor = new Advisor(client);

const result = await advisor.listReports({
    queries: [], // optional
    total: false // optional
});

console.log(result);
```

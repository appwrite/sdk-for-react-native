```javascript
import { Client, Advisor } from "react-native-appwrite";

const client = new Client()
    .setEndpoint('https://<REGION>.cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('<YOUR_PROJECT_ID>'); // Your project ID

const advisor = new Advisor(client);

const result = await advisor.getInsight({
    reportId: '<REPORT_ID>',
    insightId: '<INSIGHT_ID>'
});

console.log(result);
```

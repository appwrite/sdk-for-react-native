```javascript
import { Client, DocumentsDB } from "react-native-appwrite";

const client = new Client()
    .setEndpoint('https://<REGION>.cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('<YOUR_PROJECT_ID>'); // Your project ID

const documentsDB = new DocumentsDB(client);

const result = await documentsDB.updateTransaction({
    transactionId: '<TRANSACTION_ID>',
    commit: false, // optional
    rollback: false // optional
});

console.log(result);
```

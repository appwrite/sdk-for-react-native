```javascript
import { Client, DocumentsDB } from 'react-native-appwrite';

const client = new Client()
    .setEndpoint('https://<REGION>.cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('<YOUR_PROJECT_ID>'); // Your project ID

const documentsDB = new DocumentsDB(client);

const result = await documentsDB.createDocuments({
    databaseId: '<DATABASE_ID>',
    collectionId: '<COLLECTION_ID>',
    documents: [
        {
            $id: 'example1',
            username: 'walter.obrien',
            email: 'walter.obrien@example.com',
            fullName: "Walter O'Brien",
            age: 30,
            isAdmin: false,
        },
    ],
    transactionId: '<TRANSACTION_ID>', // optional
});

console.log(result);
```

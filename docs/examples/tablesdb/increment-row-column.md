```javascript
import { Client, TablesDB } from 'react-native-appwrite';

const client = new Client()
    .setEndpoint('https://<REGION>.cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('<YOUR_PROJECT_ID>'); // Your project ID

const tablesDB = new TablesDB(client);

const result = await tablesDB.incrementRowColumn({
    databaseId: '<DATABASE_ID>',
    tableId: '<TABLE_ID>',
    rowId: '<ROW_ID>',
    column: '<COLUMN>',
    value: 1, // optional
    max: 100, // optional
    transactionId: '<TRANSACTION_ID>', // optional
});

console.log(result);
```

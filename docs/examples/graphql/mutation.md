```javascript
import { Client, Graphql } from 'react-native-appwrite';

const client = new Client()
    .setEndpoint('https://<REGION>.cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('<YOUR_PROJECT_ID>'); // Your project ID

const graphql = new Graphql(client);

const result = await graphql.mutation({
    query: {
        query: 'mutation { accountUpdateName(name: "Walter") { name } }',
    },
});

console.log(result);
```

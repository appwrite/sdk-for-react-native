```javascript
import { Client, Organizations } from "react-native-appwrite";

const client = new Client()
    .setEndpoint('https://<REGION>.cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('<YOUR_PROJECT_ID>'); // Your project ID

const organizations = new Organizations(client);

const result = await organizations.getBillingAddress({
    organizationId: '<ORGANIZATION_ID>',
    billingAddressId: '<BILLING_ADDRESS_ID>'
});

console.log(result);
```

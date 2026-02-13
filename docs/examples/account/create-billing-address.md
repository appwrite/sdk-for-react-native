```javascript
import { Client, Account } from "react-native-appwrite";

const client = new Client()
    .setEndpoint('https://<REGION>.cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('<YOUR_PROJECT_ID>'); // Your project ID

const account = new Account(client);

const result = await account.createBillingAddress({
    country: '<COUNTRY>',
    city: '<CITY>',
    streetAddress: '<STREET_ADDRESS>',
    addressLine2: '<ADDRESS_LINE2>', // optional
    state: '<STATE>', // optional
    postalCode: '<POSTAL_CODE>' // optional
});

console.log(result);
```

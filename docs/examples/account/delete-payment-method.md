```javascript
import { Client, Account } from "react-native-appwrite";

const client = new Client()
    .setEndpoint('https://<REGION>.cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('<YOUR_PROJECT_ID>'); // Your project ID

const account = new Account(client);

const result = await account.deletePaymentMethod({
    paymentMethodId: '<PAYMENT_METHOD_ID>'
});

console.log(result);
```

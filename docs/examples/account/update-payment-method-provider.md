```javascript
import { Client, Account } from "react-native-appwrite";

const client = new Client()
    .setEndpoint('https://<REGION>.cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('<YOUR_PROJECT_ID>'); // Your project ID

const account = new Account(client);

const result = await account.updatePaymentMethodProvider({
    paymentMethodId: '<PAYMENT_METHOD_ID>',
    providerMethodId: '<PROVIDER_METHOD_ID>',
    name: '<NAME>',
    state: '<STATE>' // optional
});

console.log(result);
```

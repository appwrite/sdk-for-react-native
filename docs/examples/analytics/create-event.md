```javascript
import { Client, Analytics } from 'react-native-appwrite';

const client = new Client()
    .setEndpoint('https://<REGION>.cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('<YOUR_PROJECT_ID>'); // Your project ID

const analytics = new Analytics(client);

const result = await analytics.createEvent({
    propertyId: '<PROPERTY_ID>',
    name: '<NAME>',
    url: 'https://example.com',
    domain: '<DOMAIN>', // optional
    referrer: '<REFERRER>', // optional
    screenWidth: null, // optional
    sessionHash: '<SESSION_HASH>', // optional
    scrollDepth: 0, // optional
    engagementTime: 0, // optional
    props: [], // optional
    userId: '<USER_ID>', // optional
    ip: '<IP>', // optional
    userAgent: '<USER_AGENT>', // optional
});

console.log(result);
```

# Appwrite React Native SDK

![License](https://img.shields.io/github/license/appwrite/sdk-for-react-native.svg?style=flat-square)
![Version](https://img.shields.io/badge/api%20version-2.3.0-blue.svg?style=flat-square)
[![Build Status](https://img.shields.io/travis/com/appwrite/sdk-generator?style=flat-square)](https://travis-ci.com/appwrite/sdk-generator)
[![Twitter Account](https://img.shields.io/twitter/follow/appwrite?color=00acee&label=twitter&style=flat-square)](https://twitter.com/appwrite)
[![Discord](https://img.shields.io/discord/564160730845151244?label=discord&style=flat-square)](https://appwrite.io/discord)

**This SDK targets Appwrite server version 2.3.x as shipped on Appwrite Cloud.** Self-hosted releases can lag behind Cloud — if you run an older self-hosted build, use a matching older SDK from [previous releases](https://github.com/appwrite/sdk-for-react-native/releases) when APIs differ.

Appwrite is an open-source backend as a service server that abstracts and simplifies complex and repetitive development tasks behind a very simple to use REST API. Appwrite aims to help you develop your apps faster and in a more secure way. Use the React Native SDK to integrate your app with the Appwrite server to easily start interacting with all of Appwrite backend APIs and tools. For full API documentation and tutorials go to [https://appwrite.io/docs](https://appwrite.io/docs)

![Appwrite](https://github.com/appwrite/appwrite/raw/main/public/images/github.png)

## Installation

To install

```bash
npx expo install react-native-appwrite react-native-url-polyfill
```

### Push

`Push` connects over a raw TCP socket, so it needs `react-native-tcp-socket` and a development
or standalone build (native modules do not run in Expo Go).

On Expo SDK 52 and older, enable package exports in `metro.config.js` so `mqtt` resolves to its
React Native build (Expo SDK 53 and later do this by default):

```js
config.resolver.unstable_enablePackageExports = true;
```

#### Background delivery on Android

A subscription with `background: true` keeps delivering after the app is backgrounded, killed or
the device restarts, until it is unsubscribed or `push.close()` is called (do this on sign-out).
The SDK's native Android module (autolinked) saves the subscription, and a scheduled job and
alarm wake the app every 15 to 60 seconds to reconnect; the broker replays what was sent in
between (`retry: true`). While the app is not on screen, each message is posted as a
notification that opens the app. It reconnects with the credential saved at subscribe time, so use a session rather
than a short-lived JWT.

On Android 13 and later, the first background subscription asks the user for the
`POST_NOTIFICATIONS` runtime permission. If they decline, the subscription still delivers to your
callback but posts no notification. Notifications show the title, body and image sent with
`createPush`, and fall back to the subscription's `title` and the raw payload for other messages.

```js
const sub = await push.subscribe('news', (message) => console.log(message.data), {
    background: true,
    title: 'News',
});

// Optional: immediate delivery even after a kill and during Doze, with a quiet ongoing
// notification (call while the app is in the foreground).
await push.setForeground(true);
```

Notifications are posted while the app is backgrounded or closed. While it is on screen your
callback shows the message, so none is posted unless the subscription passes
`notifyInForeground: true`.

#### Delivery while the app is closed

Messages sent while the app is closed arrive at the next scheduled wake-up. While the device is
awake that is about every 15 seconds, or about every 60 seconds once exact alarms are allowed;
without exact alarms the wake-ups are inexact, so battery saver can defer them further. In Doze
(screen off and idle for a while) Android limits background alarms, exact ones included, to about
one every nine minutes, so a closed app can take several minutes to receive a message: allowing
exact alarms makes wake-ups punctual, it does not lift Doze. For immediate delivery, also in
Doze, use `push.setForeground(true)` (see above).

The SDK uses exact alarms on its own whenever the app may schedule them. To allow it:

1. Declare the permissions in your app's `AndroidManifest.xml`. Both are optional and subject to
   Google Play policy: `SCHEDULE_EXACT_ALARM` needs a declaration in the Play Console, and
   `USE_EXACT_ALARM` is reserved for alarm, clock and calendar apps (the SDK does not use it).

   ```xml
   <uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
   <uses-permission android:name="android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS" />
   ```

With Expo, list them under `android.permissions` in `app.json` instead.

2. On Android 13 and later the user has to allow exact alarms, under Settings > Apps > Special app
   access > Alarms & reminders. Android 12 grants a declared `SCHEDULE_EXACT_ALARM`
   automatically, and older versions need nothing. Check with `await push.backgroundStatus()`: when `bestEffort` is
   true, explain why to the user, then from a user action open that screen with `push.requestExactAlarms()`, or
   ask for the battery-optimisation exemption with `push.requestIgnoreBatteryOptimizations()`. Both return false when there is
   nothing to ask, including when the permission is not declared. The SDK never opens these
   screens on its own.

If the user force-stops the app (Settings > Force stop, and on some devices swiping it away from
recents), Android cancels its alarms and jobs: nothing is delivered until the app is opened
again, and the broker then replays what was sent meanwhile.

Set the notification icon with
`<meta-data android:name="io.appwrite.push.notification_icon" android:resource="@drawable/..." />` in your
`<application>`; without it a generic icon is used.

```js
const status = await push.backgroundStatus(); // null outside Android
if (status?.bestEffort) {
    // Explain why, then from a button press:
    await push.requestExactAlarms();
}
```

Saved background delivery follows the app's current session, also while the app is closed: each
background run re-reads the session cookie, so a rotated session of the same user replaces the
saved one, and signing out (no session) or signing in as someone else stops background delivery.
If the broker still refuses the credential, delivery stops and `onError` reports it the next time
the app registers one. Still call `push.close()` on sign-out.

#### Upgrading from an earlier release candidate

The Expo config plugin is gone: the native module now declares everything background delivery
needs. Remove `"react-native-appwrite"` from the `plugins` list in `app.json`, or `expo config`
fails to load it.

#### Opening a tapped notification

Read the `data` sent with `createPush` when the user taps a background notification:

```js
// The tap that launched the app (reported once, so call it at startup).
const opened = await push.getInitialNotification();
if (opened) {
    openSale(opened.data.saleId);
}

// Taps while the app is running, including in the background.
const stop = push.onNotificationOpened(({ topic, data }) => openSale(data.saleId));
```

On Android the SDK's native module reports the taps. Elsewhere they come from `expo-notifications`.

Foreground mode runs a `remoteMessaging` foreground service, which Google Play asks apps to
declare in the Play Console. Apps that never enable it can remove the service from their merged
manifest with `tools:node="remove"` on `io.appwrite.services.PushService` and
`android.permission.FOREGROUND_SERVICE_REMOTE_MESSAGING`.


## Getting Started

### Add your Platform

If this is your first time using Appwrite, create an account and create your first project.

Then, under **Add a platform**, add a **Android app** or a **Apple app**. You can skip optional steps.

#### iOS steps

Add your app **name** and **Bundle ID**. You can find your **Bundle Identifier** in the **General** tab for your app's primary target in XCode. For Expo projects you can set or find it on **app.json** file at your project's root directory.

#### Android steps
Add your app's **name** and **package name**, Your package name is generally the **applicationId** in your app-level **build.gradle** file. For Expo projects you can set or find it on **app.json** file at your project's root directory.

## Setup

On `index.js` add import for `react-native-url-polyfill`

```
import 'react-native-url-polyfill/auto'
```

> If you are building for iOS, don't forget to install pods
> `cd ios && pod install && cd ..`

### Init your SDK

Initialize your SDK with your Appwrite server API endpoint and project ID which can be found in your project settings page.

```js
import { Client } from 'react-native-appwrite';
// Init your React Native SDK
const client = new Client();

client
    .setEndpoint('http://localhost/v1') // Your Appwrite Endpoint
    .setProject('455x34dfkj') // Your project ID
    .setPlatform('com.example.myappwriteapp') // Your application ID or bundle ID.
;
```

### Make Your First Request

Once your SDK object is set, access any of the Appwrite services and choose any request to send. Full documentation for any service method you would like to use can be found in your SDK documentation or in the [API References](https://appwrite.io/docs) section.

```js
const account = new Account(client);

// Register User
account.create(ID.unique(), 'me@example.com', 'password', 'Jane Doe')
    .then(function (response) {
        console.log(response);
    }, function (error) {
        console.log(error);
    });

```

### Full Example

```js
import { Client, Account } from 'react-native-appwrite';
// Init your React Native SDK
const client = new Client();

client
    .setEndpoint('http://localhost/v1') // Your Appwrite Endpoint
    .setProject('455x34dfkj')
    .setPlatform('com.example.myappwriteapp') // YOUR application ID
;

const account = new Account(client);

// Register User
account.create(ID.unique(), 'me@example.com', 'password', 'Jane Doe')
    .then(function (response) {
        console.log(response);
    }, function (error) {
        console.log(error);
    });
```

### Type Safety with Models

The Appwrite React Native SDK provides type safety when working with database documents through generic methods. Methods like `listDocuments`, `getDocument`, and others accept a generic type parameter that allows you to specify your custom model type for full type safety.

**TypeScript:**
```typescript
interface Book {
    name: string;
    author: string;
    releaseYear?: string;
    category?: string;
    genre?: string[];
    isCheckedOut: boolean;
}

const databases = new Databases(client);

try {
    const documents = await databases.listDocuments<Book>(
        'your-database-id',
        'your-collection-id'
    );
    
    documents.documents.forEach(book => {
        console.log(`Book: ${book.name} by ${book.author}`); // Now you have full type safety
    });
} catch (error) {
    console.error('Appwrite error:', error);
}
```

**JavaScript (with JSDoc for type hints):**
```javascript
/**
 * @typedef {Object} Book
 * @property {string} name
 * @property {string} author
 * @property {string} [releaseYear]
 * @property {string} [category]
 * @property {string[]} [genre]
 * @property {boolean} isCheckedOut
 */

const databases = new Databases(client);

try {
    /** @type {Models.DocumentList<Book>} */
    const documents = await databases.listDocuments(
        'your-database-id',
        'your-collection-id'
    );
    
    documents.documents.forEach(book => {
        console.log(`Book: ${book.name} by ${book.author}`); // Type hints available in IDE
    });
} catch (error) {
    console.error('Appwrite error:', error);
}
```

**Tip**: You can use the `appwrite types` command to automatically generate TypeScript interfaces based on your Appwrite database schema. Learn more about [type generation](https://appwrite.io/docs/products/databases/type-generation).

### Error Handling

The Appwrite React Native SDK raises an `AppwriteException` object with `message`, `code` and `response` properties. You can handle any errors by catching the exception and present the `message` to the user or handle it yourself based on the provided error information. Below is an example.

```javascript
try {
    const user = await account.create(ID.unique(), "email@example.com", "password", "Walter O'Brien");
    console.log('User created:', user);
} catch (error) {
    console.error('Appwrite error:', error.message);
}
```

### Learn more

You can use the following resources to learn more and get help
- 🚀 [Getting Started Tutorial](https://appwrite.io/docs/quick-starts/react-native)
- 📜 [Appwrite Docs](https://appwrite.io/docs)
- 💬 [Discord Community](https://appwrite.io/discord)
- 🚂 [Appwrite React Native Playground](https://github.com/appwrite/playground-for-react-native)


## Contribution

This library is auto-generated by Appwrite custom [SDK Generator](https://github.com/appwrite/sdk-generator). To learn more about how you can help us improve this SDK, please check the [contribution guide](https://github.com/appwrite/sdk-generator/blob/master/CONTRIBUTING.md) before sending a pull-request.

## License

Please see the [BSD-3-Clause license](https://raw.githubusercontent.com/appwrite/appwrite/master/LICENSE) file for more information.
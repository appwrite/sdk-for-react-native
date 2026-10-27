# Appwrite React Native SDK

![License](https://img.shields.io/badge/license-BSD--3--Clause-blue.svg?style=flat-square)
![Version](https://img.shields.io/badge/api%20version-2.6.2-blue.svg?style=flat-square)
[![X Account](https://img.shields.io/badge/follow-%40appwrite-000000?logo=x&style=flat-square)](https://x.com/appwrite)
[![Discord](https://img.shields.io/discord/564160730845151244?label=discord&style=flat-square)](https://appwrite.io/discord)

**This SDK targets Appwrite server version 2.6.x as shipped on Appwrite Cloud.** Self-hosted releases can lag behind Cloud — if you run an older self-hosted build, use a matching older SDK from [previous releases](https://github.com/appwrite/sdk-for-react-native/releases) when APIs differ.

Appwrite is an open-source backend as a service server that abstracts and simplifies complex and repetitive development tasks behind a very simple to use REST API. Appwrite aims to help you develop your apps faster and in a more secure way. Use the React Native SDK to integrate your app with the Appwrite server to easily start interacting with all of Appwrite backend APIs and tools. For full API documentation and tutorials go to [https://appwrite.io/docs](https://appwrite.io/docs)

![Appwrite](https://github.com/appwrite/appwrite/raw/main/public/images/github.png)

## Installation

```bash
npx expo install react-native-appwrite expo-file-system react-native-url-polyfill
```

The SDK supports Expo SDK 52 and later. It reads files for uploads through `expo-file-system`, which your app provides: `npx expo install` picks the version that matches your Expo SDK.

The SDK uses Expo modules. In a React Native project created without Expo, run `npx install-expo-modules@latest` first.

## Getting started

### Add your platform

In the Appwrite Console, open your project and under **Add a platform** add an **Android app**, an **Apple app**, or both.

- **Apple:** enter your app's name and bundle identifier. In Expo projects it is `expo.ios.bundleIdentifier` in `app.json`; otherwise find it in the **General** tab of your app target in Xcode.
- **Android:** enter your app's name and package name. In Expo projects it is `expo.android.package` in `app.json`; otherwise it is the `applicationId` in your app-level `build.gradle`.

### Load the URL polyfill

Import `react-native-url-polyfill` once in your app's entry file (for example `index.js` or your root `_layout.tsx`), before any SDK code runs:

```js
import 'react-native-url-polyfill/auto';
```

### Initialize the client

Copy your endpoint and project ID from your project's **Settings** page, and pass the bundle identifier or package name you registered to `setPlatform`.

```js
import { Client } from 'react-native-appwrite';

const client = new Client()
    .setEndpoint('https://<REGION>.cloud.appwrite.io/v1')
    .setProject('<PROJECT_ID>')
    .setPlatform('com.example.myapp');
```

For a self-hosted Appwrite, use `https://<HOSTNAME>/v1` as the endpoint.

### Make your first request

Create a service from the client and call any of its methods. Every method takes a single object of named parameters and returns a promise. See the [API reference](https://appwrite.io/docs/references) for every service and method.

```js
import { Account, ID } from 'react-native-appwrite';

const account = new Account(client);

const user = await account.create({
    userId: ID.unique(),
    email: 'email@example.com',
    password: 'password',
    name: "Walter O'Brien",
});

console.log(user);
```

### Sign in with OAuth

Enable the provider in the Console under **Auth > Settings**. In Expo, set the app's URL scheme to `appwrite-callback-<PROJECT_ID>` in `app.json`:

```json
{
    "expo": {
        "scheme": "appwrite-callback-<PROJECT_ID>"
    }
}
```

Install the Expo packages the sign-in flow uses:

```bash
npx expo install expo-auth-session expo-web-browser
```

Then create a login URL with `createOAuth2Token`, open it with `expo-web-browser`, and exchange the returned secret for a session:

```js
import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { OAuthProvider } from 'react-native-appwrite';

const deepLink = new URL(makeRedirectUri({ preferLocalhost: true }));
const scheme = `${deepLink.protocol}//`;

const loginUrl = account.createOAuth2Token({
    provider: OAuthProvider.Github,
    success: `${deepLink}`,
    failure: `${deepLink}`,
});

const result = await WebBrowser.openAuthSessionAsync(`${loginUrl}`, scheme);

if (result.type === 'success') {
    const url = new URL(result.url);
    const userId = url.searchParams.get('userId');
    const secret = url.searchParams.get('secret');

    if (userId && secret) {
        await account.createSession({ userId, secret });
    }
}
```

### Type safety with models

Methods that return rows, such as `listRows` and `getRow`, accept a type parameter for your own row shape:

```ts
import { TablesDB, type Models } from 'react-native-appwrite';

interface Book extends Models.Row {
    name: string;
    author: string;
    releaseYear?: string;
    genre?: string[];
    isCheckedOut: boolean;
}

const tablesDB = new TablesDB(client);

const result = await tablesDB.listRows<Book>({
    databaseId: '<DATABASE_ID>',
    tableId: '<TABLE_ID>',
});

for (const book of result.rows) {
    console.log(`${book.name} by ${book.author}`);
}
```

The [Appwrite CLI](https://github.com/appwrite/sdk-for-cli) can generate these interfaces from your database schema with `appwrite types`. See [type generation](https://appwrite.io/docs/products/databases/tablesdb/type-generation).

### Error handling

Failed requests throw an `AppwriteException` with `message`, `code`, `type` and `response` properties.

```js
import { AppwriteException } from 'react-native-appwrite';

try {
    const user = await account.get();
    console.log(user);
} catch (error) {
    if (error instanceof AppwriteException) {
        console.error(error.code, error.type, error.message);
    }
}
```

The [response codes](https://appwrite.io/docs/apis/response-codes) page lists every error type.

## Push

`Push` connects over a raw TCP socket, so it needs `react-native-tcp-socket` and a development or standalone build (native modules do not run in Expo Go):

```bash
npx expo install react-native-tcp-socket
```

Background delivery outside Android also needs `react-native-background-actions` and `expo-notifications`.

Create the service from your client once the user is signed in:

```js
import { Push } from 'react-native-appwrite';

const push = new Push(client);
```

On Expo SDK 52, enable package exports in `metro.config.js` so `mqtt` resolves to its React Native build (Expo SDK 53 and later do this by default):

```js
config.resolver.unstable_enablePackageExports = true;
```

### Background delivery on Android

A subscription with `background: true` keeps delivering after the app is backgrounded, killed or the device restarts, until it is unsubscribed or `push.close()` is called (do this on sign-out). The SDK's native Android module (autolinked) saves the subscription, and a scheduled job and alarm wake the app every 15 to 60 seconds to reconnect; the broker replays what was sent in between (`retry: true`). While the app is not on screen, each message is posted as a notification that opens the app. It reconnects with the credential saved at subscribe time, so use a session rather than a short-lived JWT.

On Android 13 and later, the first background subscription asks the user for the `POST_NOTIFICATIONS` runtime permission. If they decline, the subscription still delivers to your callback but posts no notification. Notifications show the title, body and image sent with `createPush`, falling back to the subscription's `title` when only a body is sent. A push with no title or body, such as a data-only push, posts no notification and reaches only your callback. Messages that are not a JSON object show the subscription's `title` with the raw payload as the body.

```js
const sub = await push.subscribe('news', (message) => console.log(message.data), {
    background: true,
    title: 'News',
});

// Optional: immediate delivery even after a kill and during Doze, with a quiet ongoing
// notification (call while the app is in the foreground).
await push.setForeground(true);
```

Notifications are posted while the app is backgrounded or closed. While it is on screen your callback shows the message, so none is posted unless the subscription passes `notifyInForeground: true`.

### Delivery while the app is closed

Messages sent while the app is closed arrive at the next scheduled wake-up. While the device is awake that is about every 15 seconds, or about every 60 seconds once exact alarms are allowed; without exact alarms the wake-ups are inexact, so battery saver can defer them further. In Doze (screen off and idle for a while) Android limits background alarms, exact ones included, to about one every nine minutes, so a closed app can take several minutes to receive a message: allowing exact alarms makes wake-ups punctual, it does not lift Doze. For immediate delivery, also in Doze, use `push.setForeground(true)` (see above).

The SDK uses exact alarms on its own whenever the app may schedule them. To allow it:

1. Declare the permissions in your app's `AndroidManifest.xml`. Both are optional and subject to Google Play policy: `SCHEDULE_EXACT_ALARM` needs a declaration in the Play Console, and `USE_EXACT_ALARM` is reserved for alarm, clock and calendar apps (the SDK does not use it).

   ```xml
   <uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
   <uses-permission android:name="android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS" />
   ```

   With Expo, list them under `android.permissions` in `app.json` instead.

2. On Android 13 and later the user has to allow exact alarms, under Settings > Apps > Special app access > Alarms & reminders. Android 12 grants a declared `SCHEDULE_EXACT_ALARM` automatically, and older versions need nothing. Check with `await push.backgroundStatus()`: when `bestEffort` is true, explain why to the user, then from a user action open that screen with `push.requestExactAlarms()`, or ask for the battery-optimisation exemption with `push.requestIgnoreBatteryOptimizations()`. Both return false when there is nothing to ask, including when the permission is not declared. The SDK never opens these screens on its own.

If `backgroundRestricted` is true, the user restricted the app's background usage and messages can wait until the app is opened. Exact alarms don't lift it, and neither does foreground mode: Android stops a restricted app's foreground service once it leaves the screen. Ask the user to choose Unrestricted in the app's battery settings (Settings > Apps > your app > Battery); granting the battery optimisation exemption also lets the SDK's alarms and jobs run, and `bestEffort` then reflects only the exact-alarm state. It is always false below Android 9.

If the user force-stops the app (Settings > Force stop, and on some devices swiping it away from recents), Android cancels its alarms and jobs: nothing is delivered until the app is opened again, and the broker then replays what was sent meanwhile.

Set the notification icon with `<meta-data android:name="io.appwrite.reactnative.push.notification_icon" android:resource="@drawable/..." />` in your `<application>`; without it a generic icon is used.

```js
const status = await push.backgroundStatus(); // null outside Android
if (status?.backgroundRestricted && !status.ignoringBatteryOptimizations) {
    // Ask the user to choose Unrestricted in the app's battery settings.
} else if (status?.bestEffort) {
    // Explain why, then from a button press:
    await push.requestExactAlarms();
}
```

Saved background delivery follows the app's current session, also while the app is closed: each background run re-reads the session cookie, so a rotated session of the same user replaces the saved one, and signing out (no session) or signing in as someone else stops background delivery. If the broker still refuses the credential, delivery stops and `onError` reports it the next time the app registers one. Still call `push.close()` on sign-out.

### Upgrading from an earlier release candidate

The Expo config plugin is gone: the native module now declares everything background delivery needs. Remove `"react-native-appwrite"` from the `plugins` list in `app.json`, or `expo config` fails to load it.

### Opening a tapped notification

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

Foreground mode runs a `remoteMessaging` foreground service, which Google Play asks apps to declare in the Play Console. Apps that never enable it can remove the service from their merged manifest with `tools:node="remove"` on `io.appwrite.reactnative.services.PushService` and `android.permission.FOREGROUND_SERVICE_REMOTE_MESSAGING`.

## Learn more

- [React Native quick start](https://appwrite.io/docs/quick-starts/react-native)
- [Appwrite docs](https://appwrite.io/docs)
- [Discord community](https://appwrite.io/discord)
- [React Native playground](https://github.com/appwrite/playground-for-react-native)

## Contribution

This library is auto-generated by the Appwrite [SDK Generator](https://github.com/appwrite/sdk-generator). To learn more about how you can help us improve this SDK, please check the [contribution guide](https://github.com/appwrite/sdk-generator/blob/main/CONTRIBUTING.md) before sending a pull-request.

## License

Please see the [BSD-3-Clause license](https://raw.githubusercontent.com/appwrite/appwrite/master/LICENSE) file for more information.
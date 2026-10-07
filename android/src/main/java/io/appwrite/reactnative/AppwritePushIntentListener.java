package io.appwrite.reactnative;

import android.app.Activity;
import android.content.Intent;

import com.facebook.react.bridge.ActivityEventListener;

/**
 * Hands the Push module the intents a notification tap brings to an app that is already running.
 * Written in Java so it compiles against React Native versions that declare onNewIntent's intent
 * nullable and those that declare it non-null.
 */
final class AppwritePushIntentListener implements ActivityEventListener {
    interface OnIntent {
        void onIntent(Intent intent);
    }

    private final OnIntent onIntent;

    AppwritePushIntentListener(OnIntent onIntent) {
        this.onIntent = onIntent;
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
    }

    @Override
    public void onNewIntent(Intent intent) {
        if (intent != null) {
            onIntent.onIntent(intent);
        }
    }

    public void onUserLeaveHint(Activity activity) {
    }
}

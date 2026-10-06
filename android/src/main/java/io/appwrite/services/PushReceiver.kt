package io.appwrite.services

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

/**
 * Handles background push messages in code when no in-app callback is listening, e.g. after
 * the process was started in the background to reconnect. Subclass it and declare it in your
 * manifest with the push message action:
 *
 * ```xml
 * <receiver android:name=".MyPushReceiver" android:exported="false">
 *     <intent-filter>
 *         <action android:name="io.appwrite.push.MESSAGE" />
 *     </intent-filter>
 * </receiver>
 * ```
 *
 * The SDK calls [onMessage] directly on a background thread, under a wakelock of about ten
 * seconds, so hand longer work to WorkManager. Messages a live callback receives do not
 * reach it.
 */
abstract class PushReceiver : BroadcastReceiver() {
    /**
     * Handle [message]. Return true when you handled it yourself, so the SDK does not post its
     * default notification; return false to have it posted as well.
     */
    abstract fun onMessage(context: Context, message: PushMessage): Boolean

    // Messages arrive through onMessage, never as a broadcast.
    final override fun onReceive(context: Context, intent: Intent) = Unit
}

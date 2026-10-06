package io.appwrite.services

import android.app.Service
import android.content.Intent
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.IBinder
import androidx.core.app.ServiceCompat

/**
 * The foreground mode of background push delivery ([Push.setForeground]): a foreground service
 * that keeps the process at foreground priority, so the connection held by the process stays
 * up and delivers immediately, also during Doze. The system restarts it after a kill, and it
 * restores the saved subscriptions. Started by the SDK; not meant to be started directly.
 */
class PushService : Service() {
    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        PushBackground.serviceRunning = true
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        if (!PushBackground.wantsService(this)) {
            stopSelf()
            return START_NOT_STICKY
        }
        try {
            startForegroundCompat()
        } catch (e: Exception) {
            // E.g. a background start refused on Android 12+; the scheduled runs keep delivering.
            stopSelf()
            PushBackground.report(e)
            return START_NOT_STICKY
        }
        PushBackground.tick(this) {}
        // Recreated after a kill with a null intent; the saved subscriptions are restored then.
        return START_STICKY
    }

    private fun startForegroundCompat() {
        val notification = PushBackground.ongoingNotification(this)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            ServiceCompat.startForeground(
                this,
                PushBackground.NOTIFICATION_ID,
                notification,
                ServiceInfo.FOREGROUND_SERVICE_TYPE_REMOTE_MESSAGING,
            )
        } else {
            startForeground(PushBackground.NOTIFICATION_ID, notification)
        }
    }

    // Some devices kill the process shortly after its task is swiped away; a run a few seconds
    // later restarts the service.
    override fun onTaskRemoved(rootIntent: Intent?) {
        PushBackground.scheduleRestart(this)
        super.onTaskRemoved(rootIntent)
    }

    override fun onDestroy() {
        PushBackground.serviceRunning = false
        super.onDestroy()
    }
}

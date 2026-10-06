package io.appwrite.services

import android.app.job.JobParameters
import android.app.job.JobService
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

/**
 * The scheduled run of background push delivery: reconnects and re-arms itself. Scheduled
 * by the SDK; not meant to be started directly.
 */
class PushJobService : JobService() {
    override fun onStartJob(params: JobParameters): Boolean {
        PushBackground.tick(this) { jobFinished(params, false) }
        return true
    }

    // The run re-arms the next one itself, so a stopped run needs no retry.
    override fun onStopJob(params: JobParameters): Boolean = false
}

/**
 * The alarm that backs up the scheduled job when it runs late. Scheduled by the SDK; not meant
 * to be sent directly.
 */
class PushAlarmReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action != PushBackground.ACTION_TICK) {
            return
        }
        val pending = goAsync()
        PushBackground.tick(context) { pending.finish() }
    }
}

/** Resumes background push delivery after a reboot or an app update. */
class PushBootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action != Intent.ACTION_BOOT_COMPLETED && intent.action != Intent.ACTION_MY_PACKAGE_REPLACED) {
            return
        }
        val pending = goAsync()
        PushBackground.tick(context) { pending.finish() }
    }
}

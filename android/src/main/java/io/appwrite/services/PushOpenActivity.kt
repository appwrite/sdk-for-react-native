package io.appwrite.services

import android.app.Activity
import android.content.Intent
import android.os.Bundle

class PushOpenActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val topic = intent.getStringExtra(PushBackground.EXTRA_TOPIC)
        val payload = intent.getStringExtra(PushBackground.EXTRA_PAYLOAD)
        packageManager.getLaunchIntentForPackage(packageName)?.let { launch ->
            launch.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP)
            if (topic != null && payload != null) {
                launch.putExtra(PushBackground.EXTRA_TOPIC, topic).putExtra(PushBackground.EXTRA_PAYLOAD, payload)
            }
            startActivity(launch)
        }
        // After opening the app, so a screen a tap callback opens lands on top of it.
        if (topic != null && payload != null) {
            PushTaps.record(PushTap(topic, payload))
        }
        finish()
    }
}

internal data class PushTap(val topic: String, val payload: String)

internal object PushTaps {
    private var pending: PushTap? = null
    private val listeners = mutableListOf<(PushTap) -> Unit>()

    fun record(tap: PushTap) {
        val deliver = synchronized(this) {
            listeners.toList().also {
                if (it.isEmpty()) {
                    pending = tap
                }
            }
        }
        deliver.forEach { it(tap) }
    }

    @Synchronized
    fun take(): PushTap? = pending.also { pending = null }

    fun listen(onTap: (PushTap) -> Unit): () -> Unit {
        synchronized(this) {
            listeners.add(onTap)
        }
        return {
            synchronized(this) {
                listeners.remove(onTap)
            }
        }
    }
}

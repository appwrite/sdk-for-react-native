package io.appwrite.services

import android.content.Context
import android.os.SystemClock
import org.json.JSONArray
import org.json.JSONObject
import java.util.UUID
import java.util.concurrent.ConcurrentHashMap

/**
 * The contract the React Native and Flutter SDKs use to host their background push
 * subscriptions on this Android core, so they get the same delivery as the Android SDK: saved
 * subscriptions, scheduled wake-ups after the process dies, notifications, and foreground mode.
 *
 * Both SDKs pass the same JSON: [host] takes the connection config and every live subscription,
 * and each message for a live subscription comes back through [Events.onMessage] with its id and
 * an acknowledgement token, which the SDK passes to [ack] once its callback has run (the broker's
 * PUBACK waits for it, at most ten seconds). One bridge per process; hosting again replaces the
 * live subscriptions.
 */
class PushBridge(context: Context, private val events: Events) {
    /** Where messages and errors go; called on a background thread. */
    interface Events {
        fun onMessage(subscriptionId: String, message: PushMessage, ackToken: String)

        fun onError(message: String)
    }

    private val appContext = context.applicationContext
    // Acknowledgement token -> (when it was handed out, the acknowledgement). A token the SDK never
    // acknowledges (its JS or Dart side was gone) is dropped once the core has acknowledged the
    // message anyway, so the map stays bounded.
    private val acks = ConcurrentHashMap<String, Pair<Long, () -> Unit>>()

    // Whether the app registered onError; without one, errors are logged and a refused
    // credential is kept for the next registration.
    @Volatile
    private var errorCallback = false

    /**
     * Host the subscriptions in [subscriptionsJson] on the background connection described by
     * [configJson].
     *
     * Config: `{"host", "port", "tls", "tlsInsecure", "clientId" (optional; per user and install
     * when empty), "authMethod", "credential", "project", "sessionCookieUrl" (optional: the endpoint
     * whose session cookie in the WebView cookie store holds the credential, so background runs
     * follow a rotated session)}`. Subscriptions: an array of
     * `{"id", "topic", "background", "title" (optional), "retry", "notifyInForeground" (optional)}`.
     *
     * [done] is called once the connection is up and every filter is subscribed, or with the
     * failure's message; the SDK rejects its subscribe with it and reports it itself.
     */
    fun host(configJson: String, subscriptionsJson: String, done: (String?) -> Unit) {
        val json = JSONObject(configJson)
        val authMethod = json.getString("authMethod")
        val credential = json.getString("credential")
        val config = PushConfig(
            host = json.getString("host"),
            port = json.getInt("port"),
            tls = json.optBoolean("tls", false),
            tlsInsecure = json.optBoolean("tlsInsecure", false),
            clientId = json.optString("clientId").ifEmpty { defaultPushClientId(appContext, authMethod, credential) },
            keepAlive = KEEP_ALIVE_SECONDS,
            authMethod = authMethod,
            credential = credential,
            project = json.optString("project"),
            sessionCookieUrl = if (json.isNull("sessionCookieUrl")) null else json.optString("sessionCookieUrl").ifEmpty { null },
        )
        val list = JSONArray(subscriptionsJson)
        val listeners = (0 until list.length()).map { index ->
            val subscription = list.getJSONObject(index)
            val id = subscription.getString("id")
            PushListener(
                topics = setOf(subscription.getString("topic")),
                callback = {},
                acknowledgingCallback = { message, ack ->
                    val token = UUID.randomUUID().toString()
                    val now = SystemClock.elapsedRealtime()
                    acks.entries.removeIf { now - it.value.first > STALE_ACK_MS }
                    acks[token] = now to ack
                    events.onMessage(id, message, token)
                },
                background = subscription.optBoolean("background", false),
                title = if (subscription.isNull("title")) null else subscription.optString("title").ifEmpty { null },
                retry = subscription.optBoolean("retry", true),
                notifyInForeground = subscription.optBoolean("notifyInForeground", false),
            )
        }
        PushBackground.errorHandler = { error ->
            if (errorCallback) {
                events.onError(error.message ?: error.toString())
            }
            errorCallback
        }
        PushBackground.host(appContext, config, listeners) { error ->
            done(error?.let { it.message ?: it.toString() })
        }
    }

    /** Acknowledge a message once the SDK's callback for it has run. */
    fun ack(token: String) {
        acks.remove(token)?.second?.invoke()
    }

    /** Stop hosting the live subscriptions, keeping the ones saved by an earlier run. */
    fun release() = PushBackground.release(appContext)

    /** Stop background delivery and forget every saved subscription (sign-out). */
    fun stop() = PushBackground.stop(appContext)

    /** Run background delivery in a foreground service; saved across restarts. */
    fun setForeground(enabled: Boolean) = PushBackground.setForeground(appContext, enabled)

    /** Whether an earlier run saved background subscriptions that are still delivered. */
    fun hasSaved(): Boolean = PushBackground.hasSaved(appContext)

    /**
     * Resume saved background delivery now instead of at the next scheduled run, with the app's
     * current credential (null when it has none). A rotated session of the same user replaces
     * the saved one; another user, or none when [signedOutWhenMissing], drops the saved
     * subscriptions without reporting an error.
     */
    fun resume(authMethod: String?, credential: String?, signedOutWhenMissing: Boolean) =
        PushBackground.resume(appContext, authMethod, credential, signedOutWhenMissing)

    /**
     * Record whether the app has an onError callback. Returns the refusal that stopped background
     * delivery while it had none, once, so the app can deliver it now.
     */
    fun setErrorCallback(registered: Boolean): String? {
        errorCallback = registered
        return if (registered) PushStore.takeStoppedError(appContext) else null
    }

    /** What background delivery can rely on, as `{"exactAlarms", "ignoringBatteryOptimizations", "foregroundService", "bestEffort"}`. */
    fun backgroundStatus(): String = PushBackground.backgroundStatus(appContext).let {
        JSONObject()
            .put("exactAlarms", it.exactAlarms)
            .put("ignoringBatteryOptimizations", it.ignoringBatteryOptimizations)
            .put("foregroundService", it.foregroundService)
            .put("bestEffort", it.bestEffort)
            .toString()
    }

    /** Open the system screen that allows exact alarms; false when there is nothing to ask. */
    fun requestExactAlarms(): Boolean = PushBackground.requestExactAlarms(appContext)

    /** Ask to exempt the app from battery optimisation; false when there is nothing to ask. */
    fun requestIgnoreBatteryOptimizations(): Boolean = PushBackground.requestIgnoreBatteryOptimizations(appContext)

    /** The default client id for a credential, so a foreground connection shares its session. */
    fun defaultClientId(authMethod: String, credential: String): String =
        defaultPushClientId(appContext, authMethod, credential)

    private companion object {
        const val KEEP_ALIVE_SECONDS = 60

        // Past the core's ten-second acknowledgement cap, after which the message was acknowledged.
        const val STALE_ACK_MS = 30_000L
    }
}

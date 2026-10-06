package io.appwrite.services

import android.app.AlarmManager
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.job.JobInfo
import android.app.job.JobScheduler
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.ConnectivityManager
import android.net.Network
import android.os.Build
import android.os.PowerManager
import android.os.SystemClock
import android.util.AtomicFile
import android.util.Log
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.core.content.ContextCompat
import com.hivemq.client.mqtt.MqttGlobalPublishFilter
import com.hivemq.client.mqtt.datatypes.MqttQos
import com.hivemq.client.mqtt.mqtt5.Mqtt5AsyncClient
import com.hivemq.client.mqtt.mqtt5.exceptions.Mqtt5ConnAckException
import com.hivemq.client.mqtt.mqtt5.message.publish.Mqtt5Publish
import io.appwrite.exceptions.AppwriteException
import org.json.JSONArray
import org.json.JSONObject
import java.io.ByteArrayOutputStream
import java.io.File
import java.io.IOException
import java.io.InputStream
import java.net.HttpURLConnection
import java.net.URL
import java.util.UUID
import java.util.concurrent.CopyOnWriteArrayList
import java.util.concurrent.ExecutionException
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit
import java.util.concurrent.TimeoutException
import java.util.concurrent.atomic.AtomicBoolean
import java.util.concurrent.atomic.AtomicInteger

private const val LOG_TAG = "AppwritePush"

/** What a message's `notification` block asks a background notification to show; [present] is false without one. */
internal data class PushNotificationContent(val present: Boolean, val title: String?, val body: String?, val image: String?)

/** A background subscription saved across restarts: its filter, QoS choice and notification title. */
internal data class PushEntry(
    val filter: String,
    val retry: Boolean,
    val title: String?,
)

/**
 * The adaptive heartbeat: its interval, the current streak of failed heartbeats, and when the
 * interval last shrank (wall-clock ms, as it must survive reboots).
 */
internal data class PushHeartbeat(
    val intervalMs: Long,
    val failures: Int = 0,
    val shrunkAt: Long = 0L,
)

/**
 * The process-wide host of the background push connection, modelled on how socket push
 * services survive on Android without keeping a service alive.
 *
 * The background subscriptions and their connection config are saved to private storage (see
 * [PushStore]), so delivery survives the process being killed, a reboot and an app update. A
 * job ([PushJobService]) that reschedules itself on every run, backed by an alarm
 * ([PushAlarmReceiver]), wakes the process every 15 seconds (60 when the app may use exact
 * alarms or is exempt from battery optimisation). Each run holds a short wakelock and
 * reconnects when the connection is gone or the default network changed, sends a heartbeat
 * when one is due, and re-arms the job. While the process is alive between runs the socket
 * stays open and messages arrive immediately; while it is dead the broker keeps the backlog
 * for this client id and replays it when the next run subscribes again.
 *
 * With foreground mode enabled ([Push.setForeground]) a foreground service ([PushService]) also keeps
 * the process at foreground priority, so delivery is immediate after a kill and during Doze.
 *
 * Messages go to the live in-app callbacks that match them. When none match (the process was
 * started in the background), a declared [PushReceiver] gets the message, and a notification
 * is posted unless it returns true.
 */
internal object PushBackground {
    const val CHANNEL_ID = "appwrite-push"
    const val NOTIFICATION_ID = 1911
    const val ACTION_TICK = "io.appwrite.push.TICK"
    const val ACTION_MESSAGE = "io.appwrite.push.MESSAGE"
    const val NOTIFICATION_ICON = "io.appwrite.push.notification_icon"
    const val EXTRA_TOPIC = "io.appwrite.push.TOPIC"
    const val EXTRA_PAYLOAD = "io.appwrite.push.PAYLOAD"

    private const val SERVICE_CHANNEL_ID = "appwrite-push-service"
    private const val JOB_ID = 0x50555348
    private const val INTERVAL_MS = 15_000L
    private const val PRIVILEGED_INTERVAL_MS = 60_000L
    private const val RESTART_DELAY_MS = 3_000L
    // An upper bound covering a run's connect (20 s) and its requests (10 s each); the wakelock is
    // released as soon as the run finishes.
    private const val WAKE_LOCK_MS = 60_000L
    private const val KEEP_ALIVE_SECONDS = 300

    // The heartbeat interval: below the broker's 1.5 x keep-alive expiry, measured on a clock that
    // counts deep sleep. Networks that drop idle connections sooner (carrier NATs) make heartbeats
    // fail; after HEARTBEAT_FAILURES in a row the interval shrinks by a quarter, down to
    // MIN_HEARTBEAT_MS, and returns to the default HEARTBEAT_RESET_MS after the last shrink, in
    // case the device moved to a better network.
    const val HEARTBEAT_MS = 180_000L
    private const val MIN_HEARTBEAT_MS = 60_000L
    private const val HEARTBEAT_FAILURES = 3
    private const val HEARTBEAT_RESET_MS = 3 * 24 * 60 * 60 * 1_000L
    private const val REQUEST_TIMEOUT_SECONDS = 10L
    private const val IMAGE_TIMEOUT_MS = 5_000
    private const val IMAGE_MAX_BYTES = 5 * 1024 * 1024
    private const val IMAGE_MAX_PX = 1_024
    private const val CONNECT_TIMEOUT_SECONDS = 20L

    // How long a message waits for a listener that acknowledges it itself (the React Native and
    // Flutter bridges, once their callback has run) before it is acknowledged anyway, so one stuck
    // callback cannot hold back the acknowledgements after it.
    private const val ACK_TIMEOUT_SECONDS = 10L

    // Unsubscribing a filter nothing subscribes to is a harmless round trip the broker always
    // acknowledges, so it proves the connection is alive. The broker ignores client PUBLISHes
    // without a PUBACK, so a publish cannot serve as the heartbeat.
    private const val HEARTBEAT_FILTER = "\$heartbeat"

    @Volatile
    var channelName: String = "Notifications"

    @Volatile
    var ongoingTitle: String = "Appwrite"

    // Reports errors to the Push instance that hosts its subscriptions here. Returns whether the
    // app's onError received the error (false when it registered none).
    @Volatile
    var errorHandler: ((Throwable) -> Boolean)? = null

    @Volatile
    var serviceRunning = false

    // Whether a refused service start was reported, so a job that retries it every run does not
    // report the same failure every 15 seconds.
    @Volatile
    private var serviceStartReported = false

    // The live in-app subscriptions hosted here, each with its callback. Empty after the process
    // was restarted in the background, until the app subscribes again.
    val listeners = CopyOnWriteArrayList<PushListener>()

    // Guards the saved state below and its copy on disk.
    private val lock = Any()
    private var loaded = false
    private var config: PushConfig? = null

    // Background subscriptions saved by an earlier run that no live subscription has taken over.
    private var saved: List<PushEntry> = emptyList()

    // Every MQTT call runs on this thread, in order, so the connection state below needs no lock.
    private val worker = Executors.newSingleThreadScheduledExecutor { runnable ->
        Thread(runnable, "AppwritePushBackground").apply { isDaemon = true }
    }
    private var mqtt: Mqtt5AsyncClient? = null
    private var connectedConfig: PushConfig? = null
    private var connectedNetwork: Network? = null
    private var lastHeartbeat = 0L
    private var heartbeatState: PushHeartbeat? = null
    private val subscribed = mutableMapOf<String, MqttQos>()
    private var networkCallback: ConnectivityManager.NetworkCallback? = null

    // Worker thread only. While a caller waits for a converge (host with a completion), its
    // failures go to that caller, which reports them, instead of onError.
    private var waiting = false
    private var failure: Throwable? = null

    /**
     * Host [newListeners] (the app's live subscriptions) on the background connection with
     * [newConfig], save the background ones, and arm the scheduled wake-ups. Saved subscriptions
     * from an earlier run stay unless a live subscription on the same filter takes them over
     * (with background on or off), or [newConfig] is for another client id (another user), whose
     * saved subscriptions are dropped.
     *
     * With [done], it is called once the connection is up and every filter is subscribed (SUBACK),
     * or with the failure, which is then not reported to onError: the caller reports it.
     */
    fun host(
        context: Context,
        newConfig: PushConfig,
        newListeners: List<PushListener>,
        done: ((Throwable?) -> Unit)? = null,
    ) {
        val app = context.applicationContext
        synchronized(lock) {
            load(app)
            if (config != null && config?.clientId != newConfig.clientId) {
                saved = emptyList()
            }
            // A live subscription on a saved filter takes it over, whether or not it wants background:
            // one that turned background off, or is later unsubscribed, must not leave the saved
            // entry delivering in the background.
            saved = saved.filter { entry -> newListeners.none { entry.filter in it.topics } }
            config = newConfig
            listeners.clear()
            listeners.addAll(newListeners)
            persist(app)
        }
        activate(app, done)
    }

    /**
     * Stop hosting the app's live subscriptions, keeping the saved ones from an earlier run.
     * Shuts down when none remain.
     */
    fun release(context: Context) {
        val app = context.applicationContext
        val active = synchronized(lock) {
            listeners.clear()
            persist(app)
            isActive()
        }
        if (active) {
            worker.execute { converge(app, heartbeat = false) }
        } else {
            shutdown(app)
        }
    }

    /** Stop background delivery completely and forget every saved subscription. */
    fun stop(context: Context) {
        val app = context.applicationContext
        synchronized(lock) {
            listeners.clear()
            config = null
            saved = emptyList()
            loaded = true
            PushStore.clearState(app)
        }
        shutdown(app)
    }

    /** Whether subscriptions saved by an earlier run are still delivered in the background. */
    fun hasSaved(context: Context): Boolean = synchronized(lock) {
        load(context.applicationContext)
        saved.isNotEmpty()
    }

    /** Persist the foreground-mode choice and start or stop the foreground service to match. */
    fun setForeground(context: Context, enabled: Boolean) {
        val app = context.applicationContext
        PushStore.setForeground(app, enabled)
        serviceStartReported = false
        ensureService(app)
    }

    /** Whether the foreground service should run: foreground mode is enabled and there is work to do. */
    fun wantsService(context: Context): Boolean {
        val app = context.applicationContext
        return PushStore.foreground(app) && synchronized(lock) {
            load(app)
            isActive()
        }
    }

    /** Resume saved background delivery when the app starts, without waiting for the next run. */
    fun resume(context: Context) {
        val app = context.applicationContext
        val active = synchronized(lock) {
            load(app)
            isActive()
        }
        if (active) {
            tick(app) {}
        }
    }

    /**
     * One scheduled run: under a wakelock, reconnect if needed, send a heartbeat when one is due,
     * re-arm the next run, and call [done] once finished. Shuts down when nothing is saved.
     */
    fun tick(context: Context, done: () -> Unit) {
        val app = context.applicationContext
        val wakeLock = acquireWakeLock(app)
        worker.execute {
            try {
                val active = synchronized(lock) {
                    load(app)
                    isActive()
                }
                if (active) {
                    // Arm the next run first, so a run cut short (killed, or a slow broker outlasting
                    // the wakelock) still leaves the chain armed. A refused credential in converge()
                    // shuts down, cancelling it again.
                    schedule(app, INTERVAL_MS)
                    ensureService(app)
                    registerNetworkCallback(app)
                    converge(app, heartbeat = true)
                } else {
                    shutdown(app)
                }
            } catch (e: Exception) {
                report(e)
            } finally {
                releaseWakeLock(wakeLock)
                done()
            }
        }
    }

    /** Run once more shortly after the task was removed, so an OEM kill that follows is undone. */
    fun scheduleRestart(context: Context) {
        schedule(context.applicationContext, RESTART_DELAY_MS, jobToo = false)
    }

    /**
     * Forget everything held in memory, as the process dying does, keeping only what is saved.
     * For tests of what happens after the app's process was killed.
     */
    internal fun dropProcessState(context: Context) {
        synchronized(lock) {
            listeners.clear()
            config = null
            saved = emptyList()
            loaded = false
        }
        errorHandler = null
        unregisterNetworkCallback(context.applicationContext)
        worker.submit { disconnect() }.get()
    }

    /** Report an error to the hosting Push instance's onError; logged when there is none. */
    fun report(error: Throwable): Boolean {
        val delivered = try {
            errorHandler?.invoke(error) ?: false
        } catch (callbackError: Exception) {
            Log.e(LOG_TAG, "Push onError threw", callbackError)
            true
        }
        if (!delivered) {
            Log.e(LOG_TAG, "Push background error", error)
        }
        return delivered
    }

    // Must hold [lock].
    private fun load(context: Context) {
        if (loaded) {
            return
        }
        loaded = true
        val state = PushStore.loadState(context) ?: return
        config = state.first
        saved = state.second
    }

    // Must hold [lock].
    private fun isActive(): Boolean = config != null && (saved.isNotEmpty() || listeners.isNotEmpty())

    // Must hold [lock]. Every background subscription, live or saved, one per filter and title.
    // Subscriptions sharing a filter and title are saved once, with QoS 1 when any of them wants it.
    private fun entries(): List<PushEntry> =
        (saved + listeners.filter { it.background }.flatMap { listener -> listener.topics.map { PushEntry(it, listener.retry, listener.title) } })
            .groupBy { it.filter to it.title }
            .map { (key, group) -> PushEntry(key.first, group.any { it.retry }, key.second) }

    // Must hold [lock].
    private fun persist(context: Context) {
        val current = config
        val entries = entries()
        if (current == null || entries.isEmpty()) {
            PushStore.clearState(context)
        } else {
            PushStore.saveState(context, current, entries)
        }
    }

    // Must hold [lock]. The broker subscriptions wanted, at the highest QoS any subscription on a
    // filter asks for.
    private fun wanted(): Map<String, MqttQos> {
        val qos = linkedMapOf<String, MqttQos>()
        fun want(filter: String, retry: Boolean) {
            if (retry) {
                qos[filter] = MqttQos.AT_LEAST_ONCE
            } else if (filter !in qos) {
                qos[filter] = MqttQos.AT_MOST_ONCE
            }
        }
        for (listener in listeners) {
            listener.topics.forEach { want(it, listener.retry) }
        }
        saved.forEach { want(it.filter, it.retry) }
        return qos
    }

    private fun activate(context: Context, done: ((Throwable?) -> Unit)? = null) {
        registerNetworkCallback(context)
        schedule(context, INTERVAL_MS)
        ensureService(context)
        worker.execute { converge(context, heartbeat = false, done) }
    }

    private fun shutdown(context: Context) {
        cancelSchedule(context)
        unregisterNetworkCallback(context)
        if (serviceRunning) {
            context.stopService(Intent(context, PushService::class.java))
        }
        worker.execute { disconnect() }
    }

    // Worker thread only. Bring the connection to the wanted state: reconnect when the config or
    // the default network changed or a due heartbeat fails, then subscribe and unsubscribe the
    // difference. With [done], failures go to it (see [waiting]) instead of onError.
    private fun converge(context: Context, heartbeat: Boolean, done: ((Throwable?) -> Unit)? = null) {
        waiting = done != null
        failure = null
        try {
            convergeOnce(context, heartbeat)
        } catch (e: Exception) {
            fail(e)
        } finally {
            waiting = false
            done?.invoke(failure)
        }
    }

    // Worker thread only. Record a failure for the waiting caller, or report it.
    private fun fail(error: Throwable) {
        if (failure == null) {
            failure = error
        }
        if (!waiting) {
            report(error)
        }
    }

    private fun convergeOnce(context: Context, heartbeat: Boolean) {
        val (current, wanted) = synchronized(lock) { config to wanted() }
        if (current == null || wanted.isEmpty()) {
            disconnect()
            return
        }
        var client = mqtt
        if (client != null && (current != connectedConfig || networkChanged(context))) {
            disconnect()
            client = null
        }
        if (client != null && heartbeat && SystemClock.elapsedRealtime() - lastHeartbeat >= heartbeatInterval(context)) {
            val alive = sendHeartbeat(client)
            recordHeartbeat(context, alive)
            if (alive) {
                lastHeartbeat = SystemClock.elapsedRealtime()
            } else {
                disconnect()
                client = null
            }
        }
        if (client == null) {
            client = connect(context, current) ?: return
        }
        for (filter in subscribed.keys - wanted.keys) {
            request { client.unsubscribeWith().topicFilter(filter).send().get(REQUEST_TIMEOUT_SECONDS, TimeUnit.SECONDS) }
            subscribed.remove(filter)
        }
        for ((filter, qos) in wanted) {
            if (subscribed[filter] != qos && subscribe(client, filter, qos)) {
                subscribed[filter] = qos
            }
        }
    }

    // Worker thread only. Connect with [config], or report why not and return null. A refused
    // credential stops background delivery: retrying it would only be refused again.
    private fun connect(context: Context, config: PushConfig): Mqtt5AsyncClient? {
        // A failed first connect of a waited-for converge goes to the waiting caller only.
        val quiet = waiting
        val connected = AtomicBoolean(false)
        val client = buildPushClient(
            config.copy(keepAlive = KEEP_ALIVE_SECONDS),
            onError = { error ->
                if (!quiet || connected.get()) {
                    report(error)
                }
            },
            onAuthRefused = { error -> worker.execute { refused(context, error) } },
        )
        // Registered before connecting, so the backlog the broker replays right after each
        // SUBSCRIBE reaches the app however the subscription was made (including the ones the
        // client restores itself after an automatic reconnect). Acknowledged by hand, once the
        // message was delivered (see [deliver]).
        client.publishes(MqttGlobalPublishFilter.ALL, { publish -> deliver(context, publish) }, true)
        try {
            client.sendPushConnect(config.copy(keepAlive = KEEP_ALIVE_SECONDS), CONNECT_TIMEOUT_SECONDS)
        } catch (e: Exception) {
            val cause = (e as? ExecutionException)?.cause ?: e
            client.disconnect()
            val error = connectError(cause)
            when {
                isAuthRefusal(cause) -> refused(context, error)
                waiting -> fail(error)
                // A network failure already reached onError through the client's disconnect
                // listener; a refused CONNECT and a timeout did not.
                cause is Mqtt5ConnAckException || cause is TimeoutException -> report(error)
            }
            return null
        }
        connected.set(true)
        mqtt = client
        connectedConfig = config
        connectedNetwork = activeNetwork(context)
        lastHeartbeat = SystemClock.elapsedRealtime()
        subscribed.clear()
        return client
    }

    // Worker thread only.
    private fun subscribe(client: Mqtt5AsyncClient, filter: String, qos: MqttQos): Boolean = request {
        val subAck = client.subscribeWith().topicFilter(filter).qos(qos).send().get(REQUEST_TIMEOUT_SECONDS, TimeUnit.SECONDS)
        val code = subAck.reasonCodes.firstOrNull { it.isError }
        if (code != null) {
            throw AppwriteException(
                subAck.reasonString.map { it.toString() }.orElse("Subscribing to $filter was refused (reason $code)"),
            )
        }
    }

    // Worker thread only. The current heartbeat interval, back at the default once a shrink is
    // old enough.
    private fun heartbeatInterval(context: Context): Long {
        val state = heartbeatState ?: PushStore.heartbeat(context).also { heartbeatState = it }
        if (state.intervalMs < HEARTBEAT_MS && System.currentTimeMillis() - state.shrunkAt >= HEARTBEAT_RESET_MS) {
            saveHeartbeat(context, PushHeartbeat(HEARTBEAT_MS))
            return HEARTBEAT_MS
        }
        return state.intervalMs
    }

    // Worker thread only. Count a failed heartbeat (a connection the network dropped silently),
    // shrinking the interval after HEARTBEAT_FAILURES in a row; a delivered one ends the streak.
    private fun recordHeartbeat(context: Context, alive: Boolean) {
        val state = heartbeatState ?: PushStore.heartbeat(context)
        val next = when {
            alive -> state.copy(failures = 0)
            state.failures + 1 < HEARTBEAT_FAILURES -> state.copy(failures = state.failures + 1)
            else -> PushHeartbeat(maxOf(MIN_HEARTBEAT_MS, state.intervalMs * 3 / 4), 0, System.currentTimeMillis())
        }
        if (next != state) {
            saveHeartbeat(context, next)
        }
    }

    private fun saveHeartbeat(context: Context, state: PushHeartbeat) {
        heartbeatState = state
        PushStore.setHeartbeat(context, state)
    }

    // Worker thread only.
    private fun sendHeartbeat(client: Mqtt5AsyncClient): Boolean = try {
        client.unsubscribeWith().topicFilter(HEARTBEAT_FILTER).send().get(REQUEST_TIMEOUT_SECONDS, TimeUnit.SECONDS)
        true
    } catch (e: Exception) {
        false
    }

    // Run a broker request, recording or reporting its failure. Returns whether it succeeded.
    private fun request(block: () -> Unit): Boolean = try {
        block()
        true
    } catch (e: Exception) {
        fail((e as? ExecutionException)?.cause ?: e)
        false
    }

    // Worker thread only.
    private fun disconnect() {
        mqtt?.disconnect()
        mqtt = null
        connectedConfig = null
        connectedNetwork = null
        subscribed.clear()
    }

    // Worker thread only. The broker refused the credential: report it and stop. With no onError
    // registered the message is also saved, and the next onError registration receives it. A
    // waiting caller receives it instead.
    private fun refused(context: Context, error: Throwable) {
        if (waiting) {
            fail(error)
        } else if (!report(error)) {
            PushStore.setStoppedError(context, error.message ?: "Push connection refused")
        }
        stop(context)
    }

    // Deliver a message, then acknowledge it: right away, or once every listener that acknowledges
    // messages itself has done so (at most ACK_TIMEOUT_SECONDS later).
    private fun deliver(context: Context, publish: Mqtt5Publish) {
        val acknowledged = AtomicBoolean(false)
        val acknowledge = {
            if (acknowledged.compareAndSet(false, true)) {
                runCatching { publish.acknowledge() }
            }
        }
        val pending = AtomicInteger(1)
        val settle = {
            if (pending.decrementAndGet() == 0) {
                acknowledge()
            }
        }
        try {
            deliverMessage(context, publish.toPushMessage()) {
                pending.incrementAndGet()
                val once = AtomicBoolean(false)
                val ack: () -> Unit = {
                    if (once.compareAndSet(false, true)) {
                        settle()
                    }
                }
                ack
            }
        } finally {
            settle()
        }
        if (!acknowledged.get()) {
            worker.schedule({ acknowledge() }, ACK_TIMEOUT_SECONDS, TimeUnit.SECONDS)
        }
    }

    // Deliver a message to the matching live callbacks; with none, to the declared PushReceiver
    // and/or a notification per saved subscription that matches it. [deferAck] hands a listener
    // that acknowledges messages itself its acknowledgement.
    private fun deliverMessage(context: Context, message: PushMessage, deferAck: () -> () -> Unit) {
        val matching = listeners.filter { listener -> listener.topics.any { matchesTopic(it, message.topic) } }
        // Saved background subscriptions no live one has taken over; they deliver even when a live
        // foreground-only subscription on an overlapping filter received the message too.
        val entries = synchronized(lock) { saved }.filter { matchesTopic(it.filter, message.topic) }
        if (matching.isEmpty() && entries.isEmpty()) {
            return
        }
        for (listener in matching) {
            try {
                val acknowledging = listener.acknowledgingCallback
                if (acknowledging != null) {
                    acknowledging(message, deferAck())
                } else {
                    listener.callback(message)
                }
            } catch (e: Exception) {
                report(e)
            }
        }
        val wakeLock = acquireWakeLock(context)
        try {
            // The app's PushReceiver gets only messages no live callback received.
            val handled = matching.isEmpty() && deliverToReceivers(context, message)
            val content = notificationContent(message)
            val titles = matching.filter { it.background }.map { it.title ?: message.topic } +
                if (handled) emptyList() else entries.map { it.title ?: message.topic }
            // A title the server sent replaces every subscription's, so one notification is posted.
            titles.map { content.title ?: it }.distinct().forEach { notify(context, message, it, content) }
        } finally {
            releaseWakeLock(wakeLock)
        }
    }

    // Call every PushReceiver the app declares. Returns whether one handled the message.
    private fun deliverToReceivers(context: Context, message: PushMessage): Boolean {
        val intent = Intent(ACTION_MESSAGE).setPackage(context.packageName)
        val receivers = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            context.packageManager.queryBroadcastReceivers(intent, PackageManager.ResolveInfoFlags.of(0))
        } else {
            @Suppress("DEPRECATION")
            context.packageManager.queryBroadcastReceivers(intent, 0)
        }
        var handled = false
        for (info in receivers) {
            val name = info.activityInfo?.name ?: continue
            try {
                val receiver = Class.forName(name, true, context.classLoader).getDeclaredConstructor().newInstance()
                if (receiver is PushReceiver && receiver.onMessage(context, message)) {
                    handled = true
                }
            } catch (e: Exception) {
                report(e)
            }
        }
        return handled
    }

    /**
     * Post a notification for [message] that opens the app, with the message in its extras. It shows
     * the server's title, body and image from [content], falling back to [title] and the raw payload.
     */
    fun notify(context: Context, message: PushMessage, title: String, content: PushNotificationContent = notificationContent(message)) {
        val manager = NotificationManagerCompat.from(context)
        if (!manager.areNotificationsEnabled()) {
            return
        }
        createChannels(context)
        val id = 31 * message.hashCode() + title.hashCode()
        val body = content.body ?: message.data.takeIf { !content.present }
        val builder = NotificationCompat.Builder(context, CHANNEL_ID)
            .setContentTitle(content.title ?: title)
            .setSmallIcon(notificationIcon(context))
            .setAutoCancel(true)
        if (body != null) {
            builder.setContentText(body).setStyle(NotificationCompat.BigTextStyle().bigText(body))
        }
        content.image?.let { loadImage(it) }?.let { image ->
            builder.setLargeIcon(image)
                .setStyle(NotificationCompat.BigPictureStyle().bigPicture(image).bigLargeIcon(null as Bitmap?).setSummaryText(body))
        }
        context.packageManager.getLaunchIntentForPackage(context.packageName)?.let { launch ->
            launch.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP)
                .putExtra(EXTRA_TOPIC, message.topic)
                .putExtra(EXTRA_PAYLOAD, message.data)
            builder.setContentIntent(
                PendingIntent.getActivity(context, id, launch, PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE),
            )
        }
        try {
            manager.notify(id, builder.build())
        } catch (e: SecurityException) {
            // POST_NOTIFICATIONS not granted; nothing to show.
        }
    }

    /** The server's `notification` block in [message]: nulls when the payload has none or is not JSON. */
    fun notificationContent(message: PushMessage): PushNotificationContent {
        val notification = runCatching { JSONObject(message.data) }.getOrNull()?.optJSONObject("notification")
            ?: return PushNotificationContent(false, null, null, null)
        fun field(name: String) = (notification.opt(name) as? String)?.takeIf { it.isNotEmpty() }
        return PushNotificationContent(true, field("title"), field("body"), field("image"))
    }

    // Downloads notification images, so a slow one is abandoned without holding up delivery.
    private val imageLoader = Executors.newCachedThreadPool { runnable ->
        Thread(runnable, "AppwritePushImage").apply { isDaemon = true }
    }

    // Download a notification image, or null when it cannot be fetched and decoded within
    // IMAGE_TIMEOUT_MS overall. On timeout the connection is closed, which ends a read in progress.
    private fun loadImage(url: String): Bitmap? {
        val connection = runCatching { URL(url).openConnection() as HttpURLConnection }.getOrNull() ?: return null
        connection.connectTimeout = IMAGE_TIMEOUT_MS
        connection.readTimeout = IMAGE_TIMEOUT_MS
        val download = imageLoader.submit<Bitmap?> { connection.inputStream.use { readLimited(it, IMAGE_MAX_BYTES) }?.let { decodeImage(it) } }
        return try {
            download.get(IMAGE_TIMEOUT_MS.toLong(), TimeUnit.MILLISECONDS)
        } catch (e: Exception) {
            download.cancel(true)
            null
        } finally {
            connection.disconnect()
        }
    }

    // At most [limit] bytes of [input], or null when it holds more.
    private fun readLimited(input: InputStream, limit: Int): ByteArray? {
        val out = ByteArrayOutputStream()
        val buffer = ByteArray(8_192)
        while (true) {
            val read = input.read(buffer)
            if (read < 0) {
                return out.toByteArray()
            }
            if (out.size() + read > limit) {
                return null
            }
            out.write(buffer, 0, read)
        }
    }

    // Decode [bytes] downsampled so neither side exceeds IMAGE_MAX_PX, so a large photo cannot
    // exhaust memory while a notification is posted.
    private fun decodeImage(bytes: ByteArray): Bitmap? {
        val bounds = BitmapFactory.Options().apply { inJustDecodeBounds = true }
        BitmapFactory.decodeByteArray(bytes, 0, bytes.size, bounds)
        if (bounds.outWidth <= 0 || bounds.outHeight <= 0) {
            return null
        }
        var sample = 1
        while (bounds.outWidth / sample > IMAGE_MAX_PX || bounds.outHeight / sample > IMAGE_MAX_PX) {
            sample *= 2
        }
        return BitmapFactory.decodeByteArray(bytes, 0, bytes.size, BitmapFactory.Options().apply { inSampleSize = sample })
    }

    /** The ongoing notification the foreground service shows, on its own quiet channel. */
    fun ongoingNotification(context: Context) = NotificationCompat.Builder(context, SERVICE_CHANNEL_ID)
        .also { createChannels(context) }
        .setContentTitle(ongoingTitle)
        .setContentText("Listening for messages")
        .setSmallIcon(notificationIcon(context))
        .setPriority(NotificationCompat.PRIORITY_LOW)
        .setOngoing(true)
        .build()

    private fun createChannels(context: Context) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            return
        }
        val manager = context.getSystemService(NotificationManager::class.java) ?: return
        manager.createNotificationChannel(NotificationChannel(CHANNEL_ID, channelName, NotificationManager.IMPORTANCE_HIGH))
        manager.createNotificationChannel(
            NotificationChannel(SERVICE_CHANNEL_ID, "Background connection", NotificationManager.IMPORTANCE_LOW),
        )
    }

    // The icon named by the app's `<meta-data android:name="io.appwrite.push.notification_icon">`, else a
    // generic one.
    private fun notificationIcon(context: Context): Int {
        val metaData = runCatching {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                context.packageManager.getApplicationInfo(context.packageName, PackageManager.ApplicationInfoFlags.of(PackageManager.GET_META_DATA.toLong()))
            } else {
                @Suppress("DEPRECATION")
                context.packageManager.getApplicationInfo(context.packageName, PackageManager.GET_META_DATA)
            }.metaData
        }.getOrNull()
        return metaData?.getInt(NOTIFICATION_ICON, 0)?.takeIf { it != 0 } ?: android.R.drawable.stat_notify_chat
    }

    private fun ensureService(context: Context) {
        if (!wantsService(context)) {
            if (serviceRunning) {
                context.stopService(Intent(context, PushService::class.java))
            }
            return
        }
        if (serviceRunning) {
            return
        }
        try {
            ContextCompat.startForegroundService(context, Intent(context, PushService::class.java))
        } catch (e: Exception) {
            // Android 12+ refuses a foreground-service start from the background; the scheduled
            // runs keep delivering, and the next start from the foreground succeeds.
            if (!serviceStartReported) {
                serviceStartReported = true
                report(e)
            }
        }
    }

    // Arm the next run in [delayMs]: the job, and an alarm just after it in case the job is late.
    private fun schedule(context: Context, delayMs: Long, jobToo: Boolean = true) {
        val interval = if (delayMs == INTERVAL_MS && privileged(context)) PRIVILEGED_INTERVAL_MS else delayMs
        if (jobToo) {
            try {
                val job = JobInfo.Builder(JOB_ID, ComponentName(context, PushJobService::class.java))
                    .setMinimumLatency(interval)
                    .setRequiredNetworkType(JobInfo.NETWORK_TYPE_ANY)
                    .setPersisted(true)
                    .build()
                context.getSystemService(JobScheduler::class.java)?.schedule(job)
            } catch (e: Exception) {
                report(e)
            }
        }
        val alarms = context.getSystemService(AlarmManager::class.java) ?: return
        val at = SystemClock.elapsedRealtime() + interval + 1_000L
        val intent = tickIntent(context)
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S && !alarms.canScheduleExactAlarms()) {
                alarms.setAndAllowWhileIdle(AlarmManager.ELAPSED_REALTIME_WAKEUP, at, intent)
            } else {
                alarms.setExactAndAllowWhileIdle(AlarmManager.ELAPSED_REALTIME_WAKEUP, at, intent)
            }
        } catch (e: SecurityException) {
            alarms.setAndAllowWhileIdle(AlarmManager.ELAPSED_REALTIME_WAKEUP, at, intent)
        }
    }

    private fun cancelSchedule(context: Context) {
        context.getSystemService(JobScheduler::class.java)?.cancel(JOB_ID)
        context.getSystemService(AlarmManager::class.java)?.cancel(tickIntent(context))
    }

    private fun tickIntent(context: Context): PendingIntent = PendingIntent.getBroadcast(
        context,
        0,
        Intent(context, PushAlarmReceiver::class.java).setAction(ACTION_TICK),
        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
    )

    // Allowed exact alarms or exempt from battery optimisation: the alarm is reliable, so the
    // runs can be spaced further apart.
    private fun privileged(context: Context): Boolean =
        Build.VERSION.SDK_INT < Build.VERSION_CODES.S ||
            context.getSystemService(AlarmManager::class.java)?.canScheduleExactAlarms() == true ||
            context.getSystemService(PowerManager::class.java)?.isIgnoringBatteryOptimizations(context.packageName) == true

    private fun activeNetwork(context: Context): Network? =
        runCatching { context.getSystemService(ConnectivityManager::class.java)?.activeNetwork }.getOrNull()

    private fun networkChanged(context: Context): Boolean {
        val now = activeNetwork(context)
        return now != null && connectedNetwork != null && now != connectedNetwork
    }

    // Reconnect as soon as the default network changes (e.g. from cellular to Wi-Fi) while the
    // process is alive, instead of waiting for the next run to notice.
    private fun registerNetworkCallback(context: Context) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.N) {
            return
        }
        synchronized(lock) {
            if (networkCallback != null) {
                return
            }
            val callback = object : ConnectivityManager.NetworkCallback() {
                override fun onAvailable(network: Network) {
                    worker.execute {
                        if (mqtt != null && network != connectedNetwork) {
                            converge(context, heartbeat = false)
                        }
                    }
                }
            }
            try {
                context.getSystemService(ConnectivityManager::class.java)?.registerDefaultNetworkCallback(callback)
                networkCallback = callback
            } catch (e: Exception) {
                report(e)
            }
        }
    }

    private fun unregisterNetworkCallback(context: Context) {
        val callback = synchronized(lock) { networkCallback.also { networkCallback = null } } ?: return
        runCatching { context.getSystemService(ConnectivityManager::class.java)?.unregisterNetworkCallback(callback) }
    }

    private fun acquireWakeLock(context: Context): PowerManager.WakeLock? = runCatching {
        context.getSystemService(PowerManager::class.java)
            ?.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "Appwrite:push")
            ?.apply {
                setReferenceCounted(false)
                acquire(WAKE_LOCK_MS)
            }
    }.getOrNull()

    private fun releaseWakeLock(wakeLock: PowerManager.WakeLock?) {
        runCatching {
            if (wakeLock?.isHeld == true) {
                wakeLock.release()
            }
        }
    }
}

/**
 * Background push state in the app's no-backup directory, so a restored backup on another
 * device never carries this install's id or credential: the saved subscriptions with their
 * connection config (cleared when background delivery stops), and the settings that outlive
 * it (the install id, the foreground-mode choice, a refusal waiting for onError).
 */
internal object PushStore {
    private const val STATE_FILE = "appwrite_push_state.json"
    private const val SETTINGS_FILE = "appwrite_push_settings.json"

    fun loadState(context: Context): Pair<PushConfig, List<PushEntry>>? = synchronized(this) {
        val json = read(context, STATE_FILE) ?: return null
        runCatching {
            val config = json.getJSONObject("config").let {
                PushConfig(
                    host = it.getString("host"),
                    port = it.getInt("port"),
                    tls = it.getBoolean("tls"),
                    tlsInsecure = it.getBoolean("tlsInsecure"),
                    clientId = it.getString("clientId"),
                    keepAlive = it.getInt("keepAlive"),
                    authMethod = it.getString("authMethod"),
                    credential = it.getString("credential"),
                    project = it.getString("project"),
                )
            }
            val list = json.getJSONArray("entries")
            val entries = (0 until list.length()).map { index ->
                val entry = list.getJSONObject(index)
                PushEntry(
                    filter = entry.getString("filter"),
                    retry = entry.getBoolean("retry"),
                    title = if (entry.isNull("title")) null else entry.getString("title"),
                )
            }
            config to entries
        }.getOrNull()
    }

    fun saveState(context: Context, config: PushConfig, entries: List<PushEntry>) = synchronized(this) {
        val json = JSONObject()
            .put(
                "config",
                JSONObject()
                    .put("host", config.host)
                    .put("port", config.port)
                    .put("tls", config.tls)
                    .put("tlsInsecure", config.tlsInsecure)
                    .put("clientId", config.clientId)
                    .put("keepAlive", config.keepAlive)
                    .put("authMethod", config.authMethod)
                    .put("credential", config.credential)
                    .put("project", config.project),
            )
            .put(
                "entries",
                JSONArray(entries.map { JSONObject().put("filter", it.filter).put("retry", it.retry).put("title", it.title ?: JSONObject.NULL) }),
            )
        write(context, STATE_FILE, json)
    }

    fun clearState(context: Context) = synchronized(this) {
        file(context, STATE_FILE).delete()
    }

    /** A random id for this install, created once, which keeps the broker's replay position. */
    fun installId(context: Context): String = synchronized(this) {
        val settings = read(context, SETTINGS_FILE) ?: JSONObject()
        settings.optString("installId").ifEmpty {
            val id = UUID.randomUUID().toString()
            write(context, SETTINGS_FILE, settings.put("installId", id))
            id
        }
    }

    fun foreground(context: Context): Boolean = synchronized(this) {
        read(context, SETTINGS_FILE)?.optBoolean("foreground", false) ?: false
    }

    fun setForeground(context: Context, enabled: Boolean) = synchronized(this) {
        write(context, SETTINGS_FILE, (read(context, SETTINGS_FILE) ?: JSONObject()).put("foreground", enabled))
    }

    /** The saved adaptive heartbeat; the default interval until one was saved. */
    fun heartbeat(context: Context): PushHeartbeat = synchronized(this) {
        val json = read(context, SETTINGS_FILE)?.optJSONObject("heartbeat") ?: return PushHeartbeat(PushBackground.HEARTBEAT_MS)
        PushHeartbeat(
            intervalMs = json.optLong("intervalMs", PushBackground.HEARTBEAT_MS),
            failures = json.optInt("failures", 0),
            shrunkAt = json.optLong("shrunkAt", 0L),
        )
    }

    fun setHeartbeat(context: Context, state: PushHeartbeat) = synchronized(this) {
        val heartbeat = JSONObject()
            .put("intervalMs", state.intervalMs)
            .put("failures", state.failures)
            .put("shrunkAt", state.shrunkAt)
        write(context, SETTINGS_FILE, (read(context, SETTINGS_FILE) ?: JSONObject()).put("heartbeat", heartbeat))
    }

    fun setStoppedError(context: Context, message: String) = synchronized(this) {
        write(context, SETTINGS_FILE, (read(context, SETTINGS_FILE) ?: JSONObject()).put("stoppedError", message))
    }

    /** The refusal that stopped background delivery while no onError was registered, once. */
    fun takeStoppedError(context: Context): String? = synchronized(this) {
        val settings = read(context, SETTINGS_FILE) ?: return null
        val message = settings.optString("stoppedError").ifEmpty { return null }
        settings.remove("stoppedError")
        write(context, SETTINGS_FILE, settings)
        message
    }

    private fun file(context: Context, name: String) = AtomicFile(File(context.noBackupFilesDir, name))

    private fun read(context: Context, name: String): JSONObject? =
        runCatching { JSONObject(String(file(context, name).readFully(), Charsets.UTF_8)) }.getOrNull()

    private fun write(context: Context, name: String, json: JSONObject) {
        val file = file(context, name)
        val out = try {
            file.startWrite()
        } catch (e: IOException) {
            Log.e(LOG_TAG, "Could not save push state", e)
            return
        }
        try {
            out.write(json.toString().toByteArray(Charsets.UTF_8))
            file.finishWrite(out)
        } catch (e: IOException) {
            file.failWrite(out)
            Log.e(LOG_TAG, "Could not save push state", e)
        }
    }
}

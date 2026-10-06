package io.appwrite.services

import android.content.Context
import android.os.Build
import android.util.Base64
import com.hivemq.client.mqtt.MqttClient
import com.hivemq.client.mqtt.datatypes.MqttUtf8String
import com.hivemq.client.mqtt.lifecycle.MqttClientDisconnectedContext
import com.hivemq.client.mqtt.lifecycle.MqttDisconnectSource
import com.hivemq.client.mqtt.mqtt5.Mqtt5AsyncClient
import com.hivemq.client.mqtt.mqtt5.Mqtt5ClientConfig
import com.hivemq.client.mqtt.mqtt5.auth.Mqtt5EnhancedAuthMechanism
import com.hivemq.client.mqtt.mqtt5.exceptions.Mqtt5ConnAckException
import com.hivemq.client.mqtt.mqtt5.exceptions.Mqtt5DisconnectException
import com.hivemq.client.mqtt.mqtt5.message.auth.Mqtt5Auth
import com.hivemq.client.mqtt.mqtt5.message.auth.Mqtt5AuthBuilder
import com.hivemq.client.mqtt.mqtt5.message.auth.Mqtt5EnhancedAuthBuilder
import com.hivemq.client.mqtt.mqtt5.message.connect.Mqtt5Connect
import com.hivemq.client.mqtt.mqtt5.message.connect.connack.Mqtt5ConnAck
import com.hivemq.client.mqtt.mqtt5.message.connect.connack.Mqtt5ConnAckReasonCode
import com.hivemq.client.mqtt.mqtt5.message.disconnect.Mqtt5Disconnect
import com.hivemq.client.mqtt.mqtt5.message.disconnect.Mqtt5DisconnectReasonCode
import com.hivemq.client.mqtt.mqtt5.message.publish.Mqtt5Publish
import io.appwrite.exceptions.AppwriteException
import org.json.JSONObject
import java.security.KeyStore
import java.security.Provider
import java.security.cert.X509Certificate
import java.util.concurrent.CompletableFuture
import java.util.concurrent.ExecutionException
import java.util.concurrent.TimeUnit
import java.util.concurrent.atomic.AtomicBoolean
import javax.net.ssl.ManagerFactoryParameters
import javax.net.ssl.TrustManager
import javax.net.ssl.TrustManagerFactory
import javax.net.ssl.TrustManagerFactorySpi
import javax.net.ssl.X509TrustManager

/**
 * A message delivered on a subscribed topic — the MQTT push analog of a realtime event.
 */
data class PushMessage(
    val topic: String,
    val payload: ByteArray,
    val qos: Int,
) {
    /** The payload decoded as UTF-8 text, as it was sent. */
    val data: String
        get() = String(payload, Charsets.UTF_8)
}

/** Connection parameters shared between the in-process client and the foreground service. */
internal data class PushConfig(
    val host: String,
    val port: Int,
    val tls: Boolean,
    val tlsInsecure: Boolean,
    val clientId: String,
    val keepAlive: Int,
    val authMethod: String,
    val credential: String,
    val project: String,
)

/**
 * The userId claim from an Appwrite JWT, used as the default MQTT client id so the
 * broker's replay cursor is stable per user. Returns "" when the token is not a decodable JWT
 * (e.g. a session secret), so the caller can fall back to the raw credential.
 */
internal fun userIdFromJwt(jwt: String): String {
    val parts = jwt.split('.')
    if (parts.size < 2) {
        return ""
    }
    return runCatching {
        val json = String(
            Base64.decode(parts[1], Base64.URL_SAFE or Base64.NO_WRAP or Base64.NO_PADDING),
            Charsets.UTF_8,
        )
        JSONObject(json).optString("userId", "")
    }.getOrDefault("")
}

/** The user `id` from an Appwrite session secret, or "" when it is not decodable. */
internal fun userIdFromSession(session: String): String = runCatching {
    val json = String(Base64.decode(session, Base64.DEFAULT), Charsets.UTF_8)
    JSONObject(json).optString("id", "")
}.getOrDefault("")

/**
 * The default MQTT client id: one per user and install (`<userId>-<installId>`, or the install id
 * alone when the credential names no user). The broker keeps the replay position per user and
 * client id, so each device resumes its own backlog across restarts, and two devices of one user
 * do not take over each other's session.
 */
internal fun defaultPushClientId(context: Context, authMethod: String, credential: String): String {
    val userId = if (authMethod == "appwrite-session") userIdFromSession(credential) else userIdFromJwt(credential)
    val installId = PushStore.installId(context)
    return if (userId.isEmpty()) installId else "$userId-$installId"
}

/**
 * Build (but do not connect) an MQTT 5 client from [config]. [onError] receives every connection
 * error (a lost connection, a failed automatic reconnect, a broker DISCONNECT) except a refused
 * initial CONNECT, which [pushConnect] throws instead.
 */
internal fun buildPushClient(
    config: PushConfig,
    onConnected: (() -> Unit)? = null,
    onDisconnected: (() -> Unit)? = null,
    onError: ((Throwable) -> Unit)? = null,
    onAuthRefused: ((Throwable) -> Unit)? = null,
): Mqtt5AsyncClient {
    // config.clientId is stable per user (see buildConfig), so a reconnect rebuild reuses it
    // and resumes the same session.
    var builder = MqttClient.builder()
        .useMqttVersion5()
        .serverHost(config.host)
        .serverPort(config.port)
        // Recover from an unexpected disconnect (network drop, broker restart) with HiveMQ's
        // exponential backoff. A user-initiated disconnect() (see close()) does not trigger it.
        // Because clean start is off and the broker resumes the same session, subscriptions and
        // the QoS-1 replay cursor persist, so delivery continues without resubscribing (which
        // would stack a second per-subscription callback).
        .automaticReconnectWithDefaultConfig()

    if (config.clientId.isNotEmpty()) {
        builder = builder.identifier(config.clientId)
    }

    // Whether this client has connected yet: until it has, a refused CONNECT is final.
    val connected = AtomicBoolean(false)
    builder = builder.addConnectedListener {
        connected.set(true)
        onConnected?.invoke()
    }
    builder = builder.addDisconnectedListener { context ->
        // A refused first CONNECT (bad credential, rate limit) is final: stop the automatic
        // reconnect so pushConnect fails with the broker's reason instead of retrying forever.
        val refused = !connected.get() && context.cause is Mqtt5ConnAckException
        // With [onAuthRefused], a credential refused later (a failed automatic reconnect or
        // re-auth) is final too, instead of being retried with the same credential forever.
        val authRefused = onAuthRefused != null && connected.get() &&
            context.source != MqttDisconnectSource.USER && isAuthRefusal(context.cause)
        if (refused || authRefused) {
            context.reconnector.reconnect(false)
        }
        onDisconnected?.invoke()
        if (!refused) {
            val error = pushDisconnectError(context)
            if (authRefused && error != null) {
                // Reported by onAuthRefused, which also stops for good.
                onAuthRefused?.invoke(error)
            } else {
                error?.let { onError?.invoke(it) }
            }
        }
    }

    if (config.tls) {
        builder = if (config.tlsInsecure) {
            builder.sslConfig()
                .trustManagerFactory(PushInsecureTrustManagerFactory)
                .hostnameVerifier { _, _ -> true }
                .applySslConfig()
        } else {
            builder.sslWithDefaultConfig()
        }
    }

    return builder.buildAsync()
}

/**
 * Connect with Appwrite enhanced auth; blocks until CONNACK. Throws an
 * [AppwriteException] on failure, whose message is the broker's MQTT 5
 * Reason String when it refused the CONNECT with one.
 */
internal fun Mqtt5AsyncClient.pushConnect(config: PushConfig) {
    try {
        sendPushConnect(config)
    } catch (e: Exception) {
        throw connectError((e as? ExecutionException)?.cause ?: e)
    }
}

/** The error a failed CONNECT reports: the broker's Reason String when it refused one. */
internal fun connectError(cause: Throwable): AppwriteException =
    if (cause is Mqtt5ConnAckException) {
        connAckError(cause)
    } else {
        AppwriteException(cause.message ?: "MQTT connection failed")
    }

/**
 * Whether [error] is the broker refusing the credential (a CONNECT or re-auth), which retrying
 * with the same credential cannot fix, unlike a rate limit or a network failure.
 */
internal fun isAuthRefusal(error: Throwable?): Boolean = when (error) {
    is Mqtt5ConnAckException -> error.mqttMessage.reasonCode in setOf(
        Mqtt5ConnAckReasonCode.NOT_AUTHORIZED,
        Mqtt5ConnAckReasonCode.BAD_USER_NAME_OR_PASSWORD,
        Mqtt5ConnAckReasonCode.BAD_AUTHENTICATION_METHOD,
        Mqtt5ConnAckReasonCode.BANNED,
    )
    is Mqtt5DisconnectException -> error.mqttMessage.reasonCode == Mqtt5DisconnectReasonCode.NOT_AUTHORIZED
    else -> false
}

/** Send the CONNECT and wait for the CONNACK, at most [timeoutSeconds] when given. */
internal fun Mqtt5AsyncClient.sendPushConnect(config: PushConfig, timeoutSeconds: Long? = null) {
    val connAck = connectWith()
        .enhancedAuth(PushAuthMechanism(config.authMethod, config.credential))
        // Clean start is always off, so the broker keeps this client's session and can
        // redeliver missed messages to QoS-1 subscriptions on reconnect.
        .cleanStart(false)
        .keepAlive(config.keepAlive)
        .userProperties()
        .add("projectId", config.project)
        .applyUserProperties()
        .send()
    if (timeoutSeconds == null) {
        connAck.get()
    } else {
        connAck.get(timeoutSeconds, TimeUnit.SECONDS)
    }
}

/**
 * The error a lost connection reports, or null when it is not an error (a disconnect the app
 * asked for, or a broker DISCONNECT with a success reason code). The broker explains a refused
 * CONNECT or a DISCONNECT it sends with an MQTT 5 Reason String, which becomes the message.
 */
internal fun pushDisconnectError(context: MqttClientDisconnectedContext): Throwable? {
    val cause = context.cause
    return when {
        context.source == MqttDisconnectSource.USER -> null
        cause is Mqtt5ConnAckException -> connAckError(cause)
        cause is Mqtt5DisconnectException && context.source == MqttDisconnectSource.SERVER -> {
            val disconnect = cause.mqttMessage
            if (disconnect.reasonCode.isError) {
                AppwriteException(
                    disconnect.reasonString.map { it.toString() }
                        .orElse("Disconnected by the broker (reason ${disconnect.reasonCode})"),
                )
            } else {
                null
            }
        }
        else -> cause
    }
}

/** A refused CONNECT, with the CONNACK Reason String as its message when the broker sent one. */
internal fun connAckError(e: Mqtt5ConnAckException): AppwriteException =
    AppwriteException(
        e.mqttMessage.reasonString.map { it.toString() }.orElse(e.message ?: "MQTT connection refused"),
    )

internal fun Mqtt5Publish.toPushMessage(): PushMessage =
    PushMessage(
        topic = topic.toString(),
        payload = payloadAsBytes,
        qos = qos.code,
    )

/**
 * Single-step MQTT 5 enhanced auth: the method and credential are placed in the CONNECT
 * packet and the broker accepts them in the CONNACK, with no AUTH round-trip.
 */
internal class PushAuthMechanism(
    private val method: String,
    private val credential: String,
) : Mqtt5EnhancedAuthMechanism {

    override fun getMethod(): MqttUtf8String = MqttUtf8String.of(method)

    override fun getTimeout(): Int = 30

    override fun onAuth(
        clientConfig: Mqtt5ClientConfig,
        connect: Mqtt5Connect,
        authBuilder: Mqtt5EnhancedAuthBuilder,
    ): CompletableFuture<Void> {
        authBuilder.data(credential.toByteArray(Charsets.UTF_8))
        return CompletableFuture.completedFuture(null)
    }

    override fun onReAuth(
        clientConfig: Mqtt5ClientConfig,
        authBuilder: Mqtt5AuthBuilder,
    ): CompletableFuture<Void> {
        authBuilder.data(credential.toByteArray(Charsets.UTF_8))
        return CompletableFuture.completedFuture(null)
    }

    override fun onContinue(
        clientConfig: Mqtt5ClientConfig,
        auth: Mqtt5Auth,
        authBuilder: Mqtt5AuthBuilder,
    ): CompletableFuture<Boolean> = CompletableFuture.completedFuture(true)

    override fun onAuthSuccess(
        clientConfig: Mqtt5ClientConfig,
        connAck: Mqtt5ConnAck,
    ): CompletableFuture<Boolean> = CompletableFuture.completedFuture(true)

    override fun onReAuthSuccess(
        clientConfig: Mqtt5ClientConfig,
        auth: Mqtt5Auth,
    ): CompletableFuture<Boolean> = CompletableFuture.completedFuture(true)

    override fun onAuthRejected(clientConfig: Mqtt5ClientConfig, connAck: Mqtt5ConnAck) = Unit

    override fun onReAuthRejected(clientConfig: Mqtt5ClientConfig, disconnect: Mqtt5Disconnect) = Unit

    override fun onAuthError(clientConfig: Mqtt5ClientConfig, cause: Throwable) = Unit

    override fun onReAuthError(clientConfig: Mqtt5ClientConfig, cause: Throwable) = Unit
}

/**
 * A [TrustManagerFactory] that accepts any certificate — used when `tlsInsecure` is set
 * (for a broker whose certificate does not chain to a public root).
 */
internal object PushInsecureTrustManagerFactory : TrustManagerFactory(
    object : TrustManagerFactorySpi() {
        override fun engineInit(keyStore: KeyStore?) = Unit

        override fun engineInit(parameters: ManagerFactoryParameters?) = Unit

        override fun engineGetTrustManagers(): Array<TrustManager> = arrayOf(
            object : X509TrustManager {
                override fun checkClientTrusted(chain: Array<out X509Certificate>?, authType: String?) = Unit

                override fun checkServerTrusted(chain: Array<out X509Certificate>?, authType: String?) = Unit

                override fun getAcceptedIssuers(): Array<X509Certificate> = emptyArray()
            },
        )
    },
    @Suppress("DEPRECATION") object : Provider("AppwriteInsecure", 1.0, "insecure trust-all") {},
    "AppwriteInsecure",
)

/** A live in-app subscription hosted in the background: its topics, callback, notification opt-in and QoS. */
internal class PushListener(
    val topics: Set<String>,
    val callback: (PushMessage) -> Unit,
    val background: Boolean,
    val title: String?,
    val retry: Boolean,
    // Called instead of [callback] when set, with the acknowledgement to run once the message was
    // handled: the React Native and Flutter bridges acknowledge after their callback has run.
    val acknowledgingCallback: ((PushMessage, () -> Unit) -> Unit)? = null,
)

/** MQTT topic-filter match with '+' (single level) and '#' (multi level). */
internal fun matchesTopic(filter: String, topic: String): Boolean {
    val filterParts = filter.split('/')
    val topicParts = topic.split('/')
    for (i in filterParts.indices) {
        if (filterParts[i] == "#") {
            return true
        }
        if (i >= topicParts.size) {
            return false
        }
        if (filterParts[i] != "+" && filterParts[i] != topicParts[i]) {
            return false
        }
    }
    return filterParts.size == topicParts.size
}

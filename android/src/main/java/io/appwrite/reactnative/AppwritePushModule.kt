package io.appwrite.reactnative

import android.content.Intent
import android.util.Base64
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule
import io.appwrite.services.PushBackground
import io.appwrite.services.PushBridge
import io.appwrite.services.PushMessage
import org.json.JSONObject

/**
 * The React Native side of [PushBridge]: the SDK's `Push` hosts its background subscriptions
 * here on Android, and receives their messages and errors as events. It also reports taps on the
 * notifications they post: the one that launched the app, and later ones as events.
 *
 * [emit] sends an event to JS; tests replace it to observe what JS would receive.
 */
class AppwritePushModule internal constructor(
    private val reactContext: ReactApplicationContext,
    private val emit: (String, Map<String, Any?>) -> Unit,
) : ReactContextBaseJavaModule(reactContext) {
    constructor(reactContext: ReactApplicationContext) : this(
        reactContext,
        { event, body ->
            if (reactContext.hasActiveReactInstance()) {
                reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit(event, Arguments.makeNativeMap(body))
            }
        },
    )

    private val bridge = PushBridge(
        reactContext,
        object : PushBridge.Events {
            override fun onMessage(subscriptionId: String, message: PushMessage, ackToken: String) = emit(
                MESSAGE_EVENT,
                mapOf(
                    "id" to subscriptionId,
                    "topic" to message.topic,
                    "payload" to Base64.encodeToString(message.payload, Base64.NO_WRAP),
                    "qos" to message.qos,
                    "ackToken" to ackToken,
                ),
            )

            override fun onError(message: String) = emit(ERROR_EVENT, mapOf("message" to message))
        },
    )

    private val intents = AppwritePushIntentListener { intent ->
        opened(intent)?.let { emit(OPENED_EVENT, it) }
    }

    init {
        reactContext.addActivityEventListener(intents)
    }

    override fun getName(): String = NAME

    // Resolves with the tapped notification that launched the app as JSON (topic and payload),
    // once, or null.
    @ReactMethod
    fun getInitialNotification(promise: Promise) = settle(promise) {
        reactContext.currentActivity?.intent?.let { opened(it) }?.let { JSONObject(it).toString() }
    }

    override fun invalidate() {
        reactContext.removeActivityEventListener(intents)
        super.invalidate()
    }

    // Resolves once the connection is up and every filter is subscribed, or rejects with why not.
    @ReactMethod
    fun host(config: String, subscriptions: String, promise: Promise) {
        try {
            bridge.host(config, subscriptions) { error ->
                if (error == null) {
                    promise.resolve(null)
                } else {
                    promise.reject(ERROR_CODE, error)
                }
            }
        } catch (e: Exception) {
            promise.reject(ERROR_CODE, e.message, e)
        }
    }

    @ReactMethod
    fun ack(token: String) = bridge.ack(token)

    @ReactMethod
    fun release(promise: Promise) = settle(promise) {
        bridge.release()
        null
    }

    @ReactMethod
    fun stop(promise: Promise) = settle(promise) {
        bridge.stop()
        null
    }

    @ReactMethod
    fun setForeground(enabled: Boolean, promise: Promise) = settle(promise) {
        bridge.setForeground(enabled)
        null
    }

    @ReactMethod
    fun hasSaved(promise: Promise) = settle(promise) { bridge.hasSaved() }

    @ReactMethod
    fun resume(authMethod: String?, credential: String?, signedOutWhenMissing: Boolean, promise: Promise) = settle(promise) {
        bridge.resume(authMethod, credential, signedOutWhenMissing)
        null
    }

    @ReactMethod
    fun backgroundStatus(promise: Promise) = settle(promise) { bridge.backgroundStatus() }

    @ReactMethod
    fun requestExactAlarms(promise: Promise) = settle(promise) { bridge.requestExactAlarms() }

    @ReactMethod
    fun requestIgnoreBatteryOptimizations(promise: Promise) = settle(promise) { bridge.requestIgnoreBatteryOptimizations() }

    @ReactMethod
    fun setErrorCallback(registered: Boolean, promise: Promise) = settle(promise) { bridge.setErrorCallback(registered) }

    @ReactMethod
    fun defaultClientId(authMethod: String, credential: String, promise: Promise) =
        settle(promise) { bridge.defaultClientId(authMethod, credential) }

    // Required by NativeEventEmitter; events are emitted whether or not anyone listens.
    @ReactMethod
    fun addListener(eventName: String) = Unit

    @ReactMethod
    fun removeListeners(count: Double) = Unit

    // The tapped notification's topic and payload, taken off [intent] so the tap is reported once.
    private fun opened(intent: Intent): Map<String, Any?>? {
        val topic = intent.getStringExtra(PushBackground.EXTRA_TOPIC) ?: return null
        val payload = intent.getStringExtra(PushBackground.EXTRA_PAYLOAD) ?: return null
        intent.removeExtra(PushBackground.EXTRA_TOPIC)
        intent.removeExtra(PushBackground.EXTRA_PAYLOAD)
        return mapOf("topic" to topic, "payload" to payload)
    }

    private fun settle(promise: Promise, block: () -> Any?) {
        try {
            promise.resolve(block())
        } catch (e: Exception) {
            promise.reject(ERROR_CODE, e.message, e)
        }
    }

    companion object {
        const val NAME = "AppwritePush"
        const val MESSAGE_EVENT = "AppwritePushMessage"
        const val ERROR_EVENT = "AppwritePushError"
        const val OPENED_EVENT = "AppwritePushOpened"
        private const val ERROR_CODE = "appwrite_push"
    }
}

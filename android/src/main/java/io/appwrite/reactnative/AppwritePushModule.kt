package io.appwrite.reactnative

import android.util.Base64
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule
import io.appwrite.services.PushBridge
import io.appwrite.services.PushMessage

/**
 * The React Native side of [PushBridge]: the SDK's `Push` hosts its background subscriptions
 * here on Android, and receives their messages and errors as events.
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

    override fun getName(): String = NAME

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
    fun resume(promise: Promise) = settle(promise) {
        bridge.resume()
        null
    }

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
        private const val ERROR_CODE = "appwrite_push"
    }
}

package io.appwrite.reactnative

import android.webkit.CookieManager
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class AppwriteCookiesModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String = NAME

    @ReactMethod
    fun session(url: String, project: String, promise: Promise) {
        val name = "a_session_$project"
        try {
            val value = CookieManager.getInstance().getCookie(url)
                ?.split(";")
                ?.map { it.trim() }
                ?.firstOrNull { it.substringBefore("=") == name }
                ?.substringAfter("=")
            promise.resolve(value)
        } catch (e: Exception) {
            promise.reject(ERROR_CODE, e.message, e)
        }
    }

    companion object {
        const val NAME = "AppwriteCookies"
        private const val ERROR_CODE = "appwrite_cookies"
    }
}

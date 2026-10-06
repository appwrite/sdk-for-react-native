package io.appwrite.exceptions

/** A push error. When the broker explained a refusal or a disconnect, that is its message. */
class AppwriteException(
    override val message: String? = null,
) : Exception(message)

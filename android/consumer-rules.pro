# Push: rules applied to apps that shrink with R8.
#
# The shaded HiveMQ MQTT client relocates Netty and JCTools under
# com.hivemq.client.internal.shaded. Netty references optional classes that are never loaded
# on Android: native transports, the HTTP/WebSocket codecs, proxy handlers, alternative TLS
# providers (tcnative, BouncyCastle, Conscrypt, Jetty ALPN) and logging backends.
-dontwarn com.hivemq.client.internal.shaded.io.netty.channel.epoll.**
-dontwarn com.hivemq.client.internal.shaded.io.netty.channel.kqueue.**
-dontwarn com.hivemq.client.internal.shaded.io.netty.handler.codec.http.**
-dontwarn com.hivemq.client.internal.shaded.io.netty.handler.proxy.**
-dontwarn com.hivemq.client.internal.shaded.io.netty.internal.tcnative.**
-dontwarn org.bouncycastle.**
-dontwarn org.conscrypt.**
-dontwarn org.eclipse.jetty.**
-dontwarn org.apache.log4j.**
-dontwarn org.apache.logging.log4j.**
-dontwarn org.slf4j.**
-dontwarn reactor.blockhound.**

# Netty and JCTools reach their own fields by name, through atomic field updaters and Unsafe offsets.
-keepclassmembernames class com.hivemq.client.internal.shaded.io.netty.** { <fields>; }
-keepclassmembers class com.hivemq.client.internal.shaded.org.jctools.** { <fields>; }

# Netty's leak detector looks these methods up by name when its classes load.
-keepclassmembers class com.hivemq.client.internal.shaded.io.netty.buffer.AbstractByteBufAllocator { *** toLeakAwareBuffer(...); }
-keepclassmembers class com.hivemq.client.internal.shaded.io.netty.buffer.AdvancedLeakAwareByteBuf { *** recordLeakNonRefCountingOperation(...); }
-keepclassmembers class com.hivemq.client.internal.shaded.io.netty.util.ReferenceCountUtil { *** touch(...); }

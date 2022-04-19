-include proguard-rules.pro

# Crashlytics
-keepattributes *Annotation*
-keepattributes SourceFile,LineNumberTable
-keep public class * extends java.lang.Exception

-keep class net.sqlcipher.** { *; }
-dontwarn net.sqlcipher.**
-keepclassmembers class com.android.installreferrer.api.** {
  *;
}
-keep class com.facebook.react.turbomodule.** { *; }
-keep class org.videolan.libvlc.** { *; }
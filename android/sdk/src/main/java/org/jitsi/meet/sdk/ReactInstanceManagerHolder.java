/*
 * Copyright @ 2017-present 8x8, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.jitsi.meet.sdk;

import android.app.Activity;

import androidx.annotation.Nullable;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.common.LifecycleState;
import com.facebook.react.devsupport.DevInternalSettings;
import com.facebook.hermes.reactexecutor.HermesExecutorFactory;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.ViewManager;
import com.facebook.soloader.SoLoader;
import com.oney.WebRTCModule.RTCVideoViewManager;
import com.oney.WebRTCModule.WebRTCModule;

import org.webrtc.SoftwareVideoDecoderFactory;
import org.webrtc.SoftwareVideoEncoderFactory;
import org.webrtc.audio.AudioDeviceModule;
import org.webrtc.audio.JavaAudioDeviceModule;

import java.lang.reflect.Constructor;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

class ReactInstanceManagerHolder {
    /**
     * FIXME (from linter): Do not place Android context classes in static
     * fields (static reference to ReactInstanceManager which has field
     * mApplicationContext pointing to Context); this is a memory leak (and
     * also breaks Instant Run).
     *
     * React Native bridge. The instance manager allows embedding applications
     * to create multiple root views off the same JavaScript bundle.
     */
    private static ReactInstanceManager reactInstanceManager;

    private static List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> nativeModules
            = new ArrayList<>(Arrays.<NativeModule>asList(
                new AndroidSettingsModule(reactContext),
                new AppInfoModule(reactContext),
                new AudioModeModule(reactContext),
                //new DropboxModule(reactContext),
                new ExternalAPIModule(reactContext),
                new JavaScriptSandboxModule(reactContext),
                new LocaleDetector(reactContext),
                new LogBridgeModule(reactContext),
                new PictureInPictureModule(reactContext),
                new ProximityModule(reactContext),
                new WiFiStatsModule(reactContext),
                new org.jitsi.meet.sdk.net.NAT64AddrInfoModule(reactContext)));

        if (AudioModeModule.useConnectionService()) {
            nativeModules.add(new RNConnectionService(reactContext));
        }

        // Initialize the WebRTC module by hand, since we want to override some
        // initialization options.
        WebRTCModule.Options options = new WebRTCModule.Options();

        AudioDeviceModule adm = JavaAudioDeviceModule.builder(reactContext)
            .createAudioDeviceModule();
        options.setAudioDeviceModule(adm);

        options.setVideoDecoderFactory(new SoftwareVideoDecoderFactory());
        options.setVideoEncoderFactory(new SoftwareVideoEncoderFactory());

        nativeModules.add(new WebRTCModule(reactContext, options));

        return nativeModules;
    }

    private static List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Arrays.<ViewManager>asList(
            // WebRTC, see createNativeModules for details.
            new RTCVideoViewManager()
        );
    }

    /**
     * Helper function to send an event to JavaScript.
     *
     * @param eventName {@code String} containing the event name.
     * @param data {@code Object} optional ancillary data for the event.
     */
    static void emitEvent(
            String eventName,
            @Nullable Object data) {
        ReactInstanceManager reactInstanceManager
            = ReactInstanceManagerHolder.getReactInstanceManager();

        if (reactInstanceManager != null) {
            ReactContext reactContext
                = reactInstanceManager.getCurrentReactContext();

            if (reactContext != null) {
                reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(eventName, data);
            }
        }
    }

    /**
     * Finds a native React module for given class.
     *
     * @param nativeModuleClass the native module's class for which an instance
     * is to be retrieved from the {@link #reactInstanceManager}.
     * @param <T> the module's type.
     * @return {@link NativeModule} instance for given interface type or
     * {@code null} if no instance for this interface is available, or if
     * {@link #reactInstanceManager} has not been initialized yet.
     */
    static <T extends NativeModule> T getNativeModule(
            Class<T> nativeModuleClass) {
        ReactContext reactContext
            = reactInstanceManager != null
                ? reactInstanceManager.getCurrentReactContext() : null;

        return reactContext != null
                ? reactContext.getNativeModule(nativeModuleClass) : null;
    }

    /**
     * Gets the current {@link Activity} linked to React Native.
     *
     * @return An activity attached to React Native.
     */
    static Activity getCurrentActivity() {
        ReactContext reactContext
            = reactInstanceManager != null
            ? reactInstanceManager.getCurrentReactContext() : null;
        return reactContext != null ? reactContext.getCurrentActivity() : null;
    }

    static ReactInstanceManager getReactInstanceManager() {
        return reactInstanceManager;
    }

    /**
     * Internal method to initialize the React Native instance manager. We
     * create a single instance in order to load the JavaScript bundle a single
     * time. All {@code ReactRootView} instances will be tied to the one and
     * only {@code ReactInstanceManager}.
     *
     * @param activity {@code Activity} current running Activity.
     */
    static void initReactInstanceManager(Activity activity) {
        if (reactInstanceManager != null) {
            return;
        }
    
        SoLoader.init(activity, /* native exopackage */ false);
        List<ReactPackage> packages = (new ArrayList<>(Arrays.asList(
                new com.brentvatne.react.ReactVideoPackage(),
                // @nghinv/react-native-vlc
                //new com.yuanzhou.vlc.ReactVlcPlayerPackage(),
                // @react-native-async-storage/async-storage
                new com.reactnativecommunity.asyncstorage.AsyncStoragePackage(),
                // @react-native-clipboard/clipboard
                new com.reactnativecommunity.clipboard.ClipboardPackage(),
                // @react-native-community/checkbox
                new com.reactnativecommunity.checkbox.ReactCheckBoxPackage(),
                // @react-native-community/datetimepicker
                new com.reactcommunity.rndatetimepicker.RNDateTimePickerPackage(),
                // @react-native-community/masked-view
                new org.reactnative.maskedview.RNCMaskedViewPackage(),
                // @react-native-community/netinfo
                new com.reactnativecommunity.netinfo.NetInfoPackage(),
                // @react-native-community/picker
                new com.reactnativecommunity.picker.RNCPickerPackage(),
                // @react-native-firebase/analytics
                new io.invertase.firebase.analytics.ReactNativeFirebaseAnalyticsPackage(),
                // @react-native-firebase/app
                new io.invertase.firebase.app.ReactNativeFirebaseAppPackage(),
                // @react-native-firebase/messaging
                new io.invertase.firebase.messaging.ReactNativeFirebaseMessagingPackage(),
                // react-native-appearance
                new io.expo.appearance.RNCAppearancePackage(),
                // react-native-background-timer
                new com.ocetnik.timer.BackgroundTimerPackage(),
                // react-native-biometrics
                new com.rnbiometrics.ReactNativeBiometricsPackage(),
                // react-native-calendar-events
                new com.calendarevents.CalendarEventsPackage(),
                // react-native-callkeep
                new io.wazo.callkeep.RNCallKeepPackage(),
                // react-native-chat-plugin
                new com.ourengineroom.rnchatplugin.ChatPluginPackage(),
                // react-native-contacts
                new com.rt2zz.reactnativecontacts.ReactNativeContacts(),
                // react-native-cookies
                new com.psykar.cookiemanager.CookieManagerPackage(),
                // react-native-create-thumbnail
                new com.reactlibrary.createthumbnail.CreateThumbnailPackage(),
                // react-native-default-preference
                new com.kevinresol.react_native_default_preference.RNDefaultPreferencePackage(),
                // react-native-device-info
                new com.learnium.RNDeviceInfo.RNDeviceInfo(),
                // react-native-fast-image
                new com.dylanvann.fastimage.FastImageViewPackage(),
                // react-native-fs
                new com.rnfs.RNFSPackage(),
                // react-native-fast-image
                //new com.dylanvann.fastimage.FastImageViewPackage(),
                // react-native-gesture-handler
                new com.swmansion.gesturehandler.react.RNGestureHandlerPackage(),
                // react-native-get-random-values
                new org.linusu.RNGetRandomValuesPackage(),
                // react-native-haptic-feedback
                new com.mkuczera.RNReactNativeHapticFeedbackPackage(),
                // react-native-image-crop-picker
                new com.reactnative.ivpusic.imagepicker.PickerPackage(),
                // react-native-immersive
                new com.rnimmersive.RNImmersivePackage(),
                // react-native-inappbrowser-reborn
                new com.proyecto26.inappbrowser.RNInAppBrowserPackage(),
                // react-native-keep-awake
                new com.corbt.keepawake.KCKeepAwakePackage(),
                // react-native-libsodium
                new com.ourengineroom.rnlibsodium.RnLibSodiumPackage(),
                // react-native-linear-gradient
                new com.BV.LinearGradient.LinearGradientPackage(),
                // react-native-localize
                new com.zoontek.rnlocalize.RNLocalizePackage(),
                // react-native-navigation-bar-color
                new com.thebylito.navigationbarcolor.NavigationBarColorPackage(),
                // react-native-open-settings
                new com.opensettings.OpenSettingsPackage(),
                // react-native-orientation-locker
                new org.wonday.orientation.OrientationPackage(),
                // react-native-permissions
                new com.zoontek.rnpermissions.RNPermissionsPackage(),
                // react-native-push-notification
                new com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage(),
                // react-native-reanimated
                //new com.swmansion.reanimated.ReanimatedPackage(),
                // react-native-safe-area-context
                new com.th3rdwave.safeareacontext.SafeAreaContextPackage(),
                // react-native-screens
                new com.swmansion.rnscreens.RNScreensPackage(),
                // react-native-share
                new cl.json.RNSharePackage(),
                // react-native-sms
                new com.tkporter.sendsms.SendSMSPackage(),
                // react-native-sound
                new com.zmxv.RNSound.RNSoundPackage(),
                // react-native-sqlite-storage
                new org.pgsqlite.SQLitePluginPackage(),
                // react-native-svg
                new com.horcrux.svg.SvgPackage(),
                // react-native-vector-icons
                new com.oblador.vectoricons.VectorIconsPackage(),
                // react-native-version-number
                new com.apsl.versionnumber.RNVersionNumberPackage(),
                // react-native-view-shot
                new fr.greweb.reactnativeviewshot.RNViewShotPackage(),
                // react-native-image-picker
                new com.imagepicker.ImagePickerPackage(),
                // react-native-image-resizer
                new fr.bamlab.rnimageresizer.ImageResizerPackage(),
                // react-native-webrtc
                //new com.oney.WebRTCModule.WebRTCModulePackage(),
                // react-native-webview
                new com.reactnativecommunity.webview.RNCWebViewPackage(),
                // rn-android-overlay-permission
                new com.overlaypermission.OverlayPermissionPackage(),
                new com.incomingcall.IncomingCallPackage(),
                new com.facebook.react.shell.MainReactPackage(),
                new ReactPackageAdapter() {
                    @Override
                    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
                        return ReactInstanceManagerHolder.createNativeModules(reactContext);
                    }
                    @Override
                    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
                        return ReactInstanceManagerHolder.createViewManagers(reactContext);
                    }
                }))
        );

        try {
            Class<?> googlePackageClass = Class.forName("co.apptailor.googlesignin.RNGoogleSigninPackage");
            Constructor constructor = googlePackageClass.getConstructor();
            packages.add((ReactPackage)constructor.newInstance());
        } catch (Exception e) {
            // Ignore any error, the module is not compiled when LIBRE_BUILD is enabled.
        }

        // Keep on using JSC, the jury is out on Hermes.
        //JSCExecutorFactory jsFactory = new JSCExecutorFactory("", "");

        // Use the Hermes JavaScript engine.
        HermesExecutorFactory jsFactory = new HermesExecutorFactory();

        reactInstanceManager
            = ReactInstanceManager.builder()
                .setApplication(activity.getApplication())
                .setCurrentActivity(activity)
                .setBundleAssetName("index.android.bundle")
                .setJSMainModulePath("index")
                .setJavaScriptExecutorFactory(jsFactory)
                .addPackages(packages)
                .setUseDeveloperSupport(BuildConfig.DEBUG)
                .setInitialLifecycleState(LifecycleState.RESUMED)
                .build();

        // Register our uncaught exception handler.
        JitsiMeetUncaughtExceptionHandler.register();
    }
}

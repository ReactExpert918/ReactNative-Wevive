/*
 * Copyright @ 2018-present 8x8, Inc.
 * Copyright @ 2017-2018 Atlassian Pty Ltd
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

#import "AppDelegate.h"
#import "FIRUtilities.h"
#import "Types.h"
#import "ViewController.h"
#import <PushKit/PushKit.h>
#import "RNVoipPushNotificationManager.h"
#import "RNCallKeep.h"

#import <Firebase.h>

#import <CoreTelephony/CTCallCenter.h>
#import <CoreTelephony/CTCall.h>

@import JitsiMeetSDK;

@implementation AppDelegate

-             (BOOL)application:(UIApplication *)application
  didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    [FIRApp configure];
    [RNVoipPushNotificationManager voipRegistration];
    JitsiMeet *jitsiMeet = [JitsiMeet sharedInstance];
    [[FIRCrashlytics crashlytics] setCrashlyticsCollectionEnabled: TRUE];

    jitsiMeet.conferenceActivityType = JitsiMeetConferenceActivityType;
    jitsiMeet.customUrlScheme = @"org.jitsi.meet";
    jitsiMeet.universalLinkDomains = @[@"webrtc.wevive.com"];

    jitsiMeet.defaultConferenceOptions = [JitsiMeetConferenceOptions fromBuilder:^(JitsiMeetConferenceOptionsBuilder *builder) {
        [builder setFeatureFlag:@"resolution" withValue:@(720)];
        builder.serverURL = [NSURL URLWithString:@"https://webrtc.wevive.com"];
        builder.welcomePageEnabled = YES;
    }];

    [jitsiMeet application:application didFinishLaunchingWithOptions:launchOptions];
    CXCallObserver *callObserver = [[CXCallObserver alloc] init];
    [callObserver setDelegate:self queue:nil];
    //[jitsiMeet showSplashScreen:rootController.view];
    self.callObserver = callObserver;

    return YES;
}

- (void) applicationWillTerminate:(UIApplication *)application {
    NSLog(@"Application will terminate!");
    // Try to leave the current meeting graceefully.
    ViewController *rootController = (ViewController *)self.window.rootViewController;
    [rootController terminate];
}

#pragma mark Linking delegate methods

-    (BOOL)application:(UIApplication *)application
  continueUserActivity:(NSUserActivity *)userActivity
    restorationHandler:(void (^)(NSArray<id<UIUserActivityRestoring>> *restorableObjects))restorationHandler {

    if ([FIRUtilities appContainsRealServiceInfoPlist]) {
        // 1. Attempt to handle Universal Links through Firebase in order to support
        //    its Dynamic Links (which we utilize for the purposes of deferred deep
        //    linking).
        BOOL handled
          = [[FIRDynamicLinks dynamicLinks]
                handleUniversalLink:userActivity.webpageURL
                         completion:^(FIRDynamicLink * _Nullable dynamicLink, NSError * _Nullable error) {
           NSURL *firebaseUrl = [FIRUtilities extractURL:dynamicLink];
           if (firebaseUrl != nil) {
             userActivity.webpageURL = firebaseUrl;
             [[JitsiMeet sharedInstance] application:application
                                continueUserActivity:userActivity
                                  restorationHandler:restorationHandler];
           }
        }];

        if (handled) {
          return handled;
        }
    }

    // 2. Default to plain old, non-Firebase-assisted Universal Links.
    return [[JitsiMeet sharedInstance] application:application
                              continueUserActivity:userActivity
                                restorationHandler:restorationHandler];
}

- (BOOL)application:(UIApplication *)app
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {

    // This shows up during a reload in development, skip it.
    // https://github.com/firebase/firebase-ios-sdk/issues/233
    if ([[url absoluteString] containsString:@"google/link/?dismiss=1&is_weak_match=1"]) {
        return NO;
    }

    NSURL *openUrl = url;

    if ([FIRUtilities appContainsRealServiceInfoPlist]) {
        // Process Firebase Dynamic Links
        FIRDynamicLink *dynamicLink = [[FIRDynamicLinks dynamicLinks] dynamicLinkFromCustomSchemeURL:url];
        NSURL *firebaseUrl = [FIRUtilities extractURL:dynamicLink];
        if (firebaseUrl != nil) {
            openUrl = firebaseUrl;
        }
    }

    return [[JitsiMeet sharedInstance] application:app
                                           openURL:openUrl
                                           options:options];
}

/* Add PushKit delegate method */

// --- Handle updated push credentials
- (void)pushRegistry:(PKPushRegistry *)registry didUpdatePushCredentials:(PKPushCredentials *)credentials forType:(PKPushType)type {
  // Register VoIP push token (a property of PKPushCredentials) with server
  [RNVoipPushNotificationManager didUpdatePushCredentials:credentials forType:(NSString *)type];
}

- (void)pushRegistry:(PKPushRegistry *)registry didInvalidatePushTokenForType:(PKPushType)type
{
  // --- The system calls this method when a previously provided push token is no longer valid for use. No action is necessary on your part to reregister the push type. Instead, use this method to notify your server not to send push notifications using the matching push token.
}
- (void)callObserver:(CXCallObserver *)callObserver callChanged:(CXCall *)call {
    if (call.hasConnected) {
      self.hasConnected = TRUE;
    } else if (call.hasEnded) {
      self.hasConnected = FALSE;
    }
}

-(void)onTick:(NSTimer *)timer {
   if (self.hasConnected) {
     //phone call is accepted
   } else {
     [RNCallKeep endCallWithUUID: self.last_uuid reason:6];
   }
}

// --- Handle incoming pushes
- (void)pushRegistry:(PKPushRegistry *)registry didReceiveIncomingPushWithPayload:(PKPushPayload *)payload forType:(PKPushType)type withCompletionHandler:(void (^)(void))completion {
  NSString *uuid = payload.dictionaryPayload[@"uuid"];
  //NSString *message = payload.dictionaryPayload[@"message"];
  NSString *call_type = payload.dictionaryPayload[@"type"];
  BOOL video = [payload.dictionaryPayload[@"video"] isEqual: @"true"];
  NSString *handle = payload.dictionaryPayload[@"handle"];
  if ([call_type  isEqual: @"hangup"] || self.hasConnected) {
    [RNCallKeep reportNewIncomingCall: uuid
                            handle: handle
                        handleType: @"number"
                          hasVideo: video
                localizedCallerName: nil
                    supportsHolding: false
                      supportsDTMF: false
                  supportsGrouping: false
                supportsUngrouping: false
                        fromPushKit: YES
                            payload: nil
              withCompletionHandler: nil];
    [RNCallKeep endCallWithUUID: uuid reason:6];
    completion();
  } else {
    self.last_uuid = uuid;
    self.hasConnected = FALSE;
    // --- this is optional, only required if you want to call `completion()` on the js side
    //[RNVoipPushNotificationManager addCompletionHandler:uuid completionHandler:completion];
    AVAudioSession* audioSession = [AVAudioSession sharedInstance];
    [audioSession setCategory:AVAudioSessionCategoryPlayAndRecord withOptions:AVAudioSessionCategoryOptionAllowBluetooth|AVAudioSessionCategoryOptionMixWithOthers|AVAudioSessionCategoryOptionAllowBluetoothA2DP | AVAudioSessionCategoryOptionAllowAirPlay error:nil];

    [audioSession setMode:AVAudioSessionModeVoiceChat error:nil];

    double sampleRate = 44100.0;
    [audioSession setPreferredSampleRate:sampleRate error:nil];
    [audioSession overrideOutputAudioPort:AVAudioSessionPortOverrideSpeaker error:nil];
    NSTimeInterval bufferDuration = .005;
    [audioSession setPreferredIOBufferDuration:bufferDuration error:nil];
    [audioSession setActive:TRUE error:nil];

    // --- Process the received push
    [RNVoipPushNotificationManager didReceiveIncomingPushWithPayload:payload forType:(NSString *)type];
    [RNCallKeep reportNewIncomingCall: uuid
                            handle: handle
                        handleType: @"number"
                          hasVideo: video
                localizedCallerName: nil
                    supportsHolding: false
                      supportsDTMF: false
                  supportsGrouping: false
                supportsUngrouping: false
                        fromPushKit: YES
                            payload: nil
              withCompletionHandler: nil];
    //  --- You should make sure to report to callkit BEFORE execute `completion()`
    // --- You don't need to call it if you stored `completion()` and will call it on the js side.
    completion();
    [self performSelector:@selector(onTick:) withObject:nil afterDelay:30.0];
  }
}

@end

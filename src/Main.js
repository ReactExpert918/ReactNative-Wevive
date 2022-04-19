import React, {Component} from 'react';
import {
  StatusBar,
  Platform,
  Text,
  Alert,
  AppState,
  DeviceEventEmitter,
} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {AppThemeContext, UserContext} from './context/UserContext';
import Header from './Header';
import FooterTabs from './FooterTabs';

import AppNavigator from './navigation/AppNavigator';

import changeNavigationBarColor from 'react-native-navigation-bar-color';

import ChatModule from 'react-native-chat-plugin';
import RNCallKeep from 'react-native-callkeep';
import registerPushNotifications from './utils/registerPushNotifications';

import IncomingCall from 'react-native-incoming-call';
import OverlayPermissionModule from 'rn-android-overlay-permission';
import CacheStore from 'react-native-cache-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sound from 'react-native-sound';
import APIService from './service/APIService';

import VideoCalls from './screens/VideoCalls/VideoCalls';
import ContactsModal from './ContactsModal';
import {check, request, PERMISSIONS} from 'react-native-permissions';
import {chat_url} from "../app.json"
const playBusySound = () => {
  var whoosh = new Sound('busy.mp3', Sound.MAIN_BUNDLE, (error) => {
    if(Platform.OS == 'ios'){
      //Sound.setCategory('Playback', false);
      //Sound.setCategory('Ambient', false);
    }
    if (error) {
      console.log('failed to load the sound', error);
      return;
    }
    //whoosh.setNumberOfLoops(0);
    if (!global.incomingCallID) {
      whoosh.play((success) => {
        whoosh.release();
      });
    }
  });
};
export default function Main({navigation, route}) {
  global.mainNavigation = navigation;
  const themeSettings = React.useContext(AppThemeContext);
  const {authData, updateMe, setThemeSettings} = React.useContext(UserContext);

  const appState = React.useRef(AppState.currentState);
  const [callUUID, setCallUUID] = React.useState(false);
  const [isVideo, setIsVideo] = React.useState(false);
  React.useEffect(() => {
    if (Platform.OS === 'android') {
      OverlayPermissionModule.requestOverlayPermission();
    }
    request(
      Platform.OS == 'ios'
        ? PERMISSIONS.IOS.MICROPHONE
        : PERMISSIONS.ANDROID.MICROPHONE,
    ).then((result) => {
    });
  }, []);
  const _handleAppStateChange = (nextAppState) => {
    CacheStore.get('callUUID').then(async (uuid) => {
      if (uuid) {
        global.incomingCallID = uuid;
        // console.log('IncomingCall incomingUUID redirecting from main _handleAppStateChange to call');
        CacheStore.remove('callUUID');
        const video = (await AsyncStorage.getItem('incomingHasVideo')) == '1';
        global.navigateTo('VideoCalls', {
          callId: uuid,
          conversationId: uuid,
          video,
        });
      }
    });
  };
  React.useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);
  React.useEffect(() => {
    //Alert.alert('getting incoming call');
    if (Platform.OS === 'android') {
      /**
       * App in foreground / background: listen to call events and determine what to do next
       */
      const endCallListener = DeviceEventEmitter.addListener(
        'endCall',
        async (payload) => {
          const uuid = await AsyncStorage.getItem('incomingUUID');
          const caller = await AsyncStorage.getItem('incomingCaller');
          // End call action here
          APIService('users/pushmessage/', {
            users: [caller],
            extra: {
              type: 'hangup',
              callUUID: uuid,
              caller: authData ? authData.id : 0,
            },
          });
        },
      );
      const answerCallListener = DeviceEventEmitter.addListener(
        'answerCall',
        (payload) => {
          console.log('IncomingCall answerCallListener', payload);
          if (payload && payload.uuid) {
            CacheStore.set('incomingUUID', payload.uuid, 1);
            CacheStore.set('callUUID', payload.uuid, 1);
            IncomingCall.backToForeground(payload.uuid);
            global.incomingCallID = payload.uuid;
            setTimeout(async () => {
              const video =
                (await AsyncStorage.getItem('incomingHasVideo')) == '1';
              global.navigateTo('VideoCalls', {
                callId: payload.uuid,
                conversationId: uuid,
                video: video,
              });
            }, 100);
          }
        },
      );
      return () => {
        endCallListener.remove();
        answerCallListener.remove();
      };
    }
  }, [navigation, authData]);
  RNCallKeep.addEventListener('answerCall', async ({callUUID}) => {
    const video = (await AsyncStorage.getItem('incomingHasVideo')) == '1';
    global.incomingCallID = callUUID;
    global.navigateTo('VideoCalls', {
      callId: callUUID,
      conversationId: uuid,
      video,
    });
  });
  React.useEffect(() => {
    registerPushNotifications(
      async (a) => {
        const activeCall = await AsyncStorage.getItem('activeCallUUID');
        const activeCallOtherCount = Number(
          (await CacheStore.get('activeCallOthersCount')) || '0',
        );
        if (a.data.type && a.data.type === 'call') {
          if (activeCall && activeCall !== a.data.callUUID) {
            console.log('[FCMService] Sending busy signal');
            APIService('users/pushmessage/', {
              users: [a.data.caller],
              extra: {
                type: 'hangup',
                caller: authData.id,
                callUUID: a.data.callUUID,
              },
            });
          }
        }
        if (a.data.type && a.data.type === 'hangup') {
          //Hangup active call;
          if (activeCall && activeCall === a.data.callUUID) {
            if (activeCallOtherCount == 0) {
              //If there are no users in the call and hangup for the call is received, stop the call and play busy sound
              playBusySound();
              global.hangup && global.hangup();
              if (Platform.OS === 'ios') {
                RNCallKeep.reportEndCallWithUUID(activeCall, 6);
                RNCallKeep.endCall(activeCall);
              }
            }
          } else if (Platform.OS == 'ios') {
            const uuid = await AsyncStorage.getItem('incomingUUID');
            if (uuid && uuid == a.data.callUUID) {
              RNCallKeep.reportEndCallWithUUID(uuid, 6);
              RNCallKeep.endCall(uuid);
              AsyncStorage.removeItem('incomingUUID');
            }
          }
        }
        if (
          a.data.type &&
          a.data.type == 'call_received' &&
          (route.name == 'VideoCalls' || route.name == 'Main')
        ) {
          console.log('[FCMService] Call is in progress..', a);
        }
      }, //onNotification
      (b) => {
        console.log('[FCMService] onOpenNotification', b);
        if (b && b.data && b.data.conversationId) {
          navigation.navigate('ChatScreen', {
            conversation: b.data.conversationId,
          });
        }
      }, //onOpenNotification
    );
    if (Platform.OS === 'android') {
      changeNavigationBarColor('#ffffff', true, false);
    }
  }, []);
  React.useEffect(() => {
    if (!authData || !authData.userToken) {
      updateMe();
    }
  }, [authData]);
  global.navigateTo = (route, params) => {
    setTimeout(() => {
      if (route == 'VideoCalls') {
        if (params.callId) {
          setCallUUID(params.callId);
          setIsVideo(!!params.video);
          setThemeSettings({
            ...themeSettings,
            hiddenHeader: true,
            hiddenFooter: true,
          });
        } else {
          setCallUUID(false);
          setIsVideo(false);
          global.lastAppliedTheme && setThemeSettings(global.lastAppliedTheme);
        }
      }
    }, 200);
  };
  return (
    <ChatModule options={authData} socketIoUrl={chat_url}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      {!themeSettings.hiddenHeader && (
        <Header themeSettings={themeSettings} route={route} />
      )}
      <AppNavigator />
      {!themeSettings.hiddenFooter && <FooterTabs />}
      <ContactsModal />
      {callUUID !== false && (
        <VideoCalls params={{callId: callUUID, conversationId: callUUID, video: isVideo}} />
      )}
    </ChatModule>
  );
}

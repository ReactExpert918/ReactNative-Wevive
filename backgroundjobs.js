import messaging from '@react-native-firebase/messaging';
import IncomingCall from 'react-native-incoming-call';
import {DeviceEventEmitter, Platform} from 'react-native';
import CacheStore from 'react-native-cache-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import APIService from './src/service/APIService';
import RNCallKeep from 'react-native-callkeep';
import {SQLCipherClient} from 'react-native-chat-plugin/utils/SQLCipherClient';
export const backgroundJobs = () =>
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    if (Platform.OS === 'android') {
      const data = remoteMessage?.data;
      if (data && data.callUUID && data.type === 'call') {
        const activeCall = await AsyncStorage.getItem('activeCallUUID');
        if (activeCall && data.callUUID == activeCall) return;
        if (data.video) {
          CacheStore.set(data.callUUID, '1', 0.5);
        }
        AsyncStorage.setItem('incomingCaller', data.caller);
        AsyncStorage.setItem('incomingHasVideo', data.video ? '1' : '0');
        AsyncStorage.setItem('incomingUUID', data.callUUID);
        //TODO: Store participants
        //CacheStore.set('callParticipants', payload.participants, 0.5);
        isVideo = data.video === true || data.video === 'true';
        message = isVideo ? 'Wevive Video Call' : 'Wevive Voice Call';
        IncomingCall.display(
          data.callUUID, // Call UUID v4
          data.username, // Username
          data.avatarURL,
          message, // Info text
          60000, // Timeout for end call after 60s
          isVideo,
        );
        APIService('users/pushmessage/', {
          users: [data.caller],
          extra: {
            type: 'call_received',
            callUUID: data.callUUID,
          },
        });
        SQLCipherClient().then(({database}) => {
          database.executeSql(
            'INSERT INTO calls(`group_id`,`call_uuid`,`name`,`created_by`, created_at) VALUES (?, ?, ?, ?, ?)',
            [
              data.callUUID,
              data.callUUID,
              data.username,
              data.caller,
              Math.floor(Date.now() / 1000),
            ],
          );
        });
      } else if (data && data.type === 'hangup') {
        const uuid = await AsyncStorage.getItem('incomingUUID');
        if (uuid === data.callUUID) {
          IncomingCall.dismiss();
          AsyncStorage.removeItem('incomingUUID');
        }
      }

      // Listen to headless action events
      DeviceEventEmitter.addListener('endCall', async (payload) => {
        const uuid = await AsyncStorage.getItem('incomingUUID');
        const caller = await AsyncStorage.getItem('incomingCaller');
        APIService('users/pushmessage/', {
          users: [caller],
          extra: {
            type: 'hangup',
            callUUID: uuid,
          },
        });
      });
      DeviceEventEmitter.addListener('answerCall', (payload) => {
        CacheStore.set('callUUID', payload.uuid, 1);
        if (payload.isHeadless) {
          // Called from killed state
          IncomingCall.openAppFromHeadlessMode(payload.uuid);
          IncomingCall.backToForeground(payload.uuid);
        } else {
          // Called from background state
          IncomingCall.backToForeground(payload.uuid);
        }
      });
    } else {
      const data = remoteMessage?.data;
      if (data && data.type === 'hangup') {
        const uuid = await AsyncStorage.getItem('incomingUUID');
        if (uuid && uuid === data.callUUID) {
          RNCallKeep.reportEndCallWithUUID(uuid, 6);
          RNCallKeep.endCall(uuid);
          AsyncStorage.removeItem('incomingUUID');
        }
      }
    }
  });

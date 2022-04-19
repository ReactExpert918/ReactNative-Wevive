import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';
import CacheStore from 'react-native-cache-store';
import {SQLCipherClient} from 'react-native-chat-plugin/utils/SQLCipherClient';
import IncomingCall from 'react-native-incoming-call';
import {requestNotifications} from 'react-native-permissions';
//import PushNotification from 'react-native-push-notification';
class FCM_Service {
  register = (onRegister, onNotification, onOpenNotification) => {
    this.registerAppWithFCM(onRegister);
    this.checkPermission(onRegister);
    this.createNotificationListeners(
      onRegister,
      onNotification,
      onOpenNotification,
    );
  };

  registerAppWithFCM = async (onRegister) => {
    if (Platform.OS === 'ios') {
      //await messaging().registerDeviceForRemoteMessages();
      await messaging().setAutoInitEnabled(true);
    }
  };

  checkPermission = (onRegister) => {
    messaging()
      .hasPermission()
      .then((enabled) => {
        if (enabled) {
          requestNotifications([
            'alert',
            'badge',
            'sound',
          ]).then(({status, settings}) => {});
          this.getToken(onRegister);
        } else {
          // User doesn’t have permission
          this.requestPermission(onRegister);
        }
      })
      .catch((error) => {
        console.log('[FCMService] Permission rejected ', error);
      });
  };

  getToken = (onRegister) => {
    messaging()
      .getToken()
      .then(async (fcmToken) => {
        if (fcmToken) {
          console.log('[FCMService] getToken', fcmToken);
          onRegister(fcmToken);
        } else {
          console.log('[FCMService] User does not have a device token');
        }
      })
      .catch((error) => {
        console.log('[FCMService] getToken rejected ', error);
      });
  };

  requestPermission = (onRegister) => {
    messaging()
      .requestPermission()
      .then(() => {
        requestNotifications(['alert', 'badge', 'sound']).then(
          ({status, settings}) => {
            this.getToken(onRegister);
          },
        );
      })
      .catch((error) => {
        console.log('[FCMService] Request Permission rejected ', error);
      });
  };

  deleteToken = () => {
    console.log('[FCMService] deleteToken ');
    messaging()
      .deleteToken()
      .catch((error) => {
        console.log('[FCMService] Delete token error ', error);
      });
  };

  createNotificationListeners = (
    onRegister,
    onNotification,
    onOpenNotification,
  ) => {
    console.log('[FCMService] createNotificationListeners');
    // When the application is running, but in the background
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        '[FCMService] onNotificationOpenedApp Notification caused app to open from background state:',
        remoteMessage,
      );
      if (remoteMessage) {
        onOpenNotification(remoteMessage);
      }
    });

    // When the application is opened from a quit state.
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        console.log(
          '[FCMService] getInitialNotification Notification caused app to open from quit state:',
          remoteMessage,
        );
        if (remoteMessage) {
          onOpenNotification(remoteMessage);
          //PushNotification.setApplicationIconBadgeNumber(0);
        }
      });
    // Foreground state messages
    this.messageListener = messaging().onMessage(async (remoteMessage) => {
      console.log('[FCMService] A new FCM message arrived!', remoteMessage);
      if (remoteMessage) {
        if (remoteMessage.data.callUUID && remoteMessage.data.type === 'call') {
          if (remoteMessage.data.video) {
            CacheStore.set(remoteMessage.data.callUUID, 1, 0.5);
          }

          const isVideo =
            remoteMessage.data.video === true ||
            remoteMessage.data.video === 'true';
          const message = isVideo ? 'Wevive Video Call' : 'Wevive Voice Call';
          const activeCall = await AsyncStorage.getItem('activeCallUUID');
          if (!activeCall || activeCall !== remoteMessage.data.callUUID) {
            if (Platform.OS === 'android') {
              console.log('Calling IncomingCall');
              IncomingCall.display(
                remoteMessage.data.callUUID, // Call UUID v4
                remoteMessage.data.username, // Username
                remoteMessage.data.avatarURL,
                message, // Info text
                30000, // Timeout for end call after 30s
                isVideo,
              );
              SQLCipherClient().then(({database}) => {
                database.executeSql(
                  'INSERT INTO calls(`group_id`,`call_uuid`,`name`,`created_by`, created_at) VALUES (?, ?, ?, ?, ?)',
                  [
                    remoteMessage.data.callUUID,
                    remoteMessage.data.callUUID,
                    remoteMessage.data.username,
                    remoteMessage.data.caller,
                    Math.floor(Date.now() / 1000),
                  ],
                );
              });
            }
          }
        } else if (
          remoteMessage.data.callUUID &&
          remoteMessage.data.type === 'hangup'
        ) {
          if (Platform.OS === 'android') {
            IncomingCall.dismiss();
          }
        }
        onNotification(remoteMessage);
      } else {
        console.log('[FCMService] message is false');
      }
    });
    // Triggered when have new token
    messaging().onTokenRefresh(async (fcmToken) => {
      onRegister(fcmToken);
    });
  };
  unRegister = () => {
    this.messageListener();
  };
}

export const PushNotificationsService = new FCM_Service();

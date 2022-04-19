import {Platform} from 'react-native';
import {getUniqueId} from 'react-native-device-info';
import VoipPushNotification from 'react-native-voip-push-notification';

import {domainReversed} from '../../app.json';
import {PushNotificationsService} from '../service/PushNotificationsService';
import APIService from '../service/APIService';
const onRegister = (token) => {
  const name = getUniqueId();
  APIService('push-notifications/fcm/', {
    registration_id: token,
    name,
    application_id: domainReversed,
    //'device_id':getUniqueId().replace(/[-_]/g,''),
    cloud_message_type: 'FCM',
  });
};
export default function registerPushNotifications(
  onNotification,
  onOpenNotification,
) {

  PushNotificationsService.register(
    onRegister,
    onNotification,
    onOpenNotification,
  );
  if (Platform.OS !== 'android') {
    VoipPushNotification.addEventListener('register', (voipToken) => {
      const name = getUniqueId();
      APIService('push-notifications/apns/', {
        registration_id: voipToken,
        name,
        application_id: domainReversed + '.voip',
        cloud_message_type: 'APNS',
      });
    });
    VoipPushNotification.registerVoipToken();
  }
}

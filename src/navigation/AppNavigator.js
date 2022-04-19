import React from 'react';
import {createStackNavigator, TransitionSpecs} from '@react-navigation/stack';

import WebUI from '../screens/WebUI/WebUI';
import About from '../screens/About/About';
import Terms from '../screens/About/Terms';
import Licenses from '../screens/About/Licenses';
import ContactUs from '../screens/About/ContactUs';

import CallHistory from '../screens/CallHistory/CallHistory';
import Settings from '../screens/Settings/Settings';

import SocialStatusSettings from '../screens/Settings/SocialStatusSettings';
import AboutPrivacySettings from '../screens/Settings/AboutPrivacySettings';
import AccountSettings from '../screens/Settings/AccountSettings';
import BlockedPrivacySettings from '../screens/Settings/BlockedPrivacySettings';
import ChatPrivacySettings from '../screens/Settings/ChatPrivacySettings';
import ChangeNumber from '../screens/Settings/ChangeNumber';
import ChangeUsername from '../screens/Settings/ChangeUsername';
import ChangeNumberVerification from '../screens/Settings/ChangeNumberVerification';
import DeleteAccountConfirmation from '../screens/Settings/DeleteAccountConfirmation';
import ChangeNumberConfirmation from '../screens/Settings/ChangeNumberConfirmation';
import ChangeNumberSuccess from '../screens/Settings/ChangeNumberSuccess';
import DeleteAccountSuccess from '../screens/Settings/DeleteAccountSuccess';
import DeleteChatsSuccess from '../screens/Settings/DeleteChatsSuccess';
import DeleteChatsConfirmation from '../screens/Settings/DeleteChatsConfirmation';

import ChatsSettings from '../screens/Settings/ChatsSettings';
import DeleteAccount from '../screens/Settings/DeleteAccount';
import DeleteChats from '../screens/Settings/DeleteChats';
import GroupsPrivacySettings from '../screens/Settings/GroupsPrivacySettings';
import LastSeenPrivacySettings from '../screens/Settings/LastSeenPrivacySettings';
import NotificationSettings from '../screens/Settings/NotificationSettings';
import PhoneUsernameSettings from '../screens/Settings/PhoneUsernameSettings';
import PrivacySettings from '../screens/Settings/PrivacySettings';
import ProfilePhotoPrivacySettings from '../screens/Settings/ProfilePhotoPrivacySettings';
import SecuritySettings from '../screens/Settings/SecuritySettings';
import StorageSettings from '../screens/Settings/StorageSettings';
import TypingPrivacySettings from '../screens/Settings/TypingPrivacySettings';

import AudioDataSettings from '../screens/Settings/AudioDataSettings';
import DocumentsDataSettings from '../screens/Settings/DocumentsDataSettings';
import NetworkUsage from '../screens/Settings/NetworkUsage';
import PhotosDataSettings from '../screens/Settings/PhotosDataSettings';
import UsedStorageSettings from '../screens/Settings/UsedStorageSettings';
import VideoDataSettings from '../screens/Settings/VideoDataSettings';

import Help from '../screens/Help/Help';
import HelpCentre from '../screens/Help/HelpCentre';

import VideoCalls from '../screens/VideoCalls/VideoCalls';

import PhoneContactsScreen from '../../node_modules/react-native-chat-plugin/PhoneContactsScreen/PhoneContactsScreen';
import ContactsScreen from '../../node_modules/react-native-chat-plugin/ContactsScreen/ContactsScreen';
import ChatScreen from '../../node_modules/react-native-chat-plugin/ChatScreen/ChatScreen';
import SearchContactsScreen from '../../node_modules/react-native-chat-plugin/SearchContactsScreen/SearchContactsScreen';
import MessageSoundSettings from '../screens/Settings/MessageSoundSettings';
import GroupSoundSettings from '../screens/Settings/GroupSoundSettings';
const TransitionScreen = {
  gestureDirection: 'horizontal',
  transitionSpec: {
    open: TransitionSpecs.TransitionIOSSpec,
    close: TransitionSpecs.TransitionIOSSpec,
  },
  cardStyleInterpolator: ({current, next, layouts}) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
          {
            translateX: next
              ? next.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -layouts.screen.width],
                })
              : 0,
          },
        ],
      },
      overlayStyle: {
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.5],
        }),
      },
    };
  },
};

const defaultConfig = {
  headerShown: false,
  cardStyleInterpolator: forFade,
  headerTransparent: true,
  cardStyle: {backgroundColor: 'transparent'},
  ...TransitionScreen,
};

const Stack = createStackNavigator();
const forFade = ({current}) => ({
  cardStyle: {opacity: current.progress},
});
const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="ContactsScreen"
      mode="modal"
      screenOptions={{gestureEnabled: false}}>
      <Stack.Screen
        name="VideoCalls"
        component={VideoCalls}
        options={defaultConfig}
      />
      <Stack.Screen name="About" component={About} options={defaultConfig} />
      <Stack.Screen name="Terms" component={Terms} options={defaultConfig} />
      <Stack.Screen name="Licenses" component={Licenses} options={defaultConfig} />
      <Stack.Screen name="ContactUs" component={ContactUs} options={defaultConfig} />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={defaultConfig}
      />
      <Stack.Screen name="WebUI" component={WebUI} options={defaultConfig} />
      <Stack.Screen
        component={CallHistory}
        name={'CallHistory'}
        options={defaultConfig}
      />
      <Stack.Screen
        component={ContactsScreen}
        name={'ContactsScreen'}
        options={defaultConfig}
      />
      <Stack.Screen
        component={PhoneContactsScreen}
        name={'PhoneContactsScreen'}
        options={defaultConfig}
      />
      <Stack.Screen
        component={ChatScreen}
        name={'ChatScreen'}
        options={defaultConfig}
      />
      <Stack.Screen
        component={SearchContactsScreen}
        name={'SearchContactsScreen'}
        options={defaultConfig}
      />
      <Stack.Screen
        component={AboutPrivacySettings}
        name={'AboutPrivacySettings'}
        options={defaultConfig}
      />
      <Stack.Screen
        component={SocialStatusSettings}
        name={'SocialStatusSettings'}
        options={defaultConfig}
      />
      <Stack.Screen
        component={AccountSettings}
        name={'AccountSettings'}
        options={defaultConfig}
      />
      <Stack.Screen
        component={BlockedPrivacySettings}
        name={'BlockedPrivacySettings'}
        options={defaultConfig}
      />
      <Stack.Screen
        component={ChatPrivacySettings}
        name={'ChatPrivacySettings'}
        options={defaultConfig}
      />
      <Stack.Screen
        component={ChangeUsername}
        name={'ChangeUsername'}
        options={defaultConfig}
      />
      <Stack.Screen
        component={ChangeNumber}
        name={'ChangeNumber'}
        options={defaultConfig}
      />
      <Stack.Screen
        component={ChangeNumberVerification}
        name={'ChangeNumberVerification'}
        options={defaultConfig}
      />
      <Stack.Screen
        component={ChangeNumberConfirmation}
        name={'ChangeNumberConfirmation'}
        options={defaultConfig}
      />
      <Stack.Screen
        component={ChangeNumberSuccess}
        name={'ChangeNumberSuccess'}
        options={defaultConfig}
      />
      <Stack.Screen
        component={DeleteAccountConfirmation}
        name={'DeleteAccountConfirmation'}
        options={defaultConfig}
      />
      <Stack.Screen
        component={DeleteAccountSuccess}
        name={'DeleteAccountSuccess'}
        options={defaultConfig}
      />
      <Stack.Screen
        component={DeleteChatsConfirmation}
        name={'DeleteChatsConfirmation'}
        options={defaultConfig}
      />
      <Stack.Screen
        component={DeleteChatsSuccess}
        name={'DeleteChatsSuccess'}
        options={defaultConfig}
      />
      <Stack.Screen
        component={ChatsSettings}
        name={'ChatsSettings'}
        options={defaultConfig}
      />
      <Stack.Screen
        component={DeleteAccount}
        name={'DeleteAccount'}
        options={defaultConfig}
      />
      <Stack.Screen
        component={DeleteChats}
        name={'DeleteChats'}
        options={defaultConfig}
      />
      <Stack.Screen
        component={GroupsPrivacySettings}
        name={'GroupsPrivacySettings'}
        options={defaultConfig}
      />
      <Stack.Screen
        component={LastSeenPrivacySettings}
        name={'LastSeenPrivacySettings'}
        options={defaultConfig}
      />
      <Stack.Screen
        component={NotificationSettings}
        name={'NotificationSettings'}
        options={defaultConfig}
      />
      <Stack.Screen
        component={MessageSoundSettings}
        name={'MessageSoundSettings'}
        options={defaultConfig}
      />
      <Stack.Screen
        component={GroupSoundSettings}
        name={'GroupSoundSettings'}
        options={defaultConfig}
      />
      <Stack.Screen
        component={PhoneUsernameSettings}
        name={'PhoneUsernameSettings'}
        options={defaultConfig}
      />
      <Stack.Screen
        component={PrivacySettings}
        name={'PrivacySettings'}
        options={defaultConfig}
      />
      <Stack.Screen
        component={ProfilePhotoPrivacySettings}
        name={'ProfilePhotoPrivacySettings'}
        options={defaultConfig}
      />
      <Stack.Screen
        component={SecuritySettings}
        name={'SecuritySettings'}
        options={defaultConfig}
      />
      <Stack.Screen
        component={StorageSettings}
        name={'StorageSettings'}
        options={defaultConfig}
      />
      <Stack.Screen
        component={TypingPrivacySettings}
        name={'TypingPrivacySettings'}
        options={defaultConfig}
      />
      <Stack.Screen
        component={AudioDataSettings}
        name={'AudioDataSettings'}
        options={defaultConfig}
      />
      <Stack.Screen
        component={DocumentsDataSettings}
        name={'DocumentsDataSettings'}
        options={defaultConfig}
      />
      <Stack.Screen
        component={NetworkUsage}
        name={'NetworkUsage'}
        options={defaultConfig}
      />
      <Stack.Screen
        component={PhotosDataSettings}
        name={'PhotosDataSettings'}
        options={defaultConfig}
      />
      <Stack.Screen
        component={UsedStorageSettings}
        name={'UsedStorageSettings'}
        options={defaultConfig}
      />
      <Stack.Screen
        component={VideoDataSettings}
        name={'VideoDataSettings'}
        options={defaultConfig}
      />
      <Stack.Screen
        component={Help}
        name={'Help'}
        options={defaultConfig}
      />
      <Stack.Screen
        component={HelpCentre}
        name={'HelpCentre'}
        options={defaultConfig}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;

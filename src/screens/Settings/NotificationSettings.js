import React from 'react';
import {ScrollView} from 'react-native';
import {MenuItem, MenuDivider, MenuDescription} from '../../components/Menu';
import {ChatContext} from 'react-native-chat-plugin/ChatContext';

export default function NotificationSettings({navigation}) {
  const ctx = React.useContext(ChatContext);
  const MessageSound = ctx.getSetting('MessageSound') || 'Chord 1';
  const GroupSound = ctx.getSetting('GroupSound') || 'Chord 1';
  const MessageNotifications = ctx.getSetting('MessageNotifications') || false;
  const GroupNotifications = ctx.getSetting('GroupNotifications') || false;
  const InAppNotifications = ctx.getSetting('InAppNotifications') || false;
  const PreviewNotifications = ctx.getSetting('PreviewNotifications') || false;
  const resetAllSettings = () => {
    ctx.setSettings({
      MessageSound: 'Chord 1',
      GroupSound: 'Chord 1',
      MessageNotifications: false,
      GroupNotifications: false,
      InAppNotifications: false,
      PreviewNotifications: false,
    });
  };
  return (
    <ScrollView style={{backgroundColor: 'white'}}>
      <MenuDivider text="Message Notifications" />
      <MenuItem
        type={'toggle'}
        value={MessageNotifications}
        onChange={(value) => ctx.setSetting('MessageNotifications', value)}>
        Show Notifications
      </MenuItem>
      <MenuItem
        type="info"
        info={MessageSound}
        onPress={() => {
          navigation.navigate('MessageSoundSettings');
        }}>
        Sound
      </MenuItem>
      <MenuDivider text="Group Notifications" />
      <MenuItem
        type={'toggle'}
        value={GroupNotifications}
        onChange={(value) => ctx.setSetting('GroupNotifications', value)}>
        Show Notifications
      </MenuItem>
      <MenuItem
        type="info"
        info={GroupSound}
        onPress={() => {
          navigation.navigate('GroupSoundSettings');
        }}>
        Sound
      </MenuItem>
      <MenuDivider />
      <MenuItem
        type={'toggle'}
        value={InAppNotifications}
        onChange={(value) => ctx.setSetting('InAppNotifications', value)}>
        In-App Notifications
      </MenuItem>
      <MenuDivider />
      <MenuItem
        type={'toggle'}
        value={PreviewNotifications}
        onChange={(value) => ctx.setSetting('PreviewNotifications', value)}>
        Preview Notifications
      </MenuItem>
      <MenuDescription>
        Preview message text inside new message notifications.
      </MenuDescription>
      <MenuDivider />
      <MenuItem important onPress={resetAllSettings}>
        Reset Notification Settings
      </MenuItem>
      <MenuDescription>
        Reset all notifiaction settings, including custom notification settings
        for your chats.
      </MenuDescription>
    </ScrollView>
  );
}

import React from 'react';
import {ChatContext} from 'react-native-chat-plugin/ChatContext';

import {MenuItem, MenuDivider} from '../../components/Menu';

export default function GroupsPrivacySettings({navigation}) {
  const ctx = React.useContext(ChatContext);
  const selected = ctx.getSetting('GroupsPrivacy');
  const setSetting = (value) => {
    return () => {
      ctx.setSetting('GroupsPrivacy', value);
      navigation.navigate('PrivacySettings');
    };
  };
  return (
    <>
      <MenuDivider />
      <MenuItem
        type={'selection'}
        selected={selected == 'Everyone'}
        onPress={setSetting('Everyone')}>
        Everyone
      </MenuItem>
      <MenuItem
        type={'selection'}
        selected={selected == 'My contacts'}
        onPress={setSetting('My contacts')}>
        My contacts
      </MenuItem>
      <MenuItem
        type={'selection'}
        selected={selected == 'None'}
        onPress={setSetting('None')}>
        None
      </MenuItem>
    </>
  );
}

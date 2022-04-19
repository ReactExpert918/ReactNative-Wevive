import React from 'react';
import {ChatContext} from 'react-native-chat-plugin/ChatContext';

import {MenuItem, MenuDivider} from '../../components/Menu';

export default function BlockedPrivacySettings({navigation}) {
  const ctx = React.useContext(ChatContext);
  const selected = ctx.getSetting('BlockedPrivacy');
  const setSetting = (value) => {
    return () => {
      ctx.setSetting('BlockedPrivacy', value);
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

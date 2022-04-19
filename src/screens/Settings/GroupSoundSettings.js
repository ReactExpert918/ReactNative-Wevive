import React from 'react';
import {ChatContext} from 'react-native-chat-plugin/ChatContext';

import {MenuItem, MenuDivider} from '../../components/Menu';

export default function GroupSoundSettings({navigation}) {
  const ctx = React.useContext(ChatContext);
  const selected = ctx.getSetting('GroupSound') || 'Chord 1';
  const setSetting = (value) => {
    return () => {
      ctx.setSetting('GroupSound', value);
      navigation.navigate('NotificationSettings');
    };
  };
  return (
    <>
      <MenuDivider />
      <MenuItem
        type={'selection'}
        selected={selected == 'Chord 1'}
        onPress={setSetting('Chord 1')}>
        Chord 1
      </MenuItem>
      <MenuItem
        type={'selection'}
        selected={selected == 'Chord 2'}
        onPress={setSetting('Chord 2')}>
        Chord 2
      </MenuItem>
      <MenuItem
        type={'selection'}
        selected={selected == 'Chord 3'}
        onPress={setSetting('Chord 3')}>
        Chord 3
      </MenuItem>
    </>
  );
}

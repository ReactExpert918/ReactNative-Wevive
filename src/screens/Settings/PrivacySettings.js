import React, {Component} from 'react';
import {ScrollView} from 'react-native';
import { ChatContext } from 'react-native-chat-plugin/ChatContext';
import {MenuItem, MenuDivider, MenuDescription} from '../../components/Menu';

export default function PrivacySettings ({navigation}) {
  const ctx = React.useContext(ChatContext);
  const LastSeenPrivacy = ctx.getSetting('LastSeenPrivacy') || "Everyone";
  const TypingPrivacy = ctx.getSetting('TypingPrivacy') || "Everyone";
  const ProfilePhotoPrivacy = ctx.getSetting('ProfilePhotoPrivacy') || "Everyone";
  const AboutPrivacy = ctx.getSetting('AboutPrivacy') || "Everyone";
  const GroupsPrivacy = ctx.getSetting('GroupsPrivacy') || "Everyone";
  const ChatPrivacy = ctx.getSetting('ChatPrivacy') || "Everyone";
  const BlockedPrivacy = ctx.getSetting('BlockedPrivacy') || "Everyone";
  
  const setSetting = (key, value) => {
    return () => {
      ctx.setSetting(key, value);
    };
  };
  return (
    <ScrollView style={{backgroundColor: "white"}}>
      <MenuDivider />
      <MenuItem
        type="info"
        info={LastSeenPrivacy}
        onPress={() => {
          navigation.navigate('LastSeenPrivacySettings');
        }}>
        Last Seen
      </MenuItem>
      <MenuItem
        type="info"
        info={TypingPrivacy}
        onPress={() => {
          navigation.navigate('TypingPrivacySettings');
        }}>Typing</MenuItem>
      <MenuItem
        type="info"
        info={ProfilePhotoPrivacy}
        onPress={() => {
          navigation.navigate('ProfilePhotoPrivacySettings');
        }}>Profile Photo</MenuItem>
      <MenuItem
        type="info"
        info={AboutPrivacy}
        onPress={() => {
          navigation.navigate('AboutPrivacySettings');
        }}>About</MenuItem>
      <MenuItem
        type="info"
        info={GroupsPrivacy}
        onPress={() => {
          navigation.navigate('GroupsPrivacySettings');
        }}>Groups (who can add me)</MenuItem>
      <MenuItem
        type="info"
        info={ChatPrivacy}
        onPress={() => {
          navigation.navigate('ChatPrivacySettings');
        }}>Chats (who can add me)</MenuItem>
      <MenuItem
        type="info"
        info={BlockedPrivacy}
        onPress={() => {
          navigation.navigate('BlockedPrivacySettings');
        }}>Blocked</MenuItem>
      <MenuDivider />
      <MenuItem onChange={(value) => setSetting('ReadReceipts', value)} type={'toggle'}>
        Read Receipts
      </MenuItem>
      <MenuDescription>
        If you turn off read receipts, you won’t be able to see read receipts
        from other people. Read receipts are always sent for group chats.
      </MenuDescription>
    </ScrollView>
  );
}

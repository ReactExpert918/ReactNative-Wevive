import React, {Component} from 'react';
import {Share, ScrollView, Text} from 'react-native';

import {MenuItem, MenuDivider} from '../../components/Menu';

export default class AudioDataSettings extends Component {
  render() {
    return (
      <>
        <MenuItem>Media Links & Docs</MenuItem>
        <MenuItem>Starred Messages</MenuItem>
        <MenuItem>Chat Search</MenuItem>
        <MenuItem>Mute</MenuItem>
        <MenuItem>Custom Tone</MenuItem>
        <MenuItem>Save to Camera Roll</MenuItem>
        <MenuItem>Disappearing Messages</MenuItem>
        <MenuItem>Encryption</MenuItem>
        <MenuItem>Groups In Common</MenuItem>
        <MenuItem>Contact Details</MenuItem>
        <MenuDivider text="Actions" />
        <MenuItem notice>Share Contact</MenuItem>
        <MenuItem notice>Export Chat</MenuItem>
        <MenuItem important>Clear Chat</MenuItem>
        <MenuItem important>Block Contact</MenuItem>
        <MenuItem important>Report Contact</MenuItem>
      </>
    );
  }
}

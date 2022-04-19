import React, {Component} from 'react';
import {Share, ScrollView, Text} from 'react-native';

import {MenuItem, MenuDivider} from '../../components/Menu';

export default class HelpCentre extends Component {
  render() {
    return (
      <>
        <MenuDivider />
        <MenuItem>Download & Installation</MenuItem>
        <MenuItem>Verification</MenuItem>
        <MenuItem>Account & Profile</MenuItem>
        <MenuItem>Chats</MenuItem>
        <MenuItem>Payments</MenuItem>
        <MenuItem>Contacts</MenuItem>
        <MenuItem>Voice & Video Calls</MenuItem>
        <MenuItem>Security & Privacy</MenuItem>
        <MenuItem>Status</MenuItem>
        <MenuItem>Troubleshooting</MenuItem>
      </>
    );
  }
}

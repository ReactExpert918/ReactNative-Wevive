import React, {Component} from 'react';
import {Share, ScrollView, Text} from 'react-native';

import {MenuItem, MenuDivider} from '../../components/Menu';

export default class NetworkUsage extends Component {
  render() {
    return (
      <ScrollView style={{backgroundColor: "white"}}>
        <MenuDivider text="Messages" />
        <MenuItem type={'info'}>Sent</MenuItem>
        <MenuItem type={'info'}>Received</MenuItem>
        <MenuItem type={'info'}>Bytes Sent</MenuItem>
        <MenuItem type={'info'}>Bytes Received</MenuItem>
        <MenuDivider text="Chat Media" />
        <MenuItem type={'info'}>Bytes Sent</MenuItem>
        <MenuItem type={'info'}>Bytes Received</MenuItem>
        <MenuDivider text="Status Media" />
        <MenuItem type={'info'}>Bytes Sent</MenuItem>
        <MenuItem type={'info'}>Bytes Received</MenuItem>
        <MenuDivider text="Wevive Calls" />
        <MenuItem type={'info'}>Outgoing</MenuItem>
        <MenuItem type={'info'}>Incoming</MenuItem>
        <MenuItem type={'info'}>Bytes Sent</MenuItem>
        <MenuItem type={'info'}>Bytes Received</MenuItem>
        <MenuItem type={'info'}>Total Time</MenuItem>
        <MenuDivider text="Total Bytes" />
        <MenuItem type={'info'}>Sent</MenuItem>
        <MenuItem type={'info'}>Received</MenuItem>
        <MenuDivider />
        <MenuItem important>Reset Statistics</MenuItem>
      </ScrollView>
    );
  }
}

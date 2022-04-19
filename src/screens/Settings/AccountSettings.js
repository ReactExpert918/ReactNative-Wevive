import React, {Component} from 'react';
import {Share, ScrollView, Platform} from 'react-native';

import {MenuItem, MenuDivider} from '../../components/Menu';

export default class AccountSettings extends Component {
  render() {
    return (
      <ScrollView style={{backgroundColor: "white"}}>
        <MenuDivider />
        <MenuItem
          onPress={() => {
            this.props.navigation.navigate('ChangeNumber');
          }}>
          Change Number
        </MenuItem>
        <MenuItem
          onPress={() => {
            this.props.navigation.navigate('SecuritySettings');
          }}>
          Security
        </MenuItem>
        <MenuItem
          onPress={() => {
            this.props.navigation.navigate('DeleteAccount');
          }}>
          Delete my Account
        </MenuItem>
        <MenuItem
          onPress={() => {
            this.props.navigation.navigate('DeleteChats');
          }}>
          Delete my Chats
        </MenuItem>
        <MenuItem
          onPress={() => {
            this.props.navigation.navigate('PrivacySettings');
          }}>
          Privacy
        </MenuItem>
      </ScrollView>
    );
  }
}

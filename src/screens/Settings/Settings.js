import React, {Component} from 'react';
import {Share, ScrollView, Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {MenuItem, MenuDivider} from '../../components/Menu';

const onInvite = async () => {
  try {
    const result = await Share.share({
      message:
        'Hey - Join Wevive, a social network for doing good.' +
        (Platform.OS == 'android'
          ? 'Here is the link - https://wevive.com'
          : ''),
      url: 'https://wevive.com',
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    //alert(error.message);
  }
};

export default class Settings extends Component {
  render() {
    return (
      <ScrollView style={{backgroundColor: "white"}}>
        <MenuItem
          onPress={() => {
            this.props.navigation.navigate('PhoneUsernameSettings');
          }}>
          Photo & Username
        </MenuItem>
        <MenuItem
          onPress={() => {
            this.props.navigation.navigate('ContactsScreen', {
              type: 'archived',
            });
          }}>
          Archived Messages
        </MenuItem>
        <MenuDivider />
        <MenuItem
          onPress={() => {
            this.props.navigation.navigate('AccountSettings');
          }}>
          Account
        </MenuItem>
        <MenuItem
          onPress={() => {
            this.props.navigation.navigate('NotificationSettings');
          }}>
          Notifications
        </MenuItem>
        <MenuItem
          onPress={() => {
            this.props.navigation.navigate('StorageSettings');
          }}>
          Storage & Data
        </MenuItem>
        <MenuDivider />
        <MenuItem
          onPress={() => {
            this.props.navigation.navigate('Help');
          }}>
          Help
        </MenuItem>
        <MenuItem onPress={onInvite}>Send an Invite</MenuItem>
        <MenuItem
          onPress={() => {
            AsyncStorage.removeItem('sessionToken');
            AsyncStorage.removeItem('userToken');
            AsyncStorage.removeItem('password_sha512');
            this.props.navigation.navigate('Auth', {
              screen: 'SignIn',
              params: {
                BioID: false,
              },
            });
          }}>
          Log Out
        </MenuItem>
        <MenuDivider />
        <MenuItem
          onPress={() => {
            this.props.navigation.navigate('About');
          }}>
          About Wevive
        </MenuItem>
      </ScrollView>
    );
  }
}

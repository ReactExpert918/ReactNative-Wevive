import React, {Component} from 'react';
import {Share, ScrollView, Text} from 'react-native';

import {MenuItem, MenuDivider} from '../../components/Menu';
import {UserContext} from '../../context/UserContext';
import APIService from '../../service/APIService';

export default function SocialStatusSettings({navigation}) {
  const {authData, setAuthData} = React.useContext(UserContext);
  const setStatus = (status) => {
    return () =>
      APIService('users/me/', {status}).then((r) => {
        if (r.id) {
          setAuthData(r);
        }
        navigation.navigate('PhoneUsernameSettings');
      });
  };
  return (
    <>
      <MenuDivider />
      <MenuItem
        type={'selection'}
        selected={authData.status == 'Active'}
        onPress={setStatus('Active')}>
        Active
      </MenuItem>
      <MenuItem type={'selection'} selected={authData.status == 'At Work'} onPress={setStatus('At Work')}>
        At Work
      </MenuItem>
      <MenuItem type={'selection'} selected={authData.status == 'Do Not Disturb'} onPress={setStatus('Do Not Disturb')}>
        Do Not Disturb
      </MenuItem>
      <MenuItem type={'selection'} selected={authData.status == 'None'} onPress={setStatus('None')}>
        None
      </MenuItem>
    </>
  );
}

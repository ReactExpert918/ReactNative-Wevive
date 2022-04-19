import React, {Component} from 'react';
import {Share, ScrollView, Text} from 'react-native';

import {MenuItem, MenuDivider} from '../../components/Menu';

export default class UsedStorageSettings extends Component {
  render() {
    return (
      <>
        <MenuDivider text="Used" />
        <MenuDivider text="Review and Delete Items" />
        <MenuDivider text="Chats" />
      </>
    );
  }
}

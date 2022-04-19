import React, {Component} from 'react';
import {Share, ScrollView, Text} from 'react-native';

import {MenuItem, MenuDivider} from '../../components/Menu';

export default class PhotosDataSettings extends Component {
  render() {
    return (
      <>
        <MenuDivider text="Photos" />
        <MenuItem type={"selection"}>Never</MenuItem>
        <MenuItem type={"selection"}>Wi-Fi</MenuItem>
        <MenuItem type={"selection"} selected>Wi-Fi & Cellular</MenuItem>
      </>
    );
  }
}

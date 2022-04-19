import React, {Component} from 'react';
import {Share, ScrollView, Text} from 'react-native';

import {MenuItem, MenuDivider} from '../../components/Menu';

export default class Help extends Component {
  render() {
    return (
      <>
        <MenuDivider />
        <MenuItem onPress={() => {
            this.props.navigation.navigate('ContactUs');
        }}>Contact Us</MenuItem>
        <MenuItem onPress={() => {
            this.props.navigation.navigate('HelpCentre');
        }}>Help Centre</MenuItem>
        <MenuItem onPress={() => {
            this.props.navigation.navigate('Terms');
        }}>Terms & Conditions</MenuItem>
        <MenuItem onPress={() => {
            this.props.navigation.navigate('Licenses');
        }}>Licenses</MenuItem>
      </>
    );
  }
}

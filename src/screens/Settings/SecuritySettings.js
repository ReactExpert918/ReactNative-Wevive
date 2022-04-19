import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import {ScrollView} from 'react-native';
import {MenuItem, MenuDivider, MenuDescription} from '../../components/Menu';
import {BioIDContext} from '../../utils/BioAuth';

export default class SecuritySettings extends Component {
  componentDidMount() {
    AsyncStorage.getItem('TFA').then((res) => {
      if (res) {
        this.setState({TFA: res === 'enabled'});
      }
    });
  }

  state = {
    TFA: false,
  };

  toggleTFA = () => {
    if (this.state.TFA) {
      AsyncStorage.setItem('TFA', 'disabled');
      this.setState({TFA: false});
    } else {
      AsyncStorage.setItem('TFA', 'enabled');
      this.setState({TFA: true});
    }
  };
  render() {
    return (
      <BioIDContext.Consumer>
        {({available, keysExist, toggleBioID}) => (
          <ScrollView style={{backgroundColor: 'white'}}>
            <MenuDivider />
            {available && (
              <>
                <MenuItem
                  type={'toggle'}
                  value={keysExist}
                  onChange={toggleBioID}>
                  Enable Face ID
                </MenuItem>
                <MenuDescription>
                  Require Touch ID or Face ID to unlock Wevive
                </MenuDescription>
              </>
            )}
            <MenuDivider />
            <MenuItem
              type={'toggle'}
              value={this.state.TFA}
              onPress={this.toggleTFA.bind(this)}>
              Enable Two-step Verification
            </MenuItem>
            <MenuDescription>Require PIN to unlock Wevive</MenuDescription>
            <MenuDivider />
          </ScrollView>
        )}
      </BioIDContext.Consumer>
    );
  }
}

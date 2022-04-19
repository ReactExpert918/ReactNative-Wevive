import React, {Fragment, Component} from 'react';
import {Keyboard, ImageBackground, Text, View, StatusBar} from 'react-native';
import authStyles from '../styles/auth';
import ClientLogo from '../components/ClientLogo';
//import KeyboardManager from 'react-native-keyboard-manager';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Linking, Platform} from 'react-native';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import {ScrollContext} from '../context/ScrollContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppThemeContext} from '../context/UserContext';
import {SafeAreaView} from 'react-native-safe-area-context';
const background = require('../images/PNG/wevive_bg.png');
export default class AuthView extends Component {
  state = {
    scrollView: null,
    styles: authStyles(false),
  };
  componentDidMount() {
    this.focusListener = this.props.navigation.addListener('focus', () => {
      if (this.props.route) {
        if (!this.props.route.params || !this.props.route.params.BioID) {
          this.props.navigation.setParams({BioID: true});
        }
      }
      if (
        this.props.signMessage &&
        (!this.props.route.params || this.props.route.params.BioID)
      ) {
        AsyncStorage.getItem('phoneNumber').then((phoneNumber) => {
          if (phoneNumber) {
            this.props
              .signMessage(
                ':biometric_login',
                'Sign in using ' + phoneNumber + '?',
              )
              .then((success) => {
                this.props.bioLoginFunction({success, hideError: true});
              });
          }
        });
      }
    });

    if (Platform.OS === 'android') {
      changeNavigationBarColor('#ffffff', true, false);
    }
    Linking.addEventListener('url', (event) => {
      this.handleOpenURL(event.url);
    });
    // Launched from an external URL
    Linking.getInitialURL().then((url) => {
      if (url) {
        this.handleOpenURL(url);
      }
      global.Auth_Last_URL = '';
    });
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () =>
      this.setState({styles: authStyles(true)}),
    );
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () =>
      this.setState({styles: authStyles(false)}),
    );
  }
  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  } 
  handleOpenURL = async (url) => {
    const lastURL = global.Auth_Last_URL;
    if (lastURL === url) {
      return true;
    }
    global.Auth_Last_URL = url;
    if (url.indexOf('/reset') > 0) {
      const token = url.slice(url.indexOf('/reset') + 7);
      this.props.navigation.navigate('ResetPassword', {token: token});
    }
  };
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        {!this.props.noHeader && (
          <StatusBar
            backgroundColor="rgba(0,56,104,0)"
            translucent={true}
            barStyle="dark-content"
          />
        )}
        <ImageBackground
          resizeMode="cover"
          imageStyle={this.state.styles.bgStyle}
          style={this.state.styles.contentBg}
          source={background}>
          {!this.props.noHeader && (
            <View style={this.state.styles.mainLogoContainerStyle}>
              <SafeAreaView edges={['top']}>
                <ClientLogo
                  style={this.state.styles.mainLogoStyle}
                  imageStyle={this.state.styles.mainLogoImageStyle}
                />
              </SafeAreaView>
              {this.props.headline !== "" && (
                <Text style={this.state.styles.mainHeadlineStyle}>
                  {this.props.headline}
                </Text>
              )}
            </View>
          )}
          <KeyboardAwareScrollView scrollEnabled={!!this.props.scrollDisabled} ref={(ref) => (this.state.scrollView = ref)}>
            <ScrollContext.Provider value={{scroll: this.state.scrollView}}>
              <View style={this.state.styles.container}>
                {this.props.children}
              </View>
            </ScrollContext.Provider>
          </KeyboardAwareScrollView>
        </ImageBackground>
      </>
    );
  }
}

//import CodePush from 'react-native-code-push';
import React, {Component} from 'react';
import {
  BackHandler,
  UIManager,
  Platform,
  Dimensions,
  PermissionsAndroid
} from 'react-native';

import './react/features/app/middlewares';
import './react/features/app/reducers';

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

import NetInfo from '@react-native-community/netinfo';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Orientation from 'react-native-orientation-locker';
import * as RNLocalize from 'react-native-localize';

//import Geolocation from '@react-native-community/geolocation';
import bootstrap from './src/utils/bootstrap';
import i18n from './i18n';

import RootStack from './src/navigation/RootStack';
import {BioID} from './src/utils/BioAuth';
import {ClientContext} from './src/context/ClientContext';
import APIService from './src/service/APIService';
import {AppLoadingIndicator} from './src/components/AppLoadingIndicator';
import {getPhoneContacts} from './src/utils/helpers';
import styles from './src/styles/content';

NetInfo.fetch().then((state) => {
  global.isInternetReachable = state.isInternetReachable;
});

const netinfo_unsubscribe = NetInfo.addEventListener((state) => {
  global.isInternetReachable = state.isInternetReachable;
});

class AppContainer extends Component {
  styles = {
    body: {
      fontColor: '#FF0000',
    },
  };
  setDimensionsIos = (dim) => {
    const {
      screen: {height: screenHeight, width: screenWidth},
      window: {height: windowHeight, width: windowWidth},
    } = dim;

    if (screenHeight === windowWidth && screenWidth === windowHeight) {
      setTimeout(() => Dimensions.set({window: dim.screen}), 0);
    }
  };

  dimensionListener = (args) => {
    if (Platform.OS === 'ios') {
      this.setDimensionsIos(args);
    }
  };
  componentDidMount() {
    bootstrap();
    APIService('users/geoip/', null).then((geo) => {
      if (Platform.OS === 'android') {
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            title: 'Contacts',
            message: 'This app would like to sync your contacts.',
            buttonPositive: 'Allow',
          },
        ).then((status) => {
          if (status === 'granted') {
            if (geo) {
              getPhoneContacts(geo);
              this.setState({geo, ready: true});
            } else {
              getPhoneContacts(this.state.geo);
              this.setState({ready: true});
            }
          }
        });
      } else {
        if (geo) {
          getPhoneContacts(geo);
          this.setState({geo, ready: true});
        } else {
          getPhoneContacts(this.state.geo);
          this.setState({ready: true});
        }
      }
    });
    if (Platform.OS === 'android') {
      //FIXME
      BackHandler.addEventListener('hardwareBackPress', () => {
        return true;
      });
    }

    Dimensions.removeEventListener('change', this.dimensionListener);

    //Geolocation.setRNConfiguration( { authorizationLevel: 'whenInUse' } );
    RNLocalize.addEventListener('change', this.handleLocalizationChange);
  }

  componentWillUnmount() {
    netinfo_unsubscribe();
    Dimensions.removeEventListener('change', this.dimensionListener);
    RNLocalize.removeEventListener('change', this.handleLocalizationChange);
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress');
    }
  }

  handleLocalizationChange = () => {
    const fallback = {languageTag: 'en'};
    const {languageTag} = RNLocalize.getLocales()[0] || fallback;
    i18n.locale = languageTag;
  };

  state = {
    client: null,
    geo: {
      geo: {
        country_code: RNLocalize.getCountry()
      }
    },
    ready: false,
  };

  render() {
    return (
      <>
        {this.state.ready && (
          <SafeAreaProvider style={styles.body}>
            <ClientContext.Provider value={this.state.geo}>
              <BioID>
                <RootStack initialProps={this.props.initialProps} />
              </BioID>
            </ClientContext.Provider>
          </SafeAreaProvider>
        )}
        <AppLoadingIndicator />
      </>
    );
  }
}

global.encryptionKeys = {
  keygen_salt: 'XP4joydRgMw1hf+eJXAcFQWmBlObh6iQ6RsNIfjSoZE=',
  private_key: 'Qxzxc3aVxDkoSDvhjHSgv3zYQeoVr2/rHOGmG2ttuJI=',
  public_key: 'h9HtEs59STqJQc+BDymfobPIHqYhTsDw9Sm2JyPF5F0=',
};
//let codePushOptions = {checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME};
Orientation.lockToPortrait();
export default AppContainer; //CodePush(codePushOptions)(AppContainer);

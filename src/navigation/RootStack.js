import React, {useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  NavigationContainer,
  DefaultTheme,
  getStateFromPath,
} from '@react-navigation/native';

import analytics from '@react-native-firebase/analytics';

import AppBootstrap from './AppBootstrap';
import AppStack from './AppStack';
import AuthStack from './AuthStack';
import {domainReversed, deepLinkURL} from '../../app.json';
import {
  UserContext as AppUserContext,
  AppThemeContext,
} from '../context/UserContext';
let rootLoaded = false;
const forFade = ({current}) => ({
  cardStyle: {opacity: current.progress},
});

const defaultConfig = {
  headerShown: false,
  cardStyleInterpolator: forFade,
};

const MainStack = createStackNavigator();
const config = {
  screens: {
    AppBootstrap: 'loading',
    Auth: {
      screens: {
        SignIn: 'signin',
        ConfirmAccount: 'confirm',
      },
    },
    App: {
      screens: {
        Main: {
          screens: {
            Account: 'account',
          },
        },
      },
    },
    //Account: 'account',
  },
};
const linking = {
  prefixes: [domainReversed + '://app/', deepLinkURL],
  config,
  getStateFromPath: (path, options) => {
    return getStateFromPath(path, options);
  },
};

import APIService from '../service/APIService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import deepEqual from 'deep-equal';
let i = 0;
const RootStack = ({initialProps}) => {
  React.useEffect(() => {
    if (navigationRef.current && initialProps?.url?.room) {
      global.navigateTo('VideoCalls', {
        callId: initialProps.url.room,
        conversationId: initialProps.url.room,
        video: !!initialProps?.video,
      });
    }
  }, [navigationRef, initialProps]);
  const [themeSettings, setThemeSettings] = useState({
    hiddenBack: true,
    hiddenHeader: false,
    hiddenFooter: false,
    canGoBack: false,
  });
  const onStateChange = (navState, backFunction) => {
    const changedTheme = {...themeSettings};
    const routeName = navState.name;
    if (routeName === 'VideoCalls') {
      if (!themeSettings.hiddenHeader) {
        changedTheme.hiddenHeader = true;
        changedTheme.hiddenFooter = true;
      }
    } else {
      if (themeSettings.hiddenHeader) {
        changedTheme.hiddenHeader = false;
        changedTheme.hiddenFooter = false;
      }
    }
    if (routeName == 'ChatScreen') {
      changedTheme.hiddenHeader = true;
    }
    if (routeName === 'PhoneContactsScreen') {
      changedTheme.hiddenHeader = true;
    }
    if (routeName === 'ContactsScreen' || routeName === 'Main') {
      changedTheme.hiddenBack = true;
    } else {
      changedTheme.hiddenBack = false;
    }
    const sameTheme = deepEqual(changedTheme, themeSettings);
    if (!sameTheme) {
      setThemeSettings(changedTheme);
      global.lastAppliedTheme = changedTheme;
    }
    analytics().logScreenView({
      screen_name: routeName,
      screen_class: routeName,
    });
    return true;
  };

  const routeNameRef = React.useRef();
  const navigationRef = React.useRef();
  global.navigation = navigationRef.current;
  const [authData, setAuthData] = useState(false);
  const updateAuthData = async (newData) => {
    /*if (newData && newData.access_token) {
      newData.userToken = newData.access_token;
    }*/
    if (!newData && authData) {
      return;
    }
    const userToken =
      !newData || !newData.access_token
        ? await AsyncStorage.getItem('userToken')
        : newData.access_token;
    if (!newData && userToken !== authData.userToken) {
      setAuthData({
        ...authData,
        userToken: userToken,
      });
      return;
    }
    setAuthData({
      ...authData,
      ...newData,
      userName: 'name' in newData ? newData.name : authData.userName,
      avatarUrl:
        'avatar' in newData && newData.avatar
          ? newData.avatar
          : 'avatarUrl' in newData && newData.avatarUrl
          ? newData.avatarUrl
          : authData.avatarUrl,
      avatarHosted:
        newData.avatarUrl && newData.avatarUrl.indexOf('https://') !== -1
          ? newData.avatarUrl
          : newData.avatar && newData.avatar.indexOf('https://') !== -1
          ? newData.avatar : authData?.avatarHosted,
      userToken: userToken,
    });
  };
  React.useEffect(() => {
    if (!authData) {
      AsyncStorage.multiGet([
        'userId',
        'avatarUrl',
        'userToken',
        'userName',
      ]).then((items) => {
        const k = {};
        items.map((i) => (k[i[0]] = i[1]));
        if (k.userId) {
          rootLoaded = true;
          const avatarUrl = k.avatarUrl ? k.avatarUrl.slice(1, -1) : null;
          /*setAuthData({
            id: k.userId,
            avatarUrl,
            userToken: k.userToken,
            userName: k.userName,
          });*/
          setTimeout(() => {
            updateMe(k.userToken);
          }, 10);
        }
      });
    }
  }, [authData])
  const updateMe = async (token) => {
    const userToken = token || authData.userToken;
    if (userToken) {
      APIService('users/me/', null)
        .then((result) => {
          updateAuthData(result);
        })
        .catch(() => {
          AsyncStorage.removeItem('userToken');
          navigationRef.current.navigate('Auth', {
            screen: 'SignIn',
            params: {
              BioID: false,
            },
          });
        });
    }
  };
  const appUserContextValue = {authData, setAuthData: updateAuthData, updateMe, setThemeSettings};
  return (
    <AppUserContext.Provider value={appUserContextValue}>
      <AppThemeContext.Provider value={themeSettings}>
        <NavigationContainer
          theme={DefaultTheme}
          linking={linking}
          ref={navigationRef}
          onReady={() => {
            routeNameRef.current = navigationRef.current.getCurrentRoute().name;
          }}
          onStateChange={() => {
            const currentRoute = navigationRef.current.getCurrentRoute();

            // Save the current route name for later comparision
            routeNameRef.current = currentRoute.name;
            onStateChange(
              currentRoute,
              navigationRef.current.canGoBack()
                ? () => {
                    navigationRef.current.goBack();
                  }
                : null,
            );
          }}>
          <MainStack.Navigator
            initialRouteName="AppBootstrap"
            screenOptions={{gestureEnabled: false}}>
            <MainStack.Screen
              name="AppBootstrap"
              component={AppBootstrap}
              options={defaultConfig}
            />
            <MainStack.Screen
              name="Auth"
              component={AuthStack}
              options={defaultConfig}
            />
            <MainStack.Screen
              name="App"
              component={AppStack}
              options={defaultConfig}
            />
          </MainStack.Navigator>
        </NavigationContainer>
      </AppThemeContext.Provider>
    </AppUserContext.Provider>
  );
};

//RootStack.whyDidYouRender = true;
export default RootStack;

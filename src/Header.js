import React, {Component} from 'react';
import {
  Image,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  ImageBackground,
} from 'react-native';
import Icon from './components/Icon';
import ClientLogo from './components/ClientLogo';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../app.json';
import {UserContext} from './context/UserContext';
import { ChatContext } from 'react-native-chat-plugin/ChatContext';
import { useNavigation } from '@react-navigation/core';
const getTitlePrefix = (name, params) => {
  if (name == 'ContactsScreen' && params?.type == 'archived') {
    return 'Archived ';
  }
  if (name == 'ContactsScreen' && params?.type == 'starred') {
    return 'Starred ';
  } else {
    return '';
  }
};
const getTitle = (name, params) => {
  if (name.indexOf('PrivacySettings') !== -1) {return "Privacy Settings";}
  switch (name) {
    case 'PhoneUsernameSettings':
      return 'Photo & Username';
    case 'PhoneContactsScreen':
      return 'Contacts';
    case 'CallHistory':
      return 'Calls';
    case 'SearchContactsScreen':
      return params?.type == 'private' || params?.type == 'public'
        ? 'Create group'
        : 'Search Contacts';
    case 'SocialStatusSettings':
      return 'Status';
    case 'HelpCentre':
      return 'Help Centre';
    case 'StorageSettings':
      return 'Storage Settings';
    case 'NetworkUsage':
      return 'Network Usage';
    case 'ContactsScreen':

      return getTitlePrefix(name, params) + (params?.filter == 'groups' ? 'Group Chats' : 'Chats');
    case 'ChatScreen':
      return false;
    case 'AccountSettings':
      return 'Account';
    case 'ChangeUsername':
      return 'Username';
    case 'ChangeNumber':
      return 'Change Number';
    case 'SecuritySettings':
      return 'Settings';
    case 'DeleteAccount':
      return 'Delete Account';
    case 'DeleteChats':
      return 'Delete Chats';
    case 'PrivacySettings':
      return 'Privacy Settings';
    case 'ContactUs':
      return 'Contact Us';
    case 'ChangeNumberVerification':
      return 'Change Phone Number';
    case 'ChangeNumberConfirmation':
      return 'Verify new number';
    case 'ChangeNumberSuccess':
      return 'Phone number changed';
    default:
      break;
  }
  return name;
};

const getStyleSuffix = (name) => {
  switch (name) {
    case 'PhoneUsernameSettings':
      return 'Big';
    case 'ContactsScreen':
      return '';
    case 'ChatScreen':
      return '';
    case 'AccountSettings':
      return 'Big';
    case 'ChangeNumber':
      return 'Big';
    case 'SecuritySettings':
      return 'Big';
    case 'DeleteAccount':
      return 'Big';
    case 'DeleteChats':
      return 'Big';
    case 'PrivacySettings':
      return 'Big';
    case 'ChangeNumberVerification':
      return 'Big';
    case 'ChangeNumberConfirmation':
      return 'Big';
    case 'ContactUs':
      return 'Big';
    default:
      break;
  }
  return '';
};
const getLogo = (name) => {
  const styleSuffix = getStyleSuffix(name);
  const logoStyle = name
    ? styles[`mainLogoStyle${styleSuffix}`]
    : styles.mainLogoStyle;
  return styleSuffix !== 'Big' ? (
    <ClientLogo style={logoStyle} imageStyle={styles.mainLogoImageStyle} />
  ) : (
    <Icon style={logoStyle} name="w-watermark" />
  );
};
const getNextRoute = (name, params) => {
  switch (name) {
    case 'ChangeNumber':
      return 'ChangeNumberVerification';
    case 'ChangeNumberVerification':
      return 'ChangeNumberConfirmation';
    case 'DeleteChats':
      return 'DeleteChatsConfirmation';
    case 'ChangeUsername':
      return '';
    default:
      return '';
  }
};
const getNextParams = (name, params) => {};
const getNextOrProfile = (navigate, name, params, avatarUrl) => {
  const styleSuffix = getStyleSuffix(name);
  const next = [
    'ChangeNumber',
    'ChangeNumberVerification',
    'SearchContactsScreen',
  ];
  const logoStyle = name
    ? styles[`mainLogoStyle${styleSuffix}`]
    : styles.mainLogoStyle;
  return next.indexOf(name) === -1 ? (
    <TouchableOpacity onPress={() => navigate('Settings')}>
      <Image
        resizeMode="cover"
        source={{uri: avatarUrl}}
        style={styles.headerProfileImage}
      />
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      onPress={() => {
        const nextRoute = getNextRoute(name, params);
        if (nextRoute !== '') {
          navigate(nextRoute, getNextParams(name, params));
        } else {
          if (typeof nextButton == 'function') {
            // eslint-disable-next-line no-undef
            nextButton();
          }
        }
      }}>
      <Text style={styles.goNextText}>Next</Text>
    </TouchableOpacity>
  );
};
export default function Header({route, themeSettings}) {
  const navigation = useNavigation();
  const navigate = navigation.navigate;
  const ctx = React.useContext(UserContext);
  const chatCtx = React.useContext(ChatContext);
  const users = chatCtx.getUsers();
  const name = route.state?.routes[route.state.index].name;
  const params = route.state?.routes[route.state.index].params;
  const title = name ? getTitle(name, params) : false;
  const styleSuffix = getStyleSuffix(name);
  const style = name ? styles[`headerTitle${styleSuffix}`] : styles.headerTitle;
  const logo = getLogo(name);
  const userIdx = users.findIndex(u => u.id == ctx.authData.id);
  let avatarUrl;
  if (userIdx !== -1) {
    avatarUrl = users[userIdx].avatar;
  } else {
    avatarUrl = ctx.avatarUrl || (ctx.authData ? ctx.authData.avatarHosted : "");
  }
  const nextOrProfile = getNextOrProfile(navigate, name, params, avatarUrl);
  return (
    <SafeAreaView edges={['top']}>
      <View style={styles.header}>
        <View style={styles.left}>
          {!themeSettings.hiddenBack ? (
            <TouchableOpacity
              transparent
              onPress={() => {
                global.navigation.goBack();
              }}>
              <View style={{paddingHorizontal: 15}}>
                <Icon
                  name="back-arrow"
                  size={responsiveFontSize(2.5)}
                  color={colors.headerText}
                />
              </View>
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={styles.mainLogoContainerStyle}>
          {title && <Text style={style}>{title}</Text>}
        </View>
        <View style={styles.right}>{nextOrProfile}</View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  header: {
    height: responsiveHeight(7),
    marginTop: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  left: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: responsiveWidth(5),
  },
  right: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: responsiveWidth(5),
  },
  mainLogoStyle: {
    borderRadius: 7,
    width: responsiveWidth(40),
    height: responsiveHeight(9),
    marginTop: responsiveWidth(2),
  },
  mainLogoStyleBig: {
    borderRadius: 7,
    marginTop: responsiveWidth(1),
    alignSelf: 'center',
    fontSize: responsiveFontSize(4),
    color: 'rgb(227,140,57)',
  },
  headerTitle: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: responsiveFontSize(2.4),
    alignSelf: "flex-end",
    fontWeight: '200',
  },
  mainLogoContainerStyle: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    //backgroundColor: colors.secondaryBackground,
    borderRadius: 7,
    marginBottom: responsiveWidth(0),
    padding: responsiveWidth(2),
  },
  mainLogoImageStyle: {
    resizeMode: 'contain',
  },
  headerProfileImage: {
    width: responsiveWidth(12),
    height: responsiveWidth(12),
    borderRadius: responsiveWidth(12),
    backgroundColor: 'rgba(30,30,30,0.1)',
  },
  goNextText: {
    fontFamily: 'SFProDisplay-Regular',
    color: 'rgba(30,30,30,1)',
    fontSize: responsiveFontSize(2.3),
    marginRight: responsiveWidth(1),
    fontWeight: '100',
  },
});

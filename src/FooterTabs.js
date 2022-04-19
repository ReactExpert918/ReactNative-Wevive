import React, {createRef} from 'react';
import {Text, StyleSheet, View, Pressable, Platform} from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import Icon from './components/Icon';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {SafeAreaView} from 'react-native-safe-area-context';
import {getFocusedRouteNameFromRoute, useNavigation, useRoute} from '@react-navigation/native';

import {ActionSheetCustom as ActionSheet} from '@alessiocancian/react-native-actionsheet';

import {colors} from './../app.json';
import {addUnreadCountListener} from 'react-native-chat-plugin';
const actionSheetRef = createRef();
const showActionSheet = () => {
  actionSheetRef.current.show();
};

const ActionSheetElement = (props) => {
  return (
    <View style={styles.menuItem}>
      <Text style={styles.menuText}>{props.text}</Text>
      <Icon name={props.icon} style={styles.menuIcon} />
    </View>
  );
};
const iconSize = responsiveHeight(3);

const FooterButton = ({text, onPress, icon, active, unreadCounter, unread}) => {
  return (
    <View style={styles.footerItem}>
      <Pressable style={styles.footerButton} onPress={onPress}>
        <Icon
          name={icon}
          size={iconSize}
          color={!active ? colors.footerIcons : colors.activeFooterIcon}
        />
        <Text style={!active ? styles.footerText : styles.activeFooterText}>
          {text}
        </Text>
        {unreadCounter && unread > 0 && (
          <View style={styles.unreadBox}>
            <Text style={styles.unreadText}>{unread}</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
};

export default function FooterTabs() {
  const [unread, setUnread] = React.useState(0);
  const navigation = useNavigation();
  const navigate = navigation.navigate;
  const route = useRoute();
  React.useEffect(() => {
    setUnread(0);
    if (Platform.OS === 'ios') {
      PushNotificationIOS.setApplicationIconBadgeNumber(0);
    }
    addUnreadCountListener((value) => {
      setUnread(value);
      if (Platform.OS === 'ios') {
        PushNotificationIOS.setApplicationIconBadgeNumber(value);
      }
    });
  }, []);
  const params = route.state?.routes[route.state.index].params;
  const routeName = getFocusedRouteNameFromRoute(route);
  const createConversation = (index) => {
    switch (index) {
      case 0:
        navigate('SearchContactsScreen', {type: 'private'});
        break;
      case 1:
        navigate('SearchContactsScreen', {type: 'oneToOne'});
        break;
      default:
        break;
    }
  };
  const actionSheet = [
    <ActionSheetElement text="Private group" icon="lock" />,
    <ActionSheetElement text="1-to-1 Chat" icon="lock" />,
    'Cancel',
  ];
  const navigateToPhoneContacts = () => {
    navigate('PhoneContactsScreen');
  };
  const navigateToCallHistory = () => {
    navigate('CallHistory');
  };
  const navigateToContacts = () => {
    navigate('ContactsScreen', {filter: 'chats', type: null});
  };
  const navigateToGroups = () => {
    navigate('ContactsScreen', {filter: 'groups', type: null});
  };
  if (routeName == 'VideoCalls') {
    return null;
  }
  return (
    <SafeAreaView edges={['bottom']} style={styles.footerBackground}>
      <ActionSheet
        ref={actionSheetRef}
        title={'Create conversation'}
        options={actionSheet}
        onPress={createConversation}
      />
      <View style={styles.footer}>
        <FooterButton
          text="Invites"
          onPress={navigateToPhoneContacts}
          icon="wetalk"
          active={routeName === 'PhoneContactsScreen'}
        />
        <FooterButton
          text="Calls"
          onPress={navigateToCallHistory}
          icon="calls"
          active={routeName === 'CallHistory'}
        />
        <FooterButton
          text="Add new"
          onPress={showActionSheet}
          icon="add-new"
          active={routeName === 'SearchContactsScreen'}
        />
        <FooterButton
          text="Chats"
          onPress={navigateToContacts}
          icon="chats"
          active={routeName === 'ContactsScreen' && params?.filter !== 'groups'}
          unreadCounter
          unread={unread}
        />
        <FooterButton
          text="News"
          onPress={navigateToGroups}
          icon="groups"
          active={routeName === 'ContactsScreen' && params?.filter === 'groups'}
        />
      </View>
    </SafeAreaView>
  );
}

//FooterTabs.whyDidYouRender = false;
const styles = StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
  },
  unreadText: {
    color: 'white',
    fontSize: 9,
    fontWeight: '400',
    alignSelf: 'center',
    textAlign: 'center',
  },
  unreadBox: {
    backgroundColor: 'rgb(200,30,30)',
    justifyContent: 'center',
    position: 'absolute',
    borderRadius: 30,
    width: 14,
    height: 14,
    right: 0,
    bottom: 15,
  },
  menuText: {
    marginRight: responsiveWidth(3),
    width: responsiveWidth(30),
    textAlign: 'center',
    fontWeight: '100',
    fontSize: responsiveFontSize(2.2),
    fontFamily: 'SFProDisplay-Regular',
  },
  menuIcon: {
    fontSize: responsiveWidth(4),
    color: 'rgb(100,100,100)',
    alignSelf: 'center',
  },
  footerBackground: {
    backgroundColor: colors.footer,
    zIndex: 999,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(3),
    alignItems: 'flex-start',
    marginVertical: 0,
    height: responsiveHeight(8),
    paddingTop: responsiveHeight(0.5),
    marginBottom: responsiveWidth(3),
  },
  footerItem: {
    alignItems: 'center',
    flexGrow: 1,
    flex: 1,
    justifyContent: 'flex-start',
  },
  footerButton: {
    alignItems: 'center',
    flexGrow: 1,
    flex: 1,

    justifyContent: 'flex-end',
  },
  activeFooterText: {
    color: colors.activeFooterIcon,
    fontSize: responsiveFontSize(1.5),
    fontFamily: 'SFProDisplay-Regular',
    fontWeight: '400',
    marginTop: 5,
  },
  footerText: {
    color: colors.footerText,
    fontSize: responsiveFontSize(1.5),
    marginTop: 5,
    fontFamily: 'SFProDisplay-Regular',
    fontWeight: '400',
  },
  contentFooter: {
    width: '100%',
  },
});

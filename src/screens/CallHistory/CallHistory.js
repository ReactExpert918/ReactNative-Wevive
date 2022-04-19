import React, {Component} from 'react';
import {SwipeListView} from 'react-native-swipe-list-view';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import {MenuItem, MenuDivider} from '../../components/Menu';
import {ChatContext} from '../../../node_modules/react-native-chat-plugin/ChatContext';
import CallHistoryItem from '../../components/CallHistoryItem';
import CacheStore from 'react-native-cache-store';
import APIService from '../../service/APIService';
import {UserContext} from '../../context/UserContext';
const chatWallpaper = require('../../../node_modules/react-native-chat-plugin/images/chat_background.png');
export default function CallHistory({navigation, route}) {
  //const calls = [];
  const keyExtractor = (item) => String(item.id);
  const ctx = React.useContext(ChatContext);
  const calls = ctx.getCalls();
  //const users = ctx.getUsers();
  const {authData} = React.useContext(UserContext);
  React.useEffect(() => {
    async function getCalls() {
      const calls_db = await ctx.getCallsFromDB();
      if (calls_db.length) {
        ctx.addCalls(calls_db);
      }
    }
    getCalls();
  }, []);
  const swiper = React.useRef();
  const onPress = (call) => {
    const conversation = ctx.getConversationById(call.group_id);
    voipCall(conversation);
    global.navigateTo('VideoCalls', {
      callId: call.group_id,
      conversationId: call.group_id,
      video: !!call.video,
    });
  };
  const voipCall = React.useCallback(
    (conversation) => {
      const others =
        conversation && conversation.participants && 
        conversation.participants
          .map((p) => p.id)
          .filter((p) => String(p) !== String(authData.id));
      if (others) {
        CacheStore.set('activeCall', conversation.id);
        CacheStore.set('activeCallOthers', JSON.stringify(others));
        APIService('users/voipcall/', {
          users: others,
          callUUID: conversation.id,
          message: 'Wevive Call',
          type: 'call',
          video: !!conversation.video
        });
        APIService('users/pushmessage/', {
          users: others,
          message: 'Call from ' + authData.userName,
          extra: {
            type: 'call',
            video: !!conversation.video,
            callUUID: conversation.id,
            caller: authData.id,
            username: authData.userName,
            avatarURL: authData.avatarHosted,
            timestamp: +Date.now(),
          },
        });
      }
    },
    [authData],
  );
  const renderHiddenItem = ({item}) => {
    const Icon = ctx.icon;
    return (
      <View style={styles.hiddenItemContainer}>
        <View style={styles.deleteContainer}>
          <TouchableOpacity
            style={styles.deleteViewParent}
            onPress={() => ctx.deleteCall(item)}>
            <View style={styles.deleteView}>
              <Icon name={'trash'} style={styles.deleteText} />
              <Text style={styles.deleteTextText}>{'Delete'}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const renderConversation = ({item}) => {
    return <CallHistoryItem call={item} onPress={onPress} />;
  };
  return (
    <ImageBackground source={chatWallpaper} style={styles.chatBackground}>
      <SwipeListView
        style={styles.container}
        swipeRowStyle={styles.rowStyle}
        data={calls || []}
        renderItem={renderConversation}
        renderHiddenItem={renderHiddenItem}
        disableLeftSwipe={false}
        disableRightSwipe={false}
        recalculateHiddenLayout={false}
        rightOpenValue={-60}
        stopRightSwipe={-60}
        closeOnRowBeginSwipe={true}
        keyExtractor={keyExtractor}
        useNativeDriver
        ref={swiper}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 1,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  rowStyle: {
    flex: 1,
    flexDirection: 'column',
  },
  leftSwipeContainer: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    width: 120,
    zIndex: 10,
    top: 5,
  },
  deleteContainer: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    width: 60,
    zIndex: 10,
    top: 5,
  },
  deleteViewParent: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  deleteTextText: {
    color: 'white',
    fontSize: 11,
    marginTop: 10,
  },
  deleteView: {
    width: 60,
    height: '100%',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'rgb(201, 66, 59)',
  },
  deleteText: {
    color: 'white',
    fontSize: 22,
  },
  chatBackground: {
    flex: 1,
  },
  listItemContainer: {
    padding: 20,
  },
  sectionHeaderContainer: {
    backgroundColor: 'rgb(125,125,125)',
    paddingVertical: 7,
    paddingHorizontal: 20,
  },
  sectionHeaderLabel: {
    fontWeight: '700',
    color: 'white',
  },
  alphabetContainer: {
    backgroundColor: 'rgb(145,145,145)',
    borderRadius: 30,
    height: 400,
  },
  hiddenItemContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

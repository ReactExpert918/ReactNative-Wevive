import React, {useContext} from 'react';
import {TouchableHighlight, Text, StyleSheet, View, Image} from 'react-native';
import PropTypes from 'prop-types';
import ProfilePreview from '../../node_modules/react-native-chat-plugin/Components/ProfilePreview';
import Colors from '../../node_modules/react-native-chat-plugin/constants/Colors';
import Fonts from '../../node_modules/react-native-chat-plugin/constants/Fonts';
import {CallProptype, ConversationPropType} from '../../node_modules/react-native-chat-plugin/PropTypes';
import {ChatContext} from '../../node_modules/react-native-chat-plugin/ChatContext';
import LinearGradient from 'react-native-linear-gradient';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import TypingIndicator from 'react-native-chat-plugin/ChatScreen/TypingIndicator';
import { formatDateForHumans } from '../utils/helpers';
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'red',
    flexDirection: 'row',
    padding: 20,
  },
  previewContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontFamily: Fonts.Light,
    marginTop: 0,
  },
  icons: {
    flexDirection: "row",
  }, 
  icon: {
    color: "rgb(200,200,200)",
    fontSize: 18,
  },
  date: {
    fontSize: 10,
    position: 'absolute',
    fontFamily: Fonts.Light,
    right: 10,
    top: 2,
  },
  duration: {
    fontSize: 9,
    fontFamily: Fonts.Light,
    color: 'rgb(150,150,150)',
  },
  preview: {
    fontSize: 14,
    marginTop: 7,
    color: '#333',
    marginRight: 80,
    fontFamily: Fonts.Light,
  },
  unreadCount: {
    marginLeft: 'auto',
    alignSelf: 'center',
    width: 30,
    height: 30,
    borderRadius: 30,
    textAlign: 'center',
    textAlignVertical: 'center',
    alignItems: 'center',
    color: Colors.TEXT,
    backgroundColor: '#E2E2E2',
    flexDirection: 'row',
    top: 5,
    right: 5,
  },
  unreadCountText: {
    width: 30,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: Colors.TEXT,
  },
  encryptedIcon: {},
  mutedIcon: {
    width: 20,
  },
  conversationName: {
    flexDirection: 'column',
  },
  conversationIcon: {
    top: 7,
    marginLeft: 5,
    fontSize: responsiveFontSize(1.3),
    color: 'rgb(150,150,150)',
  },
});
function getCallDate(call) {
  const time = call.created_at;
  const formattedDate = formatDateForHumans(new Date(time));
  return (
    <Text style={styles.date}>
      {formattedDate}
    </Text>
  );
}
function getSeconds(duration) {
  const seconds = String(duration % 60);
  return seconds.substr(0,1) == seconds ? "0" + seconds : seconds; 
}
function getCallDuration(call) {
  const durationString =  Math.floor(call.duration / 60) + ":" + getSeconds(call.duration)
  return (
    <Text style={styles.duration}>
      {durationString}
    </Text>
  );
}
function getPreview(conversation) {
  let event = conversation.lastEvent;
  const prefix = ''; // event?.owner?.username ? event.owner.username + ": " : "";
  const preview =
    typeof event?.text === 'string'
      ? event.text.length > 128
        ? event.text.substring(0, 128) + '..'
        : event.text
      : 'No Messages yet.';

  return `${prefix}${preview}`;
}
const lockIcon = require('../../node_modules/react-native-chat-plugin/images/lock_icon.png');
export default function CallHistoryItem({call, onPress}) {
  const ctx = useContext(ChatContext);
  const Icon = ctx.icon;
  return (
    <TouchableHighlight
      onPress={() => onPress && onPress(call)}
      underlayColor="#F8E2DD">
      <LinearGradient style={styles.container} colors={['#ffffff', '#f3f3f3']}>
        <ProfilePreview text={call.name} />
        <View>
          <View style={styles.conversationName}>
            <Text style={styles.name}>{call.name}
              <Icon name="medium-call-icon" style={styles.icon} /></Text>
            <View style={styles.icons}>
              {getCallDuration(call)}
            </View>
          </View>
        </View>
        {getCallDate(call)}
        
      </LinearGradient>
    </TouchableHighlight>
  );
}

CallHistoryItem.propTypes = {
  call: CallProptype,
  onPress: PropTypes.func.isRequired,
};

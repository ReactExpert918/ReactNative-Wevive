// @flow

import _ from 'lodash';

import {createToolbarEvent, sendAnalytics} from '../../analytics';
import {appNavigate} from '../../app/actions';
import {disconnect} from '../../base/connection';
import {translate} from '../../base/i18n';
import {connect} from '../../base/redux';
import {AbstractHangupButton} from '../../base/toolbox/components';
import type {AbstractButtonProps} from '../../base/toolbox/components';
import APIService from '../../../../src/service/APIService';
import CacheStore from 'react-native-cache-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNCallKeep from 'react-native-callkeep';
import { Platform } from 'react-native';

/**
 * The type of the React {@code Component} props of {@link HangupButton}.
 */
type Props = AbstractButtonProps & {
  /**
   * The redux {@code dispatch} function.
   */
  dispatch: Function,
};

/**
 * Component that renders a toolbar button for leaving the current conference.
 *
 * @augments AbstractHangupButton
 */
class HangupButton extends AbstractHangupButton<Props, *> {
  _hangup: Function;

  accessibilityLabel = 'toolbar.accessibilityLabel.hangup';
  label = 'toolbar.hangup';
  tooltip = 'toolbar.hangup';

  /**
   * Initializes a new HangupButton instance.
   *
   * @param {Props} props - The read-only properties with which the new
   * instance is to be initialized.
   */
  constructor(props: Props) {
    super(props);
    this._hangup = async () => {
      try {
        global.conferenceTimerStart = false;
        const callId = await AsyncStorage.getItem('activeCallUUID');
        AsyncStorage.removeItem('activeCallUUID');
        if (callId && Platform.OS == 'ios') {
          RNCallKeep.endCall(callId);
          RNCallKeep.reportEndCallWithUUID(callId, 6);
        }
        const othersJSON = await CacheStore.get('activeCallOthers');
        const others = JSON.parse(othersJSON);
        APIService('users/pushmessage/', {
          users: others,
          //message: 'Missed call',
          extra: {
            type: 'hangup',
            callUUID: callId,
          },
        });
        /*APIService('users/voipcall/', {
          users: others,
          callUUID: callId,
          message: 'hangup',
        });*/
      } catch (error) {}
      if (global.stopRingingTone) {
        global.stopRingingTone();
        global.stopRingingTone = false;
      }
      this.props.dispatch(appNavigate('disconnect'));
    };
    global.hangup = () => {
      this._hangup();
    };
  }

  /**
   * Helper function to perform the actual hangup action.
   *
   * @override
   * @protected
   * @returns {void}
   */
  _doHangup() {
    this._hangup();
  }
}

export default translate(connect()(HangupButton));

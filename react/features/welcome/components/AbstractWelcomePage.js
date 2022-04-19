// @flow

import { generateRoomWithoutSeparator } from '@jitsi/js-utils/random';
import { Component } from 'react';
import type { Dispatch } from 'redux';

import { createWelcomePageEvent, sendAnalytics } from '../../analytics';
import { appNavigate } from '../../app/actions';
import isInsecureRoomName from '../../base/util/isInsecureRoomName';
import { isCalendarEnabled } from '../../calendar-sync';
import { isRecentListEnabled } from '../../recent-list/functions';
import {getFeatureFlag} from '../../base/flags/functions';
/**
 * {@code AbstractWelcomePage}'s React {@code Component} prop types.
 */
type Props = {

    /**
     * Whether the calendar functionality is enabled or not.
     */
    _calendarEnabled: boolean,

    /**
     * Whether the insecure room name functionality is enabled or not.
     */
    _enableInsecureRoomNameWarning: boolean,

    /**
     * URL for the moderated rooms microservice, if available.
     */
    _moderatedRoomServiceUrl: ?string,

    /**
     * Whether the recent list is enabled
     */
    _recentListEnabled: Boolean,

    /**
     * Room name to join to.
     */
    _room: string,

    /**
     * The current settings.
     */
    _settings: Object,

    /**
     * The Redux dispatch Function.
     */
    dispatch: Dispatch<any>
};

/**
 * Base (abstract) class for container component rendering the welcome page.
 *
 * @abstract
 */
export class AbstractWelcomePage extends Component<Props, *> {
    _mounted: ?boolean;

    /**
     * Implements React's {@link Component#getDerivedStateFromProps()}.
     *
     * @inheritdoc
     */
    static getDerivedStateFromProps(props: Props, state: Object) {
        return {
            room: props._room || state.room
        };
    }

    /**
     * Save room name into component's local state.
     *
     * @type {Object}
     * @property {number|null} animateTimeoutId - Identifier of the letter
     * animation timeout.
     * @property {string} generatedRoomname - Automatically generated room name.
     * @property {string} room - Room name.
     * @property {string} roomPlaceholder - Room placeholder that's used as a
     * placeholder for input.
     * @property {nubmer|null} updateTimeoutId - Identifier of the timeout
     * updating the generated room name.
     */
    state = {
        animateTimeoutId: undefined,
        generatedRoomname: '',
        insecureRoomName: false,
        joining: false,
        room: '',
        roomPlaceholder: '',
        updateTimeoutId: undefined
    };

    /**
     * Initializes a new {@code AbstractWelcomePage} instance.
     *
     * @param {Props} props - The React {@code Component} props to initialize
     * the new {@code AbstractWelcomePage} instance with.
     */
    constructor(props: Props) {
        super(props);
        this._onJoin = this._onJoin.bind(this);
    }

    /**
     * Implements React's {@link Component#componentDidMount()}. Invoked
     * immediately after mounting occurs.
     *
     * @inheritdoc
     */
    componentDidMount() {
        this._mounted = true;
        
        if (!global.disconnected) {
            this._onJoin();
        } else {
            global.disconnected = false;
        }
    }

    /**
     * Implements React's {@link Component#componentWillUnmount()}. Invoked
     * immediately before this component is unmounted and destroyed.
     *
     * @inheritdoc
     */
    componentWillUnmount() {
        global.disconnected = false;
        this._mounted = false;
    }

    _onJoin: () => void;

    /**
     * Handles joining. Either by clicking on 'Join' button
     * or by pressing 'Enter' in room name input field.
     *
     * @protected
     * @returns {void}
     */
    _onJoin() {
        const room = this.state.room || this.state.generatedRoomname;
        //console.error(room);
        sendAnalytics(
            createWelcomePageEvent('clicked', 'joinButton', {
                isGenerated: !this.state.room,
                room
            }));

        if (room) {
            this.setState({ joining: true });

            // By the time the Promise of appNavigate settles, this component
            // may have already been unmounted.
            const onAppNavigateSettled
                = () => this._mounted && this.setState({ joining: false });

            this.props.dispatch(appNavigate(room))
                .then(onAppNavigateSettled, onAppNavigateSettled);
        }
    }
}

/**
 * Maps (parts of) the redux state to the React {@code Component} props of
 * {@code AbstractWelcomePage}.
 *
 * @param {Object} state - The redux state.
 * @protected
 * @returns {Props}
 */
export function _mapStateToProps(state: Object) {
    return {
        _calendarEnabled: isCalendarEnabled(state),
        _enableInsecureRoomNameWarning: state['features/base/config'].enableInsecureRoomNameWarning || false,
        _moderatedRoomServiceUrl: state['features/base/config'].moderatedRoomServiceUrl,
        _recentListEnabled: isRecentListEnabled(),
        _room: state['features/base/flags'].room,
        _settings: state['features/base/settings']
    };
}

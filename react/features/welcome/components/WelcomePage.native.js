import React from 'react';
import {
    View
} from 'react-native';

import { ColorSchemeRegistry } from '../../base/color-scheme';
import { translate } from '../../base/i18n';
import { MEDIA_TYPE } from '../../base/media';
import { connect } from '../../base/redux';
import {
    createDesiredLocalTracks,
    destroyLocalDesktopTrackIfExists,
    destroyLocalTracks
} from '../../base/tracks';

import {
    AbstractWelcomePage,
    _mapStateToProps as _abstractMapStateToProps
} from './AbstractWelcomePage';

/**
 * The native container rendering the welcome page.
 *
 * @extends AbstractWelcomePage
 */
class WelcomePage extends AbstractWelcomePage {

    /**
     * Implements React's {@link Component#componentDidMount()}. Invoked
     * immediately after mounting occurs. Creates a local video track if none
     * is available and the camera permission was already granted.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount() {
        super.componentDidMount();


        const { dispatch } = this.props;

        if (this.props._settings.startAudioOnly) {
            dispatch(destroyLocalTracks());
        } else {
            dispatch(destroyLocalDesktopTrackIfExists());

            // Make sure we don't request the permission for the camera from
            // the start. We will, however, create a video track iff the user
            // already granted the permission.
            navigator.permissions.query({ name: 'camera' }).then(response => {
                response === 'granted'
                    && dispatch(createDesiredLocalTracks(MEDIA_TYPE.VIDEO));
            });
        }
    }

    /**
     * Implements React's {@link Component#render()}. Renders a prompt for
     * entering a room name.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return <View></View>;
    }
}

/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @returns {Object}
 */
function _mapStateToProps(state) {
    return {
        ..._abstractMapStateToProps(state),
        _headerStyles: ColorSchemeRegistry.get(state, 'Header')

        // _reducedUI: state['features/base/responsive-ui'].reducedUI
    };
}

export default translate(connect(_mapStateToProps)(WelcomePage));

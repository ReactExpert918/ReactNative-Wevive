import React from 'react';
import { StyleSheet } from 'react-native';
import Video from 'react-native-video-controls';

export const VideoPlayer = ({url, style}) => {
    return <Video source={{uri: url}}   // Can be a URL or a local file.
        //onBuffer={this.onBuffer}                // Callback when remote video is buffering
        //onError={this.videoError}               // Callback when video cannot be loaded
        style={style}
        controls={true}
        repeat={true}
        disableBack={true}
        disableFullscreen={true}
        disableVolume={true}
    />;
}
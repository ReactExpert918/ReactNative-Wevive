import React from 'react';
import { VlCPlayerView } from '@nghinv/react-native-vlc';
export const VideoPlayer = ({url, style}) => {
    return <VlCPlayerView
        url={url}
        showBack={false}
        showLeftButton={false}
        style={style}
    />
}
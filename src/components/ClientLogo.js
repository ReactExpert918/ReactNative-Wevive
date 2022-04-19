import React from 'react';
import {ImageBackground} from 'react-native';

import {logo} from '../../globals';

export default function ClientLogo(props) {
  return (
    <ImageBackground
      style={props.style}
      imageStyle={props.imageStyle}
      source={logo}
    />
  );
}

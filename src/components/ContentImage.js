import React, { Component } from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
} from 'react-native';

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from "react-native-responsive-dimensions";


export default class extends Component {
  state = {
    styles: StyleSheet.create({
      imageStyles: {
        position:"absolute", 
        flex: 1,
        height: responsiveHeight(40), 
        width: responsiveWidth(90),
        left: responsiveWidth(5),
      },
      wrapperStyles: {
        width: responsiveWidth(90),
        height: responsiveHeight(40),
      }
    })
  };
  render() {
    return (
        <View style={this.state.styles.wrapperStyles}>
          <Image style={this.state.styles.imageStyles}
            source={this.props.source}
            resizeMode="contain"
          />
        </View>
    );
  }
}
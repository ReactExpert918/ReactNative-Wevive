import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from "react-native-responsive-dimensions";
import {colors} from '../../app.json';
export default class extends Component {
  state = {
    styles: StyleSheet.create({
      content: {
        marginTop: responsiveWidth(2.5),
        marginBottom: responsiveWidth(2.5),
        marginHorizontal: this.props.noMargin ? 0 : responsiveWidth(2),
        padding: responsiveWidth(2.5),
        backgroundColor: "white",
        justifyContent: "center",
        position: "relative",
        flex: 1,
        zIndex: 0,
      }
    })
  };
  render() {
    return (
        <View style={this.state.styles.content}>
          {this.props.children}
        </View>
    );
  }
}
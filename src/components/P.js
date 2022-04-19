import React, { Component } from 'react';
import {
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
import {colors} from "../../app.json";
export default class extends Component {
  state = {
    styles: StyleSheet.create({
      P: {
        fontSize: responsiveFontSize(1.75),
        color: colors.textMain,
      },
      PBox: {
        marginTop:responsiveHeight(0.5),
        marginBottom:responsiveHeight(0.5),
      },
    })
  };
  render() {
    var textStyles = {...this.state.styles.P};
    if (this.props.strong !== undefined) {
      //textStyles['fontFamily'] = "Adelle-Bold";
    }
    if (this.props.center !== undefined) {
      textStyles['textAlign'] = "center";
    }
    return (
      <View style={this.state.styles.PBox}>
        <Text style={textStyles}>{this.props.children}</Text>
      </View>
    );
  }
}
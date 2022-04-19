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
//import Icon from './Icon';

export default class extends Component {
  state = {
    styles: StyleSheet.create({
      arrowRightStyles: {
        position:"absolute",
        right: responsiveWidth(5),
      },
      linkStyles: {
        //fontFamily: "Adelle",
        marginLeft: responsiveWidth(5),
        marginRight: responsiveWidth(5),
        marginBottom: responsiveHeight(1.75),
        fontSize: responsiveFontSize(1.75),
      }
    })
  };
  render() {
    return (
      <View>
        <Text style={this.state.styles.linkStyles} onPress={() => { this.props.onPress ? this.props.onPress() : null }}>{this.props.children}</Text>
        <Image name="arrowright" style={this.state.styles.arrowRightStyles} size={responsiveFontSize(2)} color="#c4d968" onPress={() => { this.props.onPress ? this.props.onPress() : null }} />
      </View>
    );
  }
}
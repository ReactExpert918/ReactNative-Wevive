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


export default class extends Component {
  state = {
  };
  render() {
    return (
      <>
      <Text>{this.props.children}</Text>
      </>
    );
  }
}
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
import {colors} from "../../app.json";
export default class extends Component {
  state = {
    styles: StyleSheet.create({
      H1: {
        //fontFamily:"Adelle",
        color: colors.main,
        textAlign: "left",
        fontSize: responsiveFontSize(2.5),
        fontWeight: "600",
      },
      H1Box: {
        paddingLeft: responsiveWidth(0),
        marginTop:responsiveHeight(1),
        marginBottom:responsiveHeight(1),
      }
    })
  };
  render() {
    let textStyle = {...this.state.styles.H1};
    let showBorder = true;
    if (this.props.green !== undefined) {
      textStyle['color'] = "#02754a";
      showBorder = false;
    }
    
    return (
      <View style={this.state.styles.H1Box}>
        <Text style={textStyle}>{this.props.children}</Text>
        {showBorder ? <View style={this.state.styles.H1Border}></View> : null}
      </View>
    );
  }
}
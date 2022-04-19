import React from "react";
import { TouchableHighlight, Text,View,StyleSheet} from "react-native";

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from "react-native-responsive-dimensions";


import TouchableBackground from './TouchableBackground';

export default class TouchableButton extends React.Component {
constructor(props) {
    super(props);
    this.state = {
        pressed: false,
        styles: StyleSheet.create({
          buttonBox: {
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          },
          buttonWrapper: {
            marginTop:20,
            paddingTop:responsiveFontSize(0.5),
            paddingBottom:responsiveFontSize(0.5),
            backgroundColor:'#02754a',
            borderRadius: 5,
            width: responsiveWidth(50),
            paddingLeft:responsiveFontSize(2.5),
            paddingRight:responsiveFontSize(2.5),
            height:undefined,//responsiveHeight(3),
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            marginBottom:10,
          },
        
          touchedButtonWrapper: {
            marginTop:20,
            paddingTop:responsiveFontSize(0.5),
            paddingBottom:responsiveFontSize(0.5),
            backgroundColor:'#aeca2f',
            borderRadius: 5,
            width: responsiveWidth(50),
            paddingLeft:responsiveFontSize(2.5),
            paddingRight:responsiveFontSize(2.5),
            height:undefined,//responsiveHeight(3),
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            marginBottom:10,
          },
        
          buttonText:{
            color:'white',
            textAlign:'center',
            fontSize:responsiveFontSize(1.75),
            //fontFamily: "Adelle",
          },
        
          touchedButtonText:{
            color:'white',
            textAlign:'center',
            fontSize:responsiveFontSize(1.75),
            //fontFamily: "Adelle",
          }
        
        })
    };
}
render() {
    return (
        <View style={this.state.styles.buttonBox}>
          <TouchableBackground style={this.state.styles.buttonWrapper} touchedStyle={this.state.styles.touchedButtonWrapper} textStyle={this.state.styles.buttonText} touchedTextStyle={this.state.styles.touchedButtonText} onPress={() => this.props.onPress ? this.props.onPress() : null}>
          {this.props.title}
          </TouchableBackground>
        </View>
    );
}
}
import { Component } from 'react';
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
    styles: StyleSheet.create({
      container: {
          flex:1,
          alignItems:"center",
          textAlign:"center",
          alignContent:"center",
      },
      containerText: {
          //fontFamily:"Adelle",
      }
    })
  };
  text404 = "Page not found. Please try again later.";
  render() {
    return (
      <View style={this.state.styles.container}>
        <Text style={this.state.styles.containerText}>{text404}</Text>
      </View>
    );
  }
}
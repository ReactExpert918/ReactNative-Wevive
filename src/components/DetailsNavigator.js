import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity
} from 'react-native';

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from "react-native-responsive-dimensions";
//import Icon from './Icon';
import {useRoute} from '@react-navigation/native';
import {colors} from "../../app.json";
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
      },
      container: {
        backgroundColor: colors.headlineBackground,
      },
      innerContainer: {
        borderBottomColor: colors.textSecondary,
        borderBottomWidth: 1,
        padding: responsiveWidth(3),
        paddingHorizontal: responsiveWidth(5),
        marginHorizontal: responsiveWidth(5),
        justifyContent: "space-between",
        flexDirection: "row",
      },
      textContainer: {
        
      },  
      text: {
        color: colors.textSecondary,
        fontSize: responsiveFontSize(2.4),
        width: responsiveWidth(25),
        textAlign: "center",
      },
      textBackground: {
        backgroundColor: colors.contentBorder,
        width: "100%",
        position: "absolute",
        bottom: -responsiveWidth(3)-1,
        height: responsiveHeight(1.3),
      }
    })
  };
  render() {
    return (
      <View style={this.state.styles.container}>
        <View style={this.state.styles.innerContainer}>
          <TouchableOpacity onPress={()=>{
            this.props.navigation.navigate("Details");
          }}>
            <View style={this.state.styles.textContainer}>
              <Text style={this.state.styles.text}>Personal</Text>
              {this.props.route.name == 'Details' ? <View style={this.state.styles.textBackground}></View> : null}
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{
            this.props.navigation.navigate("ChangePhone");
          }}>
          <View style={this.state.styles.textContainer}>
            <Text style={this.state.styles.text}>Email</Text>
            {this.props.route.name == 'ChangePhone' ? <View style={this.state.styles.textBackground}></View> : null}
          </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{
            this.props.navigation.navigate("ChangePassword");
          }}>
          <View style={this.state.styles.textContainer}>
            <Text style={this.state.styles.text}>Password</Text>
            {this.props.route.name == 'ChangePassword' ? <View style={this.state.styles.textBackground}></View> : null}
          </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
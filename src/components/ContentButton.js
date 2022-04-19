import React, {Component} from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

export default class ContentButton extends Component {
  state = {
    styles: StyleSheet.create({
      ButtonStyle: {
        marginTop: 20,
        paddingTop:
          this.props.size == 'big'
            ? 10
            : responsiveFontSize(0.5),
        paddingBottom:
          this.props.size == 'big'
            ? 10
            : responsiveFontSize(0.5),
        marginLeft: 30,
        marginRight: 30,
        backgroundColor: 'black',
        borderRadius: this.props.borderRadius
          ? this.props.borderRadius
          : responsiveFontSize(0.5),
        width: null,
        paddingLeft: responsiveFontSize(2),
        paddingRight: responsiveFontSize(2),
        height: undefined, //responsiveHeight(3),
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        marginBottom: 10,
      },
      DisabledButtonStyle: {
        marginTop: 20,
        paddingTop:
          this.props.size == 'big'
            ? 10
            : responsiveFontSize(0.5),
        paddingBottom:
          this.props.size == 'big'
            ? 10
            : responsiveFontSize(0.5),
        marginLeft: 30,
        marginRight: 30,
        backgroundColor: '#444444',
        borderRadius: this.props.borderRadius
          ? this.props.borderRadius
          : responsiveFontSize(0.5),
        width: null,
        paddingLeft: responsiveFontSize(2),
        paddingRight: responsiveFontSize(2),
        height: undefined, //responsiveHeight(3),
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        marginBottom: 10,
      },
      TextStyle: {
        color: 'white',
        textAlign: 'center',
        fontSize:
          this.props.size == 'big'
            ? responsiveFontSize(2.25)
            : responsiveFontSize(1.4),
        //fontFamily: 'Adelle',
      },
      DisabledTextStyle: {
        color: '#fefefe',
        textAlign: 'center',
        fontSize:
          this.props.size == 'big'
            ? responsiveFontSize(2.25)
            : responsiveFontSize(1.4),
        //fontFamily: 'Adelle',
      },
    }),
  };
  render() {
    return (
      <TouchableOpacity
        style={
          !this.props.disabled
            ? this.state.styles.ButtonStyle
            : this.state.styles.DisabledButtonStyle
        }
        activeOpacity={0.5}
        onPress={() => {
          !this.props.disabled && this.props.onPress
            ? this.props.onPress()
            : null;
        }}>
        <Text
          style={
            !this.props.disabled
              ? this.state.styles.TextStyle
              : this.state.styles.DisabledTextStyle
          }>
          {this.props.title}
        </Text>
      </TouchableOpacity>
    );
  }
}

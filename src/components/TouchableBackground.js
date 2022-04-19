import React from "react";
import { Image, TouchableHighlight, Text,View,StyleSheet} from "react-native";

import Icon from './Icon';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from "react-native-responsive-dimensions";

export default class TouchableButton extends React.Component {
constructor(props) {
    super(props);
    this.state = {
        pressed: false
    };
}
render() {
    if (this.props.icon) {
      if (this.props.touchedIconSize) {
        var iconSize = this.state.pressed ? this.props.touchedIconSize : this.props.iconSize;
      } else {
        var iconSize = responsiveFontSize(1.5);
      }
      //iconSize = 15;
      var icon = <View style={this.props.iconWrapperStyle ? this.props.iconWrapperStyle : null}><Icon name={this.props.icon} size={iconSize} color={this.state.pressed ? "white" : this.props.iconColor} /></View>
    } else{
      var icon = null;
    }
    if (this.props.children) {
      var lb = "\n"; 
      var br = <Text>{lb}</Text>
    } else {
      var br = null;
    }
    return (
        <TouchableHighlight
            activeOpacity={1}
            underlayColor={this.props.touchedStyle.backgroundColor}
            onPress={() => {
              this.props.onPress ? this.props.onPress() : null;
            }}
            style={[
                this.state.pressed ? this.props.touchedStyle : this.props.style
            ]}
            onHideUnderlay={() => {
                this.setState({ pressed: false });
            }}
            onShowUnderlay={() => {
                this.setState({ pressed: true });
            }}
        >
        <>
        {icon}<View style={{flex:1, alignItems:"center"}}>
          <Text style={
                this.state.pressed ? this.props.touchedTextStyle : this.props.textStyle
            }>{this.props.children}</Text>
        </View>
        </>
        </TouchableHighlight>
    );
}
}
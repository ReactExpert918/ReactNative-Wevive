import {StyleSheet} from 'react-native';

import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
  } from 'react-native-responsive-dimensions';

import {colors} from "../../app.json";
const borderColor = colors.secondary;
const backgroundColor = colors.formBackground;
const color = colors.textMain;
const fontSize = responsiveFontSize(2.2);
const multilineFontSize = responsiveFontSize(1.8);
const padding = responsiveWidth(3.5);
const styles = keyboard => {
    return StyleSheet.create({
        inputStyle: {
            textAlign: 'left',
            fontSize: fontSize,
            padding: padding,
            marginTop: responsiveHeight(0),
            //fontFamily: 'Adelle',
            color: color,
        },
        searchInputStyle: {
            textAlign: 'left',
            fontSize: fontSize,
            padding: padding,
            paddingLeft: padding/2,
            marginTop: responsiveHeight(0),
            //fontFamily: 'Adelle',
            color: color,
            flex:1,
        },
        multilineInputStyle: {
            textAlign: 'left',
            height: responsiveHeight(20),
            fontSize: multilineFontSize,
            padding: padding,
            paddingTop: padding/0.9,
            marginTop: responsiveHeight(0),
            //fontFamily: 'Adelle',
            color: color,
        },
        inputContainerStyle: {
            marginVertical: padding/2,
            backgroundColor: backgroundColor,
            borderRadius: 30,
            borderWidth: 1,
            borderColor: borderColor,
            //alignItems: "center",
            flexDirection: "column",
            zIndex: 1,
            marginHorizontal: 10,
        },
        searchContainerStyle: {
            marginVertical: padding/2,
            backgroundColor: backgroundColor,
            borderRadius: 30,
            borderWidth: 1,
            borderColor: borderColor,
            //alignItems: "center",
            flexDirection: "row",
            width: responsiveWidth(75),
        },
        buttonContainerStyle: {
            marginVertical: padding,
            width: undefined,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            zIndex: 9,
        },
        errorStyle: {
            color: "white",
            paddingHorizontal: responsiveWidth(7)
        },
        text: {
            color: color,
            padding: padding,
            paddingVertical: padding/3,
        }
    });
}
export default styles;
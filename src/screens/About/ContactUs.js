import React, {Component} from 'react';
import {StyleSheet, Image, Text, View, ImageBackground} from 'react-native';
import ContentWrapper from '../../components/ContentWrapper';
import Content from '../../components/Content';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

import contentStyles from '../../styles/content';

const weviveWhiteLogo = require('../../images/PNG/logo-line.png');
export default class ContactUs extends Component {
  state = {
    contentStyles: contentStyles(),
  };
  render() {
    return (
      <ContentWrapper paddingHorizontal={0} details={
        <ImageBackground source={aboutbg} style={styles.aboutbg}>
          <ImageBackground resizeMode={"contain"} source={weviveWhiteLogo} style={styles.weviveWhiteLogo}/>
          <View><Text style={styles.aboutText}>"You cannot hope to build a better world without improving the individuals. To that end, each of us must work for his [or her] own improvement and,
at the same time, share a general responsibility for all humanity, our particular duty being to aid those to whom we think we can be most useful."
</Text></View>
          <View>
          <Text style={styles.aboutAuthor}>Marie Curie</Text>
          </View>
        </ImageBackground>
      }>
       
        <Content>
          <Text>Send all enquiries to support@wevive.com.</Text>
        </Content>
      </ContentWrapper>
    );
  }
}
const aboutbg = require('../../images/PNG/aboutbg.jpg');
const styles = StyleSheet.create({
  weviveWhiteLogo: {
    marginTop: responsiveWidth(5),
    width: responsiveWidth(100),
    height: responsiveWidth(15),
    alignSelf: "center",
  },
  aboutText: {
    marginTop: responsiveWidth(10),
    fontSize: responsiveFontSize(1.5),
    color: "white",
    fontWeight: "600",
    paddingHorizontal: responsiveWidth(15),
    textAlign: "center",
  },
  aboutAuthor: {
    marginTop: responsiveWidth(3),
    fontSize: responsiveFontSize(2.8),
    fontWeight: "600",
    color: "white",
    paddingHorizontal: 30,
    textAlign: "center",
  },
  aboutbg: {
    width: responsiveWidth(100),
    height: responsiveWidth(70),
  },
  header: {
    textAlign: 'center',
    fontSize: responsiveFontSize(3),
    fontWeight: '900',
    marginBottom: responsiveWidth(3),
  },
  description1: {
    textAlign: 'center',
    fontSize: responsiveFontSize(2),
    fontWeight: '900',
    marginBottom: responsiveWidth(5),
  },
  description2: {
    fontSize: responsiveFontSize(1.5),
    fontWeight: '400',
    marginBottom: responsiveWidth(1),
  },
  licenseBox: {
    paddingTop: responsiveWidth(3),
    paddingHorizontal: responsiveWidth(3),
  },
  licenseElement: {
    marginBottom: responsiveWidth(5),
  },
  licenseLink: {
    fontWeight: '400',
    textDecorationLine: 'underline',
    fontSize: responsiveFontSize(1.4),
  },
  licenseName: {
    fontWeight: '900',
    fontSize: responsiveFontSize(1.7),
  },
  licenseCopyright: {
    fontWeight: '500',
    fontSize: responsiveFontSize(1.3),
  },
  licenseText: {},
});

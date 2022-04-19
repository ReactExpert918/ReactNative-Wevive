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
export default class About extends Component {
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
          <Text>We all need inspiration from time to time, as it helps us see new possibilities in ourselves and the world. We believe the best inspiration comes from us acknowledging our positive actions, however small, and sharing it with each other. We sometimes forget that what we do matters, and by sharing it with others, it provides motivation and affirmation to us all.</Text> 
          <Text>Our mission is to accelerate the world’s transition to a better planet.</Text>
          <Text>Bringing a positive change to technology and our communities is ambitious. But it is through collaboration and collective action that this can be achieved.</Text>
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

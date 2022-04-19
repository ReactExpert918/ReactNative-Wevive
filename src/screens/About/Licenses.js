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
import licenses from '../../../licenses.json';
const defaultISCLicense = `
Copyright <YEAR> <OWNER>

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.`;

const defaultMITLicense = `Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.`;
const weviveWhiteLogo = require('../../images/PNG/logo-line.png');
export default class About extends Component {
  state = {
    contentStyles: contentStyles(),
    licenseKey: null,
  };
  getCopyright(license) {
    if (!license.licenseFile || license.licenseFile.indexOf('README.md') > 0) {
      return `Copyright (c) ${license.publisher}`;
    } else {
      if (license.copyright) {
        const copyright = license.copyright.replace(/Permission .*/gi, '');
        return copyright;
      } else {
        return `Copyright (c) ${license.publisher}`;
      }
    }
  }

  getLicenseText(license) {
    if (license.licenseFile.indexOf('README.md') > 0) {
      if (license.licenses == 'MIT') {
        return `
    MIT License 
    Copyright (c) ${license.publisher}
    ${defaultMITLicense}`;
      } else if (license.licenses == 'ISC') {
        return `
    ISC License 
    Copyright (c) ${license.publisher}
    ${defaultISCLicense}`;
      }
    } else {
      return license.licenseText;
    }
  }
  renderLicenses() {
    return Object.keys(licenses).map((element, licenseKey) => {
      return (
        <View style={styles.licenseElement}>
          <Text style={styles.licenseName}>{licenses[element].name}</Text>
          <Text style={styles.licenseCopyright}>
            {this.getCopyright(licenses[element])}
          </Text>
          {this.state.licenseKey == licenseKey ? (
            <Text style={styles.licenseText}>
              {this.getLicenseText(licenses[element])}
            </Text>
          ) : (
            <Text
              style={styles.licenseLink}
              onPress={() => {
                this.setState({licenseKey});
              }}>
              Show license
            </Text>
          )}
        </View>
      );
    });
  }
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
          
          {this.renderLicenses()}
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

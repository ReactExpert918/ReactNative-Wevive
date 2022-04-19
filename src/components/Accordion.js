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

import Accordion from 'react-native-collapsible/Accordion';
//import Icon from './Icon';

export default class extends Component {
  constructor() {
    super();
    this.state = {
      activeSections: [],
      styles: StyleSheet.create({
        headerStyle: {
          marginLeft: responsiveWidth(5),
          marginRight: responsiveWidth(5),
          borderBottomWidth: 1,
          borderBottomColor: "green",
          marginBottom: responsiveHeight(2),
          paddingBottom: 10,
        },
        headerBiggerTextStyle: {
          //fontFamily: "Adelle",
          fontSize: responsiveFontSize(2),
        },
        headerTextStyle: {
          //fontFamily: "Adelle",
          fontSize: responsiveFontSize(1.75),
        },
        arrowClosedStyles: {
          position:"absolute",
          right: 0,
          transform: [{ rotate: '-90deg'}],
        },
        arrowOpenStyles: {
          position:"absolute",
          right: 0,
          transform: [{ rotate: '90deg'}],
        },
        contentStyle: {
          marginBottom: responsiveHeight(2),
        }
      });
    };
  }
  
  _renderSectionTitle = section => {
    return null;
  };
  
  _renderHeader = (section, index, isActive, sections) => {
    if (section.type == 'links') {
      var style = "headerBiggerTextStyle";
    } else {
      var style = "headerTextStyle";
    }
    return (
      <View style={this.state.styles.headerStyle}>
        <Text style={this.state.styles[style]}>{section.title.props.children}</Text>
        <Image name="arrowright" style={isActive ? this.state.styles.arrowClosedStyles : this.state.styles.arrowOpenStyles} size={responsiveFontSize(2.5)} color="#02754a" />
      </View>
    );
  };

  _renderContent = section => {
    return section.content ? (
      <View style={this.state.styles.contentStyle}>
        {section.content}
      </View>
    ) : null;
  };

  _updateSections = newActiveSections => {
    var activeSections = this.state.activeSections;
    if (this.props.scrollToEnd) {
      setTimeout(() => {
        global.contentScrollView.scrollToEnd();
      },100);
    }
    this.setState({activeSections:newActiveSections});
  };

  render() {
    var SECTIONS = [];
    var childrenLength = this.props.children.length;
    if (this.props.type == 'content') {
      for (var i=0;i<childrenLength/2;i++) {
        SECTIONS.push({
          title: this.props.children[2*i],
          content: this.props.children[2*i+1],
          type: this.props.type,
        });
      }
    } else {
      var content = [];
      for (var i=1;i<childrenLength;i++) {
        content.push(this.props.children[i]);
      }
      SECTIONS.push({
        title: this.props.children[0],
        content: content,
        type: this.props.type,
      });
    }
    return (
      <View style={this.state.styles.headlineWrapperStyles}>
        <Accordion
          sections={SECTIONS}
          activeSections={this.state.activeSections}
          renderSectionTitle={this._renderSectionTitle}
          renderHeader={this._renderHeader}
          renderContent={this._renderContent}
          onChange={this._updateSections}
          underlayColor="rgba(0,0,0,0)"
          align="bottom"
        />
      </View>
    );
  }
}
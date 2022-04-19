import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
//import Icon from './Icon';
//import {useRoute} from '@react-navigation/native';
import {colors} from '../../app.json';
export default class extends Component {
  render() {
    const lottery = this.props.route.params.lottery;
    return (
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <TouchableOpacity onPress={()=>{
            this.props.navigation.navigate('LotteryDetails',{lottery});
          }}>
            <View style={styles.textContainer}>
              <Text style={styles.text}>Details</Text>
              {this.props.route.name === 'LotteryDetails' ? <View style={styles.textBackground} /> : null}
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{
            this.props.navigation.navigate('LotteryPrizes',{lottery});
          }}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>{lottery.status === 'closed' ? 'Winners' : 'Prizes'}</Text>
            {this.props.route.name === 'LotteryPrizes' ? <View style={styles.textBackground} /> : null}
          </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{
            this.props.navigation.navigate('LotteryTickets',{lottery});
          }}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>Tickets</Text>
            {this.props.route.name === 'LotteryTickets' ? <View style={styles.textBackground} /> : null}
          </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  arrowRightStyles: {
    position:'absolute',
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
    borderBottomColor: colors.secondaryBackground,
    borderBottomWidth: 1,
    padding: responsiveWidth(3),
    paddingHorizontal: responsiveWidth(5),
    marginHorizontal: responsiveWidth(5),
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  textContainer: {

  },
  text: {
    color: colors.headerText,
    fontSize: responsiveFontSize(2.4),
    width: responsiveWidth(25),
    textAlign: 'center',
  },
  textBackground: {
    backgroundColor: colors.contentBorder,
    width: '100%',
    position: 'absolute',
    bottom: -responsiveWidth(3) - 1,
    height: responsiveHeight(1.3),
  },
});
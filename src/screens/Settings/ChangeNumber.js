import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ContentWrapper from '../../components/ContentWrapper';
import Content from '../../components/Content';
import Icon from '../../components/Icon';
import {
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';


export default class ChangeNumber extends Component {
  render() {
    return (
      <>
        <View style={styles.phones}>
          <Icon
            name={'blue'}
            size={responsiveFontSize(30)}
            style={styles.phoneLeft}
          />
          <View style={styles.arrows}>
            <Icon
              name={'arrowdotted'}
              size={responsiveFontSize(7)}
              style={styles.arrowLeft}
            />
            <Icon
              name={'arrowdotted'}
              size={responsiveFontSize(7)}
              style={styles.arrowRight}
            />
          </View>
          <Icon
            name={'blue'}
            size={responsiveFontSize(30)}
            style={styles.phoneRight}
          />
        </View>
        <Text style={styles.text}>
          Use Change Number to migrate your account info,
          groups and settings from your current phone number
          to a new phone number. You can’t undo this change.
        </Text>
        <Text style={styles.text}>
          To proceed, confirm that your new number can receive
          SMS or calls and tap Next to verify that number.
        </Text>
      </>
    );
  }
}
const styles = StyleSheet.create({
  text: {
    paddingHorizontal: responsiveWidth(3),
    marginVertical: responsiveWidth(2.5),
    fontSize: responsiveFontSize(2),
  },
  arrows: {
    marginVertical: responsiveWidth(15),
    left: -responsiveWidth(4),
  },
  phones: {
    marginVertical: responsiveWidth(10),
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: responsiveWidth(10),
  },
  arrowLeft: {
    transform: [{scaleX: -1}],
    width: responsiveWidth(10),
    left: -7,
    marginBottom: 10,
  },
  arrowRight: {},
  phoneLeft: {
    color: 'rgb(230,142,67)',
    flex: 1,
  },
  phoneRight: {
    color: 'rgb(75,189,163)',
  },
});

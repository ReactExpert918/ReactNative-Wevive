import React, {Fragment, Component, useContext} from 'react';
import {Text, Image, View} from 'react-native';
import * as yup from 'yup';
import {Formik} from 'formik';
import Button from '../../components/Button';
import authStyles from '../../styles/auth';

import APIService from '../../service/APIService';
import AuthView from '../../views/AuthView';

import {CommonActions} from '@react-navigation/native';

export default class VerificationSuccess extends Component {
  navigateSuccess = () => {
    this.props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {name: 'EULAScreen', params: {user: this.props.route.params.user}},
        ],
      }),
    );
  };
  render() {
    const {navigate} = this.props.navigation;
    return (
      <AuthView
        headline={'Verify your phone number'}
        route={this.props.route}
        navigation={this.props.navigation}>
        <View>
          <Text style={styles.pageHeadlineStyle}>Congratulations!</Text>
          <Text style={styles.pageHeadlineStyle}>
            Your number is now verified
          </Text>
          <Image
            source={require('../../images/PNG/smiley.png')}
            style={styles.smileyIcon}
          />
          <View style={styles.buttonContainerStyle}>
            <Button onPress={this.navigateSuccess} title="NEXT" />
          </View>
        </View>
      </AuthView>
    );
  }
}

const styles = authStyles();

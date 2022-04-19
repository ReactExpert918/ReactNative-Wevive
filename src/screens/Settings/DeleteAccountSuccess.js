import React, {Fragment, Component, useContext} from 'react';
import {Text, TextInput, View, ImageBackground} from 'react-native';
import * as yup from 'yup';
import {Formik} from 'formik';
import Button from '../../components/Button';
import authStyles from '../../styles/auth';

import APIService from '../../service/APIService';
import AuthView from '../../views/AuthView';
import {AuthContext} from '../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default class ChangeNumberVerification extends Component {
  navigateSuccess = () => {
    AsyncStorage.removeItem('sessionToken');
    AsyncStorage.removeItem('userToken');
    AsyncStorage.removeItem('password_sha512');
    this.props.navigation.navigate('Auth', {
      screen: 'SignIn',
      params: {
        BioID: false,
      },
    });
  };
  render() {
    const {navigate} = this.props.navigation;
    return (
      <AuthView
        noHeader
        headline={'Security'}
        route={this.props.route}
        navigation={this.props.navigation}>
        <Formik
          initialValues={{
            pin: '',
          }}
          onSubmit={(values, actions) => {
            this.navigateSuccess();
          }}
          validationSchema={yup.object().shape({
            //email: yup.string().email().required(),
          })}>
          {({
            values,
            handleChange,
            errors,
            setFieldTouched,
            touched,
            isValid,
            handleSubmit,
            setFieldValue,
          }) => (
            <AuthContext.Provider
            value={{
              styles: styles,
              values,
              handleChange,
              errors,
              setFieldTouched,
              touched,
              isValid,
              handleSubmit,
              setFieldValue,
            }}>
              <Text style={styles.pageHeadlineStyle}>Account deleted</Text>
              <View style={styles.buttonContainerStyle}>
                <Button onPress={handleSubmit} title="Log out" />
              </View>
            </AuthContext.Provider>
          )}
        </Formik>
      </AuthView>
    );
  }
}

const styles = authStyles();

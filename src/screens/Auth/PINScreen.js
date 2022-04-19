import React, {Fragment, Component, useContext} from 'react';
import {Text, TextInput, View} from 'react-native';
import * as yup from 'yup';
import {Formik} from 'formik';
import Button from '../../components/Button';
import authStyles from '../../styles/auth';

import APIService from '../../service/APIService';
import AuthView from '../../views/AuthView';

import {CommonActions} from '@react-navigation/native';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import trans from '../../utils/trans';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class PINScreen extends Component {
  navigateSuccess = () => {
    const user = this.props.route.params.user;
    AsyncStorage.setItem('userToken', user.access_token);
    AsyncStorage.setItem('refreshToken', user.refresh_token);
    if (!user.avatar) {
      this.props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'AvatarScreen'}],
        }),
      );
    } else {
      this.props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'NotificationsScreen'}],
        }),
      );
    }
  };
  makeid = (length) => {
    var result = '';
    var characters = '0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };
  render() {
    const rand = this.makeid(6);
    const {navigate} = this.props.navigation;
    return (
      <AuthView
        headline={'Security'}
        route={this.props.route}
        navigation={this.props.navigation}>
        <Formik
          initialValues={{
            pin: '',
          }}
          onSubmit={(values, actions) => {
            global.appIsLoading();
            APIService(
              'users/savePIN/',
              {
                pin: values.pin,
              },
              0,
              this.props.route.params.user.access_token,
            ).then((result) => {
              global.appIsNotLoading();
              if (result.success) {
                this.navigateSuccess();
              } else {
                actions.setFieldError('pin', 'Failed to save PIN.');
              }
            });
          }}
          validationSchema={yup.object().shape({
            //email: yup.string().email().required(),
            pin: yup.string().min(6).required(), //.oneOf([rand, null], trans('auth.password_must_match')),
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
            <>
              <Text style={styles.pageHeadlineStyle}>Create your PIN!</Text>
              <Text style={styles.pageTextStyle}>
                Your PIN keeps your information safe and accessible to you in
                case you need to reinstall Wevive.
              </Text>
              <Text style={styles.pageTextStyle}>
                Please enter it below to continue.
              </Text>
              <SmoothPinCodeInput
                codeLength={6}
                containerStyle={styles.cellInputStyle}
                cellStyle={styles.cellStyle}
                cellStyleFocused={styles.cellStyleFocused}
                value={values.pin}
                onTextChange={handleChange('pin')}
                inputProps={{textContentType: 'none', keyboardType: 'numeric'}}
                password={true}
                restrictToNumbers={true}
              />
              {values.pin.length > 0 && !errors.pin && (
                <View style={styles.buttonContainerStyle}>
                  <Button onPress={handleSubmit} title="NEXT" />
                </View>
              )}
              {!!errors.pin && (
                <View style={styles.buttonContainerStyle}>
                  <Button onPress={this.props.navigation.goBack} title="BACK" />
                </View>
              )}
            </>
          )}
        </Formik>
      </AuthView>
    );
  }
}

const styles = authStyles();

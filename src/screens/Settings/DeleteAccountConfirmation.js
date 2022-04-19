import React, {Fragment, Component, useContext} from 'react';
import {Text, TextInput, View, ImageBackground} from 'react-native';
import * as yup from 'yup';
import {Formik} from 'formik';
import Button from '../../components/Button';
import authStyles from '../../styles/auth';

import AuthView from '../../views/AuthView';

import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import {AuthContext} from '../../context/AuthContext';
export default class ChangeNumberVerification extends Component {
  navigateSuccess = () => {
    this.props.navigation.navigate('DeleteAccountSuccess');
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
            pin: yup
              .string()
              .min(6)
              .required(),
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
              <Text style={styles.pageHeadlineStyle}>Enter the verification code</Text>
              <Text style={styles.pageTextStyle}>
                Please enter the verification number that you received.
              </Text>
              <SmoothPinCodeInput
                codeLength={6}
                containerStyle={styles.cellInputStyle}
                cellStyle={styles.cellStyle}
                cellStyleFocused={styles.cellStyleFocused}
                value={values.pin}
                onTextChange={handleChange('pin')}
              />
              {values.pin.length > 0 && !errors.pin && (
                <View style={styles.buttonContainerStyle}>
                  <Button onPress={handleSubmit} title="Delete my account" />
                </View>
              )}
            </AuthContext.Provider>
          )}
        </Formik>
      </AuthView>
    );
  }
}

const styles = authStyles();

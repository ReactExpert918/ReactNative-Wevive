import React, {Fragment, Component} from 'react';
import {
  Image,
  SafeAreaView,
  Text,
  TextInput,
  StyleSheet,
  View
} from 'react-native';

import * as yup from 'yup';
import {Formik} from 'formik';
import Button from '../../components/Button';
import styles from '../../styles/auth';
import APIService from '../../service/APIService';
import AuthView from '../../views/AuthView';
const defaultMessage = 'Enter your new password';
export default class ResetPassword extends Component {
  state = {
    message: defaultMessage,
    styles: styles(),
  };
  render() {
    const {navigate} = this.props.navigation;
    return (
      <AuthView navigation={this.props.navigation}>
        <Text style={this.state.styles.headlineStyle}>{this.state.message}</Text>
        <Formik
          initialValues={{ password: ''}}
          onSubmit={(values, actions) => {
            global.appIsLoading();
            APIService('users/password_reset/confirm/', {
              password: values.password,
              confirm_password: values.password,
              token: this.props.route.params?.token ?? '',
            }).then((result) => {
              global.appIsNotLoading();
              if (result) {
                if (result.success) {
                  navigate('SignIn', {
                    email: this.props.route.params?.email ?? '',
                    message: result.status,
                  });
                } else {
                  if (result.errors) {
                    if (result.errors.password) {
                      actions.setFieldError(
                        'password',
                        result.errors.password[0]
                      );
                    }
                  } else if (result.fields) {
                    if (result.fields.email) {
                      actions.setFieldError('password', result.fields.email);
                    }
                  }
                  this.state.message = defaultMessage;
                }
              } else {
                actions.setFieldError('email', 'Email not found.');
                this.state.message = defaultMessage;
              }
            });
          }}
          validationSchema={yup.object().shape({
            password: yup.string().min(8).required(),
            password_confirmation: yup
              .string()
              .required()
              .oneOf([yup.ref('password'), null], 'Passwords must match')
          })}>
          {({
            values,
            handleChange,
            errors,
            setFieldTouched,
            touched,
            isValid,
            handleSubmit,
          }) => (
            <View>
              <View style={this.state.styles.inputContainerStyle}>
                <TextInput
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={() => setFieldTouched('password')}
                  placeholder="Password"
                  style={this.state.styles.inputStyle}
                  name="password"
                  password={true}
                  secureTextEntry={true}
                  placeholderTextColor={this.state.styles.inputStyle.color}
                  autoCapitalize="none"
                  testID="password"
                  accessibilityLabel="Password"
                  accessible
                />
              </View>
              {touched.password && errors.password && (
                <Text style={this.state.styles.errorStyle}>{errors.password}</Text>
              )}
              <View style={this.state.styles.inputContainerStyle}>
                <TextInput
                  value={values.password_confirmation}
                  onChangeText={handleChange('password_confirmation')}
                  onBlur={() => setFieldTouched('password_confirmation')}
                  placeholder="Confirm password"
                  style={this.state.styles.inputStyle}
                  name="password_confirmation"
                  password={true}
                  secureTextEntry={true}
                  placeholderTextColor={this.state.styles.inputStyle.color}
                  autoCapitalize="none"
                  testID="passwordconfirmation"
                  accessibilityLabel="Password Confirmation"
                  accessible
                />
              </View>
              {touched.password_confirmation &&
                errors.password_confirmation && (
                  <Text style={this.state.styles.errorStyle}>
                    {errors.password_confirmation}
                  </Text>
                )}
              <View style={this.state.styles.buttonContainerStyle}>
                <Button onPress={handleSubmit} title="Submit" />
              </View>
            </View>
          )}
        </Formik>
        <Text
          style={{...styles.footerStyle, ...styles.linkStyle}}
          onPress={() => navigate('SignIn')}>
          Back to Login
        </Text>
      </AuthView>
    );
  }
}

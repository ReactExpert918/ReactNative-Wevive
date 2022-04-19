import React, {Fragment, Component} from 'react';
import {
  Image,
  SafeAreaView,
  Text,
  TextInput,
  StyleSheet,
  ImageBackground,
  View,
  TouchableOpacity,
} from 'react-native';
import ClientLogo from '../../components/ClientLogo';
import * as yup from 'yup';
import {Formik} from 'formik';
import Button from '../../components/Button';
import styles from '../../styles/auth';
import APIService from '../../service/APIService';
import AuthView from '../../views/AuthView';

const defaultMessage = 'Enter your E-mail address below to reset your Password';
const tick = null;
const mainHeadline = "RESET PASSWORD";
export default class ForgotPassword extends Component {
  state = {
    message: defaultMessage,
    success: false,
    styles: styles()
  };
  render() {
    const {navigate} = this.props.navigation;
    return (
      <AuthView navigation={this.props.navigation}>
        <View style={this.state.styles.mainLogoContainerStyle}>
          <ClientLogo style={this.state.styles.mainLogoStyle}
            imageStyle={this.state.styles.mainLogoImageStyle}
          />
        </View>
        <Text style={this.state.styles.mainHeadlineStyle}>
          {mainHeadline}
        </Text>
        {this.state.success ? 
          <>
            <Image source={tick} style={this.state.styles.tick} />
            <View style={this.state.styles.bigHeadline}>
              <Text style={this.state.styles.bigHeadlineText}>Email Sent</Text>
            </View>
            <Text style={this.state.styles.successText}>If your email account has been registered you should receive a notification shortly.</Text>
            <TouchableOpacity onPress={() => navigate("SignIn")} style={this.state.styles.blackButton}>
              <Text style={this.state.styles.blackButtonText}>OK</Text>
            </TouchableOpacity>
          </>
        : null}
        {this.state.message == defaultMessage && !this.state.success &&
          <>
            <Text style={this.state.styles.headlineStyle}>
              {this.state.message}
            </Text>
        <Formik
          initialValues={{email: ''}}
          onSubmit={(values, actions) => {
            global.appIsLoading();
            APIService('users/password_reset/', {
              email: values.email
            }).then((result) => {
              global.appIsNotLoading();
              if (result) {
                if (result.status) {
                  this.setState({message: result.status, success: true});
                }
              } else {
                actions.setFieldError('email', 'Email not found.');
                this.state.message = defaultMessage;
              }
            });
          }}
          validationSchema={yup.object().shape({
            email: yup.string().email().required(),
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
            <View>
              <View style={this.state.styles.inputContainerStyle}>
                <TextInput
                  value={values.email}
                  onChangeText={email => setFieldValue('email', email.trim())}
                  onBlur={() => setFieldTouched('email')}
                  placeholder="Email"
                        style={this.state.styles.inputStyle}
                        placeholderTextColor={this.state.styles.inputStyle.color}
                  name="email"
                  autoCapitalize="none"
                  testID="email"
                  accessibilityLabel="email"
                  textContentType="emailAddress"
                  accessible
                />
              </View>
              {touched.email && errors.email && (
                <Text style={this.state.styles.errorStyle}>{errors.email}</Text>
              )}
              <View style={this.state.styles.buttonContainerStyle}>
                <Button onPress={handleSubmit} title="Submit" />
              </View>
            </View>
          )}
          </Formik>
          <Text
            style={{
              ...this.state.styles.footerStyle,
              ...this.state.styles.linkStyle,
            }}
            onPress={() => navigate('SignIn')}>
            Back to Login
        </Text>
          </>
        }
      </AuthView>
    );
  }
}

import React, {Component} from 'react';
import {
  Image,
  ImageBackground,
  Alert,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import * as yup from 'yup';
import {Formik} from 'formik';
import Button from '../../components/Button';
import authStyles from '../../styles/auth';

import APIService from '../../service/APIService';
import AuthView from '../../views/AuthView';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {BioIDContext} from '../../utils/BioAuth';

import {CommonActions} from '@react-navigation/native';

import FormInput from '../../components/FormInput';
import trans from '../../utils/trans';
import getFlag from '../../../countryflags';
import allCountries from '../../../countries.json';
import phoneCodes from '../../../phones.json';
const sortedCountries = {};
Object.keys(allCountries)
  .sort((a, b) => {
    return allCountries[a].localeCompare(allCountries[b]);
  })
  .map((s) => {
    sortedCountries[s] = allCountries[s];
  });
import {AuthContext} from '../../context/AuthContext';
import {ClientContext} from '../../context/ClientContext';
import {getCountryPhoneCode, removeTrunkPrefix} from '../../utils/phonehelpers';

const countryPhoneCode = (country) => {
  if (!country || !phoneCodes[country]) {
    return;
  }
  if (Array.isArray(phoneCodes[country])) {
    return (
      <View style={styles.countryCodeBox}>
        <Text style={styles.countryCode}>{getCountryPhoneCode(country)}</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.countryCodeBox}>
        <Text style={styles.countryCode}>{getCountryPhoneCode(country)}</Text>
      </View>
    );
  }
};
export default class SignIn extends Component {
  state = {
    bioAccessToken: null,
    phoneNumber: null,
  };
  navigateSuccess = (countryCode, phoneNumber, sessionToken) => {
    this.props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'VerificationScreen',
            params: {
              countryCode,
              phoneNumber,
              sessionToken,
            },
          },
        ],
      }),
    );
  };
  navigateToPIN = async (token) => {
    const user = await APIService('users/me/', null, 0, token);
    this.props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'PINVerificationScreen',
            params: {user},
          },
        ],
      }),
    );
  };

  navigateToApp = (countryCode, phoneNumber, sessionToken) => {
    this.props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'App',
          },
        ],
      }),
    );
  };

  componentDidMount() {
    AsyncStorage.multiGet([
      'countryCode',
      'phoneNumber',
      'sessionToken',
      'bioAccessToken',
      'userToken',
      'TFA',
    ]).then((items) => {
      const k = {};
      items.map((i) => (k[i[0]] = i[1]));
      if (
        k.countryCode &&
        k.phoneNumber &&
        k.sessionToken &&
        !k.bioAccessToken
      ) {
        this.navigateSuccess(k.countryCode, k.phoneNumber, k.sessionToken);
      } else if (k.bioAccessToken) {
        this.setState({bioAccessToken: k.bioAccessToken});
      } else if (k.TFA && k.userToken) {
        this.navigateToPIN(k.userToken);
      }
    });
  }
  bioLoginFunction = async (result) => {
    if (result.success) {
      const access_token = await AsyncStorage.getItem('bioAccessToken');
      const refresh_token = await AsyncStorage.getItem('bioRefreshToken');
      const TFA = await AsyncStorage.getItem('TFA');
      if (TFA !== 'enabled') {
        await AsyncStorage.setItem('userToken', access_token);
        await AsyncStorage.setItem('refreshToken', refresh_token);
        this.navigateToApp();
      } else {
        this.navigateToPIN(access_token);
      }
    } else if (!result.hideError) {
      Alert.alert('Error', 'No biometric data found');
    }
  };
  render() {
    return (
      <ClientContext.Consumer>
        {({geo}) => (
          <BioIDContext.Consumer>
            {({available, keysExist, signMessage, toggleBioID}) => (
              <AuthView
                headline={'Register'}
                route={this.props.route}
                bioLoginFunction={this.bioLoginFunction.bind(this)}
                signMessage={available ? signMessage : false}
                navigation={this.props.navigation}>
                {this.props.route.params?.message ? (
                  <Text style={styles.headlineStyle}>
                    {this.props.route.params.message}
                  </Text>
                ) : null}
                <Formik
                  initialValues={{
                    country: geo && geo.country_code ? geo.country_code : 'GB',
                    phone:
                      this.state.phoneNumber ||
                      this.props.route.params?.phone_number,
                  }}
                  onSubmit={(values, actions) => {
                    global.appIsLoading();
                    const cleanedPhone = removeTrunkPrefix(
                      values.country,
                      values.phone,
                    );
                    const countryCode = getCountryPhoneCode(values.country);
                    const phone_number = countryCode + cleanedPhone;
                    if (phone_number !== '+11234567890') {
                      APIService('phone/register/', {
                        phone_number,
                      }).then((result) => {
                        global.appIsNotLoading();
                        if (result) {
                          if (result.session_token) {
                            AsyncStorage.setItem('countryCode', countryCode);
                            AsyncStorage.setItem('phoneNumber', cleanedPhone);
                            AsyncStorage.setItem(
                              'sessionToken',
                              result.session_token,
                            );
                            this.navigateSuccess(
                              countryCode,
                              cleanedPhone,
                              result.session_token,
                            );
                          } else {
                            Object.keys(result).forEach((key) => {
                              if (key === 'detail') {
                                actions.setFieldError('phone', result[key]);
                              } else {
                                actions.setFieldError(key, result[key]);
                              }
                            });
                            //TODO: Scroll to error;
                          }
                        } else {
                          actions.setFieldError('phone', 'Please try later');
                        }
                      });
                    } else {
                      global.appIsNotLoading();
                      AsyncStorage.setItem('countryCode', countryCode);
                      AsyncStorage.setItem('phoneNumber', cleanedPhone);
                      this.navigateSuccess(countryCode, cleanedPhone, '');
                    }
                  }}
                  validationSchema={yup.object().shape({
                    phone: yup
                      .number()
                      .min(3)
                      .required('Enter valid phone number')
                      .typeError('Enter valid phone number'),
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
                      <View>
                        <Text style={styles.pageHeadlineStyle}>
                          Enter your phone number
                        </Text>
                        <View>
                          <FormInput
                            type="select"
                            value={values.country}
                            values={sortedCountries}
                            name="country"
                            label={trans('auth.country')}
                          />
                          {values.country && (
                            <ImageBackground
                              source={getFlag(values.country)}
                              style={styles.countryFlag2}
                              resizeMode={'contain'}
                            />
                          )}
                        </View>
                        <View style={styles.inputContainerStyle}>
                          <View>
                            {countryPhoneCode(values.country)}
                            <TextInput
                              value={values.phone}
                              onChangeText={(phone) =>
                                setFieldValue('phone', phone.trim())
                              }
                              onBlur={() => setFieldTouched('phone')}
                              placeholder="Phone"
                              style={styles.inputStyle}
                              name="phone"
                              keyboardType="numeric"
                              placeholderTextColor={styles.inputStyle.color}
                              autoCapitalize="none"
                              testID="phone"
                              accessibilityLabel="phone"
                              accessible
                              textContentType="telephoneNumber"
                            />
                          </View>
                        </View>
                        {touched.phone && errors.phone && (
                          <Text style={styles.errorStyle}>{errors.phone}</Text>
                        )}
                        <View style={styles.checkboxBoxStyle}>
                          <Text style={styles.checkboxTextStyle}>
                            Are you under the age of 16?
                          </Text>
                          <FormInput
                            style={styles.checkbox16Style}
                            type="checkbox"
                            name="over16"
                            label={trans('auth.over16')}
                          />
                        </View>
                        <View style={styles.buttonContainerStyle}>
                          <Button onPress={handleSubmit} title="NEXT" />
                        </View>
                        {this.state.phoneNumber && keysExist && (
                          <View style={styles.buttonContainerStyle}>
                            <TouchableOpacity
                              onPress={() => {
                                signMessage(
                                  ':biometric_login',
                                  'Sign in?',
                                ).then((success) => {
                                  this.bioLoginFunction({success});
                                });
                              }}
                              title="Login automatically">
                              <Image
                                source={require('../../images/PNG/finger.png')}
                                style={styles.fingerStyle}
                              />
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    </AuthContext.Provider>
                  )}
                </Formik>
              </AuthView>
            )}
          </BioIDContext.Consumer>
        )}
      </ClientContext.Consumer>
    );
  }
}

const styles = authStyles();

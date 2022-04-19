import React, {Fragment, Component, useContext} from 'react';
import {Text, TextInput, View, ImageBackground} from 'react-native';
import * as yup from 'yup';
import {Formik} from 'formik';
import Button from '../../components/Button';
import authStyles from '../../styles/auth';

import APIService from '../../service/APIService';
import AuthView from '../../views/AuthView';

import {CommonActions} from '@react-navigation/native';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import trans from '../../utils/trans';
import FormInput from '../../components/FormInput';

import getFlag from '../../../countryflags';
import {AuthContext} from '../../context/AuthContext';

import allCountries from '../../../countries.json';
import phoneCodes from '../../../phones.json';
import {getCountryPhoneCode} from '../../utils/phonehelpers';

const sortedCountries = {};
Object.keys(allCountries)
  .sort((a, b) => {
    return allCountries[a].localeCompare(allCountries[b]);
  })
  .map((s) => {
    sortedCountries[s] = allCountries[s];
  });
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
export default class ChangeNumberVerification extends Component {
  navigateSuccess = () => {
    this.props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'AvatarScreen'}],
      }),
    );
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
            pin: yup.string().min(6).required(),
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
              <Text style={styles.pageHeadlineStyle}>Enter your PIN</Text>
              <Text style={styles.pageTextStyle}>
                Please enter the PIN number that you saved after registration.
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
                  <Button onPress={handleSubmit} title="NEXT" />
                </View>
              )}
              <View>
                <Text style={styles.pageHeadlineStyle}>
                  Enter your new phone number
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
                      style={styles.countryFlag}
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
              </View>
            </AuthContext.Provider>
          )}
        </Formik>
      </AuthView>
    );
  }
}

const styles = authStyles();

import React, {Fragment, Component, useContext} from 'react';
import {Text, TextInput, View, ImageBackground} from 'react-native';
import * as yup from 'yup';
import {Formik} from 'formik';
import Button from '../../components/Button';
import authStyles from '../../styles/auth';

import APIService from '../../service/APIService';
import AuthView from '../../views/AuthView';

import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import {AuthContext} from '../../context/AuthContext';
import Icon from '../../components/Icon';
export default class DeleteAccount extends Component {
  navigateSuccess = () => {
    this.props.navigation.navigate('DeleteAccountConfirmation');
  };
  goToChangeNumber = () => {
    this.props.navigation.navigate('ChangeNumber');
  }
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
              <Text style={styles.alertName}>
                You are deleting your wevive account:
              </Text>
              <Icon name='alert-triangle' style={styles.alertTriangle} />
<Text style={styles.alertHeadline}>
  Deleting your account will:
</Text>
<Text style={styles.alertText}>
•Delete your account info and profile photo
</Text>
<Text style={styles.alertText}>
•Delete you from all wevive groups
</Text>
<Text style={styles.alertText}>
•Delete your message history on this phone
</Text>
<Text style={styles.alertText}>
•Delete your iCloud backup
</Text>

<Text style={styles.alertHeadline}>
</Text>
<Text style={styles.alertName}>
              </Text>
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
                  <Button onPress={handleSubmit} title="Delete my account" />
                </View>
              )}
              <Button onPress={this.goToChangeNumber} title="Change number instead" />
            </AuthContext.Provider>
          )}
        </Formik>
      </AuthView>
    );
  }
}

const styles = authStyles();

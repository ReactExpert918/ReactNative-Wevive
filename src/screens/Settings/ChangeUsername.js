import React, {Fragment, Component, useContext} from 'react';
import {Text, TextInput, View, ImageBackground} from 'react-native';
import * as yup from 'yup';
import {Formik} from 'formik';
import Button from '../../components/Button';
import authStyles from '../../styles/auth';

import AuthView from '../../views/AuthView';

import trans from '../../utils/trans';
import FormInput from '../../components/FormInput';

import {AuthContext} from '../../context/AuthContext';
export default class ChangeNumberVerification extends Component {
  navigateSuccess = () => {
    this.props.navigation.navigate('PhoneUsernameSettings');
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
            username: '',
          }}
          onSubmit={(values, actions) => {
            this.navigateSuccess();
          }}
          validationSchema={yup.object().shape({
            //email: yup.string().email().required(),
            username: yup
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
              <FormInput type="text" name="username" label={trans('auth.username')} />
              {values.username.length > 0 && !errors.username && (
                <View style={styles.buttonContainerStyle}>
                  <Button onPress={handleSubmit} title="SAVE" />
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

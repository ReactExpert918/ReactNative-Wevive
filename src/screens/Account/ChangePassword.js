import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
} from 'react-native';
import ContentWrapper from '../../components/ContentWrapper';
import Content from '../../components/Content';
import FormInput from '../../components/FormInput';
import trans from '../../utils/trans';
import { Formik } from 'formik';
import * as yup from 'yup';
import Button from '../../components/Button';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize,
} from 'react-native-responsive-dimensions';
import DetailsNavigator from '../../components/DetailsNavigator';

import { AuthContext } from '../../context/AuthContext';
import form_styles from '../../styles/forms';
import {BioIDContext} from '../../utils/BioAuth';
import APIService from '../../service/APIService';
import AsyncStorage from '@react-native-async-storage/async-storage';
const validationSchema = {
    new_password: yup
      .string()
      .min(5)
      .required(),
    current_password: yup
      .string()
      .min(5)
      .required(),
    confirm_password: yup.string().required().oneOf([yup.ref('new_password'), null], trans('auth.password_must_match')),
};

export default class ChangePassword extends Component {
    state = {
        styles: {...form_styles()},
    }
    getFormData(values) {
        return {
            new_password: values.new_password,
            confirm_password: values.confirm_password,
            current_password: values.current_password,
        };
    }
    render() {
        return (
            <ContentWrapper title="My details" details={<DetailsNavigator navigation={this.props.navigation} route={this.props.route}/>}>
                    <Formik
                        initialValues={{
                            new_password:"",
                            confirm_password:"",
                            current_password:"",
                         }}
                        onSubmit={(values, actions) => {
                            global.appIsLoading();
                            APIService('users/password_update/',
                                this.getFormData(values)
                            ).then(result => {
                                global.appIsNotLoading();
                                if (result) {
                                    if (result == 'ok') {
                                        actions.setFieldError('current_password', trans('auth.password_changed'));
                                    } else {
                                        actions.setFieldError('current_password', result[0]);
                                    }
                                } else {
                                    actions.setFieldError('current_password', trans('auth.failed_change'));
                                }
                            });
                        }}
                        validationSchema={yup.object().shape(validationSchema)}
                    >
                    {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit, setFieldValue }) => (
                                <AuthContext.Provider value={{ styles:this.state.styles, values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit, setFieldValue }}>
                                    <FormInput type="text" password={true} name="new_password" label={trans('auth.password')} />
                                    <FormInput type="text" password={true} name="confirm_password" label={trans('auth.password_confirmation')} />
                                    <FormInput type="text" password={true} name="current_password" label={trans('auth.current_password')} />
                                    <View style={this.state.styles.buttonContainerStyle}>
                                        <Button onPress={handleSubmit} title={trans('account.update')} />
                                    </View>
                                    <BioIDContext.Consumer>
                                    {({ available, keysExist,toggleBioID }) => (
                                        available ?
                                        <View style={this.state.styles.buttonContainerStyle}>
                                            <Button onPress={toggleBioID} title={!keysExist ? trans('account.enable_touchid') : trans('account.disable_touchid')} />
                                        </View>
                                        : null
                                    )}
                                    </BioIDContext.Consumer>
                                </AuthContext.Provider>
                    )}
                    </Formik>
            </ContentWrapper>
        );
    }
}

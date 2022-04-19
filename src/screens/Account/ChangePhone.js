import React, { Component, useContext } from 'react';
import {
    View,
    StyleSheet,
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
import P from '../../components/P';
import AsyncStorage from '@react-native-async-storage/async-storage';
import APIService from '../../service/APIService';
import { UserContext } from '../../context/UserContext';
const validationSchema = {
    phone_number: yup
        .string()
        .min(2)
        .required(),
    password: yup
        .string()
        .min(2)
        .required(),
    email: yup
        .string()
        .email()
        .required(),
};

export default function ChangePhone (props) {
    const {authData, setAuthData} = useContext(UserContext);
    const styles = form_styles();
    function getFormData(values) {
        return {
            phone_number: values.phone_number,
            password: values.password,
            email: values.email,
        };
    }
    return <ContentWrapper title="My details" details={<DetailsNavigator navigation={props.navigation} route={props.route}/>}>
            <Content>
            <P>Please note that this email address is
    also used as your username.
    Changing it will change your username
    for the next time you login.</P>
            </Content>
            <Formik
                initialValues={{ 
                    email:authData.email,
                    phone_number:authData.phone_number,
                }}
                onSubmit={(values, actions) => {
                    global.appIsLoading();
                        APIService('users/email_update/',
                            getFormData(values)
                        ).then(result => {
                            global.appIsNotLoading();
                            if (result) {
                                if (result === 'ok') {
                                    setAuthData({...authData,email:values.email,phone_number:values.phone_number});
                                    actions.setFieldError('password', trans('auth.details_changed'));
                                } else {
                                    actions.setFieldError('password', result[0]);
                                }
                            } else {
                                actions.setFieldError('current_password', trans('auth.failed_change'));
                            }
                        });
                }}
                validationSchema={yup.object().shape(validationSchema)}
            >
            {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit, setFieldValue }) => (
                        <AuthContext.Provider value={{ styles:styles, values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit, setFieldValue }}>
                            <FormInput type="text" name="email" label={trans('auth.email')} />
                            <FormInput type="text" name="phone_number" label={trans('auth.phone')} />
                            <FormInput type="text" password name="password" label={trans('auth.password')} />
                            <View style={styles.buttonContainerStyle}>
                                <Button onPress={handleSubmit} title={trans('account.update')} />
                            </View>
                        </AuthContext.Provider>
            )}
            </Formik>
        </ContentWrapper>;
}

import React, {Fragment, Component, useContext} from 'react';
import {Text, TextInput, View, Switch, ImageBackground} from 'react-native';
import * as yup from 'yup';
import {Formik} from 'formik';
import Button from '../../components/Button';
import authStyles from '../../styles/auth';

import APIService from '../../service/APIService';
import AuthView from '../../views/AuthView';

import {CommonActions} from '@react-navigation/native';
const notificationsDemo = require('../../images/PNG/notifications_demo.png');
export default class NotificationsScreen extends Component {
  navigateSuccess = (notificationsEnabled) => {
    this.props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'App', params: {notificationsEnabled}}],
      }),
    );
  };
  render() {
    const {navigate} = this.props.navigation;
    return (
      <AuthView
        headline={'Enable Notifications'}
        route={this.props.route}
        navigation={this.props.navigation}>
        <Formik
          initialValues={{
            notificationsEnabled: true,
          }}
          onSubmit={(values, actions) => {
            this.navigateSuccess(values.notificationsEnabled);
          }}
          validationSchema={yup.object().shape({
            //email: yup.string().email().required(),
            //password: yup.string().min(3).required(),
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
              <Text style={styles.pageHeadlineStyle}>
                Don’t miss your messages!
              </Text>
              <Text style={styles.pageTextStyle}>
                Enable notifications in order to be informed when messages
                arrive.
              </Text>
              <ImageBackground
                source={notificationsDemo}
                style={styles.notificationDemo}
                resizeMode="contain"
              />
              <View style={styles.toggleContainerStyle}>
                <Text style={styles.toggleLabel}>Enable notifications?</Text>
                <Switch
                  trackColor={{true: '#2bbb50', false: '#bababa'}}
                  thumbColor="#ffffff"
                  value={values.notificationsEnabled}
                  style={styles.switchStyle}
                  accessibilityRole="button"
                  onValueChange={(value) =>
                    setFieldValue('notificationsEnabled', value)
                  }
                />
              </View>
              <View style={styles.buttonContainerStyle}>
                <Button onPress={handleSubmit} title="NEXT" />
              </View>
            </View>
          )}
        </Formik>
      </AuthView>
    );
  }
}

const styles = authStyles();

import RNHeicConverter from 'react-native-heic-converter';

import React, {Fragment, Component, useContext} from 'react';
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import * as yup from 'yup';
import {Formik} from 'formik';
import Button from '../../components/Button';
import authStyles from '../../styles/auth';

import APIService from '../../service/APIService';
import AuthView from '../../views/AuthView';

import {CommonActions} from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from '../../components/Icon';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../../context/UserContext';
const defaultAvatar = require('../../images/PNG/wewelogo.png');
export default class AvatarScreen extends Component {
  state = {
    avatarImage: null,
    filename: null,
    mime: null,
  };
  pickImage = () => {
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: true,
      cropperCircleOverlay: true,
      avoidEmptySpaceAroundImage: true,
    }).then((image) => {
      let imageFilename =
        Platform.OS == 'android'
          ? image.path.replace(/^.*\//, '')
          : image.filename.toLowerCase();
      imageFilename = imageFilename.replace(/\.heic$/, '.jpg');
      this.setState({
        avatarImage: image.path,
        avatarFile: imageFilename,
        avatarMime: image.mime,
      });
    });
  };
  navigateSuccess = () => {
    this.props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'NotificationsScreen'}],
      }),
    );
  };
  render() {
    const {navigate} = this.props.navigation;
    return (
      <UserContext.Consumer>
        {({authData, setAuthData}) => (
          <AuthView
            headline={'Profile'}
            route={this.props.route}
            navigation={this.props.navigation}>
            <Formik
              initialValues={{
                name: '',
              }}
              onSubmit={(values, actions) => {
                global.appIsLoading();
                APIService('users/me/', {
                  name: values.name,
                }).then(() => {
                  APIService('user-photo/update_photo/', {
                    photo: this.state.avatarImage,
                    filename: this.state.avatarFile,
                    mime: this.state.avatarMime,
                    name: values.name,
                  }).then((result) => {
                    global.appIsNotLoading();
                    if (result) {
                      const avatarUrl = result.slice(1, -1);
                      setAuthData({...authData, avatarUrl, avatarHosted: avatarUrl});
                      AsyncStorage.setItem('avatarUrl', avatarUrl);
                      AsyncStorage.setItem('userName', values.name);
                      this.navigateSuccess();
                    } else {
                      actions.setFieldError('name', 'Failed to upload.');
                    }
                  });
                });
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
                    Your Profile Information
                  </Text>
                  <Text style={styles.pageTextStyle}>
                    Your profile is encrypted. It will be visible to your contacts,
                    when you accept or start new chats, or when you join groups.
                  </Text>
                  <TouchableOpacity onPress={this.pickImage.bind(this)}>
                    <Text style={styles.pageHeadlineStyle}>Your photo</Text>

                    {this.state.avatarImage ? (
                      <Image
                        source={{uri: this.state.avatarImage}}
                        style={styles.avatarImage}
                      />
                    ) : (
                      <View style={styles.defaultAvatarImage}>
                        <Icon
                          source={defaultAvatar}
                          name="plus-icon"
                          size={responsiveHeight(8)}
                          color={'white'}
                          style={styles.defaultAvatarImageIcon}
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                  <View style={styles.inputContainerStyle}>
                    <View>
                      <TextInput
                        value={values.name}
                        onChangeText={handleChange('name')}
                        onBlur={() => setFieldTouched('name')}
                        placeholder="Name"
                        style={styles.inputStyle}
                        name="name"
                        placeholderTextColor={styles.inputStyle.color}
                        autoCapitalize="none"
                        testID="name"
                        accessibilityLabel="name"
                        accessible
                        textContentType="name"
                      />
                    </View>
                  </View>

                  <View style={styles.buttonContainerStyle}>
                    <Button onPress={handleSubmit} title="SAVE" />
                  </View>
                </View>
              )}
            </Formik>
          </AuthView>
        )}
      </UserContext.Consumer>
    );
  }
}

const styles = authStyles();

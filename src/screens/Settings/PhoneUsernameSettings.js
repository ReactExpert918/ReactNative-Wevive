import React, {Component, useContext} from 'react';
import {View} from 'react-native';
import {
  Share,
  ScrollView,
  Platform,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {MenuItem, MenuDivider} from '../../components/Menu';
import {UserContext} from '../../context/UserContext';
import ImagePicker from 'react-native-image-crop-picker';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import APIService from '../../service/APIService';
import {ChatContext} from 'react-native-chat-plugin/ChatContext';

export default function PhoneUsernameSettings(props) {
  const {authData, updateMe} = useContext(UserContext);
  const chatCtx = useContext(ChatContext);
  const users = chatCtx.getUsers();
  const userIdx = users.findIndex((u) => u.id == authData.id);
  let avatarUrlToUse = authData.avatar;
  if (userIdx !== -1) {
    avatarUrlToUse = users[userIdx].avatar;
  }

  const [name, setName] = React.useState(authData.userName);
  const [about, setAbout] = React.useState(authData.about);
  const [aboutHeight, setAboutHeight] = React.useState(35);
  const [website, setWebsite] = React.useState(authData.website);
  const [changedImage, setChangedImage] = React.useState(false);
  const [image, setImage] = React.useState({
    avatarImage: avatarUrlToUse,
    default: true,
  });
  const pickImage = () => {
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
      setChangedImage(true);
      setImage({
        avatarImage: image.path,
        avatarFile: imageFilename,
        avatarMime: image.mime,
        default: false,
      });
    });
  };

  const saveImage = () => {
    APIService('users/me/', {
      name: name,
      about: about,
      website: website,
    }).then((me) => {
      if (changedImage) {
        APIService('user-photo/update_photo/', {
          photo: image.avatarImage,
          filename: image.avatarFile,
          mime: image.avatarMime,
          name: '',
        }).then((result) => {
          global.appIsNotLoading();
          if (result) {
            chatCtx.saveUserToDB(me.id, result, name, me.phone_number);
            ctx.setAuthData({
              avatar: result,
            });
            AsyncStorage.setItem('avatarUrl', result);
            //updateMe();
            setImage({
              ...image,
              default: true,
            });
            //AsyncStorage.setItem('userName', values.name);
          }
        });
      } else {
        global.appIsNotLoading();
        updateMe();
        setImage({
          ...image,
          default: true,
        });
      }
    });
  };

  const onUsernameChange = (name) => {
    if (typeof name == 'string') setName(name);
    setImage({
      ...image,
      default: false,
    });
  };
  const onAboutChange = (about) => {
    if (typeof about == 'string') setAbout(about);
    setImage({
      ...image,
      default: false,
    });
  };
  const onWebsiteChange = (website) => {
    if (typeof website == 'string') setWebsite(website);
    setImage({
      ...image,
      default: false,
    });
  };
  return (
    <ScrollView style={{backgroundColor: 'white'}}>
      <MenuDivider text="Profile Details" />
      <View style={styles.avatarBox}>
        <TouchableOpacity
          onPress={image.default ? pickImage : saveImage}
          style={styles.avatarContainer}>
          <Image
            resizeMode="cover"
            source={{uri: image.avatarImage}}
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={image.default ? pickImage : saveImage}
          style={styles.avatarContainer}>
          <Text style={styles.editText}>{image.default ? 'Edit' : 'Done'}</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        maxLength={50}
        style={styles.inputText}
        onChange={onUsernameChange}
        onChangeText={onUsernameChange}
        placeholder="User Name">
        {name}
      </TextInput>

      <MenuDivider text="Status" />
      <MenuItem
        style={styles.marginBottom}
        type={'info'}
        hideIcon={true}
        info={authData.status || 'None'}
        onPress={() => {
          props.navigation.navigate('SocialStatusSettings');
        }}>
        Status
      </MenuItem>

      <MenuDivider text="Phone Number" />
      <MenuItem
        style={styles.marginBottom}
        hideIcon={true}
        onPress={() => {
          props.navigation.navigate('ChangeNumber');
        }}>
        {authData.phone_number}
      </MenuItem>

      <MenuDivider text="About You" />
      <Text style={styles.maxChar}>Max Char. 250</Text>
      <TextInput
        multiline={true}
        maxLength={250}
        style={styles.inputText}
        onChange={onAboutChange}
        onChangeText={onAboutChange}
        placeholder="About me">
        {about}
      </TextInput>

      <MenuDivider text="Website" />
      <TextInput
        maxLength={50}
        style={styles.inputText}
        onChange={onWebsiteChange}
        onChangeText={onWebsiteChange}
        placeholder="www.mywebsite.com">
        {website}
      </TextInput>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  profileImage: {
    width: responsiveWidth(15),
    height: responsiveWidth(15),
    borderRadius: responsiveWidth(12),
    marginLeft: responsiveWidth(5),
    marginVertical: responsiveWidth(1),
    backgroundColor: 'rgba(30,30,30,0.1)',
  },
  editDescription: {
    fontSize: responsiveFontSize(2.15),
    paddingHorizontal: responsiveWidth(5),
    flex: 1,
    alignSelf: 'center',
    color: 'rgb(100,100,100)',
    fontWeight: '300',
  },
  avatarBox: {
    flexDirection: 'row',
  },
  avatarContainer: {
    alignSelf: 'center',
  },
  editText: {
    fontSize: responsiveFontSize(2),
    fontWeight: '200',
    alignSelf: 'center',
    marginLeft: responsiveWidth(3),
  },
  maxChar: {
    fontSize: responsiveFontSize(1.5),
    fontWeight: '200',
    marginLeft: responsiveWidth(5),
    marginTop: responsiveHeight(1),
    color: '#666666',
  },
  marginBottom: {
    marginBottom: responsiveHeight(3),
  },
  inputText: {
    textAlign: 'left',
    paddingHorizontal: responsiveWidth(7.5),
    fontSize: responsiveFontSize(2),
    maxWidth: responsiveWidth(90),
    maxHeight: responsiveHeight(50),
    marginBottom: responsiveHeight(3),
  },
});

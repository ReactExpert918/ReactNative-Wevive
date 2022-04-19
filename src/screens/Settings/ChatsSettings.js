import React, {Component} from 'react';
import {Share, ScrollView, Platform, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class ChatsSettings extends Component {
  render() {
    return (
      <ScrollView style={{backgroundColor: "white"}}>
        <Text>Chat settings</Text>
      </ScrollView>
    );
  }
}

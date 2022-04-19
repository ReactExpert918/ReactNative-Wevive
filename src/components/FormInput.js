import React, {Component} from 'react';
import {StyleSheet, View, Text, TextInput, Keyboard} from 'react-native';

import RNPickerSelect from 'react-native-picker-select';

import {getDate, formatDate} from '../utils/helpers';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
//import Icon from './Icon';
import {AuthContext} from '../context/AuthContext';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icon from './Icon';
import {ScrollContext} from '../context/ScrollContext';
import CheckBox from '@react-native-community/checkbox';

export default class extends Component {
  state = {
    isDatePickerVisible: false,
    value: null,
  };
  _handleConfirm(date) {
    this.setState({isDatePickerVisible: false, value: getDate(date)});
  }
  _hideDatePicker() {
    this.setState({isDatePickerVisible: false});
  }
  _showDatePicker() {
    this.setState({isDatePickerVisible: true});
  }
  _scrollToMiddle() {}
  render() {
    var items = [];
    if (this.props.type == 'select') {
      if (!this.props.values) {
        return null;
      }
      Object.keys(this.props.values).forEach((key) => {
        items.push({
          label: this.props.values[key],
          value: key,
        });
      });
    }
    return (
      <ScrollContext.Consumer>
        {(scroll) => (
          <AuthContext.Consumer>
            {({
              styles,
              values,
              handleChange,
              errors,
              setFieldTouched,
              touched,
              isValid,
              handleSubmit,
              setFieldValue,
            }) => (
              <>
                {this.props.type === 'text' ? (
                  <View style={styles.inputContainerStyle}>
                    <TextInput
                      value={values[this.props.name]}
                      onChangeText={(value) =>
                        setFieldValue(
                          this.props.name,
                          this.props.name === 'email' ? value.trim() : value,
                        )
                      }
                      onBlur={() => setFieldTouched(this.props.name)}
                      onFocus={() => {
                        //this._scrollToMiddle();
                      }}
                      editable={!this.props.readonly}
                      placeholder={this.props.label}
                      name={this.props.name}
                      style={
                        !this.props.multiline
                          ? styles.inputStyle
                          : styles.multilineInputStyle
                      }
                      placeholderTextColor={styles.inputStyle.color}
                      autoCapitalize={this.props.autoCapitalize || 'none'}
                      testID={this.props.name}
                      accessibilityLabel={this.props.label}
                      accessible
                      password={this.props.password === true}
                      multiline={this.props.multiline === true}
                      secureTextEntry={this.props.password === true}
                      textContentType={this.props.textContentType || 'none'}
                      keyboardType={this.props.keyboardType || 'default'}
                    />
                  </View>
                ) : null}
                {this.props.type === 'date' ? (
                  <>
                    <DateTimePickerModal
                      headerTextIOS={this.props.label}
                      isVisible={this.state.isDatePickerVisible}
                      mode="date"
                      date={getDate(values[this.props.name])}
                      onConfirm={(date) => {
                        this._handleConfirm(date);
                        setFieldValue(
                          this.props.name,
                          formatDate(date, this.props.dateformat),
                        );
                      }}
                      onCancel={this._hideDatePicker.bind(this)}
                    />
                    <View
                      style={styles.inputContainerStyle}
                      onTouchEnd={this._showDatePicker.bind(this)}>
                      <TextInput
                        value={values[this.props.name]}
                        onChangeText={handleChange(this.props.name)}
                        onBlur={() => setFieldTouched(this.props.name)}
                        placeholder={this.props.label}
                        name={this.props.name}
                        style={styles.inputStyle}
                        placeholderTextColor={styles.inputStyle.color}
                        autoCapitalize="none"
                        testID={this.props.name}
                        accessibilityLabel={this.props.label}
                        accessible
                        password={this.props.password === true}
                        secureTextEntry={this.props.password === true}
                        blurOnSubmit={false}
                        onSubmitEditing={() => Keyboard.dismiss()}
                        editable={false}
                      />
                    </View>
                  </>
                ) : null}
                {this.props.type === 'select' ? (
                  <>
                    <View style={styles.inputContainerStyle}>
                      <RNPickerSelect
                        onValueChange={(value) =>
                          setFieldValue(this.props.name, value)
                        }
                        useNativeAndroidPickerStyle={false}
                        value={this.props.value}
                        items={items}
                        placeholder={{label: this.props.label}}
                        style={{
                          inputIOS: styles.inputStyle,
                          inputAndroid: styles.inputStyleAndroid,
                          iconContainer: {
                            top: responsiveWidth(4.2),
                            right: responsiveWidth(3.5),
                          },
                        }}
                        Icon={() => <Icon name="dropdown-arrow" size={responsiveFontSize(1.8)} color="#555" style={styles.dropdownIcon} />}
                      />
                    </View>
                  </>
                ) : null}
                {this.props.type === 'checkbox' &&
                  <View >
                    <CheckBox
                    style={styles.checkboxContainerStyle}
                      boxType="square"
                      onAnimationType="bounce"
                      offAnimationType="bounce"
                      onCheckColor="#333"
                      onTintColor="#333"
                      disabled={false}
                      value={values[this.props.name]}
                      onValueChange={(value) =>
                        setFieldValue(this.props.name, value)
                      }
                    />
                  </View>
                }
                {touched[this.props.name] && errors[this.props.name] ? (
                  <Text style={styles.errorStyle}>
                    {errors[this.props.name]}
                  </Text>
                ) : null}
              </>
            )}
          </AuthContext.Consumer>
        )}
      </ScrollContext.Consumer>
    );
  }
}

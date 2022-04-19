import React, {Component} from 'react';
import Icon from './Icon';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Switch,
  TextInput,
} from 'react-native';

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

export const MenuDescription = (props) => {
  return (
    <View style={styles.menuTextContainer}>
      <Text style={styles.menuText}>{props.children}</Text>
    </View>
  );
};

export const MenuDivider = (props) => {
  if (!props.text) {
    return (
      <View
        style={!props.blank ? styles.menuDivider : styles.blankMenuDivider}
      />
    );
  } else {
    return (
      <View style={styles.menuDivider}>
        <Text style={styles.menuDividerText}>{props.text}</Text>
      </View>
    );
  }
};

export const MenuItem = (props) => {
  const [toggle, setToggle] = React.useState(!!props.value);
  const input = React.useRef();
  return (
    <TouchableOpacity
      style={styles.menuRow}
      activeOpacity={1.0}
      onPress={
        props.onPress
          ? props.onPress
          : () => {
              if (props.type == 'textinput') {
                input.current.focus();
              }
            }
      }>
      <View style={styles.menuContainer}>
        {props.showIcon && (
          <Icon size={25} name={'w-watermark'} style={styles.menuIcon} />
        )}
        {props.type !== 'textinput' && (
          <Text
            style={
              !props.important
                ? !props.notice
                  ? styles.menuItem
                  : styles.noticeMenuItem
                : styles.importantMenuItem
            }>
            {props.children}
          </Text>
        )}
        {props.type == 'textinput' && (
          <TextInput
            ref={input}
            textAlignVertical={'top'}
            numberOfLines={1}
            multiline={false}
            style={styles.textInput}
            onSubmitEditing={props.onChange}
            placeholder={props.placeholder}
            placeholderTextColor={'rgb(125,125,125)'}
            blurOnSubmit={true}
            onChangeText={props.onChangeText}
          />
        )}
      </View>
      {props.type !== 'selection' &&
        props.type !== 'toggle' &&
        props.type !== 'textinput' && (
          <Icon size={25} name={'arrow'} style={styles.nextIcon} />
        )}
      {props.selected && (
        <Icon size={25} name={'ticks'} style={styles.ticksIcon} />
      )}
      {props.type == 'toggle' && (
        <View style={styles.toggleContainer}>
          <Switch
            trackColor={{true: '#2bbb50', false: '#bababa'}}
            thumbColor="#ffffff"
            value={typeof props.value == 'boolean' ? props.value : toggle}
            accessibilityRole="button"
            style={styles.toggleStyle}
            onValueChange={(value) => {
              if (typeof props.onChange !== 'undefined') {
                setToggle(props.onChange(value));
              } else {
                setToggle(value);
              }
            }}
          />
        </View>
      )}
      {props.type == 'info' && (
        <Text style={styles.infoItem}>{props.info}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  nextIcon: {
    fontSize: responsiveFontSize(0.8),
    transform: [{rotate: '270deg'}],
    alignSelf: 'center',
    color: 'rgb(100,100,100)',
  },
  ticksIcon: {
    fontSize: responsiveFontSize(1.5),
    alignSelf: 'center',
    color: 'rgb(100,100,100)',
    color: 'rgb(230, 142, 67)',
  },
  menuDividerText: {
    paddingHorizontal: responsiveWidth(7.5),
    fontWeight: '700',
    color: 'rgb(100,100,100)',
    fontFamily: 'SFProDisplay-Regular',
    fontSize: responsiveFontSize(2),
  },
  toggleStyle: {
    alignSelf: 'flex-end',
  },
  toggleContainer: {
    alignSelf: 'flex-end',
  },
  menuTextContainer: {
    paddingHorizontal: responsiveWidth(8),
    paddingVertical: responsiveWidth(2),
    backgroundColor: 'white',
  },
  menuText: {
    textAlign: 'left',
    fontSize: responsiveFontSize(1.5),
    color: 'rgb(100,100,100)',
    fontFamily: 'SFProDisplay-Regular',
  },
  menuDivider: {
    backgroundColor: 'rgb(215,215,215)',
    height: responsiveWidth(8),
    justifyContent: 'center',
  },
  blankMenuDivider: {
    backgroundColor: 'white',
    height: responsiveWidth(12.5),
    justifyContent: 'center',
  },
  menuContainer: {
    flexDirection: 'row',
  },
  menuRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(230,230,230)',
    paddingVertical: responsiveWidth(4),
    paddingHorizontal: responsiveWidth(7.5),
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },
  menuIcon: {
    color: 'rgb(230, 142, 67)',
    marginRight: responsiveWidth(3),
  },
  infoItem: {
    position: 'absolute',
    top: responsiveWidth(4.2),
    right: responsiveWidth(12.4),
    alignSelf: 'center',
    textAlign: 'right',
    color: 'rgb(150,150,150)',
    fontWeight: '300',
    fontSize: responsiveFontSize(2.1),
    lineHeight: responsiveFontSize(3),
  },
  menuItem: {
    alignSelf: 'center',
    fontSize: responsiveWidth(4.5),
    fontFamily: 'SFProDisplay-Regular',
  },
  importantMenuItem: {
    color: 'rgb(230, 142, 67)',
    alignSelf: 'center',
    fontSize: responsiveWidth(4.5),
    fontFamily: 'SFProDisplay-Regular',
  },
  noticeMenuItem: {
    color: 'rgb(75,189,163)',
    alignSelf: 'center',
    fontSize: responsiveWidth(4.5),
    fontFamily: 'SFProDisplay-Regular',
  },
  textInput: {
    fontSize: responsiveFontSize(2.3),
  },
});

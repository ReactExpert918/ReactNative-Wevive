import React from 'react';
import {StyleSheet, ScrollView, View, Text} from 'react-native';

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {
  wrapScrollView, // simple wrapper, no config
} from 'react-native-scroll-into-view';

import {colors} from '../../app.json';

// Available options with their default value
const ScrollIntoViewOptions = {
  // auto: ensure element appears fully inside the view (if not already inside). It may align to top or bottom.
  // top: align element to top
  // bottom: align element to bottom
  // center: align element at the center of the view
  align: 'auto',

  // Animate the scrollIntoView() operation
  animated: true,

  // By default, scrollIntoView() calls are throttled a bit because it does not make much sense
  // to scrollIntoView() 2 elements at the same time (and sometimes even impossible)
  immediate: false,

  // Permit to add top/bottom insets so that element scrolled into view
  // is not touching directly the borders of the scrollview (like a padding)
  insets: {
    top: 0,
    bottom: 0,
  },

  // Advanced: use these options as escape hatches if the lib default functions do not satisfy your needs
  //computeScrollY: (scrollViewLayout, viewLayout, scrollY, insets, align) => {},
  measureElement: (viewRef) => {},
};

// Wrap the original ScrollView
const CustomScrollView = wrapScrollView(ScrollView);


const ScrollComponent = (props) => {
  if (!props.scrollElement) {
    return (
      <CustomScrollView
        scrollIntoViewOptions={ScrollIntoViewOptions}
        contentContainerStyle={
          !props.center
            ? styles.contentContainerStyle
            : styles.contentContainerStyleCenter
        }
        style={{backgroundColor: "white"}}
        scrollEnabled={props.scrollEnabled}
        ref={(ref) => (global.contentScrollView = ref)}
        bounces={false}>
        {props.children}
      </CustomScrollView>
    );
  } else {
    return props.scrollElement;
  }
};

export default function ContentWrapper(props) {
  return (
    <View style={styles.scrollView}>
      {props.title && (
        <View style={styles.titleView}>
          <Text style={styles.titleText}>{props.title}</Text>
        </View>
      )}
      <ScrollComponent>
        {props.details}
        <View
          style={{
            paddingHorizontal: !props.paddingHorizontal
              ? responsiveWidth(5)
              : props.paddingHorizontal,
          }}>
          {props.children}
        </View>
      </ScrollComponent>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingBottom: 80,
  },
  contentContainerStyleCenter: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 80,
  },
  titleView: {
    backgroundColor: colors.contentBorder,
    height: responsiveHeight(4.5),
    width: responsiveWidth(100),
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: responsiveWidth(7.5),
  },
  titleText: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: '700',
    color: colors.textMain,
    textAlign: 'center',
    justifyContent: 'center',
    textTransform: 'uppercase',
    alignSelf: 'center',
    flexShrink: 1,
  },
  balanceText: {
    fontSize: responsiveFontSize(3),
    fontWeight: '300',
    color: colors.textMain,
    textAlign: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    textTransform: 'uppercase',
  },
  logo: {
    width: 138 * 1.2,
    height: 151 * 1.2,
    position: 'absolute',
    bottom: 30,
    right: 0,
    opacity: 0.65,
  },
  logo2: {
    width: responsiveWidth(45),
    height: (25 / 111) * responsiveWidth(44),
    position: 'absolute',
    bottom: responsiveWidth(0.5),
    left: responsiveWidth(50),
    marginLeft: -responsiveWidth(45) / 2,
  },
  logo3: {
    width: responsiveWidth(30),
    height: (551 / 4243) * responsiveWidth(29),
    position: 'absolute',
    bottom: responsiveWidth(13),
    left: responsiveWidth(50),
    marginLeft: -responsiveWidth(30) / 2,
  },
});

import {StyleSheet} from 'react-native';

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from 'react-native-responsive-dimensions';
const styles = keyboard => {
  return StyleSheet.create({
    contentText: {
        fontSize: responsiveFontSize(1.65),
        lineHeight: responsiveFontSize(2),
    }
  });
};
export default styles;

import React, {Component} from 'react';
import {ActivityIndicator, View, Text, StyleSheet} from 'react-native';

import {
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

export const AppLoadingIndicator = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  global.appIsLoading = (loadingMessage) => {
    setIsLoading(loadingMessage || true);
  };
  global.appIsNotLoading = () => {
    setIsLoading(false);
  };
  return isLoading ? (
    <>
      <View style={styles.loadingBackground} />
      <View style={styles.loadingIndicator}>
        <ActivityIndicator color={'white'} size={'large'} />
        {isLoading !== true && (
          <Text style={styles.loadingMessage}>{isLoading}</Text>
        )}
      </View>
    </>
  ) : null;
};

const styles = StyleSheet.create({
  loadingBackground: {
    width: '100%',
    position: 'absolute',
    height: '100%',
    flex: 1,
    opacity: 0.8,
    backgroundColor: 'black',
  },
  loadingIndicator: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    height: '100%',
    width: responsiveWidth(100),
  },
  loadingMessage: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: responsiveWidth(100),
    bottom: '43%',
    color: 'rgba(255,255,255,0.5)',
    fontSize: responsiveFontSize(2),
    textAlign: 'center',
  },
});

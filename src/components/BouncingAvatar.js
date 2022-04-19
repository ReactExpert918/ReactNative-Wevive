import React, {useContext} from 'react';
import {Animated, Easing, Text, StyleSheet, View} from 'react-native';
import PropTypes from 'prop-types';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
const styles = StyleSheet.create({
    addedPerson: {
        color: "white",
        justifyContent: "center",
        textAlign: "center",
        marginTop: responsiveWidth(2.5),
        fontSize: responsiveFontSize(1.2),
    },
    bigAddedPerson: {
        color: "white",
        justifyContent: "center",
        textAlign: "center",
        marginTop: responsiveWidth(20.5),
        fontSize: responsiveFontSize(2.8),
        fontWeight: "200",
    }
});
export default function BouncingAvatar({big, contact, url, text}) {
    const backgroundImage={uri: url};
    const animatedValue = new Animated.Value(0);
    Animated.loop(
        Animated.timing(animatedValue, {
            toValue: 1,
            duration: 2800,
            easing: Easing.ease,
            useNativeDriver: true,
        })
    ).start();
    const size = big ? 60 : 12;
    return (
        <View style={{ marginBottom: responsiveWidth(2.5), left: big ? 0 : responsiveWidth(5), width: responsiveWidth(size), borderRadius: responsiveWidth(size) }}>
            <Animated.Image
                source={backgroundImage}
                resizeMode='cover'
                style={{
                    
                    borderRadius: responsiveWidth(size),
                    height: responsiveWidth(size),
                    width: responsiveWidth(size),
                    transform: [
                        {
                            scale: animatedValue.interpolate({
                                inputRange: [0, 0.15, 0.7, 1],
                                outputRange: [1, 1.3, 1.3, 1]
                            })
                        },
                    ]
                }}
            />
            <Text style={big ? styles.bigAddedPerson : styles.addedPerson}>{text}</Text>
        </View>
  );
}

BouncingAvatar.propTypes = {
  url: PropTypes.string.isRequired,
};

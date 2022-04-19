import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Main from '../Main';
const Stack = createStackNavigator();
const defaultConfig = {
  headerShown: false,
  cardStyleInterpolator: forFade,
};

const forFade = ({current}) => ({
  cardStyle: {opacity: current.progress},
});

const AppStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{gestureEnabled: false}}>
      <Stack.Screen name="Main" component={Main} options={defaultConfig} />
    </Stack.Navigator>
  );
};

export default AppStack;

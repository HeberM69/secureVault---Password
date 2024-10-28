import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './Screens/HomeScreen';
import RegisterScreen from './Screens/RegisterScreen';
import MainScreen from './Screens/MainScreen';
import PasswordRegister from './Screens/PasswordRegister';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="PasswordRegister" component={PasswordRegister} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

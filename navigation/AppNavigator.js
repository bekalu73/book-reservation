// AppNavigator.js

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/Home";
import LoginScreen from "../screens/Login";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;

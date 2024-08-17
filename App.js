import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/Home";
import LoginScreen from "./screens/Login";
import RegisterScreen from "./screens/Register";
import ProfileManagement from "./screens/Profile";
import ReservedBooks from "./screens/ReservedBook";
import Read from "./screens/Read";
import Toast from "react-native-toast-message";
import { AuthProvider } from "./context/AuthContext";

const Stack = createStackNavigator();

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login" // Set the initial route to Login
          screenOptions={{
            headerShown: false, // Optional: Hide headers for a full-screen experience
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Profile" component={ProfileManagement} />
          <Stack.Screen name="Reserve" component={ReservedBooks} />
          <Stack.Screen name="Read" component={Read} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </AuthProvider>
  );
};

export default App;

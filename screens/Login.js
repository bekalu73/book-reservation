import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/FontAwesome";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  // Function to manually decode JWT token
  const manualDecodeToken = (token) => {
    try {
      // Split the token into parts
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      // Decode base64 string
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const handleLogin = async () => {
    try {
      // Perform login logic here
      const response = await fetch("http://192.168.43.187:8800/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const token = data.token;

      // Manually decode the token to get the user ID
      const decodedToken = manualDecodeToken(token);
      if (!decodedToken) {
        throw new Error("Failed to decode token.");
      }

      const userId = decodedToken.id;

      // Fetch user data based on the ID
      const userResponse = await fetch(
        `http://192.168.43.187:8800/auth/user/${userId}`
      );

      if (!userResponse.ok) {
        throw new Error(`HTTP error! status: ${userResponse.status}`);
      }

      const userData = await userResponse.json();

      // Check if the user is approved
      if (userData.isApproved) {
        // Store the token in AsyncStorage
        await AsyncStorage.setItem("token", token);
        Toast.show({
          type: "success",
          position: "top",
          text1: "Login Successful",
          text2: "You have successfully logged in!",
        });
        navigation.navigate("Home");
      } else {
        // If not approved, show a specific message
        Toast.show({
          type: "info",
          position: "top",
          text1: "Login Failed",
          text2: "Admin approval is needed.",
        });
      }
    } catch (error) {
      console.error("Error logging in:", error);
      Toast.show({
        type: "error",
        position: "top",
        text1: "Login Failed",
        text2: "Invalid email or password.",
      });
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo.png")} style={styles.logo} />
      <Text style={styles.title}>Welcome Back!</Text>
      <View style={styles.inputContainer}>
        <Icon name="envelope" size={20} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.registerLink}>
          Don't have an account?{" "}
          <Text style={styles.registerLinkBold}>Register here</Text>.
        </Text>
      </TouchableOpacity>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f0f4f8",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "grey",
  },
  button: {
    width: "100%",
    backgroundColor: "#5b94f0",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  registerLink: {
    marginTop: 20,
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  registerLinkBold: {
    color: "#007BFF",
    fontWeight: "bold",
  },
});

export default LoginScreen;

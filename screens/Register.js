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
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/FontAwesome"; // Use FontAwesome icons

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const handleRegister = () => {
    fetch("http://192.168.43.187:8800/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, phone }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "User registered") {
          Toast.show({
            type: "success",
            position: "top",
            text1: "Registration Successful",
            text2: "You have registered successfully.",
          });
          navigation.navigate("Login");
        } else {
          Toast.show({
            type: "error",
            position: "top",
            text1: "Registration Failed",
            text2: data.message || "Something went wrong.",
          });
        }
      })
      .catch((error) => {
        console.error("Error registering:", error);
        Toast.show({
          type: "error",
          position: "top",
          text1: "Registration Error",
          text2: "There was an error during registration.",
        });
      });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/logo.png")} // Replace with your own logo
        style={styles.logo}
      />
      <Text style={styles.title}>Create Account</Text>

      <View style={styles.inputContainer}>
        <Icon name="user" size={20} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
      </View>

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

      <View style={styles.inputContainer}>
        <Icon name="phone" size={20} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Phone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.loginLink}>
          Already have an account?{" "}
          <Text style={styles.loginLinkBold}>Login here</Text>.
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
    marginTop: 20,
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
  loginLink: {
    marginTop: 20,
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  loginLinkBold: {
    color: "#007BFF",
    fontWeight: "bold",
  },
});

export default RegisterScreen;

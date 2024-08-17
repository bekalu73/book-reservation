// src/components/Header.js

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const Header = ({ navigation }) => {
  const handleLogin = () => {
    navigation.navigate("Login");
  };

  const handleRegister = () => {
    navigation.navigate("Register");
  };

  const handleLogout = () => {
    // Implement logout logic here
    console.log("Logged out");
  };

  const isLoggedIn = false; // Replace with actual authentication logic

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>BookApp</Text>
      <View style={styles.navLinks}>
        {isLoggedIn ? (
          <>
            <TouchableOpacity onPress={() => navigation.navigate("Home")}>
              <Text style={styles.navText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout}>
              <Text style={styles.navText}>Logout</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.navText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleRegister}>
              <Text style={styles.navText}>Register</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#FF5A35",
  },
  logo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  navLinks: {
    flexDirection: "row",
  },
  navText: {
    color: "#fff",
    marginLeft: 16,
    fontSize: 16,
  },
});

export default Header;

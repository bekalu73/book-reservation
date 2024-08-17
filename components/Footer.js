import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Footer = () => {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>© 2024 Book Reservation App</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    height: 50,
    backgroundColor: "#FF5A35",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    color: "#fff",
  },
});

export default Footer;

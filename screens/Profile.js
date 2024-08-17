import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";

const ProfileManagement = () => {
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  // Custom function to decode JWT token
  const manualDecodeJWT = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );

      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Error decoding token:", e);
      return null;
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        // console.log("Token:", token);
        if (token) {
          const decodedToken = manualDecodeJWT(token);
          // console.log("Decoded Token:", decodedToken);
          if (decodedToken) {
            setUserId(decodedToken.id);
          }
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleSaveChanges = async () => {
    try {
      // console.log(userId);
      const response = await fetch(
        `http://192.168.43.187:8800/auth/edit/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
          },
          body: JSON.stringify({ name, email, password }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      Toast.show({
        type: "success",
        position: "top",
        text1: "Profile Updated",
        text2: data.message,
      });
      // Navigate to the login page after successful update
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error updating user details:", error);
      Toast.show({
        type: "error",
        position: "top",
        text1: "Update Failed",
        text2: "Unable to update profile details.",
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Icon name="arrow-back" size={24} color="#007BFF" />
          <Text style={styles.backButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.profilePictureContainer}>
        <TouchableOpacity>
          <View style={styles.profilePicturePlaceholder}>
            <Image
              style={styles.profileIcon}
              source={{ uri: "https://example.com/profile-icon.png" }}
            />
            <Text style={styles.profilePictureText}>Select Picture</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor="#aaa"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e6f0ff",
    padding: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: "#007BFF",
    fontSize: 16,
    marginLeft: 5,
    fontWeight: "500",
  },
  profilePictureContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  profilePicturePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  profileIcon: {
    width: 40,
    height: 40,
    marginBottom: 5,
    tintColor: "#888",
  },
  profilePictureText: {
    color: "#555",
    fontSize: 14,
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 15,
    marginBottom: 5,
    color: "#555",
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    color: "#333",
    backgroundColor: "#fff",
  },
  saveButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ProfileManagement;

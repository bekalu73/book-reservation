import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useAuthContext } from "../context/AuthContext";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/FontAwesome";

const HomeScreen = ({ navigation }) => {
  const { reservedBookIds, reserveBook, cancelReservation } = useAuthContext();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLogged, setIsLogged] = useState(false);
  const [bookOfTheMonth, setBookOfTheMonth] = useState(null);
  const isFocused = useIsFocused();

  const [isStartDatePickerVisible, setStartDatePickerVisibility] =
    useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const checkTokenAndFetchBooks = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          setIsLogged(true);
          fetchBooks();
        } else {
          setIsLogged(false);
          setBooks([]);
          setLoading(false);
        }
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    checkTokenAndFetchBooks();
  }, [isFocused]);

  const fetchBooks = () => {
    fetch("http://192.168.43.187:8800/books")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setBooks(data);
        setLoading(false);

        if (data.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.length);
          setBookOfTheMonth(data[randomIndex]);
        }
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };

  const handleLoginPress = () => {
    navigation.navigate("Login");
  };

  const handleRegisterPress = () => {
    navigation.navigate("Register");
  };

  const handleProfilePress = () => {
    navigation.navigate("Profile");
  };

  const handleReservePress = (bookId) => {
    if (reservedBookIds.includes(bookId)) {
      cancelReservation(bookId);
      Toast.show({
        type: "info",
        position: "top",
        text1: "Reservation Canceled",
        text2: "You have successfully canceled the reservation for this book.",
      });
    } else {
      setSelectedBookId(bookId);
      setStartDatePickerVisibility(true);
    }
  };

  const handleStartDateConfirm = (date) => {
    setStartDate(date);
    setStartDatePickerVisibility(false);
    setEndDatePickerVisibility(true);
  };

  const handleEndDateConfirm = (date) => {
    setEndDate(date);
    setEndDatePickerVisibility(false);
    if (selectedBookId && startDate && date) {
      reserveBook(selectedBookId);
      Toast.show({
        type: "success",
        position: "top",
        text1: "Book Reserved",
        text2: `Book reserved from ${startDate.toDateString()} to ${date.toDateString()}.`,
      });
      setStartDate(null);
      setEndDate(null);
      setSelectedBookId(null);
    }
  };

  const handleLogoutPress = async () => {
    try {
      await AsyncStorage.removeItem("token");
      setIsLogged(false);
      setBooks([]);
      navigation.navigate("Login");
    } catch (err) {
      console.error("Failed to logout: ", err);
    }
  };

  const handleReadMorePress = (bookId) => {
    navigation.navigate("Read", { bookId });
  };

  if (loading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  if (error) {
    return <Text style={styles.errorText}>Error: {error.message}</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>My Book App</Text>
        <View style={styles.headerButtons}>
          {isLogged ? (
            <>
              <TouchableOpacity
                onPress={handleProfilePress}
                style={styles.headerButton}
              >
                <Icon name="user" size={20} color="#007BFF" />
                <Text style={styles.headerButtonText}>Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("Reserve")}
                style={styles.headerButton}
              >
                <Icon name="bookmark" size={20} color="#007BFF" />
                <Text style={styles.headerButtonText}>Reserve</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleLogoutPress}
                style={styles.headerButton}
              >
                <Icon name="sign-out" size={20} color="#007BFF" />
                <Text style={styles.headerButtonText}>Logout</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                onPress={handleLoginPress}
                style={styles.headerButton}
              >
                <Icon name="sign-in" size={20} color="#007BFF" />
                <Text style={styles.headerButtonText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleRegisterPress}
                style={styles.headerButton}
              >
                <Icon name="user-plus" size={20} color="#007BFF" />
                <Text style={styles.headerButtonText}>Register</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {/* Featured Book Section */}
      {isLogged && bookOfTheMonth && (
        <View style={styles.featuredBookSection}>
          <Text style={styles.featuredBookTitle}>Book of the Month</Text>
          <View style={styles.featuredBookCard}>
            <Text style={styles.bookTitle}>{bookOfTheMonth.title}</Text>
            <Text style={styles.bookAuthor}>
              Author: {bookOfTheMonth.author}
            </Text>
            <Text style={styles.bookDescription}>
              {bookOfTheMonth.description}
            </Text>
            <Button
              title="Read More"
              onPress={() => handleReadMorePress(bookOfTheMonth._id)}
            />
          </View>
        </View>
      )}

      {/* Available Books Section */}
      {isLogged && books.length > 0 && (
        <View style={styles.booksSection}>
          <Text style={styles.booksTitle}>Available Books to Read</Text>
          {books.map((book) => (
            <View key={book._id} style={styles.bookCard}>
              <Text style={styles.bookTitle}>{book.title}</Text>
              <Text style={styles.bookAuthor}>Author: {book.author}</Text>
              <Text style={styles.bookDescription}>{book.description}</Text>
              <View style={styles.cardButtons}>
                <Button
                  title="Read More"
                  onPress={() => handleReadMorePress(book._id)}
                />
                <Button
                  title={
                    reservedBookIds.includes(book._id)
                      ? "Cancel Reservation"
                      : "Reserve This Book"
                  }
                  onPress={() => handleReservePress(book._id)}
                />
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © 2024 My Book App. All rights reserved.
        </Text>
        <Text
          style={styles.footerLink}
          onPress={() => console.log("Privacy Policy")}
        >
          Privacy Policy
        </Text>
        <Text
          style={styles.footerLink}
          onPress={() => console.log("Terms of Service")}
        >
          Terms of Service
        </Text>
      </View>

      {/* Date Pickers */}
      <DateTimePickerModal
        isVisible={isStartDatePickerVisible}
        mode="date"
        onConfirm={handleStartDateConfirm}
        onCancel={() => setStartDatePickerVisibility(false)}
      />
      <DateTimePickerModal
        isVisible={isEndDatePickerVisible}
        mode="date"
        onConfirm={handleEndDateConfirm}
        onCancel={() => setEndDatePickerVisibility(false)}
      />

      {/* Toast */}
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  logo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007BFF",
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerButton: {
    marginLeft: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  headerButtonText: {
    marginTop: 4,
    fontSize: 12,
    color: "#007BFF",
  },
  heroSection: {
    position: "relative",
    height: 300,
    marginBottom: 16,
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  heroTextContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -150 }, { translateY: -50 }],
    width: 300,
    alignItems: "center",
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginTop: 8,
  },
  featuredBookSection: {
    padding: 16,
    backgroundColor: "#fafafa",
  },
  featuredBookTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  featuredBookCard: {
    backgroundColor: "#f8f8f8",
    padding: 16,
    borderRadius: 8,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  bookAuthor: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  bookDescription: {
    fontSize: 12,
    color: "#777",
    marginBottom: 8,
  },
  booksSection: {
    padding: 16,
  },
  booksTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  bookCard: {
    backgroundColor: "#f8f8f8",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  cardButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ctaSection: {
    padding: 16,
    backgroundColor: "#ffe6cc",
    alignItems: "center",
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  ctaSubtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  newsSection: {
    padding: 16,
    backgroundColor: "#fafafa",
  },
  newsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  newsCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  newsHeadline: {
    fontSize: 16,
    color: "#333",
  },
  footer: {
    padding: 16,
    backgroundColor: "#f8f8f8",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  footerText: {
    fontSize: 14,
    color: "#555",
  },
  footerLink: {
    fontSize: 14,
    color: "#007BFF",
    marginTop: 8,
  },
  loadingText: {
    textAlign: "center",
    fontSize: 18,
    marginTop: 20,
  },
  errorText: {
    textAlign: "center",
    fontSize: 18,
    color: "red",
    marginTop: 20,
  },
});

export default HomeScreen;

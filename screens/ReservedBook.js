import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { useAuthContext } from "../context/AuthContext";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/MaterialIcons"; // Importing icon

const ReservePage = ({ navigation }) => {
  const { reservedBookIds, cancelReservation } = useAuthContext();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (reservedBookIds.length > 0) {
      // Fetch the details of all reserved books
      const fetchBooks = async () => {
        try {
          const bookRequests = reservedBookIds.map((id) =>
            fetch(`http://192.168.43.187:8800/books/${id}`).then((response) => {
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              return response.json();
            })
          );
          const booksData = await Promise.all(bookRequests);
          setBooks(booksData);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchBooks();
    } else {
      setLoading(false);
    }
  }, [reservedBookIds]);

  const handleCancelReservation = (bookId) => {
    cancelReservation(bookId);
    Toast.show({
      type: "info",
      position: "top",
      text1: "Reservation Cancelled",
      text2: "You have successfully cancelled this reservation.",
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (books.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noBooksText}>No books reserved.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            navigation.navigate("Home"); // Navigate to Home screen
          }}
        >
          <Icon name="arrow-back" size={24} color="#007BFF" />
          <Text style={styles.backButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Reserved Books</Text>
      {books.map((book, index) => (
        <View key={`${book._id}-${index}`} style={styles.bookCard}>
          <Image source={{ uri: book.cover }} style={styles.bookCover} />
          <View style={styles.bookDetails}>
            <Text style={styles.bookTitle}>{book.title}</Text>
            <Text style={styles.bookAuthor}>by {book.author}</Text>
            <Text style={styles.bookDescription}>{book.description}</Text>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => handleCancelReservation(book._id)}
            >
              <Text style={styles.cancelButtonText}>Cancel Reservation</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
      {/* Toast */}
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  bookCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  bookCover: {
    width: 80,
    height: 120,
    borderRadius: 5,
    marginRight: 15,
  },
  bookDetails: {
    flex: 1,
    justifyContent: "space-between",
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  bookAuthor: {
    fontSize: 14,
    color: "#777",
    marginBottom: 10,
  },
  bookDescription: {
    fontSize: 12,
    color: "#666",
    marginBottom: 15,
  },
  cancelButton: {
    backgroundColor: "#5b94f0",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  noBooksText: {
    fontSize: 18,
    color: "gray",
    textAlign: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
});

export default ReservePage;

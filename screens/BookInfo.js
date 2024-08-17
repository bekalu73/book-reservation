import React from "react";
import { View, Text, StyleSheet } from "react-native";

const BookInfo = ({ route }) => {
  const { bookId } = route.params;

  // Mock data for demonstration; fetch real data in a real app
  const book = {
    id: bookId,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description: "A classic novel of the Jazz Age.",
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.author}>{book.author}</Text>
      <Text style={styles.description}>{book.description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  author: {
    fontSize: 18,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default BookInfo;

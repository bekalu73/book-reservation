import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const ReadMorePage = () => {
  const navigation = useNavigation();

  const book = {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description: `
            The Great Gatsby is a 1925 novel by American writer F. Scott Fitzgerald. Set in the Jazz Age on Long Island, the novel depicts narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby and Gatsby's obsession to reunite with his former lover, Daisy Buchanan.
            \n\nThe story primarily concerns the young and mysterious millionaire Jay Gatsby and his quixotic passion and obsession with the beautiful former debutante Daisy Buchanan. Considered to be Fitzgerald's magnum opus, The Great Gatsby explores themes of decadence, idealism, resistance to change, social upheaval, and excess, creating a portrait of the Roaring Twenties that has been described as a cautionary tale regarding the American Dream.
        `,
  };

  const handleBackToHome = () => {
    navigation.goBack();
  };

  const handleReserveBook = () => {
    // navigation.navigate("Fm");
    // Your logic to reserve the book
    // console.log("Book reserved!");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackToHome}>
          <MaterialIcons name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Book Details</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>By {book.author}</Text>
        <Text style={styles.description}>{book.description}</Text>
        <TouchableOpacity
          style={styles.reserveButton}
          onPress={handleReserveBook}
        >
          <Text style={styles.reserveButtonText}>Reserve This Book</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#333",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  author: {
    fontSize: 18,
    marginBottom: 20,
    color: "#666",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#444",
  },
  reserveButton: {
    marginTop: 20,
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: "#4083f7",
    borderRadius: 5,
    alignItems: "center",
  },
  reserveButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ReadMorePage;

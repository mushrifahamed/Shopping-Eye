import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import { useWishlist } from "./WishlistContext.js"; // Adjust the path accordingly
import { IPAddress } from "../config.js";

const Wishlist = ({ navigation }) => {
  const { wishlist, removeFromWishlist } = useWishlist(); // Use the context
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState(null);

  // Fetch the user ID when the component is mounted
  const fetchUserId = async () => {
    const storedUserId = await AsyncStorage.getItem("userID");
    setUserId(storedUserId);
  };

  useEffect(() => {
    fetchUserId();
  }, []);

  const handleDelete = (product) => {
    Alert.alert(
      "Remove from Wishlist",
      "Are you sure you want to remove this item from wishlist?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            if (!userId) return;

            axios
              .post(`http://${IPAddress}:8089/api/wishlist/remove`, {
                productId: product._id,
                userId: userId,
              })
              .then(() => {
                removeFromWishlist(product._id); // Remove from context
                setMessage("Successfully deleted");
                setTimeout(() => setMessage(""), 2000);
              })
              .catch((err) => {
                console.error(err);
              });
          },
        },
      ]
    );
  };

  const renderWishlistItem = ({ item }) => (
    <View style={styles.wishlistItemContainer}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("ProductDetail", {
            product: item,
            isInWishlist: true,
          })
        }
      >
        <Text style={styles.wishlistItemText}>{item.name}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDelete(item)}>
        <Icon name="trash" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Wishlist</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {wishlist.length > 0 ? (
        <FlatList
          data={wishlist}
          keyExtractor={(item) => item._id}
          renderItem={renderWishlistItem}
        />
      ) : (
        <Text style={styles.emptyText}>Your wishlist is empty.</Text>
      )}
    </View>
  );
};

export default Wishlist;

// Styles remain unchanged...

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  message: {
    color: "green",
    fontSize: 16,
    marginBottom: 16,
  },
  wishlistItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  wishlistItemText: {
    fontSize: 16,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});

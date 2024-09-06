import React, { useState } from "react";
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

const Wishlist = ({ route, navigation }) => {
  const { wishlist, toggleWishlist } = route.params;
  const [localWishlist, setLocalWishlist] = useState(wishlist);
  const [message, setMessage] = useState("");
  const staticUserId = "staticUser123"; // Static user ID

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
            axios
              .post("http://192.168.7.55:8089/api/wishlist/remove", {
                productId: product._id,
                userId: staticUserId,
              })
              .then(() => {
                toggleWishlist(product); // Update the wishlist state in App
                setLocalWishlist((prevWishlist) =>
                  prevWishlist.filter((item) => item._id !== product._id)
                ); // Update local state
                setMessage("Successfully deleted");
                setTimeout(() => setMessage(""), 2000); // Clear message after 2 seconds
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
            toggleWishlist,
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
      {localWishlist.length > 0 ? (
        <FlatList
          data={localWishlist}
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

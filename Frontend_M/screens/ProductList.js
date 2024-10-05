import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { useWishlist } from "./WishlistContext.js";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import { IPAddress } from "../config"; // Ensure this is correctly pointing to your config

const ProductList = ({ navigation }) => {
  const { refreshContext, refreshWishlistContext } = useWishlist();
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState(null); // State for user ID
  const [refresh, setRefresh] = useState(1);

  useEffect(() => {
    const fetchUserIdAndWishlist = async () => {
      const storedUserId = await AsyncStorage.getItem("userID"); // Get user ID from AsyncStorage
      setUserId(storedUserId);
      try {
        const response = await axios.get(
          `http://${IPAddress}:8089/api/wishlist/${storedUserId}`
        );
        setWishlist(response.data.wishlist.products); // Set the wishlist data
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        setMessage("Error fetching wishlist");
        setTimeout(() => setMessage(""), 2000);
      }
    };

    fetchUserIdAndWishlist(); // Fetch user ID on component mount

    // Fetch products
    axios
      .get(`http://${IPAddress}:8089/api/products/products`)
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [refresh, refreshContext]);

  const toggleWishlist = (product) => {
    if (!userId) {
      console.log("User ID is not available.");
      return; // Exit if userId is not available
    }
    console.log(wishlist);
    const isInWishlist = wishlist.some(
      (item) => item.productId._id === product._id
    );
    console.log(isInWishlist);
    const url = isInWishlist
      ? `http://${IPAddress}:8089/api/wishlist/remove`
      : `http://${IPAddress}:8089/api/wishlist/add`;

    // Predefined note for the product; modify this logic as needed
    const note = `Note for ${product.name}`; // Example note, change as needed

    const requestBody = {
      productId: product._id,
      userId: userId,
      note: note, // Pass the predefined note
    };

    axios
      .post(url, requestBody)
      .then((res) => {
        console.log(res.data);
        setRefresh(refresh + 1);
        refreshWishlistContext();
      })
      .catch((err) => {
        console.error(
          "Error toggling wishlist:",
          err.response?.data || err.message
        ); // Log specific error
      });
  };

  const renderProduct = ({ item }) => {
    const isInWishlist = wishlist.some(
      (product) => product.productId._id === item._id
    ); // Use some for boolean
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("ProductDetail", {
            product: item,
            toggleWishlist,
            isInWishlist,
          })
        }
      >
        <View style={styles.productContainer}>
          <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
          <View style={styles.productDetails}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>LKR {item.price}</Text>
          </View>
          <TouchableOpacity onPress={() => toggleWishlist(item)}>
            <Icon
              name={isInWishlist ? "heart" : "heart-outline"}
              size={30}
              color={isInWishlist ? "red" : "gray"}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={renderProduct}
      />
    </View>
  );
};

export default ProductList;

// Styles remain unchanged...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  productContainer: {
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
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  productDetails: {
    flex: 1,
    justifyContent: "center",
    marginLeft: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  productPrice: {
    fontSize: 16,
    color: "green",
  },
});

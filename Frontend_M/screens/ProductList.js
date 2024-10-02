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
import { useWishlist } from "./WishlistContext.js"; // Adjust the path accordingly
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import { IPAddress } from "../config.js";

const ProductList = ({ navigation }) => {
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist(); // Use the context
  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState(null); // State for user ID

  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = await AsyncStorage.getItem("userID"); // Get user ID from AsyncStorage
      setUserId(storedUserId);
    };

    fetchUserId(); // Fetch user ID on component mount

    // Fetch products
    axios
      .get(`http://${IPAddress}:8089/api/products/products`)
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const toggleWishlist = (product) => {
    if (!userId) {
      console.log("User ID is not available.");
      return; // Exit if userId is not available
    }

    const isInWishlist = wishlist.some((item) => item._id === product._id);
    const url = isInWishlist
      ? `http://${IPAddress}:8089/api/wishlist/remove`
      : `http://${IPAddress}:8089/api/wishlist/add`;

    const requestBody = {
      productId: product._id,
      userId: userId,
    };

    axios
      .post(url, requestBody)
      .then(() => {
        if (isInWishlist) {
          removeFromWishlist(product._id);
        } else {
          addToWishlist(product);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const renderProduct = ({ item }) => {
    const isInWishlist = wishlist.some((product) => product._id === item._id); // Use some for boolean
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

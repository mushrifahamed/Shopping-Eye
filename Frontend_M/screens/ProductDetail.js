import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import { IPAddress } from "../config";

const ProductDetail = ({ route }) => {
  const { product, productId, toggleWishlist, isInWishlist } = route.params;
  const [shop, setShop] = useState([]);
  const [fetchedProduct, setFetchedProduct] = useState(product);
  const [userId, setUserId] = useState(null); // State for user ID
  const [isInWishlistState, setIsInWishlistState] = useState(isInWishlist); // Local wishlist state

  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = await AsyncStorage.getItem("userId"); // Get user ID from AsyncStorage
      setUserId(storedUserId);
    };

    fetchUserId(); // Fetch user ID on component mount

    const fetchProductDetails = async () => {
      if (!product) {
        // Only fetch if product isn't already provided
        try {
          const response = await axios.get(
            `http://${IPAddress}/api/products/products/${
              productId ? productId : product._id
            }` // Use product ID
          );
          setFetchedProduct(response.data);
        } catch (err) {
          console.error("Could not fetch product details");
        }
      }
    };

    fetchProductDetails();
  }, [product]);

  useEffect(() => {
    const fetchShop = async () => {
      if (fetchedProduct) {
        try {
          const response = await axios.get(
            `http://${IPAddress}:8089/api/wishlist/shop-by-product/${fetchedProduct.name}`
          );
          setShop(response.data);
        } catch (err) {
          console.error("Could not fetch shop details");
        }
      }
    };

    fetchShop();
  }, [fetchedProduct]);

  // Update the local wishlist state when the prop changes
  useEffect(() => {
    setIsInWishlistState(isInWishlist);
  }, [isInWishlist]);

  const handleWishlistToggle = () => {
    // Check if the product is already in the wishlist
    if (isInWishlistState) {
      // If it's already in the wishlist, remove it
      toggleWishlist(fetchedProduct, false); // Assuming toggleWishlist accepts a second parameter for removal
    } else {
      // If it's not in the wishlist, add it
      toggleWishlist(fetchedProduct, true); // Assuming toggleWishlist accepts a second parameter for addition
    }
    setIsInWishlistState(!isInWishlistState); // Toggle local state
  };

  if (!fetchedProduct) {
    return <Text>Loading...</Text>; // Simple loading state
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: fetchedProduct.imageUrl }}
        style={styles.productImage}
      />
      <Text style={styles.productCategory}>
        Category: {fetchedProduct.category}
      </Text>
      <Text style={styles.productName}>{fetchedProduct.name}</Text>
      <Text style={styles.productPrice}>
        LKR {fetchedProduct.price.toFixed(2)}
      </Text>
      <Text style={styles.productDescription}>
        {fetchedProduct.description}
      </Text>
      <TouchableOpacity
        onPress={handleWishlistToggle}
        style={styles.wishlistButton}
      >
        <Icon
          name={isInWishlistState ? "heart" : "heart-outline"}
          size={30}
          color={isInWishlistState ? "red" : "gray"}
        />
      </TouchableOpacity>

      <View style={styles.shopContainer}>
        <Text style={styles.shopTitle}>Available at:</Text>
        {shop.map((Shop, index) => (
          <View key={Shop.id || `shop-${index}`}>
            <Text style={styles.shopName}>{Shop.name}</Text>
            <Text style={styles.shopDescription}>{Shop.description}</Text>
            <Text style={styles.shopLocation}>Location: {Shop.location}</Text>
            <Text style={styles.shopLocation}>
              Contact Number: {Shop.contactInfo.phone}
            </Text>
            <Text style={styles.shopLocation}>
              Email: {Shop.contactInfo.email}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default ProductDetail;

// Styles remain unchanged...
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  productImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  productDescription: {
    fontSize: 16,
    color: "gray",
    marginBottom: 10,
    textAlign: "center",
  },
  productPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "green",
    marginBottom: 10,
  },
  productCategory: {
    fontSize: 16,
    color: "blue",
    marginBottom: 20,
  },
  wishlistButton: {
    marginTop: 20,
  },
  shopContainer: {
    marginTop: 30,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
  },
  shopTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  shopName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  shopDescription: {
    fontSize: 14,
    color: "gray",
    marginBottom: 10,
    textAlign: "center",
  },
  shopLocation: {
    fontSize: 14,
    color: "gray",
    marginBottom: 5,
  },
});

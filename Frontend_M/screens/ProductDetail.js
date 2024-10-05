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
import { IPAddress } from "../config.js";

const ProductDetail = ({ route }) => {
  const { product, productId, toggleWishlist, isInWishlist } = route.params;
  const [shop, setShop] = useState([]);
  const [fetchedProduct, setFetchedProduct] = useState(product);
  const [userId, setUserId] = useState(null); // State for user ID

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
            `http://${IPAddress}:8089/api/products/products/${
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

  useEffect(() => {
    // Invoke tap count API when the product is fetched or updated
    const handleTapCount = async () => {
      if (fetchedProduct) {
        try {
          await axios.post(`http://${IPAddress}:8089/api/tapcount/handletap`, {
            objectId: fetchedProduct._id, // Use the fetched product ID
            objectType: "Product", // Specify the type as Product
          });
        } catch (err) {
          console.error("Failed to record tap count");
        }
      }
    };

    handleTapCount();
  }, [fetchedProduct]);

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
        onPress={() => toggleWishlist(fetchedProduct)}
        style={styles.wishlistButton}
      >
        <Icon
          name={isInWishlist ? "heart" : "heart-outline"}
          size={30}
          color={isInWishlist ? "red" : "gray"}
        />
      </TouchableOpacity>

      <View style={styles.shopContainer}>
        <Text style={styles.shopTitle}>Available at:</Text>
        {shop.map((Shop, index) => (
          <View key={index}>
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

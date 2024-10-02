import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { IPAddress } from "../config";

const CategoryProducts = ({ route, navigation }) => {
  const { category } = route.params;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlist, setWishlist] = useState([]);

  const toggleWishlist = (productId) => {
    setWishlist((prevWishlist) => {
      if (prevWishlist.includes(productId)) {
        return prevWishlist.filter((id) => id !== productId);
      } else {
        return [...prevWishlist, productId];
      }
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.includes(productId);
  };

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        const response = await axios.get(
          `http://${IPAddress}:8089/api/products/products`
        );
        const filteredProducts = response.data.filter(
          (product) => product.category === category
        );
        setProducts(filteredProducts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products");
        setLoading(false);
      }
    };

    fetchProductsByCategory();
  }, [category]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{category} Products</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.productItem}
            onPress={() =>
              navigation.navigate("ProductDetail", {
                product: item,
                toggleWishlist,
                isInWishlist: isInWishlist(item._id),
              })
            }
          >
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.productImage}
            />
            <View style={styles.productDetails}>
              <Text style={styles.productText}>{item.name}</Text>
              <Text style={styles.productPrice}>Price: ${item.price}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  errorText: {
    color: "red",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  productItem: {
    flexDirection: "row",
    margin: 8,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    alignItems: "center",
    padding: 8,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
  },
  productDetails: {
    flex: 1,
  },
  productText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  productPrice: {
    fontSize: 16,
    color: "gray",
  },
});

export default CategoryProducts;

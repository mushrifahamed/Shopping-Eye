import React from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const ProductDetail = ({ route }) => {
  const { product, toggleWishlist, isInWishlist } = route.params;

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
      <Text style={styles.productCategory}>Category: {product.category}</Text>
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productPrice}>LKR {product.price.toFixed(2)}</Text>
      <Text style={styles.productDescription}>{product.description}</Text>
      <TouchableOpacity
        onPress={() => toggleWishlist(product)}
        style={styles.wishlistButton}
      >
        <Icon
          name={isInWishlist ? "heart" : "heart-outline"}
          size={30}
          color={isInWishlist ? "red" : "gray"}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ProductDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity, Button } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

const ProductList = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    // Fetch products from backend
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8089/api/products/getProducts');
        setProducts(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, []);

  const toggleWishlist = (product) => {
    if (wishlist.find(item => item.id === product._id)) {
      setWishlist(wishlist.filter(item => item.id !== product._id));
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  const renderProduct = ({ item }) => {
    const isInWishlist = wishlist.find(product => product._id === item._id);
    return (
      <TouchableOpacity onPress={() => navigation.navigate('ProductDetail', { product: item, toggleWishlist, isInWishlist })}>
        <View style={styles.productContainer}>
          <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
          <View style={styles.productDetails}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>{item.price}</Text>
          </View>
          <TouchableOpacity onPress={() => toggleWishlist(item)}>
            <Icon
              name={isInWishlist ? 'heart' : 'heart-outline'}
              size={30}
              color={isInWishlist ? 'red' : 'gray'}
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
      <Button title="Go to Wishlist" onPress={() => navigation.navigate('Wishlist', { wishlist, toggleWishlist })} />
    </View>
  );
};

export default ProductList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  productDetails: {
    flex: 1,
    marginLeft: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 16,
    color: 'gray',
  },
});

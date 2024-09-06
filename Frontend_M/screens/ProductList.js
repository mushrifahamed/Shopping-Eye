import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity, Button } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

const ProductList = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const staticUserId = 'staticUser123'; // Static user ID

  useEffect(() => {
    axios.get('http://192.168.7.55:8089/api/products/products')
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error(err);
      });

    axios.get(`http://192.168.7.55:8089/api/wishlist/${staticUserId}`)
      .then((res) => {
        setWishlist(res.data.wishlist.products);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const toggleWishlist = (product) => {
    const isInWishlist = wishlist.find(item => item._id === product._id);

    if (isInWishlist) {
      axios.post('http://192.168.7.55:8089/api/wishlist/remove', { productId: product._id, userId: staticUserId })
        .then(() => {
          setWishlist(wishlist.filter(item => item._id !== product._id));
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      console.log(product._id)
      axios.post('http://192.168.7.55:8089/api/wishlist/add', { productId: product._id, userId: staticUserId })
        .then(() => {
          setWishlist([...wishlist, product]);
        })
        .catch((err) => {
          console.error(err);
        });
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
            <Text style={styles.productPrice}>LKR {item.price}</Text>
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
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  productContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
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
    justifyContent: 'center',
    marginLeft: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 16,
    color: 'green',
  },
});

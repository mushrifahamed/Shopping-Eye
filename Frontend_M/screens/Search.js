import React, { useEffect, useState } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import { IPAddress } from '../config';

const Search = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [shops, setShops] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await axios.get(`http://${IPAddress}:8089/api/products/products`);
        const shopsResponse = await axios.get(`http://${IPAddress}:8089/api/other/shops`);
        
        setProducts(productsResponse.data);
        setShops(shopsResponse.data);
        setFilteredResults([...productsResponse.data, ...shopsResponse.data]); // Initialize with all products and shops
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Filter products and shops based on the search term
    const results = [
      ...products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
      ...shops.filter(shop => 
        shop.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    ];
    setFilteredResults(results);
  }, [searchTerm, products, shops]);

  const renderResultItem = ({ item }) => {
    if (item.imageUrl) { // Assuming products have 'imageUrl'
      return (
        <TouchableOpacity style={styles.productItem} onPress={() => navigation.navigate('ProductDetails', { productId: item._id })}>
          <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
          <Text style={styles.productText}>{item.name}</Text>
          <Text style={styles.productPrice}>Price: ${item.price}</Text>
        </TouchableOpacity>
      );
    } else { // Assuming shops do not have 'imageUrl'
      return (
        <TouchableOpacity style={styles.shopItem} onPress={() => navigation.navigate('ShopDetails', { shopId: item._id })}>
          <Image source={{ uri: item.image }} style={styles.shopImage} />
          <Text style={styles.shopText}>{item.name}</Text>
          <Text style={styles.shopLocation}>Location: {item.location}</Text>
        </TouchableOpacity>
      );
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search products or shops..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      <FlatList
        data={filteredResults}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderResultItem}
        contentContainerStyle={styles.resultList}
      />
    </View>
  );
};

// Styles for the Search component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  searchInput: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  resultList: {
    paddingBottom: 20,
  },
  productItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  productText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  productPrice: {
    fontSize: 14,
    color: '#888',
  },
  shopItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  shopImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  shopText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  shopLocation: {
    fontSize: 14,
    color: '#888',
  },
});

export default Search;

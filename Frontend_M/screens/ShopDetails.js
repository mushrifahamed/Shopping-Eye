import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, FlatList } from 'react-native';
import axios from 'axios';
import { IPAddress } from '../config';

const ShopDetails = ({ route }) => {
  const { shopId } = route.params;
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('Shop ID:', shopId);

  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        const response = await axios.get(`http://${IPAddress}:8089/api/other/shops/${shopId}`);
        setShop(response.data);

        await axios.post(`http://${IPAddress}:8089/api/tapcount/handletap`, {
          objectId: shopId,
          objectType: 'Shop',
        });
      } catch (err) {
        setError('Failed to fetch shop details');
      } finally {
        setLoading(false);
      }
    };

    fetchShopDetails();
  }, [shopId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  const renderProductItem = ({ item }) => (
    <View style={styles.productItem}>
      <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>Price: LKR {item.price}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {shop.imageUrl && (
        <Image
          source={{ uri: shop.imageUrl }}
          style={styles.shopImage}
        />
      )}
      <Text style={styles.shopName}>{shop.name}</Text>
      <Text style={styles.shopDescription}>{shop.description}</Text>
      <Text style={styles.shopLocation}>Location: {shop.location}</Text>
      {shop.contactInfo && (
        <>
          <Text style={styles.contactInfo}>Phone: {shop.contactInfo.phone}</Text>
          <Text style={styles.contactInfo}>Email: {shop.contactInfo.email}</Text>
        </>
      )}
      
      <Text style={styles.productsTitle}>Products</Text>
      <FlatList
        data={shop.products}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderProductItem}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  shopImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  shopName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  shopDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  shopLocation: {
    fontSize: 16,
    marginBottom: 10,
  },
  contactInfo: {
    fontSize: 14,
    color: '#888',
  },
  productsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  productItem: {
    marginRight: 10,
    width: 100,
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: 80,
    borderRadius: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  productPrice: {
    fontSize: 12,
    color: '#888',
  },
  errorText: {
    color: 'red',
  },
});

export default ShopDetails;

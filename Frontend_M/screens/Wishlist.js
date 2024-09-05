import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Wishlist = ({ route, navigation }) => {
  const { wishlist, toggleWishlist } = route.params;
  const [localWishlist, setLocalWishlist] = useState(wishlist);
  const [message, setMessage] = useState('');

  const handleDelete = (product) => {
    Alert.alert(
      'Remove from Wishlist',
      'Are you sure you want to remove this item from wishlist?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            toggleWishlist(product); // Update the wishlist state in App
            setLocalWishlist((prevWishlist) => prevWishlist.filter(item => item.id !== product.id)); // Update local state
            setMessage('Successfully deleted');
            setTimeout(() => setMessage(''), 2000); // Clear message after 2 seconds
          },
        },
      ],
    );
  };

  const renderWishlistItem = ({ item }) => (
    <View style={styles.wishlistItemContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('ProductDetail', { product: item, toggleWishlist, isInWishlist: true })}>
        <Text style={styles.wishlistItemText}>{item.name} - {item.price}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDelete(item)}>
        <Icon name="trash" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Wishlist</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {localWishlist.length > 0 ? (
        <FlatList
          data={localWishlist}
          keyExtractor={(item) => item.id}
          renderItem={renderWishlistItem}
        />
      ) : (
        <Text style={styles.emptyText}>Your wishlist is empty.</Text>
      )}
    </View>
  );
};

export default Wishlist;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  wishlistItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  wishlistItemText: {
    fontSize: 18,
  },
  emptyText: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
    marginTop: 50,
  },
  message: {
    fontSize: 18,
    color: 'green',
    textAlign: 'center',
    marginBottom: 20,
  },
});


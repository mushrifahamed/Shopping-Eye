import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { IPAddress } from "../config";
// Import Wishlist Context

const Home = () => {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [shops, setShops] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Use wishlist context

  const productColumns = 2;
  const shopColumns = 2;

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(IPAddress);
        const categoriesResponse = await axios.get(
          `http://${IPAddress}:8089/api/other/categories`
        );
        setCategories(categoriesResponse.data);

        const productsResponse = await axios.get(
          `http://${IPAddress}:8089/api/products/products`
        );
        setProducts(productsResponse.data);

        const shopsResponse = await axios.get(
          `http://${IPAddress}:8089/api/other/shops`
        );
        setShops(shopsResponse.data);

        const promotionsResponse = await axios.get(
          `http://${IPAddress}:8089/api/promotion/listPromotions`
        );
        setPromotions(promotionsResponse.data);

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
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

  const handleCategoryPress = (category) => {
    navigation.navigate("CategoryProducts", { category });
  };

  const handleProfilePress = () => {
    navigation.navigate("Profile");
  };

  const handleSearchPress = () => {
    navigation.navigate("Search"); // Navigate to the Search screen
  };

    // Render product item with wishlist toggle
  const renderProductItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.productItem}
        onPress={() =>
          navigation.navigate("ProductDetail", {
            product: item,
          })
        }
      >
        <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
        <Text style={styles.productText}>{item.name}</Text>
        <Text style={styles.productPrice}>Price: LKR {item.price}</Text>
        </TouchableOpacity>
    );
  };

  const renderShopItem = ({ item }) => (
    <TouchableOpacity
      style={styles.shopItem}
      onPress={() => navigation.navigate("ShopDetails", { shopId: item._id })}
    >
      <Image source={{ uri: item.image }} style={styles.shopImage} />
      <Text style={styles.shopText}>{item.name}</Text>
      <Text style={styles.shopLocation}>Location: {item.location}</Text>
    </TouchableOpacity>
  );

  const renderPromotionItem = ({ item }) => (
    <View style={styles.promotionItem}>
      <Image source={{ uri: item.image_url }} style={styles.promotionImage} />
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleSearchPress}
            style={styles.searchIcon}
          >
            <Ionicons name="search-outline" size={30} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Home</Text>
          <TouchableOpacity
            onPress={handleProfilePress}
            style={styles.profileIcon}
          >
            <Ionicons name="person-circle-outline" size={30} color="black" />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Categories</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => handleCategoryPress(category)}
              style={styles.categoryItem}
            >
              <Text style={styles.categoryText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.title}>Promotions</Text>
        <FlatList
          data={promotions}
          keyExtractor={(item) => item._id.toString()}
          horizontal
          renderItem={renderPromotionItem}
          showsHorizontalScrollIndicator={false}
          style={styles.promotionScroll}
        />

        <Text style={styles.title}>Products</Text>
        <FlatList
          data={products}
          keyExtractor={(item) => item._id.toString()}
          numColumns={productColumns}
          renderItem={renderProductItem}
          columnWrapperStyle={styles.productColumnWrapper}
          scrollEnabled={false}
        />

        <Text style={styles.title}>Shops</Text>
        <FlatList
          data={shops}
          keyExtractor={(item) => item._id.toString()}
          numColumns={shopColumns}
          renderItem={renderShopItem}
          columnWrapperStyle={styles.shopColumnWrapper}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  );
};

// Styles for the Home component
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    flex: 1,
    textAlign: "center",
  },
  searchIcon: {
    padding: 10,
  },
  profileIcon: {
    padding: 10,
  },
  categoryScroll: {
    marginBottom: 20,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  categoryText: {
    marginLeft: 5,
    fontSize: 18,
  },
  promotionScroll: {
    marginBottom: 20,
  },
  promotionItem: {
    marginRight: 10,
  },
  promotionImage: {
    width: 150,
    height: 100,
    borderRadius: 10,
  },
  productColumnWrapper: {
    justifyContent: "space-between",
    marginBottom: 20,
  },
  productItem: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    width: "48%",
  },
  productImage: {
    width: "100%",
    height: 100,
    borderRadius: 10,
  },
  productText: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 5,
  },
  productPrice: {
    fontSize: 14,
    color: "#888",
  },
  shopColumnWrapper: {
    justifyContent: "space-between",
    marginBottom: 20,
  },
  shopItem: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    width: "48%",
  },
  shopImage: {
    width: "100%",
    height: 100,
    borderRadius: 10,
  },
  shopText: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 5,
  },
  shopLocation: {
    fontSize: 14,
    color: "#888",
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
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
  scrollContainer: {
    flexGrow: 1,
  },
});

export default Home;

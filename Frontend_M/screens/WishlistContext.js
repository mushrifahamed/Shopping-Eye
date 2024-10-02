import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

const WishlistContext = createContext();

export const useWishlist = () => {
  return useContext(WishlistContext);
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  // Load wishlist from AsyncStorage
  useEffect(() => {
    const loadWishlist = async () => {
      const storedWishlist = await AsyncStorage.getItem("wishlist");
      if (storedWishlist) {
        setWishlist(JSON.parse(storedWishlist)); // Parse JSON string to array
      }
    };

    loadWishlist(); // Load wishlist on mount
  }, []);

  // Save wishlist to AsyncStorage whenever it changes
  useEffect(() => {
    const saveWishlist = async () => {
      await AsyncStorage.setItem("wishlist", JSON.stringify(wishlist)); // Store as JSON string
    };

    saveWishlist(); // Save wishlist whenever it changes
  }, [wishlist]);

  const addToWishlist = (product) => {
    setWishlist((prevWishlist) => [...prevWishlist, product]);
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prevWishlist) =>
      prevWishlist.filter((item) => item._id !== productId)
    );
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

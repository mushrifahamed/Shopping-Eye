import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useWishlist } from "./WishlistContext.js";
import { IPAddress } from "../config.js";

const Wishlist = ({ navigation }) => {
  const { refreshContext, refreshWishlistContext } = useWishlist();
  const [wishlist, setWishlist] = useState([]);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [note, setNote] = useState("");
  const [refresh, setRefresh] = useState(1);

  // Fetch user ID on component mount

  // Fetch the wishlist from the backend for the specific user
  const fetchWishlist = async (userId) => {
    try {
      const response = await axios.get(
        `http://${IPAddress}:8089/api/wishlist/${userId}`
      );
      setWishlist(response.data.wishlist.products); // Set the wishlist data
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setMessage("Error fetching wishlist");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = await AsyncStorage.getItem("userID");
      setUserId(storedUserId);
      if (storedUserId) {
        fetchWishlist(storedUserId); // Fetch wishlist after retrieving userId
      }
    };
    fetchUserId();
  }, [refresh, refreshContext]);

  const handleDelete = (product) => {
    Alert.alert(
      "Remove from Wishlist",
      "Are you sure you want to remove this item from wishlist?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            if (!userId) return;

            axios
              .post(`http://${IPAddress}:8089/api/wishlist/remove`, {
                productId: product._id,
                userId: userId,
              })
              .then(() => {
                setRefresh(refresh + 1);
                refreshWishlistContext();
                setMessage("Successfully deleted");
                setTimeout(() => setMessage(""), 2000);
              })
              .catch((err) => {
                console.error(err);
                setMessage("Error deleting item");
                setTimeout(() => setMessage(""), 2000);
              });
          },
        },
      ]
    );
  };

  // Open the note modal for a specific product
  const handleNote = (product) => {
    setSelectedProduct(product); // Store the product being edited
    setNote(product.note || ""); // Load existing note if available
    setNoteModalVisible(true);
  };

  // Add or Update Note for the product
  const saveNote = () => {
    if (selectedProduct) {
      axios
        .post(`http://${IPAddress}:8089/api/wishlist/update-note`, {
          productId: selectedProduct.productId._id,
          userId: userId,
          note: note,
        })
        .then(() => {
          selectedProduct.note = note; // Save note locally
          setNoteModalVisible(false);
          setMessage(note ? "Note saved" : "Note added");
          setTimeout(() => setMessage(""), 2000);
        })
        .catch((err) => {
          console.error(err.message);
          setMessage("Error saving note");
          setTimeout(() => setMessage(""), 2000);
        });
    }
  };

  // Delete note for the product
  const deleteNote = () => {
    if (selectedProduct) {
      axios
        .post(`http://${IPAddress}:8089/api/wishlist/delete-note`, {
          productId: selectedProduct.productId._id,
          userId: userId,
        })
        .then(() => {
          selectedProduct.note = ""; // Clear the note locally
          setNote(""); // Clear note state
          setNoteModalVisible(false);
          setMessage("Note deleted");
          setTimeout(() => setMessage(""), 2000);
        })
        .catch((err) => {
          console.error(err);
          setMessage("Error deleting note");
          setTimeout(() => setMessage(""), 2000);
        });
    }
  };

  const renderWishlistItem = ({ item }) => (
    <View style={styles.wishlistItemContainer}>
      <View style={styles.itemTextContainer}>
        {/* Product name */}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ProductDetail", {
              product: item,
              isInWishlist: true,
            })
          }
        >
          <Text style={styles.wishlistItemText} numberOfLines={1}>
            {item.productId.name}
          </Text>
        </TouchableOpacity>

        {/* Display note below the product name if it exists */}
        {item.note ? (
          <Text style={styles.noteText}>
            <Text style={{ fontWeight: "bold" }}>Note: </Text>
            {item.note}
          </Text>
        ) : null}
      </View>

      {/* Icons */}
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => handleNote(item)}>
          <Icon name="pencil" size={24} color="blue" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.productId)}>
          <Icon name="trash" size={24} color="red" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Wishlist</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {wishlist && wishlist.length > 0 ? (
        <FlatList
          data={wishlist}
          keyExtractor={(item) => item._id}
          renderItem={renderWishlistItem}
        />
      ) : (
        <Text style={styles.emptyText}>Your wishlist is empty.</Text>
      )}

      {/* Modal for managing notes */}
      <Modal
        visible={noteModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setNoteModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedProduct?.note ? "Update Note" : "Add Note"}
            </Text>

            <TextInput
              style={styles.noteInput}
              value={note}
              onChangeText={(text) => setNote(text)}
              placeholder="Enter your note here..."
              multiline
            />

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={saveNote}>
                <Text style={styles.buttonText}>
                  {selectedProduct?.note ? "Update Note" : "Add Note"}
                </Text>
              </TouchableOpacity>

              {/* Delete Note Option if note exists */}
              {selectedProduct?.note ? (
                <TouchableOpacity
                  style={[styles.button, styles.deleteButton]}
                  onPress={deleteNote}
                >
                  <Text style={styles.buttonText}>Delete Note</Text>
                </TouchableOpacity>
              ) : null}

              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setNoteModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Wishlist;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  message: {
    color: "green",
    fontSize: 16,
    marginBottom: 16,
  },
  wishlistItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemTextContainer: {
    flex: 1, // Allow text container to expand and fill available space
    marginRight: 10, // Add some margin to avoid overlap with icons
  },
  wishlistItemText: {
    fontSize: 16,
  },
  noteText: {
    fontSize: 14,
    marginTop: 5,
    color: "#555",
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  iconContainer: {
    flexDirection: "row",
  },
  icon: {
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    height: 100,
  },
  buttonContainer: {
    flexDirection: "column", // Change direction to column to stack buttons
    justifyContent: "space-between",
    alignItems: "stretch", // Make sure buttons stretch full width
  },
  button: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#007bff",
    marginBottom: 10, // Add margin to separate the buttons
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "red",
  },
  cancelButton: {
    backgroundColor: "gray",
  },
});

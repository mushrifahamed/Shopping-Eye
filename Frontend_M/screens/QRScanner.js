import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Alert } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

export default function BarcodeScanner() {
  const [hasPermission, setHasPermission] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanned, setScanned] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    // Function to get camera permission
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Simulate resetting the app by resetting key states
      setScanned(false); // Reset scanned state
      setLoading(false); // Reset loading state
      setHasPermission(null); // Reset permission state, forces a re-check

      // Recheck camera permissions each time the QR scanner is visited
      const resetPermissions = async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === "granted");
      };

      resetPermissions(); // Check permissions again
    }, [])
  );

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    setLoading(true);

    try {
      if (data) {
        setLoading(false);
        navigation.navigate("ProductDetail", {
          productId: data,
        });
      } else {
        Alert.alert(
          "No product found",
          `The scanned barcode did not match any product.`
        );
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      Alert.alert(
        "Error",
        "There was a problem retrieving the product. Please try again."
      );
    } finally {
      setLoading(false); // Stop loading after the operation
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={StyleSheet.absoluteFillObject}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      )}
    </View>
  );
}

import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, Alert } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

export default function BarcodeScanner() {
  const [hasPermission, setHasPermission] = useState(null);
  const [test, setTest] = useState("close");
  const [scanned, setScanned] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    try {
      if (data) {
        navigation.navigate("ProductDetail", {
          productId: data,
        });
      } else {
        Alert.alert(
          "No product found",
          `The scanned barcode did not match ${data} any product.`
        );
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      Alert.alert(
        "Error",
        "There was a problem retrieving the product. Please try again."
      );
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
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && <Button title={test} onPress={() => setScanned(false)} />}
    </View>
  );
}

import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import axios from "axios";
import { IPAddress } from "../config";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleForgotPassword = async () => {
    try {
      const response = await axios.post(
        `http://${IPAddress}:8089/api/user/reset-password`,
        {
          email,
        }
      );
      console.log(response.data);
      alert("Password reset link sent to your email");
    } catch (error) {
      console.error(error);
      alert("Error sending password reset link");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <Button title="Send Reset Link" onPress={handleForgotPassword} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default ForgotPassword;

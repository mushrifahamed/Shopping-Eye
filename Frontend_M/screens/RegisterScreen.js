import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import axios from "axios";
import { IPAddress } from "../config";

const RegisterScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const response = await axios.post(
        `http://${IPAddress}:8089/api/user/register`,
        {
          fullName,
          email,
          password,
        }
      );
      console.log(response.data);
      navigation.navigate("Login");
    } catch (error) {
      if (error.response) {
        console.error("Error Response:", error.response.data);
        console.error("Error Status:", error.response.status);
      } else if (error.request) {
        console.error("Error Request:", error.request);
      } else {
        console.error("Error Message:", error.message);
      }
    }
  };
  

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      <Button title="Register" onPress={handleRegister} />
      <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
        Already have an account? Login
      </Text>
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
  link: {
    marginTop: 10,
    color: "blue",
  },
});

export default RegisterScreen;

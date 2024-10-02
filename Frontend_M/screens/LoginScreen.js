import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import axios from "axios";
import { IPAddress } from '../config';

const LoginScreen = ({ navigation, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `http://${IPAddress}:8089/api/user/login`,
        {
          email,
          password,
        }
      );
      console.log(response.data);

      onLoginSuccess(response.data.token , response.data._id); // Call the onLoginSuccess function with the token

      // Navigate to home after successful login
      //navigation.navigate("Home");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
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
      <Button title="Login" onPress={handleLogin} />
      <Text style={styles.link} onPress={() => navigation.navigate("Register")}>
        Not registered? Sign up
      </Text>
      <Text
        style={styles.link}
        onPress={() => navigation.navigate("ForgotPassword")}
      >
        Forgot password?
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

export default LoginScreen;

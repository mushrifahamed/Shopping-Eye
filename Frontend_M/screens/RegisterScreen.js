import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableWithoutFeedback, Dimensions } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Speech from 'expo-speech';

const RegisterScreen = () => {
    const [isBiometricSupported, setIsBiometricSupported] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const checkBiometricSupport = async () => {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            setIsBiometricSupported(compatible);

            // Inform the user about biometric options
            if (compatible) {
                speakText('If you are disabled, tap on the bottom of the screen to use fingerprint authentication.');
            } else {
                speakText('Biometric authentication is not available on this device. Please enter your details to register.');
            }
        };
        checkBiometricSupport();
    }, []);

    const speakText = (text) => {
        Speech.speak(text, {
            rate: 1.0, // Adjust the speaking rate
            pitch: 1.0, // Adjust the pitch
        });
    };

    const handleBiometricRegistration = async () => {
        try {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Authenticate to complete registration',
                fallbackLabel: 'Use Passcode', // Fallback option for devices that don't support biometrics
            });

            if (result.success) {
                speakText('Registration successful. You are now registered.');
                Alert.alert('Registration Successful', 'You are now registered.');
                // Example: navigation.navigate('Home');
            } else {
                speakText('Authentication failed. Please try again.');
                Alert.alert('Authentication Failed', 'Please try again.');
            }
        } catch (error) {
            speakText('An error occurred during authentication. Please try again.');
            Alert.alert('Error', 'An error occurred during authentication. Please try again.');
        }
    };

    const handleScreenTap = (event) => {
        const screenHeight = Dimensions.get('window').height; // Get the screen height
        const tapPositionY = event.nativeEvent.pageY; // Get the Y position of the tap

        // Check if the tap is at the bottom of the screen
        if (isBiometricSupported && tapPositionY > screenHeight - 100) {
            handleBiometricRegistration();
        } else if (!isBiometricSupported) {
            speakText('Biometric authentication is not supported on this device.');
        }
    };

    const handleNormalRegistration = () => {
        // Implement your normal registration logic here
        speakText('Registration successful. You are now registered.');
        Alert.alert('Registration Successful', 'You are now registered.');
        // Example: navigation.navigate('Home');
    };

    return (
        <TouchableWithoutFeedback onPress={handleScreenTap}>
            <View style={styles.container}>
                <View style={styles.normalContainer}>
                    <Text style={styles.title}>Register</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        value={username}
                        onChangeText={setUsername}
                        accessibilityLabel="Enter your username"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                        accessibilityLabel="Enter your email"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        accessibilityLabel="Enter your password"
                    />
                    <Button title="Register" onPress={handleNormalRegistration} />
                    {/* Additional prompt for disabled users */}
                    <Text style={styles.infoText}>
                        If you are disabled, tap on the bottom of the screen to use fingerprint authentication.
                    </Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#f5f5f5',
    },
    normalContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 15,
        paddingLeft: 10,
        borderRadius: 5,
    },
    infoText: {
        fontSize: 16,
        color: 'blue',
        marginTop: 20,
        textAlign: 'center',
    },
});

export default RegisterScreen;

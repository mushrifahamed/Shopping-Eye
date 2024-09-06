// src/screens/OnboardingScreen.js
import React, { useEffect } from 'react';
import { View, Text, TouchableWithoutFeedback, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Speech from 'expo-speech';

const OnboardingScreen = () => {
    const navigation = useNavigation();

    const speakText = (text) => {
        Speech.speak(text, {
            rate: 1.0, // Adjust the speaking rate (0.1 to 2.0)
            pitch: 1.0, // Adjust the pitch (0.1 to 2.0)
        });
    };

    useEffect(() => {
        // Speak the welcome text when the screen loads
        speakText('Welcome to Shopping Eye. Double tap anywhere to get started.');
    }, []); // Empty dependency array ensures this runs only once when the component mounts

    const handleDoubleTap = () => {
        speakText('Navigating to the registration screen.');
        navigation.navigate('Register');
    };

    return (
        <TouchableWithoutFeedback onPress={handleDoubleTap}>
            <View style={styles.container}>
                <Text
                    style={styles.title}
                    accessibilityRole="header"
                    accessibilityLabel="Welcome to Shopping Eye"
                >
                    Welcome to Shopping Eye
                </Text>
                {/* You can still use a button for additional functionality or feedback */}
                {/* 
                <TouchableOpacity
                    onPress={() => {
                        speakText('Get Started with Shopping Eye. Double tap to navigate to the registration screen.');
                        navigation.navigate('Register');
                    }}
                    accessibilityLabel="Get Started with Shopping Eye"
                    accessibilityHint="Double tap to navigate to the registration screen"
                    accessibilityRole="button"
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>
                */}
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
});

export default OnboardingScreen;

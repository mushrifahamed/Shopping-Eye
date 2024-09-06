// src/screens/DisabledHomeScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';

const DisabledHomeScreen = () => {
    const onSwipe = (gestureName) => {
        const { SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;
        switch (gestureName) {
            case SWIPE_UP:
                console.log('Navigating to Feature A');
                break;
            case SWIPE_DOWN:
                console.log('Navigating to Feature B');
                break;
            case SWIPE_LEFT:
                console.log('Navigating to Feature C');
                break;
            case SWIPE_RIGHT:
                console.log('Navigating to Feature D');
                break;
            default:
                console.log('Unknown Gesture');
        }
    };

    return (
        <GestureRecognizer
            onSwipe={(direction) => onSwipe(direction)}
            config={{
                velocityThreshold: 0.3,
                directionalOffsetThreshold: 80,
            }}
            style={styles.container}
        >
            <View style={styles.container}>
                <Text style={styles.title}>Draw Gestures to Navigate</Text>
                <Text style={styles.instruction}>Swipe Up: Feature A</Text>
                <Text style={styles.instruction}>Swipe Down: Feature B</Text>
                <Text style={styles.instruction}>Swipe Left: Feature C</Text>
                <Text style={styles.instruction}>Swipe Right: Feature D</Text>
            </View>
        </GestureRecognizer>
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
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    instruction: {
        fontSize: 16,
        marginBottom: 10,
    },
});

export default DisabledHomeScreen;

// screens/ProfileScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { IPAddress } from '../config';
import { useNavigation } from '@react-navigation/native';

const Profile = ({ setIsAuthenticated }) => {
  const navigation = useNavigation(); // Get navigation object
  const [user, setUser] = useState(null); // State to store user information
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const response = await axios.get(`http://${IPAddress}:8089/api/user/profile`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          // Validate the response data before setting user
          if (response.data && response.status === 200) {
            setUser(response.data);
          } else {
            console.error('Unexpected response:', response);
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error.message);
        setUser(null); // Set user to null in case of error
      } finally {
        setLoading(false);
      }      
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token'); // Remove the token from storage
      setUser(null); // Clear user state
      setIsAuthenticated(false); // This will switch to AuthStack
    } catch (error) {
      console.error('Failed to logout:', error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text style={styles.fullName}>Full Name: {user.fullName}</Text>
          <Text style={styles.email}>Email: {user.email}</Text>
          <View style={styles.loyaltyContainer}>
            <Text style={styles.loyaltyText}>Loyalty Points: 100</Text>
            <Text style={styles.loyaltyText}>Redeemed Points: 20</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.errorText}>Failed to load user data</Text>
      )}
    </View>
  );
};

// Styles for the Profile screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa', // Light background color for better contrast
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#343a40', // Dark color for better readability
  },
  email: {
    fontSize: 20,
    color: '#495057',
    marginBottom: 20,
  },
  loyaltyContainer: {
    backgroundColor: '#ffffff', // White background for loyalty info
    borderRadius: 8,
    padding: 15,
    marginVertical: 20,
    shadowColor: '#000', // Add shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // Elevation for Android shadow
    width: '100%', // Full width of the container
    alignItems: 'center',
  },
  loyaltyText: {
    fontSize: 18,
    color: '#007bff', // Blue color for loyalty points
  },
  logoutButton: {
    backgroundColor: '#dc3545', // Red color for logout button
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});

export default Profile;

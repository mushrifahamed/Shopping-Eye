import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import ProductList from "./screens/ProductList";
import Wishlist from "./screens/Wishlist";
import QRScanner from "./screens/QRScanner";
import ProductDetail from "./screens/ProductDetail";
import Home from "./screens/Home";
import CategoryProducts from "./screens/CategoryProducts";
import ForgotPassword from "./screens/ForgotPassword";
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";
import Profile from "./screens/Profile";
import { WishlistProvider } from "./screens/WishlistContext";
import Search from "./screens/Search";
import ShopDetails from "./screens/ShopDetails";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack Navigator for Home
function HomeStack({ setIsAuthenticated }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeScreen" component={Home} />
      <Stack.Screen name="CategoryProducts" component={CategoryProducts} />
      <Stack.Screen name="Profile">
        {() => <Profile setIsAuthenticated={setIsAuthenticated} />}
      </Stack.Screen>
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="ShopDetails" component={ShopDetails} />
      <Stack.Screen name="ProductDetail" component={ProductDetail} />
    </Stack.Navigator>
  );
}

// Stack Navigator for Products
function ProductStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProductList" component={ProductList} />
      <Stack.Screen name="ProductDetail" component={ProductDetail} />
    </Stack.Navigator>
  );
}

// Stack Navigator for QR Scanner and Product Detail
function QRScannerStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="QRScanner" component={QRScanner} />
      <Stack.Screen name="ProductDetail" component={ProductDetail} />
    </Stack.Navigator>
  );
}

function WishlistStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Wishlist" component={Wishlist} />
      <Stack.Screen name="ProductDetail" component={ProductDetail} />
    </Stack.Navigator>
  );
}

// Stack Navigator for Authentication
function AuthStack({ onLoginSuccess }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login">
        {(props) => <LoginScreen {...props} onLoginSuccess={onLoginSuccess} />}
      </Stack.Screen>
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // State to track loading

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        console.log("Token retrieved:", token); // Debugging log
        setIsAuthenticated(!!token); // Check if the user is authenticated
      } catch (error) {
        console.error("Error checking auth status:", error); // Error handling
      } finally {
        setLoading(false); // Update loading state
      }
    };

    checkAuthStatus();
  }, []);

  const handleLoginSuccess = (token, userID) => {
    AsyncStorage.setItem("token", token); // Store the token
    AsyncStorage.setItem("userID", userID);
    setIsAuthenticated(true); // Update state to reflect authenticated status
  };

  if (loading) {
    return null; // You can return a loading spinner or screen here
  }

  return (
    <WishlistProvider>
      <NavigationContainer>
        {isAuthenticated ? ( // If authenticated, show the main app
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                // Define icons for each tab
                if (route.name === "Home") {
                  iconName = focused ? "home" : "home-outline";
                } else if (route.name === "Products") {
                  iconName = focused ? "list" : "list-outline";
                } else if (route.name === "Wishlist") {
                  iconName = focused ? "heart" : "heart-outline";
                } else if (route.name === "QRScanner") {
                  iconName = focused ? "qr-code" : "qr-code-outline";
                }

                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: "tomato",
              tabBarInactiveTintColor: "gray",
            })}
          >
            <Tab.Screen
              name="Home"
              children={() => (
                <HomeStack setIsAuthenticated={setIsAuthenticated} />
              )} // Pass setIsAuthenticated
              options={{ headerShown: false }}
            />
            <Tab.Screen
              name="Products"
              component={ProductStack}
              options={{ headerShown: false }}
            />
            <Tab.Screen name="Wishlist" component={WishlistStack} />
            <Tab.Screen
              name="QRScanner"
              component={QRScannerStack}
              options={{ headerShown: false }}
            />
          </Tab.Navigator>
        ) : (
          <AuthStack onLoginSuccess={handleLoginSuccess} /> // If not authenticated, show auth stack
        )}
      </NavigationContainer>
    </WishlistProvider>
  );
}

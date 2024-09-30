import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ProductList from './screens/ProductList';
import Wishlist from './screens/Wishlist';
import ProductDetail from './screens/ProductDetail';
import QRScanner from './screens/QRScanner';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Products" component={ProductList} />
        <Stack.Screen name="Wishlist" component={Wishlist} />
        <Stack.Screen name="ProductDetail" component={ProductDetail} />
        <Stack.Screen name="QRScanner" component={QRScanner} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

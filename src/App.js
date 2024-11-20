import * as React from 'react';
import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginPage from './app/LogIn';
import Home from './app/(tab)';
import DashBoad from './app/(tab)/DashBoad';
import Billing from './app/(tab)/Billing';
import Customer from './app/(tab)/Customer';
import Profile from './app/(tab)/Profile';
import Category from './app/(tab)/Category';

const Stack = createStackNavigator();

export default function App() {
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for the token when the app loads
    const checkToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('@USER_TOKEN');
        setToken(storedToken);
      } catch (error) {
        console.error('Error retrieving token:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkToken();
  }, []);

  if (isLoading) {
    // You can return a loading screen here if you want
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {token == null ? (
          <Stack.Screen 
            name="LoginPage" 
            component={LoginPage} 
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
            <Stack.Screen name="Dashboard" component={DashBoad} options={{ headerShown: false }} />
            <Stack.Screen name="Billing" component={Billing} options={{ headerShown: false }} />
            <Stack.Screen name="Customer" component={Customer} options={{ headerShown: false }} />
            <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
            <Stack.Screen name="Category" component={Category} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
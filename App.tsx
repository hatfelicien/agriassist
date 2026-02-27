import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/contexts/AuthContext';
import { ToastProvider } from './src/contexts/ToastContext';
import './src/i18n/config';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import DebugAuthScreen from './src/screens/DebugAuthScreen';
import WeatherScreen from './src/screens/WeatherScreen';
import MarketScreen from './src/screens/MarketScreen';
import PestScreen from './src/screens/PestScreen';
import ChatScreen from './src/screens/ChatScreen';
import OfficerDashboardScreen from './src/screens/OfficerDashboardScreen';
import TestScreen from './src/screens/TestScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
            <Stack.Screen name="DebugAuth" component={DebugAuthScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Weather" component={WeatherScreen} />
            <Stack.Screen name="Market" component={MarketScreen} />
            <Stack.Screen name="Pest" component={PestScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="OfficerDashboard" component={OfficerDashboardScreen} />
            <Stack.Screen name="Test" component={TestScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </ToastProvider>
    </AuthProvider>
  );
}

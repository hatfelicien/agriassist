import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
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

function AppNavigator() {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="DebugAuth" component={DebugAuthScreen} />
          </>
        ) : userRole === 'officer' || userRole === 'admin' ? (
          <>
            <Stack.Screen name="OfficerDashboard" component={OfficerDashboardScreen} />
            <Stack.Screen name="Test" component={TestScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Weather" component={WeatherScreen} />
            <Stack.Screen name="Market" component={MarketScreen} />
            <Stack.Screen name="Pest" component={PestScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppNavigator />
      </ToastProvider>
    </AuthProvider>
  );
}

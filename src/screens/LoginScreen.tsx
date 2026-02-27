import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen({ navigation }: any) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register } = useAuth();

  console.log('LoginScreen - loading:', loading, 'email:', email);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    if (!isLogin && !name) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const success = await login(email, password);
        if (!success) {
          Alert.alert('Login Failed', 'Invalid email or password');
        }
        // Navigation will happen automatically via App.tsx
      } else {
        const success = await register(email, password, name);
        if (success) {
          Alert.alert('Success', 'Account created! Please login.');
          setIsLogin(true);
        } else {
          Alert.alert('Registration Failed', 'Could not create account');
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>AgriAssist</Text>
        <Text style={styles.subtitle}>Welcome</Text>

        {!isLogin && (
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
            editable={!loading}
          />
        )}
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={(text) => {
            console.log('Email changed:', text);
            setEmail(text);
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={true}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={(text) => {
            console.log('Password changed');
            setPassword(text);
          }}
          secureTextEntry
          editable={true}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Please wait...' : (isLogin ? 'Login' : 'Register')}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
          <Text style={styles.link}>
            {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#22c55e' },
  content: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 16, color: 'white', textAlign: 'center', marginBottom: 40 },
  input: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 15, fontSize: 16 },
  button: { backgroundColor: '#fbbf24', padding: 15, borderRadius: 10, marginTop: 10 },
  buttonText: { color: '#1f2937', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  link: { color: 'white', textAlign: 'center', marginTop: 20, fontSize: 16 }
});

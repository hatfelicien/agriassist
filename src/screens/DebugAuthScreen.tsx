import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { supabase } from '../lib/supabase';

export default function DebugAuthScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState('');

  const testConnection = async () => {
    try {
      const { data, error } = await supabase.from('users').select('count').limit(1);
      setResult(error ? `❌ Connection Error: ${error.message}` : '✅ Connected to Supabase');
    } catch (e: any) {
      setResult(`❌ Exception: ${e.message}`);
    }
  };

  const testSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Enter email and password');
      return;
    }
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      setResult(error ? `❌ SignUp Error: ${error.message}` : `✅ User Created: ${data.user?.id}`);
    } catch (e: any) {
      setResult(`❌ Exception: ${e.message}`);
    }
  };

  const testSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Enter email and password');
      return;
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setResult(`❌ SignIn Error: ${error.message}`);
      } else {
        setResult(`✅ Logged In: ${data.user?.id}`);
        setTimeout(() => navigation.replace('Home'), 1000);
      }
    } catch (e: any) {
      setResult(`❌ Exception: ${e.message}`);
    }
  };

  const skipAuth = () => {
    navigation.replace('Home');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Debug Auth</Text>
      
      <TouchableOpacity style={styles.button} onPress={testConnection}>
        <Text style={styles.buttonText}>Test Connection</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Email (e.g., test@agriassist.rw)"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={testSignUp}>
        <Text style={styles.buttonText}>Test Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={testSignIn}>
        <Text style={styles.buttonText}>Test Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.skipButton]} onPress={skipAuth}>
        <Text style={styles.buttonText}>Skip Auth (Test Only)</Text>
      </TouchableOpacity>

      {result ? (
        <View style={styles.result}>
          <Text style={styles.resultText}>{result}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f9fafb' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 15, fontSize: 16 },
  button: { backgroundColor: '#22c55e', padding: 15, borderRadius: 10, marginBottom: 10 },
  skipButton: { backgroundColor: '#6b7280' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  result: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginTop: 20 },
  resultText: { fontSize: 14, lineHeight: 20 }
});

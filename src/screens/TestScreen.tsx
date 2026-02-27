import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';

export default function TestScreen({ navigation }: any) {
  const [results, setResults] = useState<any>({});
  const [testing, setTesting] = useState(false);

  const runTests = async () => {
    setTesting(true);
    const testResults: any = {};

    // Test 1: Supabase Connection
    try {
      const { data, error } = await supabase.from('users').select('count').limit(1);
      testResults.connection = error ? `❌ ${error.message}` : '✅ Connected';
    } catch (e: any) {
      testResults.connection = `❌ ${e.message}`;
    }

    // Test 2: Weather Data
    try {
      const { data, error } = await supabase.from('weather_alerts').select('*').limit(1);
      testResults.weather = error ? `❌ ${error.message}` : `✅ ${data?.length || 0} records`;
    } catch (e: any) {
      testResults.weather = `❌ ${e.message}`;
    }

    // Test 3: Market Prices
    try {
      const { data, error } = await supabase.from('market_prices').select('*').limit(1);
      testResults.market = error ? `❌ ${error.message}` : `✅ ${data?.length || 0} records`;
    } catch (e: any) {
      testResults.market = `❌ ${e.message}`;
    }

    // Test 4: Pest Database
    try {
      const { data, error } = await supabase.from('pest_disease_db').select('*').limit(1);
      testResults.pest = error ? `❌ ${error.message}` : `✅ ${data?.length || 0} records`;
    } catch (e: any) {
      testResults.pest = `❌ ${e.message}`;
    }

    // Test 5: Auth Session
    try {
      const { data } = await supabase.auth.getSession();
      testResults.auth = data.session ? '✅ Logged in' : '⚠️ Not logged in';
    } catch (e: any) {
      testResults.auth = `❌ ${e.message}`;
    }

    setResults(testResults);
    setTesting(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Database Test</Text>
      </View>

      <ScrollView style={styles.content}>
        <TouchableOpacity style={styles.button} onPress={runTests} disabled={testing}>
          {testing ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Run Tests</Text>
          )}
        </TouchableOpacity>

        {Object.keys(results).length > 0 && (
          <View style={styles.results}>
            <Text style={styles.resultTitle}>Test Results:</Text>
            <Text style={styles.result}>Connection: {results.connection}</Text>
            <Text style={styles.result}>Weather Data: {results.weather}</Text>
            <Text style={styles.result}>Market Prices: {results.market}</Text>
            <Text style={styles.result}>Pest Database: {results.pest}</Text>
            <Text style={styles.result}>Authentication: {results.auth}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { backgroundColor: '#22c55e', padding: 16 },
  backButton: { color: 'white', fontSize: 16, marginBottom: 8 },
  title: { fontSize: 24, fontWeight: 'bold', color: 'white' },
  content: { flex: 1, padding: 16 },
  button: { backgroundColor: '#22c55e', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  results: { backgroundColor: 'white', padding: 16, borderRadius: 12 },
  resultTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  result: { fontSize: 16, marginBottom: 8, lineHeight: 24 }
});

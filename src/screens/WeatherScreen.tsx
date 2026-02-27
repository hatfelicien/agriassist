import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';

export default function WeatherScreen({ navigation }: any) {
  const [weather, setWeather] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      const { data, error } = await supabase.from('weather').select('*').order('created_at', { ascending: false }).limit(10);
      if (!error && data) {
        setWeather(data);
      } else if (error) {
        console.error('Weather error:', error.message);
      }
    } catch (error) {
      console.error('Weather fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Weather</Text>
      </View>

      <ScrollView style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#22c55e" style={{ marginTop: 40 }} />
        ) : weather.length === 0 ? (
          <Text style={styles.emptyText}>No weather data available</Text>
        ) : (
          weather.map((item) => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.cardTitle}>🌤️ {item.sector}</Text>
              <Text style={styles.cardText}>{item.forecast}</Text>
              <View style={styles.row}>
                <Text style={styles.temp}>🌡️ {item.temperature}°C</Text>
                <Text style={styles.rain}>💧 {item.rainfall}mm</Text>
              </View>
            </View>
          ))
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
  emptyText: { textAlign: 'center', marginTop: 40, fontSize: 16, color: '#6b7280' },
  card: { backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  cardText: { fontSize: 14, color: '#6b7280', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  temp: { fontSize: 16, fontWeight: '600' },
  rain: { fontSize: 16, fontWeight: '600', color: '#3b82f6' }
});

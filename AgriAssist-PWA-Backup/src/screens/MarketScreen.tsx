import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';

export default function MarketScreen({ navigation }: any) {
  const { t } = useTranslation();
  const [prices, setPrices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    const { data } = await supabase.from('market_prices').select('*').order('created_at', { ascending: false }).limit(20);
    setPrices(data || []);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← {t('back_home')}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t('market_prices')}</Text>
      </View>

      <ScrollView style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#22c55e" style={{ marginTop: 40 }} />
        ) : (
          prices.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.product}>💰 {item.product}</Text>
                <Text style={styles.price}>{item.price} RWF/{item.unit}</Text>
              </View>
              <Text style={styles.market}>📍 {item.market_name}</Text>
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
  card: { backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  product: { fontSize: 18, fontWeight: 'bold' },
  price: { fontSize: 16, fontWeight: '600', color: '#22c55e' },
  market: { fontSize: 14, color: '#6b7280' }
});

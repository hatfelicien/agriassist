import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';

export default function PestScreen({ navigation }: any) {
  const { t, i18n } = useTranslation();
  const [pests, setPests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPests();
  }, []);

  const fetchPests = async () => {
    const { data } = await supabase.from('pest_disease_db').select('*').limit(20);
    setPests(data || []);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← {t('back_home')}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t('pest_alerts')}</Text>
      </View>

      <ScrollView style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#22c55e" style={{ marginTop: 40 }} />
        ) : (
          pests.map((item) => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.cardTitle}>🐛 {i18n.language === 'rw' ? item.name_rw : item.name_en}</Text>
              <Text style={styles.cardText}>{i18n.language === 'rw' ? item.description_rw : item.description_en}</Text>
              <View style={styles.treatment}>
                <Text style={styles.treatmentLabel}>{t('treatment')}:</Text>
                <Text style={styles.treatmentText}>{i18n.language === 'rw' ? item.treatment_rw : item.treatment_en}</Text>
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
  card: { backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  cardText: { fontSize: 14, color: '#6b7280', marginBottom: 12 },
  treatment: { backgroundColor: '#f0fdf4', padding: 12, borderRadius: 8 },
  treatmentLabel: { fontSize: 14, fontWeight: 'bold', color: '#22c55e', marginBottom: 4 },
  treatmentText: { fontSize: 14, color: '#374151' }
});

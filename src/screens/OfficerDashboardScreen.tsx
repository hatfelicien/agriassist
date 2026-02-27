import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';

export default function OfficerDashboardScreen({ navigation }: any) {
  const { t } = useTranslation();
  const { logout } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('officer_dashboard')}</Text>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>{t('logout')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📊 {t('analytics')}</Text>
          <Text style={styles.cardText}>{t('view_farmer_activity')}</Text>
        </View>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Chat')}>
          <Text style={styles.cardTitle}>💬 {t('messages')}</Text>
          <Text style={styles.cardText}>{t('respond_to_farmers')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { backgroundColor: '#22c55e', padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: 'white' },
  logoutBtn: { backgroundColor: 'white', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  logoutText: { color: '#22c55e', fontWeight: 'bold' },
  content: { flex: 1, padding: 16 },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 12, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  cardTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  cardText: { fontSize: 14, color: '#6b7280' }
});

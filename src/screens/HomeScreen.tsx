import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }: any) {
  const { logout, userRole } = useAuth();
  const { t, i18n } = useTranslation();

  const toggleLanguage = async () => {
    const newLang = i18n.language === 'rw' ? 'en' : 'rw';
    await i18n.changeLanguage(newLang);
    await AsyncStorage.setItem('language', newLang);
  };

  useEffect(() => {
    if (userRole === 'officer' || userRole === 'admin') {
      navigation.replace('OfficerDashboard');
    }
  }, [userRole, navigation]);

  if (userRole === 'officer' || userRole === 'admin') {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('app_name')}</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={toggleLanguage} style={styles.langBtn}>
            <Text style={styles.langText}>{i18n.language === 'rw' ? 'EN' : 'RW'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>{t('logout')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.welcome}>
          <Text style={styles.welcomeTitle}>{t('welcome')}</Text>
          <Text style={styles.welcomeSubtitle}>{t('welcome_subtitle')}</Text>
        </View>

        <TouchableOpacity 
          style={styles.chatButton}
          onPress={() => navigation.navigate('Chat')}
        >
          <Text style={styles.chatButtonText}>{t('chat_with_officers')}</Text>
        </TouchableOpacity>

        <View style={styles.grid}>
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Weather')}>
            <Text style={styles.icon}>🌤️</Text>
            <Text style={styles.cardTitle}>{t('weather')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Market')}>
            <Text style={styles.icon}>💰</Text>
            <Text style={styles.cardTitle}>{t('market')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Pest')}>
            <Text style={styles.icon}>🐛</Text>
            <Text style={styles.cardTitle}>{t('pests')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { backgroundColor: '#22c55e', padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: 'white' },
  headerButtons: { flexDirection: 'row', gap: 8 },
  langBtn: { backgroundColor: 'white', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, marginRight: 8 },
  langText: { color: '#22c55e', fontWeight: 'bold', fontSize: 14 },
  logoutBtn: { backgroundColor: 'white', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  logoutText: { color: '#22c55e', fontWeight: 'bold' },
  content: { flex: 1 },
  welcome: { backgroundColor: '#22c55e', margin: 16, padding: 20, borderRadius: 16 },
  welcomeTitle: { fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 8 },
  welcomeSubtitle: { fontSize: 14, color: 'white', opacity: 0.9 },
  chatButton: { backgroundColor: '#fbbf24', margin: 16, padding: 16, borderRadius: 12, alignItems: 'center' },
  chatButtonText: { fontSize: 18, fontWeight: 'bold', color: '#1f2937' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: 8 },
  card: { width: '47%', backgroundColor: 'white', margin: 6, padding: 20, borderRadius: 12, alignItems: 'center', elevation: 3 },
  icon: { fontSize: 48, marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: '600', textAlign: 'center' }
});

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useUnreadCount } from '../hooks/useUnreadCount';

export default function HomeScreen({ navigation }: any) {
  const { t, i18n } = useTranslation();
  const { logout, userRole } = useAuth();
  const { unreadCount, markAsRead } = useUnreadCount();

  if (userRole === 'officer' || userRole === 'admin') {
    navigation.replace('OfficerDashboard');
    return null;
  }

  const NavCard = ({ icon, title, onPress, badge }: any) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.cardTitle}>{title}</Text>
      {badge > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('app_name')}</Text>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>{t('logout')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.welcome}>
          <Text style={styles.welcomeTitle}>
            {i18n.language === 'rw' ? 'Murakaza neza kuri AgriAssist' : 'Welcome to AgriAssist'}
          </Text>
          <Text style={styles.welcomeSubtitle}>
            {i18n.language === 'rw' 
              ? 'Amakuru y\'ubuhinzi ku bihingwa, amatungo, ibihe n\'isoko'
              : 'Agricultural information for crops, livestock, weather and markets'}
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.chatButton}
          onPress={() => { navigation.navigate('Chat'); markAsRead(); }}
        >
          <Text style={styles.chatButtonText}>💬 {t('chat_with_officers')}</Text>
          {unreadCount > 0 && (
            <View style={styles.chatBadge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.grid}>
          <NavCard icon="🌤️" title={t('weather')} onPress={() => navigation.navigate('Weather')} />
          <NavCard icon="💰" title={t('market_prices')} onPress={() => navigation.navigate('Market')} />
          <NavCard icon="🐛" title={t('pest_alerts')} onPress={() => navigation.navigate('Pest')} />
          <NavCard icon="🐄" title={t('livestock')} onPress={() => {}} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { backgroundColor: '#22c55e', padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: 'white' },
  logoutBtn: { backgroundColor: 'white', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  logoutText: { color: '#22c55e', fontWeight: 'bold' },
  content: { flex: 1 },
  welcome: { backgroundColor: '#22c55e', margin: 16, padding: 20, borderRadius: 16 },
  welcomeTitle: { fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 8 },
  welcomeSubtitle: { fontSize: 14, color: 'white', opacity: 0.9 },
  chatButton: { backgroundColor: '#fbbf24', margin: 16, padding: 16, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  chatButtonText: { fontSize: 18, fontWeight: 'bold', color: '#1f2937' },
  chatBadge: { position: 'absolute', top: -8, right: -8, backgroundColor: '#ef4444', borderRadius: 12, width: 24, height: 24, justifyContent: 'center', alignItems: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: 8 },
  card: { width: '47%', backgroundColor: 'white', margin: '1.5%', padding: 20, borderRadius: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  icon: { fontSize: 48, marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: '600', textAlign: 'center' },
  badge: { position: 'absolute', top: 8, right: 8, backgroundColor: '#ef4444', borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: 'white', fontSize: 12, fontWeight: 'bold' }
});

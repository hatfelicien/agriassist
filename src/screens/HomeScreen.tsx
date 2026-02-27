import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function HomeScreen({ navigation }: any) {
  const { logout, userRole } = useAuth();

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
        <Text style={styles.headerTitle}>AgriAssist</Text>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.welcome}>
          <Text style={styles.welcomeTitle}>Welcome to AgriAssist</Text>
          <Text style={styles.welcomeSubtitle}>Agricultural information for farmers</Text>
        </View>

        <TouchableOpacity 
          style={styles.chatButton}
          onPress={() => navigation.navigate('Chat')}
        >
          <Text style={styles.chatButtonText}>Chat with Officers</Text>
        </TouchableOpacity>

        <View style={styles.grid}>
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Weather')}>
            <Text style={styles.icon}>🌤️</Text>
            <Text style={styles.cardTitle}>Weather</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Market')}>
            <Text style={styles.icon}>💰</Text>
            <Text style={styles.cardTitle}>Market</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Pest')}>
            <Text style={styles.icon}>🐛</Text>
            <Text style={styles.cardTitle}>Pests</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Test')}>
            <Text style={styles.icon}>🔧</Text>
            <Text style={styles.cardTitle}>Test DB</Text>
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

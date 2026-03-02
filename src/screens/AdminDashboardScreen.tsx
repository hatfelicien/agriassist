import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function AdminDashboardScreen({ navigation }: any) {
  const { logout } = useAuth();
  const [stats, setStats] = useState({ users: 0, officers: 0, farmers: 0, messages: 0 });
  const [users, setUsers] = useState<any[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchUsers();
  }, []);

  const fetchStats = async () => {
    const { data: usersData } = await supabase.from('users').select('role');
    const { data: messagesData } = await supabase.from('messages').select('id');
    
    setStats({
      users: usersData?.length || 0,
      officers: usersData?.filter(u => u.role === 'officer').length || 0,
      farmers: usersData?.filter(u => u.role === 'farmer').length || 0,
      messages: messagesData?.length || 0
    });
  };

  const fetchUsers = async () => {
    const { data } = await supabase.from('users').select('*').order('created_at', { ascending: false });
    console.log('Fetched users:', data);
    setUsers(data || []);
  };

  const createOfficer = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Enter email and password');
      return;
    }

    setLoading(true);
    try {
      // Get current session to restore later
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      // Create new user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role: 'officer' }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Insert user record
        const { error: insertError } = await supabase.from('users')
          .upsert({
            id: data.user.id,
            email,
            role: 'officer'
          }, { onConflict: 'id' });

        if (insertError) {
          console.error('Error creating user entry:', insertError);
        }

        // Sign out the new user and restore admin session
        await supabase.auth.signOut();
        if (currentSession) {
          await supabase.auth.setSession({
            access_token: currentSession.access_token,
            refresh_token: currentSession.refresh_token
          });
        }

        Alert.alert('Success', 'Officer account created. They can now login.');
        setEmail('');
        setPassword('');
        fetchStats();
        fetchUsers();
      }
    } catch (error: any) {
      console.error('Create officer error:', error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (userId: string, newRole: string) => {
    await supabase.from('users').update({ role: newRole }).eq('id', userId);
    fetchStats();
    fetchUsers();
  };

  const deleteUser = async (userId: string, userEmail: string) => {
    Alert.alert(
      'Delete User',
      `Are you sure you want to delete ${userEmail}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await supabase.from('users').delete().eq('id', userId);
              Alert.alert('Success', 'User deleted from database. Note: Auth user still exists.');
              fetchStats();
              fetchUsers();
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { marginRight: '4%' }]}>
            <Text style={styles.statNumber}>{stats.users}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.officers}</Text>
            <Text style={styles.statLabel}>Officers</Text>
          </View>
          <View style={[styles.statCard, { marginRight: '4%' }]}>
            <Text style={styles.statNumber}>{stats.farmers}</Text>
            <Text style={styles.statLabel}>Farmers</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.messages}</Text>
            <Text style={styles.statLabel}>Messages</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Create New Officer</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.createBtn} onPress={createOfficer} disabled={loading}>
            <Text style={styles.createBtnText}>{loading ? 'Creating...' : 'Create Officer'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Users</Text>
          {users.map((user) => (
            <View key={user.id} style={styles.userCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.userEmail}>{user.email}</Text>
                <Text style={styles.userRole}>Role: {user.role}</Text>
              </View>
              <View style={styles.actionButtons}>
                {user.role !== 'officer' && (
                  <TouchableOpacity onPress={() => updateRole(user.id, 'officer')} style={styles.roleBtn}>
                    <Text style={styles.roleBtnText}>Officer</Text>
                  </TouchableOpacity>
                )}
                {user.role !== 'farmer' && (
                  <TouchableOpacity onPress={() => updateRole(user.id, 'farmer')} style={styles.roleBtn}>
                    <Text style={styles.roleBtnText}>Farmer</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => deleteUser(user.id, user.email)} style={styles.deleteBtn}>
                  <Text style={styles.deleteBtnText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { backgroundColor: '#22c55e', paddingTop: 48, paddingBottom: 16, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: 'white' },
  logoutBtn: { backgroundColor: '#dc2626', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  logoutText: { color: 'white', fontWeight: 'bold' },
  content: { flex: 1, padding: 16 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  statCard: { width: '48%', backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  statNumber: { fontSize: 32, fontWeight: 'bold', color: '#22c55e' },
  statLabel: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  section: { backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  input: { backgroundColor: '#f3f4f6', padding: 12, borderRadius: 8, marginBottom: 12, fontSize: 16 },
  createBtn: { backgroundColor: '#22c55e', padding: 14, borderRadius: 8, alignItems: 'center' },
  createBtnText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  userCard: { backgroundColor: '#f9fafb', padding: 12, borderRadius: 8, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  userEmail: { fontSize: 14, fontWeight: '600' },
  userRole: { fontSize: 12, color: '#6b7280', marginTop: 4 },
  actionButtons: { flexDirection: 'row', gap: 6 },
  roleBtn: { backgroundColor: '#3b82f6', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6 },
  roleBtnText: { color: 'white', fontSize: 12, fontWeight: '600' },
  deleteBtn: { backgroundColor: '#dc2626', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6 },
  deleteBtnText: { color: 'white', fontSize: 12, fontWeight: '600' }
});

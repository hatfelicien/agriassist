import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { encryptMessage, decryptMessage } from '../lib/encryption';

export default function ChatScreen({ navigation }: any) {
  const { t } = useTranslation();
  const { user, userRole } = useAuth();
  const [farmers, setFarmers] = useState<any[]>([]);
  const [selectedFarmer, setSelectedFarmer] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userRole === 'officer' || userRole === 'admin') {
      loadFarmersWithMessages();
    } else {
      loadMessages();
    }

    const subscription = supabase
      .channel('messages-chat')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => {
        if (userRole === 'officer' || userRole === 'admin') {
          loadFarmersWithMessages();
          if (selectedFarmer) loadMessages(selectedFarmer.id);
        } else {
          loadMessages();
        }
      })
      .subscribe();

    return () => { subscription.unsubscribe(); };
  }, [selectedFarmer]);

  const loadFarmersWithMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('farmer_id, sender_email')
        .not('farmer_id', 'is', null)
        .order('timestamp', { ascending: false });

      if (error) throw error;

      // Get unique farmers
      const uniqueFarmers = Array.from(
        new Map(data?.map(m => [m.farmer_id, { id: m.farmer_id, email: m.sender_email }])).values()
      );

      setFarmers(uniqueFarmers);
    } catch (err) {
      console.error('Error loading farmers:', err);
    }
  };

  const loadMessages = async (farmerId?: string) => {
    try {
      let query = supabase
        .from('messages')
        .select('*')
        .order('timestamp', { ascending: true });

      if (userRole === 'farmer') {
        query = query.eq('farmer_id', user?.id);
      } else if (farmerId) {
        query = query.eq('farmer_id', farmerId);
      }

      const { data, error } = await query;
      if (error) throw error;

      const decrypted = await Promise.all(
        (data || []).map(async (msg: any) => ({
          ...msg,
          text: await decryptMessage(msg.text)
        }))
      );

      setMessages(decrypted);
    } catch (err) {
      console.error('Error loading messages:', err);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !user) return;

    setLoading(true);
    try {
      const encrypted = await encryptMessage(input);
      const { error } = await supabase.from('messages').insert({
        text: encrypted,
        sender_id: user.id,
        sender_email: user.email,
        sender_role: userRole,
        farmer_id: userRole === 'farmer' ? user.id : selectedFarmer?.id,
        timestamp: Date.now()
      });

      if (error) throw error;
      setInput('');
      if (userRole === 'officer' || userRole === 'admin') {
        loadMessages(selectedFarmer?.id);
      } else {
        loadMessages();
      }
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Officer view - show farmer list
  if ((userRole === 'officer' || userRole === 'admin') && !selectedFarmer) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Farmers</Text>
        </View>

        <FlatList
          data={farmers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.farmerItem}
              onPress={() => {
                setSelectedFarmer(item);
                loadMessages(item.id);
              }}
            >
              <View style={styles.farmerAvatar}>
                <Text style={styles.farmerAvatarText}>{item.email[0].toUpperCase()}</Text>
              </View>
              <View style={styles.farmerInfo}>
                <Text style={styles.farmerEmail}>{item.email}</Text>
                <Text style={styles.farmerSubtext}>Tap to chat</Text>
              </View>
              <Text style={styles.farmerArrow}>›</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No farmers have messaged yet</Text>
            </View>
          }
        />
      </View>
    );
  }

  // Chat view
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {
          if (userRole === 'officer' || userRole === 'admin') {
            setSelectedFarmer(null);
            setMessages([]);
          } else {
            navigation.goBack();
          }
        }}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>
          {selectedFarmer ? selectedFarmer.email : t('chat_with_officers')}
        </Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.message, item.sender_id === user?.id ? styles.myMessage : styles.theirMessage]}>
            <Text style={styles.messageRole}>
              {item.sender_role === 'officer' ? '👨‍🌾 Officer' : '👨‍🌾 Farmer'}
            </Text>
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.messageTime}>
              {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        )}
        style={styles.list}
        contentContainerStyle={{ paddingVertical: 16 }}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder={t('type_message')}
          multiline
          editable={!loading}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage} disabled={loading || !input.trim()}>
          <Text style={styles.sendText}>{loading ? '...' : '➤'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { backgroundColor: '#22c55e', padding: 16 },
  backButton: { color: 'white', fontSize: 16, marginBottom: 8 },
  title: { fontSize: 20, fontWeight: 'bold', color: 'white' },
  farmerItem: { backgroundColor: 'white', padding: 16, marginHorizontal: 16, marginVertical: 4, borderRadius: 12, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  farmerAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#22c55e', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  farmerAvatarText: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  farmerInfo: { flex: 1 },
  farmerEmail: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
  farmerSubtext: { fontSize: 12, color: '#6b7280' },
  farmerArrow: { fontSize: 24, color: '#9ca3af' },
  emptyState: { padding: 40, alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#6b7280' },
  list: { flex: 1, paddingHorizontal: 16 },
  message: { maxWidth: '80%', padding: 12, borderRadius: 12, marginBottom: 8 },
  myMessage: { alignSelf: 'flex-end', backgroundColor: '#22c55e' },
  theirMessage: { alignSelf: 'flex-start', backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 1, elevation: 1 },
  messageRole: { fontSize: 10, fontWeight: 'bold', marginBottom: 4, opacity: 0.7 },
  messageText: { fontSize: 16, marginBottom: 4 },
  messageTime: { fontSize: 10, opacity: 0.6, textAlign: 'right' },
  inputContainer: { flexDirection: 'row', padding: 16, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#e5e7eb' },
  input: { flex: 1, backgroundColor: '#f3f4f6', padding: 12, borderRadius: 20, marginRight: 8, maxHeight: 100, fontSize: 16 },
  sendButton: { width: 48, height: 48, backgroundColor: '#22c55e', borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  sendText: { fontSize: 24, color: 'white' }
});

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function ChatScreen({ navigation }: any) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    fetchMessages();
    const subscription = supabase
      .channel('messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        setMessages((prev) => [payload.new, ...prev]);
      })
      .subscribe();
    return () => { subscription.unsubscribe(); };
  }, []);

  const fetchMessages = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*, sender:profiles!messages_sender_id_fkey(name), receiver:profiles!messages_receiver_id_fkey(name)')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(50);
      if (!error && data) {
        setMessages(data);
      }
    } catch (error) {
      console.error('Messages fetch error:', error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !user) return;
    try {
      await supabase.from('messages').insert({ sender_id: user.id, content: input, receiver_id: null });
      setInput('');
    } catch (error) {
      console.error('Send message error:', error);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← {t('back_home')}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t('chat_with_officers')}</Text>
      </View>

      <FlatList
        data={messages}
        inverted
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.message, item.sender_id === user?.id ? styles.myMessage : styles.theirMessage]}>
            <Text style={styles.sender}>{item.sender?.name}</Text>
            <Text style={styles.content}>{item.content}</Text>
          </View>
        )}
        style={styles.list}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder={t('type_message')}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendText}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { backgroundColor: '#22c55e', padding: 16 },
  backButton: { color: 'white', fontSize: 16, marginBottom: 8 },
  title: { fontSize: 24, fontWeight: 'bold', color: 'white' },
  list: { flex: 1, padding: 16 },
  message: { maxWidth: '80%', padding: 12, borderRadius: 12, marginBottom: 8 },
  myMessage: { alignSelf: 'flex-end', backgroundColor: '#22c55e' },
  theirMessage: { alignSelf: 'flex-start', backgroundColor: 'white' },
  sender: { fontSize: 12, fontWeight: 'bold', marginBottom: 4, opacity: 0.7 },
  content: { fontSize: 16 },
  inputContainer: { flexDirection: 'row', padding: 16, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#e5e7eb' },
  input: { flex: 1, backgroundColor: '#f3f4f6', padding: 12, borderRadius: 20, marginRight: 8, maxHeight: 100 },
  sendButton: { width: 48, height: 48, backgroundColor: '#22c55e', borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  sendText: { fontSize: 24, color: 'white' }
});

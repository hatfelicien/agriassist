import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useTypingIndicator } from '../hooks/useTypingIndicator';
import { encryptMessage, decryptMessage } from '../lib/encryption';

export default function Chat() {
  console.log('💬 Chat: Component rendered');
  const { t } = useTranslation();
  const { user, userRole } = useAuth();
  const { showToast } = useToast();
  const isOnline = useOnlineStatus();
  const { typingUsers, sendTyping } = useTypingIndicator(user?.id || '', userRole || '');
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  console.log('💬 Chat: State', { user: user?.id, userRole, isOnline, messagesCount: messages.length, typingUsers, sending });

  useEffect(() => {
    if (!user) {
      console.log('💬 Chat: No user, skipping load');
      return;
    }
    
    console.log('💬 Chat: Loading messages');
    loadMessages();
    
    console.log('💬 Chat: Setting up realtime subscription');
    const channel = supabase
      .channel('messages-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => {
        console.log('💬 Chat: New message detected, reloading');
        loadMessages();
      })
      .subscribe();

    return () => {
      console.log('💬 Chat: Cleaning up subscription');
      supabase.removeChannel(channel);
    };
  }, [user, userRole]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async () => {
    console.log('💬 loadMessages: Starting');
    try {
      setError('');
      const query = supabase
        .from('messages')
        .select('*')
        .order('timestamp', { ascending: true });
      
      if (userRole === 'farmer' || userRole === 'admin') {
        console.log('💬 loadMessages: Filtering for farmer/admin:', user?.id);
        query.eq('farmer_id', user?.id);
      }
      
      const { data, error: fetchError } = await query;
      
      if (fetchError) {
        console.error('💬 loadMessages: Fetch error:', fetchError);
        throw fetchError;
      }
      
      console.log('💬 loadMessages: Fetched', data?.length, 'messages');
      console.log('💬 loadMessages: Decrypting messages');
      const decryptedMessages = await Promise.all(
        (data || []).map(async (msg: any) => ({
          ...msg,
          text: await decryptMessage(msg.text),
          read_at: msg.read_at || null
        }))
      );
      
      console.log('💬 loadMessages: Decryption complete');
      setMessages(decryptedMessages);
    } catch (err: any) {
      console.error('💬 loadMessages: Error:', err);
      setError(err.message);
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('💬 sendMessage: Attempting to send:', newMessage);
    if (!newMessage.trim() || !user) {
      console.log('💬 sendMessage: Empty message or no user');
      return;
    }

    if (!isOnline) {
      console.log('💬 sendMessage: Offline, cannot send');
      setError(t('no_internet'));
      return;
    }

    try {
      setSending(true);
      setError('');
      console.log('💬 sendMessage: Encrypting message');
      const encryptedText = await encryptMessage(newMessage);
      
      console.log('💬 sendMessage: Inserting to database');
      const { error: insertError } = await supabase.from('messages').insert({
        text: encryptedText,
        sender_id: user.id,
        sender_email: user.email,
        sender_role: userRole,
        farmer_id: userRole === 'farmer' || userRole === 'admin' ? user.id : null,
        timestamp: Date.now(),
        read_at: null
      });
      
      if (insertError) {
        console.error('💬 sendMessage: Insert error:', insertError);
        throw insertError;
      }
      
      console.log('💬 sendMessage: Success');
      setNewMessage('');
      showToast('Message sent', 'success');
    } catch (err: any) {
      console.error('💬 sendMessage: Error:', err);
      setError(err.message);
      showToast(err.message, 'error');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="p-6 text-center">{t('loading')}</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] sm:h-[calc(100vh-200px)] bg-white rounded-xl shadow-md">
      <div className="bg-primary text-white p-3 sm:p-4 rounded-t-xl">
        <h2 className="text-base sm:text-xl font-bold">{t('chat_with_officers')}</h2>
        <p className="text-xs opacity-75">🔒 End-to-end encrypted</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 sm:px-4 text-xs sm:text-sm">
          {error}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-2 sm:space-y-3">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] sm:max-w-xs px-3 py-2 sm:px-4 rounded-lg text-sm sm:text-base ${
                msg.sender_id === user?.id
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              <p className="text-xs opacity-75 mb-1">
                {msg.sender_role === 'officer' ? t('extension_officer') : t('farmer')}
              </p>
              <p className="break-words">{msg.text}</p>
              <p className="text-xs opacity-75 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
                {msg.sender_id === user?.id && (
                  <span className="ml-2">{msg.read_at ? '✓✓' : '✓'}</span>
                )}
              </p>
            </div>
          </div>
        ))}
        {typingUsers.length > 0 && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-900 px-3 py-2 sm:px-4 rounded-lg">
              <p className="text-xs sm:text-sm">{t('typing')}...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-2 sm:p-4 border-t">
        <div className="flex gap-1 sm:gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              sendTyping();
            }}
            placeholder={t('type_message')}
            disabled={sending}
            className="flex-1 px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none disabled:opacity-50 text-sm sm:text-base"
          />
          <button
            type="submit"
            disabled={sending || !isOnline}
            className="px-3 py-2 sm:px-6 sm:py-3 bg-primary text-white rounded-lg font-semibold disabled:opacity-50 text-sm sm:text-base"
          >
            {sending ? '...' : t('send')}
          </button>
        </div>
        {!isOnline && (
          <p className="text-xs text-yellow-600 mt-2">{t('offline_mode')}</p>
        )}
      </form>
    </div>
  );
}

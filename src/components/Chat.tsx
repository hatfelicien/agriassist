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
  const [officers, setOfficers] = useState<any[]>([]);
  const [selectedOfficer, setSelectedOfficer] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  console.log('💬 Chat: State', { user: user?.id, userRole, isOnline, messagesCount: messages.length, typingUsers, sending });

  useEffect(() => {
    if (!user) {
      console.log('💬 Chat: No user, skipping load');
      return;
    }
    
    console.log('💬 Chat: Loading messages');
    loadMessages();
    
    if (userRole === 'farmer') {
      loadOfficers();
    }
    
    console.log('💬 Chat: Setting up realtime subscription');
    const channel = supabase
      .channel('messages-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        console.log('💬 Chat: New message detected, reloading');
        loadMessages();
        // Auto-scroll on new message
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
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

  const loadOfficers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, full_name')
        .eq('role', 'officer');
      
      if (error) throw error;
      setOfficers(data || []);
    } catch (err) {
      console.error('Error loading officers:', err);
    }
  };

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
      
      // Mark messages as read
      if (userRole === 'farmer') {
        const unreadIds = decryptedMessages
          .filter(m => m.sender_role === 'officer' && !m.read_at)
          .map(m => m.id);
        
        if (unreadIds.length > 0) {
          await supabase
            .from('messages')
            .update({ read_at: Date.now() })
            .in('id', unreadIds);
        }
      }
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
      showToast(t('no_internet'), 'error');
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
      inputRef.current?.focus();
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
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-xl font-bold">{t('chat_with_officers')}</h2>
            <p className="text-xs opacity-75">🔒 End-to-end encrypted</p>
          </div>
          {isOnline ? (
            <span className="text-xs bg-green-500 px-2 py-1 rounded-full">• Online</span>
          ) : (
            <span className="text-xs bg-red-500 px-2 py-1 rounded-full">• Offline</span>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 sm:px-4 text-xs sm:text-sm">
          {error}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-2 sm:space-y-3">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-sm sm:text-base">{t('no_messages_yet')}</p>
            <p className="text-xs mt-2">{t('start_conversation')}</p>
          </div>
        ) : (
          messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] sm:max-w-xs px-3 py-2 sm:px-4 rounded-lg text-sm sm:text-base shadow-sm ${
                  msg.sender_id === user?.id
                    ? 'bg-primary text-white rounded-br-none'
                    : 'bg-gray-200 text-gray-900 rounded-bl-none'
                }`}
              >
                <p className="text-xs opacity-75 mb-1 font-semibold">
                  {msg.sender_role === 'officer' ? '👨‍🌾 ' + t('extension_officer') : '👨‍🌾 ' + t('farmer')}
                </p>
                <p className="break-words">{msg.text}</p>
                <p className="text-xs opacity-75 mt-1 flex items-center justify-between">
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {msg.sender_id === user?.id && (
                    <span className="ml-2">{msg.read_at ? '✓✓' : '✓'}</span>
                  )}
                </p>
              </div>
            </div>
          ))
        )}
        {typingUsers.length > 0 && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-900 px-3 py-2 sm:px-4 rounded-lg animate-pulse">
              <p className="text-xs sm:text-sm">{t('typing')}...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-2 sm:p-4 border-t bg-gray-50">
        <div className="flex gap-1 sm:gap-2">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              sendTyping();
            }}
            placeholder={t('type_message')}
            disabled={sending || !isOnline}
            className="flex-1 px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none disabled:opacity-50 text-sm sm:text-base"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={sending || !isOnline || !newMessage.trim()}
            className="px-3 py-2 sm:px-6 sm:py-3 bg-primary text-white rounded-lg font-semibold disabled:opacity-50 text-sm sm:text-base hover:bg-green-600 transition-colors"
          >
            {sending ? (
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            )}
          </button>
        </div>
        {!isOnline && (
          <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {t('offline_mode')}
          </p>
        )}
      </form>
    </div>
  );
}

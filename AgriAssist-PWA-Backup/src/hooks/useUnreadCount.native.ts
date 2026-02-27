import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function useUnreadCount() {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchUnread = async () => {
      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', user.id)
        .eq('read', false);
      setUnreadCount(count || 0);
    };

    fetchUnread();

    const subscription = supabase
      .channel('unread')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, fetchUnread)
      .subscribe();

    return () => { subscription.unsubscribe(); };
  }, [user]);

  const markAsRead = async () => {
    if (!user) return;
    await supabase.from('messages').update({ read: true }).eq('receiver_id', user.id);
    setUnreadCount(0);
  };

  return { unreadCount, markAsRead };
}

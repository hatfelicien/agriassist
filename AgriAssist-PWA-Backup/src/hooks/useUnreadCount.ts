import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function useUnreadCount() {
  console.log('🔔 useUnreadCount: Hook initialized');
  const { user, userRole } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) {
      console.log('🔔 useUnreadCount: No user, skipping');
      return;
    }

    console.log('🔔 useUnreadCount: User detected:', user.id, 'Role:', userRole);

    const loadUnread = async () => {
      console.log('🔔 loadUnread: Starting');
      try {
        const lastRead = localStorage.getItem(`lastRead_${user.id}`) || '0';
        console.log('🔔 loadUnread: Last read timestamp:', lastRead);
        
        let query = supabase
          .from('messages')
          .select('*', { count: 'exact' })
          .gt('timestamp', parseInt(lastRead));
        
        if (userRole === 'farmer') {
          console.log('🔔 loadUnread: Filtering for farmer');
          query = query.or(`farmer_id.eq.${user.id},and(sender_role.eq.officer)`);
          query = query.neq('sender_id', user.id);
        }
        
        const { count } = await query;
        console.log('🔔 loadUnread: Unread count:', count);
        setUnreadCount(count || 0);
      } catch (err) {
        console.error('🔔 loadUnread: Error:', err);
      }
    };

    loadUnread();

    console.log('🔔 useUnreadCount: Setting up realtime subscription');
    const channel = supabase
      .channel('unread-messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => {
        console.log('🔔 useUnreadCount: New message detected, reloading count');
        loadUnread();
      })
      .subscribe();

    return () => {
      console.log('🔔 useUnreadCount: Cleaning up subscription');
      supabase.removeChannel(channel);
    };
  }, [user, userRole]);

  const markAsRead = () => {
    console.log('🔔 markAsRead: Marking messages as read');
    if (user) {
      const timestamp = Date.now().toString();
      localStorage.setItem(`lastRead_${user.id}`, timestamp);
      console.log('🔔 markAsRead: Set timestamp:', timestamp);
      setUnreadCount(0);
    }
  };

  return { unreadCount, markAsRead };
}

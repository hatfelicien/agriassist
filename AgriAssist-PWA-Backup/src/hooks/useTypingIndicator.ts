import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useTypingIndicator(userId: string, userRole: string) {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  useEffect(() => {
    const channel = supabase.channel('typing');
    
    channel
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        if (payload.userId !== userId) {
          setTypingUsers(prev => [...new Set([...prev, payload.userId])]);
          setTimeout(() => {
            setTypingUsers(prev => prev.filter(id => id !== payload.userId));
          }, 3000);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  const sendTyping = () => {
    const channel = supabase.channel('typing');
    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        channel.send({
          type: 'broadcast',
          event: 'typing',
          payload: { userId, userRole }
        });
      }
    });
  };

  return { typingUsers, sendTyping };
}

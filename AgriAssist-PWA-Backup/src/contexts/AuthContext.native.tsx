import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  userRole: 'farmer' | 'officer' | 'admin' | null;
  loading: boolean;
  login: (phone: string, password: string) => Promise<boolean>;
  register: (phone: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'farmer' | 'officer' | 'admin' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }: any) => {
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        loadUserRole(data.session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserRole(session.user.id);
      } else {
        setUserRole(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserRole = async (userId: string) => {
    try {
      const { data } = await supabase.from('users').select('role').eq('id', userId).single();
      setUserRole(data?.role || 'farmer');
    } catch {
      setUserRole('farmer');
    } finally {
      setLoading(false);
    }
  };

  const login = async (phone: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email: `${phone}@agriassist.rw`, password });
    return !error;
  };

  const register = async (phone: string, password: string, name: string) => {
    const email = `${phone}@agriassist.rw`;
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error || !data.user) return false;
    
    await supabase.from('users').insert({ id: data.user.id, email, role: 'farmer', name });
    await supabase.from('profiles').insert({ id: data.user.id, name, phone });
    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    await AsyncStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, userRole, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

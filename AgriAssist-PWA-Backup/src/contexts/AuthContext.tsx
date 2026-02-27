import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  userRole: 'farmer' | 'officer' | 'admin' | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: 'farmer' | 'officer' | 'admin') => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  console.log('🔐 AuthProvider: Initializing');
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'farmer' | 'officer' | 'admin' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔐 AuthProvider: Getting initial session');
    supabase.auth.getSession().then(({ data }: any) => {
      console.log('🔐 AuthProvider: Session data:', data.session?.user ? 'User found' : 'No user');
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        console.log('🔐 AuthProvider: Loading role for user:', data.session.user.id);
        loadUserRole(data.session.user.id);
      } else {
        console.log('🔐 AuthProvider: No session, setting loading false');
        setLoading(false);
      }
    });

    console.log('🔐 AuthProvider: Setting up auth state listener');
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      console.log('🔐 AuthProvider: Auth state changed:', _event, session?.user ? 'User present' : 'No user');
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserRole(session.user.id);
      } else {
        setUserRole(null);
        setLoading(false);
      }
    });

    return () => {
      console.log('🔐 AuthProvider: Cleaning up subscription');
      subscription.unsubscribe();
    };
  }, []);

  const loadUserRole = async (userId: string) => {
    console.log('🔐 loadUserRole: Loading role for user:', userId);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('🔐 loadUserRole: Error:', error);
        throw error;
      }
      
      console.log('🔐 loadUserRole: Role loaded:', data?.role);
      setUserRole(data?.role || null);
    } catch (err) {
      console.error('🔐 loadUserRole: Catch error:', err);
      setUserRole(null);
    } finally {
      console.log('🔐 loadUserRole: Setting loading false');
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    console.log('🔐 login: Attempting login for:', email);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('🔐 login: Error:', error);
      throw error;
    }
    console.log('🔐 login: Success');
  };

  const register = async (email: string, password: string, role: 'farmer' | 'officer' | 'admin') => {
    console.log('🔐 register: Attempting registration for:', email, 'as', role);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.error('🔐 register: Auth error:', error);
      throw error;
    }
    
    if (data.user) {
      console.log('🔐 register: User created, inserting role:', data.user.id);
      const { error: insertError } = await supabase.from('users').insert({ id: data.user.id, email, role });
      if (insertError) {
        console.error('🔐 register: Insert error:', insertError);
        throw insertError;
      }
      console.log('🔐 register: Role inserted successfully');
      setUserRole(role);
    }
  };

  const logout = async () => {
    console.log('🔐 logout: Logging out');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('🔐 logout: Error:', error);
      throw error;
    }
    console.log('🔐 logout: Success');
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

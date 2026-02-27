import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wcwoezciqsxvmxkfrsyn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indjd29lemNpcXN4dm14a2Zyc3luIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNDM3MjMsImV4cCI6MjA4NjYxOTcyM30.E1rAITA6cwrAtwOT_wF_jMPDm8sTxpc4ZEniaBGGgV8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

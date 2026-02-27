import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

console.log('🔌 Supabase: Initializing client');
console.log('🔌 Supabase URL:', supabaseUrl);
console.log('🔌 Supabase Key:', supabaseAnonKey ? 'Present' : 'Missing');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('🔌 Supabase: Client created');

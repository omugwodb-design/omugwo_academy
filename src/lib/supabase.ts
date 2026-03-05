import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Simple Supabase client — auth is handled natively by Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

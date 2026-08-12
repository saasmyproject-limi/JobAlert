/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Attention : Les variables d\'environnement VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY sont manquantes.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

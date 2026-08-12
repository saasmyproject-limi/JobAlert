/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const defaultUrl = 'https://mcmnodtfwhfdqaygxyka.supabase.co';
const defaultAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jbW5vZHRmd2hmZHFheWd4eWthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1MzA5ODgsImV4cCI6MjEwMjEwNjk4OH0.ThRaS3PyfCvv65xizlWLQ2qfQ6kGNXKkzOWwbSorp2M';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || defaultUrl;
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || defaultAnonKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

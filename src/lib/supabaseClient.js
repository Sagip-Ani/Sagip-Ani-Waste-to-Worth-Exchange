import { createClient } from '@supabase/supabase-js';

// Support both naming conventions: VITE_SUPABASE_ANON_KEY (standard) and VITE_SUPABASE_PUBLISHABLE_KEY (newer Supabase name)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'your_supabase_url' &&
  supabaseAnonKey !== 'your_anon_key' &&
  supabaseUrl.startsWith('http')
);

if (!isSupabaseConfigured) {
  console.warn(
    '[Sagip-Ani] Supabase environment variables are missing or incomplete. ' +
    'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  );
}

// Fallback dummy URL/key for initialization safety when variables are not yet populated
const safeUrl = isSupabaseConfigured ? supabaseUrl : 'https://placeholder-project.supabase.co';
const safeKey = isSupabaseConfigured ? supabaseAnonKey : 'placeholder-anon-key';

export const supabase = createClient(safeUrl, safeKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});


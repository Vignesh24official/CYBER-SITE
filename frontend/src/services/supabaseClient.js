import { createClient } from '@supabase/supabase-js';

// Retrieve Supabase environment variables from Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if valid credentials are provided
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('YOUR_PROJECT') && 
  !supabaseUrl.includes('placeholder')
);

// Create Supabase client singleton
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

/**
 * Upload evidence file directly to Supabase Storage bucket
 * Bucket name defaults to 'incident-evidence'
 */
export const uploadEvidenceToSupabase = async (file, pathPrefix = 'complaints') => {
  if (!supabase) {
    throw new Error('Supabase client is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${pathPrefix}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('incident-evidence')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from('incident-evidence')
    .getPublicUrl(fileName);

  return {
    path: data.path,
    publicUrl: urlData.publicUrl,
  };
};

/**
 * Trigger Supabase Google OAuth
 */
export const signInWithSupabaseGoogle = async () => {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    },
  });

  if (error) throw error;
  return data;
};

/**
 * Subscribe to realtime complaint status updates
 */
export const subscribeToComplaintUpdates = (complaintId, onUpdate) => {
  if (!supabase) return () => {};

  const channel = supabase
    .channel(`complaint-${complaintId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'complaints',
        filter: `id=eq.${complaintId}`,
      },
      (payload) => {
        if (onUpdate) onUpdate(payload.new);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

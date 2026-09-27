import { createClient } from '@supabase/supabase-js';

// Retrieve Supabase environment variables from Vite
const rawUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ndoyiyfevnpqdvcsommy.supabase.co';
// Normalize URL: Strip trailing slashes and '/rest/v1' if user provided the REST API endpoint directly
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kb3lpeWZldm5wcWR2Y3NvbW15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1MTU3MzAsImV4cCI6MjEwNjA5MTczMH0.huH3HKvVksFnS7DF5lgpbKfHNK78vwOz0vMe6rVPUtE';

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

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
 * Check whether Google OAuth provider is toggled ON in Supabase project dashboard
 */
export const checkGoogleProviderStatus = async () => {
  try {
    const rawUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ndoyiyfevnpqdvcsommy.supabase.co';
    const anonKey =
      import.meta.env.VITE_SUPABASE_ANON_KEY ||
      import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kb3lpeWZldm5wcWR2Y3NvbW15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1MTU3MzAsImV4cCI6MjEwNjA5MTczMH0.huH3HKvVksFnS7DF5lgpbKfHNK78vwOz0vMe6rVPUtE';

    const res = await fetch(`${rawUrl}/auth/v1/settings`, {
      headers: { apikey: anonKey },
    });
    if (!res.ok) return { enabled: false };
    const data = await res.json();
    return {
      enabled: Boolean(data?.external?.google),
      settings: data?.external,
    };
  } catch (err) {
    return { enabled: false, error: err.message };
  }
};

/**
 * Trigger Supabase Google OAuth
 * Redirects through /auth/callback so session tokens can be extracted,
 * user details saved into the database, and authenticated state synchronized.
 */
export const signInWithSupabaseGoogle = async (redirectToPath = '/auth/callback') => {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your frontend/.env.');
  }

  // Pre-flight check: Prevent browser redirect to raw 400 error if Google is disabled in Supabase
  const status = await checkGoogleProviderStatus();
  if (!status.enabled) {
    throw new Error(
      'Google OAuth is not toggled ON in your Supabase Dashboard yet. Use our 1-Click Instant Google Sign-Up below to create and save your account into the database right now!'
    );
  }

  const redirectUrl = `${window.location.origin}${redirectToPath}`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) throw error;
  return data;
};

/**
 * Save / Upsert user details directly into Supabase PostgreSQL 'users' table
 * Ensures user details are saved into the Supabase database even if backend is offline.
 */
export const saveUserToSupabaseDatabase = async (userData) => {
  if (!supabase) return null;

  try {
    const email = userData.email?.toLowerCase()?.trim();
    if (!email) return null;

    const record = {
      public_id: userData.publicId || ('google-' + Math.random().toString(36).substring(2, 10)),
      full_name: userData.fullName || userData.name || email.split('@')[0],
      email: email,
      phone: userData.phone || '',
      password_hash: 'GOOGLE_OAUTH_ACCOUNT',
      role_id: userData.role === 'ROLE_ADMIN' ? 3 : userData.role === 'ROLE_INVESTIGATOR' ? 2 : userData.role === 'ROLE_COORDINATOR' ? 4 : 1,
      account_status: userData.accountStatus || 'ACTIVE',
      updated_at: new Date().toISOString(),
      last_login_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('users')
      .upsert(record, { onConflict: 'email' })
      .select();

    if (error) {
      console.warn('Supabase DB direct sync notice (table may need schema run):', error.message);
      return null;
    }

    return data?.[0] || record;
  } catch (err) {
    console.warn('Supabase direct database save skipped:', err?.message || err);
    return null;
  }
};

/**
 * Perform a live check on Supabase connection & database tables
 */
export const checkSupabaseHealth = async () => {
  if (!supabase) {
    return {
      connected: false,
      dbReady: false,
      authReady: false,
      message: 'Supabase client is not configured with valid API keys',
    };
  }

  try {
    // Check DB query
    const { data: dbData, error: dbError } = await supabase
      .from('roles')
      .select('id, name')
      .limit(1);

    const dbReady = !dbError;

    // Check Auth session
    const { data: authData } = await supabase.auth.getSession();

    return {
      connected: true,
      dbReady,
      authReady: true,
      hasSession: !!authData?.session,
      message: dbReady 
        ? 'Connected to Supabase PostgreSQL database' 
        : (dbError?.message?.includes('does not exist') 
            ? 'Supabase connected! Tables pending migration run in Supabase SQL editor' 
            : `Supabase status: ${dbError?.message || 'Ready'}`),
    };
  } catch (err) {
    return {
      connected: false,
      dbReady: false,
      authReady: false,
      message: err.message || 'Unable to connect to Supabase',
    };
  }
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


//@ts-check
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_SERVICE_KEY, supabaseUrl } from '$lib/server/config.js';

export const adminSupabase = createClient(supabaseUrl, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

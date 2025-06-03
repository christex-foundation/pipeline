//@ts-check

import { createClient } from '@supabase/supabase-js';
import { SUPABASE_SERVICE_KEY, supabaseAnonKey, supabaseUrl } from '$lib/server/config.js';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const adminAuthClient = createClient(supabaseUrl, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
}).auth.admin;

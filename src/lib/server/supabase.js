//@ts-check

import { createClient } from '@supabase/supabase-js';
import { supabaseAnonKey, supabaseUrl } from '$lib/server/config.js';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

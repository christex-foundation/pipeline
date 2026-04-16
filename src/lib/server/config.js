//@ts-check
import { env } from '$env/dynamic/private';

export const SUPABASE_SERVICE_KEY = env.PRIVATE_SUPABASE_SERVICE_KEY;
export const supabaseUrl = env.VITE_SUPABASE_URL;
export const supabaseAnonKey = env.VITE_SUPERBASE_ANON_KEY;

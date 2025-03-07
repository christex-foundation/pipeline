//@ts-check
import { env } from '$env/dynamic/private';

export const OPENAI_API_KEY = env.PRIVATE_OPENAI_API_KEY;
export const GITHUB_TOKEN = env.PRIVATE_GITHUB_TOKEN;
export const SUPABASE_SERVICE_KEY = env.PRIVATE_SUPABASE_SERVICE_KEY;
export const supabaseUrl = env.VITE_SUPABASE_URL;
export const supabaseAnonKey = env.VITE_SUPERBASE_ANON_KEY;
export const redisHost = env.REDIS_HOST;
export const redisPort = env.REDIS_PORT;
export const redisPassword = env.REDIS_PASSWORD;

//@ts-check
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_SERVICE_KEY, supabaseUrl, supabaseAnonKey } from '$lib/server/config.js';

/**
 * Admin auth client for privileged operations (user creation, deletion).
 * Uses the service key — not request-scoped.
 */
const adminAuthClient = createClient(supabaseUrl, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
}).auth.admin;

/**
 * Creates a new user account with admin privileges.
 *
 * Provider contract:
 * - Input: email and password
 * - Output: user data object
 * - Throws on error
 *
 * To swap to an alternative auth provider (e.g. Keycloak, custom JWT),
 * reimplement this function to create a user in the alternative system.
 *
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<any>} Created user data
 */
export async function createUser({ email, password }) {
  const { data, error } = await adminAuthClient.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) throw new Error(error.message);
  return data;
}

/**
 * Deletes a user account.
 *
 * @param {string} userId
 * @returns {Promise<void>}
 */
export async function deleteUser(userId) {
  const { error } = await adminAuthClient.deleteUser(userId);
  if (error) throw new Error(error.message);
}

/**
 * Signs in a user with email/password using a request-scoped client.
 *
 * @param {{ email: string, password: string }} credentials
 * @param {any} supabaseClient - Request-scoped Supabase client
 * @returns {Promise<any>} Session and user data
 */
export async function signInWithPassword(credentials, supabaseClient) {
  const { data, error } = await supabaseClient.auth.signInWithPassword(credentials);
  if (error) throw new Error(error.message);
  return data;
}

/**
 * Signs out the current user.
 *
 * @param {any} supabaseClient - Request-scoped Supabase client
 * @returns {Promise<void>}
 */
export async function signOut(supabaseClient) {
  const { error } = await supabaseClient.auth.signOut();
  if (error) {
    console.error('Error during sign-out:', error.message);
    throw new Error('Failed to log out.');
  }
}

/**
 * Creates a request-scoped server client for SSR auth with cookie management.
 *
 * Provider contract:
 * - Input: cookie handlers ({ getAll, setAll })
 * - Output: a client object that supports .auth.getSession() and .auth.getUser()
 *
 * To swap to an alternative auth provider, reimplement this to return
 * an object with compatible .auth methods.
 *
 * @param {{ getAll: () => any[], setAll: (cookies: any[]) => void }} cookieHandlers
 * @returns {any} Server-scoped auth client
 */
export function createSessionClient(cookieHandlers) {
  return createServerClient(supabaseUrl, SUPABASE_SERVICE_KEY, {
    cookies: cookieHandlers,
  });
}

/**
 * Validates the current session and returns the session + user if valid.
 *
 * @param {any} supabaseClient - Request-scoped Supabase client
 * @returns {Promise<{ session: any, user: any }>}
 */
export async function getSessionAndUser(supabaseClient) {
  const {
    data: { session },
  } = await supabaseClient.auth.getSession();

  if (!session) {
    return { session: null, user: null };
  }

  const {
    data: { user },
    error,
  } = await supabaseClient.auth.getUser();

  if (error || !user) {
    return { session: null, user: null };
  }

  return { session, user };
}

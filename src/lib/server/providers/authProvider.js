//@ts-check
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_SERVICE_KEY, supabaseUrl } from '$lib/server/config.js';

/**
 * Admin client for privileged operations. Uses the service key and carries no
 * user session, so database writes bypass RLS. Used for server-side operations
 * whose authorization has already been verified out-of-band (e.g. OAuth
 * identity linking).
 */
const adminClient = createClient(supabaseUrl, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
const adminAuthClient = adminClient.auth.admin;

export { adminClient as supabaseAdmin };

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
/**
 * Initiates linking a social identity provider to the current user.
 * Returns a URL to redirect the user to for OAuth authorization.
 *
 * @param {any} supabaseClient - Request-scoped Supabase client
 * @param {{ provider: string, redirectTo: string, scopes: string }} options
 * @returns {Promise<{ url: string|null }>}
 */
export async function linkIdentity(supabaseClient, { provider, redirectTo, scopes }) {
  const { data, error } = await supabaseClient.auth.linkIdentity({
    provider,
    options: { redirectTo, scopes },
  });
  if (error) throw new Error(error.message);
  return { url: data?.url || null };
}

/**
 * Exchanges an OAuth code for a session. Used in OAuth callback routes.
 *
 * @param {any} supabaseClient - Request-scoped Supabase client
 * @param {string} code - The authorization code from the OAuth callback
 * @returns {Promise<{ session: any }>}
 */
export async function exchangeCodeForSession(supabaseClient, code) {
  const { data, error } = await supabaseClient.auth.exchangeCodeForSession(code);
  if (error) throw new Error(error.message);
  return { session: data.session };
}

/**
 * Unlinks the current user's identity for a specific OAuth provider.
 * Returns false when no identity for that provider is linked.
 *
 * @param {any} supabaseClient - Request-scoped Supabase client
 * @param {string} provider
 * @returns {Promise<boolean>}
 */
export async function unlinkIdentityByProvider(supabaseClient, provider) {
  const { data, error } = await supabaseClient.auth.getUserIdentities();
  if (error) throw new Error(error.message);

  const identity = data?.identities?.find((entry) => entry.provider === provider);
  if (!identity) {
    return false;
  }

  const { error: unlinkError } = await supabaseClient.auth.unlinkIdentity(identity);
  if (unlinkError) throw new Error(unlinkError.message);

  return true;
}

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

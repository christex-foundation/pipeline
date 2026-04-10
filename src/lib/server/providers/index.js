//@ts-check

/**
 * Provider registry — selects the active provider implementation
 * for each external service based on environment configuration.
 *
 * Providers:
 * - Storage: Supabase Storage
 * - Auth: Supabase Auth
 */

export { uploadFile, getPublicUrl, deleteFiles } from './storageProvider.js';
export {
  createUser,
  deleteUser,
  signInWithPassword,
  signOut,
  createSessionClient,
  getSessionAndUser,
  linkIdentity,
  exchangeCodeForSession,
} from './authProvider.js';
export { createGitHubClient, getGitHubUser } from './githubProvider.js';

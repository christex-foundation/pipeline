//@ts-check
import { redisHost } from '$lib/server/config.js';

/**
 * Provider registry — selects the active provider implementation
 * for each external service based on environment configuration.
 *
 * Default behavior:
 * - Queue: BullMQ if Redis is configured, in-memory fallback otherwise
 * - AI: OpenAI (configurable via AI_PROVIDER env var in future)
 * - Storage: Supabase Storage
 * - Auth: Supabase Auth
 *
 * To swap a provider, either:
 * 1. Change the import in this file to point to your custom implementation
 * 2. Or extend with env-var-driven dynamic imports when multiple providers exist
 */

/**
 * Returns the queue provider module.
 * Uses BullMQ when Redis is available, falls back to in-memory queue.
 * @returns {Promise<{ createQueue: Function, createWorker: Function }>}
 */
export async function getQueueProvider() {
  if (redisHost) {
    return await import('./queueProvider.js');
  }
  return await import('./inMemoryQueue.js');
}

// AI, Storage, and Auth providers are imported directly for now.
// When alternative implementations exist, add similar getter functions.
export { chatCompletionWithSchema, getEmbedding } from './aiProvider.js';
export { uploadFile, getPublicUrl, deleteFiles } from './storageProvider.js';
export {
  createUser,
  deleteUser,
  signInWithPassword,
  signOut,
  createSessionClient,
  getSessionAndUser,
} from './authProvider.js';

//@ts-check
// AI, Storage, and Auth providers are imported directly for now.
// When alternative implementations exist, add getter functions here.
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

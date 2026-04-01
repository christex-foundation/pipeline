import {
  createUser,
  deleteUser as deleteAuthUser,
  signInWithPassword,
  signOut,
} from '$lib/server/providers/authProvider.js';

export async function registerUser(registerData) {
  const { email, password } = registerData;
  return createUser({ email, password });
}

export async function loginUser(loginData, supabase) {
  return signInWithPassword(loginData, supabase);
}

export async function logoutUser(supabase) {
  return signOut(supabase);
}

export async function deleteUser(userId) {
  return deleteAuthUser(userId);
}

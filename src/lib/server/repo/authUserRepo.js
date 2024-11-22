import { supabase, adminAuthClient } from '$lib/server/supabase.js';

export async function getAuthUser(accessToken) {
  const { data: userData, error: userError } = await supabase.auth.getUser(accessToken);

  return userData;
}

export async function registerUser(registerData) {
  const { email, password } = registerData;
  const { data: signUpData, error } = await adminAuthClient.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) throw new Error(error.message);
  return signUpData;
}

export async function loginUser(loginData) {
  const { data, error } = await supabase.auth.signInWithPassword(loginData);

  if (error) throw new Error(error.message);
  return data;
}

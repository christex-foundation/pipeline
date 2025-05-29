import { loginUser, registerUser, logoutUser } from '$lib/server/repo/authUserRepo.js';
import { createProfile } from '$lib/server/repo/userProfileRepo.js';
import { json } from '@sveltejs/kit';

export async function login(loginData, supabase) {
  const data = await loginUser(loginData, supabase);

  if (data && data.session) {
    const headers = new Headers();
    headers.append(
      'Set-Cookie',
      `access_token=${data.session.access_token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`,
    );
    headers.append(
      'Set-Cookie',
      `refresh_token=${data.session.refresh_token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`,
    );

    // Return the response with headers
    return json({ success: true, redirectTo: '/explore' }, { status: 200, headers });
  }
}

export async function register(registerData, supabase) {
  const data = await registerUser(registerData);

  if (data) {
    await createProfile(
      {
        id: data.user.id,
        name: registerData.name,
      },
      supabase,
    );

    return await login({ email: registerData.email, password: registerData.password }, supabase);
  }
}

export async function signOut(supabase) {
  await logoutUser(supabase);
}

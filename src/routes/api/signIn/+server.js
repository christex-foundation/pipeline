//@ts-check
import { login } from '$lib/server/service/authUserService.js';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
  try {
    const body = await request.json();
    const response = await login(body);

    return response;
  } catch (err) {
    console.error('Server error during sign-in:', err);
    return json({ error: 'Failed to sign in' }, { status: 500 });
  }
}

import { json } from '@sveltejs/kit';
import { update } from '$lib/server/service/profileService.js';

export async function PUT({ request, locals }) {
    let user = locals.authUser;
  let supabase = locals.supabase;

  try {
    const profileData = await request.json();
    await update(user, profileData, supabase);

    return json({ success: true }, { status: 200 });
  } catch (error) {
    return json({ error }, { status: 500 });
  }
}
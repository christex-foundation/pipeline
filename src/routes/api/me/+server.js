//import { supabase } from "$lib/server/supabase.js"; // Import your Supabase client
import { getProfile } from '$lib/server/repo/userProfileRepo.js';
import { json } from '@sveltejs/kit';

export async function GET({ request, locals }) {
  let authUser = locals.authUser;
  let supabase = locals.supabase;

  const profile = await getProfile(authUser.id, supabase);

  const user = {
    id: authUser.id,
    email: authUser.email,
    display_name: profile.name,
    bio: profile.bio,
    interests: profile.interests,
    skills: profile.skills,
    image_url: profile.image,
    points: profile.points,
  };

  return json({ user }, { status: 200 });
}

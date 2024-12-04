import { getProfile } from '$lib/server/repo/userProfileRepo.js';

export async function load({ locals }) {
  const { authUser, session, supabase } = locals;

  let error = null;

  if (!authUser) {
    return {
      isAuthenticated: false,
      user: null,
      error,
    };
  }

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

  return {
    isAuthenticated: !!session,
    user,
    error,
  };
}

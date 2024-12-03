import { getProfile } from '$lib/server/repo/userProfileRepo.js';

export async function load({ fetch, locals }) {
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

  // try {
  //   const response = await fetch('/api/me', {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   });

  //   if (response.ok) {
  //     const result = await response.json();
  //     user = result.user;
  //   } else {
  //     const result = await response.json();
  //     error = result.error;
  //   }
  // } catch (err) {
  //   error = 'Failed to fetch user data';
  // }

  
}

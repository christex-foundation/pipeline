import { getProfileByUserId } from '$lib/server/service/profileService.js';

export async function load({ locals, url }) {
  const { authUser, session, supabase } = locals;

  let error = null;
  const pathname = url.pathname;

  if (!authUser) {
    return {
      isAuthenticated: false,
      user: null,
      error,
      pathname,
    };
  }

  const profile = await getProfileByUserId(authUser.id, supabase);

  const user = {
    id: authUser.id,
    email: authUser.email,
    display_name: profile.name,
    bio: profile.bio,
    country: profile.country,
    interests: profile.interests,
    skills: profile.skills,
    image_url: profile.image,
    points: profile.points,
    banner_url: profile.banner,
    github: profile.github,
    discord: profile.discord,
    twitter: profile.twitter,
    website: profile.web,
    linkedin: profile.linkedin,
    others: profile.others,
  };

  return {
    isAuthenticated: !!session,
    user,
    error,
    pathname,
  };
}

// import { json } from '@sveltejs/kit';
// import { update } from '$lib/server/service/profileService.js';

// export async function PUT({ request, locals }) {
//   let user = locals.authUser;
//   let supabase = locals.supabase;

//   try {
//     const profileData = await request.json();
//     await update(user, profileData, supabase);

//     return json({ success: true }, { status: 200 });
//   } catch (error) {
//     return json({ error }, { status: 500 });
//   }
// }

import { json } from '@sveltejs/kit';
// import { update } from '$lib/server/service/profileService.js';

export async function PUT({ request, locals }) {
  try {
    const supabase = locals.supabase;

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse the request body
    const profileData = await request.json();

    // Extract all the fields that should be updated
    const {
      name,
      bio,
      country,
      skills,
      interests,
      user_type,
      image,
      banner,
      // Social media fields
      discord,
      twitter,
      web,
      linkedin,
      others,
      github,
    } = profileData;

    // Prepare the update object with only the fields that are provided
    const updateData = {};

    // Basic profile fields
    if (name !== undefined) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (country !== undefined) updateData.country = country;
    if (skills !== undefined) updateData.skills = skills;
    if (interests !== undefined) updateData.interests = interests;
    if (user_type !== undefined) updateData.user_type = user_type;
    if (image !== undefined) updateData.image = image;
    if (banner !== undefined) updateData.banner = banner;

    // Social media fields - store the full URLs
    if (discord !== undefined) updateData.discord = discord;
    if (twitter !== undefined) updateData.twitter = twitter;
    if (web !== undefined) updateData.web = web;
    if (linkedin !== undefined) updateData.linkedin = linkedin;
    if (others !== undefined) updateData.others = others;
    if (github !== undefined) updateData.github = github;

    // Update the profile in the database
    const { data, error } = await supabase
      .from('profile')
      .update(updateData)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return json({ error: 'Failed to update profile' }, { status: 500 });
    }

    // Return the updated profile data
    return json({
      success: true,
      message: 'Profile updated successfully',
      data: data,
    });
  } catch (error) {
    console.error('API error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}

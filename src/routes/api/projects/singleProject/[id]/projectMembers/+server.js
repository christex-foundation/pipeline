import { json } from '@sveltejs/kit';
import { teamMembers } from '$lib/server/repo/memberRepo.js';
import { getMultipleProfiles } from '$lib/server/repo/userProfileRepo.js';

export async function GET({ params, locals }) {
  const { id } = params;
  const supabase = locals.supabase;

  try {
    const members = await teamMembers(id, supabase);

    if (!members || members.length === 0) {
      return json({ members: [] }, { status: 200 });
    }

    const userIds = [...new Set(members.map((member) => member.user_id))];
    const profiles = await getMultipleProfiles(userIds, supabase);

    const profilesByUserId = profiles.reduce((acc, profile) => {
      acc[profile.user_id] = profile;
      return acc;
    }, {});

    const membersWithProfiles = members.map((member) => ({
      ...member,
      userProfile: profilesByUserId[member.user_id] || null,
    }));

    return json({ members: membersWithProfiles }, { status: 200 });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}

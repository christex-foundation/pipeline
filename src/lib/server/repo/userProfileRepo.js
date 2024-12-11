//@ts-check

export async function getMultipleProfiles(userIds, supabase) {
  const { data, error } = await supabase.from('profile').select('*').in('user_id', userIds);

  if (error) throw new Error(error.message);
  return data || [];
}

export async function getProfile(userId, supabase) {
  const { data, error } = await supabase.from('profile').select('*').eq('user_id', userId).single();

  if (error) throw new Error(error.message);
  return data || {};
}

export async function createProfile(profileData, supabase) {
  const { data, error } = await supabase.from('profile').insert({
    user_id: profileData.id,
    name: profileData.name,
  });

  if (error) throw new Error(error.message);
  return data;
}

export async function updateProfile(id, profileData, supabase) {
  const { data, error } = await supabase.from('profile').update(profileData).eq('user_id', id);
  if (error) throw new Error(error.message);
  return data;
}

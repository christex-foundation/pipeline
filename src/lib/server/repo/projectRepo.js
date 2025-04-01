//@ts-check

export async function getProjects(term, start, end, supabase) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .ilike('title', `%${term}%`)
    .range(start, end)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function getProject(id, supabase) {
  const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();
  if (error) throw new Error(error.message);
  return data || {};
}

export async function getProjectsByIds(Ids, supabase) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .in('id', Ids)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data || {};
}

export async function getProjectsByUserId(userId, start, end, supabase) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .range(start, end)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function getProjectByGithub(url, supabase) {
  const { data, error } = await supabase.from('projects').select('*').eq('github', url).single();
  if (error) throw new Error(error.message);
  return data;
}

export async function createProject(projectData, supabase) {
  const { data, error } = await supabase.from('projects').insert(projectData).select();
  if (error) throw new Error(error.message);
  return data[0];
}

export async function updateDetails(id, projectData, supabase) {
  const { data, error } = await supabase.from('projects').update(projectData).eq('id', id).select();
  if (error) throw new Error(error.message);
  return data[0];
}

export async function updateProjectDpg(id, projectData, supabase) {
  console.log('repo', projectData);
  const { data, error } = await supabase
    .from('projects')
    .update({ dpgStatus: projectData })
    .eq('id', id)
    .select();
  if (error) throw new Error(error.message);
  return data[0];
}

export async function deleteProject(id, supabase) {
  const { data, error } = await supabase.from('projects').delete().eq('id', id).select();
  if (error) throw new Error(error.message);
  return data[0];
}

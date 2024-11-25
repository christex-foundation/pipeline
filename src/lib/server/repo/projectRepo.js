//@ts-check
import { supabase } from '$lib/server/supabase.js';

export async function getProjects(term, start, end) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .ilike('title', `%${term}%`)
    .range(start, end)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function getProject(id) {
  const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();
  if (error) throw new Error(error.message);
  return data || {};
}

export async function getProjectsByIds(Ids) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .in('id', Ids)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data || {};
}

export async function getProjectsByUserId(userId, start, end) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .range(start, end)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}



export async function createProject(projectData) {
  const { data, error } = await supabase.from('projects').insert(projectData).select();
  if (error) throw new Error(error.message);
  return data[0];
}

export async function updateDetails(projectData) {
  const { data, error } = await supabase
    .from('projects')
    .update(projectData)
    .eq('id', projectData.id)
    .select();
  if (error) throw new Error(error.message);
  return data[0];
}

export async function deleteProject(id) {
  const { data, error } = await supabase.from('projects').delete().eq('id', id).select();
  if (error) throw new Error(error.message);
  return data[0];
}



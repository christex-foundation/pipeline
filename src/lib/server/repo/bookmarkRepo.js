//@ts-check
//import { supabase } from '$lib/server/supabase.js';

export async function getExistingBookmarks(projectId, userId, supabase) {
  const { data, error } = await supabase
    .from('bookmark_project')
    .select('*')
    .eq('user_id', userId)
    .eq('project_id', projectId)
    .single();

  return data;
}

export async function getExistingBookmarksByUserId(userId, start, end, supabase) {
  const { data, error } = await supabase
    .from('bookmark_project')
    .select('*')
    .eq('user_id', userId)
    .range(start, end)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message);

  return data;
}

export async function addBookmark(projectId, userId, supabase) {
  console.log(userId);
  const { data, error } = await supabase
    .from('bookmark_project')
    .insert([
      {
        user_id: userId,
        project_id: projectId,
      },
    ])
    .select();

  if (error) throw new Error(error.message);
  return data[0];
}

export async function deleteBookmark(projectId, userId, supabase) {
  const { data, error } = await supabase
    .from('bookmark_project')
    .delete()
    .eq('user_id', userId)
    .eq('project_id', projectId);

  if (error) throw new Error(error.message);
  return data;
}

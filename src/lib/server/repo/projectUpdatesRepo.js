//@ts-check
//import { supabase } from '$lib/server/supabase.js';

export async function getUpdates(projectId, supabase) {
    const { data, error } = await supabase
    .from("project_updates")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
}

export async function storeProjectUpdate(projectUpdateData, supabase) {
    const { data, error } = await supabase.from('project_updates').insert(projectUpdateData).select();
    if (error) throw new Error(error.message);
    return data[0];
}
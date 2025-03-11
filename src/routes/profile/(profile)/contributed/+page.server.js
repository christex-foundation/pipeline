import { supabase } from '$lib/server/supabase.js';

export async function load({ locals }) {
  const subquery = await supabase
    .from('project_resource')
    .select('project_id')
    .eq('user_id', locals?.authUser?.id);

  const { data: contributed } = await supabase
    .from('projects')
    .select('*')
    .in(
      'id',
      subquery?.data?.flatMap((d) => d.project_id),
    );

  return {
    projects: contributed,
  };
}

// src/routes/api/updateFunding/[id]/+server.js
import { supabase } from '$lib/server/supabase.js';

export async function POST({ params }) {
  const projectId = params.id;

  const { data: contributions, error: contribError } = await supabase
    .from('contributions')
    .select('amount')
    .eq('project_id', projectId)
    .eq('status', 'success');

  if (contribError) {
    return new Response(JSON.stringify({ error: contribError.message }), { status: 500 });
  }

  const totalFunding = contributions.reduce((sum, c) => sum + c.amount, 0);

  const { error: updateError } = await supabase
    .from('projects')
    .update({ current_funding: totalFunding })
    .eq('id', projectId);

  if (updateError) {
    return new Response(JSON.stringify({ error: updateError.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true, totalFunding }), { status: 200 });
}

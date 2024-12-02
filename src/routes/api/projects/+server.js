//@ts-check

import { supabase } from '$lib/server/supabase.js';

import { getProjectsWithDetails } from '$lib/server/service/projectService.js';

import { json } from '@sveltejs/kit';

export async function GET({ url }) {
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '6', 10);
  const term = url.searchParams.get('term') || '';

  try {
    const projects = await getProjectsWithDetails(term, page, limit);

    return json({ projects: projects }, { status: 200 });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}

export async function POST({ request, locals }) {
  let user = locals.authUser.user;

  try {
    const {
      title,
      bio,
      tags,
      country,
      details,
      email,
      portfolio,
      github,
      linkedin,
      twitter,
      website,
      other,
      bank_acct,
      wallet_address,
      funding_goal,
    } = await request.json();

    const { data, error } = await supabase.from('projects').insert([
      {
        user_id: user.id,
        title,
        bio,
        tags,
        country,
        details,
        email,
        portfolio,
        github_repo: github,
        linkedin,
        twitter,
        website,
        other,
        bank_acct,
        wallet_address,
        funding_goal,
      },
    ]);

    if (error) {
      return json({ error: error.message }, { status: 400 });
    }

    return json({ success: true }, { status: 200 });
  } catch (error) {
    return json({ erorr: error }, { status: 500 });
  }
}

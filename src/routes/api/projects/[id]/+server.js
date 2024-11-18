import { supabase } from '$lib/server/supabase.js';
import { json } from '@sveltejs/kit';

export async function PUT({ request, params }) {
  const cookies = request.headers.get('cookie');

  if (!cookies) {
    return new Response(JSON.stringify({ error: 'No cookies found' }), {
      status: 401,
    });
  }

  // Parse cookies to extract the access token
  const accessToken = cookies
    .split(';')
    .find((cookie) => cookie.trim().startsWith('access_token='))
    ?.split('=')[1];

  if (!accessToken) {
    return new Response(JSON.stringify({ error: 'No access token found' }), {
      status: 401,
    });
  }

  // Get user data from Supabase using the access token
  const { data: userData, error: userError } = await supabase.auth.getUser(accessToken);

  if (userError) {
    return json({ error: userError.message }, { status: 401 });
  }

  let user = userData.user;

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

    const { data, error } = await supabase.from('projects').update({
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
      user_id: user.id,
    });

    if (error) {
      return json({ error: error.message }, { status: 400 });
    }

    const { data: existingTags, error: existingTagsError } = await supabase
      .from('category_project')
      .select('category_id')
      .eq('project_id', projectId);

    if (existingTagsError) {
      return json({ error: existingTagsError.message }, { status: 400 });
    }

    const existingTagIds = existingTags.map((tag) => tag.category_id);
    const newTagIds = tags.map((tag) => tag.id);

    // Determine tags to remove and add
    const tagsToRemove = existingTagIds.filter((tagId) => !newTagIds.includes(tagId));
    const tagsToAdd = newTagIds.filter((tagId) => !existingTagIds.includes(tagId));

    // Remove tags no longer associated with the project
    if (tagsToRemove.length > 0) {
      const { error: removeError } = await supabase
        .from('category_project')
        .delete()
        .in('category_id', tagsToRemove)
        .eq('project_id', projectId);

      if (removeError) {
        return json({ error: removeError.message }, { status: 400 });
      }
    }

    // Add new tags
    if (tagsToAdd.length > 0) {
      const insertData = tagsToAdd.map((tagId) => ({
        project_id: projectId,
        category_id: tagId,
      }));
      const { error: addError } = await supabase.from('category_project').insert(insertData);

      if (addError) {
        return json({ error: addError.message }, { status: 400 });
      }
    }

    return json({ success: true }, { status: 200 });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}

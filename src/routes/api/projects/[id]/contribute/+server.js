import { supabase } from '$lib/server/supabase.js';
import { json } from '@sveltejs/kit';

export async function POST({ request, params }) {
  const cookies = request.headers.get('cookie');
  const id = params.id;

  if (!cookies) {
    return json({ error: 'No cookies found' }, { status: 401 });
  }

  // Parse cookies to extract the access token
  const accessToken = cookies
    .split(';')
    .find((cookie) => cookie.trim().startsWith('access_token='))
    ?.split('=')[1];

  if (!accessToken) {
    return json({ error: 'No access token found' }, { status: 401 });
  }

  // Get user data from Supabase using the access token
  const { data: userData, error: userError } = await supabase.auth.getUser(accessToken);

  if (userError) {
    return json({ error: userError.message }, { status: 401 });
  }

  const user = userData.user;

  try {
    const { resourceType, resourceTitle, resourceLink, country, interest } = await request.json();

    const { data, error } = await supabase
      .from('project_resource')
      .insert([
        {
          project_id: id,
          user_id: user.id,
          type_resource: resourceType,
          title: resourceTitle,
          link: resourceLink,
          country,
          reason: interest,
        },
      ])
      .select();

    if (error) {
      return json({ error: error.message }, { status: 500 });
    }

    return json({ success: true, message: 'Application submitted successfully' }, { status: 200 });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}

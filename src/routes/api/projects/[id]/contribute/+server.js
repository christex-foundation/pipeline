import { storeProjectResource } from '$lib/server/service/projectContributionsService.js';
import { json } from '@sveltejs/kit';

export async function POST({ request, params, locals }) {
  const id = params.id;

  let user = locals.authUser;

  try {
    const { resourceType, resourceTitle, resourceLink, country, interest } = await request.json();

    await storeProjectResource({
      project_id: id,
      user_id: user.id,
      type_resource: resourceType,
      title: resourceTitle,
      link: resourceLink,
      country,
      reason: interest,
    });

    return json({ success: true, message: 'Application submitted successfully' }, { status: 200 });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}

import { json } from '@sveltejs/kit';
import { generateUserDataExport } from '$lib/server/service/dataExportService.js';

export async function POST({ locals, supabase }) {
  const authUser = locals.authUser;

  if (!authUser) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const exportData = await generateUserDataExport(authUser.id, supabase);

    return json(exportData, {
      status: 200,
      headers: {
        'Content-Disposition': `attachment; filename="pipeline-data-${authUser.id}.json"`,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Data export error:', error);
    return json({ error: 'Failed to generate data export' }, { status: 500 });
  }
}

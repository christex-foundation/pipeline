import { getProjectExportData, toCsv, toPathRows } from '$lib/server/service/exportService.js';
import { json } from '@sveltejs/kit';

/**
 * @param {'json' | 'csv'} format
 * @param {string} projectId
 */
function getExportHeaders(format, projectId) {
  const filename = `pipeline-project-export-${projectId}-${new Date().toISOString().split('T')[0]}.${format}`;
  const contentType = format === 'csv' ? 'text/csv; charset=utf-8' : 'application/json';

  return {
    'Content-Disposition': `attachment; filename="${filename}"`,
    'Cache-Control': 'no-store',
    'Content-Type': contentType,
  };
}

export async function GET({ params, url, locals }) {
  const format = (url.searchParams.get('format') || 'json').toLowerCase();
  const authUser = locals.authUser;
  const supabase = locals.supabase;
  const projectId = params.id;

  if (!authUser) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (format !== 'json' && format !== 'csv') {
    return json({ error: "Invalid format. Use 'json' or 'csv'" }, { status: 400 });
  }

  try {
    const { data } = await getProjectExportData(projectId, authUser.id, supabase);
    const headers = getExportHeaders(format, projectId);

    if (format === 'csv') {
      const rows = toPathRows(data);
      const csv = toCsv(rows);
      return new Response(csv, { status: 200, headers });
    }

    return new Response(JSON.stringify(data, null, 2), { status: 200, headers });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return json({ error: 'Forbidden' }, { status: 403 });
    }

    if (error.message === 'Project not found') {
      return json({ error: 'Project not found' }, { status: 404 });
    }

    return json({ error: error.message || 'Failed to export project data' }, { status: 500 });
  }
}

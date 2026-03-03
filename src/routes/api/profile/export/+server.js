import { getUserExportData, toCsv, toPathRows } from '$lib/server/service/exportService.js';
import { json } from '@sveltejs/kit';

/**
 * @param {'json' | 'csv'} format
 * @param {string} userId
 */
function getExportHeaders(format, userId) {
  const filename = `pipeline-user-export-${userId}-${new Date().toISOString().split('T')[0]}.${format}`;
  const contentType = format === 'csv' ? 'text/csv; charset=utf-8' : 'application/json';

  return {
    'Content-Disposition': `attachment; filename="${filename}"`,
    'Cache-Control': 'no-store',
    'Content-Type': contentType,
  };
}

export async function GET({ url, locals }) {
  const format = (url.searchParams.get('format') || 'json').toLowerCase();
  const authUser = locals.authUser;
  const supabase = locals.supabase;

  if (!authUser) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (format !== 'json' && format !== 'csv') {
    return json({ error: "Invalid format. Use 'json' or 'csv'" }, { status: 400 });
  }

  try {
    const payload = await getUserExportData(authUser.id, supabase);
    const headers = getExportHeaders(format, authUser.id);

    if (format === 'csv') {
      const rows = toPathRows(payload);
      const csv = toCsv(rows);
      return new Response(csv, { status: 200, headers });
    }

    return new Response(JSON.stringify(payload, null, 2), { status: 200, headers });
  } catch (error) {
    console.error('Profile export failed', { error, userId: authUser?.id });
    return json({ error: 'Failed to export data' }, { status: 500 });
  }
}

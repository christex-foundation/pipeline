import {
  consumeExportRateLimit,
  EXPORT_MAX_RECORDS,
  EXPORT_RATE_LIMIT_MAX,
  EXPORT_RATE_LIMIT_WINDOW_MS,
  getExportRowCount,
  getProjectExportData,
  toCsv,
  toReadableRows,
  toXml,
} from '$lib/server/service/exportService.js';
import { json } from '@sveltejs/kit';

/**
 * @param {'json' | 'csv' | 'xml'} format
 * @param {string} projectId
 */
function getExportHeaders(format, projectId) {
  const sanitizedProjectId = projectId
    .replace(/[\r\n"]/g, '')
    .replace(/[^A-Za-z0-9._-]/g, '_')
    .slice(0, 64);
  const safeProjectId = sanitizedProjectId || 'project';
  const filename = `pipeline-project-export-${safeProjectId}-${new Date().toISOString().split('T')[0]}.${format}`;
  const contentTypes = {
    json: 'application/json',
    csv: 'text/csv; charset=utf-8',
    xml: 'application/xml; charset=utf-8',
  };

  return {
    'Content-Disposition': `attachment; filename="${filename}"`,
    'Cache-Control': 'no-store',
    'Content-Type': contentTypes[format] || 'application/json',
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

  if (format !== 'json' && format !== 'csv' && format !== 'xml') {
    return json({ error: "Invalid format. Use 'json', 'csv', or 'xml'" }, { status: 400 });
  }

  const rateCheck = consumeExportRateLimit(authUser.id);
  if (!rateCheck.allowed) {
    return json(
      { error: 'Rate limit exceeded. Please retry later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateCheck.retryAfterSeconds),
          'X-RateLimit-Limit': String(EXPORT_RATE_LIMIT_MAX),
          'X-RateLimit-Remaining': String(rateCheck.remaining),
        },
      },
    );
  }

  try {
    const { data } = await getProjectExportData(projectId, authUser.id, supabase);
    const headers = getExportHeaders(format, projectId);
    const rowCount = getExportRowCount(data);
    const metricsHeaders = {
      'X-RateLimit-Limit': String(EXPORT_RATE_LIMIT_MAX),
      'X-RateLimit-Remaining': String(rateCheck.remaining),
      'X-Export-Row-Count': String(rowCount),
      'X-Export-Record-Cap': String(EXPORT_MAX_RECORDS),
      'X-Export-Window-Ms': String(EXPORT_RATE_LIMIT_WINDOW_MS),
    };

    if (format === 'csv') {
      const rows = toReadableRows(data);
      const csv = toCsv(rows);
      return new Response(csv, { status: 200, headers: { ...headers, ...metricsHeaders } });
    }

    if (format === 'xml') {
      const xml = toXml(data);
      return new Response(xml, { status: 200, headers: { ...headers, ...metricsHeaders } });
    }

    return new Response(JSON.stringify(data, null, 2), {
      status: 200,
      headers: { ...headers, ...metricsHeaders },
    });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return json({ error: 'Forbidden' }, { status: 403 });
    }

    if (error.message === 'Project not found') {
      return json({ error: 'Project not found' }, { status: 404 });
    }

    const status = error.message?.includes('record cap') ? 413 : 500;
    console.error('Project export failed', { error, projectId, userId: authUser?.id });
    return json({ error: error.message || 'Failed to export project data' }, { status });
  }
}

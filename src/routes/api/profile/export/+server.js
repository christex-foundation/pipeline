import {
  consumeExportRateLimit,
  EXPORT_MAX_RECORDS,
  EXPORT_RATE_LIMIT_MAX,
  EXPORT_RATE_LIMIT_WINDOW_MS,
  getExportRowCount,
  getUserExportData,
  toCsv,
  toReadableRows,
  toXml,
} from '$lib/server/service/exportService.js';
import { json } from '@sveltejs/kit';

/**
 * @param {'json' | 'csv' | 'xml'} format
 * @param {string} userId
 */
function getExportHeaders(format, userId) {
  const sanitizedUserId = userId
    .replace(/[\r\n"]/g, '')
    .replace(/[^A-Za-z0-9._-]/g, '_')
    .slice(0, 64);
  const safeUserId = sanitizedUserId || 'user';
  const filename = `pipeline-user-export-${safeUserId}-${new Date().toISOString().split('T')[0]}.${format}`;
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

export async function GET({ url, locals }) {
  const format = (url.searchParams.get('format') || 'json').toLowerCase();
  const authUser = locals.authUser;
  const supabase = locals.supabase;

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
    const payload = await getUserExportData(authUser.id, supabase);
    const headers = getExportHeaders(format, authUser.id);
    const rowCount = getExportRowCount(payload);
    const metricsHeaders = {
      'X-RateLimit-Limit': String(EXPORT_RATE_LIMIT_MAX),
      'X-RateLimit-Remaining': String(rateCheck.remaining),
      'X-Export-Row-Count': String(rowCount),
      'X-Export-Record-Cap': String(EXPORT_MAX_RECORDS),
      'X-Export-Window-Ms': String(EXPORT_RATE_LIMIT_WINDOW_MS),
    };

    if (format === 'csv') {
      const rows = toReadableRows(payload);
      const csv = toCsv(rows);
      return new Response(csv, { status: 200, headers: { ...headers, ...metricsHeaders } });
    }

    if (format === 'xml') {
      const xml = toXml(payload);
      return new Response(xml, { status: 200, headers: { ...headers, ...metricsHeaders } });
    }

    return new Response(JSON.stringify(payload, null, 2), {
      status: 200,
      headers: { ...headers, ...metricsHeaders },
    });
  } catch (error) {
    const status = error.message?.includes('record cap') ? 413 : 500;
    console.error('Profile export failed', { error, userId: authUser?.id });
    return json({ error: error.message || 'Failed to export data' }, { status });
  }
}

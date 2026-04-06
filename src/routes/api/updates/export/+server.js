import { json } from '@sveltejs/kit';
import { toCsv, toXml } from '$lib/server/service/exportService.js';
import { getAllProjectUpdates } from '$lib/server/service/projectUpdatesService.js';

const DEFAULT_PAGE_SIZE = 100;
const MAX_PAGE_SIZE = 1000;

function getExportHeaders(format) {
  const filename = `pipeline-updates-export-${new Date().toISOString().split('T')[0]}.${format}`;
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

function sanitizeUpdate(update) {
  const { user_id, email, ...safe } = update;
  return safe;
}

export async function GET({ url, locals }) {
  const format = (url.searchParams.get('format') || 'json').toLowerCase();
  const page = Math.max(1, parseInt(url.searchParams.get('page')) || 1);
  const limit = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, parseInt(url.searchParams.get('limit')) || DEFAULT_PAGE_SIZE),
  );
  const projectId = url.searchParams.get('project_id');

  if (format !== 'json' && format !== 'csv' && format !== 'xml') {
    return json({ error: "Invalid format. Use 'json', 'csv', or 'xml'" }, { status: 400 });
  }

  const supabase = locals?.supabase;

  try {
    let updates = await getAllProjectUpdates(supabase);

    if (projectId) {
      updates = updates.filter((u) => u.project_id === projectId);
    }

    updates = updates.map(sanitizeUpdate);

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedUpdates = updates.slice(start, end);

    const total = updates.length;
    const hasMore = end < total;

    const payload = {
      exported_at: new Date().toISOString(),
      pagination: {
        page,
        limit,
        total,
        has_more: hasMore,
      },
      updates: paginatedUpdates,
    };

    const headers = getExportHeaders(format);

    if (format === 'csv') {
      const csv = toCsv(paginatedUpdates);
      return new Response(csv, {
        status: 200,
        headers: {
          ...headers,
          'X-Pagination-Page': String(page),
          'X-Pagination-Limit': String(limit),
          'X-Pagination-Total': String(total),
          'X-Pagination-Has-More': String(hasMore),
        },
      });
    }

    if (format === 'xml') {
      const xmlPayload = {
        root_name: 'updates',
        items_name: 'update',
        ...payload,
      };
      const xml = toXml(xmlPayload);
      return new Response(xml, {
        status: 200,
        headers: {
          ...headers,
          'X-Pagination-Page': String(page),
          'X-Pagination-Limit': String(limit),
          'X-Pagination-Total': String(total),
          'X-Pagination-Has-More': String(hasMore),
        },
      });
    }

    return new Response(JSON.stringify(payload, null, 2), {
      status: 200,
      headers: {
        ...headers,
        'X-Pagination-Page': String(page),
        'X-Pagination-Limit': String(limit),
        'X-Pagination-Total': String(total),
        'X-Pagination-Has-More': String(hasMore),
      },
    });
  } catch (error) {
    console.error('Public updates export failed', { error, page, limit });
    return json({ error: error.message || 'Failed to export updates' }, { status: 500 });
  }
}

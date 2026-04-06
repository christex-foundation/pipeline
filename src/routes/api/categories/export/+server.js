import { json } from '@sveltejs/kit';
import { allCategories } from '$lib/server/service/categoryService.js';
import { toCsv, toXml } from '$lib/server/service/exportService.js';

const DEFAULT_PAGE_SIZE = 100;
const MAX_PAGE_SIZE = 1000;

function getExportHeaders(format) {
  const filename = `pipeline-categories-export-${new Date().toISOString().split('T')[0]}.${format}`;
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
  const page = Math.max(1, parseInt(url.searchParams.get('page')) || 1);
  const limit = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, parseInt(url.searchParams.get('limit')) || DEFAULT_PAGE_SIZE),
  );

  if (format !== 'json' && format !== 'csv' && format !== 'xml') {
    return json({ error: "Invalid format. Use 'json', 'csv', or 'xml'" }, { status: 400 });
  }

  const supabase = locals?.supabase;

  try {
    const allCats = await allCategories(supabase);

    const start = (page - 1) * limit;
    const end = start + limit;
    const categories = allCats.slice(start, end);

    const total = allCats.length;
    const hasMore = end < total;

    const payload = {
      exported_at: new Date().toISOString(),
      pagination: {
        page,
        limit,
        total,
        has_more: hasMore,
      },
      categories,
    };

    const headers = getExportHeaders(format);

    if (format === 'csv') {
      const csv = toCsv(categories);
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
        root_name: 'categories',
        items_name: 'category',
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
    console.error('Public categories export failed', { error, page, limit });
    return json({ error: error.message || 'Failed to export categories' }, { status: 500 });
  }
}

import { json } from '@sveltejs/kit';
import { toCsv, toXml } from '$lib/server/service/exportService.js';

const DEFAULT_PAGE_SIZE = 100;
const MAX_PAGE_SIZE = 1000;

function getExportHeaders(format) {
  const filename = `pipeline-contributions-export-${new Date().toISOString().split('T')[0]}.${format}`;
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

function sanitizeContribution(contribution) {
  const { user_id, email, ...safe } = contribution;
  return safe;
}

async function getAllContributions(supabase) {
  const { data, error } = await supabase
    .from('project_resource')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function GET({ url, locals }) {
  const format = (url.searchParams.get('format') || 'json').toLowerCase();
  const page = Math.max(1, parseInt(url.searchParams.get('page')) || 1);
  const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, parseInt(url.searchParams.get('limit')) || DEFAULT_PAGE_SIZE));
  const projectId = url.searchParams.get('project_id');

  if (format !== 'json' && format !== 'csv' && format !== 'xml') {
    return json({ error: "Invalid format. Use 'json', 'csv', or 'xml'" }, { status: 400 });
  }

  const supabase = locals?.supabase;

  try {
    let contributions = await getAllContributions(supabase);
    
    if (projectId) {
      contributions = contributions.filter(c => c.project_id === projectId);
    }
    
    contributions = contributions.map(sanitizeContribution);
    
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedContributions = contributions.slice(start, end);
    
    const total = contributions.length;
    const hasMore = end < total;

    const payload = {
      exported_at: new Date().toISOString(),
      pagination: {
        page,
        limit,
        total,
        has_more: hasMore,
      },
      contributions: paginatedContributions,
    };

    const headers = getExportHeaders(format);

    if (format === 'csv') {
      const csv = toCsv(paginatedContributions);
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
        root_name: 'contributions',
        items_name: 'contribution',
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
    console.error('Public contributions export failed', { error, page, limit });
    return json({ error: error.message || 'Failed to export contributions' }, { status: 500 });
  }
}

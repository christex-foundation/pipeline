import { json } from '@sveltejs/kit';
import { getProjects } from '$lib/server/repo/projectRepo.js';
import { toCsv, toXml } from '$lib/server/service/exportService.js';

const DEFAULT_PAGE_SIZE = 100;
const MAX_PAGE_SIZE = 1000;

function getExportHeaders(format) {
  const filename = `pipeline-projects-export-${new Date().toISOString().split('T')[0]}.${format}`;
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

function sanitizeProject(project) {
  const { bank_acct, wallet_address, email, ...safe } = project;
  return safe;
}

export async function GET({ url, locals }) {
  const format = (url.searchParams.get('format') || 'json').toLowerCase();
  const page = Math.max(1, parseInt(url.searchParams.get('page')) || 1);
  const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, parseInt(url.searchParams.get('limit')) || DEFAULT_PAGE_SIZE));
  const search = url.searchParams.get('search') || '';

  if (format !== 'json' && format !== 'csv' && format !== 'xml') {
    return json({ error: "Invalid format. Use 'json', 'csv', or 'xml'" }, { status: 400 });
  }

  const supabase = locals?.supabase;
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  try {
    let projects = await getProjects(search, start, end, supabase);
    projects = projects.map(sanitizeProject);

    const total = projects.length;
    const hasMore = total === limit;

    const payload = {
      exported_at: new Date().toISOString(),
      pagination: {
        page,
        limit,
        has_more: hasMore,
      },
      projects,
    };

    const headers = getExportHeaders(format);

    if (format === 'csv') {
      const csv = toCsv(projects);
      return new Response(csv, {
        status: 200,
        headers: {
          ...headers,
          'X-Pagination-Page': String(page),
          'X-Pagination-Limit': String(limit),
          'X-Pagination-Has-More': String(hasMore),
        },
      });
    }

    if (format === 'xml') {
      const xmlPayload = {
        root_name: 'projects',
        items_name: 'project',
        ...payload,
      };
      const xml = toXml(xmlPayload);
      return new Response(xml, {
        status: 200,
        headers: {
          ...headers,
          'X-Pagination-Page': String(page),
          'X-Pagination-Limit': String(limit),
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
        'X-Pagination-Has-More': String(hasMore),
      },
    });
  } catch (error) {
    console.error('Public projects export failed', { error, page, limit });
    return json({ error: error.message || 'Failed to export projects' }, { status: 500 });
  }
}

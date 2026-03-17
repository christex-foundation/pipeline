//@ts-check

import { getProfile } from '$lib/server/repo/userProfileRepo.js';

export const EXPORT_MAX_RECORDS = 10000;
export const EXPORT_RATE_LIMIT_MAX = 10;
export const EXPORT_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

/** @type {Map<string, number[]>} */
const exportRequestLog = new Map();

/**
 * @param {string} userId
 * @param {number} now
 * @returns {number[]}
 */
function getWindowedRequests(userId, now) {
  const windowStart = now - EXPORT_RATE_LIMIT_WINDOW_MS;
  const existing = exportRequestLog.get(userId) || [];
  const windowed = existing.filter((timestamp) => timestamp > windowStart);
  exportRequestLog.set(userId, windowed);
  return windowed;
}

/**
 * @param {string} userId
 * @returns {{allowed: boolean, remaining: number, retryAfterSeconds: number}}
 */
export function consumeExportRateLimit(userId) {
  const now = Date.now();
  const windowed = getWindowedRequests(userId, now);

  if (windowed.length >= EXPORT_RATE_LIMIT_MAX) {
    const oldest = windowed[0];
    const retryAfterMs = Math.max(0, oldest + EXPORT_RATE_LIMIT_WINDOW_MS - now);

    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil(retryAfterMs / 1000),
    };
  }

  windowed.push(now);
  exportRequestLog.set(userId, windowed);

  return {
    allowed: true,
    remaining: Math.max(0, EXPORT_RATE_LIMIT_MAX - windowed.length),
    retryAfterSeconds: 0,
  };
}

/**
 * @param {string} label
 * @param {Array<unknown>} records
 */
function assertWithinRecordCap(label, records) {
  if (records.length > EXPORT_MAX_RECORDS) {
    throw new Error(
      `Export exceeds maximum record cap for ${label}. Please narrow your request or split the export.`,
    );
  }
}

/**
 * @param {Record<string, unknown>} payload
 * @returns {number}
 */
export function getExportRowCount(payload) {
  return toReadableRows(payload).length;
}

/**
 * @param {unknown} value
 * @returns {string}
 */
function stringifyCell(value) {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
}

/**
 * @param {string} key
 * @returns {string}
 */
function humanizeKey(key) {
  const normalized = key.replace(/[_-]+/g, ' ').trim();
  if (!normalized) return key;

  return normalized
    .split(' ')
    .map((word) => {
      const lower = word.toLowerCase();
      if (lower === 'id') return 'ID';
      if (lower === 'url') return 'URL';
      if (lower === 'api') return 'API';
      return `${lower.charAt(0).toUpperCase()}${lower.slice(1)}`;
    })
    .join(' ');
}

/**
 * @param {string} value
 * @returns {string}
 */
function escapeXml(value) {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * @param {string} key
 * @returns {string}
 */
function toXmlElementName(key) {
  return key.replace(/[^A-Za-z0-9_-]/g, '_').replace(/^[0-9-]/, '_$');
}

/**
 * Converts a value to XML representation
 * @param {unknown} value
 * @param {string} key
 * @returns {string}
 */
function valueToXml(value, key) {
  const elementName = toXmlElementName(key);
  
  if (value === null || value === undefined) {
    return `<${elementName}/>`;
  }
  
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return `<${elementName}></${elementName}>`;
    }
    return value.map((item) => valueToXml(item, 'item')).join('');
  }
  
  if (typeof value === 'object') {
    const children = Object.entries(value)
      .map(([k, v]) => valueToXml(v, k))
      .join('');
    return `<${elementName}>${children}</${elementName}>`;
  }
  
  return `<${elementName}>${escapeXml(String(value))}</${elementName}>`;
}

/**
 * @param {Record<string, unknown>} payload
 * @returns {string}
 */
export function toXml(payload) {
  const rootName = payload.root_name || 'export';
  const itemsName = payload.items_name || 'data';
  
  const data = { ...payload };
  delete data.exported_at;
  delete data.access_role;
  delete data.root_name;
  delete data.items_name;
  
  let content = '';
  if (data && typeof data === 'object') {
    content = Object.entries(data)
      .map(([key, value]) => {
        const elementName = toXmlElementName(key);
        
        if (Array.isArray(value)) {
          if (value.length === 0) {
            return `<${elementName}></${elementName}>`;
          }
          const items = value.map((item) => {
            if (item !== null && typeof item === 'object' && !Array.isArray(item)) {
              const children = Object.entries(item)
                .map(([k, v]) => valueToXml(v, k))
                .join('');
              return `<item>${children}</item>`;
            }
            return `<item>${escapeXml(String(item))}</item>`;
          }).join('');
          return `<${elementName}>${items}</${elementName}>`;
        }
        
        if (value !== null && typeof value === 'object') {
          const children = Object.entries(value)
            .map(([k, v]) => valueToXml(v, k))
            .join('');
          return `<${elementName}>${children}</${elementName}>`;
        }
        
        return valueToXml(value, key);
      })
      .join('');
  }
  
  const metadata = payload.exported_at 
    ? `<exported_at>${escapeXml(String(payload.exported_at))}</exported_at>`
    : '';
  
  return `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>${metadata}${content}</${rootName}>`;
}

/**
 * @param {string} value
 * @returns {string}
 */
function escapeCsv(value) {
  if (value.includes('"') || value.includes(',') || /[\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
}

/**
 * @param {Array<Record<string, unknown>>} rows
 * @returns {string}
 */
export function toCsv(rows) {
  if (!rows.length) {
    return 'section,path,value\n';
  }

  const headers = [...new Set(rows.flatMap((row) => Object.keys(row)))];
  const headerRow = headers.map((header) => escapeCsv(header)).join(',');
  const body = rows
    .map((row) =>
      headers.map((header) => escapeCsv(stringifyCell(row[header] ?? ''))).join(','),
    )
    .join('\n');

  return `${headerRow}\n${body}\n`;
}

/**
 * @param {unknown} value
 * @param {string} path
 * @param {Array<{path: string, value: string}>} acc
 */
function flattenToPathRows(value, path, acc) {
  if (Array.isArray(value)) {
    if (!value.length) {
      acc.push({ path, value: '[]' });
      return;
    }

    value.forEach((item, index) => flattenToPathRows(item, `${path}[${index}]`, acc));
    return;
  }

  if (value !== null && typeof value === 'object') {
    const entries = Object.entries(value);

    if (!entries.length) {
      acc.push({ path, value: '{}' });
      return;
    }

    entries.forEach(([key, item]) => {
      const nextPath = path ? `${path}.${key}` : key;
      flattenToPathRows(item, nextPath, acc);
    });
    return;
  }

  acc.push({ path, value: stringifyCell(value) });
}

/**
 * @param {Record<string, unknown>} payload
 * @returns {Array<{section: string, path: string, value: string}>}
 */
export function toPathRows(payload) {
  /** @type {Array<{section: string, path: string, value: string}>} */
  const rows = [];

  Object.entries(payload).forEach(([section, sectionValue]) => {
    /** @type {Array<{path: string, value: string}>} */
    const flatRows = [];
    flattenToPathRows(sectionValue, '', flatRows);

    flatRows.forEach((flatRow) => {
      rows.push({
        section,
        path: flatRow.path || section,
        value: flatRow.value,
      });
    });
  });

  return rows;
}

/**
 * @param {unknown} value
 * @returns {unknown}
 */
function toReadableCellValue(value) {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return value;
}

/**
 * Produces a spreadsheet-friendly CSV row model:
 * one row per logical record, with section and record index columns.
 * @param {Record<string, unknown>} payload
 * @returns {Array<Record<string, unknown>>}
 */
export function toReadableRows(payload) {
  /** @type {Array<Record<string, unknown>>} */
  const rows = [];
  const exportedAt = payload.exported_at || '';
  const accessRole = payload.access_role || '';
  const metadataColumns = {
    section: 'Section',
    recordIndex: 'Record Number',
    exportedAt: 'Export Date',
    accessRole: 'Access Role',
    note: 'Note',
    value: 'Value',
  };

  Object.entries(payload).forEach(([section, sectionValue]) => {
    if (section === 'exported_at' || section === 'access_role') {
      return;
    }

    if (Array.isArray(sectionValue)) {
      if (!sectionValue.length) {
        rows.push({
          [metadataColumns.section]: humanizeKey(section),
          [metadataColumns.recordIndex]: '',
          [metadataColumns.exportedAt]: exportedAt,
          [metadataColumns.accessRole]: accessRole,
          [metadataColumns.note]: 'No records',
        });
        return;
      }

      sectionValue.forEach((record, index) => {
        /** @type {Record<string, unknown>} */
        const row = {
          [metadataColumns.section]: humanizeKey(section),
          [metadataColumns.recordIndex]: index + 1,
          [metadataColumns.exportedAt]: exportedAt,
          [metadataColumns.accessRole]: accessRole,
        };

        if (record !== null && typeof record === 'object' && !Array.isArray(record)) {
          Object.entries(record).forEach(([key, value]) => {
            row[humanizeKey(key)] = toReadableCellValue(value);
          });
        } else {
          row[metadataColumns.value] = toReadableCellValue(record);
        }

        rows.push(row);
      });

      return;
    }

    /** @type {Record<string, unknown>} */
    const row = {
      [metadataColumns.section]: humanizeKey(section),
      [metadataColumns.recordIndex]: 1,
      [metadataColumns.exportedAt]: exportedAt,
      [metadataColumns.accessRole]: accessRole,
    };

    if (sectionValue !== null && typeof sectionValue === 'object') {
      Object.entries(sectionValue).forEach(([key, value]) => {
        row[humanizeKey(key)] = toReadableCellValue(value);
      });
    } else {
      row[metadataColumns.value] = toReadableCellValue(sectionValue);
    }

    rows.push(row);
  });

  return rows;
}

/**
 * @param {Record<string, unknown>} project
 * @returns {Record<string, unknown>}
 */
function sanitizeProjectForTeamExport(project) {
  const { bank_acct, wallet_address, email, ...safeProject } = project;
  return safeProject;
}

/**
 * @param {string} userId
 * @param {any} supabase
 * @returns {Promise<Record<string, unknown>>}
 */
export async function getUserExportData(userId, supabase) {
  const profile = await getProfile(userId, supabase);

  const [
    { data: projects, error: projectError },
    { data: resources, error: resourceError },
    { data: bookmarks, error: bookmarkError },
    { data: updates, error: updatesError },
    { data: comments, error: commentsError },
  ] = await Promise.all([
    supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(EXPORT_MAX_RECORDS + 1),
    supabase
      .from('project_resource')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(EXPORT_MAX_RECORDS + 1),
    supabase
      .from('bookmark_project')
      .select('project_id, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(EXPORT_MAX_RECORDS + 1),
    supabase
      .from('project_updates')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(EXPORT_MAX_RECORDS + 1),
    supabase
      .from('project_update_comment')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(EXPORT_MAX_RECORDS + 1),
  ]);

  if (projectError || resourceError || bookmarkError || updatesError || commentsError) {
    throw new Error('Failed to collect user export data');
  }

  assertWithinRecordCap('projects', projects || []);
  assertWithinRecordCap('contributions', resources || []);
  assertWithinRecordCap('bookmarks', bookmarks || []);
  assertWithinRecordCap('updates', updates || []);
  assertWithinRecordCap('comments', comments || []);

  return {
    exported_at: new Date().toISOString(),
    user: {
      user_id: userId,
      profile,
    },
    projects: projects || [],
    contributions: resources || [],
    bookmarks: bookmarks || [],
    updates: updates || [],
    comments: comments || [],
  };
}

/**
 * @param {string} projectId
 * @param {string} requesterId
 * @param {any} supabase
 * @returns {Promise<{data: Record<string, unknown>, role: 'owner' | 'team_member'}>}
 */
export async function getProjectExportData(projectId, requesterId, supabase) {
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single();

  if (projectError || !project) {
    throw new Error('Project not found');
  }

  const { data: membership, error: memberError } = await supabase
    .from('project_members')
    .select('user_id, creator_id')
    .eq('project_id', projectId)
    .eq('user_id', requesterId)
    .maybeSingle();

  if (memberError) {
    throw new Error('Failed to validate project membership');
  }

  const isOwner = project.user_id === requesterId;
  const isTeamMember = !!membership;

  if (!isOwner && !isTeamMember) {
    throw new Error('Unauthorized');
  }

  const [
    { data: categories, error: categoryError },
    { data: resources, error: resourcesError },
    { data: updates, error: updatesError },
    { data: comments, error: commentsError },
    { data: members, error: membersError },
  ] = await Promise.all([
    supabase
      .from('category_project')
      .select('category_id, categories(title, sdg_id)')
      .eq('project_id', projectId)
      .limit(EXPORT_MAX_RECORDS + 1),
    supabase
      .from('project_resource')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(EXPORT_MAX_RECORDS + 1),
    supabase
      .from('project_updates')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(EXPORT_MAX_RECORDS + 1),
    supabase
      .from('project_update_comment')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(EXPORT_MAX_RECORDS + 1),
    supabase
      .from('project_members')
      .select('user_id, creator_id, created_at')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(EXPORT_MAX_RECORDS + 1),
  ]);

  if (categoryError || resourcesError || updatesError || commentsError || membersError) {
    throw new Error('Failed to collect project export data');
  }

  assertWithinRecordCap('categories', categories || []);
  assertWithinRecordCap('resources', resources || []);
  assertWithinRecordCap('updates', updates || []);
  assertWithinRecordCap('comments', comments || []);
  assertWithinRecordCap('members', members || []);

  const role = isOwner ? 'owner' : 'team_member';

  return {
    role,
    data: {
      exported_at: new Date().toISOString(),
      access_role: role,
      project: isOwner ? project : sanitizeProjectForTeamExport(project),
      categories: categories || [],
      resources: resources || [],
      updates: updates || [],
      comments: comments || [],
      members: members || [],
    },
  };
}

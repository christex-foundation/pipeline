//@ts-check

import { getProfile } from '$lib/server/repo/userProfileRepo.js';

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
    supabase.from('projects').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    supabase
      .from('project_resource')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),
    supabase
      .from('bookmark_project')
      .select('project_id, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),
    supabase
      .from('project_updates')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),
    supabase
      .from('project_update_comment')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),
  ]);

  if (projectError || resourceError || bookmarkError || updatesError || commentsError) {
    throw new Error('Failed to collect user export data');
  }

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
      .eq('project_id', projectId),
    supabase
      .from('project_resource')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false }),
    supabase
      .from('project_updates')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false }),
    supabase
      .from('project_update_comment')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false }),
    supabase
      .from('project_members')
      .select('user_id, creator_id, created_at')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false }),
  ]);

  if (categoryError || resourcesError || updatesError || commentsError || membersError) {
    throw new Error('Failed to collect project export data');
  }

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

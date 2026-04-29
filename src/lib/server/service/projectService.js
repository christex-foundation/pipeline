//@ts-check
import {
  getProject,
  getProjects,
  createProject,
  updateDetails,
  updateProjectDpg,
  getProjectsByUserId,
  getProjectsByIds,
  getProjectByGithub,
  getProjectsWithCategories,
  getProjectsByUserIdWithCategories,
  getProjectsByUserIdWithContributions,
  getPublishedProjectsWithDpgStatus,
} from '$lib/server/repo/projectRepo.js';
import { createTeamMember, teamMembers } from '$lib/server/repo/memberRepo.js';
import {
  assignCategory,
  getCategories,
  getProjectCategories,
  getProjectsByCategoryId,
  addTags,
  getProjectExistingCategories,
  removeTags,
  getProjectsByCategoriesWithPagination,
} from '$lib/server/repo/categoryRepo.js';
import { getDpgStatuses } from '../repo/dpgStatusRepo.js';
import { getMultipleProfiles } from '$lib/server/repo/userProfileRepo.js';
import { getExistingBookmarksByUserId } from '$lib/server/repo/bookmarkRepo.js';
import { mapProjectsWithTagsAndStatus } from './helpers/projectHelpers.js';
import { requestEvaluation } from '$lib/server/service/evaluationQueueService.js';
import { getLastCompletedByProjectIds } from '$lib/server/repo/evaluationQueueRepo.js';
import { getRecentUpdateCountsByProjectIds } from '$lib/server/repo/projectUpdatesRepo.js';
import { getRecentCommentCountsByProjectIds } from '$lib/server/repo/projectUpdateCommentRepo.js';
import {
  getDpgScoreDeltasByProjectIds,
  recordDpgScore,
} from '$lib/server/repo/projectDpgHistoryRepo.js';
import { derivePills } from '$lib/server/service/pillsService.js';
import { computeHeatScore, daysSinceLastActivity } from '$lib/server/service/momentumService.js';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * Attach a `pills` field and a `heatScore` number to each project, derived
 * from four batched lookups: latest completed evaluation, recent project
 * updates, recent comments, and dpg-score deltas over the last 30 days.
 * Safe to call with an empty list.
 *
 * @template {{ id: string }} P
 * @param {P[]} projects
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @returns {Promise<(P & { pills: ReturnType<typeof derivePills>, heatScore: number })[]>}
 */
async function withPills(projects, supabase) {
  if (!Array.isArray(projects) || projects.length === 0) return projects;
  const ids = projects.map((p) => p.id).filter(Boolean);
  if (ids.length === 0) return projects;

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - SEVEN_DAYS_MS);
  const thirtyDaysAgo = new Date(now.getTime() - THIRTY_DAYS_MS);

  const [evalMap, updateMap, commentMap, deltaMap] = await Promise.all([
    getLastCompletedByProjectIds(ids, supabase),
    getRecentUpdateCountsByProjectIds(ids, sevenDaysAgo, supabase),
    getRecentCommentCountsByProjectIds(ids, sevenDaysAgo, supabase),
    getDpgScoreDeltasByProjectIds(ids, thirtyDaysAgo, supabase),
  ]);

  return projects.map((project) => {
    const lastEval = evalMap.get(project.id) ?? null;
    const recentUpdateCount = updateMap.get(project.id) ?? 0;
    const recentCommentCount = commentMap.get(project.id) ?? 0;
    const dpgScoreDelta30d = deltaMap.get(project.id) ?? 0;

    const heatScore = computeHeatScore({
      dpgScoreDelta30d,
      recentCommentCount,
      recentUpdateCount,
      daysSinceLastActivity: daysSinceLastActivity(project.updated_at, lastEval, now),
    });

    return {
      ...project,
      heatScore,
      pills: derivePills({
        project,
        lastEvaluationCompletedAt: lastEval,
        recentUpdateCount,
        recentCommentCount,
        heatScore,
        now,
      }),
    };
  });
}

/**
 * Update a project's `dpgStatus` jsonb AND record a snapshot to
 * `project_dpg_history` so Heat Score has data to work with. Use this from
 * the evaluator wrapper (and any other code path that mutates dpgStatus).
 * The history insert is best-effort and won't fail the update.
 *
 * @param {string} projectId
 * @param {object} dpgStatus - the full jsonb to write
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 */
export async function updateProjectDpgWithHistory(projectId, dpgStatus, supabase) {
  const updated = await updateProjectDpg(projectId, dpgStatus, supabase);
  const score = countDpgScore(dpgStatus);
  await recordDpgScore(projectId, score, supabase); // logs + swallows on failure
  return updated;
}

function countDpgScore(dpgStatus) {
  const status = dpgStatus?.status;
  if (!Array.isArray(status)) return 0;
  return status.reduce((sum, item) => sum + (Number(item?.overallScore) === 1 ? 1 : 0), 0);
}

/**
 * @param {string} term
 * @param {number} page
 * @param {number} limit
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string[]} [excludeIds]
 * @param {'created_at'|'heat'} [sort] - server-side ordering. 'created_at' (default) preserves
 *   the existing newest-first behavior; 'heat' reorders by computed Heat Score descending.
 */
export async function getProjectsWithDetails(
  term,
  page,
  limit,
  supabase,
  excludeIds = [],
  sort = 'created_at',
) {
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  const projects = await getProjectsWithCategories(term, start, end, supabase, excludeIds);
  const enriched = await withPills(mapProjectsWithDetails(projects), supabase);

  if (sort === 'heat') {
    // Stable sort: heat desc, with the original (created_at desc) order preserved on ties.
    return enriched
      .map((p, i) => ({ p, i }))
      .sort((a, b) => b.p.heatScore - a.p.heatScore || a.i - b.i)
      .map((x) => x.p);
  }
  return enriched;
}

function mapProjectsWithDetails(projects) {
  return projects.map((project) => {
    const tags = (project.category_project?.map((cp) => cp.categories).filter(Boolean) ?? []).sort(
      (a, b) => (a?.sdg_id ?? 99) - (b?.sdg_id ?? 99),
    );

    const dpgTotalScore =
      project.dpgStatus?.status?.reduce(
        (sum, status) => sum + (Number(status.overallScore) || 0),
        0,
      ) || 0;

    return {
      ...project,
      tags,
      dpgStatusCount: dpgTotalScore,
      // export with alt name dpgCount: needed for project/[id] page
      dpgCount: dpgTotalScore,
    };
  });
}

export async function getTopProjectsByReadiness(limit, supabase) {
  const projects = await getPublishedProjectsWithDpgStatus(supabase);
  const withDetails = mapProjectsWithDetails(projects);

  // Exclude fully-ready projects — Top Projects is a "closest-to-ready" spotlight.
  const notYetReady = withDetails.filter((p) => p.dpgCount < 9);

  // Stable sort by dpgCount DESC; ties preserve repo ordering (created_at DESC).
  notYetReady.sort((a, b) => b.dpgCount - a.dpgCount);

  return withPills(notYetReady.slice(0, limit), supabase);
}

export async function getUserProjects(userId, page, limit, supabase) {
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  const projects = await getProjectsByUserIdWithCategories(userId, start, end, supabase);
  return withPills(mapProjectsWithDetails(projects), supabase);
}

export async function getProjectsByCategory(categoryIds, page, limit, supabase) {
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  const categoryProjects = await getProjectsByCategoriesWithPagination(
    categoryIds,
    start,
    end,
    supabase,
  );

  return withPills(mapProjectsWithDetails(categoryProjects), supabase);
}

export async function getProjectById(id, supabase) {
  const project = await getProject(id, supabase);

  if (!project) {
    return null;
  }

  const [withPillsAttached] = await withPills(mapProjectsWithDetails([project]), supabase);
  return withPillsAttached;
}

export async function getProjectByGithubUrl(githubUrl, supabase) {
  const project = await getProjectByGithub(githubUrl, supabase);
  if (!project) {
    return null;
  }
  return project;
}

export async function getTeamMembers(projectId, supabase) {
  const members = await teamMembers(projectId, supabase);

  const userIds = members.map((member) => member.user_id);

  const profiles = userIds.length > 0 ? await getMultipleProfiles(userIds, supabase) : [];

  const profilesByUserId = profiles.reduce((acc, profile) => {
    acc[profile.user_id] = profile;
    return acc;
  }, {});

  // Attach the corresponding profile to each member
  const membersWithProfiles = members.map((member) => ({
    ...member,
    userProfile: profilesByUserId[member.user_id] || null,
  }));

  return membersWithProfiles;
}

export async function getUserBookmarkedProjects(userId, page, limit, supabase) {
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  let projectIds = await getExistingBookmarksByUserId(userId, start, end, supabase);

  if (projectIds.length === 0) {
    return [];
  }

  projectIds = projectIds.map((project) => project.project_id);
  const projects = await getProjectsByIds(projectIds, supabase);

  //additional data
  return withPills(mapProjectsWithDetails(projects), supabase);
}

export async function getUserContributedProjects(userId, supabase) {
  const projects = await getProjectsByUserIdWithContributions(userId, supabase);
  return withPills(mapProjectsWithDetails(projects), supabase);
}

export async function storeProject(user, projectData, supabase) {
  // `matchedDPGs` is a UI-only field from a half-built DPG-matching feature.
  // It must not reach the projects insert — the column does not exist.
  let { tags, matchedDPGs: _matchedDPGs, ...projectFields } = projectData.data;

  const normalizedGithubUrl = projectFields.github?.trim();

  if (normalizedGithubUrl) {
    const existingProject = await getProjectByGithub(normalizedGithubUrl, supabase);

    if (existingProject?.id) {
      return { success: true, projectId: existingProject.id };
    }
  }

  if (typeof tags === 'string') {
    try {
      tags = JSON.parse(tags);
    } catch (error) {
      console.error('Failed to parse tags string:', error);
      tags = [];
    }
  } else if (!Array.isArray(tags)) {
    tags = tags ? [tags] : [];
  }

  const project = await createProject(
    { ...projectFields, github: normalizedGithubUrl, user_id: user.id },
    supabase,
  );

  await createTeamMember(user.id, project.id, supabase);

  await Promise.all(
    tags.map((tag) => assignCategory({ project_id: project.id, category_id: tag.id }, supabase)),
  );

  if (project.github) {
    await requestEvaluation(project.id, project.github, 'auto', user.id, supabase);
  }

  return { success: true, projectId: project.id };
}

export async function updateProject(userId, projectId, projectData, supabase) {
  let { tags, ...projectFields } = projectData.data;
  let updatedTimestamp = new Date().toISOString();

  if (typeof tags === 'string') {
    try {
      tags = JSON.parse(tags);
    } catch (error) {
      console.error('Failed to parse tags string:', error);
      tags = [];
    }
  } else if (!Array.isArray(tags)) {
    tags = tags ? [tags] : [];
  }

  await updateDetails(
    projectId,
    { ...projectFields, user_id: userId, updated_at: updatedTimestamp },
    supabase,
  );

  const existingTags = await getProjectExistingCategories(projectId, supabase);
  const existingTagIds = existingTags.map((tag) => tag.category_id);
  const newTagIds = tags.map((tag) => tag.id);

  // Remove tags that are no longer in the new list
  const tagsToRemove = existingTagIds.filter((tagId) => !newTagIds.includes(tagId));
  const tagsToAdd = newTagIds.filter((tagId) => !existingTagIds.includes(tagId));

  // Remove old tagscreateDpgStatus
  if (tagsToRemove.length > 0) {
    await removeTags(projectId, tagsToRemove, supabase);
  }

  // Add new tags
  if (tagsToAdd.length > 0) {
    await addTags(projectId, tagsToAdd, supabase);
  }

  return { success: true };
}

export { getProjects };

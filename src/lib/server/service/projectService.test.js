import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$lib/server/repo/projectRepo.js', () => ({
  getProject: vi.fn(),
  getProjects: vi.fn(),
  createProject: vi.fn(),
  updateDetails: vi.fn(),
  getProjectsByUserId: vi.fn(),
  getProjectsByIds: vi.fn(),
  getProjectByGithub: vi.fn(),
  getProjectsWithCategories: vi.fn(),
  getProjectsByUserIdWithCategories: vi.fn(),
  getProjectsByUserIdWithContributions: vi.fn(),
  getPublishedProjectsWithDpgStatus: vi.fn(),
}));

vi.mock('$lib/server/repo/memberRepo.js', () => ({
  createTeamMember: vi.fn(),
  teamMembers: vi.fn(),
}));

vi.mock('$lib/server/repo/categoryRepo.js', () => ({
  assignCategory: vi.fn(),
  getCategories: vi.fn(),
  getProjectCategories: vi.fn(),
  getProjectsByCategoryId: vi.fn(),
  addTags: vi.fn(),
  getProjectExistingCategories: vi.fn(),
  removeTags: vi.fn(),
  getProjectsByCategoriesWithPagination: vi.fn(),
}));

vi.mock('../repo/dpgStatusRepo.js', () => ({
  getDpgStatuses: vi.fn(),
}));

vi.mock('$lib/server/repo/userProfileRepo.js', () => ({
  getMultipleProfiles: vi.fn(),
}));

vi.mock('$lib/server/repo/bookmarkRepo.js', () => ({
  getExistingBookmarksByUserId: vi.fn(),
}));

vi.mock('$lib/server/service/evaluationQueueService.js', () => ({
  requestEvaluation: vi.fn(),
}));

vi.mock('$lib/server/repo/evaluationQueueRepo.js', () => ({
  getLastCompletedByProjectIds: vi.fn().mockResolvedValue(new Map()),
}));

vi.mock('$lib/server/repo/projectUpdatesRepo.js', () => ({
  getRecentUpdateCountsByProjectIds: vi.fn().mockResolvedValue(new Map()),
}));

vi.mock('$lib/server/repo/projectUpdateCommentRepo.js', () => ({
  getRecentCommentCountsByProjectIds: vi.fn().mockResolvedValue(new Map()),
}));

vi.mock('$lib/server/repo/projectDpgHistoryRepo.js', () => ({
  getDpgScoreDeltasByProjectIds: vi.fn().mockResolvedValue(new Map()),
  recordDpgScore: vi.fn().mockResolvedValue(undefined),
}));

import { getPublishedProjectsWithDpgStatus } from '$lib/server/repo/projectRepo.js';
import { getTopProjectsByReadiness } from './projectService.js';

/** Builds a project with the given met-criteria count (0..9). Omit `met` for unevaluated. */
function project(id, { met, title } = {}) {
  const base = {
    id,
    title: title ?? `Project ${id}`,
    banner_image: null,
    funding_goal: 0,
    current_funding: 0,
    user_id: 'u1',
    bio: '',
    published_at: '2026-01-01T00:00:00Z',
    category_project: [],
  };
  if (typeof met === 'number') {
    base.dpgStatus = {
      status: Array.from({ length: 9 }, (_, i) => ({ overallScore: i < met ? 1 : 0 })),
    };
  }
  return base;
}

describe('getTopProjectsByReadiness', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sorts by dpgCount DESC', async () => {
    getPublishedProjectsWithDpgStatus.mockResolvedValue([
      project('a', { met: 3 }),
      project('b', { met: 7 }),
      project('c', { met: 5 }),
    ]);

    const result = await getTopProjectsByReadiness(3, {});

    expect(result.map((p) => p.id)).toEqual(['b', 'c', 'a']);
    expect(result.map((p) => p.dpgCount)).toEqual([7, 5, 3]);
  });

  it('excludes fully-ready (9/9) projects', async () => {
    getPublishedProjectsWithDpgStatus.mockResolvedValue([
      project('ready', { met: 9 }),
      project('nearly', { met: 8 }),
      project('early', { met: 2 }),
    ]);

    const result = await getTopProjectsByReadiness(5, {});

    expect(result.map((p) => p.id)).toEqual(['nearly', 'early']);
    expect(result.find((p) => p.id === 'ready')).toBeUndefined();
  });

  it('includes unevaluated projects counted as 0', async () => {
    getPublishedProjectsWithDpgStatus.mockResolvedValue([
      project('unevaluated'),
      project('mid', { met: 4 }),
    ]);

    const result = await getTopProjectsByReadiness(5, {});

    expect(result.map((p) => p.id)).toEqual(['mid', 'unevaluated']);
    expect(result.find((p) => p.id === 'unevaluated').dpgCount).toBe(0);
  });

  it('respects the limit', async () => {
    getPublishedProjectsWithDpgStatus.mockResolvedValue([
      project('a', { met: 8 }),
      project('b', { met: 7 }),
      project('c', { met: 6 }),
      project('d', { met: 5 }),
    ]);

    const result = await getTopProjectsByReadiness(2, {});

    expect(result.map((p) => p.id)).toEqual(['a', 'b']);
  });

  it('preserves input order on ties (stable sort)', async () => {
    // Repo returns by created_at DESC, so "first in" = most recent.
    getPublishedProjectsWithDpgStatus.mockResolvedValue([
      project('recent-tie', { met: 6 }),
      project('older-tie', { met: 6 }),
      project('low', { met: 1 }),
    ]);

    const result = await getTopProjectsByReadiness(3, {});

    expect(result.map((p) => p.id)).toEqual(['recent-tie', 'older-tie', 'low']);
  });
});

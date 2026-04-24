//@ts-check
import {
  insertComment,
  listCommentsByProjectId,
} from '$lib/server/repo/projectCommentRepo.js';
import { getMultipleProfiles } from '$lib/server/repo/userProfileRepo.js';

export const COMMENT_RATE_LIMIT_MAX = 20;
export const COMMENT_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

/** @type {Map<string, number[]>} */
const commentRequestLog = new Map();

/**
 * Sliding-window rate limiter for comment POSTs. Mirrors the shape of
 * consumeExportRateLimit. In-memory only — resets on server restart, which
 * is acceptable for v1 abuse dampening.
 *
 * @param {string} userId
 * @returns {{allowed: boolean, remaining: number, retryAfterSeconds: number}}
 */
export function consumeCommentRateLimit(userId) {
  const now = Date.now();
  const windowStart = now - COMMENT_RATE_LIMIT_WINDOW_MS;
  const windowed = (commentRequestLog.get(userId) || []).filter((t) => t > windowStart);

  if (windowed.length >= COMMENT_RATE_LIMIT_MAX) {
    const oldest = windowed[0];
    const retryAfterMs = Math.max(0, oldest + COMMENT_RATE_LIMIT_WINDOW_MS - now);
    commentRequestLog.set(userId, windowed);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil(retryAfterMs / 1000),
    };
  }

  windowed.push(now);
  commentRequestLog.set(userId, windowed);
  return {
    allowed: true,
    remaining: Math.max(0, COMMENT_RATE_LIMIT_MAX - windowed.length),
    retryAfterSeconds: 0,
  };
}

export async function getProjectComments(projectId, supabase) {
  const comments = await listCommentsByProjectId(projectId, supabase);
  if (!comments.length) return [];

  const userIds = [...new Set(comments.map((c) => c.user_id).filter(Boolean))];
  const profiles = userIds.length ? await getMultipleProfiles(userIds, supabase) : [];

  // Only expose the fields needed to render an author chip. Never leak email
  // or other auth.users fields to the client.
  const profilesByUserId = profiles.reduce((acc, p) => {
    acc[p.user_id] = { name: p.name, image: p.image };
    return acc;
  }, {});

  return comments.map((c) => ({
    ...c,
    author: profilesByUserId[c.user_id] || null,
  }));
}

export async function createProjectComment({ projectId, userId, body }, supabase) {
  return insertComment(
    { project_id: projectId, user_id: userId, body },
    supabase,
  );
}

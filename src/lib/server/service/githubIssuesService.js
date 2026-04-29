//@ts-check

const TTL_MS = 30 * 60 * 1000;
const PER_PAGE = 30;
const USER_AGENT = 'dpg-pipeline';

/** @type {Map<string, { data: { issues: any[], count: number }, expiresAt: number, fetchedAt: number }>} */
const cache = new Map();

/**
 * Fetch open issues labeled `good-first-issue` for a GitHub repo, with a
 * 30-minute in-process cache. Never throws — degrades to an empty list (or to
 * the last successful response) on errors so UI pills don't break pages.
 *
 * @param {string} owner
 * @param {string} repo
 * @returns {Promise<{ issues: any[], count: number, fromCache: boolean, fetchedAt: number, error?: string }>}
 */
export async function getGoodFirstIssues(owner, repo) {
  const key = `${owner}/${repo}`;
  const now = Date.now();
  const cached = cache.get(key);

  if (cached && cached.expiresAt > now) {
    return { ...cached.data, fromCache: true, fetchedAt: cached.fetchedAt };
  }

  const url = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/issues?labels=good-first-issue&state=open&per_page=${PER_PAGE}`;

  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': USER_AGENT,
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const res = await fetch(url, { headers });
    if (!res.ok) {
      // Serve stale cache if we have it, else empty.
      if (cached) {
        return {
          ...cached.data,
          fromCache: true,
          fetchedAt: cached.fetchedAt,
          error: `GitHub responded ${res.status}; serving stale cache`,
        };
      }
      return {
        issues: [],
        count: 0,
        fromCache: false,
        fetchedAt: now,
        error: `GitHub responded ${res.status}`,
      };
    }
    const json = await res.json();
    // The /issues endpoint also returns PRs; filter them out.
    const issues = Array.isArray(json) ? json.filter((i) => !i.pull_request) : [];
    const data = { issues, count: issues.length };
    cache.set(key, { data, expiresAt: now + TTL_MS, fetchedAt: now });
    return { ...data, fromCache: false, fetchedAt: now };
  } catch (err) {
    if (cached) {
      return {
        ...cached.data,
        fromCache: true,
        fetchedAt: cached.fetchedAt,
        error: `Fetch failed; serving stale cache: ${err?.message ?? String(err)}`,
      };
    }
    return {
      issues: [],
      count: 0,
      fromCache: false,
      fetchedAt: now,
      error: `Fetch failed: ${err?.message ?? String(err)}`,
    };
  }
}

/**
 * Reset the cache. Intended for tests only.
 */
export function _clearCache() {
  cache.clear();
}

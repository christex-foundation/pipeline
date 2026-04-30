//@ts-check

const TTL_MS = 30 * 60 * 1000;
const PER_PAGE = 5;
const USER_AGENT = 'dpg-pipeline';

/**
 * @typedef {{
 *   sha: string,
 *   message: string,
 *   author: { login: string | null, avatar_url: string | null, name: string | null },
 *   html_url: string,
 *   committed_at: string | null,
 * }} NormalizedCommit
 *
 * @typedef {{
 *   number: number,
 *   title: string,
 *   state: 'open' | 'closed',
 *   merged_at: string | null,
 *   user: { login: string | null, avatar_url: string | null },
 *   html_url: string,
 *   updated_at: string | null,
 * }} NormalizedPR
 */

/** @type {Map<string, { data: { commits: NormalizedCommit[], pullRequests: NormalizedPR[] }, expiresAt: number, fetchedAt: number }>} */
const cache = new Map();

function buildHeaders() {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': USER_AGENT,
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

/**
 * @param {any} c raw GitHub commit
 * @returns {NormalizedCommit}
 */
function normalizeCommit(c) {
  return {
    sha: c?.sha ?? '',
    message: typeof c?.commit?.message === 'string' ? c.commit.message : '',
    author: {
      login: c?.author?.login ?? null,
      avatar_url: c?.author?.avatar_url ?? null,
      name: c?.commit?.author?.name ?? null,
    },
    html_url: c?.html_url ?? '',
    committed_at: c?.commit?.author?.date ?? null,
  };
}

/**
 * @param {any} p raw GitHub pull request
 * @returns {NormalizedPR}
 */
function normalizePR(p) {
  return {
    number: typeof p?.number === 'number' ? p.number : 0,
    title: typeof p?.title === 'string' ? p.title : '',
    state: p?.state === 'closed' ? 'closed' : 'open',
    merged_at: p?.merged_at ?? null,
    user: {
      login: p?.user?.login ?? null,
      avatar_url: p?.user?.avatar_url ?? null,
    },
    html_url: p?.html_url ?? '',
    updated_at: p?.updated_at ?? null,
  };
}

/**
 * Fetch the most recent commits and pull requests for a GitHub repo, with a
 * 30-minute in-process cache. Both lists are fetched in parallel; if one
 * upstream call fails the other still ships, with an `error` string so the
 * UI can degrade per-list rather than blanking the whole tab. Never throws.
 *
 * @param {string} owner
 * @param {string} repo
 * @returns {Promise<{
 *   commits: NormalizedCommit[],
 *   pullRequests: NormalizedPR[],
 *   fromCache: boolean,
 *   fetchedAt: number,
 *   error?: string,
 * }>}
 */
export async function getRecentActivity(owner, repo) {
  const key = `${owner}/${repo}`;
  const now = Date.now();
  const cached = cache.get(key);

  if (cached && cached.expiresAt > now) {
    return { ...cached.data, fromCache: true, fetchedAt: cached.fetchedAt };
  }

  const commitsUrl = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits?per_page=${PER_PAGE}`;
  const pullsUrl = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/pulls?state=all&sort=updated&direction=desc&per_page=${PER_PAGE}`;
  const headers = buildHeaders();

  const fetchList = async (url, normalize, label) => {
    try {
      const res = await fetch(url, { headers });
      if (!res.ok) {
        return { items: [], error: `${label} ${res.status}` };
      }
      const json = await res.json();
      if (!Array.isArray(json)) return { items: [], error: `${label} unexpected payload` };
      return { items: json.map(normalize), error: null };
    } catch (err) {
      return { items: [], error: `${label} ${err?.message ?? String(err)}` };
    }
  };

  const [commitsResult, pullsResult] = await Promise.all([
    fetchList(commitsUrl, normalizeCommit, 'commits'),
    fetchList(pullsUrl, normalizePR, 'pullRequests'),
  ]);

  // If both calls failed, prefer stale cache over a blank response.
  if (commitsResult.error && pullsResult.error) {
    if (cached) {
      return {
        ...cached.data,
        fromCache: true,
        fetchedAt: cached.fetchedAt,
        error: `${commitsResult.error}; ${pullsResult.error}; serving stale cache`,
      };
    }
    return {
      commits: [],
      pullRequests: [],
      fromCache: false,
      fetchedAt: now,
      error: `${commitsResult.error}; ${pullsResult.error}`,
    };
  }

  const data = {
    commits: commitsResult.items,
    pullRequests: pullsResult.items,
  };
  cache.set(key, { data, expiresAt: now + TTL_MS, fetchedAt: now });

  const partialErrors = [commitsResult.error, pullsResult.error].filter(Boolean).join('; ');
  return {
    ...data,
    fromCache: false,
    fetchedAt: now,
    ...(partialErrors ? { error: partialErrors } : {}),
  };
}

/**
 * Reset the cache. Intended for tests only.
 */
export function _clearCache() {
  cache.clear();
}

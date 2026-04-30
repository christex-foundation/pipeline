//@ts-check

/**
 * Returns true when an API request is allowed without an authenticated session.
 *
 * Be conservative: anything not explicitly listed here requires a session.
 * The list is method-aware so we don't accidentally make POST/PUT/DELETE
 * variants of a public-read route world-writable.
 *
 * @param {string} pathname
 * @param {string} method
 * @returns {boolean}
 */
export function isPublicApiRoute(pathname, method) {
  // Auth flows
  if (method === 'POST' && (pathname === '/api/signIn' || pathname === '/api/signUp')) {
    return true;
  }

  // GitHub webhook — verified separately by the handler via HMAC, no session needed.
  if (method === 'POST' && pathname === '/api/github/webhook') {
    return true;
  }

  // Beyond this point: public reads only.
  if (method !== 'GET') return false;

  // Static and listing endpoints
  if (pathname === '/api/categories') return true;
  if (pathname === '/api/projects') return true;
  if (pathname === '/api/projects/top') return true;
  if (pathname === '/api/projects/projectByCategory') return true;

  // Per-project public reads under /api/projects/{id}/... — but the {id}
  // segment must not collide with reserved non-id sub-paths like `store`
  // or `export`, both of which are protected write/admin endpoints.
  const RESERVED_PROJECT_SEGMENTS = new Set([
    'store',
    'export',
    'top',
    'projectByCategory',
    'singleProject',
    'user',
  ]);
  const isProjectIdSegment = (seg) => seg && !RESERVED_PROJECT_SEGMENTS.has(seg);

  const idOnly = pathname.match(/^\/api\/projects\/([^/]+)$/);
  if (idOnly && isProjectIdSegment(idOnly[1])) return true;

  const idBadge = pathname.match(/^\/api\/projects\/([^/]+)\/badge\.svg$/);
  if (idBadge && isProjectIdSegment(idBadge[1])) return true;

  const idIssues = pathname.match(/^\/api\/projects\/([^/]+)\/github\/issues$/);
  if (idIssues && isProjectIdSegment(idIssues[1])) return true;

  const idActivity = pathname.match(/^\/api\/projects\/([^/]+)\/github\/activity$/);
  if (idActivity && isProjectIdSegment(idActivity[1])) return true;

  const idEvals = pathname.match(/^\/api\/projects\/([^/]+)\/evaluations$/);
  if (idEvals && isProjectIdSegment(idEvals[1])) return true;

  // Legacy /singleProject namespace — all reads on a single project are public.
  if (pathname.startsWith('/api/projects/singleProject/')) return true;

  return false;
}

/**
 * Routes that should skip the same-origin check entirely. The GitHub webhook
 * is signed by GitHub's servers, not browsers, so it has no Origin header
 * matching our host.
 *
 * @param {string} pathname
 * @returns {boolean}
 */
export function skipsOriginCheck(pathname) {
  return pathname === '/api/github/webhook';
}

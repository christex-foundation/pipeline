//@ts-check

const GITHUB_REPO_RE =
  /^https?:\/\/(?:www\.)?github\.com\/([\w-]+)\/([\w.-]+?)(?:\.git)?(?:\/.*)?$/;

/**
 * Parse a GitHub repository URL into its owner and repo parts.
 *
 * Accepts:
 *   - http or https
 *   - optional `www.` subdomain
 *   - optional `.git` suffix
 *   - extra path segments (e.g. `/tree/main`) which are ignored
 *
 * @param {string|null|undefined} url
 * @returns {{ owner: string, repo: string } | null}
 */
export function parseGithubRepo(url) {
  if (typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  const match = trimmed.match(GITHUB_REPO_RE);
  if (!match) return null;

  return { owner: match[1], repo: match[2] };
}

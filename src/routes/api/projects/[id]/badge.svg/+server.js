//@ts-check
import { getProjectById } from '$lib/server/service/projectService.js';
import { buildBadgeSvg } from '$lib/utils/dpgBadge.js';

const CACHE_SECONDS = 3600;

/**
 * Public, embeddable DPG-score badge for a project's README. Returns a
 * shields.io-style SVG. Designed to be safe to serve unauthenticated and
 * cheap to cache aggressively — GitHub's image proxy will reuse this
 * response for many viewers per origin fetch.
 *
 * @type {import('./$types').RequestHandler}
 */
export async function GET({ params, locals, setHeaders }) {
  let score = 0;
  try {
    const project = await getProjectById(params.id, locals.supabase);
    score = Number(project?.dpgCount) || 0;
  } catch (_) {
    // Fall through to the 0/9 badge so the README never shows a broken image.
  }

  const svg = buildBadgeSvg(score);

  setHeaders({
    'Content-Type': 'image/svg+xml; charset=utf-8',
    'Cache-Control': `public, max-age=${CACHE_SECONDS}, s-maxage=${CACHE_SECONDS}`,
  });

  return new Response(svg);
}

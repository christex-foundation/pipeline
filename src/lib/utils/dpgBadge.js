//@ts-check

/**
 * Standalone SVG badge for the project's DPG score, intended to be embedded
 * in maintainers' READMEs. Visual style mirrors shields.io's "flat" badge so
 * it sits comfortably alongside other common README badges.
 *
 * Layout is two segments — a fixed "DPG" label on the left, and "{score}/9"
 * on the right, color-coded by completeness. Both segments have fixed widths
 * because we know the exact strings (3 chars + 3 chars), so no font metrics
 * are required.
 */

const TOTAL_MAX = 9;
const LABEL_WIDTH = 40;
const VALUE_WIDTH = 36;

/**
 * Pick the right-segment color based on score (0..9).
 * Scale follows shields.io's standard color stops.
 *
 * @param {number} score
 * @returns {string} hex color
 */
export function pickColor(score) {
  if (!Number.isFinite(score) || score <= 0) return '#e05d44'; // red
  if (score >= 9) return '#4c1'; //  brightgreen
  if (score >= 7) return '#a3c51c'; // yellowgreen
  if (score >= 4) return '#dfb317'; // yellow
  return '#fe7d37'; // orange (1..3)
}

/**
 * Build the SVG string for the score badge.
 * Caps score to [0..9]; non-numeric input is treated as 0.
 *
 * @param {number|null|undefined} rawScore
 * @returns {string}
 */
export function buildBadgeSvg(rawScore) {
  const score = clampScore(rawScore);
  const value = `${score}/${TOTAL_MAX}`;
  const totalWidth = LABEL_WIDTH + VALUE_WIDTH;
  const color = pickColor(score);

  // Text x positions are in tenths-of-a-pixel because the <text> elements use
  // transform="scale(.1)". Center each label within its segment.
  const labelX = LABEL_WIDTH * 5;
  const valueX = LABEL_WIDTH * 10 + VALUE_WIDTH * 5;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20" role="img" aria-label="DPG: ${value}"><title>DPG: ${value}</title><linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><clipPath id="r"><rect width="${totalWidth}" height="20" rx="3" fill="#fff"/></clipPath><g clip-path="url(#r)"><rect width="${LABEL_WIDTH}" height="20" fill="#555"/><rect x="${LABEL_WIDTH}" width="${VALUE_WIDTH}" height="20" fill="${color}"/><rect width="${totalWidth}" height="20" fill="url(#s)"/></g><g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110"><text aria-hidden="true" x="${labelX}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)">DPG</text><text x="${labelX}" y="140" transform="scale(.1)" fill="#fff">DPG</text><text aria-hidden="true" x="${valueX}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)">${value}</text><text x="${valueX}" y="140" transform="scale(.1)" fill="#fff">${value}</text></g></svg>`;
}

function clampScore(raw) {
  const n = Number(raw);
  if (!Number.isFinite(n)) return 0;
  if (n < 0) return 0;
  if (n > TOTAL_MAX) return TOTAL_MAX;
  return Math.floor(n);
}

/**
 * Build a Markdown snippet for embedding the badge in a README.
 *
 * @param {string} origin - e.g. "https://pipeline-tau.vercel.app"
 * @param {string} projectId
 * @returns {string}
 */
export function buildBadgeMarkdown(origin, projectId) {
  const cleanOrigin = stripTrailingSlash(origin);
  return `[![DPG Score](${cleanOrigin}/api/projects/${projectId}/badge.svg)](${cleanOrigin}/project/${projectId})`;
}

/**
 * Build the equivalent HTML snippet.
 *
 * @param {string} origin
 * @param {string} projectId
 * @returns {string}
 */
export function buildBadgeHtml(origin, projectId) {
  const cleanOrigin = stripTrailingSlash(origin);
  return `<a href="${cleanOrigin}/project/${projectId}"><img src="${cleanOrigin}/api/projects/${projectId}/badge.svg" alt="DPG Score" /></a>`;
}

function stripTrailingSlash(s) {
  return typeof s === 'string' ? s.replace(/\/+$/, '') : '';
}

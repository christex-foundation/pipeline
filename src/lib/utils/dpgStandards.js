//@ts-check
import { parseGithubRepo } from '$lib/utils/github.js';

/**
 * Static metadata for the 9 DPG standards. The `name` keys must match the
 * names emitted by the evaluator (and seeded in `dpg_status` rows).
 *
 * Each entry provides:
 *   - icon: iconify name for the standard
 *   - docsUrl: where to read the official DPG Standard guidance
 *   - remediation: a function that, given the project's GitHub URL (may be
 *     null), returns either a `{label, href}` actionable CTA, or null when
 *     the standard isn't fixable from a code repo.
 */
export const STANDARD_META = {
  'Use of Approved Open Licenses': {
    icon: 'mdi:license',
    docsUrl: 'https://digitalpublicgoods.net/standard/#2',
    remediation: (githubUrl) => {
      const repo = parseGithubRepo(githubUrl);
      if (!repo) return null;
      return {
        label: 'Add a LICENSE file on GitHub',
        href: `https://github.com/${repo.owner}/${repo.repo}/community/license/new?branch=main`,
      };
    },
  },
  Documentation: {
    icon: 'mdi:file-document',
    docsUrl: 'https://digitalpublicgoods.net/standard/#5',
    remediation: (githubUrl) => {
      const repo = parseGithubRepo(githubUrl);
      if (!repo) return null;
      return {
        label: 'Improve your README on GitHub',
        href: `https://github.com/${repo.owner}/${repo.repo}#readme`,
      };
    },
  },
  'Clear Ownership': {
    icon: 'mdi:account-check',
    docsUrl: 'https://digitalpublicgoods.net/standard/#3',
    remediation: (githubUrl) => {
      const repo = parseGithubRepo(githubUrl);
      if (!repo) return null;
      return {
        label: 'Add a CODEOWNERS file',
        href: `https://github.com/${repo.owner}/${repo.repo}/new/main?filename=.github/CODEOWNERS`,
      };
    },
  },
  'Adherence to Privacy and Applicable Laws': {
    icon: 'mdi:shield-lock',
    docsUrl: 'https://digitalpublicgoods.net/standard/#7',
    remediation: (githubUrl) => {
      const repo = parseGithubRepo(githubUrl);
      if (!repo) return null;
      return {
        label: 'Add a PRIVACY.md to your repo',
        href: `https://github.com/${repo.owner}/${repo.repo}/new/main?filename=PRIVACY.md`,
      };
    },
  },
  'Mechanism for Extracting Data and Content': {
    icon: 'mdi:database-export',
    docsUrl: 'https://digitalpublicgoods.net/standard/#6',
    // Abstract — not directly fixable on GitHub. Fall back to docs link.
    remediation: () => null,
  },
  'Platform Independence': {
    icon: 'mdi:devices',
    docsUrl: 'https://digitalpublicgoods.net/standard/#4',
    remediation: () => null,
  },
  'Adherence to Standards & Best Practices': {
    icon: 'mdi:check-circle',
    docsUrl: 'https://digitalpublicgoods.net/standard/#8',
    remediation: () => null,
  },
  'Do No Harm By Design': {
    icon: 'mdi:heart-plus',
    docsUrl: 'https://digitalpublicgoods.net/standard/#9',
    remediation: () => null,
  },
  'Relevance to Sustainable Development Goals': {
    icon: 'mdi:earth',
    docsUrl: 'https://digitalpublicgoods.net/standard/#1',
    remediation: () => null,
  },
};

// Some evaluator outputs use a slightly different name for the SDG standard.
// Keep this alias map narrow — only proven name variants.
const NAME_ALIASES = {
  'Relevance to Sustainable Development Goals (SDGs)': 'Relevance to Sustainable Development Goals',
};

/**
 * Look up the meta entry for a standard, with fallback for known name variants.
 * @param {string} name
 */
export function getStandardMeta(name) {
  const canonical = NAME_ALIASES[name] ?? name;
  return STANDARD_META[canonical] ?? null;
}

/**
 * Convenience: just the icon. Used by existing call sites that only need the icon.
 * @param {string} name
 */
export function getIconForStandard(name) {
  return getStandardMeta(name)?.icon ?? 'mdi:checkbox-marked-circle';
}

/**
 * Build the remediation CTA for a failing standard.
 * Returns null when the standard has no code-level fix or when no GitHub URL is set.
 *
 * @param {string} name
 * @param {string|null|undefined} githubUrl
 * @returns {{ label: string, href: string } | null}
 */
export function getRemediation(name, githubUrl) {
  const meta = getStandardMeta(name);
  if (!meta || typeof meta.remediation !== 'function') return null;
  return meta.remediation(githubUrl);
}

/**
 * The official DPG docs URL for a standard, or the index page as fallback.
 * @param {string} name
 */
export function getDocsUrl(name) {
  return getStandardMeta(name)?.docsUrl ?? 'https://digitalpublicgoods.net/standard/';
}

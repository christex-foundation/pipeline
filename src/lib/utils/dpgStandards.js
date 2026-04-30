//@ts-check
import { parseGithubRepo } from '$lib/utils/github.js';

/**
 * Static metadata for the 9 DPG standards. The `name` keys must match the
 * names emitted by the evaluator (and seeded in `dpg_status` rows).
 *
 * Each entry provides:
 *   - icon: iconify name for the standard
 *   - docsUrl: where to read the official DPG Standard guidance
 *   - description: plain-English explanation of what the standard asks for,
 *     used as the "What is this?" copy inside the standard's popover.
 *   - remediation: a function that, given the project's GitHub URL (may be
 *     null), returns either a `{label, href}` actionable CTA, or null when
 *     the standard isn't fixable from a code repo.
 */
export const STANDARD_META = {
  'Use of Approved Open Licenses': {
    icon: 'mdi:license',
    docsUrl: 'https://digitalpublicgoods.net/standard/#2',
    description:
      "The project's source code, content, and data must be released under an approved open licence (OSI-approved for software, Creative Commons for content) so that anyone can freely use, study, modify, and share it.",
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
    description:
      'The project must publish enough documentation for someone unfamiliar with it to understand what it does, install or deploy it, and use it. A clear README is usually the minimum bar.',
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
    description:
      'The project must publicly identify the people or organisation who own and maintain it, so users and contributors know who is responsible for the code, the content, and any data it collects.',
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
    description:
      'The project must address privacy and data protection by design — covering how it collects, stores, and shares personally identifiable information, and how it complies with the laws that apply where it operates.',
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
    description:
      'If the project collects non-personal data or content, users must be able to export it in a non-proprietary, machine-readable format. This prevents lock-in and keeps the data portable.',
    // Abstract — not directly fixable on GitHub. Fall back to docs link.
    remediation: () => null,
  },
  'Platform Independence': {
    icon: 'mdi:devices',
    docsUrl: 'https://digitalpublicgoods.net/standard/#4',
    description:
      'The project must not be locked into a proprietary platform, runtime, or piece of hardware. Any mandatory dependencies should themselves be open source, or have a viable open-source alternative.',
    remediation: () => null,
  },
  'Adherence to Standards & Best Practices': {
    icon: 'mdi:check-circle',
    docsUrl: 'https://digitalpublicgoods.net/standard/#8',
    description:
      'The project should follow the widely-accepted technical and operational standards that apply to its field — for example, interoperability standards, accessibility, and recognised industry best practices.',
    remediation: () => null,
  },
  'Do No Harm By Design': {
    icon: 'mdi:heart-plus',
    docsUrl: 'https://digitalpublicgoods.net/standard/#9',
    description:
      'The project must anticipate and mitigate the harm it could cause — to user privacy, to vulnerable groups including children, to the environment, and through misuse — and document the safeguards it has put in place.',
    remediation: () => null,
  },
  'Relevance to Sustainable Development Goals': {
    icon: 'mdi:earth',
    docsUrl: 'https://digitalpublicgoods.net/standard/#1',
    description:
      'The project must show clear, demonstrable relevance to advancing one or more of the UN Sustainable Development Goals (SDGs).',
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

/**
 * Plain-English description of what the standard asks for.
 * Returns null when the standard isn't recognised, so callers can hide
 * the "About this standard" section instead of rendering empty copy.
 * @param {string} name
 * @returns {string | null}
 */
export function getStandardDescription(name) {
  return getStandardMeta(name)?.description ?? null;
}

import { describe, expect, it } from 'vitest';
import {
  getDocsUrl,
  getIconForStandard,
  getRemediation,
  getStandardDescription,
  getStandardMeta,
  STANDARD_META,
} from './dpgStandards.js';

const REPO = 'https://github.com/owner/repo';

describe('STANDARD_META', () => {
  it('covers all 9 DPG standards', () => {
    expect(Object.keys(STANDARD_META)).toHaveLength(9);
  });

  it('has a non-empty description for every standard', () => {
    for (const [name, meta] of Object.entries(STANDARD_META)) {
      expect(meta.description, `${name} should have a description`).toBeTruthy();
      expect(typeof meta.description).toBe('string');
      expect(meta.description.length).toBeGreaterThan(20);
    }
  });
});

describe('getStandardMeta', () => {
  it('returns the entry for a known standard', () => {
    expect(getStandardMeta('Documentation')).toMatchObject({
      icon: 'mdi:file-document',
      docsUrl: expect.stringContaining('digitalpublicgoods.net'),
    });
  });

  it('resolves the SDGs alias', () => {
    expect(getStandardMeta('Relevance to Sustainable Development Goals (SDGs)')).toBe(
      getStandardMeta('Relevance to Sustainable Development Goals'),
    );
  });

  it('returns null for an unknown standard', () => {
    expect(getStandardMeta('Made-up Standard')).toBeNull();
  });
});

describe('getIconForStandard', () => {
  it('returns the standard-specific icon', () => {
    expect(getIconForStandard('Use of Approved Open Licenses')).toBe('mdi:license');
  });

  it('falls back to a generic icon for unknown names', () => {
    expect(getIconForStandard('Bogus')).toBe('mdi:checkbox-marked-circle');
  });
});

describe('getRemediation', () => {
  it('builds a license CTA pointing at GitHub', () => {
    const r = getRemediation('Use of Approved Open Licenses', REPO);
    expect(r?.label).toMatch(/LICENSE/);
    expect(r?.href).toBe('https://github.com/owner/repo/community/license/new?branch=main');
  });

  it('builds a README CTA', () => {
    const r = getRemediation('Documentation', REPO);
    expect(r?.href).toBe('https://github.com/owner/repo#readme');
  });

  it('builds a CODEOWNERS CTA', () => {
    const r = getRemediation('Clear Ownership', REPO);
    expect(r?.href).toContain('filename=.github/CODEOWNERS');
  });

  it('returns null for abstract standards (no code-level fix)', () => {
    expect(getRemediation('Platform Independence', REPO)).toBeNull();
    expect(getRemediation('Do No Harm By Design', REPO)).toBeNull();
  });

  it('returns null when no GitHub URL is provided', () => {
    expect(getRemediation('Use of Approved Open Licenses', null)).toBeNull();
    expect(getRemediation('Documentation', '')).toBeNull();
  });

  it('returns null for an unknown standard', () => {
    expect(getRemediation('Bogus', REPO)).toBeNull();
  });
});

describe('getDocsUrl', () => {
  it('returns the standard-specific docs URL', () => {
    expect(getDocsUrl('Documentation')).toBe('https://digitalpublicgoods.net/standard/#5');
  });

  it('falls back to the standard index for unknown names', () => {
    expect(getDocsUrl('Bogus')).toBe('https://digitalpublicgoods.net/standard/');
  });
});

describe('getStandardDescription', () => {
  it('returns the plain-English description for a known standard', () => {
    const desc = getStandardDescription('Documentation');
    expect(desc).toBeTruthy();
    expect(desc).toMatch(/document/i);
  });

  it('resolves the SDGs alias', () => {
    expect(getStandardDescription('Relevance to Sustainable Development Goals (SDGs)')).toBe(
      getStandardDescription('Relevance to Sustainable Development Goals'),
    );
  });

  it('returns null for an unknown standard', () => {
    expect(getStandardDescription('Made-up Standard')).toBeNull();
  });
});

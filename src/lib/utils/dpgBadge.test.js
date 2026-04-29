import { describe, expect, it } from 'vitest';
import { buildBadgeHtml, buildBadgeMarkdown, buildBadgeSvg, pickColor } from './dpgBadge.js';

describe('pickColor', () => {
  it('returns red for 0', () => {
    expect(pickColor(0)).toBe('#e05d44');
  });

  it('returns orange for 1..3', () => {
    expect(pickColor(1)).toBe('#fe7d37');
    expect(pickColor(3)).toBe('#fe7d37');
  });

  it('returns yellow for 4..6', () => {
    expect(pickColor(4)).toBe('#dfb317');
    expect(pickColor(6)).toBe('#dfb317');
  });

  it('returns yellowgreen for 7..8', () => {
    expect(pickColor(7)).toBe('#a3c51c');
    expect(pickColor(8)).toBe('#a3c51c');
  });

  it('returns brightgreen for 9', () => {
    expect(pickColor(9)).toBe('#4c1');
  });

  it('falls back to red for non-numeric or negative input', () => {
    expect(pickColor(NaN)).toBe('#e05d44');
    // @ts-expect-error testing runtime guard
    expect(pickColor('foo')).toBe('#e05d44');
    expect(pickColor(-1)).toBe('#e05d44');
  });
});

describe('buildBadgeSvg', () => {
  it('returns a well-formed SVG starting with <svg and ending with </svg>', () => {
    const svg = buildBadgeSvg(5);
    expect(svg.startsWith('<svg')).toBe(true);
    expect(svg.endsWith('</svg>')).toBe(true);
  });

  it('embeds the score in the label and value text', () => {
    const svg = buildBadgeSvg(7);
    expect(svg).toContain('DPG: 7/9');
    expect(svg).toContain('>7/9<');
  });

  it('uses the right color for the score tier', () => {
    expect(buildBadgeSvg(9)).toContain('#4c1');
    expect(buildBadgeSvg(5)).toContain('#dfb317');
    expect(buildBadgeSvg(0)).toContain('#e05d44');
  });

  it('caps a score above 9 to 9/9', () => {
    expect(buildBadgeSvg(15)).toContain('>9/9<');
  });

  it('clamps a negative score to 0/9', () => {
    expect(buildBadgeSvg(-3)).toContain('>0/9<');
  });

  it('treats null/undefined as 0/9', () => {
    expect(buildBadgeSvg(null)).toContain('>0/9<');
    expect(buildBadgeSvg(undefined)).toContain('>0/9<');
  });

  it('floors fractional scores', () => {
    expect(buildBadgeSvg(7.8)).toContain('>7/9<');
  });

  it('declares the SVG namespace', () => {
    expect(buildBadgeSvg(5)).toContain('xmlns="http://www.w3.org/2000/svg"');
  });
});

describe('buildBadgeMarkdown', () => {
  it('builds the standard shields-style markdown snippet', () => {
    const md = buildBadgeMarkdown('https://pipeline.example.com', 'abc-123');
    expect(md).toBe(
      '[![DPG Score](https://pipeline.example.com/api/projects/abc-123/badge.svg)](https://pipeline.example.com/project/abc-123)',
    );
  });

  it('strips a trailing slash from the origin', () => {
    const md = buildBadgeMarkdown('https://pipeline.example.com/', 'id');
    expect(md).not.toContain('com//');
  });

  it('handles a missing origin gracefully', () => {
    // @ts-expect-error testing runtime guard
    const md = buildBadgeMarkdown(undefined, 'id');
    expect(md).toContain('/api/projects/id/badge.svg');
  });
});

describe('buildBadgeHtml', () => {
  it('builds an anchor wrapping the img', () => {
    const html = buildBadgeHtml('https://x.com', 'id');
    expect(html).toContain('<a href="https://x.com/project/id">');
    expect(html).toContain('<img src="https://x.com/api/projects/id/badge.svg"');
    expect(html).toContain('alt="DPG Score"');
  });
});

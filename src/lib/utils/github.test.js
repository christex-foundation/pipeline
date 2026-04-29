import { describe, expect, it } from 'vitest';
import { parseGithubRepo } from './github.js';

describe('parseGithubRepo', () => {
  it('parses a plain https URL', () => {
    expect(parseGithubRepo('https://github.com/owner/repo')).toEqual({
      owner: 'owner',
      repo: 'repo',
    });
  });

  it('parses an http URL', () => {
    expect(parseGithubRepo('http://github.com/owner/repo')).toEqual({
      owner: 'owner',
      repo: 'repo',
    });
  });

  it('handles www subdomain', () => {
    expect(parseGithubRepo('https://www.github.com/owner/repo')).toEqual({
      owner: 'owner',
      repo: 'repo',
    });
  });

  it('strips .git suffix', () => {
    expect(parseGithubRepo('https://github.com/owner/repo.git')).toEqual({
      owner: 'owner',
      repo: 'repo',
    });
  });

  it('ignores extra path segments', () => {
    expect(parseGithubRepo('https://github.com/owner/repo/tree/main/src')).toEqual({
      owner: 'owner',
      repo: 'repo',
    });
  });

  it('keeps dots and dashes in repo name', () => {
    expect(parseGithubRepo('https://github.com/my-org/my.cool-repo')).toEqual({
      owner: 'my-org',
      repo: 'my.cool-repo',
    });
  });

  it('handles surrounding whitespace', () => {
    expect(parseGithubRepo('  https://github.com/owner/repo  ')).toEqual({
      owner: 'owner',
      repo: 'repo',
    });
  });

  it('returns null for non-GitHub URLs', () => {
    expect(parseGithubRepo('https://gitlab.com/owner/repo')).toBeNull();
  });

  it('returns null for malformed strings', () => {
    expect(parseGithubRepo('not a url')).toBeNull();
    expect(parseGithubRepo('https://github.com/onlyowner')).toBeNull();
  });

  it('returns null for empty / nullish input', () => {
    expect(parseGithubRepo('')).toBeNull();
    expect(parseGithubRepo('   ')).toBeNull();
    expect(parseGithubRepo(null)).toBeNull();
    expect(parseGithubRepo(undefined)).toBeNull();
  });

  it('returns null for non-string input', () => {
    // @ts-expect-error testing runtime type guard
    expect(parseGithubRepo(123)).toBeNull();
    // @ts-expect-error testing runtime type guard
    expect(parseGithubRepo({})).toBeNull();
  });
});

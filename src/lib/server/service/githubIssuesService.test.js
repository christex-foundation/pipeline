import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { _clearCache, getGoodFirstIssues } from './githubIssuesService.js';

const issueFixture = (n) => ({ id: n, number: n, title: `issue ${n}`, html_url: `https://x/${n}` });
const prFixture = (n) => ({ ...issueFixture(n), pull_request: { url: 'pr' } });

beforeEach(() => {
  _clearCache();
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-04-29T00:00:00Z'));
  vi.stubGlobal('fetch', vi.fn());
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('getGoodFirstIssues', () => {
  it('fetches and returns issues, filtering out pull requests', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => [issueFixture(1), prFixture(2), issueFixture(3)],
    });

    const result = await getGoodFirstIssues('owner', 'repo');

    expect(result.fromCache).toBe(false);
    expect(result.count).toBe(2);
    expect(result.issues.map((i) => i.id)).toEqual([1, 3]);
    expect(fetch).toHaveBeenCalledOnce();
    const url = fetch.mock.calls[0][0];
    expect(url).toContain('/repos/owner/repo/issues');
    expect(url).toContain('labels=good-first-issue');
    expect(url).toContain('state=open');
  });

  it('serves cached response within TTL without re-fetching', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => [issueFixture(1)],
    });

    await getGoodFirstIssues('owner', 'repo');
    vi.advanceTimersByTime(29 * 60 * 1000);
    const second = await getGoodFirstIssues('owner', 'repo');

    expect(second.fromCache).toBe(true);
    expect(second.count).toBe(1);
    expect(fetch).toHaveBeenCalledOnce();
  });

  it('refetches after TTL expires', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => [issueFixture(1)],
    });
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => [issueFixture(1), issueFixture(2)],
    });

    await getGoodFirstIssues('owner', 'repo');
    vi.advanceTimersByTime(31 * 60 * 1000);
    const second = await getGoodFirstIssues('owner', 'repo');

    expect(second.fromCache).toBe(false);
    expect(second.count).toBe(2);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('returns stale cache when GitHub responds non-2xx', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => [issueFixture(1)],
    });
    fetch.mockResolvedValueOnce({ ok: false, status: 403 });

    await getGoodFirstIssues('owner', 'repo');
    vi.advanceTimersByTime(31 * 60 * 1000);
    const second = await getGoodFirstIssues('owner', 'repo');

    expect(second.fromCache).toBe(true);
    expect(second.count).toBe(1);
    expect(second.error).toContain('403');
  });

  it('returns empty list when no cache and GitHub responds non-2xx', async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 404 });

    const result = await getGoodFirstIssues('owner', 'repo');

    expect(result.issues).toEqual([]);
    expect(result.count).toBe(0);
    expect(result.error).toContain('404');
  });

  it('returns stale cache when fetch throws', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => [issueFixture(1)],
    });
    fetch.mockRejectedValueOnce(new Error('network down'));

    await getGoodFirstIssues('owner', 'repo');
    vi.advanceTimersByTime(31 * 60 * 1000);
    const second = await getGoodFirstIssues('owner', 'repo');

    expect(second.fromCache).toBe(true);
    expect(second.error).toContain('network down');
  });

  it('returns empty list when fetch throws and no cache exists', async () => {
    fetch.mockRejectedValueOnce(new Error('boom'));

    const result = await getGoodFirstIssues('owner', 'repo');

    expect(result.issues).toEqual([]);
    expect(result.count).toBe(0);
    expect(result.error).toContain('boom');
  });

  it('caches per owner/repo independently', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => [issueFixture(1)],
    });
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => [issueFixture(2), issueFixture(3)],
    });

    const a = await getGoodFirstIssues('owner-a', 'repo');
    const b = await getGoodFirstIssues('owner-b', 'repo');

    expect(a.count).toBe(1);
    expect(b.count).toBe(2);
    expect(a.fromCache).toBe(false);
    expect(b.fromCache).toBe(false);
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});

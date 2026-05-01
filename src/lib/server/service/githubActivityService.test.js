import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { _clearCache, getRecentActivity } from './githubActivityService.js';

const commitFixture = (n, opts = {}) => ({
  sha: `sha${n}`,
  html_url: `https://github.com/o/r/commit/sha${n}`,
  author: opts.author === null ? null : { login: `user${n}`, avatar_url: `https://x/${n}.png` },
  commit: {
    message: opts.message ?? `commit ${n}`,
    author: { date: `2026-04-2${n}T00:00:00Z`, name: opts.name ?? `User ${n}` },
  },
});

const prFixture = (n, opts = {}) => ({
  number: n,
  title: `pr ${n}`,
  state: opts.state ?? 'open',
  merged_at: opts.merged_at ?? null,
  user: { login: `user${n}`, avatar_url: `https://x/${n}.png` },
  html_url: `https://github.com/o/r/pull/${n}`,
  updated_at: `2026-04-2${n}T00:00:00Z`,
});

const okJson = (payload) => ({ ok: true, status: 200, json: async () => payload });
const failJson = (status) => ({ ok: false, status });

beforeEach(() => {
  _clearCache();
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-04-29T00:00:00Z'));
  vi.stubGlobal('fetch', vi.fn());
  delete process.env.GITHUB_TOKEN;
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  delete process.env.GITHUB_TOKEN;
});

describe('getRecentActivity', () => {
  it('fetches commits and PRs in parallel and returns combined shape', async () => {
    fetch
      .mockResolvedValueOnce(okJson([commitFixture(1), commitFixture(2)]))
      .mockResolvedValueOnce(okJson([prFixture(1), prFixture(2)]));

    const result = await getRecentActivity('owner', 'repo');

    expect(result.fromCache).toBe(false);
    expect(result.commits).toHaveLength(2);
    expect(result.pullRequests).toHaveLength(2);
    expect(result.commits[0]).toMatchObject({
      sha: 'sha1',
      message: 'commit 1',
      author: { login: 'user1' },
    });
    expect(result.error).toBeUndefined();
    expect(fetch).toHaveBeenCalledTimes(2);

    const urls = fetch.mock.calls.map((c) => c[0]);
    expect(urls.some((u) => u.includes('/repos/owner/repo/commits'))).toBe(true);
    expect(urls.some((u) => u.includes('/repos/owner/repo/pulls'))).toBe(true);
    expect(urls.some((u) => u.includes('state=all'))).toBe(true);
    expect(urls.some((u) => u.includes('per_page=5'))).toBe(true);
  });

  it('serves cached response within TTL without re-fetching', async () => {
    fetch.mockResolvedValueOnce(okJson([commitFixture(1)])).mockResolvedValueOnce(okJson([]));
    await getRecentActivity('owner', 'repo');
    fetch.mockClear();

    vi.advanceTimersByTime(29 * 60 * 1000);
    const second = await getRecentActivity('owner', 'repo');

    expect(second.fromCache).toBe(true);
    expect(second.commits).toHaveLength(1);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('refetches after TTL expires', async () => {
    fetch
      .mockResolvedValueOnce(okJson([commitFixture(1)]))
      .mockResolvedValueOnce(okJson([]))
      .mockResolvedValueOnce(okJson([commitFixture(1), commitFixture(2)]))
      .mockResolvedValueOnce(okJson([prFixture(1)]));

    await getRecentActivity('owner', 'repo');
    vi.advanceTimersByTime(31 * 60 * 1000);
    const second = await getRecentActivity('owner', 'repo');

    expect(second.fromCache).toBe(false);
    expect(second.commits).toHaveLength(2);
    expect(second.pullRequests).toHaveLength(1);
    expect(fetch).toHaveBeenCalledTimes(4);
  });

  it('serves stale cache when both upstream calls fail', async () => {
    fetch.mockResolvedValueOnce(okJson([commitFixture(1)])).mockResolvedValueOnce(okJson([]));
    await getRecentActivity('owner', 'repo');

    fetch.mockResolvedValueOnce(failJson(403)).mockResolvedValueOnce(failJson(403));
    vi.advanceTimersByTime(31 * 60 * 1000);
    const second = await getRecentActivity('owner', 'repo');

    expect(second.fromCache).toBe(true);
    expect(second.commits).toHaveLength(1);
    expect(second.error).toContain('403');
    expect(second.error).toContain('stale cache');
  });

  it('returns empty arrays + error when no cache and both calls fail', async () => {
    fetch.mockResolvedValueOnce(failJson(404)).mockResolvedValueOnce(failJson(404));

    const result = await getRecentActivity('owner', 'repo');

    expect(result.commits).toEqual([]);
    expect(result.pullRequests).toEqual([]);
    expect(result.error).toContain('404');
  });

  it('serves stale cache when fetch throws on both calls', async () => {
    fetch.mockResolvedValueOnce(okJson([commitFixture(1)])).mockResolvedValueOnce(okJson([]));
    await getRecentActivity('owner', 'repo');

    fetch
      .mockRejectedValueOnce(new Error('network down'))
      .mockRejectedValueOnce(new Error('network down'));
    vi.advanceTimersByTime(31 * 60 * 1000);
    const second = await getRecentActivity('owner', 'repo');

    expect(second.fromCache).toBe(true);
    expect(second.error).toContain('network down');
  });

  it('caches per owner/repo independently', async () => {
    fetch
      .mockResolvedValueOnce(okJson([commitFixture(1)]))
      .mockResolvedValueOnce(okJson([]))
      .mockResolvedValueOnce(okJson([commitFixture(2), commitFixture(3)]))
      .mockResolvedValueOnce(okJson([prFixture(9)]));

    const a = await getRecentActivity('owner-a', 'repo');
    const b = await getRecentActivity('owner-b', 'repo');

    expect(a.commits).toHaveLength(1);
    expect(b.commits).toHaveLength(2);
    expect(b.pullRequests).toHaveLength(1);
    expect(a.fromCache).toBe(false);
    expect(b.fromCache).toBe(false);
  });

  it('partial failure: commits succeed, PRs fail — returns commits + error mentioning pullRequests', async () => {
    fetch
      .mockResolvedValueOnce(okJson([commitFixture(1), commitFixture(2)]))
      .mockResolvedValueOnce(failJson(403));

    const result = await getRecentActivity('owner', 'repo');

    expect(result.commits).toHaveLength(2);
    expect(result.pullRequests).toEqual([]);
    expect(result.error).toContain('pullRequests');
    expect(result.error).toContain('403');
    // The successful list should still be cached for next call.
    fetch.mockClear();
    fetch.mockResolvedValueOnce(failJson(403)).mockResolvedValueOnce(failJson(403));
    vi.advanceTimersByTime(31 * 60 * 1000);
    const stale = await getRecentActivity('owner', 'repo');
    expect(stale.fromCache).toBe(true);
    expect(stale.commits).toHaveLength(2);
  });

  it('preserves merged_at on PRs so UI can distinguish merged-vs-closed', async () => {
    fetch
      .mockResolvedValueOnce(okJson([]))
      .mockResolvedValueOnce(
        okJson([
          prFixture(1, { state: 'open' }),
          prFixture(2, { state: 'closed', merged_at: '2026-04-25T12:00:00Z' }),
          prFixture(3, { state: 'closed', merged_at: null }),
        ]),
      );

    const result = await getRecentActivity('owner', 'repo');

    expect(result.pullRequests[0]).toMatchObject({ state: 'open', merged_at: null });
    expect(result.pullRequests[1]).toMatchObject({
      state: 'closed',
      merged_at: '2026-04-25T12:00:00Z',
    });
    expect(result.pullRequests[2]).toMatchObject({ state: 'closed', merged_at: null });
  });

  it('uses GITHUB_TOKEN Authorization header when env is set', async () => {
    process.env.GITHUB_TOKEN = 'ghp_test_token';
    fetch.mockResolvedValueOnce(okJson([])).mockResolvedValueOnce(okJson([]));

    await getRecentActivity('owner', 'repo');

    const authHeaders = fetch.mock.calls.map((c) => c[1]?.headers?.Authorization);
    expect(authHeaders).toContain('Bearer ghp_test_token');
    expect(authHeaders.length).toBe(2);
  });

  it('falls back to commit.author.name when top-level author is null (unlinked email)', async () => {
    fetch
      .mockResolvedValueOnce(okJson([commitFixture(1, { author: null, name: 'Detached Author' })]))
      .mockResolvedValueOnce(okJson([]));

    const result = await getRecentActivity('owner', 'repo');

    expect(result.commits[0].author).toMatchObject({
      login: null,
      avatar_url: null,
      name: 'Detached Author',
    });
  });
});

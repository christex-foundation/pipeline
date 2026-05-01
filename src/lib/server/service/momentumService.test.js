import { describe, expect, it } from 'vitest';
import { computeHeatScore, daysSinceLastActivity, HOT_PILL_THRESHOLD } from './momentumService.js';

const NOW = new Date('2026-04-29T12:00:00Z');
const daysAgo = (n) => new Date(NOW.getTime() - n * 24 * 60 * 60 * 1000);

describe('computeHeatScore', () => {
  it('returns 0 for a project with no signals (and infinite decay caps at 365 * -0.5)', () => {
    // Defaults: delta 0, comments 0, updates 0, decay = Infinity → caps to 365
    // → 0 + 0 + 0 - 0.5 * 365 = -182.5
    expect(computeHeatScore({})).toBe(-182.5);
  });

  it('rewards dpg score gains heaviest', () => {
    expect(computeHeatScore({ dpgScoreDelta30d: 1, daysSinceLastActivity: 0 })).toBe(2);
    expect(computeHeatScore({ dpgScoreDelta30d: 3, daysSinceLastActivity: 0 })).toBe(6);
  });

  it('rewards recent comments and updates', () => {
    expect(computeHeatScore({ recentCommentCount: 2, daysSinceLastActivity: 0 })).toBe(3);
    expect(computeHeatScore({ recentUpdateCount: 4, daysSinceLastActivity: 0 })).toBe(4);
  });

  it('penalizes inactivity via decay', () => {
    const fresh = computeHeatScore({ recentUpdateCount: 4, daysSinceLastActivity: 0 });
    const stale = computeHeatScore({ recentUpdateCount: 4, daysSinceLastActivity: 30 });
    expect(stale).toBeLessThan(fresh);
    expect(stale).toBe(4 - 15);
  });

  it('handles a negative dpg delta (project lost criteria)', () => {
    expect(computeHeatScore({ dpgScoreDelta30d: -2, daysSinceLastActivity: 0 })).toBe(-4);
  });

  it('coerces non-numeric inputs to zero', () => {
    expect(
      computeHeatScore({
        // @ts-expect-error testing runtime guard
        dpgScoreDelta30d: 'foo',
        // @ts-expect-error testing runtime guard
        recentCommentCount: null,
        recentUpdateCount: undefined,
        daysSinceLastActivity: 0,
      }),
    ).toBe(0);
  });

  it('coerces negative counts to zero (only delta can go negative)', () => {
    expect(
      computeHeatScore({
        recentCommentCount: -10,
        recentUpdateCount: -5,
        daysSinceLastActivity: 0,
      }),
    ).toBe(0);
  });

  it('caps Infinity decay at 365 days', () => {
    const noActivity = computeHeatScore({ daysSinceLastActivity: Infinity });
    expect(noActivity).toBe(-182.5);
  });

  it('combines all positive terms cleanly', () => {
    // 2*1 + 1.5*2 + 1.0*3 - 0.5*4 = 2 + 3 + 3 - 2 = 6
    const heat = computeHeatScore({
      dpgScoreDelta30d: 1,
      recentCommentCount: 2,
      recentUpdateCount: 3,
      daysSinceLastActivity: 4,
    });
    expect(heat).toBe(6);
  });

  it('exposes a sensible threshold', () => {
    // Threshold should be reachable by realistic activity:
    // 1 comment + 2 updates + fresh = 1.5 + 2 + 0 = 3.5 (passes)
    const realistic = computeHeatScore({
      recentCommentCount: 1,
      recentUpdateCount: 2,
      daysSinceLastActivity: 0,
    });
    expect(realistic).toBeGreaterThanOrEqual(HOT_PILL_THRESHOLD);

    // But idle projects shouldn't pass
    const idle = computeHeatScore({ daysSinceLastActivity: 30 });
    expect(idle).toBeLessThan(HOT_PILL_THRESHOLD);
  });
});

describe('daysSinceLastActivity', () => {
  it('returns days since the most recent of two timestamps', () => {
    expect(daysSinceLastActivity(daysAgo(10), daysAgo(3), NOW)).toBe(3);
    expect(daysSinceLastActivity(daysAgo(2), daysAgo(20), NOW)).toBe(2);
  });

  it('handles one missing timestamp', () => {
    expect(daysSinceLastActivity(daysAgo(5), null, NOW)).toBe(5);
    expect(daysSinceLastActivity(null, daysAgo(7), NOW)).toBe(7);
  });

  it('returns Infinity when both are missing', () => {
    expect(daysSinceLastActivity(null, null, NOW)).toBe(Infinity);
    expect(daysSinceLastActivity(undefined, undefined, NOW)).toBe(Infinity);
  });

  it('accepts ISO strings', () => {
    expect(daysSinceLastActivity(daysAgo(4).toISOString(), null, NOW)).toBe(4);
  });

  it('returns 0 for future timestamps (clock skew)', () => {
    const future = new Date(NOW.getTime() + 60 * 1000);
    expect(daysSinceLastActivity(future, null, NOW)).toBe(0);
  });

  it('ignores unparseable strings', () => {
    expect(daysSinceLastActivity('not-a-date', daysAgo(2), NOW)).toBe(2);
    expect(daysSinceLastActivity('not-a-date', null, NOW)).toBe(Infinity);
  });
});

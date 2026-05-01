import { describe, expect, it } from 'vitest';
import { derivePills } from './pillsService.js';

const NOW = new Date('2026-04-29T12:00:00Z');
const daysAgo = (n) => new Date(NOW.getTime() - n * 24 * 60 * 60 * 1000);

describe('derivePills - newEvaluation', () => {
  it('is true when evaluation completed today', () => {
    const pills = derivePills({
      project: {},
      lastEvaluationCompletedAt: NOW,
      now: NOW,
    });
    expect(pills.newEvaluation).toBe(true);
  });

  it('is true at 6 days ago (within 7-day window)', () => {
    const pills = derivePills({
      project: {},
      lastEvaluationCompletedAt: daysAgo(6),
      now: NOW,
    });
    expect(pills.newEvaluation).toBe(true);
  });

  it('is false at 8 days ago (outside 7-day window)', () => {
    const pills = derivePills({
      project: {},
      lastEvaluationCompletedAt: daysAgo(8),
      now: NOW,
    });
    expect(pills.newEvaluation).toBe(false);
  });

  it('accepts ISO string timestamps', () => {
    const pills = derivePills({
      project: {},
      lastEvaluationCompletedAt: daysAgo(3).toISOString(),
      now: NOW,
    });
    expect(pills.newEvaluation).toBe(true);
  });

  it('is false when evaluation timestamp is missing', () => {
    expect(
      derivePills({ project: {}, lastEvaluationCompletedAt: null, now: NOW }).newEvaluation,
    ).toBe(false);
    expect(
      derivePills({ project: {}, lastEvaluationCompletedAt: undefined, now: NOW }).newEvaluation,
    ).toBe(false);
  });

  it('is false for an unparseable date string', () => {
    const pills = derivePills({
      project: {},
      lastEvaluationCompletedAt: 'not-a-date',
      now: NOW,
    });
    expect(pills.newEvaluation).toBe(false);
  });
});

describe('derivePills - fundingNeeded', () => {
  it('is true when funded under 25% of goal', () => {
    const pills = derivePills({
      project: { funding_goal: 1000, current_funding: 100 },
      lastEvaluationCompletedAt: null,
      now: NOW,
    });
    expect(pills.fundingNeeded).toBe(true);
  });

  it('is false at exactly 25% of goal (boundary)', () => {
    const pills = derivePills({
      project: { funding_goal: 1000, current_funding: 250 },
      lastEvaluationCompletedAt: null,
      now: NOW,
    });
    expect(pills.fundingNeeded).toBe(false);
  });

  it('is false above 25% of goal', () => {
    const pills = derivePills({
      project: { funding_goal: 1000, current_funding: 800 },
      lastEvaluationCompletedAt: null,
      now: NOW,
    });
    expect(pills.fundingNeeded).toBe(false);
  });

  it('is true when current_funding is null/undefined but goal is set', () => {
    expect(
      derivePills({
        project: { funding_goal: 1000, current_funding: null },
        lastEvaluationCompletedAt: null,
        now: NOW,
      }).fundingNeeded,
    ).toBe(true);
    expect(
      derivePills({
        project: { funding_goal: 1000 },
        lastEvaluationCompletedAt: null,
        now: NOW,
      }).fundingNeeded,
    ).toBe(true);
  });

  it('is false when funding_goal is missing or zero', () => {
    expect(
      derivePills({ project: {}, lastEvaluationCompletedAt: null, now: NOW }).fundingNeeded,
    ).toBe(false);
    expect(
      derivePills({
        project: { funding_goal: 0, current_funding: 0 },
        lastEvaluationCompletedAt: null,
        now: NOW,
      }).fundingNeeded,
    ).toBe(false);
  });

  it('is false when funding_goal is negative', () => {
    expect(
      derivePills({
        project: { funding_goal: -100, current_funding: 0 },
        lastEvaluationCompletedAt: null,
        now: NOW,
      }).fundingNeeded,
    ).toBe(false);
  });
});

describe('derivePills - trending', () => {
  it('is true with 2 recent updates', () => {
    const pills = derivePills({
      project: {},
      lastEvaluationCompletedAt: null,
      recentUpdateCount: 2,
      now: NOW,
    });
    expect(pills.trending).toBe(true);
  });

  it('is true with 2 recent comments', () => {
    const pills = derivePills({
      project: {},
      lastEvaluationCompletedAt: null,
      recentCommentCount: 2,
      now: NOW,
    });
    expect(pills.trending).toBe(true);
  });

  it('is true when 1 update + 1 comment', () => {
    const pills = derivePills({
      project: {},
      lastEvaluationCompletedAt: null,
      recentUpdateCount: 1,
      recentCommentCount: 1,
      now: NOW,
    });
    expect(pills.trending).toBe(true);
  });

  it('is true when 1 update + recent evaluation counts as activity', () => {
    const pills = derivePills({
      project: {},
      lastEvaluationCompletedAt: daysAgo(1),
      recentUpdateCount: 1,
      now: NOW,
    });
    expect(pills.trending).toBe(true);
  });

  it('is false with only 1 activity event', () => {
    expect(
      derivePills({
        project: {},
        lastEvaluationCompletedAt: null,
        recentUpdateCount: 1,
        now: NOW,
      }).trending,
    ).toBe(false);
    expect(
      derivePills({
        project: {},
        lastEvaluationCompletedAt: null,
        recentCommentCount: 1,
        now: NOW,
      }).trending,
    ).toBe(false);
    expect(
      derivePills({
        project: {},
        lastEvaluationCompletedAt: daysAgo(1),
        now: NOW,
      }).trending,
    ).toBe(false);
  });

  it('is false with zero activity', () => {
    const pills = derivePills({
      project: {},
      lastEvaluationCompletedAt: null,
      now: NOW,
    });
    expect(pills.trending).toBe(false);
  });

  it('does not count an old evaluation toward trending', () => {
    const pills = derivePills({
      project: {},
      lastEvaluationCompletedAt: daysAgo(30),
      recentUpdateCount: 1,
      now: NOW,
    });
    expect(pills.trending).toBe(false);
  });

  it('coerces negative or non-numeric counts to zero', () => {
    expect(
      derivePills({
        project: {},
        lastEvaluationCompletedAt: null,
        recentUpdateCount: -5,
        recentCommentCount: 3,
        now: NOW,
      }).trending,
    ).toBe(true);
    expect(
      derivePills({
        project: {},
        lastEvaluationCompletedAt: null,
        // @ts-expect-error testing runtime guard
        recentUpdateCount: 'foo',
        recentCommentCount: 1,
        now: NOW,
      }).trending,
    ).toBe(false);
  });
});

describe('derivePills - hot', () => {
  it('is true when heatScore meets the threshold', () => {
    expect(
      derivePills({ project: {}, lastEvaluationCompletedAt: null, heatScore: 3, now: NOW }).hot,
    ).toBe(true);
    expect(
      derivePills({ project: {}, lastEvaluationCompletedAt: null, heatScore: 10, now: NOW }).hot,
    ).toBe(true);
  });

  it('is false when heatScore is below the threshold', () => {
    expect(
      derivePills({ project: {}, lastEvaluationCompletedAt: null, heatScore: 2.99, now: NOW }).hot,
    ).toBe(false);
    expect(
      derivePills({ project: {}, lastEvaluationCompletedAt: null, heatScore: 0, now: NOW }).hot,
    ).toBe(false);
    expect(
      derivePills({ project: {}, lastEvaluationCompletedAt: null, heatScore: -50, now: NOW }).hot,
    ).toBe(false);
  });

  it('is false when heatScore is missing or non-numeric', () => {
    expect(derivePills({ project: {}, lastEvaluationCompletedAt: null, now: NOW }).hot).toBe(false);
    expect(
      derivePills({
        project: {},
        lastEvaluationCompletedAt: null,
        // @ts-expect-error testing runtime guard
        heatScore: 'foo',
        now: NOW,
      }).hot,
    ).toBe(false);
  });
});

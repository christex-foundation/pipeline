import { describe, expect, it } from 'vitest';
import {
  consumeExportRateLimit,
  EXPORT_RATE_LIMIT_MAX,
  toReadableRows,
  toCsv,
  toPathRows,
} from './exportService.js';

describe('exportService', () => {
  it('flattens nested payload into section/path/value rows', () => {
    const payload = {
      user: { id: 'u1', profile: { name: 'Ada' } },
      projects: [{ id: 'p1', title: 'Project One' }],
    };

    const rows = toPathRows(payload);

    expect(rows).toEqual(
      expect.arrayContaining([
        { section: 'user', path: 'id', value: 'u1' },
        { section: 'user', path: 'profile.name', value: 'Ada' },
        { section: 'projects', path: '[0].id', value: 'p1' },
      ]),
    );
  });

  it('creates a csv with headers and escaped values', () => {
    const csv = toCsv([
      { section: 'user', path: 'profile.name', value: 'Ada Lovelace' },
      { section: 'user', path: 'profile.bio', value: 'Writes, tests, and "ships"' },
    ]);

    expect(csv).toContain('section,path,value');
    expect(csv).toContain('"Writes, tests, and ""ships"""');
  });

  it('creates readable tabular rows for csv exports', () => {
    const rows = toReadableRows({
      exported_at: '2026-03-03T10:00:00.000Z',
      access_role: 'owner',
      user: { user_id: 'u1', profile: { name: 'Ada' } },
      projects: [{ id: 'p1', title: 'Project One' }],
    });

    expect(rows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          Section: 'User',
          'Record Number': 1,
          'Export Date': '2026-03-03T10:00:00.000Z',
          'Access Role': 'owner',
          'User ID': 'u1',
        }),
        expect.objectContaining({
          Section: 'Projects',
          'Record Number': 1,
          ID: 'p1',
          Title: 'Project One',
        }),
      ]),
    );
  });

  it('enforces per-user export rate limiting', () => {
    const userId = `rate-limit-user-${Date.now()}`;

    for (let i = 0; i < EXPORT_RATE_LIMIT_MAX; i++) {
      const result = consumeExportRateLimit(userId);
      expect(result.allowed).toBe(true);
    }

    const blocked = consumeExportRateLimit(userId);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });
});

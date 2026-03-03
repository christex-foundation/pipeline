import { describe, expect, it } from 'vitest';
import { toCsv, toPathRows } from './exportService.js';

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
});

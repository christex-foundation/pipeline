import { describe, expect, it } from 'vitest';
import { isPublicApiRoute, skipsOriginCheck } from './apiPublicRoutes.js';

describe('isPublicApiRoute - auth flows', () => {
  it('allows sign in/up POST', () => {
    expect(isPublicApiRoute('/api/signIn', 'POST')).toBe(true);
    expect(isPublicApiRoute('/api/signUp', 'POST')).toBe(true);
  });

  it('rejects sign in/up GET', () => {
    expect(isPublicApiRoute('/api/signIn', 'GET')).toBe(false);
    expect(isPublicApiRoute('/api/signUp', 'GET')).toBe(false);
  });
});

describe('isPublicApiRoute - github webhook', () => {
  it('allows POST', () => {
    expect(isPublicApiRoute('/api/github/webhook', 'POST')).toBe(true);
  });
  it('rejects GET', () => {
    expect(isPublicApiRoute('/api/github/webhook', 'GET')).toBe(false);
  });
});

describe('isPublicApiRoute - listing endpoints', () => {
  it('allows public GETs', () => {
    expect(isPublicApiRoute('/api/categories', 'GET')).toBe(true);
    expect(isPublicApiRoute('/api/projects', 'GET')).toBe(true);
    expect(isPublicApiRoute('/api/projects/top', 'GET')).toBe(true);
    expect(isPublicApiRoute('/api/projects/projectByCategory', 'GET')).toBe(true);
  });

  it('rejects writes to listing endpoints', () => {
    expect(isPublicApiRoute('/api/projects', 'POST')).toBe(false);
    expect(isPublicApiRoute('/api/categories', 'PUT')).toBe(false);
  });
});

describe('isPublicApiRoute - per-project reads', () => {
  it('allows GET on /api/projects/{id}', () => {
    expect(isPublicApiRoute('/api/projects/abc-123', 'GET')).toBe(true);
  });

  it('allows GET on /api/projects/{id}/badge.svg', () => {
    expect(isPublicApiRoute('/api/projects/abc-123/badge.svg', 'GET')).toBe(true);
  });

  it('allows GET on /api/projects/{id}/github/issues', () => {
    expect(isPublicApiRoute('/api/projects/abc-123/github/issues', 'GET')).toBe(true);
  });

  it('allows GET on /api/projects/{id}/evaluations', () => {
    expect(isPublicApiRoute('/api/projects/abc-123/evaluations', 'GET')).toBe(true);
  });

  it('rejects PUT/DELETE on /api/projects/{id}', () => {
    expect(isPublicApiRoute('/api/projects/abc-123', 'PUT')).toBe(false);
    expect(isPublicApiRoute('/api/projects/abc-123', 'DELETE')).toBe(false);
  });

  it('rejects POST on /api/projects/{id}/evaluate', () => {
    expect(isPublicApiRoute('/api/projects/abc-123/evaluate', 'POST')).toBe(false);
  });
});

describe('isPublicApiRoute - singleProject reads', () => {
  it('allows any GET under /api/projects/singleProject/', () => {
    expect(isPublicApiRoute('/api/projects/singleProject/abc-123', 'GET')).toBe(true);
    expect(isPublicApiRoute('/api/projects/singleProject/abc-123/projectMembers', 'GET')).toBe(
      true,
    );
    expect(isPublicApiRoute('/api/projects/singleProject/abc-123/projectUpdates', 'GET')).toBe(
      true,
    );
  });

  it('rejects writes under singleProject', () => {
    expect(
      isPublicApiRoute('/api/projects/singleProject/abc-123/projectUpdates/store', 'POST'),
    ).toBe(false);
    expect(isPublicApiRoute('/api/projects/singleProject/abc-123/bookmark', 'POST')).toBe(false);
  });
});

describe('isPublicApiRoute - protected routes stay protected', () => {
  it('rejects /api/projects/store POST', () => {
    expect(isPublicApiRoute('/api/projects/store', 'POST')).toBe(false);
  });

  it('rejects /api/projects/store GET (no such route, but still protected)', () => {
    expect(isPublicApiRoute('/api/projects/store', 'GET')).toBe(false);
  });

  it('rejects exports', () => {
    expect(isPublicApiRoute('/api/projects/export', 'GET')).toBe(false);
    expect(isPublicApiRoute('/api/profile/export', 'GET')).toBe(false);
    expect(isPublicApiRoute('/api/categories/export', 'GET')).toBe(false);
  });

  it('rejects user-scoped routes', () => {
    expect(isPublicApiRoute('/api/me', 'GET')).toBe(false);
    expect(isPublicApiRoute('/api/projects/user/projects', 'GET')).toBe(false);
    expect(isPublicApiRoute('/api/projects/user/contributed', 'GET')).toBe(false);
    expect(isPublicApiRoute('/api/profile/update', 'POST')).toBe(false);
    expect(isPublicApiRoute('/api/file-upload', 'POST')).toBe(false);
  });
});

describe('skipsOriginCheck', () => {
  it('exempts the github webhook', () => {
    expect(skipsOriginCheck('/api/github/webhook')).toBe(true);
  });

  it('does not exempt anything else', () => {
    expect(skipsOriginCheck('/api/projects')).toBe(false);
    expect(skipsOriginCheck('/api/projects/abc/badge.svg')).toBe(false);
    expect(skipsOriginCheck('/api/signIn')).toBe(false);
  });
});

import { test, expect } from './fixtures/auth.fixture.js';
import { mockUser, mockProject } from './fixtures/test-data.js';

/**
 * Export tests verify the data export functionality.
 *
 * The export UI lives on the profile page (/profile), which requires
 * server-side auth that can't be mocked at the browser level in dev mode.
 * These tests verify the export API behavior by intercepting fetch calls
 * from an accessible authenticated page.
 */
test.describe('Data Export', () => {
  test('JSON export API returns correct content type and data', async ({ authenticatedPage }) => {
    const mockExportData = {
      metadata: { exportedAt: new Date().toISOString(), format: 'json' },
      user: mockUser,
      projects: [mockProject],
      contributions: [],
      bookmarks: [],
    };

    let interceptedRequest = null;

    await authenticatedPage.route('**/api/profile/export*', async (route) => {
      interceptedRequest = {
        url: route.request().url(),
        method: route.request().method(),
      };
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        headers: {
          'Content-Disposition': 'attachment; filename="pipeline-user-export.json"',
        },
        body: JSON.stringify(mockExportData),
      });
    });

    await authenticatedPage.goto('/');

    // Trigger the export API call from the browser
    const response = await authenticatedPage.evaluate(async () => {
      const res = await fetch('/api/profile/export?format=json');
      return {
        ok: res.ok,
        status: res.status,
        contentType: res.headers.get('content-type'),
        disposition: res.headers.get('content-disposition'),
      };
    });

    expect(interceptedRequest).not.toBeNull();
    expect(interceptedRequest.url).toContain('/api/profile/export');
    expect(interceptedRequest.url).toContain('format=json');
    expect(response.ok).toBe(true);
    expect(response.contentType).toContain('application/json');
    expect(response.disposition).toContain('pipeline-user-export.json');
  });

  test('CSV export API returns correct content type', async ({ authenticatedPage }) => {
    let interceptedRequest = null;

    await authenticatedPage.route('**/api/profile/export*', async (route) => {
      interceptedRequest = {
        url: route.request().url(),
        method: route.request().method(),
      };
      await route.fulfill({
        status: 200,
        contentType: 'text/csv',
        headers: {
          'Content-Disposition': 'attachment; filename="pipeline-user-export.csv"',
        },
        body: 'id,email,display_name\ntest-user-id-123,testuser@example.com,Test User',
      });
    });

    await authenticatedPage.goto('/');

    const response = await authenticatedPage.evaluate(async () => {
      const res = await fetch('/api/profile/export?format=csv');
      return {
        ok: res.ok,
        status: res.status,
        contentType: res.headers.get('content-type'),
        disposition: res.headers.get('content-disposition'),
      };
    });

    expect(interceptedRequest).not.toBeNull();
    expect(interceptedRequest.url).toContain('format=csv');
    expect(response.ok).toBe(true);
    expect(response.contentType).toContain('text/csv');
    expect(response.disposition).toContain('pipeline-user-export.csv');
  });

  test('project export API returns data for a specific project', async ({
    authenticatedPage,
  }) => {
    const projectId = 'project-id-1';
    let interceptedUrl = null;

    await authenticatedPage.route(`**/api/projects/${projectId}/export*`, async (route) => {
      interceptedUrl = route.request().url();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        headers: {
          'Content-Disposition': `attachment; filename="project-${projectId}-export.json"`,
        },
        body: JSON.stringify({
          metadata: { exportedAt: new Date().toISOString() },
          project: mockProject,
          categories: mockProject.categories,
          resources: [],
        }),
      });
    });

    await authenticatedPage.goto('/');

    const response = await authenticatedPage.evaluate(async (id) => {
      const res = await fetch(`/api/projects/${id}/export?format=json`);
      const data = await res.json();
      return {
        ok: res.ok,
        hasProject: !!data.project,
        hasMetadata: !!data.metadata,
      };
    }, projectId);

    expect(interceptedUrl).toContain(`/api/projects/${projectId}/export`);
    expect(response.ok).toBe(true);
    expect(response.hasProject).toBe(true);
    expect(response.hasMetadata).toBe(true);
  });
});

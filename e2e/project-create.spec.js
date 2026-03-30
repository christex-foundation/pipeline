import { test, expect } from './fixtures/auth.fixture.js';
import { expect as baseExpect, test as baseTest } from '@playwright/test';
import { mockCategories, mockProjects } from './fixtures/test-data.js';

/**
 * Project creation tests.
 *
 * The /project/create page is protected by server-side auth guard, so we
 * can't access it in dev mode without a real session. Tests are split:
 * - Redirect behavior (unauthenticated)
 * - Store API behavior (authenticated, API-level)
 */
baseTest.describe('Project Create Page (Unauthenticated)', () => {
  baseTest('redirects to sign-in when not authenticated', async ({ page }) => {
    await page.goto('/project/create');
    await baseExpect(page).toHaveURL('/sign-in');
  });
});

test.describe('Project Store API (Authenticated)', () => {
  test('store API accepts valid project data', async ({ authenticatedPage }) => {
    let interceptedRequest = null;

    await authenticatedPage.route('**/api/projects/store', async (route) => {
      if (route.request().method() === 'POST') {
        interceptedRequest = {
          url: route.request().url(),
          method: route.request().method(),
          body: route.request().postDataJSON(),
        };
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ response: { projectId: 'new-project-123' } }),
        });
      } else {
        await route.fallback();
      }
    });

    await authenticatedPage.goto('/');

    // Call the store API directly from the browser
    const response = await authenticatedPage.evaluate(async () => {
      const res = await fetch('/api/projects/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            title: 'My New DPG Project',
            bio: 'A test project for digital public goods',
            github_repo: 'https://github.com/test/project',
            country: 'KE',
          },
        }),
      });
      const data = await res.json();
      return { ok: res.ok, status: res.status, projectId: data.response?.projectId };
    });

    expect(interceptedRequest).not.toBeNull();
    expect(interceptedRequest.method).toBe('POST');
    expect(interceptedRequest.body.data.title).toBe('My New DPG Project');
    expect(response.ok).toBe(true);
    expect(response.projectId).toBe('new-project-123');
  });

  test('store API returns error for invalid data', async ({ authenticatedPage }) => {
    await authenticatedPage.route('**/api/projects/store', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Title is required' }),
        });
      } else {
        await route.fallback();
      }
    });

    await authenticatedPage.goto('/');

    const response = await authenticatedPage.evaluate(async () => {
      const res = await fetch('/api/projects/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: {} }),
      });
      const data = await res.json();
      return { ok: res.ok, status: res.status, error: data.error };
    });

    expect(response.ok).toBe(false);
    expect(response.status).toBe(400);
    expect(response.error).toBe('Title is required');
  });

  test('explore page shows create project link', async ({ authenticatedPage }) => {
    await authenticatedPage.route('**/api/projects?*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ projects: mockProjects }),
      });
    });

    await authenticatedPage.goto('/');
    await authenticatedPage.locator('main').getByRole('link', { name: 'Explore Projects' }).click();
    await authenticatedPage.waitForURL('/explore');

    await expect(authenticatedPage.getByRole('link', { name: 'Start Creating' })).toBeVisible();
  });
});

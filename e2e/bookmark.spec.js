import { test, expect } from './fixtures/auth.fixture.js';
import { expect as baseExpect, test as baseTest } from '@playwright/test';
import { mockProject, mockProjects, mockOwnedProject } from './fixtures/test-data.js';

/**
 * Helper to set up route interception for project detail page.
 * Uses client-side navigation so SvelteKit __data.json interception works.
 */
async function setupProjectRoutes(page, project = mockProject) {
  await page.route('**/api/projects?*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ projects: mockProjects }),
    });
  });

  await page.route('**/api/projects/singleProject/**/contribution/resources', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ totalResources: 5 }),
    });
  });

  await page.route(/\/api\/projects\/singleProject\/[^/]+$/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ project }),
    });
  });

  await page.route('**/api.github.com/repos/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([]),
    });
  });
}

async function navigateToProject(page, projectTitle = 'Test DPG Project') {
  await page.goto('/');
  await page.locator('main').getByRole('link', { name: 'Explore Projects' }).click();
  await page.waitForURL('/explore');
  await page.getByText(projectTitle).first().click();
  await page.waitForURL(/\/project\//);
}

test.describe('Bookmark / Follow (Authenticated)', () => {
  test('authenticated user sees Follow button on another user\'s project', async ({
    authenticatedPage,
  }) => {
    await setupProjectRoutes(authenticatedPage, mockProject);
    await navigateToProject(authenticatedPage);

    await expect(authenticatedPage.getByRole('button', { name: 'Follow' })).toBeVisible();
  });

  test('project owner sees Edit button instead of Follow', async ({ authenticatedPage }) => {
    await setupProjectRoutes(authenticatedPage, mockOwnedProject);
    await navigateToProject(authenticatedPage, 'Test DPG Project');

    await expect(authenticatedPage.getByRole('link', { name: 'Edit' })).toBeVisible();
    await expect(authenticatedPage.getByRole('button', { name: 'Follow' })).not.toBeVisible();
  });

  test('clicking Follow toggles to Following', async ({ authenticatedPage }) => {
    await setupProjectRoutes(authenticatedPage, mockProject);

    // Intercept the bookmark form action (SvelteKit uses ?/bookmark as form action)
    // Use regex because ? is a glob wildcard in Playwright
    // SvelteKit enhance expects: {"type":"success","status":200,"data":"<devalue>"}
    await authenticatedPage.route(/\/project\/.*\?\/bookmark/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          type: 'success',
          status: 200,
          data: '[{"isBookmarked":1},true]',
        }),
      });
    });

    await navigateToProject(authenticatedPage);
    await authenticatedPage.getByRole('button', { name: 'Follow' }).click();

    await expect(authenticatedPage.getByRole('button', { name: 'Following' })).toBeVisible();
  });
});

baseTest.describe('Bookmark / Follow (Unauthenticated)', () => {
  baseTest('unauthenticated user does not see Follow or Edit buttons', async ({ page }) => {
    await setupProjectRoutes(page, mockProject);
    await navigateToProject(page);

    await baseExpect(page.getByRole('button', { name: 'Follow' })).not.toBeVisible();
    await baseExpect(page.getByRole('link', { name: 'Edit' })).not.toBeVisible();
  });
});

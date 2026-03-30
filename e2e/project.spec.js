import { expect, test } from '@playwright/test';
import { mockProject, mockProjects } from './fixtures/test-data.js';

test.describe('Project Create Page', () => {
  test('redirects to sign-in when not authenticated', async ({ page }) => {
    await page.goto('/project/create');
    await expect(page).toHaveURL('/sign-in');
  });
});

test.describe('Project Detail Page', () => {
  // Navigate to a project detail page via client-side navigation
  async function gotoProject(page) {
    // Intercept all API calls
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
        body: JSON.stringify({ project: mockProject }),
      });
    });

    await page.route('**/api.github.com/repos/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    // Navigate home -> explore (client-side)
    await page.goto('/');
    await page.locator('main').getByRole('link', { name: 'Explore Projects' }).click();
    await expect(page).toHaveURL('/explore');

    // Click on the first project card link
    await page.getByText('Test DPG Project').first().click();
    await page.waitForURL(/\/project\//);
  }

  test('displays project title', async ({ page }) => {
    await gotoProject(page);
    await expect(page.getByRole('heading', { name: mockProject.title })).toBeVisible();
  });

  test('shows project categories as tags', async ({ page }) => {
    await gotoProject(page);
    await expect(page.getByAltText('sdg-category').first()).toBeVisible();
  });

  test('shows funding information', async ({ page }) => {
    await gotoProject(page);
    await expect(page.getByText(/raised/i)).toBeVisible();
  });
});

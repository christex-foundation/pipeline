import { test, expect } from '@playwright/test';

test.describe('Explore Page', () => {
  // The explore page's +page.js load function fetches /api/projects which
  // requires Supabase. Since we can't reliably intercept server-side fetches,
  // tests that require project data use client-side navigation with route
  // interception. Tests that only check static UI elements can work even
  // when the API returns an error (the page still renders the layout).

  test('navigate to explore via home page CTA', async ({ page }) => {
    await page.route(/\/api\/projects/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ projects: [] }),
      });
    });

    await page.goto('/');
    await page.locator('main').getByRole('link', { name: 'Explore Projects' }).click();
    await expect(page).toHaveURL('/explore');
  });

  test('shows top projects and all projects headings', async ({ page }) => {
    await page.route(/\/api\/projects/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          projects: [
            {
              id: '1',
              title: 'E2E Test Project',
              bio: 'A test project',
              funding_goal: 10000,
              current_funding: 5000,
              categories: [],
              dpgCount: 3,
            },
          ],
        }),
      });
    });

    await page.goto('/');
    await page.locator('main').getByRole('link', { name: 'Explore Projects' }).click();
    await expect(page).toHaveURL('/explore');

    await expect(page.getByRole('heading', { name: 'Top Projects' })).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByRole('heading', { name: 'All Projects' })).toBeVisible();
  });

  test('shows empty state when no projects exist', async ({ page }) => {
    await page.route(/\/api\/projects/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ projects: [] }),
      });
    });

    await page.goto('/');
    await page.locator('main').getByRole('link', { name: 'Explore Projects' }).click();
    await expect(page).toHaveURL('/explore');

    await expect(page.getByText('No projects found.')).toBeVisible({ timeout: 10000 });
  });

  test('has filter sidebar', async ({ page }) => {
    await page.route(/\/api\/projects/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ projects: [] }),
      });
    });

    await page.goto('/');
    await page.locator('main').getByRole('link', { name: 'Explore Projects' }).click();
    await expect(page).toHaveURL('/explore');

    await expect(page.getByText('Filter Projects')).toBeVisible({ timeout: 10000 });
  });

  test('breadcrumb navigation works', async ({ page }) => {
    await page.route(/\/api\/projects/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ projects: [] }),
      });
    });

    await page.goto('/');
    await page.locator('main').getByRole('link', { name: 'Explore Projects' }).click();
    await expect(page).toHaveURL('/explore');

    // Click breadcrumb home link to go back
    const breadcrumb = page.locator('.container nav').first();
    await expect(breadcrumb.getByText('Explore Projects')).toBeVisible({ timeout: 10000 });
    await breadcrumb.getByRole('link', { name: 'Home' }).click();
    await expect(page).toHaveURL('/');
  });
});

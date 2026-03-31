import { test, expect } from '@playwright/test';

test.describe('Navigation Guards', () => {
  test('unauthenticated user accessing /profile is redirected to /sign-in', async ({ page }) => {
    await page.goto('/profile');
    await expect(page).toHaveURL('/sign-in');
  });

  test('unauthenticated user accessing /profile/edit is redirected to /sign-in', async ({
    page,
  }) => {
    await page.goto('/profile/edit');
    await expect(page).toHaveURL('/sign-in');
  });

  test('unauthenticated user accessing /project/create is redirected to /sign-in', async ({
    page,
  }) => {
    await page.goto('/project/create');
    await expect(page).toHaveURL('/sign-in');
  });

  test('public pages are accessible without authentication', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/');
    await expect(
      page.getByRole('heading', { name: 'Empower the Future of Digital Public Goods' }),
    ).toBeVisible();
  });

  test('sign-in page is accessible without authentication', async ({ page }) => {
    await page.goto('/sign-in');
    await expect(page).toHaveURL('/sign-in');
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  });

  test('sign-up page is accessible without authentication', async ({ page }) => {
    await page.goto('/sign-up');
    await expect(page).toHaveURL('/sign-up');
    await expect(page.getByRole('heading', { name: 'Register' })).toBeVisible();
  });

  test('explore page is accessible without authentication', async ({ page }) => {
    await page.route('**/api/projects?*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ projects: [] }),
      });
    });

    // Use client-side navigation so route interception works
    await page.goto('/');
    await page.locator('main').getByRole('link', { name: 'Explore Projects' }).click();
    await expect(page).toHaveURL('/explore');
  });
});

test.describe('Navigation Links', () => {
  test('home page CTA navigates to explore', async ({ page }) => {
    await page.route('**/api/projects?*', async (route) => {
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
});

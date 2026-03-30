import { test, expect } from '@playwright/test';
import { mockProjects } from './fixtures/test-data.js';

test.describe('Public Pages', () => {
  test('home page loads with correct heading', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: 'Empower the Future of Digital Public Goods' }),
    ).toBeVisible();
  });

  test('home page has explore projects CTA', async ({ page }) => {
    await page.goto('/');
    // Use the main content area CTA (not the footer link)
    const cta = page.locator('main').getByRole('link', { name: 'Explore Projects' });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', '/explore');
  });

  test('explore page loads and shows project sections', async ({ page }) => {
    await page.route('**/api/projects?*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ projects: mockProjects }),
      });
    });

    // Client-side navigation so route interception works
    await page.goto('/');
    await page.locator('main').getByRole('link', { name: 'Explore Projects' }).click();
    await expect(page).toHaveURL('/explore');
    await expect(page.getByRole('heading', { name: 'Top Projects' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'All Projects' })).toBeVisible();
  });

  test('explore page shows filter sidebar', async ({ page }) => {
    await page.route('**/api/projects?*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ projects: mockProjects }),
      });
    });

    await page.goto('/');
    await page.locator('main').getByRole('link', { name: 'Explore Projects' }).click();
    await expect(page).toHaveURL('/explore');
    await expect(page.getByText('Filter Projects')).toBeVisible();
  });

  test('privacy policy page loads', async ({ page }) => {
    await page.goto('/privacy');
    await expect(page.getByRole('heading', { name: 'Privacy Policy' })).toBeVisible();
  });

  test('terms of service page loads', async ({ page }) => {
    await page.goto('/terms');
    await expect(page.getByRole('heading', { name: 'Terms of Service' })).toBeVisible();
  });

  test('cookie policy page loads', async ({ page }) => {
    await page.goto('/cookies');
    await expect(page.getByRole('heading', { name: 'Cookie Policy' })).toBeVisible();
  });

  test('data processing agreement page loads', async ({ page }) => {
    await page.goto('/dpa');
    await expect(
      page.getByRole('heading', { name: 'Data Processing Agreement' }),
    ).toBeVisible();
  });

  test('resources - digital public good page loads', async ({ page }) => {
    await page.goto('/resources/digital-public-good');
    await expect(page).toHaveURL('/resources/digital-public-good');
  });

  test('resources - pipeline page loads', async ({ page }) => {
    await page.goto('/resources/pipeline');
    await expect(page).toHaveURL('/resources/pipeline');
  });
});

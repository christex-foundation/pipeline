import { test, expect } from '@playwright/test';

test.describe('Sign In Page', () => {
  test('renders sign in form with all fields', async ({ page }) => {
    await page.goto('/sign-in');
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
    await expect(page.getByText('Enter your info to sign in')).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
  });

  test('has link to sign up page', async ({ page }) => {
    await page.goto('/sign-in');
    await expect(page.getByText("Don't have an account?")).toBeVisible();
    const signUpLink = page.getByRole('link', { name: 'Sign Up' });
    await expect(signUpLink).toBeVisible();
    await expect(signUpLink).toHaveAttribute('href', '/sign-up');
  });

  test('navigates to sign up page', async ({ page }) => {
    await page.goto('/sign-in');
    await page.getByRole('link', { name: 'Sign Up' }).click();
    await expect(page).toHaveURL('/sign-up');
    await expect(page.getByRole('heading', { name: 'Register' })).toBeVisible();
  });

  test('has forgot password link', async ({ page }) => {
    await page.goto('/sign-in');
    await expect(page.getByRole('link', { name: 'Forgot Password?' })).toBeVisible();
  });

  test('has remember me checkbox', async ({ page }) => {
    await page.goto('/sign-in');
    await expect(page.getByText('Remember me')).toBeVisible();
  });

  test('email field has correct placeholder', async ({ page }) => {
    await page.goto('/sign-in');
    await expect(page.locator('#email')).toHaveAttribute('placeholder', 'Enter your email');
  });

  test('password field has correct placeholder', async ({ page }) => {
    await page.goto('/sign-in');
    await expect(page.locator('#password')).toHaveAttribute(
      'placeholder',
      'Enter your password',
    );
  });
});

test.describe('Sign Up Page', () => {
  test('renders sign up form with all fields', async ({ page }) => {
    await page.goto('/sign-up');
    await expect(page.getByRole('heading', { name: 'Register' })).toBeVisible();
    await expect(page.getByText('Enter your Info to signup for Pipeline')).toBeVisible();
    await expect(page.locator('#name')).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign up' })).toBeVisible();
  });

  test('has link to sign in page', async ({ page }) => {
    await page.goto('/sign-up');
    await expect(page.getByText('Already have an account?')).toBeVisible();
    const signInLink = page.getByRole('link', { name: 'Sign In' });
    await expect(signInLink).toBeVisible();
    await expect(signInLink).toHaveAttribute('href', '/sign-in');
  });

  test('navigates to sign in page', async ({ page }) => {
    await page.goto('/sign-up');
    await page.getByRole('link', { name: 'Sign In' }).click();
    await expect(page).toHaveURL('/sign-in');
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  });

  test('name field has correct placeholder', async ({ page }) => {
    await page.goto('/sign-up');
    await expect(page.locator('#name')).toHaveAttribute('placeholder', 'Enter your full name');
  });

  test('has remember me checkbox', async ({ page }) => {
    await page.goto('/sign-up');
    await expect(page.getByText('Remember me')).toBeVisible();
  });
});

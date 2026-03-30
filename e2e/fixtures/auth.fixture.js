import { test as base } from '@playwright/test';
import { mockUser } from './test-data.js';

/**
 * Extends Playwright's base test with an `authenticatedPage` fixture.
 * This intercepts both the initial SSR HTML response and SvelteKit's
 * __data.json requests to simulate an authenticated session.
 *
 * In dev mode, SvelteKit embeds data directly in the HTML via kit.start().
 * In production, it uses __data.json for client-side navigation.
 * This fixture handles both cases.
 */
export const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    const userJson = JSON.stringify(mockUser);

    // Intercept HTML page responses to inject auth into SSR-embedded data
    await page.route('**/*', async (route) => {
      const request = route.request();

      // Only intercept document/navigation requests (HTML pages)
      if (request.resourceType() === 'document') {
        const response = await route.fetch();
        let html = await response.text();

        // Replace the unauthenticated root layout data in the SSR HTML
        // SvelteKit embeds: data:{isAuthenticated:false,user:null,error:null}
        html = html.replace(
          /data:\{isAuthenticated:false,user:null,error:null\}/g,
          `data:{isAuthenticated:true,user:${userJson},error:null}`,
        );

        await route.fulfill({
          body: html,
          headers: response.headers(),
        });
        return;
      }

      // For __data.json requests (production mode), inject auth
      if (request.url().includes('__data.json')) {
        const response = await route.fetch();
        const text = await response.text();
        const json = JSON.parse(text);

        if (json.nodes) {
          for (const node of json.nodes) {
            if (node?.data?.isAuthenticated !== undefined) {
              node.data.isAuthenticated = true;
              node.data.user = mockUser;
              node.data.error = null;
            }
          }
        }

        await route.fulfill({
          body: JSON.stringify(json),
          headers: response.headers(),
        });
        return;
      }

      await route.fallback();
    });

    await use(page);
  },
});

export { expect } from '@playwright/test';

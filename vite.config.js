import { sveltekit } from '@sveltejs/kit/vite';
import { sentrySvelteKit } from '@sentry/sveltekit';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [
    sentrySvelteKit({
      sourceMapsUploadOptions: {
        org: process.env.SENTRY_ORG,
        project: process.env.SENTRY_PROJECT,
        authToken: process.env.SENTRY_AUTH_TOKEN,
        sourcemaps: {
          assets: ['./build/*/**/*'],
          ignore: ['**/build/client/**/*'],
          filesToDeleteAfterUpload: ['./build/**/*.map'],
        },
      },
    }),
    sveltekit(),
  ],
  test: {
    // Playwright lives under e2e/ and is run separately. Without this exclude,
    // Vitest tries to load those files and reports spurious "FAIL" lines.
    exclude: ['node_modules/**', 'e2e/**', '.svelte-kit/**', 'build/**'],
  },
});

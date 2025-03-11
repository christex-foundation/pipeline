import { sveltekit } from '@sveltejs/kit/vite';
import { sentrySvelteKit } from '@sentry/sveltekit';
import { defineConfig } from 'vite';
import { SENTRY_AUTH_TOKEN, SENTRY_ORG, SENTRY_PROJECT } from '$lib/server/config.js';

export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [
    sentrySvelteKit({
      sourceMapsUploadOptions: {
        org: SENTRY_ORG,
        project: SENTRY_PROJECT,
        authToken: SENTRY_AUTH_TOKEN,
        sourcemaps: {
          assets: ['./build/*/**/*'],
          ignore: ['**/build/client/**/*'],
          filesToDeleteAfterUpload: ['./build/**/*.map'],
        },
      },
    }),
    sveltekit(),
  ],
  server: { allowedHosts: true },
  //   server: {
  //     allowedHosts: [
  //       'pipeline-tau.vercel.app',
  //       'fa83-2c0f-2a80-4f3-ec10-e40b-85b9-ea82-c02c.ngrok-free.app',
  //     ],
  //   },
});

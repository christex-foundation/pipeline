// import { sveltekit } from '@sveltejs/kit/vite';
// import { sentrySvelteKit } from '@sentry/sveltekit';
// import { defineConfig } from 'vite';


// export default defineConfig({
//   build: {
//     sourcemap: true,
//   },
//   plugins: [
//     sentrySvelteKit({
//       sourceMapsUploadOptions: {
//         org: process.env.SENTRY_ORG,
//         project: process.env.SENTRY_PROJECT,
//         authToken: process.env.SENTRY_AUTH_TOKEN,
//         sourcemaps: {
//           assets: ['./build/*/**/*'],
//           ignore: ['**/build/client/**/*'],
//           filesToDeleteAfterUpload: ['./build/**/*.map'],
//         },
//       },
//     }),
//     sveltekit(),
//   ],
//   server: { allowedHosts: true },
//   //   server: {
//   //     allowedHosts: [
//   //       'pipeline-tau.vercel.app',
//   //       'fa83-2c0f-2a80-4f3-ec10-e40b-85b9-ea82-c02c.ngrok-free.app',
//   //     ],
//   //   },
// });


import { sveltekit } from '@sveltejs/kit/vite';
import { sentrySvelteKit } from '@sentry/sveltekit';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    build: {
      sourcemap: true,
    },
    plugins: [
      sentrySvelteKit({
        sourceMapsUploadOptions: {
          org: env.SENTRY_ORG,
          project: env.SENTRY_PROJECT,
          authToken: env.SENTRY_AUTH_TOKEN,
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
    // Make environment variables available to server
    define: {
      'process.env': env
    }
  };
});

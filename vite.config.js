import { sveltekit } from '@sveltejs/kit/vite';
import { sentrySvelteKit } from '@sentry/sveltekit';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit(), sentrySvelteKit({
    adapter: "vercel"
  })],
  server: { allowedHosts: true },
  //   server: {
  //     allowedHosts: [
  //       'pipeline-tau.vercel.app',
  //       'fa83-2c0f-2a80-4f3-ec10-e40b-85b9-ea82-c02c.ngrok-free.app',
  //     ],
  //   },
});

import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
    // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter: adapter(),

    prerender: {
      handleMissingId: 'warn',
      handleHttpError: 'warn',
      entries: ['/'],
    },

    csp: {
      mode: 'hash',
      directives: {
        'default-src': ['self'],
        'script-src': [
          'self',
          'unsafe-inline', // Required for Svelte in development
          'fonts.googleapis.com',
          'fonts.gstatic.com',
          '*.sentry.io', // For Sentry error reporting
        ],
        'style-src': [
          'self',
          'unsafe-inline', // Required for Tailwind and component styles
          'fonts.googleapis.com',
          'fonts.gstatic.com',
        ],
        'font-src': ['self', 'fonts.googleapis.com', 'fonts.gstatic.com'],
        'img-src': ['self', 'data:', 'blob:', '*.supabase.co', '*.githubusercontent.com'],
        'worker-src': ['self', 'blob:'],
        'connect-src': [
          'self',
          '*.supabase.co', // For Supabase API calls
          '*.sentry.io', // For Sentry error reporting
          'https://api.github.com', // For GitHub API calls,
          'https://api.iconify.design',
          'https://api.simplesvg.com',
          'https://api.unisvg.com',
        ],
        'frame-src': ['none'],
        'object-src': ['none'],
        'base-uri': ['self'],
        'form-action': ['self'],
        'upgrade-insecure-requests': true,
      },
    },
  },
};

export default config;

import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    alias: {
      '$stores/*': './src/stores/*',
    },
    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
    // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter: adapter(),

    // PERFORMANCE OPTIMIZATIONS
    serviceWorker: {
      register: true,
      files: (filename) => !/\.DS_Store/.test(filename),
    },

    prerender: {
      // Prerender static pages for better performance
      handleMissingId: 'warn',
      handleHttpError: 'warn',
      entries: ['/'], // Add specific routes you want prerendered
    },

    // SECURITY CONFIGURATIONS
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

    csrf: {
      checkOrigin: true,
    },

    // Additional security and performance headers
    embedded: false,

    // Environment-specific optimizations
    env: {
      publicPrefix: 'PUBLIC_',
    },
  },

  // COMPILER OPTIMIZATIONS
  compilerOptions: {
    // Enable runtime checks in development only
    dev: process.env.NODE_ENV === 'development',
  },
};

export default config;

/**
 * ESLint configuration enforcing the three-layer server architecture.
 *
 * Layer rules:
 *   Routes  (src/routes/)            -> may only import from services
 *   Services (src/lib/server/service/) -> orchestrate repos, no route or supabase imports
 *   Repos   (src/lib/server/repo/)    -> pure data access, no HTTP helpers or cross-repo imports
 */
export default [
  // ── Global: ignore everything except src/ ──────────────────────────
  {
    ignores: ['node_modules/**', 'build/**', '.svelte-kit/**', 'dist/**', 'package/**'],
  },

  // ── Route layer rules ─────────────────────────────────────────────
  {
    files: ['src/routes/**/*.js'],
    rules: {
      // Routes must not import repo files directly — go through services
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['$lib/server/repo/*'],
              message: 'Routes must not import repos directly. Use a service wrapper instead.',
            },
            {
              group: ['$lib/server/supabase', '$lib/server/supabase.js'],
              message:
                'Routes must not import the Supabase client directly. Use locals.supabase instead.',
            },
          ],
        },
      ],
    },
  },

  // ── Repo layer rules ──────────────────────────────────────────────
  {
    files: ['src/lib/server/repo/**/*.js'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['$lib/server/repo/*'],
              message: 'Repos must not import other repos. Keep each repo independent.',
            },
          ],
          paths: [
            {
              name: '@sveltejs/kit',
              importNames: ['json', 'redirect', 'error'],
              message:
                'Repos must not use HTTP helpers (json, redirect, error). These belong in routes.',
            },
          ],
        },
      ],
    },
  },

  // ── Service layer rules ───────────────────────────────────────────
  {
    files: ['src/lib/server/service/**/*.js'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['$lib/server/supabase', '$lib/server/supabase.js'],
              message:
                'Services must not import the Supabase client directly. Receive it as a parameter.',
            },
            {
              group: ['../../routes/*', '../../../routes/*', '$app/*'],
              message: 'Services must not import route files.',
            },
          ],
        },
      ],
    },
  },
];

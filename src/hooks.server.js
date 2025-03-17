import { createServerClient } from '@supabase/ssr';
import { redirect, init, ServerInit } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { createClient } from '@supabase/supabase-js';
import * as Sentry from '@sentry/sveltekit';

import {
  SUPABASE_SERVICE_KEY,
  supabaseUrl,
  redisHost,
  redisPort,
  redisPassword,
} from '$lib/server/config.js';

import { Worker } from 'bullmq';
import { evaluateProject } from '$lib/server/service/githubWebhookService.js';

const supabase = async ({ event, resolve }) => {
  /**
   * Creates a Supabase client specific to this server request
   * Uses public URL and anon key for client-side initialization
   */
  event.locals.supabase = createServerClient(supabaseUrl, SUPABASE_SERVICE_KEY, {
    cookies: {
      getAll: () => event.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) => {
          event.cookies.set(name, value, { ...options, path: '/' });
        });
      },
    },
  });

  /**
   * Safe session getter that validates the JWT
   */
  event.locals.safeGetSession = async () => {
    const {
      data: { session },
    } = await event.locals.supabase.auth.getSession();

    if (!session) {
      return { session: null, user: null };
    }

    const {
      data: { user },
      error,
    } = await event.locals.supabase.auth.getUser();

    if (error || !user) {
      return { session: null, user: null };
    }

    return { session, user };
  };

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range' || name === 'x-supabase-api-version';
    },
  });
};

const authGuard = async ({ event, resolve }) => {
  const { session, user } = await event.locals.safeGetSession();

  event.locals.session = session;
  event.locals.authUser = user;

  const protectedRoutes = ['/profile', '/profile/edit', '/project/create'];

  if (!session && protectedRoutes.some((route) => event.url.pathname.startsWith(route))) {
    throw redirect(303, '/sign-in');
  }

  return resolve(event);
};

const projectEvaluationWorker = new Worker(
  'projectEvaluation',
  async (job) => {
    try {
      const { github, projectId, supabaseUrl, supabaseAnonKey } = job.data;

      const supabaseConn = createClient(supabaseUrl, supabaseAnonKey);

      await evaluateProject(github, projectId, supabaseConn);

      console.log(`Evaluation completed for: ${github}`);
    } catch (error) {
      console.error('Worker encountered an error:', error);
    }
  },
  {
    connection: {
      host: redisHost,
      port: redisPort,
      password: redisPassword,
    },
  },
);

console.log('Project evaluation worker is running...');

Sentry.init({
  dsn: 'https://a25a9dd442d4a7392fbee35b9ff029f7@o4508959238651904.ingest.us.sentry.io/4508959270502400',
  tracesSampleRate: 1,
});

export const handleError = Sentry.handleErrorWithSentry();

export const handle = sequence(supabase, authGuard, Sentry.sentryHandle());

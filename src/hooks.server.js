import { createServerClient } from '@supabase/ssr';
import { redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { createClient } from '@supabase/supabase-js';

import {
  SUPABASE_SERVICE_KEY,
  supabaseUrl,
} from '$lib/server/config.js';


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

const apiProtection = async ({ event, resolve }) => {
  if (event.url.pathname.startsWith('/api/')) {
    // Define public API routes with allowed methods
    const publicRoutes = [
      { path: '/api/projects/singleProject', methods: ['GET'] },
      { path: '/api/projects', methods: ['GET'] },
      { path: '/api/signIn', methods: ['POST'] },
      { path: '/api/signUp', methods: ['POST'] },
      // { path: '/api/categories', methods: ['GET'] },
    ];

    const matchedRoute = publicRoutes.find((route) => event.url.pathname.startsWith(route.path));

    const isPublicRoute = matchedRoute !== undefined;

    // Check if the HTTP method is allowed for public routes
    if (isPublicRoute && !matchedRoute.methods.includes(event.request.method)) {
      return new Response('Method Not Allowed', { status: 405 });
    }

    // For protected routes, require authentication
    if (!isPublicRoute) {
      const { session } = await event.locals.safeGetSession();

      if (!session) {
        return new Response('Unauthorized', { status: 401 });
      }
    }

    // Apply origin check for all API routes (public or protected)
    const origin = event.request.headers.get('origin');
    const host = event.request.headers.get('host');
    const isDevelopment = process.env.NODE_ENV === 'development';

    if (origin) {
      const expectedOrigin = `${event.url.protocol}//${host}`;
      const isValidOrigin = origin === expectedOrigin;

      if (!isValidOrigin && !isDevelopment) {
        return new Response('Forbidden', { status: 403 });
      }
    }
  }

  return resolve(event);
};


export const handle = sequence(supabase, authGuard);

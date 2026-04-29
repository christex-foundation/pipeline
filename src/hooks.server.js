import { redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

import { createSessionClient, getSessionAndUser } from '$lib/server/providers/authProvider.js';
import { isPublicApiRoute, skipsOriginCheck } from '$lib/server/security/apiPublicRoutes.js';

const supabase = async ({ event, resolve }) => {
  /**
   * Creates a Supabase client specific to this server request
   * via the auth provider abstraction layer.
   */
  event.locals.supabase = createSessionClient({
    getAll: () => event.cookies.getAll(),
    setAll: (cookiesToSet) => {
      cookiesToSet.forEach(({ name, value, options }) => {
        event.cookies.set(name, value, { ...options, path: '/' });
      });
    },
  });

  /**
   * Safe session getter that validates the JWT
   */
  event.locals.safeGetSession = async () => {
    return getSessionAndUser(event.locals.supabase);
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

/**
 * API gate: rejects unauthenticated requests to non-public endpoints, and
 * blocks cross-origin requests in production. The public-route table lives
 * in `$lib/server/security/apiPublicRoutes.js` so it can be unit-tested.
 */
const apiProtection = async ({ event, resolve }) => {
  if (!event.url.pathname.startsWith('/api/')) return resolve(event);

  const pathname = event.url.pathname;
  const method = event.request.method;

  if (!isPublicApiRoute(pathname, method)) {
    if (!event.locals.session) {
      return new Response('Unauthorized', { status: 401 });
    }
  }

  if (!skipsOriginCheck(pathname)) {
    const origin = event.request.headers.get('origin');
    const host = event.request.headers.get('host');
    const isDevelopment = process.env.NODE_ENV === 'development';

    if (origin) {
      const expectedOrigin = `${event.url.protocol}//${host}`;
      if (origin !== expectedOrigin && !isDevelopment) {
        return new Response('Forbidden', { status: 403 });
      }
    }
  }

  return resolve(event);
};

export const handle = sequence(supabase, authGuard, apiProtection);

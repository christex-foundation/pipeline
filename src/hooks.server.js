// import { redirect } from '@sveltejs/kit';
// import { getUser } from '$lib/server/service/authUserService.js';
// import { createServerClient } from '@supabase/ssr';
// import { SUPABASE_SERVICE_KEY, supabaseUrl } from '$lib/server/config.js';

// const PROTECTED_ROUTES = ['/profile', '/profile/edit', '/project/create'];

// export async function handle({ event, resolve }) {
//   event.locals.supabase = createServerClient(supabaseUrl, SUPABASE_SERVICE_KEY, {
//     cookies: {
//       getAll: () => event.cookies.getAll(),
//       /**
//        * SvelteKit's cookies API requires `path` to be explicitly set in
//        * the cookie options. Setting `path` to `/` replicates previous/
//        * standard behavior.
//        */
//       setAll: (cookiesToSet) => {
//         cookiesToSet.forEach(({ name, value, options }) => {
//           event.cookies.set(name, value, { ...options, path: '/' });
//         });
//       },
//     },
//   });

//   const cook = await event.locals.supabase.auth.getUser();
//   console.log('cook', cook);

//   const cookies = event.request.headers.get('cookie');

//   console.log('cookies', cookies);
//   const accessToken = cookies
//     ?.split(';')
//     .find((cookie) => cookie.trim().startsWith('access_token='))
//     ?.split('=')[1];

//   const path = event.url.pathname;
//   const user = await getUser(accessToken);

//   event.locals.accessToken = accessToken;
//   event.locals.authUser = user;

//   if (PROTECTED_ROUTES.includes(path) && !accessToken) {
//     redirect(307, '/sign-in');
//   }

//   return resolve(event);
// }

import { createServerClient } from '@supabase/ssr';
import { redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

import { SUPABASE_SERVICE_KEY, supabaseUrl } from '$lib/server/config.js';

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
  const authRoutes = ['/sign-in'];

  if (!session && protectedRoutes.some((route) => event.url.pathname.startsWith(route))) {
    throw redirect(303, '/sign-in');
  }

  return resolve(event);
};

export const handle = sequence(supabase, authGuard);

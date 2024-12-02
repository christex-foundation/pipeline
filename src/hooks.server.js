import { redirect } from '@sveltejs/kit';
import { getUser } from '$lib/server/service/authUserService.js';
import { createServerClient } from '@supabase/ssr';
import { SUPABASE_SERVICE_KEY, supabaseUrl } from '$lib/server/config.js';

const PROTECTED_ROUTES = ['/profile', '/profile/edit', '/project/create'];

export async function handle({ event, resolve }) {
  event.locals.supabase = createServerClient(supabaseUrl, SUPABASE_SERVICE_KEY, {
    cookies: {
      getAll: () => event.cookies.getAll(),
      /**
       * SvelteKit's cookies API requires `path` to be explicitly set in
       * the cookie options. Setting `path` to `/` replicates previous/
       * standard behavior.
       */
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) => {
          event.cookies.set(name, value, { ...options, path: '/' });
        });
      },
    },
  });

  const cookies = event.request.headers.get('cookie');
  const accessToken = cookies
    ?.split(';')
    .find((cookie) => cookie.trim().startsWith('access_token='))
    ?.split('=')[1];

  const path = event.url.pathname;
  const user = await getUser(accessToken);

  event.locals.accessToken = accessToken;
  event.locals.authUser = user;

  if (PROTECTED_ROUTES.includes(path) && !accessToken) {
    redirect(307, '/sign-in');
  }

  return resolve(event);
}

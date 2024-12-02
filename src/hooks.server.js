import { redirect } from '@sveltejs/kit';
import { getUser } from '$lib/server/service/authUserService.js';

const PROTECTED_ROUTES = ['/profile', '/profile/edit', '/project/create'];

export async function handle({ event, resolve }) {
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

import { redirect } from '@sveltejs/kit';

const PROTECTED_ROUTES = ['/profile', '/project/create', '']; // Add your protected routes here

export async function handle({ event, resolve }) {
  const cookies = event.request.headers.get('cookie');
  const accessToken = cookies
    ?.split(';')
    .find((cookie) => cookie.trim().startsWith('access_token='))
    ?.split('=')[1];

  const path = event.url.pathname;

  if (PROTECTED_ROUTES.includes(path) && !accessToken) {
    throw redirect(302, '/sign-in');
  }

  return resolve(event);
}

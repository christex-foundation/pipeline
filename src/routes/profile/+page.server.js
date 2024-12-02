import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').Actions} */
export const actions = {
  logout: ({ cookies }) => {
    for (const token of ['access_token', 'refresh_token']) {
      cookies.set(token, '', {
        path: '/',
        expires: new Date(0),
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });
    }

    redirect(307, '/sign-in');
  },
};

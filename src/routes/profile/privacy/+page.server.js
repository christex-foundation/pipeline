import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
  const user = locals.authUser;

  if (!user) {
    redirect(307, '/sign-in');
  }

  return {
    user: {
      id: user.id,
      email: user.email
    }
  };
};

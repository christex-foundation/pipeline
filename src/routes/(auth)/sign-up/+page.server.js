import { fail, redirect } from '@sveltejs/kit';
import { signupSchema } from '$lib/server/validator/authSchema.js';

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request, fetch }) => {
    const form = Object.fromEntries(await request.formData());

    const { data, error: validationError, success } = signupSchema.safeParse(form);

    if (!success) {
      const errors = validationError.flatten().fieldErrors;
      const firstError = Object.values(errors).flat().at(0);
      return fail(400, { error: firstError });
    }

    try {
      

      const response = await fetch('/api/signUp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        return fail(400, { error: result.message || 'Failed to sign in' });
      }

      redirect(307, '/profile');
    } catch (error) {
      console.log(error)
      if (error.status === 307) {
        redirect(307, '/profile');
      }
      return fail(500, { error: error.message || 'Something went wrong' });
    }
  },
};

//@ts-check

import { fail, redirect } from '@sveltejs/kit';
import { loginSchema } from '$lib/server/validator/authSchema.js';

/** @type {import('./$types.js').Actions} */
export const actions = {
  default: async ({ request, fetch }) => {
    const form = Object.fromEntries(await request.formData());
    const { data, error: validationError, success } = loginSchema.safeParse(form);

    if (!success) {
      const errors = validationError.flatten().fieldErrors;
      const firstError = Object.values(errors).flat().at(0);
      return fail(400, { error: firstError, toastMessage: 'Validation failed' });
    }

    try {
      const response = await fetch('/api/signIn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error(`Sign-in error: ${result.error}`);
        return fail(400, { 
          error: result.error,
          toastMessage: result.toastMessage || `Error: Invalid Login Credentials`,
          toastType: 'error'
        });
      }

      return { 
        toastMessage: result.toastMessage || 'Sign-in successful',
        toastType: 'success'
      };
      
    } catch (error) {
      console.log(`Server error during sign-in: ${error.message}`);
      if (error.status === 307) {
        throw redirect(307, '/profile');
      }
      return fail(500, { 
        error: error.message || 'Something went wrong',
        toastMessage: 'Server error',
        toastType: 'error'
      });
    }
  },
};
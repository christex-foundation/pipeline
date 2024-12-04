//@ts-check

import { fail, redirect } from '@sveltejs/kit';
import { signupSchema } from '$lib/server/validator/authSchema.js';

/** @type {import('./$types.js').Actions} */
export const actions = {
  default: async ({ request, fetch }) => {
    const form = Object.fromEntries(await request.formData());
    const { data, error: validationError, success } = signupSchema.safeParse(form);

    if (!success) {
      const errors = validationError.flatten().fieldErrors;
      const firstError = Object.values(errors).flat().at(0);
      return fail(400, { 
        error: firstError, 
        toastMessage: 'Validation failed',
        toastType: 'error'
      });
    }

    try {
      const response = await fetch('/api/signUp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error(`Registration error: ${result.error}`);
        return fail(400, { 
          error: result.error,
          toastMessage: result.toastMessage || 'Registration failed',
          toastType: 'error'
        });
      }

      return { 
        toastMessage: result.toastMessage || 'Registration successful',
        toastType: 'success'
      };
      
    } catch (error) {
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
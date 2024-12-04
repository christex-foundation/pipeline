import { createProjectSchema } from '$lib/server/validator/projectSchema.js';
import { error, fail, redirect } from '@sveltejs/kit';

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request, fetch }) => {
    const { image, banner_image, ...form } = Object.fromEntries(await request.formData());
    const { data, error: validationError, success } = createProjectSchema.safeParse(form);

    if (!success) {
      const errors = validationError.flatten().fieldErrors;
      const firstError = Object.values(errors).flat().at(0);
      fail(400, { error: firstError });
    }

    try {
      const response = await fetch(`/api/projects/store`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        fail(400, 'Failed to save project');
      }
    } catch (_) {
      fail(500, 'Failed to save project. Please try again later.');
    }

    // TODO: redirect to the new project instead of profile
    redirect(307, '/profile');
  },
};

async function handleImageUpload(file) {
  // Upload the image to Supabase storage
  const response = await fetch('/api/file-upload', {
    method: 'POST',
    body: file,
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.message || 'Failed to upload image');
  }

  return response.json().then((data) => {
    return data.url;
  });
}

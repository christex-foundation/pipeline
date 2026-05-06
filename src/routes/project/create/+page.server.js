import { allCategories } from '$lib/server/service/categoryService.js';
import { createProjectSchema } from '$lib/server/validator/projectSchema.js';
import { uploadImageAndReturnUrl } from '$lib/server/service/imageUploadService.js';
import { error, fail, json, redirect } from '@sveltejs/kit';

export async function load({ locals }) {
  try {
    return {
      categories: await allCategories(locals.supabase),
    };
  } catch (error) {
    console.error('Failed to load categories for project creation:', error);

    return {
      categories: [],
    };
  }
}

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request, locals, fetch }) => {
    let supabase = locals.supabase;
    const formData = await request.formData();
    const tags = formData.get('tags');
    const bannerImage = formData.get('banner_image');
    const image = formData.get('image');
    const form = Object.fromEntries(
      [...formData.entries()].filter(
        ([key]) => !['tags', 'banner_image', 'image', 'matchedDPGs'].includes(key),
      ),
    );

    const {
      data: validatedData,
      error: validationError,
      success,
    } = createProjectSchema.safeParse(form);

    if (!success) {
      const errors = validationError.flatten().fieldErrors;
      const firstError = Object.values(errors).flat().at(0);
      return fail(400, { error: firstError });
    }

    let parsedTags;
    try {
      parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
    } catch {
      parsedTags = [];
    }
    if (!Array.isArray(parsedTags) || parsedTags.length === 0) {
      return fail(400, { error: 'Please pick at least one SDG tag' });
    }

    /** @type {Record<string, any>} */
    const data = {
      ...validatedData,
      tags,
    };

    if (bannerImage instanceof File && bannerImage.size > 0) {
      data.banner_image = await uploadImageAndReturnUrl(bannerImage, supabase);
    }

    if (image instanceof File && image.size > 0) {
      data.image = await uploadImageAndReturnUrl(image, supabase);
    }

    try {
      const response = await fetch(`/api/projects/store`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data }),
      });

      const responseBody = await response.json(); // Parse response body
      const projectId = responseBody?.response?.projectId;

      if (!response.ok) {
        return fail(400, { error: 'Failed to save project' });
      }

      return {
        type: 'success',
        redirectTo: `/project/${projectId}`,
      };
    } catch (_) {
      return fail(500, { error: 'Failed to save project. Please try again later.' });
    }
  },
};

async function handleImageUpload(file) {
  const timestamp = Date.now();
  const originalFileName = file.name;
  const fileExtension = originalFileName.split('.').pop();
  const fileNameWithoutExtension =
    originalFileName.substring(0, originalFileName.lastIndexOf('.')) || originalFileName;
  const newFileName = `${fileNameWithoutExtension}-${timestamp}.${fileExtension}`;

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

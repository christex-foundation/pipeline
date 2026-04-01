import { createProjectSchema } from '$lib/server/validator/projectSchema.js';
import { uploadImageAndReturnUrl } from '$lib/server/service/imageUploadService.js';
import { error, fail, json, redirect } from '@sveltejs/kit';

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request, locals, fetch }) => {
    let supabase = locals.supabase;
    const { tags, banner_image, image, matchedDPGs, ...form } = Object.fromEntries(
      await request.formData(),
    );

    const { data, error: validationError, success } = createProjectSchema.safeParse(form);

    if (!success) {
      const errors = validationError.flatten().fieldErrors;
      const firstError = Object.values(errors).flat().at(0);
      return fail(400, { error: firstError });
    }

    const parsedMatchedDPGs = matchedDPGs ? JSON.parse(matchedDPGs) : [];

    data.tags = tags;
    data.matchedDPGs = parsedMatchedDPGs;

    if (banner_image?.name) {
      data.banner_image = await uploadImageAndReturnUrl(banner_image, supabase);
    }

    if (image?.name) {
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
        return fail(400, 'Failed to save project');
      }

      return {
        type: 'success',
        redirectTo: `/project/${projectId}`,
      };
    } catch (_) {
      return fail(500, 'Failed to save project. Please try again later.');
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

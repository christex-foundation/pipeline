import { redirect, fail } from '@sveltejs/kit';
import { createProjectSchema } from '$lib/server/validator/projectSchema.js';
import { uploadImageAndReturnUrl, removeImage } from '$lib/server/service/imageUploadService.js';

export const actions = {
  default: async ({ request, locals, params, fetch }) => {
    let id = params.id;

    const { tags, old_image, old_banner, banner_image, image, ...form } = Object.fromEntries(
      await request.formData(),
    );

    const { data, error: validationError, success } = createProjectSchema.safeParse(form);

    if (!success) {
      const errors = validationError.flatten().fieldErrors;
      const firstError = Object.values(errors).flat().at(0);
      console.log('Edit Project:', firstError);
      return fail(400, { error: firstError });
    }

    data.tags = tags;

    if (banner_image?.size > 0) {
      if (old_banner) {
        await removeImage(old_banner, locals.supabase);
      }
      data.banner_image = await uploadImageAndReturnUrl(banner_image, locals.supabase);
    } else {
      data.banner_image = old_banner;
    }

    if (image?.size > 0) {
      if (old_image) {
        await removeImage(old_image, locals.supabase);
      }
      data.image = await uploadImageAndReturnUrl(image, locals.supabase);
    } else {
      data.image = old_image;
    }

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data }),
      });

      if (!response.ok) {
        return fail(400, { error: 'Failed to save project' });
      }
    } catch (_) {
      return fail(500, { error: 'Failed to save project. Please try again later.' });
    }

    redirect(307, `/project/${id}`);
  },
};

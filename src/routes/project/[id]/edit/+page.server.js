import { redirect, fail } from '@sveltejs/kit';
import { createProjectSchema } from '$lib/server/validator/projectSchema.js';
import { uploadImageAndReturnUrl, removeImage } from '$lib/server/service/imageUploadService.js';

export const actions = {
  default: async ({ request, locals, params, fetch }) => {
    let id = params.id;

    const formData = await request.formData();
    const tags = formData.get('tags');
    const oldImage = formData.get('old_image');
    const oldBanner = formData.get('old_banner');
    const bannerImage = formData.get('banner_image');
    const image = formData.get('image');
    const form = Object.fromEntries(
      [...formData.entries()].filter(
        ([key]) => !['tags', 'old_image', 'old_banner', 'banner_image', 'image'].includes(key),
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
      console.log('Edit Project:', firstError);
      return fail(400, { error: firstError });
    }

    /** @type {Record<string, any>} */
    const data = {
      ...validatedData,
      tags,
    };

    const supabase = locals.supabase;

    if (bannerImage instanceof File && bannerImage.size > 0) {
      if (typeof oldBanner === 'string' && oldBanner) {
        await removeImage(oldBanner, supabase);
      }
      data.banner_image = await uploadImageAndReturnUrl(bannerImage, supabase);
    } else {
      data.banner_image = typeof oldBanner === 'string' ? oldBanner : '';
    }

    if (image instanceof File && image.size > 0) {
      if (typeof oldImage === 'string' && oldImage) {
        await removeImage(oldImage, supabase);
      }
      data.image = await uploadImageAndReturnUrl(image, supabase);
    } else {
      data.image = typeof oldImage === 'string' ? oldImage : '';
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

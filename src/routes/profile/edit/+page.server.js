import { redirect, fail } from '@sveltejs/kit';
import { uploadImageAndReturnUrl, removeImage } from '$lib/server/service/imageUploadService.js';
import { profileSchema } from '$lib/server/validator/profileScheme.js';

// export const actions = {
//   updateProfile: async ({ request, locals, fetch }) => {
//     let supabase = locals.supabase;

//     const { old_image, old_banner, banner, image, ...form } = Object.fromEntries(
//       await request.formData(),
//     );

//     const { data, error: validationError, success } = profileSchema.safeParse(form);

//     if (!success) {
//       const errors = validationError.flatten().fieldErrors;
//       const firstError = Object.values(errors).flat().at(0);
//       return fail(400, { error: firstError });
//     }

//     if (banner?.size > 0) {
//       if (old_banner) {
//         await removeImage(old_banner, supabase);
//       }
//       data.banner = await uploadImageAndReturnUrl(banner, supabase);
//     } else {
//       data.banner = old_banner;
//     }

//     if (image?.size > 0) {
//       if (old_image) {
//         await removeImage(old_image, supabase);
//       }
//       data.image = await uploadImageAndReturnUrl(image, supabase);
//     } else {
//       data.image = old_image;
//     }

//     try {
//       const response = await fetch('/api/profile/update', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//       });
//       if (!response.ok) {
//         return fail(400, { error: 'Failed to save project' });
//       }
//     } catch (_) {
//       return fail(500, { error: 'Failed to save project. Please try again later.' });
//     }

//     redirect(307, '/profile');
//   },
// };

export const actions = {
  updateProfile: async ({ request, locals, fetch }) => {
    let supabase = locals.supabase;

    const formData = await request.formData();
    const { old_image, old_banner, banner, image, ...form } = Object.fromEntries(formData);

    // DEBUG: Log what's being received
    console.log('Form data received:', form);
    console.log('Social media fields:', {
      discord: form.discord,
      twitter: form.twitter,
      web: form.web,
      linkedin: form.linkedin,
      others: form.others,
      github: form.github,
    });

    const { data, error: validationError, success } = profileSchema.safeParse(form);

    if (!success) {
      console.log('Validation errors:', validationError.flatten().fieldErrors);
      const errors = validationError.flatten().fieldErrors;
      const firstError = Object.values(errors).flat().at(0);
      return fail(400, { error: firstError });
    }

    // DEBUG: Log what passed validation
    console.log('Data after validation:', data);

    if (banner?.size > 0) {
      if (old_banner) {
        await removeImage(old_banner, supabase);
      }
      data.banner = await uploadImageAndReturnUrl(banner, supabase);
    } else {
      data.banner = old_banner;
    }

    if (image?.size > 0) {
      if (old_image) {
        await removeImage(old_image, supabase);
      }
      data.image = await uploadImageAndReturnUrl(image, supabase);
    } else {
      data.image = old_image;
    }

    try {
      console.log('Sending to API:', data); // DEBUG: Final data being sent

      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log('API Error:', errorText);
        return fail(400, { error: 'Failed to save project' });
      }
    } catch (error) {
      console.log('Fetch error:', error);
      return fail(500, { error: 'Failed to save project. Please try again later.' });
    }

    redirect(307, '/profile');
  },
};

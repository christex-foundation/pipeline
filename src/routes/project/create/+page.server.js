import { error, redirect } from '@sveltejs/kit';
import { projectStore } from '$stores/projectStore.js';

export const actions = {
  createProject: async ({ request }) => {
    const formData = await request.formData();

    const projectData = JSON.parse(formData.get('projectData'));

    try {
      projectStore.set(projectData);

      const response = await fetch(`/api/projects/store`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Failed to save project');
      }

      // Redirect to profile after successful save
      throw redirect(303, '/profile');
    } catch (error) {
      throw new Error(500, 'Failed to save project. Please try again later.');
    }
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

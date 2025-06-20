export const actions = {
  addUpdate: async ({ request, params, fetch }) => {
    const form = Object.fromEntries(await request.formData());

    const { id } = params;

    const response = await fetch(`/api/projects/singleProject/${id}/projectUpdates/store`, {
      method: 'POST',
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return response.status;
  },

  bookmark: async ({ request, params, fetch }) => {
    const { id } = params;

    const response = await fetch(`/api/projects/singleProject/${id}/bookmark`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return response.json();
  },
};

import { describe, it, expect, vi } from 'vitest';
import { actions } from './+page.server.js';

describe('create project action', () => {
  it('should create a project and return a redirectTo URL', async () => {
    // Arrange: mock form data as a Map (iterable)
    const fields = {
      title: 'Test Project',
      bio: 'A project for testing',
      details: 'This is a detailed description for testing.',
      country: 'Andorra',
      tags: JSON.stringify([{ id: '1', title: 'No Poverty' }]),
      email: 'test@example.com',
      github: 'https://github.com/christex-foundation/pipeline',
      funding_goal: '5000',
      matchedDPGs: '[]',
      // banner_image and image can be omitted or mocked as needed
    };

    const request = {
      formData: async () => new Map(Object.entries(fields)),
    };

    // Mock locals.supabase (not used in this test, but required by signature)
    const locals = { supabase: {} };

    // Mock fetch for /api/projects/store
    const fakeProjectId = 'abc123';
    const fetch = vi.fn(async (url, opts) => {
      if (url === '/api/projects/store') {
        return {
          ok: true,
          json: async () => ({
            response: { projectId: fakeProjectId },
          }),
        };
      }
      throw new Error('Unexpected fetch');
    });

    // Act
    const result = await actions.default({ request, locals, fetch });
    // Assert
    expect(result.type).toBe('success');
    expect(result.redirectTo).toBe(`/project/${fakeProjectId}`);
  });

  it('simplified: should create a project and return a redirectTo URL', async () => {
    // Arrange: mock form data as a Map (iterable)
    const fields = {
      title: 'Test Project',
      details: 'This is a detailed description for testing.',
      country: 'Andorra',
      tags: JSON.stringify([{ id: '1', title: 'No Poverty' }]),
      github: 'https://github.com/christex-foundation/pipeline',
      funding_goal: '5000',
    };

    const request = {
      formData: async () => new Map(Object.entries(fields)),
    };

    // Mock locals.supabase (not used in this test, but required by signature)
    const locals = { supabase: {} };

    // Mock fetch for /api/projects/store
    const fakeProjectId = 'abc123';
    const fetch = vi.fn(async (url, opts) => {
      if (url === '/api/projects/store') {
        return {
          ok: true,
          json: async () => ({
            response: { projectId: fakeProjectId },
          }),
        };
      }
      throw new Error('Unexpected fetch');
    });

    // Act
    const result = await actions.default({ request, locals, fetch });

    // Assert
    expect(result.type).toBe('success');
    expect(result.redirectTo).toBe(`/project/${fakeProjectId}`);
  });

  it('should fail when required fields are missing', async () => {
    // Arrange: missing 'title' field
    const fields = {
      // title: 'Test Project', // Intentionally omitted
      bio: 'A project for testing',
      details: 'This is a detailed description for testing.',
      country: 'Andorra',
      tags: JSON.stringify([{ id: '1', title: 'No Poverty' }]),
      email: 'test@example.com',
      github: 'https://github.com/christex-foundation/pipeline',
      funding_goal: '5000',
      matchedDPGs: '[]',
    };

    const request = {
      formData: async () => new Map(Object.entries(fields)),
    };

    const locals = { supabase: {} };
    const fetch = vi.fn();

    // Act
    const result = await actions.default({ request, locals, fetch });
    // SvelteKit's fail() returns an object with a status and error property

    expect(result.status).toBe(400);
    expect(result.data?.error || result.error).toBeTruthy();
  });
});

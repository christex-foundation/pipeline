export const mockUser = {
  id: 'test-user-id-123',
  email: 'testuser@example.com',
  display_name: 'Test User',
  bio: 'A test user for E2E testing',
  country: 'US',
  interests: ['open-source', 'education'],
  skills: ['javascript', 'svelte'],
  image_url: null,
  points: 100,
  banner_url: null,
  github: 'https://github.com/testuser',
  discord: null,
  twitter: null,
  website: 'https://testuser.dev',
  linkedin: null,
  others: null,
};

export const mockProject = {
  id: 'project-id-1',
  title: 'Test DPG Project',
  bio: 'A digital public good for testing purposes',
  details: 'This project demonstrates a full DPG compliance workflow.',
  github_repo: 'https://github.com/testorg/test-project',
  website: 'https://test-project.org',
  funding_goal: 50000,
  current_funding: 12500,
  country: 'KE',
  status: 'active',
  created_at: '2025-01-15T10:00:00Z',
  updated_at: '2025-03-01T10:00:00Z',
  dpgCount: 5,
  user_id: 'other-user-id',
  categories: [
    { id: 'cat-1', name: 'Quality Education' },
    { id: 'cat-2', name: 'Clean Water' },
  ],
  tags: [
    { image: 'https://example.com/sdg-4.png' },
    { image: 'https://example.com/sdg-6.png' },
  ],
  members: [],
};

export const mockProjects = [
  mockProject,
  {
    id: 'project-id-2',
    title: 'Open Health Tracker',
    bio: 'Open-source health data platform',
    details: 'Track health metrics for communities.',
    github_repo: 'https://github.com/testorg/health-tracker',
    website: null,
    funding_goal: 30000,
    current_funding: 8000,
    country: 'NG',
    status: 'active',
    created_at: '2025-02-10T10:00:00Z',
    updated_at: '2025-03-10T10:00:00Z',
    dpgCount: 3,
    user_id: 'other-user-id-2',
    categories: [{ id: 'cat-3', name: 'Good Health' }],
    members: [],
  },
  {
    id: 'project-id-3',
    title: 'EduAccess Platform',
    bio: 'Accessible education for all',
    details: 'Platform providing free educational resources.',
    github_repo: 'https://github.com/testorg/edu-access',
    website: 'https://eduaccess.org',
    funding_goal: 20000,
    current_funding: 20000,
    country: 'GH',
    status: 'active',
    created_at: '2025-03-01T10:00:00Z',
    updated_at: '2025-03-15T10:00:00Z',
    dpgCount: 7,
    user_id: 'other-user-id-3',
    categories: [{ id: 'cat-1', name: 'Quality Education' }],
    members: [],
  },
];

export const mockTopProjects = [mockProjects[2], mockProjects[0]];

export const mockCategories = [
  { id: 'cat-1', name: 'Quality Education' },
  { id: 'cat-2', name: 'Clean Water' },
  { id: 'cat-3', name: 'Good Health' },
  { id: 'cat-4', name: 'No Poverty' },
];

export const mockOwnedProject = {
  ...mockProject,
  id: 'project-id-owned',
  title: 'My Own Project',
  user_id: mockUser.id,
};

export const mockCreateProjectResponse = {
  response: { projectId: 'new-project-123' },
};

export const mockBookmarkResponse = {
  message: 'Bookmark toggled successfully',
  isBookmarked: true,
};

export const mockProfileData = {
  user: mockUser,
  projects: [mockProject],
  contributedProjects: [],
  following: [],
};

export const mockLayoutData = {
  isAuthenticated: false,
  user: null,
  error: null,
};

export const mockAuthenticatedLayoutData = {
  isAuthenticated: true,
  user: mockUser,
  error: null,
};

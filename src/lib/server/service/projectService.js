import {
  getProject,
  getProjects,
  createProject,
  updateDetails,
  getProjectsByUserId,
  getProjectsByIds,
} from '$lib/server/repo/projectRepo';
import { createTeamMember, teamMembers } from '$lib/server/repo/memberRepo';
import {
  assignCategory,
  getCategories,
  getProjectCategories,
  getProjectsByCategoryId,
  addTags,
  getProjectExistingCategories,
  removeTags,
} from '$lib/server/repo/categoryRepo';
import { getDpgStatuses, getAllDpgStatuses, getProjectDpgStatuses } from '../repo/dpgStatusRepo.js';
import { getMultipleProfiles } from '$lib/server/repo/userProfileRepo.js';
import { getExistingBookmarksByUserId } from '$lib/server/repo/bookmarkRepo.js';
import { mapProjectsWithTagsAndStatus } from './helpers/projectHelpers.js';

export async function getProjectsWithDetails(term, page, limit) {
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  const projects = await getProjects(term, start, end);

  if (projects.length === 0) {
    return [];
  }

  const projectIds = projects.map((project) => project.id);

  //additional data
  const projectCategories = await getProjectCategories(projectIds);

  const categories = await getCategories(projectCategories.map((pc) => pc.category_id));
  const dpgStatuses = await getDpgStatuses(projectIds);

  return mapProjectsWithTagsAndStatus(projects, projectCategories, categories, dpgStatuses);
}

export async function getUserProjects(userId, page, limit) {
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  const projects = await getProjectsByUserId(userId, start, end);

  if (projects.length === 0) {
    return [];
  }

  const projectIds = projects.map((project) => project.id);

  //additional data
  const projectCategories = await getProjectCategories(projectIds);
  const categoriesIds = await getCategories(projectCategories.map((pc) => pc.category_id));
  const dpgStatuses = await getDpgStatuses(projectIds);

  return mapProjectsWithTagsAndStatus(projects, projectCategories, categoriesIds, dpgStatuses);
}

export async function getProjectsByCategory(categoryId, page, limit) {
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  const categoryProjects = await getProjectsByCategoryId(categoryId, start, end);

  const projectIds = categoryProjects.map((cp) => cp.project_id);

  if (projectIds.length === 0) {
    return [];
  }

  const projects = await getProjectsByIds(projectIds);

  const projectCategories = await getProjectCategories(projectIds);

  const categories = await getCategories(projectCategories.map((pc) => pc.category_id));
  const dpgStatuses = await getDpgStatuses(projectIds);

  return mapProjectsWithTagsAndStatus(projects, projectCategories, categories, dpgStatuses);
}

export async function getProjectById(id) {
  const project = await getProject(id);

  if (!project) {
    return null;
  }

  const projectCategories = await getProjectCategories([project.id]);
  const categoryIds = projectCategories.map((pc) => pc.category_id);
  const categories = await getCategories(categoryIds);

  // Fetch all DPG statuses and the project's specific statuses
  const [allDpgStatuses, projectDpgStatuses] = await Promise.all([
    getAllDpgStatuses(),
    getProjectDpgStatuses(project.id),
  ]);

  const dpgStatusMap = projectDpgStatuses.reduce((acc, status) => {
    acc[status.status_id] = true;
    return acc;
  }, {});

  const dpgStatuses = allDpgStatuses.map((status) => ({
    name: status.name,
    status: !!dpgStatusMap[status.id], // Set to true if found, otherwise false
  }));

  return {
    ...project,
    tags: categories,
    dpgCount: projectDpgStatuses.length,
    dpgStatuses,
  };
}

export async function getTeamMembers(projectId) {
  const members = await teamMembers(projectId);

  const userIds = members.map((member) => member.user_id);

  const profiles = await getMultipleProfiles(userIds);

  const profilesByUserId = profiles.reduce((acc, profile) => {
    acc[profile.user_id] = profile;
    return acc;
  }, {});

  // Attach the corresponding profile to each member
  const membersWithProfiles = members.map((member) => ({
    ...member,
    userProfile: profilesByUserId[member.user_id] || null,
  }));

  return membersWithProfiles;
}

export async function getUserBookmarkedProjects(userId, page, limit) {
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  const exisitingBookmarks = await getExistingBookmarksByUserId(userId, start, end);

  if (exisitingBookmarks.length === 0) {
    return [];
  }

  const projectIds = exisitingBookmarks.map((project) => project.project_id);

  const projects = await getProjectsByIds(projectIds);

  //additional data
  const projectCategories = await getProjectCategories(projectIds);
  const categories = await getCategories(projectCategories.map((pc) => pc.category_id));
  const dpgStatuses = await getDpgStatuses(projectIds);

  return mapProjectsWithTagsAndStatus(projects, projectCategories, categories, dpgStatuses);
}

export async function storeProject(user, projectData) {
  //const validatedData = projectSchema.parse(projectData);

  const { tags, ...projectFields } = projectData;

  const project = await createProject({ ...projectFields, user_id: user.id });

  const teamMember = await createTeamMember(user.id, project.id);

  for (const tag of tags) {
    await assignCategory({ project_id: project.id, category_id: tag.id });
  }

  return { project, teamMember };
}

export async function updateProject(userId, projectId, projectData, tags) {
  await updateDetails(projectId, { ...projectData, user_id: userId });

  const existingTags = await getProjectExistingCategories(projectId);
  const existingTagIds = existingTags.map((tag) => tag.category_id);
  const newTagIds = tags.map((tag) => tag.id);

  // Remove tags that are no longer in the new list
  const tagsToRemove = existingTagIds.filter((tagId) => !newTagIds.includes(tagId));
  const tagsToAdd = newTagIds.filter((tagId) => !existingTagIds.includes(tagId));

  // Remove old tags
  if (tagsToRemove.length > 0) {
    await removeTags(projectId, tagsToRemove);
  }

  // Add new tags
  if (tagsToAdd.length > 0) {
    await addTags(projectId, tagsToAdd);
  }

  return { success: true };
}

export async function deleteProject(id) {}

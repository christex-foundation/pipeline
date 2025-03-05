//@ts-check
import {
  getProject,
  getProjects,
  createProject,
  updateDetails,
  getProjectsByUserId,
  getProjectsByIds,
  getProjectByGithub,
} from '$lib/server/repo/projectRepo.js';
import { createTeamMember, teamMembers } from '$lib/server/repo/memberRepo.js';
import {
  assignCategory,
  getCategories,
  getProjectCategories,
  getProjectsByCategoryId,
  addTags,
  getProjectExistingCategories,
  removeTags,
} from '$lib/server/repo/categoryRepo.js';
import { getDpgStatuses, getAllDpgStatuses, getProjectDpgStatuses } from '../repo/dpgStatusRepo.js';
import { getMultipleProfiles } from '$lib/server/repo/userProfileRepo.js';
import { getExistingBookmarksByUserId } from '$lib/server/repo/bookmarkRepo.js';
import { mapProjectsWithTagsAndStatus } from './helpers/projectHelpers.js';

export async function getProjectsWithDetails(term, page, limit, supabase) {
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  const projects = await getProjects(term, start, end, supabase);

  if (projects.length === 0) {
    return [];
  }

  const projectIds = projects.map((project) => project.id);

  //additional data
  const projectCategories = await getProjectCategories(projectIds, supabase);

  const categories = await getCategories(
    projectCategories.map((pc) => pc.category_id),
    supabase,
  );
  const dpgStatuses = await getDpgStatuses(projectIds, supabase);

  return mapProjectsWithTagsAndStatus(projects, projectCategories, categories, dpgStatuses);
}

export async function getUserProjects(userId, page, limit, supabase) {
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  const projects = await getProjectsByUserId(userId, start, end, supabase);

  if (projects.length === 0) {
    return [];
  }

  const projectIds = projects.map((project) => project.id);

  //additional data
  const projectCategories = await getProjectCategories(projectIds, supabase);

  const categoriesIds = await getCategories(
    projectCategories.map((pc) => pc.category_id),
    supabase,
  );
  const dpgStatuses = await getDpgStatuses(projectIds, supabase);

  return mapProjectsWithTagsAndStatus(projects, projectCategories, categoriesIds, dpgStatuses);
}

export async function getProjectsByCategory(categoryId, page, limit, supabase) {
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  const categoryProjects = await getProjectsByCategoryId(categoryId, start, end, supabase);

  const projectIds = categoryProjects.map((cp) => cp.project_id);

  if (projectIds.length === 0) {
    return [];
  }

  const projects = await getProjectsByIds(projectIds, supabase);

  const projectCategories = await getProjectCategories(projectIds, supabase);

  const categories = await getCategories(
    projectCategories.map((pc) => pc.category_id),
    supabase,
  );
  const dpgStatuses = await getDpgStatuses(projectIds, supabase);

  return mapProjectsWithTagsAndStatus(projects, projectCategories, categories, dpgStatuses);
}

// export async function getProjectById(id, supabase) {
//   const project = await getProject(id, supabase);

//   if (!project) {
//     return null;
//   }

//   const projectCategories = await getProjectCategories([project.id], supabase);
//   const categoryIds = projectCategories.map((pc) => pc.category_id);
//   const categories = await getCategories(categoryIds, supabase);

//   // Fetch all DPG statuses and the project's specific statuses
//   const [allDpgStatuses, projectDpgStatuses] = await Promise.all([
//     getAllDpgStatuses(supabase),
//     getProjectDpgStatuses(project.id, supabase),
//   ]);

//   console.log('allDpgStatuses', allDpgStatuses);

//   console.log('projectDpgStatuses', projectDpgStatuses);

//   const dpgStatusMap = projectDpgStatuses.reduce((acc, status) => {
//     acc[status.status_id] = true;
//     return acc;
//   }, {});

//   const dpgStatuses = allDpgStatuses.map((status) => ({
//     name: status.name,
//     status: !!dpgStatusMap[status.id], // Set to true if found, otherwise false
//   }));

//   return {
//     ...project,
//     tags: categories,
//     dpgCount: projectDpgStatuses.length,
//     dpgStatuses,
//   };
// }

export async function getProjectById(id, supabase) {
  const project = await getProject(id, supabase);

  if (!project) {
    return null;
  }

  const projectCategories = await getProjectCategories([project.id], supabase);
  const categoryIds = projectCategories.map((pc) => pc.category_id);
  const categories = await getCategories(categoryIds, supabase);

  // Fetch all DPG statuses and the project's specific statuses
  const [allDpgStatuses, projectDpgStatuses] = await Promise.all([
    getAllDpgStatuses(supabase),
    getProjectDpgStatuses(project.id, supabase),
  ]);

  // Create a map of projectDpgStatuses by status_id
  const projectDpgStatusesMap = projectDpgStatuses.reduce((acc, status) => {
    acc[status.status_id] = status;
    return acc;
  }, {});

  // Map allDpgStatuses to match projectDpgStatuses and include score and explanation
  const dpgStatuses = allDpgStatuses
    .map((status) => {
      const projectStatus = projectDpgStatusesMap[status.id];

      if (projectStatus) {
        return {
          name: status.name,
          score: Number(projectStatus.score), // Make sure score is treated as a number
          explanation: projectStatus.explanation,
        };
      }

      return null; // If no match, return null
    })
    .filter(Boolean); // Remove null values if any

  const dpgTotalScore = dpgStatuses.reduce((sum, status) => sum + status.score, 0);

  return {
    ...project,
    tags: categories,
    dpgCount: dpgTotalScore,
    dpgStatuses, // Array of statuses with name, score, and explanation
  };
}

export async function getProjectByGithubUrl(githubUrl, supabase) {
  const project = await getProjectByGithub(githubUrl, supabase);
  if (!project) {
    return null;
  }
  return project;
}

export async function getTeamMembers(projectId, supabase) {
  const members = await teamMembers(projectId, supabase);

  const userIds = members.map((member) => member.user_id);

  const profiles = await getMultipleProfiles(userIds, supabase);

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

export async function getUserBookmarkedProjects(userId, page, limit, supabase) {
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  const exisitingBookmarks = await getExistingBookmarksByUserId(userId, start, end, supabase);

  if (exisitingBookmarks.length === 0) {
    return [];
  }

  const projectIds = exisitingBookmarks.map((project) => project.project_id);

  const projects = await getProjectsByIds(projectIds, supabase);

  //additional data
  const projectCategories = await getProjectCategories(projectIds, supabase);
  const categories = await getCategories(
    projectCategories.map((pc) => pc.category_id),
    supabase,
  );
  const dpgStatuses = await getDpgStatuses(projectIds, supabase);

  return mapProjectsWithTagsAndStatus(projects, projectCategories, categories, dpgStatuses);
}

export async function storeProject(user, projectData, supabase) {
  let { tags, ...projectFields } = projectData.data;

  if (typeof tags === 'string') {
    try {
      tags = JSON.parse(tags);
    } catch (error) {
      console.error('Failed to parse tags string:', error);
      tags = [];
    }
  } else if (!Array.isArray(tags)) {
    tags = tags ? [tags] : [];
  }

  const project = await createProject({ ...projectFields, user_id: user.id }, supabase);

  const teamMember = await createTeamMember(user.id, project.id, supabase);

  for (const tag of tags) {
    await assignCategory({ project_id: project.id, category_id: tag.id }, supabase);
  }

  return { project, teamMember };
}

export async function updateProject(userId, projectId, projectData, supabase) {
  let { tags, ...projectFields } = projectData.data;
  let updatedTimestamp = new Date().toISOString();

  if (typeof tags === 'string') {
    try {
      tags = JSON.parse(tags);
    } catch (error) {
      console.error('Failed to parse tags string:', error);
      tags = [];
    }
  } else if (!Array.isArray(tags)) {
    tags = tags ? [tags] : [];
  }

  await updateDetails(
    projectId,
    { ...projectFields, user_id: userId, updated_at: updatedTimestamp },
    supabase,
  );

  const existingTags = await getProjectExistingCategories(projectId, supabase);
  const existingTagIds = existingTags.map((tag) => tag.category_id);
  const newTagIds = tags.map((tag) => tag.id);

  // Remove tags that are no longer in the new list
  const tagsToRemove = existingTagIds.filter((tagId) => !newTagIds.includes(tagId));
  const tagsToAdd = newTagIds.filter((tagId) => !existingTagIds.includes(tagId));

  // Remove old tags
  if (tagsToRemove.length > 0) {
    await removeTags(projectId, tagsToRemove, supabase);
  }

  // Add new tags
  if (tagsToAdd.length > 0) {
    await addTags(projectId, tagsToAdd, supabase);
  }

  return { success: true };
}

export async function deleteProject(id, supabase) {}

//@ts-check

import { getProfile } from '$lib/server/repo/userProfileRepo.js';
import { getProjectsByUserId } from '$lib/server/repo/projectRepo.js';
import { getExistingBookmarksByUserId } from '$lib/server/repo/bookmarkRepo.js';
import { teamMembers } from '$lib/server/repo/memberRepo.js';
import { getResources } from '$lib/server/repo/projectContributionsRepo.js';

export async function generateUserDataExport(userId, supabase) {
  const exportData = {
    exportDate: new Date().toISOString(),
    userId: userId,
    sections: {}
  };

  try {
    const profile = await getProfile(userId, supabase);
    exportData.sections.profile = profile || null;
  } catch (error) {
    exportData.sections.profile = { error: 'Failed to retrieve profile data' };
  }

  try {
    const projects = await getProjectsByUserId(userId, 0, 1000, supabase);
    exportData.sections.createdProjects = projects || [];
  } catch (error) {
    exportData.sections.createdProjects = { error: 'Failed to retrieve projects' };
  }

  try {
    const bookmarks = await getExistingBookmarksByUserId(userId, 0, 1000, supabase);
    const bookmarkedProjectIds = bookmarks?.map(b => b.project_id) || [];
    
    let bookmarkedProjects = [];
    if (bookmarkedProjectIds.length > 0) {
      const { data } = await supabase
        .from('projects')
        .select('id, title, bio, created_at')
        .in('id', bookmarkedProjectIds);
      bookmarkedProjects = data || [];
    }
    exportData.sections.bookmarkedProjects = bookmarkedProjects;
  } catch (error) {
    exportData.sections.bookmarkedProjects = { error: 'Failed to retrieve bookmarks' };
  }

  try {
    const memberships = await teamMembers(userId, supabase);
    
    let memberProjects = [];
    if (memberships && memberships.length > 0) {
      const projectIds = memberships.map(m => m.project_id);
      const { data } = await supabase
        .from('projects')
        .select('id, title, bio, created_at')
        .in('id', projectIds);
      memberProjects = data || [];
    }
    exportData.sections.memberProjects = memberProjects;
  } catch (error) {
    exportData.sections.memberProjects = { error: 'Failed to retrieve memberships' };
  }

  try {
    const { data: resources } = await supabase
      .from('project_resource')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    exportData.sections.contributedResources = resources || [];
  } catch (error) {
    exportData.sections.contributedResources = { error: 'Failed to retrieve contributions' };
  }

  try {
    const { data: updates } = await supabase
      .from('project_updates')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    exportData.sections.projectUpdates = updates || [];
  } catch (error) {
    exportData.sections.projectUpdates = { error: 'Failed to retrieve updates' };
  }

  try {
    const { data: comments } = await supabase
      .from('project_update_comment')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    exportData.sections.comments = comments || [];
  } catch (error) {
    exportData.sections.comments = { error: 'Failed to retrieve comments' };
  }

  return exportData;
}

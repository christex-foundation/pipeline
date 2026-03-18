import { loginUser, registerUser, logoutUser, deleteUser } from '$lib/server/repo/authUserRepo.js';
import { createProfile, getProfile, deleteProfile } from '$lib/server/repo/userProfileRepo.js';
import {
  getProjectsByUserId,
  deleteProjectsByUserId,
} from '$lib/server/repo/projectRepo.js';
import {
  deleteBookmarksByUserId,
  deleteBookmarksByProjectIds,
} from '$lib/server/repo/bookmarkRepo.js';
import {
  deleteMembersByUserId,
  deleteMembersByProjectIds,
} from '$lib/server/repo/memberRepo.js';
import {
  deleteResourcesByUserId,
  deleteResourcesByProjectIds,
} from '$lib/server/repo/projectContributionsRepo.js';
import {
  deleteUpdatesByUserId,
  deleteUpdatesByProjectIds,
} from '$lib/server/repo/projectUpdatesRepo.js';
import {
  deleteCommentsByUserId,
  deleteCommentsByProjectIds,
} from '$lib/server/repo/projectUpdateCommentRepo.js';
import { deleteCategoryProjectsByProjectIds } from '$lib/server/repo/categoryRepo.js';
import { deleteDpgStatusesByProjectIds } from '$lib/server/repo/dpgStatusRepo.js';
import { removeImage } from '$lib/server/service/imageUploadService.js';
import { json } from '@sveltejs/kit';

export async function login(loginData, supabase) {
  const data = await loginUser(loginData, supabase);

  if (data && data.session) {
    const headers = new Headers();
    headers.append(
      'Set-Cookie',
      `access_token=${data.session.access_token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`,
    );
    headers.append(
      'Set-Cookie',
      `refresh_token=${data.session.refresh_token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`,
    );

    // Return the response with headers
    return json({ success: true, redirectTo: '/explore' }, { status: 200, headers });
  }
}

export async function register(registerData, supabase) {
  const data = await registerUser(registerData);

  if (data) {
    await createProfile(
      {
        id: data.user.id,
        name: registerData.name,
      },
      supabase,
    );

    return await login({ email: registerData.email, password: registerData.password }, supabase);
  }
}

export async function signOut(supabase) {
  await logoutUser(supabase);
}

export async function deleteAccount(userId, supabase) {
  // Fetch the user's projects and profile to collect image URLs for storage cleanup
  const profile = await getProfile(userId, supabase);
  const projects = (await getProjectsByUserId(userId, 0, 10000, supabase)) || [];
  const projectIds = projects.map((p) => p.id);

  // Phase 1: Remove all data linked to the user's projects (includes other users' data)
  if (projectIds.length) {
    await deleteCommentsByProjectIds(projectIds, supabase);
    await deleteUpdatesByProjectIds(projectIds, supabase);
    await deleteResourcesByProjectIds(projectIds, supabase);
    await deleteMembersByProjectIds(projectIds, supabase);
    await deleteBookmarksByProjectIds(projectIds, supabase);
    await deleteCategoryProjectsByProjectIds(projectIds, supabase);
    await deleteDpgStatusesByProjectIds(projectIds, supabase);
  }

  // Phase 2: Remove the user's own data on other users' projects
  await deleteCommentsByUserId(userId, supabase);
  await deleteUpdatesByUserId(userId, supabase);
  await deleteResourcesByUserId(userId, supabase);
  await deleteMembersByUserId(userId, supabase);
  await deleteBookmarksByUserId(userId, supabase);

  // Phase 3: Delete the user's projects (children are now gone)
  await deleteProjectsByUserId(userId, supabase);

  // Phase 4: Clean up uploaded images from storage
  const imageUrls = [
    profile?.image,
    profile?.banner,
    ...projects.map((p) => p.image),
    ...projects.map((p) => p.banner_image),
  ].filter(Boolean);
  for (const url of imageUrls) {
    await removeImage(url, supabase);
  }

  // Phase 5: Delete profile and auth user
  await deleteProfile(userId, supabase);
  await deleteUser(userId);
}

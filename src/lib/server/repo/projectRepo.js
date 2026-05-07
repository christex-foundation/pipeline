//@ts-check

function normalizeProjectRecord(project) {
  if (!project) {
    return project;
  }

  const githubRepo = project.github_repo ?? project.github ?? null;

  return {
    ...project,
    github_repo: githubRepo,
    github: githubRepo,
    published_at: project.published_at ?? null,
    dpgStatus: project.dpgStatus ?? null,
  };
}

function normalizeProjectRecords(projects) {
  return (projects || []).map(normalizeProjectRecord);
}

function toProjectRow(projectData) {
  const githubRepo = projectData.github_repo ?? projectData.github;

  return Object.fromEntries(
    Object.entries({
      user_id: projectData.user_id,
      title: projectData.title,
      bio: projectData.bio,
      github_repo: githubRepo,
      funding_goal: projectData.funding_goal,
      current_funding: projectData.current_funding,
      status: projectData.status,
      updated_at: projectData.updated_at,
      country: projectData.country,
      details: projectData.details,
      email: projectData.email,
      portfolio: projectData.portfolio,
      linkedin: projectData.linkedin,
      twitter: projectData.twitter,
      website: projectData.website,
      other: projectData.other,
      bank_acct: projectData.bank_acct,
      wallet_address: projectData.wallet_address,
      image: projectData.image,
      banner_image: projectData.banner_image,
    }).filter(([, value]) => value !== undefined),
  );
}

export async function getProjects(term, start, end, supabase) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .ilike('title', `%${term}%`)
    .range(start, end)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return normalizeProjectRecords(data);
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getProjectsWithCategories(term, start, end, supabase, excludeIds = []) {
  let query = supabase.from('projects').select(
    `
      id,
      title,
      banner_image,
      funding_goal,
      current_funding,
      user_id,
      bio,
      github_repo,
      category_project!inner (
        categories!inner (
          id,
          sdg_id,
          title,
          image
        )
      )
    `,
  );

  // Exclude projects already surfaced in the Top Projects hero.
  // Filter to UUID-shaped values so user-supplied strings can't reach PostgREST.
  const safeExcludeIds = Array.isArray(excludeIds)
    ? excludeIds.filter((id) => UUID_RE.test(id))
    : [];
  if (safeExcludeIds.length > 0) {
    query = query.not('id', 'in', `(${safeExcludeIds.join(',')})`);
  }

  // Conditionally add search filter only if term is provided
  if (term && term.trim() !== '') {
    query = query.ilike('title', `%${term}%`);
  }

  const { data, error } = await query.range(start, end).order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return normalizeProjectRecords(data);
}

export async function getPublishedProjectsWithDpgStatus(supabase) {
  const { data, error } = await supabase
    .from('projects')
    .select(
      `
      id,
      title,
      banner_image,
      funding_goal,
      current_funding,
      user_id,
      bio,
      github_repo,
      category_project!inner (
        categories!inner (
          id,
          sdg_id,
          title,
          image
        )
      )
    `,
    )
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return normalizeProjectRecords(data);
}

export async function getProject(id, supabase) {
  const { data, error } = await supabase
    .from('projects')
    .select(
      `*,
    category_project!inner (
        categories!inner (
          title,
          id,
          image
        )
      )`,
    )
    .eq('id', id)
    .single();
  if (error) throw new Error(error.message);
  return normalizeProjectRecord(data) || {};
}

export async function getProjectsByIds(Ids, supabase) {
  const { data, error } = await supabase
    .from('projects')
    .select(
      `*,  category_project!inner (
      categories!inner (
        image
      )
    )`,
    )
    .in('id', Ids)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return normalizeProjectRecords(data);
}

export async function getProjectsByUserId(userId, start, end, supabase) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .range(start, end)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return normalizeProjectRecords(data);
}

export async function getProjectsByUserIdWithCategories(userId, start, end, supabase) {
  const { data, error } = await supabase
    .from('projects')
    .select(
      `
    id,
    title,
    banner_image,
    funding_goal,
    current_funding,
    user_id,
    github_repo,
    category_project!inner (
      categories!inner (
        id,
        sdg_id,
        title,
        image
      )
    )
    `,
    )
    .eq('user_id', userId)
    .range(start, end)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return normalizeProjectRecords(data);
}

export async function getProjectsByUserIdWithContributions(userId, supabase) {
  const { data, error } = await supabase
    .from('projects')
    .select(
      `
      id,
    title,
    banner_image,
    funding_goal,
    current_funding,
    project_resource!inner(user_id)
  `,
    )
    .eq('project_resource.user_id', userId);

  if (error) throw new Error(error.message);
  return normalizeProjectRecords(data);
}

export async function getProjectByGithub(url, supabase) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('github_repo', url)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return normalizeProjectRecord(data);
}

export async function createProject(projectData, supabase) {
  const { data, error } = await supabase
    .from('projects')
    .insert(toProjectRow(projectData))
    .select();
  if (error) throw new Error(error.message);
  return normalizeProjectRecord(data[0]);
}

export async function updateDetails(id, projectData, supabase) {
  const { data, error } = await supabase
    .from('projects')
    .update(toProjectRow(projectData))
    .eq('id', id)
    .select();
  if (error) throw new Error(error.message);
  return normalizeProjectRecord(data[0]);
}

export async function updateProjectDpg(id, projectData, supabase) {
  console.log('repo', projectData);
  const { data, error } = await supabase
    .from('projects')
    .update({ dpgStatus: projectData })
    .eq('id', id)
    .select();
  if (error) throw new Error(error.message);
  return data[0];
}

export async function deleteProject(id, supabase) {
  const { data, error } = await supabase.from('projects').delete().eq('id', id).select();
  if (error) throw new Error(error.message);
  return data[0];
}

export async function deleteProjectsByUserId(userId, supabase) {
  const { error } = await supabase.from('projects').delete().eq('user_id', userId);
  if (error) throw new Error(error.message);
}

export { normalizeProjectRecord };

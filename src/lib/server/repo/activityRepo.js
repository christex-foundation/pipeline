//@ts-check

export async function getUserActivity(userId, limit = 20, supabase) {
  const [
    { data: created, error: e1 },
    { data: contributions, error: e2 },
    { data: bookmarks, error: e3 },
    { data: updates, error: e4 },
    { data: comments, error: e5 },
  ] = await Promise.all([
    supabase
      .from('projects')
      .select('id, title, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit),
    supabase
      .from('project_resource')
      .select('project_id, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit),
    supabase
      .from('bookmark_project')
      .select('project_id, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit),
    supabase
      .from('project_updates')
      .select('title, project_id, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit),
    supabase
      .from('project_update_comment')
      .select('project_id, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit),
  ]);

  if (e1) throw new Error(e1.message);
  if (e2) throw new Error(e2.message);
  if (e3) throw new Error(e3.message);
  if (e4) throw new Error(e4.message);
  if (e5) throw new Error(e5.message);

  // Seed from created projects to avoid re-fetching titles for projects the user both created and interacted with
  const projectTitles = new Map();
  (created || []).forEach((p) => projectTitles.set(p.id, p.title));

  // Fetch titles for any project IDs not already covered by the created query
  const missingIds = [
    ...(contributions || []).map((r) => r.project_id),
    ...(bookmarks || []).map((b) => b.project_id),
    ...(updates || []).map((u) => u.project_id),
    ...(comments || []).map((c) => c.project_id),
  ].filter((id) => id && !projectTitles.has(id));

  if (missingIds.length > 0) {
    const uniqueMissingIds = [...new Set(missingIds)];
    const { data: projects, error: pe } = await supabase
      .from('projects')
      .select('id, title')
      .in('id', uniqueMissingIds);
    if (pe) throw new Error(pe.message);
    (projects || []).forEach((p) => projectTitles.set(p.id, p.title));
  }

  const activities = [
    ...(created || []).map((p) => ({
      type: 'created',
      projectId: p.id,
      projectTitle: p.title,
      description: 'Created a project',
      createdAt: p.created_at,
    })),
    ...(contributions || []).map((r) => ({
      type: 'contributed',
      projectId: r.project_id,
      projectTitle: projectTitles.get(r.project_id) || null,
      description: 'Submitted a contribution',
      createdAt: r.created_at,
    })),
    ...(bookmarks || []).map((b) => ({
      type: 'followed',
      projectId: b.project_id,
      projectTitle: projectTitles.get(b.project_id) || null,
      description: 'Followed a project',
      createdAt: b.created_at,
    })),
    ...(updates || []).map((u) => ({
      type: 'update',
      projectId: u.project_id,
      projectTitle: projectTitles.get(u.project_id) || null,
      description: u.title ? `Posted an update: "${u.title}"` : 'Posted a project update',
      createdAt: u.created_at,
    })),
    ...(comments || []).map((c) => ({
      type: 'comment',
      projectId: c.project_id,
      projectTitle: projectTitles.get(c.project_id) || null,
      description: 'Commented on a project update',
      createdAt: c.created_at,
    })),
  ];

  activities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return activities.slice(0, limit);
}

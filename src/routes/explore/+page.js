import { error } from '@sveltejs/kit';

/** @type {import('./$types.js').PageLoad} */
export async function load({ url, fetch }) {
  const currentPage = url.searchParams.get('page') || 1;
  const itemsPerPage = url.searchParams.get('limit') || 6;

  // Fetch top first so we can exclude those IDs from the paginated list below —
  // prevents the same project from appearing in both sections.
  const { projects: topProjects } =
    await fetch(`/api/projects/top?limit=3`).then(parseJsonResponse);

  const excludeParam = topProjects.length
    ? `&excludeIds=${topProjects.map((p) => p.id).join(',')}`
    : '';
  const { projects: allProjects } = await fetch(
    `/api/projects?page=${currentPage}&limit=${itemsPerPage}${excludeParam}`,
  ).then(parseJsonResponse);

  return { allProjects, topProjects };
}

const parseJsonResponse = (res) => {
  if (!res.ok) throw error(404);
  return res.json();
};

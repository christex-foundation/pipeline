import { error } from '@sveltejs/kit';

/** @type {import('./$types.js').PageLoad} */
export async function load({ url, fetch }) {
  const currentPage = url.searchParams.get('page') || 1;
  const itemsPerPage = url.searchParams.get('limit') || 6;

  const { projects: allProjects } = await fetch(
    `/api/projects?page=${currentPage}&limit=${itemsPerPage}`,
  ).then(parseJsonResponse);

  return { allProjects, topProjects: allProjects.slice(0, 3) };
}

const parseJsonResponse = (res) => {
  if (!res.ok) throw error(404);
  return res.json();
};

import { fail } from "@sveltejs/kit";

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
	try {
		const response = await fetch("/api/projects/allprojects?limit=6");
		if (!response.ok) {
			fail(response.status);
		}
		const { projects } = await response.json();

		return {
			featureProjects: projects || [],
		};
	} catch (error) {}
}

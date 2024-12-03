//@ts-check
import { getAllCategories } from '$lib/server/repo/categoryRepo.js';

export async function allCategories(supabase) {
  const categories = await getAllCategories(supabase);

  return categories;
}

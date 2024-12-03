//@ts-check
import { getAllCategories } from '../repo/categoryRepo.js';

export async function allCategories(supabase) {
  const categories = await getAllCategories(supabase);

  return categories;
}

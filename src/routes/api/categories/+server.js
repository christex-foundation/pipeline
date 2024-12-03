//@ts-check
import { allCategories } from '$lib/server/service/categoryService.js';
import { json } from '@sveltejs/kit';

export async function GET({ request, locals }) {
  try {
    let supabase = locals.supabase;
    
    const categories = await allCategories(supabase);

    return json({ categories: categories }, { status: 200 });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}

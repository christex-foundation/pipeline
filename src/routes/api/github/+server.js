//@ts-check

import { json } from '@sveltejs/kit';

export async function POST() {
  return json(
    {
      error: 'Direct GitHub evaluation is no longer supported. Use the project evaluation queue.',
    },
    { status: 410 },
  );
}

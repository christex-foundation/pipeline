import { json } from '@sveltejs/kit';

export async function GET({ locals, url }) {
  const user = locals.authUser;
  const supabase = locals.supabase;

  if (!user) {
    return json({ error: 'Authentication required' }, { status: 401 });
  }

  try {
    const { data: consents, error } = await supabase
      .from('user_consents')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch consents:', error);
      return json({ error: 'Failed to fetch consent preferences' }, { status: 500 });
    }

    return json({ consents });
  } catch (e) {
    console.error('Error fetching consents:', e);
    return json({ error: 'An error occurred' }, { status: 500 });
  }
}

export async function POST({ request, locals }) {
  const user = locals.authUser;
  const supabase = locals.supabase;

  if (!user) {
    return json({ error: 'Authentication required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { functional, analytics } = body;

    const consentTypes = [
      { type: 'cookies_necessary', consented: true },
      { type: 'cookies_functional', consented: Boolean(functional) },
      { type: 'cookies_analytics', consented: Boolean(analytics) }
    ];

    const insertPromises = consentTypes.map(async ({ type, consented }) => {
      const { data: existing } = await supabase
        .from('user_consents')
        .select('id')
        .eq('user_id', user.id)
        .eq('consent_type', type)
        .single();

      if (existing) {
        return supabase
          .from('user_consents')
          .update({ 
            consented, 
            updated_at: new Date().toISOString() 
          })
          .eq('id', existing.id);
      } else {
        return supabase
          .from('user_consents')
          .insert({
            user_id: user.id,
            consent_type: type,
            consented
          });
      }
    });

    await Promise.all(insertPromises);

    return json({ success: true, message: 'Consent preferences saved' });
  } catch (e) {
    console.error('Error saving consent:', e);
    return json({ error: 'Failed to save consent preferences' }, { status: 500 });
  }
}

import { getPublicSystemeSettings, getSupabaseAdmin, json } from './_lib.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return json(res, 405, { error: 'Method not allowed' });
  }

  try {
    const supabase = getSupabaseAdmin();
    const settings = await getPublicSystemeSettings(supabase);
    return json(res, 200, settings);
  } catch (error) {
    console.error('API Error:', error);
    return json(res, 500, {
      error: error instanceof Error ? error.message : (typeof error === 'object' ? JSON.stringify(error) : String(error)),
    });
  }
}

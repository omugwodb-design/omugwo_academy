import { appendLog, getPublicSystemeSettings, getSupabaseAdmin, json, systemeTags } from './_lib.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return json(res, 405, { error: 'Method not allowed' });
  }

  const supabase = getSupabaseAdmin();

  try {
    const tags = await systemeTags.list();

    await appendLog(supabase, {
      type: 'tags_fetch',
      status: 'success',
      message: `Fetched ${Array.isArray(tags) ? tags.length : 0} tags from Systeme.io.`,
    });

    return json(res, 200, { tags });
  } catch (error) {
    await appendLog(supabase, {
      type: 'tags_fetch',
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to fetch tags.',
    });

    return json(res, 500, {
      error: error instanceof Error ? error.message : 'Unexpected server error.',
    });
  }
}

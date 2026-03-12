import { appendLog, getSupabaseAdmin, json, normalizeCollection, systemeContacts } from './_lib.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return json(res, 405, { error: 'Method not allowed' });
  }

  const supabase = getSupabaseAdmin();

  try {
    const result = await systemeContacts.list({ itemsPerPage: 100 });
    const contacts = normalizeCollection(result);

    await appendLog(supabase, {
      type: 'contacts_fetch',
      status: 'success',
      message: `Fetched ${contacts.length} contacts from Systeme.io.`,
    });

    return json(res, 200, { contacts });
  } catch (error) {
    await appendLog(supabase, {
      type: 'contacts_fetch',
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to fetch contacts.',
    });

    return json(res, 500, {
      error: error instanceof Error ? error.message : 'Unexpected server error.',
    });
  }
}

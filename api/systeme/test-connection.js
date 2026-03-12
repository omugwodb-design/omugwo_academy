import { appendLog, getPublicSystemeSettings, getSupabaseAdmin, json, normalizeCollection, systemeRequest } from './_lib.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { error: 'Method not allowed' });
  }

  const supabase = getSupabaseAdmin();

  try {
    const settings = await getPublicSystemeSettings(supabase);
    const payload = await systemeRequest({ path: settings.courseEndpointPath || '/api/school/courses' });
    const courses = normalizeCollection(payload);

    await appendLog(supabase, {
      type: 'connection_test',
      status: 'success',
      message: `Connection successful. ${courses.length} course(s) visible from Systeme.io.`,
      meta: { visibleCourses: courses.length },
    });

    return json(res, 200, {
      ok: true,
      message: 'Connection successful.',
      visibleCourses: courses.length,
    });
  } catch (error) {
    console.error('Test Connection Error:', error);
    try {
      await appendLog(supabase, {
        type: 'connection_test',
        status: 'error',
        message: error instanceof Error ? error.message : 'Connection failed.',
      });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }

    return json(res, 500, {
      error: error instanceof Error ? error.message : (typeof error === 'object' ? JSON.stringify(error) : String(error)),
    });
  }
};

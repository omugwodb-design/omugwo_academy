import { appendLog, getPublicSystemeSettings, getSupabaseAdmin, json, readBody, updateSystemeConfig } from './_lib.js';

export default async function handler(req, res) {
  const supabase = getSupabaseAdmin();

  if (req.method === 'GET') {
    try {
      const settings = await getPublicSystemeSettings(supabase);
      return json(res, 200, settings);
    } catch (error) {
      return json(res, 500, {
        error: error instanceof Error ? error.message : 'Unexpected server error.',
      });
    }
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return json(res, 405, { error: 'Method not allowed' });
  }

  try {
    const body = await readBody(req);
    const nextConfig = await updateSystemeConfig(supabase, (systemeIo) => ({
      ...systemeIo,
      enabled: Boolean(body.enabled),
      syncCourses: body.syncCourses !== false,
      triggerEnrollments: body.triggerEnrollments !== false,
      defaultTagId: String(body.defaultTagId || '').trim(),
      automationTagId: String(body.automationTagId || '').trim(),
      courseEndpointPath: String(body.courseEndpointPath || '/api/school/courses').trim(),
      enrollmentEndpointTemplate: String(body.enrollmentEndpointTemplate || '/api/school/courses/{courseId}/enrollments').trim(),
      updatedAt: new Date().toISOString(),
    }));

    await appendLog(supabase, {
      type: 'config_updated',
      status: 'success',
      message: 'Systeme.io integration settings updated.',
    });

    return json(res, 200, {
      ok: true,
      config: {
        ...nextConfig,
        hasApiKey: Boolean(process.env.SYSTEME_IO_API_KEY),
      },
    });
  } catch (error) {
    return json(res, 500, {
      error: error instanceof Error ? error.message : 'Unexpected server error.',
    });
  }
};

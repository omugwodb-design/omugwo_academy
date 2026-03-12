import { appendLog, getSupabaseAdmin, json, readBody, updateSystemeConfig } from './_lib.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { error: 'Method not allowed' });
  }

  const secret = process.env.SYSTEME_IO_WEBHOOK_SECRET;
  const providedSecret = req.headers['x-systeme-signature'] || req.headers['x-webhook-secret'] || req.headers['authorization'];

  if (secret && String(providedSecret || '').replace(/^Bearer\s+/i, '') !== secret) {
    return json(res, 401, { error: 'Invalid webhook signature.' });
  }

  const supabase = getSupabaseAdmin();

  try {
    const body = await readBody(req);
    const eventType = String(body.event || body.type || body.topic || 'systeme_event');

    await updateSystemeConfig(supabase, (systemeIo) => ({
      ...systemeIo,
      lastWebhookAt: new Date().toISOString(),
    }));

    await appendLog(supabase, {
      type: 'webhook',
      status: 'success',
      message: `Received Systeme.io webhook: ${eventType}`,
      meta: {
        eventType,
        payload: body,
      },
    });

    return json(res, 200, { ok: true });
  } catch (error) {
    await appendLog(supabase, {
      type: 'webhook',
      status: 'error',
      message: error instanceof Error ? error.message : 'Webhook processing failed.',
    });

    return json(res, 500, {
      error: error instanceof Error ? error.message : 'Unexpected server error.',
    });
  }
}

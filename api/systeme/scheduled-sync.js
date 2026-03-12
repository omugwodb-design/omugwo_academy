import { json } from './_lib.js';
import syncCoursesHandler from './sync-courses.js';

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    res.setHeader('Allow', 'GET, POST');
    return json(res, 405, { error: 'Method not allowed' });
  }

  const secret = process.env.SYSTEME_IO_SYNC_CRON_SECRET;
  const providedSecret = req.headers['x-cron-secret'] || req.headers['authorization'] || req.query?.secret;

  if (secret && String(providedSecret || '').replace(/^Bearer\s+/i, '') !== secret) {
    return json(res, 401, { error: 'Invalid cron secret.' });
  }

  return syncCoursesHandler({ ...req, method: 'POST' }, res);
}

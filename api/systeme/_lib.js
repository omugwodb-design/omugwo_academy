import { createClient } from '@supabase/supabase-js';

export const json = (res, status, payload) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
};

export const readBody = async (req) => {
  if (req.body && typeof req.body === 'object') return req.body;
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
};

export const getSupabaseAdmin = () => {
  // Server-side functions need SUPABASE_URL (without VITE_ prefix)
  // VITE_ prefixed vars are only available in client build, not in Vercel functions
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    console.error('Environment check:', {
      hasSupabaseUrl: !!process.env.SUPABASE_URL,
      hasViteSupabaseUrl: !!process.env.VITE_SUPABASE_URL,
      hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    });
    throw new Error('Missing Supabase admin configuration. Ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in Vercel environment variables (not just .env file).');
  }
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
};

const getSystemeConfig = async (supabase) => {
  const { data, error } = await supabase
    .from('site_config')
    .select('id, name, global_styles')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    const created = await supabase
      .from('site_config')
      .insert({ name: 'Omugwo Academy', global_styles: {} })
      .select('id, name, global_styles')
      .single();
    if (created.error) throw created.error;
    return created.data;
  }

  return data;
};

export const updateSystemeConfig = async (supabase, updater) => {
  const siteConfig = await getSystemeConfig(supabase);
  const globalStyles = siteConfig.global_styles && typeof siteConfig.global_styles === 'object' && !Array.isArray(siteConfig.global_styles)
    ? siteConfig.global_styles
    : {};

  const integrations = globalStyles.integrations && typeof globalStyles.integrations === 'object' && !Array.isArray(globalStyles.integrations)
    ? globalStyles.integrations
    : {};

  const systemeIo = integrations.systemeIo && typeof integrations.systemeIo === 'object' && !Array.isArray(integrations.systemeIo)
    ? integrations.systemeIo
    : {};

  const nextSysteme = updater(systemeIo, siteConfig);
  const nextGlobalStyles = {
    ...globalStyles,
    integrations: {
      ...integrations,
      systemeIo: nextSysteme,
    },
  };

  const { error } = await supabase
    .from('site_config')
    .update({ global_styles: nextGlobalStyles, updated_at: new Date().toISOString() })
    .eq('id', siteConfig.id);

  if (error) throw error;

  return nextSysteme;
};

export const appendLog = async (supabase, entry) => {
  return updateSystemeConfig(supabase, (systemeIo) => {
    const logs = Array.isArray(systemeIo.logs) ? systemeIo.logs : [];
    return {
      ...systemeIo,
      logs: [
        {
          id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          createdAt: new Date().toISOString(),
          ...entry,
        },
        ...logs,
      ].slice(0, 25),
    };
  });
};

export const getSyncedCourses = async (supabase) => {
  const { data, error } = await supabase
    .from('courses')
    .select('id, title, slug, systeme_io_course_id, source_platform, updated_at, external_sync_metadata')
    .eq('source_platform', 'systeme_io')
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getPublicSystemeSettings = async (supabase) => {
  const siteConfig = await getSystemeConfig(supabase);
  const globalStyles = siteConfig.global_styles && typeof siteConfig.global_styles === 'object' && !Array.isArray(siteConfig.global_styles)
    ? siteConfig.global_styles
    : {};
  const integrations = globalStyles.integrations && typeof globalStyles.integrations === 'object' && !Array.isArray(globalStyles.integrations)
    ? globalStyles.integrations
    : {};
  const systemeIo = integrations.systemeIo && typeof integrations.systemeIo === 'object' && !Array.isArray(integrations.systemeIo)
    ? integrations.systemeIo
    : {};

  let syncedCourses = [];
  try {
    syncedCourses = await getSyncedCourses(supabase);
  } catch (err) {
    console.error('Error fetching synced courses (check schema):', err.message);
  }

  return {
    enabled: Boolean(systemeIo.enabled),
    syncCourses: systemeIo.syncCourses !== false,
    triggerEnrollments: systemeIo.triggerEnrollments !== false,
    defaultTagId: String(systemeIo.defaultTagId || ''),
    automationTagId: String(systemeIo.automationTagId || ''),
    courseEndpointPath: String(systemeIo.courseEndpointPath || '/api/school/courses'),
    enrollmentEndpointTemplate: String(systemeIo.enrollmentEndpointTemplate || '/api/school/courses/{courseId}/enrollments'),
    lastCourseSyncAt: systemeIo.lastCourseSyncAt || null,
    lastEnrollmentPushAt: systemeIo.lastEnrollmentPushAt || null,
    lastWebhookAt: systemeIo.lastWebhookAt || null,
    lastSyncSummary: systemeIo.lastSyncSummary || null,
    logs: Array.isArray(systemeIo.logs) ? systemeIo.logs : [],
    syncedCourses,
    hasApiKey: Boolean(process.env.SYSTEME_IO_API_KEY),
    apiBaseUrl: process.env.SYSTEME_IO_API_BASE_URL || 'https://api.systeme.io',
    hasWebhookSecret: Boolean(process.env.SYSTEME_IO_WEBHOOK_SECRET),
    hasCronSecret: Boolean(process.env.SYSTEME_IO_SYNC_CRON_SECRET),
  };
};

export const systemeRequest = async ({ path, method = 'GET', body, params }) => {
  const apiKey = process.env.SYSTEME_IO_API_KEY;
  const baseUrl = process.env.SYSTEME_IO_API_BASE_URL || 'https://api.systeme.io';

  if (!apiKey) {
    throw new Error('Missing SYSTEME_IO_API_KEY. Set this in Vercel environment variables.');
  }

  // Build URL with query params
  let url = `${baseUrl}${path}`;
  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    }
    url += `?${searchParams.toString()}`;
  }

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const errorMsg = typeof data === 'string' ? data : data?.['hydra:description'] || data?.message || `Systeme.io request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
};

// Contact-specific API helpers
export const systemeContacts = {
  list: async (params = {}) => systemeRequest({ path: '/api/contacts', params }),
  get: async (id) => systemeRequest({ path: `/api/contacts/${id}` }),
  create: async (data) => systemeRequest({ path: '/api/contacts', method: 'POST', body: data }),
  update: async (id, data) => systemeRequest({ path: `/api/contacts/${id}`, method: 'PATCH', body: data }),
  delete: async (id) => systemeRequest({ path: `/api/contacts/${id}`, method: 'DELETE' }),
  addTag: async (contactId, tagId) => systemeRequest({
    path: `/api/contacts/${contactId}/tags`,
    method: 'POST',
    body: { tagId }
  }),
  removeTag: async (contactId, tagId) => systemeRequest({
    path: `/api/contacts/${contactId}/tags/${tagId}`,
    method: 'DELETE'
  }),
  findByEmail: async (email) => {
    const result = await systemeRequest({ path: '/api/contacts', params: { email } });
    const items = normalizeCollection(result);
    return items[0] || null;
  },
};

// Tag API helpers
export const systemeTags = {
  list: async () => systemeRequest({ path: '/api/tags' }),
  create: async (data) => systemeRequest({ path: '/api/tags', method: 'POST', body: data }),
};

// Webhook API helpers
export const systemeWebhooks = {
  list: async () => systemeRequest({ path: '/api/webhooks' }),
  create: async (data) => systemeRequest({ path: '/api/webhooks', method: 'POST', body: data }),
  delete: async (id) => systemeRequest({ path: `/api/webhooks/${id}`, method: 'DELETE' }),
};

// Community/Membership API helpers
export const systemeCommunities = {
  list: async () => systemeRequest({ path: '/api/community_communities' }),
  addMember: async (communityId, email) => systemeRequest({
    path: `/api/community_communities/${communityId}/memberships`,
    method: 'POST',
    body: { email }
  }),
  removeMember: async (membershipId) => systemeRequest({
    path: `/api/community_memberships/${membershipId}`,
    method: 'DELETE'
  }),
};

export const normalizeCollection = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.['hydra:member'])) return payload['hydra:member'];
  return [];
};

export const slugify = (value) => String(value || '')
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '') || `systeme-course-${Date.now()}`;

export default {
  appendLog,
  getPublicSystemeSettings,
  getSupabaseAdmin,
  getSyncedCourses,
  json,
  normalizeCollection,
  readBody,
  slugify,
  systemeRequest,
  systemeContacts,
  systemeTags,
  systemeWebhooks,
  systemeCommunities,
  updateSystemeConfig,
};

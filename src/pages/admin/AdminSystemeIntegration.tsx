import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Cloud, KeyRound, RefreshCw, ServerCog, Webhook, Workflow, Clock3, Database } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { toast } from 'react-hot-toast';

type SystemeSettings = {
  enabled: boolean;
  syncCourses: boolean;
  triggerEnrollments: boolean;
  defaultTagId: string;
  automationTagId: string;
  courseEndpointPath: string;
  enrollmentEndpointTemplate: string;
  lastCourseSyncAt: string | null;
  lastEnrollmentPushAt: string | null;
  lastSyncSummary: {
    synced: number;
    skipped: number;
    fetched: number;
    lessonSyncAvailable: boolean;
  } | null;
  logs: Array<{
    id: string;
    createdAt: string;
    type: string;
    status: string;
    message: string;
    meta?: Record<string, any>;
  }>;
  syncedCourses: Array<{
    id: string;
    title: string;
    slug: string;
    systeme_io_course_id: string;
    source_platform: string;
    updated_at: string | null;
    external_sync_metadata?: Record<string, any>;
  }>;
  hasApiKey: boolean;
  apiBaseUrl: string;
  hasWebhookSecret: boolean;
  hasCronSecret: boolean;
  lastWebhookAt: string | null;
};

const defaultState: SystemeSettings = {
  enabled: false,
  syncCourses: true,
  triggerEnrollments: true,
  defaultTagId: '',
  automationTagId: '',
  courseEndpointPath: '/api/school/courses',
  enrollmentEndpointTemplate: '/api/school/courses/{courseId}/enrollments',
  lastCourseSyncAt: null,
  lastEnrollmentPushAt: null,
  lastSyncSummary: null,
  logs: [],
  syncedCourses: [],
  hasApiKey: false,
  apiBaseUrl: 'https://api.systeme.io',
  hasWebhookSecret: false,
  hasCronSecret: false,
  lastWebhookAt: null,
};

export const AdminSystemeIntegration: React.FC = () => {
  const [settings, setSettings] = useState<SystemeSettings>(defaultState);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const loadSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/systeme/status');
      const result = await response.json();
      if (!response.ok) throw new Error(result?.error || 'Failed to load Systeme.io settings.');
      setSettings({ ...defaultState, ...result });
    } catch (error: any) {
      toast.error(error?.message || 'Failed to load Systeme.io settings.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const statusTone = useMemo(() => {
    if (!settings.hasApiKey) return 'warning';
    if (settings.enabled) return 'success';
    return 'neutral';
  }, [settings.enabled, settings.hasApiKey]);

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/systeme/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result?.error || 'Failed to save Systeme.io settings.');
      toast.success('Systeme.io integration settings saved.');
      await loadSettings();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save Systeme.io settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const testConnection = async () => {
    setIsTesting(true);
    try {
      const response = await fetch('/api/systeme/test-connection', { method: 'POST' });
      const result = await response.json();
      if (!response.ok) throw new Error(result?.error || 'Connection test failed.');
      toast.success(result?.message || 'Connection successful.');
      await loadSettings();
    } catch (error: any) {
      toast.error(error?.message || 'Connection test failed.');
    } finally {
      setIsTesting(false);
    }
  };

  const syncCourses = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch('/api/systeme/sync-courses', { method: 'POST' });
      const result = await response.json();
      if (!response.ok) throw new Error(result?.error || 'Course sync failed.');
      toast.success(`Synced ${result?.summary?.synced ?? 0} course(s) from Systeme.io.`);
      await loadSettings();
    } catch (error: any) {
      toast.error(error?.message || 'Course sync failed.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Systeme.io Integration</h1>
          <p className="text-gray-600 dark:text-gray-400">Supabase remains the system of record while Systeme.io powers marketing automation and course catalog sync.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={loadSettings} leftIcon={<RefreshCw className="w-4 h-4" />}>
            Refresh
          </Button>
          <Button onClick={saveSettings} isLoading={isSaving}>
            Save Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="p-6 xl:col-span-2 bg-white/70 dark:bg-gray-900/50 border border-gray-100/50 dark:border-gray-800/80 shadow-sm">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center">
              <ServerCog className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Integration Controls</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Configure the safe hybrid bridge. The API key stays server-side in environment variables only.</p>
            </div>
          </div>

          {isLoading ? (
            <div className="text-sm text-gray-500 dark:text-gray-400">Loading integration settings...</div>
          ) : (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/60 p-4 flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={settings.enabled} onChange={(e) => setSettings((prev) => ({ ...prev, enabled: e.target.checked }))} className="mt-1 accent-primary-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Enable Systeme.io bridge</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Allows admin-triggered sync and server-side enrollment pushes.</p>
                  </div>
                </label>
                <label className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/60 p-4 flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={settings.syncCourses} onChange={(e) => setSettings((prev) => ({ ...prev, syncCourses: e.target.checked }))} className="mt-1 accent-primary-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Sync course catalog</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Pull Systeme.io courses into Supabase for local caching and UI control.</p>
                  </div>
                </label>
                <label className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/60 p-4 flex items-start gap-3 cursor-pointer md:col-span-2">
                  <input type="checkbox" checked={settings.triggerEnrollments} onChange={(e) => setSettings((prev) => ({ ...prev, triggerEnrollments: e.target.checked }))} className="mt-1 accent-primary-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Trigger enrollment automations</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Push platform enrollments to Systeme.io so welcome sequences and marketing automations fire correctly.</p>
                  </div>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Course Endpoint Path</label>
                  <Input value={settings.courseEndpointPath} onChange={(e) => setSettings((prev) => ({ ...prev, courseEndpointPath: e.target.value }))} placeholder="/api/school/courses" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Enrollment Endpoint Template</label>
                  <Input value={settings.enrollmentEndpointTemplate} onChange={(e) => setSettings((prev) => ({ ...prev, enrollmentEndpointTemplate: e.target.value }))} placeholder="/api/school/courses/{courseId}/enrollments" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Default Tag ID</label>
                  <Input value={settings.defaultTagId} onChange={(e) => setSettings((prev) => ({ ...prev, defaultTagId: e.target.value }))} placeholder="Optional marketing tag" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Automation Tag ID</label>
                  <Input value={settings.automationTagId} onChange={(e) => setSettings((prev) => ({ ...prev, automationTagId: e.target.value }))} placeholder="Optional automation tag" />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" onClick={testConnection} isLoading={isTesting} leftIcon={<KeyRound className="w-4 h-4" />}>
                  Test Connection
                </Button>
                <Button onClick={syncCourses} isLoading={isSyncing} leftIcon={<Cloud className="w-4 h-4" />}>
                  Manual Course Sync
                </Button>
              </div>
            </div>
          )}
        </Card>

        <div className="space-y-6">
          <Card className="p-6 bg-white/70 dark:bg-gray-900/50 border border-gray-100/50 dark:border-gray-800/80 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Connection Status</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {statusTone === 'success' ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <AlertCircle className={`w-5 h-5 ${statusTone === 'warning' ? 'text-amber-500' : 'text-gray-400'}`} />}
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {settings.hasApiKey ? 'Server API key detected' : 'Server API key missing'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Base URL: {settings.apiBaseUrl}</p>
                </div>
              </div>
              <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/60 p-4 text-sm text-gray-600 dark:text-gray-400">
                Add `SYSTEME_IO_API_KEY` on the server and keep it out of the browser. This panel stores only non-secret integration behavior.
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/70 dark:bg-gray-900/50 border border-gray-100/50 dark:border-gray-800/80 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Automation Endpoints</h2>
            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-start gap-3">
                <Webhook className="w-4 h-4 mt-0.5 text-primary-600" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Webhook receiver</p>
                  <p>`/api/systeme/webhook`</p>
                  <p className="text-xs mt-1">Secret configured: {settings.hasWebhookSecret ? 'Yes' : 'No'} • Last event: {settings.lastWebhookAt ? new Date(settings.lastWebhookAt).toLocaleString() : 'Never'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock3 className="w-4 h-4 mt-0.5 text-primary-600" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Scheduled sync endpoint</p>
                  <p>`/api/systeme/scheduled-sync`</p>
                  <p className="text-xs mt-1">Cron secret configured: {settings.hasCronSecret ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/70 dark:bg-gray-900/50 border border-gray-100/50 dark:border-gray-800/80 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Sync Summary</h2>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <p><span className="font-semibold text-gray-900 dark:text-white">Last course sync:</span> {settings.lastCourseSyncAt ? new Date(settings.lastCourseSyncAt).toLocaleString() : 'Never'}</p>
              <p><span className="font-semibold text-gray-900 dark:text-white">Last enrollment push:</span> {settings.lastEnrollmentPushAt ? new Date(settings.lastEnrollmentPushAt).toLocaleString() : 'Never'}</p>
              <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-3">
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  <strong>API Limitation:</strong> Systeme.io's public API does not expose lesson content endpoints. 
                  Course catalog sync is available, but lesson content must be managed directly in Systeme.io. 
                  Enrollment automations should be configured in Systeme.io to trigger when tags are assigned.
                </p>
              </div>
              {settings.lastSyncSummary && (
                <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/60 p-4">
                  <p>Fetched: {settings.lastSyncSummary.fetched}</p>
                  <p>Synced: {settings.lastSyncSummary.synced}</p>
                  <p>Skipped: {settings.lastSyncSummary.skipped}</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      <Card className="p-6 bg-white/70 dark:bg-gray-900/50 border border-gray-100/50 dark:border-gray-800/80 shadow-sm">
        <div className="flex items-start gap-3 mb-4">
          <Database className="w-5 h-5 text-primary-600 mt-0.5" />
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Synced Courses</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Locally cached course catalog entries sourced from Systeme.io.</p>
          </div>
        </div>
        <div className="space-y-3">
          {settings.syncedCourses.length === 0 ? (
            <div className="text-sm text-gray-500 dark:text-gray-400">No Systeme.io courses have been cached yet. Run a manual sync to populate the local catalog.</div>
          ) : (
            settings.syncedCourses.map((course) => (
              <div key={course.id} className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/60 p-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{course.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Local slug: {course.slug} • Systeme ID: {course.systeme_io_course_id}</p>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Last synced: {course.updated_at ? new Date(course.updated_at).toLocaleString() : 'Unknown'}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      <Card className="p-6 bg-white/70 dark:bg-gray-900/50 border border-gray-100/50 dark:border-gray-800/80 shadow-sm">
        <div className="flex items-start gap-3 mb-4">
          <Workflow className="w-5 h-5 text-primary-600 mt-0.5" />
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Integration Logs</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Recent server-side sync, connection, and enrollment events.</p>
          </div>
        </div>
        <div className="space-y-3">
          {settings.logs.length === 0 ? (
            <div className="text-sm text-gray-500 dark:text-gray-400">No integration events yet.</div>
          ) : (
            settings.logs.map((log) => (
              <div key={log.id} className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/60 p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{log.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{log.type} • {new Date(log.createdAt).toLocaleString()}</p>
                  </div>
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${log.status === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300'}`}>
                    {log.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

import React, { useEffect, useMemo, useState } from 'react';
import { Settings, User, Bell, Shield, CreditCard, Globe, Mail, RefreshCw, Save, Palette } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { MediaUpload } from '../../components/ui/MediaUpload';
import { BrandLogo } from '../../components/branding/BrandLogo';
import { BrandingConfig, emitBrandingUpdated, getDefaultBranding } from '../../components/branding/BrandingProvider';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import { toast } from 'react-hot-toast';

type SettingsSection = 'branding' | 'general' | 'profile' | 'notifications' | 'security' | 'billing' | 'custom-domain' | 'email';

type AdminSettingsState = {
  academyName: string;
  supportEmail: string;
  academyDescription: string;
  notificationsEnabled: boolean;
  weeklyDigestEnabled: boolean;
  marketingEmailsEnabled: boolean;
  maintenanceMode: boolean;
  allowNewRegistrations: boolean;
  requireEmailVerification: boolean;
  defaultCurrency: string;
  taxRate: string;
  customDomain: string;
  enforceHttps: boolean;
  emailSenderName: string;
  emailSenderAddress: string;
  replyToEmail: string;
};

type AdminProfileState = {
  name: string;
  email: string;
  role: string;
};

type BrandingState = BrandingConfig;

const DEFAULT_SETTINGS: AdminSettingsState = {
  academyName: 'Omugwo Academy',
  supportEmail: 'support@omugwo.com',
  academyDescription: 'Omugwo Academy is the premier destination for postnatal care education.',
  notificationsEnabled: true,
  weeklyDigestEnabled: true,
  marketingEmailsEnabled: false,
  maintenanceMode: false,
  allowNewRegistrations: true,
  requireEmailVerification: true,
  defaultCurrency: 'NGN',
  taxRate: '0',
  customDomain: '',
  enforceHttps: true,
  emailSenderName: 'Omugwo Academy',
  emailSenderAddress: 'support@omugwo.com',
  replyToEmail: 'support@omugwo.com',
};

const sections: { id: SettingsSection; label: string; icon: React.ComponentType<any>; }[] = [
  { id: 'branding', label: 'Branding', icon: Palette },
  { id: 'general', label: 'General', icon: Settings },
  { id: 'profile', label: 'Admin Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'custom-domain', label: 'Custom Domain', icon: Globe },
  { id: 'email', label: 'Email Setup', icon: Mail },
];

const ToggleRow: React.FC<{
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/60 p-4">
    <div>
      <p className="text-sm font-semibold text-gray-900 dark:text-white">{label}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
    </div>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${checked ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-700'}`}
    >
      <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  </div>
);

export const AdminSettings: React.FC = () => {
  const { user: currentUser, loadUser } = useAuthStore();
  const [activeSection, setActiveSection] = useState<SettingsSection>('branding');
  const [settings, setSettings] = useState<AdminSettingsState>(DEFAULT_SETTINGS);
  const [branding, setBranding] = useState<BrandingState>(getDefaultBranding());
  const [profile, setProfile] = useState<AdminProfileState>({ name: '', email: '', role: '' });
  const [siteConfigId, setSiteConfigId] = useState<string | null>(null);
  const [appSettingsId, setAppSettingsId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const summary = useMemo(() => ({
    branding: 'Manage the academy logo and shared brand identity across the platform.',
    general: 'Academy branding, support contact, and description.',
    profile: 'Your personal admin identity and account summary.',
    notifications: 'Internal alert preferences and digest behavior.',
    security: 'Registration and maintenance access controls.',
    billing: 'Platform billing defaults and tax configuration.',
    'custom-domain': 'Custom domain and HTTPS preferences.',
    email: 'Default sender identity for academy communication.',
  }), []);

  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const [siteConfigResult, appSettingsResult, profileResult] = await Promise.all([
          supabase.from('site_config').select('*').order('updated_at', { ascending: false }).limit(1).maybeSingle(),
          supabase.from('app_settings').select('*').limit(1).maybeSingle(),
          currentUser?.id
            ? supabase.from('users').select('*').eq('id', currentUser.id).maybeSingle()
            : Promise.resolve({ data: null, error: null } as any),
        ]);

        if (siteConfigResult.error) throw siteConfigResult.error;
        if (appSettingsResult.error) throw appSettingsResult.error;
        if (profileResult.error) throw profileResult.error;

        let siteConfig = siteConfigResult.data;
        if (!siteConfig) {
          const created = await supabase
            .from('site_config')
            .insert({ name: DEFAULT_SETTINGS.academyName, global_styles: { admin_settings: DEFAULT_SETTINGS } as any })
            .select('*')
            .single();
          if (created.error) throw created.error;
          siteConfig = created.data;
        }

        let appSettings = appSettingsResult.data;
        if (!appSettings) {
          const created = await supabase
            .from('app_settings')
            .insert({ default_currency: DEFAULT_SETTINGS.defaultCurrency })
            .select('*')
            .single();
          if (created.error) throw created.error;
          appSettings = created.data;
        }

        const globalStyles = (siteConfig?.global_styles && typeof siteConfig.global_styles === 'object' && !Array.isArray(siteConfig.global_styles))
          ? siteConfig.global_styles as Record<string, any>
          : {};
        const persistedBranding = globalStyles.branding && typeof globalStyles.branding === 'object'
          ? globalStyles.branding as Partial<BrandingState>
          : {};
        const persisted = globalStyles.admin_settings && typeof globalStyles.admin_settings === 'object'
          ? globalStyles.admin_settings as Partial<AdminSettingsState>
          : {};

        setSiteConfigId(siteConfig.id);
        setAppSettingsId(appSettings.id);
        setBranding({
          brandName: String(siteConfig.name || persistedBranding.brandName || getDefaultBranding().brandName),
          logoUrl: String(persistedBranding.logoUrl || ''),
          logoAlt: String(persistedBranding.logoAlt || `${siteConfig.name || persistedBranding.brandName || getDefaultBranding().brandName} logo`),
        });
        setSettings({
          ...DEFAULT_SETTINGS,
          ...persisted,
          academyName: siteConfig.name || persisted.academyName || DEFAULT_SETTINGS.academyName,
          defaultCurrency: appSettings.default_currency || persisted.defaultCurrency || DEFAULT_SETTINGS.defaultCurrency,
        });

        const profileRow = profileResult.data;
        setProfile({
          name: profileRow?.name || currentUser?.fullName || '',
          email: profileRow?.email || currentUser?.email || '',
          role: profileRow?.role || currentUser?.role || 'admin',
        });
      } catch (err: any) {
        console.error('Failed to load admin settings:', err);
        toast.error(err?.message || 'Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [currentUser?.email, currentUser?.fullName, currentUser?.id, currentUser?.role]);

  const setField = <K extends keyof AdminSettingsState>(key: K, value: AdminSettingsState[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!siteConfigId || !appSettingsId || !currentUser?.id) {
      toast.error('Settings are not ready yet');
      return;
    }

    setIsSaving(true);
    try {
      const { data: currentConfig, error: configReadError } = await supabase
        .from('site_config')
        .select('global_styles')
        .eq('id', siteConfigId)
        .single();

      if (configReadError) throw configReadError;

      const existingGlobalStyles = (currentConfig?.global_styles && typeof currentConfig.global_styles === 'object' && !Array.isArray(currentConfig.global_styles))
        ? currentConfig.global_styles as Record<string, any>
        : {};

      const nextGlobalStyles = {
        ...existingGlobalStyles,
        branding: {
          brandName: branding.brandName.trim() || settings.academyName.trim() || DEFAULT_SETTINGS.academyName,
          logoUrl: branding.logoUrl.trim(),
          logoAlt: branding.logoAlt.trim() || `${branding.brandName.trim() || settings.academyName.trim() || DEFAULT_SETTINGS.academyName} logo`,
        },
        admin_settings: {
          ...settings,
          academyName: settings.academyName.trim(),
          supportEmail: settings.supportEmail.trim(),
          academyDescription: settings.academyDescription.trim(),
          customDomain: settings.customDomain.trim(),
          emailSenderName: settings.emailSenderName.trim(),
          emailSenderAddress: settings.emailSenderAddress.trim(),
          replyToEmail: settings.replyToEmail.trim(),
        },
      };

      const updates = await Promise.all([
        supabase
          .from('site_config')
          .update({
            name: branding.brandName.trim() || settings.academyName.trim() || DEFAULT_SETTINGS.academyName,
            global_styles: nextGlobalStyles as any,
            updated_at: new Date().toISOString(),
          })
          .eq('id', siteConfigId),
        supabase
          .from('app_settings')
          .update({
            default_currency: settings.defaultCurrency,
            updated_at: new Date().toISOString(),
          })
          .eq('id', appSettingsId),
        supabase
          .from('users')
          .update({
            name: profile.name.trim() || profile.email,
            updated_at: new Date().toISOString(),
          })
          .eq('id', currentUser.id),
      ]);

      const firstError = updates.find((result) => result.error)?.error;
      if (firstError) throw firstError;

      emitBrandingUpdated({
        brandName: branding.brandName.trim() || settings.academyName.trim() || DEFAULT_SETTINGS.academyName,
        logoUrl: branding.logoUrl.trim(),
        logoAlt: branding.logoAlt.trim() || `${branding.brandName.trim() || settings.academyName.trim() || DEFAULT_SETTINGS.academyName} logo`,
      });
      await loadUser();
      toast.success('Settings saved successfully');
    } catch (err: any) {
      console.error('Failed to save settings:', err);
      toast.error(err?.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    const confirmed = window.confirm('Reset all configurable academy settings back to defaults?');
    if (!confirmed) return;
    setSettings(DEFAULT_SETTINGS);
    setBranding(getDefaultBranding());
    toast.success('Defaults restored locally. Click Save Changes to persist them.');
  };

  const renderSection = () => {
    if (activeSection === 'branding') {
      return (
        <Card className="p-6 bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-100/50 dark:border-gray-800/80 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 tracking-tight">Branding</h3>
          <div className="grid grid-cols-1 xl:grid-cols-[320px,1fr] gap-6">
            <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-900/60 p-6 space-y-4">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Live Preview</p>
              <div className="rounded-2xl bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 p-5">
                <BrandLogo brandingOverride={branding} />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Saved branding is used across the marketing website, website builder preview, admin dashboard, and LMS surfaces.
              </p>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Brand Name</label>
                  <Input
                    value={branding.brandName}
                    onChange={(e) => {
                      const brandName = e.target.value;
                      setBranding((prev) => ({
                        ...prev,
                        brandName,
                        logoAlt: prev.logoAlt === `${prev.brandName} logo` || !prev.logoAlt ? `${brandName} logo` : prev.logoAlt,
                      }));
                      setSettings((prev) => ({ ...prev, academyName: brandName }));
                    }}
                    placeholder="Omugwo Academy"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Logo Alt Text</label>
                  <Input
                    value={branding.logoAlt}
                    onChange={(e) => setBranding((prev) => ({ ...prev, logoAlt: e.target.value }))}
                    placeholder="Omugwo Academy logo"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Platform Logo</label>
                <MediaUpload
                  value={branding.logoUrl}
                  onChange={(url) => setBranding((prev) => ({ ...prev, logoUrl: url }))}
                  bucket="assets"
                  folder="branding"
                  type="image"
                  placeholder="Upload logo"
                  className="min-h-[220px]"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Upload SVG, PNG, JPG, or GIF to Supabase Storage. Once you save, the new logo is used everywhere without a rebuild.
                </p>
              </div>
            </div>
          </div>
        </Card>
      );
    }

    if (activeSection === 'general') {
      return (
        <Card className="p-6 bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-100/50 dark:border-gray-800/80 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 tracking-tight">General Settings</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Academy Name</label>
                <Input value={settings.academyName} onChange={(e) => setField('academyName', e.target.value)} placeholder="Omugwo Academy" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Support Email</label>
                <Input type="email" value={settings.supportEmail} onChange={(e) => setField('supportEmail', e.target.value)} placeholder="support@omugwo.com" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Academy Description</label>
              <textarea
                className="w-full h-32 p-4 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                placeholder="Tell us about your academy..."
                value={settings.academyDescription}
                onChange={(e) => setField('academyDescription', e.target.value)}
              />
            </div>
          </div>
        </Card>
      );
    }

    if (activeSection === 'profile') {
      return (
        <Card className="p-6 bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-100/50 dark:border-gray-800/80 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 tracking-tight">Admin Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Display Name</label>
              <Input value={profile.name} onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))} placeholder="Your full name" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email Address</label>
              <Input value={profile.email} disabled />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Role</label>
              <Input value={String(profile.role || '').replace('_', ' ')} disabled />
            </div>
          </div>
        </Card>
      );
    }

    if (activeSection === 'notifications') {
      return (
        <Card className="p-6 bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-100/50 dark:border-gray-800/80 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 tracking-tight">Notification Preferences</h3>
          <div className="space-y-4">
            <ToggleRow label="Admin notifications" description="Receive operational alerts about registrations, payments, and publishing." checked={settings.notificationsEnabled} onChange={(checked) => setField('notificationsEnabled', checked)} />
            <ToggleRow label="Weekly digest" description="Receive a weekly summary of academy activity and growth metrics." checked={settings.weeklyDigestEnabled} onChange={(checked) => setField('weeklyDigestEnabled', checked)} />
            <ToggleRow label="Marketing updates" description="Receive product announcements and internal marketing reminders." checked={settings.marketingEmailsEnabled} onChange={(checked) => setField('marketingEmailsEnabled', checked)} />
          </div>
        </Card>
      );
    }

    if (activeSection === 'security') {
      return (
        <Card className="p-6 bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-100/50 dark:border-gray-800/80 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 tracking-tight">Security & Access</h3>
          <div className="space-y-4">
            <ToggleRow label="Maintenance mode" description="Temporarily signal that the academy is under maintenance." checked={settings.maintenanceMode} onChange={(checked) => setField('maintenanceMode', checked)} />
            <ToggleRow label="Allow new registrations" description="Enable new learners to sign up through the platform." checked={settings.allowNewRegistrations} onChange={(checked) => setField('allowNewRegistrations', checked)} />
            <ToggleRow label="Require email verification" description="Force new accounts to verify their email address before full access." checked={settings.requireEmailVerification} onChange={(checked) => setField('requireEmailVerification', checked)} />
          </div>
        </Card>
      );
    }

    if (activeSection === 'billing') {
      return (
        <Card className="p-6 bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-100/50 dark:border-gray-800/80 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 tracking-tight">Billing Defaults</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Default Currency</label>
              <select
                value={settings.defaultCurrency}
                onChange={(e) => setField('defaultCurrency', e.target.value)}
                className="w-full h-12 px-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
              >
                <option value="NGN">NGN</option>
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Default Tax Rate (%)</label>
              <Input value={settings.taxRate} onChange={(e) => setField('taxRate', e.target.value)} placeholder="0" />
            </div>
          </div>
        </Card>
      );
    }

    if (activeSection === 'custom-domain') {
      return (
        <Card className="p-6 bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-100/50 dark:border-gray-800/80 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 tracking-tight">Custom Domain</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Primary Domain</label>
              <Input value={settings.customDomain} onChange={(e) => setField('customDomain', e.target.value)} placeholder="academy.yourdomain.com" />
            </div>
            <ToggleRow label="Enforce HTTPS" description="Redirect traffic to secure HTTPS URLs whenever possible." checked={settings.enforceHttps} onChange={(checked) => setField('enforceHttps', checked)} />
          </div>
        </Card>
      );
    }

    return (
      <Card className="p-6 bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-100/50 dark:border-gray-800/80 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 tracking-tight">Email Setup</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Sender Name</label>
            <Input value={settings.emailSenderName} onChange={(e) => setField('emailSenderName', e.target.value)} placeholder="Omugwo Academy" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Sender Email</label>
            <Input type="email" value={settings.emailSenderAddress} onChange={(e) => setField('emailSenderAddress', e.target.value)} placeholder="support@omugwo.com" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Reply-To Email</label>
            <Input type="email" value={settings.replyToEmail} onChange={(e) => setField('replyToEmail', e.target.value)} placeholder="support@omugwo.com" />
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your academy configuration</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" leftIcon={<RefreshCw className="w-4 h-4" />} onClick={handleReset}>
            Reset Defaults
          </Button>
          <Button leftIcon={<Save className="w-4 h-4" />} onClick={handleSave} isLoading={isSaving}>
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1 space-y-1">
          {sections.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${activeSection === item.id
                ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                : 'text-gray-600 dark:text-gray-400 hover:bg-white/60 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white'
                }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </aside>

        <div className="lg:col-span-3 space-y-6">
          <Card className="p-5 bg-primary-50/60 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-800/40 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 dark:text-white">{sections.find((s) => s.id === activeSection)?.label}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{summary[activeSection]}</p>
          </Card>

          {isLoading ? (
            <Card className="p-8 bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-100/50 dark:border-gray-800/80 shadow-sm">
              <div className="text-sm text-gray-500 dark:text-gray-400">Loading settings...</div>
            </Card>
          ) : (
            renderSection()
          )}

          <Card className="p-6 bg-red-50/30 dark:bg-red-500/5 backdrop-blur-xl border border-red-100 dark:border-red-500/20 shadow-sm">
            <h3 className="text-lg font-bold text-red-900 dark:text-red-400 mb-2 tracking-tight">Danger Zone</h3>
            <p className="text-sm text-red-600 dark:text-red-300/80 mb-6 font-medium">Use these actions carefully. They affect academy-wide behavior.</p>
            <div className="flex flex-col md:flex-row gap-4">
              <Button
                variant="outline"
                onClick={() => setField('maintenanceMode', !settings.maintenanceMode)}
                className="border-red-600 text-red-600 dark:border-red-500 dark:text-red-400 hover:bg-red-600 hover:text-white dark:hover:bg-red-500 dark:hover:text-white transition-colors bg-transparent"
              >
                {settings.maintenanceMode ? 'Disable Maintenance Mode' : 'Enable Maintenance Mode'}
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
                className="border-red-600 text-red-600 dark:border-red-500 dark:text-red-400 hover:bg-red-600 hover:text-white dark:hover:bg-red-500 dark:hover:text-white transition-colors bg-transparent"
              >
                Reset Settings
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

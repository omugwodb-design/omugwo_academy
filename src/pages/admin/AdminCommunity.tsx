import React, { useMemo, useState, useEffect } from 'react';
import { MessageSquare, Plus, Search, Users, Trash2, Edit, ChevronRight, Flag, Eye, EyeOff, Shield, X, Save, AlertCircle, CheckCircle, Heart, Globe, Lock, Calendar, Star, Award, Trophy } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { getReports, resolveReport } from '../../core/community/community-service';

const SPACE_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  MessageSquare,
  Users,
  Heart,
  Shield,
  Flag,
  Eye,
  EyeOff,
  Globe,
  Lock,
  Calendar,
  Star,
  Award,
  Trophy,
};

const SpaceIcon: React.FC<{ value?: string; fallback?: string; className?: string }> = ({ value, fallback, className }) => {
  const normalized = (value || '').trim();
  const Icon = normalized ? SPACE_ICON_MAP[normalized] || SPACE_ICON_MAP[normalized.toLowerCase()] : undefined;
  if (Icon) return <Icon className={className} />;
  return <span className="text-2xl leading-none">{normalized || fallback || ''}</span>;
};

const ICON_OPTIONS: Array<{ key: string; label: string; Icon: React.ComponentType<{ className?: string }> }> = [
  { key: 'MessageSquare', label: 'Chat', Icon: MessageSquare },
  { key: 'Users', label: 'People', Icon: Users },
  { key: 'Heart', label: 'Love', Icon: Heart },
  { key: 'Shield', label: 'Shield', Icon: Shield },
  { key: 'Globe', label: 'Public', Icon: Globe },
  { key: 'Lock', label: 'Private', Icon: Lock },
  { key: 'Calendar', label: 'Events', Icon: Calendar },
  { key: 'Star', label: 'Star', Icon: Star },
  { key: 'Award', label: 'Award', Icon: Award },
  { key: 'Trophy', label: 'Trophy', Icon: Trophy },
  { key: 'Flag', label: 'Flag', Icon: Flag },
  { key: 'Eye', label: 'View', Icon: Eye },
  { key: 'EyeOff', label: 'Hidden', Icon: EyeOff },
];

export const AdminCommunity: React.FC = () => {
  const [spaces, setSpaces] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'spaces' | 'reports'>('spaces');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSpace, setEditingSpace] = useState<any>(null);

  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [iconSearch, setIconSearch] = useState('');

  // Create/Edit form state
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formIcon, setFormIcon] = useState('');
  const [formColor, setFormColor] = useState('#9333ea');
  const [formVisibility, setFormVisibility] = useState('public');
  const [formModeration, setFormModeration] = useState('semi');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { fetchSpaces(); fetchReports(); }, []);

  const fetchSpaces = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('community_spaces')
        .select('*, posts:community_posts(count), members:community_space_members(count)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setSpaces(data || []);
    } catch { toast.error('Failed to load spaces'); }
    finally { setIsLoading(false); }
  };

  const fetchReports = async () => {
    try {
      const data = await getReports();
      setReports(data);
    } catch { /* silent */ }
  };

  const openCreate = () => {
    setEditingSpace(null);
    setFormName(''); setFormDesc(''); setFormIcon(''); setFormColor('#9333ea');
    setFormVisibility('public'); setFormModeration('semi');
    setIconPickerOpen(false);
    setIconSearch('');
    setShowCreateModal(true);
  };

  const openEdit = (space: any) => {
    setEditingSpace(space);
    setFormName(space.name || ''); setFormDesc(space.description || '');
    setFormIcon(space.icon || ''); setFormColor(space.color || '#9333ea');
    setFormVisibility(space.visibility || 'public');
    setFormModeration(space.moderation_level || 'semi');
    setIconPickerOpen(false);
    setIconSearch('');
    setShowCreateModal(true);
  };

  const filteredIconOptions = useMemo(() => {
    const q = iconSearch.trim().toLowerCase();
    if (!q) return ICON_OPTIONS;
    return ICON_OPTIONS.filter((o) => o.key.toLowerCase().includes(q) || o.label.toLowerCase().includes(q));
  }, [iconSearch]);

  const handleSaveSpace = async () => {
    if (!formName.trim()) { toast.error('Name is required'); return; }
    setIsSaving(true);
    try {
      const payload = {
        name: formName, description: formDesc, icon: formIcon,
        color: formColor, visibility: formVisibility, moderation_level: formModeration,
      };
      if (editingSpace) {
        const { error } = await supabase.from('community_spaces').update(payload).eq('id', editingSpace.id);
        if (error) throw error;
        toast.success('Space updated');
      } else {
        const { error } = await supabase.from('community_spaces').insert(payload);
        if (error) throw error;
        toast.success('Space created');
      }
      setShowCreateModal(false);
      fetchSpaces();
    } catch { toast.error('Failed to save space'); }
    finally { setIsSaving(false); }
  };

  const handleDeleteSpace = async (id: string) => {
    if (!confirm('Delete this space and all its posts?')) return;
    try {
      const { error } = await supabase.from('community_spaces').delete().eq('id', id);
      if (error) throw error;
      setSpaces(prev => prev.filter(s => s.id !== id));
      toast.success('Space deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const handleResolveReport = async (reportId: string, resolution: 'approved' | 'rejected' | 'hidden') => {
    try {
      await resolveReport(reportId, resolution);
      setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: resolution } : r));
      toast.success(`Report ${resolution}`);
    } catch { toast.error('Failed to resolve report'); }
  };

  const filteredSpaces = spaces.filter(s => s.name?.toLowerCase().includes(searchQuery.toLowerCase()));
  const pendingReports = reports.filter(r => r.status === 'pending');

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Community</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage spaces, posts, and moderation</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={openCreate}>Create Space</Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-800">
        <button onClick={() => setActiveTab('spaces')} className={`pb-3 text-sm font-semibold border-b-2 transition ${activeTab === 'spaces' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500'}`}>
          <Users className="w-4 h-4 inline mr-1" /> Spaces ({spaces.length})
        </button>
        <button onClick={() => setActiveTab('reports')} className={`pb-3 text-sm font-semibold border-b-2 transition ${activeTab === 'reports' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500'}`}>
          <Flag className="w-4 h-4 inline mr-1" /> Reports {pendingReports.length > 0 && <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white text-[10px] rounded-full">{pendingReports.length}</span>}
        </button>
      </div>

      {activeTab === 'spaces' && (
        <>
          <Card className="p-4 mb-6">
            <Input placeholder="Search spaces..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} leftIcon={<Search className="w-4 h-4" />} />
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? Array(3).fill(0).map((_, i) => <div key={i} className="h-40 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse" />) :
            filteredSpaces.map(space => (
              <Card key={space.id} className="p-5 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ backgroundColor: (space.color || '#9333ea') + '20' }}>
                    <SpaceIcon value={space.icon} fallback={space.name?.charAt(0)} className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(space)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-400"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteSpace(space.id)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">{space.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{space.description}</p>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant={space.visibility === 'public' ? 'success' : space.visibility === 'private' ? 'warning' : 'info'} size="sm">{space.visibility}</Badge>
                  <Badge size="sm">{space.moderation_level || 'open'}</Badge>
                </div>
                <div className="mt-auto flex items-center gap-4 py-3 border-t border-gray-100 dark:border-gray-800">
                  <span className="text-xs font-bold text-gray-500"><Users className="w-3.5 h-3.5 inline mr-1 text-primary-500" />{space.members?.[0]?.count || 0}</span>
                  <span className="text-xs font-bold text-gray-500"><MessageSquare className="w-3.5 h-3.5 inline mr-1 text-blue-500" />{space.posts?.[0]?.count || 0}</span>
                </div>
              </Card>
            ))}
            {!isLoading && filteredSpaces.length === 0 && <div className="col-span-full py-20 text-center"><MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">No spaces found</p></div>}
          </div>
        </>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-4">
          {reports.length === 0 ? (
            <div className="py-20 text-center"><Flag className="w-12 h-12 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">No reports</p></div>
          ) : reports.map(report => (
            <Card key={report.id} className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={report.status === 'pending' ? 'warning' : report.status === 'hidden' ? 'error' : 'success'} size="sm">{report.status}</Badge>
                    <span className="text-xs text-gray-500">{report.created_at ? new Date(report.created_at).toLocaleDateString() : ''}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Reason: {report.reason}</p>
                  {report.details && <p className="text-sm text-gray-500 mb-2">{report.details}</p>}
                  {report.post?.content && <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{report.post.content}</div>}
                  <p className="text-xs text-gray-400 mt-2">Reported by: {report.reporter?.full_name || 'Unknown'} • Post by: {report.post?.author?.full_name || 'Unknown'}</p>
                </div>
                {report.status === 'pending' && (
                  <div className="flex items-center gap-2 ml-4">
                    <button onClick={() => handleResolveReport(report.id, 'approved')} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100" title="Dismiss"><CheckCircle className="w-4 h-4" /></button>
                    <button onClick={() => handleResolveReport(report.id, 'hidden')} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100" title="Hide Post"><EyeOff className="w-4 h-4" /></button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-gray-900 dark:text-white">{editingSpace ? 'Edit Space' : 'Create Space'}</h2>
              <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Name</label><Input value={formName} onChange={e => setFormName(e.target.value)} placeholder="e.g. New Moms" /></div>
              <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Description</label><textarea className="w-full h-20 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm outline-none resize-none" value={formDesc} onChange={e => setFormDesc(e.target.value)} placeholder="What is this space about?" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Icon</label>
                  <button
                    type="button"
                    onClick={() => setIconPickerOpen((v) => !v)}
                    className="w-full flex items-center justify-between gap-3 px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-9 h-9 rounded-xl flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <SpaceIcon value={formIcon} fallback={formName?.charAt(0)} className="w-5 h-5" />
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {formIcon ? formIcon : 'Choose an icon'}
                      </span>
                    </span>
                    <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${iconPickerOpen ? 'rotate-90' : ''}`} />
                  </button>

                  {iconPickerOpen && (
                    <div className="mt-2 p-3 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl">
                      <Input
                        value={iconSearch}
                        onChange={(e) => setIconSearch(e.target.value)}
                        placeholder="Search icons..."
                        leftIcon={<Search className="w-4 h-4" />}
                      />
                      <div className="mt-3 grid grid-cols-6 gap-2 max-h-40 overflow-auto">
                        {filteredIconOptions.map(({ key, label, Icon }) => (
                          <button
                            key={key}
                            type="button"
                            title={label}
                            onClick={() => {
                              setFormIcon(key);
                              setIconPickerOpen(false);
                            }}
                            className={`p-2 rounded-lg border transition-colors ${formIcon === key ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10' : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900'}`}
                          >
                            <Icon className="w-5 h-5 mx-auto text-gray-700 dark:text-gray-200" />
                          </button>
                        ))}
                      </div>
                      <div className="mt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => { setFormIcon(''); setIconPickerOpen(false); }}
                          className="text-xs font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Color</label><input type="color" value={formColor} onChange={e => setFormColor(e.target.value)} className="w-full h-10 rounded-xl border border-gray-200 dark:border-gray-800 cursor-pointer" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Visibility</label>
                  <select className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm outline-none" value={formVisibility} onChange={e => setFormVisibility(e.target.value)}>
                    <option value="public">Public</option><option value="private">Private</option><option value="invite_only">Invite Only</option>
                  </select>
                </div>
                <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Moderation</label>
                  <select className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm outline-none" value={formModeration} onChange={e => setFormModeration(e.target.value)}>
                    <option value="open">Open</option><option value="semi">Semi-moderated</option><option value="strict">Strict</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
              <Button onClick={handleSaveSpace} isLoading={isSaving} leftIcon={<Save className="w-4 h-4" />}>{editingSpace ? 'Update' : 'Create'}</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Video, Plus, Search, Calendar, Users, Trash2, Edit, ExternalLink, X, Save, Clock, Globe, Lock, DollarSign, Link, Upload } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { MediaUpload } from '../../components/ui/MediaUpload';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../../stores/authStore';
import { createWebinar, updateWebinar, deleteWebinar } from '../../core/webinar/webinar-service';

export const AdminWebinars: React.FC = () => {
  const { user } = useAuthStore();
  const [webinars, setWebinars] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingWebinar, setEditingWebinar] = useState<any>(null);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formType, setFormType] = useState('free');
  const [formDate, setFormDate] = useState('');
  const [formTime, setFormTime] = useState('');
  const [formDuration, setFormDuration] = useState('60');
  const [formCapacity, setFormCapacity] = useState('500');
  const [formPrice, setFormPrice] = useState('');
  const [formBanner, setFormBanner] = useState('');
  const [bannerMode, setBannerMode] = useState<'upload' | 'url'>('upload');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { fetchWebinars(); }, []);

  const fetchWebinars = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('webinars')
        .select('*, registrations:webinar_registrations(count)')
        .order('scheduled_at', { ascending: false });
      if (error) throw error;
      setWebinars((data || []).map((w: any) => ({ ...w, regCount: w.registrations?.[0]?.count || 0 })));
    } catch { toast.error('Failed to load webinars'); }
    finally { setIsLoading(false); }
  };

  const openCreate = () => {
    setEditingWebinar(null);
    setFormTitle(''); setFormDesc(''); setFormType('free'); setFormDate('');
    setFormTime(''); setFormDuration('60'); setFormCapacity('500'); setFormPrice(''); setFormBanner('');
    setBannerMode('upload');
    setShowModal(true);
  };

  const openEdit = (w: any) => {
    setEditingWebinar(w);
    setFormTitle(w.title || ''); setFormDesc(w.description || '');
    setFormType(w.is_free ? 'free' : 'paid'); setFormDate(w.scheduled_at || '');
    setFormTime(w.time || ''); setFormDuration(String(w.duration_minutes || 60));
    setFormCapacity(String(w.max_attendees || 500)); setFormPrice(String(w.price || ''));
    setFormBanner(w.thumbnail_url || w.banner_url || '');
    setBannerMode(w.thumbnail_url || w.banner_url ? 'url' : 'upload');
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formTitle.trim()) { toast.error('Title is required'); return; }
    setIsSaving(true);
    try {
      if (editingWebinar) {
        await updateWebinar(editingWebinar.id, {
          title: formTitle, description: formDesc, is_free: formType === 'free',
          scheduled_at: formDate, duration_minutes: parseInt(formDuration) || 60,
          max_attendees: parseInt(formCapacity) || 500, price: formPrice ? parseFloat(formPrice) : null,
          thumbnail_url: formBanner,
        });
        toast.success('Webinar updated');
      } else {
        await createWebinar({
          title: formTitle, description: formDesc, is_free: formType === 'free',
          scheduled_at: formDate, duration_minutes: parseInt(formDuration) || 60,
          max_attendees: parseInt(formCapacity) || 500, price: formPrice ? parseFloat(formPrice) : undefined,
          thumbnail_url: formBanner, host_id: user?.id || '',
        });
        toast.success('Webinar created');
      }
      setShowModal(false);
      fetchWebinars();
    } catch { toast.error('Failed to save webinar'); }
    finally { setIsSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this webinar?')) return;
    try {
      await deleteWebinar(id);
      setWebinars(prev => prev.filter(w => w.id !== id));
      toast.success('Webinar deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateWebinar(id, { status });
      setWebinars(prev => prev.map(w => w.id === id ? { ...w, status } : w));
      toast.success(`Status changed to ${status}`);
    } catch { toast.error('Failed to update status'); }
  };

  const filteredWebinars = webinars.filter(w => w.title?.toLowerCase().includes(searchQuery.toLowerCase()));

  const statusColor = (s: string) => {
    switch (s) { case 'live': return 'error'; case 'upcoming': return 'success'; case 'replay': return 'info'; default: return 'default'; }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Webinars</h1>
          <p className="text-gray-600 dark:text-gray-400">Schedule and manage live sessions</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={openCreate}>Schedule Webinar</Button>
      </div>

      <Card className="p-4 mb-6">
        <Input placeholder="Search webinars..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} leftIcon={<Search className="w-4 h-4" />} />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? Array(3).fill(0).map((_, i) => <div key={i} className="h-48 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse" />) :
        filteredWebinars.map(w => (
          <Card key={w.id} className="overflow-hidden flex flex-col">
            <div className="relative aspect-video">
              <img src={w.banner_url || w.thumbnail_url || 'https://images.unsplash.com/photo-1591115765373-520b7a217294?auto=format&fit=crop&q=80&w=800'} alt={w.title} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 flex gap-2">
                <Badge variant={statusColor(w.status)} size="sm">{(w.status || 'draft').toUpperCase()}</Badge>
                {w.type === 'paid' && w.price && <Badge size="sm">₦{Number(w.price).toLocaleString()}</Badge>}
                {w.type === 'free' && <Badge variant="warning" size="sm">FREE</Badge>}
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">{w.title}</h3>
              <div className="space-y-1.5 mb-4 text-sm text-gray-500 dark:text-gray-400">
                {w.date && <div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-primary-500" />{new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} {w.time && `• ${w.time}`}</div>}
                <div className="flex items-center gap-2"><Users className="w-3.5 h-3.5 text-blue-500" />{w.regCount || 0} registered {w.capacity && `/ ${w.capacity}`}</div>
              </div>

              {/* Status controls */}
              <div className="mb-3">
                <select className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-xs outline-none"
                  value={w.status || 'upcoming'} onChange={e => handleStatusChange(w.id, e.target.value)}>
                  <option value="upcoming">Upcoming</option>
                  <option value="live">Live</option>
                  <option value="replay">Replay</option>
                  <option value="ended">Ended</option>
                </select>
              </div>

              <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(w)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-gray-500"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(w.id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
                {w.meeting_url && <Button variant="outline" size="sm" onClick={() => window.open(w.meeting_url, '_blank')}><ExternalLink className="w-4 h-4 mr-1" />Join</Button>}
              </div>
            </div>
          </Card>
        ))}

        {!isLoading && filteredWebinars.length === 0 && (
          <div className="col-span-full py-20 text-center"><Video className="w-12 h-12 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">No webinars found</p></div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-gray-900 dark:text-white">{editingWebinar ? 'Edit Webinar' : 'Schedule Webinar'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Title</label><Input value={formTitle} onChange={e => setFormTitle(e.target.value)} placeholder="Webinar title" /></div>
              <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Description</label><textarea className="w-full h-20 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm outline-none resize-none" value={formDesc} onChange={e => setFormDesc(e.target.value)} placeholder="What will be covered?" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Type</label>
                  <select className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm outline-none" value={formType} onChange={e => setFormType(e.target.value)}>
                    <option value="free">Free</option><option value="paid">Paid</option><option value="members_only">Members Only</option><option value="cohort">Cohort</option>
                  </select>
                </div>
                {formType === 'paid' && <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Price (₦)</label><Input type="number" value={formPrice} onChange={e => setFormPrice(e.target.value)} placeholder="5000" /></div>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Date</label><Input type="date" value={formDate} onChange={e => setFormDate(e.target.value)} /></div>
                <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Time</label><Input type="time" value={formTime} onChange={e => setFormTime(e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Duration (min)</label><Input type="number" value={formDuration} onChange={e => setFormDuration(e.target.value)} /></div>
                <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Capacity</label><Input type="number" value={formCapacity} onChange={e => setFormCapacity(e.target.value)} /></div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Banner Image</label>
                  <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
                    <button
                      type="button"
                      onClick={() => setBannerMode('upload')}
                      className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${bannerMode === 'upload' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500'}`}
                    >
                      <Upload className="w-3 h-3 inline mr-1" />Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => setBannerMode('url')}
                      className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${bannerMode === 'url' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500'}`}
                    >
                      <Link className="w-3 h-3 inline mr-1" />URL
                    </button>
                  </div>
                </div>
                {bannerMode === 'upload' ? (
                  <MediaUpload
                    value={formBanner}
                    onChange={setFormBanner}
                    bucket="assets"
                    folder="webinars"
                    placeholder="Upload banner image"
                    className="h-32"
                  />
                ) : (
                  <Input value={formBanner} onChange={e => setFormBanner(e.target.value)} placeholder="https://example.com/banner.jpg" leftIcon={<Link className="w-4 h-4" />} />
                )}
                {formBanner && (
                  <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
                    <img src={formBanner} alt="Banner preview" className="w-full h-24 object-cover" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button onClick={handleSave} isLoading={isSaving} leftIcon={<Save className="w-4 h-4" />}>{editingWebinar ? 'Update' : 'Create'}</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

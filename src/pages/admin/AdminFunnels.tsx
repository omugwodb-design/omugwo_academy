import React, { useState, useEffect } from 'react';
import { Layers, Plus, Search, Edit, Trash2, Settings, ArrowRight, MousePointerClick, Save, X, ExternalLink } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

export const AdminFunnels: React.FC = () => {
    const [funnels, setFunnels] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingFunnel, setEditingFunnel] = useState<any>(null);

    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [status, setStatus] = useState('draft');

    useEffect(() => {
        fetchFunnels();
    }, []);

    const fetchFunnels = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('funnels')
                .select('*, steps:funnel_steps(count), leads:leads(count)')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setFunnels(data || []);
        } catch (err) {
            console.error('Error fetching funnels:', err);
            toast.error('Failed to load funnels');
        } finally {
            setIsLoading(false);
        }
    };

    const openCreate = () => {
        setEditingFunnel(null);
        setTitle('');
        setSlug('');
        setStatus('draft');
        setShowModal(true);
    };

    const openEdit = (funnel: any) => {
        setEditingFunnel(funnel);
        setTitle(funnel.title);
        setSlug(funnel.slug);
        setStatus(funnel.status);
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!title.trim() || !slug.trim()) {
            toast.error('Title and Slug are required');
            return;
        }

        try {
            const payload = {
                title,
                slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
                status,
                updated_at: new Date().toISOString()
            };

            if (editingFunnel) {
                const { error } = await supabase
                    .from('funnels')
                    .update(payload)
                    .eq('id', editingFunnel.id);
                if (error) throw error;
                toast.success('Funnel updated');
            } else {
                const { error } = await supabase
                    .from('funnels')
                    .insert(payload);
                if (error) throw error;
                toast.success('Funnel created');
            }

            setShowModal(false);
            fetchFunnels();
        } catch (err) {
            console.error('Error saving funnel:', err);
            toast.error('Failed to save funnel. Slug might not be unique.');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this funnel? All associated steps will be deleted.')) return;
        try {
            const { error } = await supabase.from('funnels').delete().eq('id', id);
            if (error) throw error;
            setFunnels(prev => prev.filter(f => f.id !== id));
            toast.success('Funnel deleted');
        } catch (err) {
            toast.error('Failed to delete funnel');
        }
    };

    const filteredFunnels = funnels.filter(f => f.title.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Sales Funnels</h1>
                    <p className="text-gray-600 dark:text-gray-400">Create multi-step flows to convert leads</p>
                </div>
                <Button leftIcon={<Plus className="w-4 h-4" />} onClick={openCreate}>Create Funnel</Button>
            </div>

            <Card className="p-4">
                <Input
                    placeholder="Search funnels..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    leftIcon={<Search className="w-4 h-4" />}
                />
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? Array(3).fill(0).map((_, i) => <div key={i} className="h-48 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-xl" />) :
                    filteredFunnels.map(funnel => (
                        <Card key={funnel.id} className="p-5 flex flex-col group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-primary-50 dark:bg-primary-500/10 text-primary-600 rounded-xl">
                                    <Layers className="w-6 h-6" />
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openEdit(funnel)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500">
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(funnel.id)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-red-500">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{funnel.title}</h3>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-xs font-mono text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">/{funnel.slug}</span>
                                <Badge variant={funnel.status === 'published' ? 'success' : 'default'} size="sm" className="uppercase text-[10px] tracking-wider">
                                    {funnel.status}
                                </Badge>
                            </div>
                            
                            <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-sm">
                                <div className="flex gap-4">
                                    <span className="text-gray-500"><strong className="text-gray-900 dark:text-white">{funnel.steps?.[0]?.count || 0}</strong> Steps</span>
                                    <span className="text-gray-500"><strong className="text-gray-900 dark:text-white">{funnel.leads?.[0]?.count || 0}</strong> Leads</span>
                                </div>
                                <Button variant="ghost" size="sm" className="px-2" rightIcon={<ArrowRight className="w-4 h-4" />}>Builder</Button>
                            </div>
                        </Card>
                    ))
                }
                {!isLoading && filteredFunnels.length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-500">No funnels found.</div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">{editingFunnel ? 'Edit Funnel' : 'New Funnel'}</h2>
                            <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-500" /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Title</label>
                                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Masterclass Sales Funnel" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">URL Slug</label>
                                <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="e.g. masterclass-promo" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Status</label>
                                <select 
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl"
                                    value={status} onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                            <Button onClick={handleSave} leftIcon={<Save className="w-4 h-4" />}>Save Funnel</Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

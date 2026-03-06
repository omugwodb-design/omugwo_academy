import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Trash2, Edit3, Save, X, ChevronDown } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

type CourseOption = { id: string; title: string };

type CouponRow = {
  id: string;
  code: string;
  name: string | null;
  description: string | null;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_purchase: number | null;
  is_active: boolean;
  valid_from: string | null;
  valid_until: string | null;
  max_uses: number | null;
  uses_count: number;
  course_ids: string[] | null;
  created_at: string;
};

const emptyDraft = () => ({
  id: null as string | null,
  code: '',
  name: '',
  description: '',
  discount_type: 'percentage' as 'percentage' | 'fixed',
  discount_value: 10,
  min_purchase: '',
  is_active: true,
  valid_from: '',
  valid_until: '',
  max_uses: '',
  course_ids: [] as string[],
});

export const AdminCoupons: React.FC = () => {
  const [coupons, setCoupons] = useState<CouponRow[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<any>(emptyDraft());

  const loadCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('id, title')
        .eq('is_published', true)
        .order('title');
      if (!error && data) setCourses(data);
    } catch (e) {
      console.error('Failed to load courses:', e);
    }
  };

  const load = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCoupons((data || []) as any);
    } catch (e: any) {
      console.error(e);
      toast.error('Failed to load coupons');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
    loadCourses();
  }, []);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return coupons;
    return coupons.filter((c) => (c.code || '').toLowerCase().includes(q) || (c.name || '').toLowerCase().includes(q));
  }, [coupons, searchQuery]);

  const startCreate = () => {
    setDraft(emptyDraft());
    setIsEditing(true);
  };

  const startEdit = (c: CouponRow) => {
    setDraft({
      id: c.id,
      code: c.code,
      name: c.name || '',
      description: c.description || '',
      discount_type: c.discount_type,
      discount_value: c.discount_value,
      min_purchase: c.min_purchase ?? '',
      is_active: !!c.is_active,
      valid_from: c.valid_from ? String(c.valid_from).slice(0, 16) : '',
      valid_until: c.valid_until ? String(c.valid_until).slice(0, 16) : '',
      max_uses: c.max_uses ?? '',
      course_ids: c.course_ids || [],
    });
    setIsEditing(true);
  };

  const save = async () => {
    try {
      const payload: any = {
        code: String(draft.code || '').trim().toUpperCase(),
        name: draft.name ? String(draft.name).trim() : null,
        description: draft.description ? String(draft.description).trim() : null,
        discount_type: draft.discount_type,
        discount_value: Number(draft.discount_value || 0),
        min_purchase: draft.min_purchase === '' ? null : Number(draft.min_purchase || 0),
        is_active: !!draft.is_active,
        valid_from: draft.valid_from ? new Date(draft.valid_from).toISOString() : null,
        valid_until: draft.valid_until ? new Date(draft.valid_until).toISOString() : null,
        max_uses: draft.max_uses === '' ? null : Number(draft.max_uses),
        course_ids: Array.isArray(draft.course_ids) && draft.course_ids.length > 0 ? draft.course_ids : null,
      };

      if (!payload.code) {
        toast.error('Coupon code is required');
        return;
      }

      if (!payload.discount_value || payload.discount_value <= 0) {
        toast.error('Discount value must be greater than 0');
        return;
      }

      if (payload.discount_type === 'percentage' && payload.discount_value > 100) {
        toast.error('Percent discount cannot exceed 100');
        return;
      }

      if (draft.id) {
        const { error } = await supabase.from('coupons').update(payload).eq('id', draft.id);
        if (error) throw error;
        toast.success('Coupon updated');
      } else {
        const { error } = await supabase.from('coupons').insert(payload);
        if (error) throw error;
        toast.success('Coupon created');
      }

      setIsEditing(false);
      setDraft(emptyDraft());
      await load();
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || 'Failed to save coupon');
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this coupon?')) return;
    try {
      const { error } = await supabase.from('coupons').delete().eq('id', id);
      if (error) throw error;
      toast.success('Coupon deleted');
      await load();
    } catch (e: any) {
      console.error(e);
      toast.error('Failed to delete coupon');
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Coupons</h1>
          <p className="text-gray-600 dark:text-gray-400">Create and manage discount codes</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={startCreate}>
          New Coupon
        </Button>
      </div>

      <Card className="p-4 mb-6 bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-100/50 dark:border-gray-800/80 shadow-sm">
        <Input
          placeholder="Search by code or name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
      </Card>

      {isEditing && (
        <Card className="p-5 mb-6 bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-100/50 dark:border-gray-800/80 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Code" value={draft.code} onChange={(e) => setDraft({ ...draft, code: e.target.value })} />
            <Input label="Name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            <Input label="Description" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Discount Type</label>
              <select
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950"
                value={draft.discount_type}
                onChange={(e) => setDraft({ ...draft, discount_type: e.target.value })}
              >
                <option value="percentage">Percent</option>
                <option value="fixed">Fixed</option>
              </select>
            </div>
            <Input
              label={draft.discount_type === 'percentage' ? 'Discount %' : 'Discount Amount (₦)'}
              type="number"
              value={draft.discount_value}
              onChange={(e) => setDraft({ ...draft, discount_value: e.target.value })}
            />
            <Input label="Minimum Purchase (optional)" type="number" value={draft.min_purchase} onChange={(e) => setDraft({ ...draft, min_purchase: e.target.value })} />
            <Input label="Valid From (optional)" type="datetime-local" value={draft.valid_from} onChange={(e) => setDraft({ ...draft, valid_from: e.target.value })} />
            <Input label="Valid Until (optional)" type="datetime-local" value={draft.valid_until} onChange={(e) => setDraft({ ...draft, valid_until: e.target.value })} />
            <Input label="Max Uses (optional)" type="number" value={draft.max_uses} onChange={(e) => setDraft({ ...draft, max_uses: e.target.value })} />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Apply to Courses (optional - leave empty for all courses)
              </label>
              <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 min-h-[44px]">
                {(draft.course_ids || []).map((cid: string) => {
                  const course = courses.find((c) => c.id === cid);
                  return (
                    <span
                      key={cid}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg text-xs font-medium"
                    >
                      {course?.title || cid.slice(0, 8)}
                      <button
                        type="button"
                        onClick={() =>
                          setDraft({
                            ...draft,
                            course_ids: (draft.course_ids || []).filter((id: string) => id !== cid),
                          })
                        }
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
                <select
                  className="flex-1 min-w-[150px] bg-transparent text-sm outline-none"
                  value=""
                  onChange={(e) => {
                    const nextId = e.target.value;
                    const current = Array.isArray(draft.course_ids) ? draft.course_ids : [];
                    if (nextId && !current.includes(nextId)) {
                      setDraft({ ...draft, course_ids: [...current, nextId] });
                    }
                  }}
                >
                  <option value="">+ Add course...</option>
                  {courses
                    .filter((c) => !(Array.isArray(draft.course_ids) ? draft.course_ids : []).includes(c.id))
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input
                id="is_active"
                type="checkbox"
                checked={!!draft.is_active}
                onChange={(e) => setDraft({ ...draft, is_active: e.target.checked })}
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700 dark:text-gray-300">Active</label>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-5">
            <Button leftIcon={<Save className="w-4 h-4" />} onClick={save}>
              Save
            </Button>
            <Button
              variant="outline"
              leftIcon={<X className="w-4 h-4" />}
              onClick={() => {
                setIsEditing(false);
                setDraft(emptyDraft());
              }}
            >
              Cancel
            </Button>
          </div>
        </Card>
      )}

      <Card className="overflow-hidden bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-100/50 dark:border-gray-800/80 shadow-sm">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8">Loading…</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50/80 dark:bg-gray-800/80 border-b border-gray-100 dark:border-gray-800">
                <tr>
                  <th className="px-5 py-4 text-left text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Code</th>
                  <th className="px-5 py-4 text-left text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="px-5 py-4 text-left text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Value</th>
                  <th className="px-5 py-4 text-left text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Usage</th>
                  <th className="px-5 py-4 text-left text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-4 text-left text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-mono text-xs font-bold text-gray-900 dark:text-gray-100">{c.code}</p>
                      {c.name && <p className="text-xs text-gray-500">{c.name}</p>}
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-gray-700 dark:text-gray-200">{c.discount_type}</td>
                    <td className="px-5 py-4 text-sm font-bold text-gray-900 dark:text-gray-100">
                      {c.discount_type === 'percentage' ? `${Number(c.discount_value)}%` : `₦${Number(c.discount_value).toLocaleString()}`}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {c.uses_count}{c.max_uses != null ? ` / ${c.max_uses}` : ''}
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={c.is_active ? 'success' : 'warning'}>{c.is_active ? 'Active' : 'Inactive'}</Badge>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl text-gray-600 dark:text-gray-300 transition-colors"
                          title="Edit"
                          onClick={() => startEdit(c)}
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-xl text-red-600 transition-colors"
                          title="Delete"
                          onClick={() => remove(c.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No coupons found</p>
          </div>
        )}
      </Card>
    </div>
  );
};

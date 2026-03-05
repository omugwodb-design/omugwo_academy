import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus, Search, Filter, MoreVertical, Edit, Trash2, Eye,
  BookOpen, Users, DollarSign, Clock, CheckCircle, XCircle, LayoutTemplate
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';

import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

export const AdminCourses: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          instructor:users (name),
          modules (count),
          enrollments (count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mapped = (data || []).map((c: any) => ({
        ...c,
        instructorName: c.instructor?.name || 'No Instructor',
        modulesCount: c.modules?.[0]?.count || 0,
        enrollmentsCount: c.enrollments?.[0]?.count || 0,
      }));

      setCourses(mapped);
    } catch (err) {
      console.error('Error fetching admin courses:', err);
      toast.error('Failed to load courses');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' ||
      (filterStatus === 'published' && course.is_published) ||
      (filterStatus === 'draft' && !course.is_published);
    return matchesSearch && matchesFilter;
  });

  const toggleSelectCourse = (id: string) => {
    setSelectedCourses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const totalRevenue = courses.reduce((sum, c) => sum + ((Number(c.price) || 0) * (c.enrollmentsCount || 0)), 0);
  const totalEnrollments = courses.reduce((sum, c) => sum + (c.enrollmentsCount || 0), 0);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Courses</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your course catalog</p>
        </div>
        <Link to="/admin/courses/new">
          <Button leftIcon={<Plus className="w-4 h-4" />}>
            Create Course
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-5 flex flex-col justify-between relative overflow-hidden group bg-white/60 dark:bg-gray-900/40 backdrop-blur-xl border border-gray-100/50 dark:border-gray-800/80 hover:-translate-y-1 transition duration-300 shadow-sm hover:shadow-xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-5 rounded-bl-full group-hover:scale-150 transition duration-500" />
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-500/20 rounded-2xl flex items-center justify-center text-primary-600 dark:text-primary-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{courses.length}</p>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider">Total Courses</p>
            </div>
          </div>
        </Card>
        <Card className="p-5 flex flex-col justify-between relative overflow-hidden group bg-white/60 dark:bg-gray-900/40 backdrop-blur-xl border border-gray-100/50 dark:border-gray-800/80 hover:-translate-y-1 transition duration-300 shadow-sm hover:shadow-xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-5 rounded-bl-full group-hover:scale-150 transition duration-500" />
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-500/20 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{courses.filter(c => c.is_published).length}</p>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider">Published</p>
            </div>
          </div>
        </Card>
        <Card className="p-5 flex flex-col justify-between relative overflow-hidden group bg-white/60 dark:bg-gray-900/40 backdrop-blur-xl border border-gray-100/50 dark:border-gray-800/80 hover:-translate-y-1 transition duration-300 shadow-sm hover:shadow-xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-5 rounded-bl-full group-hover:scale-150 transition duration-500" />
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{totalEnrollments.toLocaleString()}</p>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider">Total Enrollments</p>
            </div>
          </div>
        </Card>
        <Card className="p-5 flex flex-col justify-between relative overflow-hidden group bg-white/60 dark:bg-gray-900/40 backdrop-blur-xl border border-gray-100/50 dark:border-gray-800/80 hover:-translate-y-1 transition duration-300 shadow-sm hover:shadow-xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-5 rounded-bl-full group-hover:scale-150 transition duration-500" />
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-500/20 rounded-2xl flex items-center justify-center text-yellow-600 dark:text-yellow-400">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">₦{(totalRevenue / 1000000).toFixed(1)}M</p>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider">Total Revenue</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6 bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-100/50 dark:border-gray-800/80 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'published', 'draft'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${filterStatus === status
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Courses Table */}
      <Card className="overflow-hidden bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-100/50 dark:border-gray-800/80 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80 dark:bg-gray-800/80 border-b border-gray-100 dark:border-gray-800">
              <tr>
                <th className="px-5 py-4 text-left">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 accent-primary-600"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCourses(new Set(courses.map(c => c.id)));
                      } else {
                        setSelectedCourses(new Set());
                      }
                    }}
                  />
                </th>
                <th className="px-5 py-4 text-left text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Course</th>
                <th className="px-5 py-4 text-left text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Instructor</th>
                <th className="px-5 py-4 text-left text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                <th className="px-5 py-4 text-left text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Enrollments</th>
                <th className="px-5 py-4 text-left text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Revenue</th>
                <th className="px-5 py-4 text-left text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-5 py-4 text-left text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
              {filteredCourses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-5 py-4">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 accent-primary-600"
                      checked={selectedCourses.has(course.id)}
                      onChange={() => toggleSelectCourse(course.id)}
                    />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={course.thumbnail_url || 'https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=200'}
                        alt={course.title}
                        className="w-12 h-12 rounded-xl object-cover ring-1 ring-gray-100 dark:ring-gray-800/60 shadow-sm"
                      />
                      <div>
                        <p className="font-bold text-sm text-gray-900 dark:text-white mb-0.5">{course.title}</p>
                        <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                          {course.modulesCount || 0} modules
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">{course.instructorName}</td>
                  <td className="px-5 py-4 text-sm font-bold text-gray-900 dark:text-white">₦{Number(course.price).toLocaleString()}</td>
                  <td className="px-5 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">{(course.enrollmentsCount || 0).toLocaleString()}</td>
                  <td className="px-5 py-4 text-sm font-bold text-green-600 dark:text-green-400">₦{((Number(course.price) || 0) * (course.enrollmentsCount || 0)).toLocaleString()}</td>
                  <td className="px-5 py-4">
                    <Badge variant={course.is_published ? 'success' : 'warning'}>
                      {course.is_published ? 'Published' : 'Draft'}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link to={`/admin/site-builder?type=course_sales&courseId=${course.id}`}>
                        <button className="p-2 bg-gray-50 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-xl text-primary-600 dark:text-primary-400 transition-colors tooltip" title="Design Sales Page">
                          <LayoutTemplate className="w-4 h-4" />
                        </button>
                      </Link>
                      <Link to={`/courses/${course.slug}`}>
                        <button className="p-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl text-gray-500 dark:text-gray-400 transition-colors" title="View Course">
                          <Eye className="w-4 h-4" />
                        </button>
                      </Link>
                      <Link to={`/admin/courses/${course.id}/edit`}>
                        <button className="p-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl text-gray-500 dark:text-gray-400 transition-colors" title="Edit Content">
                          <Edit className="w-4 h-4" />
                        </button>
                      </Link>
                      <button className="p-2 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-xl text-red-500 transition-colors" title="Delete Course">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading courses...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No courses found</p>
          </div>
        ) : null}
      </Card>
    </div>
  );
};

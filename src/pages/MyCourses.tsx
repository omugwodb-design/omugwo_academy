import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    BookOpen, Play, Award, Clock, CheckCircle, ArrowRight,
    Filter, Search, BookMarked, Lock
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { toast } from 'react-hot-toast';
import type { Enrollment } from '../types';

type FilterType = 'all' | 'active' | 'completed';

export const MyCourses: React.FC = () => {
    const { user } = useAuthStore();
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<FilterType>('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!user) return;
        const loadEnrollments = async () => {
            try {
                setIsLoading(true);
                const { data, error } = await supabase
                    .from('enrollments')
                    .select(`
                        *,
                        course:courses (*)
                    `)
                    .eq('user_id', user.id);

                if (error) throw error;
                setEnrollments(data as any[]);
            } catch (err) {
                console.error('Failed to load enrollments:', err);
                toast.error('Failed to load your courses');
            } finally {
                setIsLoading(false);
            }
        };
        loadEnrollments();
    }, [user]);

    const filtered = enrollments.filter((e) => {
        const matchesFilter = filter === 'all' || e.status === filter;
        const matchesSearch = !searchQuery || e.course?.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const stats = {
        total: enrollments.length,
        completed: enrollments.filter((e) => e.status === 'completed').length,
        active: enrollments.filter((e) => e.status === 'active').length,
        avgProgress: enrollments.length
            ? Math.round(enrollments.reduce((s, e) => s + e.progress, 0) / enrollments.length)
            : 0,
    };

    const filterButtons: { key: FilterType; label: string }[] = [
        { key: 'all', label: 'All Courses' },
        { key: 'active', label: 'In Progress' },
        { key: 'completed', label: 'Completed' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 mb-1">My Courses</h1>
                            <p className="text-gray-500">Continue your postnatal learning journey</p>
                        </div>
                        <Link to="/courses">
                            <Button rightIcon={<ArrowRight className="w-4 h-4" />}>
                                Browse More Courses
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                {/* Stats Row */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                >
                    {[
                        { label: 'Enrolled Courses', value: stats.total, icon: BookOpen, color: 'bg-primary-100 text-primary-600' },
                        { label: 'In Progress', value: stats.active, icon: Play, color: 'bg-blue-100 text-blue-600' },
                        { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'bg-green-100 text-green-600' },
                        { label: 'Avg. Progress', value: `${stats.avgProgress}%`, icon: Clock, color: 'bg-yellow-100 text-yellow-600' },
                    ].map((stat) => (
                        <Card key={stat.label} className="p-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                            <p className="text-xs text-gray-500">{stat.label}</p>
                        </Card>
                    ))}
                </motion.div>

                {/* Filter & Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6"
                >
                    <div className="flex gap-2 flex-wrap">
                        {filterButtons.map(({ key, label }) => (
                            <button
                                key={key}
                                onClick={() => setFilter(key)}
                                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${filter === key
                                    ? 'bg-primary-600 text-white shadow-md'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white"
                        />
                    </div>
                </motion.div>

                {/* Course Cards */}
                {isLoading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-3xl overflow-hidden shadow animate-pulse">
                                <div className="h-48 bg-gray-200" />
                                <div className="p-6 space-y-3">
                                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                                    <div className="h-2 bg-gray-200 rounded w-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookMarked className="w-10 h-10 text-primary-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No courses found</h3>
                        <p className="text-gray-500 mb-6">
                            {filter !== 'all'
                                ? `You have no ${filter === 'active' ? 'in-progress' : 'completed'} courses yet.`
                                : 'You haven\'t enrolled in any courses yet. Browse our catalogue to get started.'}
                        </p>
                        <Link to="/courses">
                            <Button>Browse Courses</Button>
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((enrollment, idx) => (
                            <motion.div
                                key={enrollment.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + idx * 0.05 }}
                            >
                                <Card hover className="p-0 overflow-hidden flex flex-col h-full">
                                    {/* Thumbnail */}
                                    <div className="relative">
                                        <img
                                            src={enrollment.course?.thumbnailUrl}
                                            alt={enrollment.course?.title}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="absolute top-3 right-3">
                                            {enrollment.status === 'completed' ? (
                                                <Badge variant="success">Completed</Badge>
                                            ) : (
                                                <Badge variant="default">In Progress</Badge>
                                            )}
                                        </div>
                                        {enrollment.status === 'completed' && (
                                            <div className="absolute inset-0 bg-green-900/20 flex items-center justify-center">
                                                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl">
                                                    <CheckCircle className="w-8 h-8 text-green-500" />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-5 flex flex-col flex-1">
                                        <h3 className="font-bold text-gray-900 mb-1 leading-snug">
                                            {enrollment.course?.title}
                                        </h3>
                                        {enrollment.course?.durationHours && (
                                            <p className="text-xs text-gray-400 flex items-center gap-1 mb-3">
                                                <Clock className="w-3 h-3" />
                                                {enrollment.course.durationHours} hours total
                                            </p>
                                        )}

                                        {/* Progress */}
                                        <div className="mb-4">
                                            <div className="flex items-center justify-between mb-1.5">
                                                <span className="text-xs text-gray-500">Progress</span>
                                                <span className="text-xs font-bold text-primary-600">{Math.round(enrollment.progress)}%</span>
                                            </div>
                                            <ProgressBar value={enrollment.progress} size="sm" />
                                        </div>

                                        {/* Enrolled date */}
                                        <p className="text-xs text-gray-400 mb-4">
                                            Enrolled {new Date(enrollment.enrolledAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>

                                        {/* CTA */}
                                        <div className="mt-auto">
                                            {enrollment.status === 'completed' ? (
                                                <div className="flex gap-2">
                                                    <Link to={`/learn/${enrollment.courseId}`} className="flex-1">
                                                        <Button variant="outline" size="sm" className="w-full" leftIcon={<Play className="w-4 h-4" />}>
                                                            Rewatch
                                                        </Button>
                                                    </Link>
                                                    <Link to={`/certificates/${enrollment.courseId}`}>
                                                        <Button size="sm" leftIcon={<Award className="w-4 h-4" />}>
                                                            Certificate
                                                        </Button>
                                                    </Link>
                                                </div>
                                            ) : (
                                                <Link to={`/learn/${enrollment.courseId}`}>
                                                    <Button size="sm" className="w-full" leftIcon={<Play className="w-4 h-4" />}>
                                                        Continue Learning
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

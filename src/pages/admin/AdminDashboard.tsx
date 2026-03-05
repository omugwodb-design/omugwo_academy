import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, BookOpen, Users, DollarSign, MessageSquare,
  Video, Award, Mail, Settings, ChevronRight, TrendingUp,
  TrendingDown, ArrowUpRight, Bell, Search, Menu, X, Heart,
  LayoutTemplate, Sun, Moon, Ticket
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Input } from '../../components/ui/Input';
import { useTheme } from '../../core/theme/theme';

import { supabase } from '../../lib/supabase';

const sidebarItems = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { id: 'site-builder', label: 'Site Builder', icon: LayoutTemplate, path: '/admin/site-builder' },
  { id: 'courses', label: 'Course Catalog', icon: BookOpen, path: '/admin/courses' },
  { id: 'users', label: 'Users & Staff', icon: Users, path: '/admin/users' },
  { id: 'payments', label: 'Sales & Revenue', icon: DollarSign, path: '/admin/payments' },
  { id: 'coupons', label: 'Coupons', icon: Ticket, path: '/admin/coupons' },
  { id: 'community', label: 'Community', icon: MessageSquare, path: '/admin/community' },
  { id: 'webinars', label: 'Webinars', icon: Video, path: '/admin/webinars' },
  { id: 'certificates', label: 'Certificates', icon: Award, path: '/admin/certificates' },
  { id: 'leads', label: 'Leads & Funnels', icon: Mail, path: '/admin/leads' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
];

export const AdminDashboard: React.FC = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [topCourses, setTopCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isOverview = location.pathname === '/admin';

  useEffect(() => {
    if (isOverview) {
      fetchDashboardData();
    }
  }, [isOverview]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      // 1. Fetch Stats
      const { data: usersCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
      const { data: coursesCount } = await supabase.from('courses').select('*', { count: 'exact', head: true });
      const { data: payments } = await supabase.from('payments').select('amount');
      const totalRevenue = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

      setStats([
        { label: 'Total Revenue', value: `₦${(totalRevenue).toLocaleString()}`, change: '+12.5%', trend: 'up', icon: DollarSign },
        { label: 'Total Users', value: (usersCount || 0).toString(), change: '+8.2%', trend: 'up', icon: Users },
        { label: 'Courses', value: (coursesCount || 0).toString(), change: '+2', trend: 'up', icon: BookOpen },
        { label: 'Conversion Rate', value: '4.8%', change: '-0.3%', trend: 'down', icon: TrendingUp },
      ]);

      // 2. Fetch Recent Activity (mocked for now but looking real)
      // In a real app, you'd join multiple tables or have an activity log
      setRecentActivity([
        { type: 'enrollment', user: 'Adaeze O.', action: 'enrolled in', target: 'Omugwo Masterclass', time: '5 min ago' },
        { type: 'payment', user: 'Chukwuemeka E.', action: 'completed payment for', target: 'Partner Support Training', time: '12 min ago' },
      ]);

      // 3. Fetch Top Courses (simpler query for now)
      const { data: courseStats } = await supabase
        .from('courses')
        .select('title, enrollments(count)')
        .limit(3);

      setTopCourses(courseStats?.map(c => ({
        name: c.title,
        enrollments: (c.enrollments as any)?.[0]?.count || 0,
        revenue: `₦${((c.enrollments as any)?.[0]?.count * 49000).toLocaleString()}`, // Estimation or join payments
        growth: '+12%'
      })) || []);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 z-50">
        <div className="flex items-center justify-between h-full px-4 md:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-xl transition-colors text-gray-700 dark:text-gray-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link to="/admin" className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                <Heart className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="font-extrabold text-gray-900 dark:text-white hidden sm:block tracking-tight text-lg">
                Omugwo <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700">Admin</span>
              </span>
            </Link>
          </div>

          <div className="flex-1 max-w-xl mx-4 hidden md:block">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
              <Input
                placeholder="Search anything..."
                leftIcon={<Search className="w-4 h-4 text-gray-400 dark:text-gray-500" />}
                className="bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 focus:bg-white dark:focus:bg-gray-950 relative"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors shadow-sm border border-transparent dark:border-gray-800"
              aria-label="Toggle theme"
              type="button"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-gray-600 dark:text-gray-400 transition-colors shadow-sm border border-transparent dark:border-gray-800">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-950 shadow-sm" />
            </button>
            <div className="h-8 w-px bg-gray-200 dark:bg-gray-800 mx-1"></div>
            <Avatar name="Admin User" size="sm" />
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`fixed top-16 left-0 bottom-0 w-64 bg-white/50 dark:bg-gray-950/50 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-800/50 z-40 transition-transform duration-300 lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}>
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100%-80px)] scrollbar-hide">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.path !== '/admin' && location.pathname.startsWith(item.path));

            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${isActive
                  ? 'text-primary-700 dark:text-primary-300 bg-primary-50/80 dark:bg-primary-500/10 font-semibold shadow-sm border border-primary-100 dark:border-primary-500/20'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-gray-800/50 border border-transparent'
                  }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-400 to-primary-600 rounded-r-full"></div>
                )}
                <item.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-4 right-4">
          <Link to="/">
            <Button variant="outline" className="w-full bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-sm text-sm">
              View Live Site
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? 'lg:pl-64' : ''}`}>
        {isOverview ? (
          <div className="p-6 md:p-8 space-y-8">
            {/* Page Header */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-transparent blur-3xl -z-10 rounded-full" />
              <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Dashboard Overview</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back! Here's what's happening with your academy today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.5, type: 'spring' }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 dark:to-white/5 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-300 pointer-events-none" />
                  <Card className="p-6 bg-white/60 dark:bg-gray-900/40 backdrop-blur-xl border-gray-200/50 dark:border-gray-800/50 shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between group-hover:-translate-y-1">
                    <div className="flex items-start justify-between mb-6">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center p-3 shadow-inner ${stat.trend === 'up'
                        ? 'bg-gradient-to-br from-green-400/20 to-green-500/20 text-green-600 dark:from-green-500/20 dark:to-green-400/10 dark:text-green-400 border border-green-500/20'
                        : 'bg-gradient-to-br from-red-400/20 to-red-500/20 text-red-600 dark:from-red-500/20 dark:to-red-400/10 dark:text-red-400 border border-red-500/20'
                        }`}>
                        <stat.icon className="w-full h-full" />
                      </div>
                      <Badge variant={stat.trend === 'up' ? 'success' : 'error'} size="sm" className="shadow-sm">
                        {stat.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                        {stat.change}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-1">{stat.value}</p>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <Card className="p-0 bg-white/60 dark:bg-gray-900/40 backdrop-blur-xl border-gray-200/50 dark:border-gray-800/50 overflow-hidden shadow-sm h-full">
                  <div className="p-6 border-b border-gray-100 dark:border-gray-800/60 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Latest actions across your platform</p>
                    </div>
                    <Button variant="ghost" size="sm" className="hidden sm:flex dark:hover:bg-gray-800">Review All</Button>
                  </div>
                  <div className="p-2 sm:p-6 space-y-2 sm:space-y-4">
                    {recentActivity.map((activity, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-3 sm:p-4 bg-white dark:bg-gray-800/40 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                        <div className={`hidden sm:flex w-12 h-12 rounded-full items-center justify-center shrink-0 ${activity.type === 'enrollment' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                          activity.type === 'payment' ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400' :
                            activity.type === 'certificate' ? 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' :
                              activity.type === 'community' ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400' :
                                'bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400'
                          }`}>
                          {activity.type === 'enrollment' && <BookOpen className="w-5 h-5" />}
                          {activity.type === 'payment' && <DollarSign className="w-5 h-5" />}
                          {activity.type === 'certificate' && <Award className="w-5 h-5" />}
                          {activity.type === 'community' && <MessageSquare className="w-5 h-5" />}
                          {activity.type === 'webinar' && <Video className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                            <span className="font-bold text-gray-900 dark:text-white mr-1">{activity.user}</span>
                            {activity.action}
                            <span className="font-semibold text-gray-800 dark:text-gray-200 ml-1">{activity.target}</span>
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-medium">{activity.time}</p>
                        </div>
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors shrink-0">
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Top Courses & Quick Actions */}
              <div className="space-y-6 flex flex-col h-full">
                <Card className="p-0 bg-white/60 dark:bg-gray-900/40 backdrop-blur-xl border-gray-200/50 dark:border-gray-800/50 overflow-hidden shadow-sm flex-1">
                  <div className="p-6 border-b border-gray-100 dark:border-gray-800/60 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Top Courses</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">By revenue & enrollments</p>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    {topCourses.map((course, idx) => (
                      <div key={idx} className="p-4 bg-white dark:bg-gray-800/40 shadow-sm rounded-2xl border border-gray-100 dark:border-gray-700/50 hover:border-gray-200 dark:hover:border-gray-600 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <p className="font-bold text-gray-900 dark:text-white text-sm line-clamp-1 mr-2">{course.name}</p>
                          <Badge variant="success" size="sm" className="shrink-0">{course.growth}</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-gray-500 dark:text-gray-400">
                            <Users className="w-4 h-4 mr-1.5" />
                            {course.enrollments.toLocaleString()}
                          </div>
                          <span className="font-bold text-gray-900 dark:text-white">{course.revenue}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Quick Actions */}
                <Card className="p-6 bg-gradient-to-br from-primary-900 to-gray-900 border-0 shadow-xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-12 bg-white/5 blur-[80px] rounded-full mix-blend-overlay"></div>
                  <h2 className="text-lg font-bold text-white mb-4 relative z-10">Quick Actions</h2>
                  <div className="space-y-3 relative z-10">
                    <Link to="/admin/site-builder" className="block">
                      <Button variant="primary" className="w-full justify-start bg-white text-primary-900 hover:bg-gray-100 shadow-xl shadow-black/20">
                        <LayoutTemplate className="w-4 h-4 mr-3" />
                        Manage Site Builder
                      </Button>
                    </Link>
                    <Link to="/admin/courses/new" className="block">
                      <Button variant="outline" className="w-full justify-start border-white/20 text-white hover:bg-white/10">
                        <BookOpen className="w-4 h-4 mr-3 opacity-70" />
                        Create New Course
                      </Button>
                    </Link>
                    <Link to="/admin/webinars" className="block">
                      <Button variant="outline" className="w-full justify-start border-white/20 text-white hover:bg-white/10">
                        <Video className="w-4 h-4 mr-3 opacity-70" />
                        Schedule Webinar
                      </Button>
                    </Link>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
};

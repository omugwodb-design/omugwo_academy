import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen, Play, Users, Award, Clock, ArrowRight,
  Calendar, Bell, TrendingUp, CheckCircle
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Avatar } from '../components/ui/Avatar';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';

const upcomingEvents = [
  {
    id: 1,
    title: "Live Q&A with Dr. Megor",
    date: "Tomorrow, 3:00 PM",
    type: "webinar",
  },
  {
    id: 2,
    title: "New Moms Support Circle",
    date: "Friday, 5:00 PM",
    type: "community",
  },
];

const recentActivity = [
  { action: "Completed lesson", item: "Body Recovery Basics", time: "2 hours ago" },
  { action: "Earned badge", item: "Week 1 Champion", time: "Yesterday" },
  { action: "Posted in community", item: "New Moms Space", time: "2 days ago" },
];

const achievements = [
  { name: "First Steps", description: "Complete your first lesson", earned: true },
  { name: "Week 1 Champion", description: "Complete 7 lessons in a week", earned: true },
  { name: "Community Star", description: "Make 10 community posts", earned: false },
  { name: "Course Graduate", description: "Complete a full course", earned: false },
];

import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = React.useState<any[]>([]);
  const [dashboardStats, setDashboardStats] = React.useState({
    coursesEnrolled: 0,
    lessonsDone: 0,
    hoursLearned: 0,
    badgesEarned: 0
  });
  const [dynamicAchievements, setDynamicAchievements] = React.useState<any[]>([]);
  const [dynamicEvents, setDynamicEvents] = React.useState<any[]>([]);
  const [dynamicActivity, setDynamicActivity] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'super_admin')) {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

  React.useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return;
      setIsLoading(true);
      try {
        // Fetch enrollments
        const { data: enrollments, error } = await supabase
          .from('enrollments')
          .select('*, course:courses(*)')
          .eq('user_id', user.id);

        if (error) throw error;

        // Fetch lesson progress
        const { data: progress } = await supabase
          .from('lesson_progress')
          .select('id, lesson_id, is_completed, watch_time_seconds, completed_at, lessons(title)')
          .eq('user_id', user.id);

        // Fetch badges
        const { data: userBadges } = await supabase
          .from('user_badges')
          .select('*, badge:badges(*)')
          .eq('user_id', user.id);

        // Calculate Stats
        const coursesEnrolled = enrollments?.length || 0;
        const lessonsDone = progress?.filter(p => p.is_completed)?.length || 0;
        const totalWatchTimeSeconds = progress?.reduce((acc, p) => acc + (p.watch_time_seconds || 0), 0) || 0;
        const hoursLearned = +(totalWatchTimeSeconds / 3600).toFixed(1);
        const badgesEarned = userBadges?.length || 0;

        setDashboardStats({
          coursesEnrolled,
          lessonsDone,
          hoursLearned,
          badgesEarned
        });

        // Set enrolled courses with progress
        const coursesWithProgress = await Promise.all((enrollments || []).map(async (enr) => {
          const course = enr.course;
          if (!course) return null;

          const { data: modules } = await supabase
            .from('modules')
            .select('id, lessons(id)')
            .eq('course_id', course.id);

          const totalLessons = modules?.reduce((acc, mod) => acc + (mod.lessons?.length || 0), 0) || 0;

          let completedCount = 0;
          if (modules && progress) {
            const lessonIds = modules.flatMap(m => m.lessons.map((l: any) => l.id));
            completedCount = progress.filter(p => p.is_completed && lessonIds.includes(p.lesson_id)).length;
          }

          const progressPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

          return {
            id: course.id,
            title: course.title,
            progress: progressPct,
            nextLesson: "Continue Learning",
            image: course.thumbnail_url || "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=400",
            totalLessons,
            completedLessons: completedCount,
            slug: course.slug
          };
        }));

        setEnrolledCourses(coursesWithProgress.filter(Boolean));

        // Format achievements
        const formattedAchievements = [
          { name: "First Steps", description: "Complete your first lesson", earned: lessonsDone > 0 },
          { name: "Week 1 Champion", description: "Complete 7 lessons", earned: lessonsDone >= 7 },
          { name: "Course Graduate", description: "Complete a full course", earned: coursesWithProgress.some(c => c && c.progress === 100) },
        ];
        // Add badges from db
        if (userBadges) {
          userBadges.forEach(ub => {
            if (ub.badge) {
              formattedAchievements.push({
                name: ub.badge.name,
                description: ub.badge.description || "Earned badge",
                earned: true
              });
            }
          });
        }
        setDynamicAchievements(formattedAchievements);

        // Fetch recent events
        const nowIso = new Date().toISOString();
        const { data: events } = await supabase
          .from('webinars')
          .select('*')
          .gte('scheduled_at', nowIso)
          .order('scheduled_at', { ascending: true })
          .limit(3);

        if (events) {
          setDynamicEvents(events.map(e => ({
            id: e.id,
            title: e.title,
            date: e.scheduled_at
              ? new Date(e.scheduled_at).toLocaleString('en-US', { weekday: 'long', hour: 'numeric', minute: 'numeric', hour12: true })
              : '',
            type: e.type === 'community' ? 'community' : 'webinar'
          })));
        }

        // Format activity log
        const activities = [];
        if (progress) {
          const completedProgress = progress.filter(p => p.is_completed && p.completed_at);
          completedProgress.sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime());
          completedProgress.slice(0, 3).forEach(p => {
            activities.push({
              action: "Completed lesson",
              item: (Array.isArray(p.lessons) ? p.lessons[0]?.title : (p.lessons as any)?.title) || 'A lesson',
              time: new Date(p.completed_at).toLocaleDateString(),
              timestamp: new Date(p.completed_at).getTime()
            });
          });
        }
        if (userBadges) {
          userBadges.slice(0, 2).forEach(ub => {
            activities.push({
              action: "Earned badge",
              item: ub.badge?.name || 'A badge',
              time: ub.earned_at ? new Date(ub.earned_at).toLocaleDateString() : 'Recently',
              timestamp: ub.earned_at ? new Date(ub.earned_at).getTime() : 0
            });
          });
        }
        activities.sort((a, b) => b.timestamp - a.timestamp);
        setDynamicActivity(activities.slice(0, 4));

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20 pb-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 relative">
        {/* Background Decorative Blur */}
        <div className="absolute top-0 right-0 -mt-20 w-96 h-96 bg-primary-400/20 dark:bg-primary-900/30 rounded-full blur-[100px] pointer-events-none -z-10" />

        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center justify-between flex-wrap gap-4 bg-white/40 dark:bg-gray-900/40 p-6 md:p-8 rounded-3xl border border-white/60 dark:border-gray-800/60 backdrop-blur-xl shadow-sm">
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
                Welcome back, {user?.fullName?.split(' ')[0] || 'there'}! <span className="inline-block animate-bounce origin-bottom-right">👋</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400 font-medium">Continue your learning journey where you left off.</p>
            </div>
            <Link to="/courses">
              <Button rightIcon={<ArrowRight className="w-4 h-4" />} className="shadow-lg shadow-primary-500/20">
                Browse Courses
              </Button>
            </Link>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Continue Learning */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                  <Play className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  Continue Learning
                </h2>
                <Link to="/my-courses" className="text-primary-600 dark:text-primary-400 text-sm font-semibold hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                  View All &rarr;
                </Link>
              </div>

              <div className="space-y-4">
                {isLoading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-36 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                    <div className="h-36 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                  </div>
                ) : enrolledCourses.length > 0 ? (
                  enrolledCourses.map((course) => (
                    <Link key={course.id} to={`/courses/${course.slug || course.id}/learn`} className="block">
                      <Card hover className="p-0 overflow-hidden bg-white/70 dark:bg-gray-900/50 backdrop-blur-md border border-gray-100 dark:border-gray-800/60 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-gray-200 dark:hover:border-gray-700/60 group">
                        <div className="flex flex-col sm:flex-row">
                          <div className="relative w-full sm:w-48 h-36">
                            <img
                              src={course.image}
                              alt={course.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent sm:hidden" />
                          </div>
                          <div className="p-5 flex-1 flex flex-col justify-between">
                            <div>
                              <h3 className="font-bold text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{course.title}</h3>
                              <p className="text-sm font-medium text-primary-600 dark:text-primary-400 mb-3 bg-primary-50 dark:bg-primary-500/10 inline-block px-2.5 py-1 rounded-md">
                                Next: {course.nextLesson}
                              </p>
                            </div>
                            <div className="flex items-center justify-between gap-6">
                              <div className="flex-1">
                                <div className="flex justify-between text-xs font-semibold mb-1.5">
                                  <span className="text-gray-700 dark:text-gray-300">Progress</span>
                                  <span className="text-primary-600 dark:text-primary-400">{course.progress}%</span>
                                </div>
                                <ProgressBar value={course.progress} size="sm" />
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 font-medium">
                                  {course.completedLessons} of {course.totalLessons} lessons completed
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))
                ) : (
                  <Card className="p-8 text-center bg-white/70 dark:bg-gray-900/50">
                    <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No courses yet</h3>
                    <p className="text-gray-500 mb-6">Browse our catalog to start your learning journey.</p>
                    <Link to="/courses">
                      <Button>Explore Courses</Button>
                    </Link>
                  </Card>
                )}
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                {[
                  { label: 'Courses Enrolled', value: dashboardStats.coursesEnrolled.toString(), icon: BookOpen, color: 'from-blue-500 to-indigo-600', text: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-500/20' },
                  { label: 'Lessons Done', value: dashboardStats.lessonsDone.toString(), icon: CheckCircle, color: 'from-green-400 to-emerald-600', text: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-500/20' },
                  { label: 'Hours Learned', value: dashboardStats.hoursLearned.toString(), icon: Clock, color: 'from-amber-400 to-orange-500', text: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-500/20' },
                  { label: 'Badges Earned', value: dashboardStats.badgesEarned.toString(), icon: Award, color: 'from-purple-500 to-pink-600', text: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-500/20' },
                ].map((stat) => (
                  <Card key={stat.label} className="p-5 flex flex-col justify-between relative overflow-hidden group bg-white/60 dark:bg-gray-900/40 backdrop-blur-xl border-gray-100/50 dark:border-gray-800/80 hover:-translate-y-1 transition duration-300 shadow-sm hover:shadow-xl">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-5 rounded-bl-full group-hover:scale-150 transition duration-500" />
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${stat.bg}`}>
                      <stat.icon className={`w-6 h-6 ${stat.text}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{stat.value}</p>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider">{stat.label}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight mt-8">Achievements & Badges</h2>
              <Card className="p-6 bg-white/60 dark:bg-gray-900/40 backdrop-blur-xl border border-gray-100 dark:border-gray-800/60 shadow-sm">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {dynamicAchievements.map((achievement) => (
                    <div
                      key={achievement.name}
                      className={`text-center p-4 rounded-2xl border transition-all duration-300 ${achievement.earned ? 'bg-gradient-to-b from-primary-50 to-white dark:from-primary-900/20 dark:to-gray-900/50 border-primary-100 dark:border-primary-800/30' : 'bg-gray-50/50 dark:bg-gray-800/30 border-dashed border-gray-200 dark:border-gray-700/50 grayscale opacity-70'
                        }`}
                    >
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner ${achievement.earned ? 'bg-gradient-to-br from-primary-400 to-primary-600 text-white shadow-primary-500/40' : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                        }`}>
                        <Award className="w-7 h-7" />
                      </div>
                      <p className={`font-bold text-sm mb-1 ${achievement.earned ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>{achievement.name}</p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-500 leading-tight">{achievement.description}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 bg-white/70 dark:bg-gray-900/50 backdrop-blur-md shadow-sm border border-gray-100 dark:border-gray-800/60 h-full">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-800/60">
                  <h3 className="font-bold text-gray-900 dark:text-white flex items-center">
                    Upcoming Events <span className="ml-2 w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  </h3>
                  <Calendar className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-5">
                  {dynamicEvents.map((event) => (
                    <div key={event.id} className="flex items-start gap-4 group">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${event.type === 'webinar' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400'
                        }`}>
                        {event.type === 'webinar' ? <Play className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{event.title}</p>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">{event.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/webinars" className="block mt-6">
                  <Button variant="ghost" size="sm" className="w-full bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                    View All Schedule
                  </Button>
                </Link>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6 bg-white/70 dark:bg-gray-900/50 backdrop-blur-md shadow-sm border border-gray-100 dark:border-gray-800/60 mt-6">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-800/60">
                  <h3 className="font-bold text-gray-900 dark:text-white">Activity Log</h3>
                  <Bell className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-5">
                  {dynamicActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="mt-1 relative flex items-center justify-center">
                        <div className="w-3 h-3 bg-primary-500 rounded-full shadow-sm shadow-primary-500/40 z-10" />
                        {index !== dynamicActivity.length - 1 && (
                          <div className="absolute top-3 w-px h-10 bg-gray-200 dark:bg-gray-800" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-gray-800 dark:text-gray-200">
                          <span className="font-bold text-gray-900 dark:text-white">{activity.action}</span>
                          <span className="mx-1.5 text-gray-400">•</span>
                          <span className="text-gray-600 dark:text-gray-400">{activity.item}</span>
                        </p>
                        <p className="text-[11px] font-semibold text-primary-600 dark:text-primary-400 mt-1 uppercase tracking-wider">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Community Highlight */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6 bg-gradient-to-br from-primary-600 to-primary-700 text-white border-0">
                <Users className="w-8 h-8 mb-4 opacity-80" />
                <h3 className="font-bold mb-2">Join the Conversation</h3>
                <p className="text-sm text-primary-100 mb-4">
                  Connect with other parents in our community spaces.
                </p>
                <Link to="/community">
                  <Button variant="secondary" size="sm" className="w-full">
                    Visit Community
                  </Button>
                </Link>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

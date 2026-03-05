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

const enrolledCourses = [
  {
    id: 'moms-course',
    title: "The Omugwo Masterclass for Moms",
    progress: 65,
    nextLesson: "Module 3: Cultural Balance",
    image: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=400",
    totalLessons: 48,
    completedLessons: 31,
  },
  {
    id: 'essential',
    title: "Essential Postnatal Care",
    progress: 30,
    nextLesson: "Module 2: Feeding & Nutrition",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400",
    totalLessons: 32,
    completedLessons: 10,
  },
];

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

  React.useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'super_admin')) {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

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
                {enrolledCourses.map((course) => (
                  <Card key={course.id} hover className="p-0 overflow-hidden bg-white/70 dark:bg-gray-900/50 backdrop-blur-md border border-gray-100 dark:border-gray-800/60 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-gray-200 dark:hover:border-gray-700/60 group">
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
                          <Link to={`/learn/${course.id}`}>
                            <Button size="sm" className="shadow-md bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 hidden sm:flex">
                              Resume
                            </Button>
                            <Button size="sm" className="shadow-md bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 sm:hidden">
                              <Play className="w-4 h-4 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
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
                  { label: 'Courses Enrolled', value: '2', icon: BookOpen, color: 'from-blue-500 to-indigo-600', text: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-500/20' },
                  { label: 'Lessons Done', value: '41', icon: CheckCircle, color: 'from-green-400 to-emerald-600', text: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-500/20' },
                  { label: 'Hours Learned', value: '12.5', icon: Clock, color: 'from-amber-400 to-orange-500', text: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-500/20' },
                  { label: 'Badges Earned', value: '2', icon: Award, color: 'from-purple-500 to-pink-600', text: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-500/20' },
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
                  {achievements.map((achievement) => (
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
                  {upcomingEvents.map((event) => (
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
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="mt-1 relative flex items-center justify-center">
                        <div className="w-3 h-3 bg-primary-500 rounded-full shadow-sm shadow-primary-500/40 z-10" />
                        {index !== recentActivity.length - 1 && (
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

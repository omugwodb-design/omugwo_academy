import React from 'react';
import { BarChart3, BookOpen, DollarSign, TrendingUp, Users } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { supabase } from '../../lib/supabase';

type CourseRow = {
  id: string;
  title: string;
  slug: string;
  price: number | null;
  currency: string | null;
  is_published: boolean | null;
  created_at: string;
};

type EnrollmentRow = {
  id: string;
  course_id: string;
  status: string | null;
  enrolled_at: string | null;
  completed_at: string | null;
};

type PaymentRow = {
  id: string;
  course_id: string | null;
  amount: any;
  status: string | null;
  created_at: string;
};

type LessonProgressRow = {
  lesson_id: string;
  is_completed: boolean | null;
  watch_time_seconds: number | null;
  completed_at: string | null;
};

type QuizRow = {
  id: string;
  course_id: string | null;
};

type QuizAttemptRow = {
  quiz_id: string;
  score: number | null;
  passed: boolean | null;
  completed_at: string;
};

type CourseMetrics = {
  courseId: string;
  title: string;
  slug: string;
  isPublished: boolean;
  currency: string;
  price: number;

  totalEnrollments: number;
  activeEnrollments: number;
  completedEnrollments: number;
  completionRatePct: number;

  revenue: number;
  paidOrders: number;

  totalWatchTimeHours: number;
  avgWatchTimeHoursPerEnrollment: number;

  quizAttempts: number;
  quizPassRatePct: number;
  quizAvgScore: number;

  enrollmentsByMonth: { month: string; count: number }[];
};

function monthKey(iso: string) {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

export const AdminCourseAnalytics: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [metrics, setMetrics] = React.useState<CourseMetrics[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    void load();
  }, []);

  const load = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: courses, error: cErr } = await supabase
        .from('courses')
        .select('id, title, slug, price, currency, is_published, created_at')
        .order('created_at', { ascending: false });
      if (cErr) throw cErr;

      const { data: enrollments, error: eErr } = await supabase
        .from('enrollments')
        .select('id, course_id, status, enrolled_at, completed_at')
        .order('enrolled_at', { ascending: false });
      if (eErr) throw eErr;

      const { data: payments, error: pErr } = await supabase
        .from('payments')
        .select('id, course_id, amount, status, created_at')
        .eq('status', 'completed')
        .order('created_at', { ascending: false });
      if (pErr) throw pErr;

      const { data: lessonMap, error: lMapErr } = await supabase
        .from('lessons')
        .select('id, module:modules(course_id)');
      if (lMapErr) throw lMapErr;

      const lessonIdToCourseId = new Map<string, string>();
      for (const row of (lessonMap || []) as any[]) {
        const courseId = row?.module?.[0]?.course_id as string | null | undefined;
        if (courseId) lessonIdToCourseId.set(row.id, courseId);
      }

      const { data: progress, error: progErr } = await supabase
        .from('lesson_progress')
        .select('lesson_id, is_completed, watch_time_seconds, completed_at');
      if (progErr) throw progErr;

      const { data: quizzes, error: qErr } = await supabase
        .from('quizzes')
        .select('id, course_id');
      if (qErr) throw qErr;

      const quizIdToCourseId = new Map<string, string>();
      for (const q of (quizzes || []) as QuizRow[]) {
        if (q.course_id) quizIdToCourseId.set(q.id, q.course_id);
      }

      const { data: quizAttempts, error: qaErr } = await supabase
        .from('quiz_responses')
        .select('quiz_id, score, passed, completed_at');
      if (qaErr) throw qaErr;

      const courseIds = new Set<string>(((courses || []) as CourseRow[]).map((c) => c.id));

      const enrollmentsByCourse = new Map<string, EnrollmentRow[]>();
      for (const enr of (enrollments || []) as EnrollmentRow[]) {
        if (!courseIds.has(enr.course_id)) continue;
        const list = enrollmentsByCourse.get(enr.course_id) || [];
        list.push(enr);
        enrollmentsByCourse.set(enr.course_id, list);
      }

      const paymentsByCourse = new Map<string, PaymentRow[]>();
      for (const pay of (payments || []) as PaymentRow[]) {
        if (!pay.course_id) continue;
        if (!courseIds.has(pay.course_id)) continue;
        const list = paymentsByCourse.get(pay.course_id) || [];
        list.push(pay);
        paymentsByCourse.set(pay.course_id, list);
      }

      const progressByCourse = new Map<string, LessonProgressRow[]>();
      for (const pr of (progress || []) as LessonProgressRow[]) {
        const courseId = lessonIdToCourseId.get(pr.lesson_id);
        if (!courseId) continue;
        if (!courseIds.has(courseId)) continue;
        const list = progressByCourse.get(courseId) || [];
        list.push(pr);
        progressByCourse.set(courseId, list);
      }

      const quizAttemptsByCourse = new Map<string, QuizAttemptRow[]>();
      for (const a of (quizAttempts || []) as QuizAttemptRow[]) {
        const courseId = quizIdToCourseId.get(a.quiz_id);
        if (!courseId) continue;
        if (!courseIds.has(courseId)) continue;
        const list = quizAttemptsByCourse.get(courseId) || [];
        list.push(a);
        quizAttemptsByCourse.set(courseId, list);
      }

      const computed: CourseMetrics[] = ((courses || []) as CourseRow[]).map((c) => {
        const cEnrollments = enrollmentsByCourse.get(c.id) || [];
        const totalEnrollments = cEnrollments.length;
        const activeEnrollments = cEnrollments.filter((e) => (e.status || 'active') === 'active').length;
        const completedEnrollments = cEnrollments.filter((e) => (e.status || '') === 'completed').length;
        const completionRatePct = totalEnrollments > 0 ? Math.round((completedEnrollments / totalEnrollments) * 100) : 0;

        const cPayments = paymentsByCourse.get(c.id) || [];
        const revenue = cPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
        const paidOrders = cPayments.length;

        const cProgress = progressByCourse.get(c.id) || [];
        const totalWatchTimeSeconds = cProgress.reduce((sum, p) => sum + Number(p.watch_time_seconds || 0), 0);
        const totalWatchTimeHours = +(totalWatchTimeSeconds / 3600).toFixed(1);
        const avgWatchTimeHoursPerEnrollment = totalEnrollments > 0 ? +(totalWatchTimeHours / totalEnrollments).toFixed(1) : 0;

        const cAttempts = quizAttemptsByCourse.get(c.id) || [];
        const quizAttemptsCount = cAttempts.length;
        const quizPassRatePct = quizAttemptsCount > 0 ? Math.round((cAttempts.filter((a) => !!a.passed).length / quizAttemptsCount) * 100) : 0;
        const quizAvgScore = quizAttemptsCount > 0
          ? +(cAttempts.reduce((sum, a) => sum + Number(a.score || 0), 0) / quizAttemptsCount).toFixed(1)
          : 0;

        const byMonthMap = new Map<string, number>();
        for (const e of cEnrollments) {
          const date = e.enrolled_at || e.completed_at;
          if (!date) continue;
          const k = monthKey(date);
          byMonthMap.set(k, (byMonthMap.get(k) || 0) + 1);
        }
        const enrollmentsByMonth = [...byMonthMap.entries()]
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([month, count]) => ({ month, count }));

        return {
          courseId: c.id,
          title: c.title,
          slug: c.slug,
          isPublished: !!c.is_published,
          currency: c.currency || 'NGN',
          price: Number(c.price || 0),

          totalEnrollments,
          activeEnrollments,
          completedEnrollments,
          completionRatePct,

          revenue,
          paidOrders,

          totalWatchTimeHours,
          avgWatchTimeHoursPerEnrollment,

          quizAttempts: quizAttemptsCount,
          quizPassRatePct,
          quizAvgScore,

          enrollmentsByMonth,
        };
      });

      setMetrics(computed);
    } catch (e: any) {
      console.error(e);
      setError(e?.message || 'Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  };

  const totals = React.useMemo(() => {
    const totalRevenue = metrics.reduce((sum, m) => sum + m.revenue, 0);
    const totalEnrollments = metrics.reduce((sum, m) => sum + m.totalEnrollments, 0);
    const totalCompleted = metrics.reduce((sum, m) => sum + m.completedEnrollments, 0);
    const completionRate = totalEnrollments > 0 ? Math.round((totalCompleted / totalEnrollments) * 100) : 0;
    return { totalRevenue, totalEnrollments, completionRate };
  }, [metrics]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Course Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Revenue, enrollment, progress, and quiz performance across your catalog.</p>
        </div>
      </div>

      {error && (
        <Card className="p-4 border border-red-200 dark:border-red-900 bg-red-50/60 dark:bg-red-950/30">
          <p className="text-sm text-red-700 dark:text-red-300 font-medium">{error}</p>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-100/50 dark:border-gray-800/80">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest font-bold text-gray-400">Total Revenue</p>
              <p className="text-2xl font-black text-gray-900 dark:text-white">₦{totals.totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="w-6 h-6 text-primary-600" />
          </div>
        </Card>
        <Card className="p-5 bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-100/50 dark:border-gray-800/80">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest font-bold text-gray-400">Enrollments</p>
              <p className="text-2xl font-black text-gray-900 dark:text-white">{totals.totalEnrollments.toLocaleString()}</p>
            </div>
            <Users className="w-6 h-6 text-primary-600" />
          </div>
        </Card>
        <Card className="p-5 bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-100/50 dark:border-gray-800/80">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest font-bold text-gray-400">Completion Rate</p>
              <p className="text-2xl font-black text-gray-900 dark:text-white">{totals.completionRate}%</p>
            </div>
            <TrendingUp className="w-6 h-6 text-primary-600" />
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-100/50 dark:border-gray-800/80 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80 dark:bg-gray-800/80 border-b border-gray-100 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Course</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Enrollments</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Completion</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Watch Time</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quiz</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
              {isLoading ? (
                Array(6).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {[...Array(6)].map((__, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : metrics.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No courses found</p>
                  </td>
                </tr>
              ) : (
                metrics.map((m) => (
                  <tr key={m.courseId} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{m.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={m.isPublished ? 'success' : 'info'} className="uppercase text-[10px] tracking-widest font-bold px-2 py-1">
                            {m.isPublished ? 'Published' : 'Draft'}
                          </Badge>
                          <span className="text-xs text-gray-500 dark:text-gray-400 truncate">/{m.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{m.totalEnrollments.toLocaleString()}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Active: {m.activeEnrollments.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{m.completionRatePct}%</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Completed: {m.completedEnrollments.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">₦{m.revenue.toLocaleString()}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Orders: {m.paidOrders.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{m.totalWatchTimeHours}h</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Avg/enr: {m.avgWatchTimeHoursPerEnrollment}h</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">Pass: {m.quizPassRatePct}%</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Avg score: {m.quizAvgScore} ({m.quizAttempts})</p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminCourseAnalytics;

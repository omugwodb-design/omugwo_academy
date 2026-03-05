import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, ChevronLeft, ChevronRight, ChevronDown, CheckCircle,
  FileText, Download, MessageCircle, BookOpen, Clock,
  Award, HelpCircle, ClipboardList, Loader2, Trophy, StickyNote, Send,
  Upload, X, Menu, Flame, PenTool, ExternalLink, Bookmark,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { toast } from 'react-hot-toast';
import {
  markLessonComplete, getLessonProgress, getQuiz, submitQuizAttempt,
  getCertificate, updateStreak, submitAssignment,
} from '../core/lms/lms-service';

export const LearningExperience: React.FC = () => {
  const { courseId, lessonId } = useParams();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const isPreview = new URLSearchParams(location.search).get('preview') === 'true';

  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [lessonProgress, setLessonProgress] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'resources' | 'notes' | 'discussion'>('overview');
  const [isCompleting, setIsCompleting] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [notes, setNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [stickyNotes, setStickyNotes] = useState<any[]>([]);
  const [showStickyPanel, setShowStickyPanel] = useState(false);
  const [newStickyText, setNewStickyText] = useState('');
  const [stickyColor, setStickyColor] = useState('#fef08a');
  const [quizData, setQuizData] = useState<any>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizResult, setQuizResult] = useState<any>(null);
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);
  const [quizTimer, setQuizTimer] = useState<number | null>(null);
  const [assignmentData, setAssignmentData] = useState<any>(null);
  const [assignmentText, setAssignmentText] = useState('');
  const [isSubmittingAssignment, setIsSubmittingAssignment] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [certificate, setCertificate] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => { if (courseId) fetchCourseData(); }, [courseId, lessonId, user]);

  const fetchCourseData = async () => {
    try {
      setIsLoading(true);
      const { data: cd, error: ce } = await supabase.from('courses').select('*').eq('id', courseId).single();
      if (ce) throw ce;
      setCourse(cd);
      const { data: md, error: me } = await supabase.from('modules').select('*, lessons(*)').eq('course_id', courseId).order('order_index', { ascending: true });
      if (me) throw me;
      const sorted = (md || []).map((m: any) => ({ ...m, lessons: (m.lessons || []).sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0)) }));
      setModules(sorted);
      let lesson = null;
      if (lessonId) { for (const mod of sorted) { const f = mod.lessons.find((l: any) => l.id === lessonId); if (f) { lesson = f; setExpandedModule(mod.id); break; } } }
      if (!lesson && sorted.length > 0 && sorted[0].lessons.length > 0) { lesson = sorted[0].lessons[0]; setExpandedModule(sorted[0].id); }
      setCurrentLesson(lesson);
      if (user && !isPreview) { const p = await getLessonProgress(user.id, courseId!); setLessonProgress(p); }
    } catch (err) { console.error(err); toast.error('Failed to load course'); } finally { setIsLoading(false); }
  };

  useEffect(() => {
    if (!currentLesson?.id) return;
    setQuizData(null); setQuizAnswers({}); setQuizResult(null); setAssignmentData(null); setAssignmentText(''); setSubmissionResult(null);
    if (currentLesson.type === 'quiz') loadQuiz(currentLesson.id);
    if (currentLesson.type === 'assignment') loadAssignment(currentLesson.id);
    loadNotes(); loadStickyNotes();
  }, [currentLesson?.id]);

  const loadQuiz = async (lId: string) => { try { const q = await getQuiz(lId); setQuizData(q); if (q?.time_limit_minutes) setQuizTimer(q.time_limit_minutes * 60); } catch { setQuizData(null); } };
  const loadAssignment = async (lId: string) => {
    try {
      const { data } = await supabase.from('assignments').select('*').eq('lesson_id', lId).maybeSingle();
      setAssignmentData(data);
      if (user && data) { const { data: s } = await supabase.from('assignment_submissions').select('*').eq('assignment_id', data.id).eq('user_id', user.id).order('submitted_at', { ascending: false }).limit(1).maybeSingle(); if (s) setSubmissionResult(s); }
    } catch { setAssignmentData(null); }
  };
  const loadNotes = async () => { if (!user || !currentLesson?.id) return; try { const { data } = await supabase.from('lesson_notes').select('content').eq('user_id', user.id).eq('lesson_id', currentLesson.id).maybeSingle(); setNotes(data?.content || ''); } catch { setNotes(''); } };
  const loadStickyNotes = async () => { if (!user || !currentLesson?.id) return; try { const { data } = await supabase.from('sticky_notes').select('*').eq('user_id', user.id).eq('lesson_id', currentLesson.id).order('created_at', { ascending: false }); setStickyNotes(data || []); } catch { setStickyNotes([]); } };

  useEffect(() => {
    if (quizTimer === null || quizTimer <= 0 || quizResult) return;
    const iv = setInterval(() => { setQuizTimer(p => { if (p === null || p <= 1) { handleSubmitQuiz(); return 0; } return p - 1; }); }, 1000);
    return () => clearInterval(iv);
  }, [quizTimer, quizResult]);

  const isLessonCompleted = (id: string) => lessonProgress.some(p => p.lesson_id === id && (p.is_completed || p.completed));
  const getAllLessons = () => { const a: any[] = []; modules.forEach(m => (m.lessons || []).forEach((l: any) => a.push(l))); return a; };
  const getNext = () => { const a = getAllLessons(); const i = a.findIndex(l => l.id === currentLesson?.id); return i >= 0 && i < a.length - 1 ? a[i + 1] : null; };
  const getPrev = () => { const a = getAllLessons(); const i = a.findIndex(l => l.id === currentLesson?.id); return i > 0 ? a[i - 1] : null; };
  const goNext = () => { const n = getNext(); if (n && courseId) navigate(`/learn/${courseId}/${n.id}`); };
  const goPrev = () => { const p = getPrev(); if (p && courseId) navigate(`/learn/${courseId}/${p.id}`); };
  const getLessonContent = () => { if (!currentLesson?.content) return ''; if (typeof currentLesson.content === 'string') return currentLesson.content; return currentLesson.content.body || currentLesson.content.prompt || currentLesson.content.description || ''; };
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  const totalLessons = modules.reduce((a, m) => a + (m.lessons?.length || 0), 0);
  const completedCount = modules.reduce((a, m) => a + (m.lessons?.filter((l: any) => isLessonCompleted(l.id)).length || 0), 0);
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const handleCompleteLesson = async () => {
    if (isPreview) { toast.success('Preview: completion simulated'); return; }
    if (!user || !courseId || !currentLesson) return;
    setIsCompleting(true);
    try {
      await markLessonComplete(user.id, courseId, currentLesson.id);
      await updateStreak(user.id);
      setLessonProgress(await getLessonProgress(user.id, courseId));
      toast.success('Lesson completed!');
      const n = getNext();
      if (n) navigate(`/learn/${courseId}/${n.id}`);
      else { const { data: e } = await supabase.from('enrollments').select('status').eq('user_id', user.id).eq('course_id', courseId).single(); if (e?.status === 'completed') setCertificate(await getCertificate(user.id, courseId)); }
    } catch { toast.error('Failed to update progress'); } finally { setIsCompleting(false); }
  };

  const handleSubmitQuiz = async () => {
    if (!user || !quizData) return;
    setIsSubmittingQuiz(true);
    try {
      const r = await submitQuizAttempt(quizData.id, user.id, quizAnswers);
      setQuizResult(r); setQuizTimer(null);
      if (r.passed) { toast.success(`Passed! ${r.score}%`); await markLessonComplete(user.id, courseId!, currentLesson.id); setLessonProgress(await getLessonProgress(user.id, courseId!)); }
      else toast.error(`${r.score}%. Need ${quizData.passing_score || 70}% to pass.`);
    } catch { toast.error('Failed to submit quiz'); } finally { setIsSubmittingQuiz(false); }
  };

  const handleSubmitAssignment = async () => {
    if (!user || !assignmentData) return;
    setIsSubmittingAssignment(true);
    try { const r = await submitAssignment(assignmentData.id, user.id, { content: assignmentText, file_urls: [] }); setSubmissionResult(r); toast.success('Assignment submitted!'); }
    catch { toast.error('Failed to submit'); } finally { setIsSubmittingAssignment(false); }
  };

  const handleSaveNotes = async () => {
    if (!user || !currentLesson?.id) return;
    setIsSavingNotes(true);
    try { await supabase.from('lesson_notes').upsert({ user_id: user.id, lesson_id: currentLesson.id, course_id: courseId, content: notes, updated_at: new Date().toISOString() }, { onConflict: 'user_id,lesson_id' }); toast.success('Notes saved'); }
    catch { toast.error('Failed to save notes'); } finally { setIsSavingNotes(false); }
  };

  const handleAddSticky = async () => {
    if (!user || !currentLesson?.id || !newStickyText.trim()) return;
    try {
      const { data } = await supabase.from('sticky_notes').insert({ user_id: user.id, lesson_id: currentLesson.id, course_id: courseId, content: newStickyText, color: stickyColor, video_timestamp: Math.floor(videoRef.current?.currentTime || 0) }).select().single();
      if (data) { setStickyNotes(p => [data, ...p]); setNewStickyText(''); toast.success('Note added'); }
    } catch { toast.error('Failed to add note'); }
  };

  const handleDeleteSticky = async (id: string) => { try { await supabase.from('sticky_notes').delete().eq('id', id); setStickyNotes(p => p.filter(s => s.id !== id)); } catch {} };

  useEffect(() => { if (user && courseId && progressPercent >= 100) getCertificate(user.id, courseId).then(c => setCertificate(c)).catch(() => {}); }, [progressPercent]);

  const iconForType = (t: string) => { const m: Record<string, any> = { video: Play, text: FileText, pdf: FileText, quiz: HelpCircle, assignment: ClipboardList, reflection: PenTool, live_session: ExternalLink }; return m[t] || BookOpen; };

  if (isLoading) return (<div className="min-h-screen bg-gray-950 flex items-center justify-center"><div className="w-14 h-14 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>);
  if (!course || !currentLesson) return (<div className="min-h-screen bg-gray-950 flex items-center justify-center p-4"><div className="text-center"><BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" /><h2 className="text-2xl font-bold text-white mb-4">Content not found</h2><Link to="/courses"><Button>Back to Courses</Button></Link></div></div>);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Top Bar */}
      <header className="h-14 bg-gray-900 border-b border-gray-800 flex items-center px-4 gap-4 sticky top-0 z-50">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white"><Menu className="w-5 h-5" /></button>
        <Link to="/courses" className="flex items-center gap-1 text-gray-400 hover:text-white text-sm"><ChevronLeft className="w-4 h-4" /><span className="hidden sm:inline">Back</span></Link>
        <p className="flex-1 text-white text-sm font-semibold truncate">{course.title}</p>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2"><div className="w-24"><ProgressBar value={progressPercent} size="sm" /></div><span className="text-xs text-gray-400">{progressPercent}%</span></div>
          <button onClick={() => setBookmarked(!bookmarked)} className={bookmarked ? 'text-yellow-400' : 'text-gray-500 hover:text-gray-300'}><Bookmark className="w-4 h-4" fill={bookmarked ? 'currentColor' : 'none'} /></button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence>{sidebarOpen && (
          <motion.aside initial={{ width: 0, opacity: 0 }} animate={{ width: 320, opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="bg-gray-900 border-r border-gray-800 h-[calc(100vh-56px)] overflow-y-auto flex-shrink-0">
            <div className="p-4 border-b border-gray-800">
              <h2 className="font-bold text-white text-sm">{course.title}</h2>
              <div className="mt-3"><ProgressBar value={progressPercent} size="sm" /><p className="text-xs text-gray-500 mt-1">{completedCount}/{totalLessons} lessons</p></div>
            </div>
            <div className="p-2">{modules.map((mod, idx) => {
              const allDone = mod.lessons?.every((l: any) => isLessonCompleted(l.id));
              return (<div key={mod.id} className="mb-1">
                <button onClick={() => setExpandedModule(expandedModule === mod.id ? null : mod.id)} className="w-full p-3 flex items-center justify-between text-left hover:bg-gray-800/50 rounded-xl">
                  <div className="flex items-center gap-3"><div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${allDone ? 'bg-green-500/20 text-green-400' : 'bg-gray-800 text-gray-400'}`}>{idx + 1}</div><span className="text-white text-sm font-medium truncate">{mod.title}</span></div>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${expandedModule === mod.id ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>{expandedModule === mod.id && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="ml-4 mt-1 space-y-0.5 pb-2">{mod.lessons?.map((l: any) => {
                      const Icon = iconForType(l.type); const cur = l.id === currentLesson.id; const done = isLessonCompleted(l.id);
                      return (<Link key={l.id} to={`/learn/${courseId}/${l.id}`} className={`w-full p-2.5 flex items-center gap-3 rounded-lg ${cur ? 'bg-primary-600/20 border border-primary-500/30' : 'hover:bg-gray-800/50'}`}>
                        {done ? <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" /> : cur ? <div className="w-4 h-4 rounded-full bg-primary-500 flex-shrink-0 animate-pulse" /> : <Icon className="w-4 h-4 text-gray-500 flex-shrink-0" />}
                        <div className="flex-1 min-w-0"><p className={`text-xs truncate ${cur ? 'text-white font-semibold' : 'text-gray-300'}`}>{l.title}</p><p className="text-[10px] text-gray-600">{l.duration_minutes || 0}m • {l.type}</p></div>
                      </Link>);
                    })}</div>
                  </motion.div>
                )}</AnimatePresence>
              </div>);
            })}</div>
          </motion.aside>
        )}</AnimatePresence>

        {/* Main */}
        <main className="flex-1 overflow-y-auto h-[calc(100vh-56px)]">
          {/* â”€â”€ Video â”€â”€ */}
          {currentLesson.type === 'video' && currentLesson.video_url ? (
            <div className="relative bg-black aspect-video max-h-[70vh]">
              {currentLesson.video_url.includes('youtube') || currentLesson.video_url.includes('youtu.be') ? (
                <iframe src={currentLesson.video_url.replace('watch?v=', 'embed/').split('&')[0] + '?rel=0'} className="w-full h-full" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen frameBorder="0" title={currentLesson.title} />
              ) : currentLesson.video_url.includes('vimeo') ? (
                <iframe src={currentLesson.video_url.replace('vimeo.com/', 'player.vimeo.com/video/')} className="w-full h-full" allow="autoplay; fullscreen" allowFullScreen frameBorder="0" title={currentLesson.title} />
              ) : (
                <video ref={videoRef} className="w-full h-full" poster={course.thumbnail_url} controls><source src={currentLesson.video_url} type="video/mp4" /></video>
              )}
              <button onClick={() => setShowStickyPanel(!showStickyPanel)} className="absolute top-4 right-4 bg-yellow-400/90 hover:bg-yellow-400 text-yellow-900 p-2 rounded-lg shadow-lg z-10"><StickyNote className="w-4 h-4" /></button>
            </div>
          ) : currentLesson.type === 'pdf' ? (
            /* â”€â”€ PDF â”€â”€ */
            <div className="bg-gray-900">
              <div className="bg-gray-800 p-4 flex items-center justify-between border-b border-gray-700">
                <div className="flex items-center gap-3"><FileText className="w-5 h-5 text-red-400" /><span className="text-white font-medium">{currentLesson.title}</span></div>
                <div className="flex gap-2">
                  <button onClick={() => setShowStickyPanel(!showStickyPanel)} className="p-2 bg-yellow-400/20 text-yellow-400 rounded-lg"><StickyNote className="w-4 h-4" /></button>
                  {(currentLesson.content?.pdf_url || currentLesson.pdf_url) && <a href={currentLesson.content?.pdf_url || currentLesson.pdf_url} target="_blank" rel="noreferrer" className="p-2 bg-primary-500/20 text-primary-400 rounded-lg"><ExternalLink className="w-4 h-4" /></a>}
                </div>
              </div>
              <div className="h-[70vh]">{(currentLesson.content?.pdf_url || currentLesson.pdf_url) ? (
                <iframe src={`${currentLesson.content?.pdf_url || currentLesson.pdf_url}#toolbar=0`} className="w-full h-full" title={currentLesson.title} />
              ) : (<div className="flex items-center justify-center h-full"><p className="text-gray-500">PDF not available yet.</p></div>)}</div>
            </div>
          ) : currentLesson.type === 'quiz' ? (
            /* â”€â”€ Quiz â”€â”€ */
            <div className="bg-gray-900 px-6 py-12"><div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-2xl flex items-center justify-center"><HelpCircle className="w-6 h-6 text-yellow-400" /></div>
                <div><p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Knowledge Check</p><p className="text-white text-lg font-bold">{quizData?.title || currentLesson.title}</p></div>
                {quizTimer !== null && quizTimer > 0 && <div className="ml-auto px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-sm font-mono"><Clock className="w-4 h-4 inline mr-1" />{formatTime(quizTimer)}</div>}
              </div>
              {quizResult ? (
                <div className="text-center py-8">
                  <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${quizResult.passed ? 'bg-green-500/20' : 'bg-red-500/20'}`}>{quizResult.passed ? <Trophy className="w-12 h-12 text-green-400" /> : <HelpCircle className="w-12 h-12 text-red-400" />}</div>
                  <h3 className="text-2xl font-black text-white mb-2">{quizResult.passed ? 'Congratulations!' : 'Try Again'}</h3>
                  <p className="text-gray-400 mb-4">Score: <span className="font-bold text-white">{quizResult.score}%</span> ({quizResult.earnedPoints}/{quizResult.totalPoints})</p>
                  {!quizResult.passed && <Button onClick={() => { setQuizResult(null); setQuizAnswers({}); if (quizData?.time_limit_minutes) setQuizTimer(quizData.time_limit_minutes * 60); }}>Retry Quiz</Button>}
                </div>
              ) : quizData?.questions?.length > 0 ? (
                <div className="space-y-6">{quizData.questions.sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0)).map((q: any, qi: number) => (
                  <div key={q.id} className="bg-gray-800/50 rounded-2xl p-6">
                    <p className="text-white font-medium mb-4"><span className="text-primary-400 font-bold mr-2">Q{qi + 1}.</span>{q.question_text}</p>
                    {(q.question_type === 'multiple_choice' || q.question_type === 'true_false') && <div className="space-y-2">{(q.options || []).map((o: any) => (
                      <button key={o.value} onClick={() => setQuizAnswers({ ...quizAnswers, [q.id]: o.value })} className={`w-full text-left p-3 rounded-xl border transition ${quizAnswers[q.id] === o.value ? 'border-primary-500 bg-primary-500/10 text-white' : 'border-gray-700 text-gray-300 hover:border-gray-500'}`}>{o.label}</button>
                    ))}</div>}
                    {q.question_type === 'short_answer' && <input className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white outline-none focus:border-primary-500" placeholder="Your answer..." value={quizAnswers[q.id] || ''} onChange={e => setQuizAnswers({ ...quizAnswers, [q.id]: e.target.value })} />}
                  </div>
                ))}<Button onClick={handleSubmitQuiz} isLoading={isSubmittingQuiz} className="w-full py-4" disabled={Object.keys(quizAnswers).length < (quizData.questions?.length || 0)}>Submit Quiz</Button></div>
              ) : <p className="text-gray-500 text-center py-8">No quiz questions available yet.</p>}
            </div></div>
          ) : currentLesson.type === 'assignment' ? (
            /* â”€â”€ Assignment â”€â”€ */
            <div className="bg-gray-900 px-6 py-12"><div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center"><ClipboardList className="w-6 h-6 text-orange-400" /></div>
                <div><p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Assignment</p><p className="text-white text-lg font-bold">{assignmentData?.title || currentLesson.title}</p></div>
              </div>
              {submissionResult ? (
                <div className="bg-gray-800/50 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4"><CheckCircle className="w-6 h-6 text-green-400" /><h3 className="text-white font-bold">Submitted</h3><Badge variant={submissionResult.status === 'graded' ? 'success' : 'warning'}>{submissionResult.status}</Badge></div>
                  {submissionResult.score !== null && <p className="text-gray-300 mb-2">Score: <span className="text-white font-bold">{submissionResult.score}</span></p>}
                  {submissionResult.feedback && <div className="mt-4 p-4 bg-gray-900 rounded-xl"><p className="text-xs text-gray-500 mb-1 uppercase font-semibold">Instructor Feedback</p><p className="text-gray-300">{submissionResult.feedback}</p></div>}
                </div>
              ) : (
                <div>
                  {assignmentData?.instructions && <div className="prose prose-invert max-w-none mb-6 text-gray-300 whitespace-pre-line">{assignmentData.instructions}</div>}
                  {assignmentData?.rubric?.length > 0 && <div className="mb-6 bg-gray-800/50 rounded-2xl p-4"><h4 className="text-white font-semibold mb-3">Grading Rubric</h4>{assignmentData.rubric.map((r: any, i: number) => (<div key={i} className="flex justify-between py-2 border-b border-gray-700 last:border-0"><span className="text-gray-300 text-sm">{r.criterion}</span><span className="text-gray-400 text-sm">{r.maxPoints}pts</span></div>))}</div>}
                  <textarea value={assignmentText} onChange={e => setAssignmentText(e.target.value)} placeholder="Write your submission here..." className="w-full h-48 p-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder:text-gray-600 focus:border-orange-500 outline-none resize-none mb-4" />
                  <Button onClick={handleSubmitAssignment} isLoading={isSubmittingAssignment} disabled={!assignmentText.trim()} className="w-full"><Send className="w-4 h-4 mr-2" /> Submit Assignment</Button>
                </div>
              )}
            </div></div>
          ) : (
            /* â”€â”€ Text / Reflection / Default â”€â”€ */
            <div className="bg-gray-900 px-6 py-12"><div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${currentLesson.type === 'reflection' ? 'bg-purple-500/20' : 'bg-blue-500/20'}`}>
                  {currentLesson.type === 'reflection' ? <PenTool className="w-6 h-6 text-purple-400" /> : <FileText className="w-6 h-6 text-blue-400" />}
                </div>
                <div><p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{currentLesson.type === 'reflection' ? 'Reflection' : 'Reading'}</p><p className="text-white text-lg font-bold">{currentLesson.title}</p></div>
              </div>
              <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed whitespace-pre-line">{getLessonContent()}</div>
            </div></div>
          )}

          {/* Sticky Notes Panel */}
          <AnimatePresence>{showStickyPanel && (
            <motion.div initial={{ x: 300 }} animate={{ x: 0 }} exit={{ x: 300 }} className="fixed top-14 right-0 w-80 h-[calc(100vh-56px)] bg-gray-900 border-l border-gray-800 z-40 flex flex-col">
              <div className="p-4 border-b border-gray-800 flex items-center justify-between"><h3 className="text-white font-bold text-sm">Sticky Notes</h3><button onClick={() => setShowStickyPanel(false)} className="text-gray-400 hover:text-white"><X className="w-4 h-4" /></button></div>
              <div className="p-4 border-b border-gray-800">
                <textarea value={newStickyText} onChange={e => setNewStickyText(e.target.value)} placeholder="Add a note..." className="w-full h-20 p-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm placeholder:text-gray-600 outline-none resize-none mb-2" />
                <div className="flex items-center justify-between"><div className="flex gap-1">{['#fef08a', '#bbf7d0', '#bfdbfe', '#fecaca', '#e9d5ff'].map(c => (<button key={c} onClick={() => setStickyColor(c)} className={`w-5 h-5 rounded-full border-2 ${stickyColor === c ? 'border-white' : 'border-transparent'}`} style={{ backgroundColor: c }} />))}</div><Button size="sm" onClick={handleAddSticky} disabled={!newStickyText.trim()}>Add</Button></div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">{stickyNotes.map(s => (
                <div key={s.id} className="p-3 rounded-xl text-gray-900 text-sm relative group" style={{ backgroundColor: s.color || '#fef08a' }}>
                  <button onClick={() => handleDeleteSticky(s.id)} className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-gray-600 hover:text-gray-900"><X className="w-3 h-3" /></button>
                  <p>{s.content}</p>{s.video_timestamp > 0 && <p className="text-xs mt-1 opacity-60">@ {formatTime(s.video_timestamp)}</p>}
                </div>
              ))}{stickyNotes.length === 0 && <p className="text-gray-600 text-sm text-center">No notes yet</p>}</div>
            </motion.div>
          )}</AnimatePresence>

          {/* Lesson Info & Tabs */}
          <div className="bg-gray-950 text-white"><div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
              <div><Badge className="mb-2 bg-primary-500/20 text-primary-300">{currentLesson.type}</Badge><h1 className="text-2xl font-bold">{currentLesson.title}</h1></div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="border-gray-700 text-gray-300" onClick={goPrev} disabled={!getPrev()}><ChevronLeft className="w-4 h-4" /></Button>
                <Button size="sm" onClick={goNext} disabled={!getNext()}><ChevronRight className="w-4 h-4" /></Button>
              </div>
            </div>
            <div className="flex gap-1 border-b border-gray-800 mb-6">{([
              { id: 'overview', label: 'Overview', icon: BookOpen }, { id: 'resources', label: 'Resources', icon: FileText },
              { id: 'notes', label: 'My Notes', icon: PenTool }, { id: 'discussion', label: 'Discussion', icon: MessageCircle },
            ] as const).map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition ${activeTab === t.id ? 'border-primary-500 text-primary-400' : 'border-transparent text-gray-500 hover:text-white'}`}><t.icon className="w-4 h-4" />{t.label}</button>
            ))}</div>

            {activeTab === 'overview' && <div className="space-y-6"><p className="text-gray-400">{typeof currentLesson.content === 'string' ? currentLesson.content : currentLesson.description || 'No description.'}</p></div>}

            {activeTab === 'resources' && <div className="space-y-3">{(currentLesson.resources || []).length > 0 ? (currentLesson.resources || []).map((r: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-900 rounded-xl hover:bg-gray-800 transition"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center"><FileText className="w-5 h-5 text-primary-400" /></div><div><p className="font-medium text-white text-sm">{r.name || r.title}</p><p className="text-xs text-gray-500">{r.size || ''}</p></div></div><a href={r.url} target="_blank" rel="noreferrer"><Button variant="ghost" size="sm"><Download className="w-4 h-4 mr-1" />Download</Button></a></div>
            )) : <p className="text-gray-500">No resources available.</p>}</div>}

            {activeTab === 'notes' && <div>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Take notes while learning..." className="w-full h-64 p-4 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder:text-gray-600 focus:border-primary-500 outline-none resize-none" />
              <div className="flex justify-end mt-4"><Button onClick={handleSaveNotes} isLoading={isSavingNotes}>Save Notes</Button></div>
            </div>}

            {activeTab === 'discussion' && <div className="text-center py-12"><MessageCircle className="w-12 h-12 text-gray-700 mx-auto mb-4" /><p className="text-gray-400 mb-4">Discussion coming soon</p></div>}

            {/* Certificate Banner */}
            {certificate && progressPercent >= 100 && (
              <div className="mt-8 p-6 bg-gradient-to-r from-yellow-500/20 to-primary-500/20 rounded-2xl border border-yellow-500/30">
                <div className="flex items-center gap-4"><div className="w-14 h-14 bg-yellow-500/20 rounded-2xl flex items-center justify-center"><Award className="w-8 h-8 text-yellow-400" /></div><div className="flex-1"><h3 className="text-lg font-black text-white">Course Complete!</h3><p className="text-gray-400 text-sm">Certificate #{certificate.certificate_number}</p></div><Link to={`/certificates/${certificate.id}`}><Button size="sm" className="bg-yellow-500 text-yellow-900 hover:bg-yellow-400"><Award className="w-4 h-4 mr-2" />View</Button></Link></div>
              </div>
            )}

            {/* Mark Complete */}
            <div className="mt-8 pt-8 border-t border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3"><CheckCircle className={`w-6 h-6 ${isLessonCompleted(currentLesson.id) ? 'text-green-500' : 'text-gray-700'}`} /><span className="text-gray-400 text-sm">{isLessonCompleted(currentLesson.id) ? 'Lesson completed' : 'Mark as complete'}</span></div>
              {!isLessonCompleted(currentLesson.id) && <Button variant="outline" className="border-green-500 text-green-400 hover:bg-green-500/10" onClick={handleCompleteLesson} isLoading={isCompleting}>Complete & Continue</Button>}
            </div>
          </div></div>
        </main>
      </div>
    </div>
  );
};

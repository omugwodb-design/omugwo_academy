import React, { useState, useEffect } from 'react';
import {
  X, Plus, Trash2, Save, GripVertical, HelpCircle, CheckCircle,
  AlertCircle, Copy, ChevronDown, ChevronUp, Loader2, Settings,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { toast } from 'react-hot-toast';
import {
  getQuiz, createQuiz, addQuizQuestion, updateQuizQuestion, deleteQuizQuestion,
} from '../../core/lms/lms-service';

interface QuizBuilderProps {
  lessonId: string;
  lessonTitle: string;
  onClose: () => void;
  onSaved?: () => void;
}

interface QuestionDraft {
  id?: string;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'short_answer';
  options: { value: string; label: string; }[];
  correct_answer: string;
  points: number;
  order_index: number;
  explanation?: string;
  isNew?: boolean;
  isDirty?: boolean;
}

const QUESTION_TYPES = [
  { value: 'multiple_choice', label: 'Multiple Choice', icon: '🔘' },
  { value: 'true_false', label: 'True / False', icon: '✅' },
  { value: 'short_answer', label: 'Short Answer', icon: '✍️' },
];

const DEFAULT_MC_OPTIONS = [
  { value: 'a', label: '' },
  { value: 'b', label: '' },
  { value: 'c', label: '' },
  { value: 'd', label: '' },
];

const DEFAULT_TF_OPTIONS = [
  { value: 'true', label: 'True' },
  { value: 'false', label: 'False' },
];

export const QuizBuilder: React.FC<QuizBuilderProps> = ({ lessonId, lessonTitle, onClose, onSaved }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [quizId, setQuizId] = useState<string | null>(null);

  // Quiz settings
  const [quizTitle, setQuizTitle] = useState(lessonTitle || 'Quiz');
  const [passingScore, setPassingScore] = useState(70);
  const [timeLimit, setTimeLimit] = useState<number | ''>('');
  const [maxAttempts, setMaxAttempts] = useState(3);
  const [shuffleQuestions, setShuffleQuestions] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Questions
  const [questions, setQuestions] = useState<QuestionDraft[]>([]);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  useEffect(() => { loadQuizData(); }, [lessonId]);

  const loadQuizData = async () => {
    setIsLoading(true);
    try {
      const quiz = await getQuiz(lessonId);
      if (quiz) {
        setQuizId(quiz.id);
        setQuizTitle(quiz.title || lessonTitle);
        setPassingScore(quiz.passing_score || 70);
        setTimeLimit(quiz.time_limit_minutes || '');
        setMaxAttempts(quiz.max_attempts || 3);
        setShuffleQuestions(quiz.shuffle_questions || false);
        const qs = (quiz.questions || [])
          .sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0))
          .map((q: any) => ({
            id: q.id,
            question_text: q.question_text || '',
            question_type: q.question_type || 'multiple_choice',
            options: q.options || DEFAULT_MC_OPTIONS,
            correct_answer: q.correct_answer || '',
            points: q.points || 1,
            order_index: q.order_index || 0,
            explanation: q.explanation || '',
            isNew: false,
            isDirty: false,
          }));
        setQuestions(qs);
        if (qs.length > 0) setExpandedQuestion(0);
      } else {
        setExpandedQuestion(null);
      }
    } catch (err) {
      console.error('Error loading quiz:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const ensureQuiz = async (): Promise<string> => {
    if (quizId) return quizId;
    const quiz = await createQuiz(lessonId, {
      title: quizTitle,
      passing_score: passingScore,
      time_limit_minutes: timeLimit || undefined,
      max_attempts: maxAttempts,
      shuffle_questions: shuffleQuestions,
    });
    setQuizId(quiz.id);
    return quiz.id;
  };

  const handleAddQuestion = (type: 'multiple_choice' | 'true_false' | 'short_answer') => {
    const newQ: QuestionDraft = {
      question_text: '',
      question_type: type,
      options: type === 'multiple_choice' ? [...DEFAULT_MC_OPTIONS] : type === 'true_false' ? [...DEFAULT_TF_OPTIONS] : [],
      correct_answer: type === 'true_false' ? 'true' : '',
      points: 1,
      order_index: questions.length,
      explanation: '',
      isNew: true,
      isDirty: true,
    };
    setQuestions([...questions, newQ]);
    setExpandedQuestion(questions.length);
  };

  const handleUpdateQuestion = (index: number, updates: Partial<QuestionDraft>) => {
    setQuestions(questions.map((q, i) => i === index ? { ...q, ...updates, isDirty: true } : q));
  };

  const handleDeleteQuestion = async (index: number) => {
    const q = questions[index];
    if (q.id) {
      try {
        await deleteQuizQuestion(q.id);
        toast.success('Question deleted');
      } catch { toast.error('Failed to delete question'); return; }
    }
    const updated = questions.filter((_, i) => i !== index).map((q, i) => ({ ...q, order_index: i }));
    setQuestions(updated);
    setExpandedQuestion(null);
  };

  const handleDuplicateQuestion = (index: number) => {
    const q = questions[index];
    const dup: QuestionDraft = {
      ...q, id: undefined, isNew: true, isDirty: true,
      order_index: questions.length,
      question_text: q.question_text + ' (copy)',
    };
    setQuestions([...questions, dup]);
    setExpandedQuestion(questions.length);
  };

  const handleMoveQuestion = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === questions.length - 1)) return;
    const newQs = [...questions];
    const swapIdx = direction === 'up' ? index - 1 : index + 1;
    [newQs[index], newQs[swapIdx]] = [newQs[swapIdx], newQs[index]];
    setQuestions(newQs.map((q, i) => ({ ...q, order_index: i, isDirty: true })));
    setExpandedQuestion(swapIdx);
  };

  const handleAddOption = (qIndex: number) => {
    const q = questions[qIndex];
    const nextLetter = String.fromCharCode(97 + q.options.length);
    handleUpdateQuestion(qIndex, { options: [...q.options, { value: nextLetter, label: '' }] });
  };

  const handleUpdateOption = (qIndex: number, oIndex: number, label: string) => {
    const q = questions[qIndex];
    const options = q.options.map((o, i) => i === oIndex ? { ...o, label } : o);
    handleUpdateQuestion(qIndex, { options });
  };

  const handleRemoveOption = (qIndex: number, oIndex: number) => {
    const q = questions[qIndex];
    if (q.options.length <= 2) { toast.error('Minimum 2 options required'); return; }
    const removed = q.options[oIndex];
    const options = q.options.filter((_, i) => i !== oIndex);
    const updates: Partial<QuestionDraft> = { options };
    if (q.correct_answer === removed.value) updates.correct_answer = '';
    handleUpdateQuestion(qIndex, updates);
  };

  const handleSaveAll = async () => {
    // Validate
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question_text.trim()) { toast.error(`Question ${i + 1} is empty`); setExpandedQuestion(i); return; }
      if (q.question_type === 'multiple_choice') {
        if (q.options.some(o => !o.label.trim())) { toast.error(`Question ${i + 1}: all options need text`); setExpandedQuestion(i); return; }
        if (!q.correct_answer) { toast.error(`Question ${i + 1}: select correct answer`); setExpandedQuestion(i); return; }
      }
      if (q.question_type === 'short_answer' && !q.correct_answer.trim()) { toast.error(`Question ${i + 1}: provide the correct answer`); setExpandedQuestion(i); return; }
    }

    setIsSaving(true);
    try {
      const qId = await ensureQuiz();

      // Update quiz settings
      const { error: settingsErr } = await (await import('../../lib/supabase')).supabase
        .from('quizzes').update({
          title: quizTitle, passing_score: passingScore,
          time_limit_minutes: timeLimit || null, max_attempts: maxAttempts,
          shuffle_questions: shuffleQuestions,
        }).eq('id', qId);
      if (settingsErr) throw settingsErr;

      // Save each question
      for (const q of questions) {
        if (!q.isDirty) continue;
        const payload = {
          question_text: q.question_text,
          question_type: q.question_type,
          options: q.options,
          correct_answer: q.correct_answer,
          points: q.points,
          order_index: q.order_index,
          explanation: q.explanation,
        };
        if (q.isNew) {
          const saved = await addQuizQuestion(qId, payload);
          q.id = saved.id;
          q.isNew = false;
        } else if (q.id) {
          await updateQuizQuestion(q.id, payload);
        }
        q.isDirty = false;
      }

      setQuestions([...questions]);
      toast.success(`Quiz saved with ${questions.length} questions!`);
      onSaved?.();
    } catch (err) {
      console.error('Error saving quiz:', err);
      toast.error('Failed to save quiz');
    } finally {
      setIsSaving(false);
    }
  };

  const totalPoints = questions.reduce((s, q) => s + q.points, 0);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-12 flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          <p className="text-gray-500 text-sm">Loading quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary-500" /> Quiz Builder
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">{questions.length} questions • {totalPoints} total points</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowSettings(!showSettings)} className={`p-2 rounded-lg transition ${showSettings ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500'}`}>
              <Settings className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Quiz Title</label>
                <input className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500" value={quizTitle} onChange={e => setQuizTitle(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Passing Score (%)</label>
                <input type="number" className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500" value={passingScore} onChange={e => setPassingScore(parseInt(e.target.value) || 0)} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Time Limit (min)</label>
                <input type="number" className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500" placeholder="No limit" value={timeLimit} onChange={e => setTimeLimit(e.target.value ? parseInt(e.target.value) : '')} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Max Attempts</label>
                <input type="number" className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500" value={maxAttempts} onChange={e => setMaxAttempts(parseInt(e.target.value) || 1)} />
              </div>
            </div>
            <div className="flex items-center gap-4 mt-3">
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                <input type="checkbox" checked={shuffleQuestions} onChange={e => setShuffleQuestions(e.target.checked)} className="rounded border-gray-300 text-primary-600" />
                Shuffle questions
              </label>
            </div>
          </div>
        )}

        {/* Questions List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {questions.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No questions yet</p>
              <p className="text-gray-400 text-sm mb-6">Add your first question to get started</p>
            </div>
          ) : (
            questions.map((q, qi) => {
              const isExpanded = expandedQuestion === qi;
              const typeInfo = QUESTION_TYPES.find(t => t.value === q.question_type);
              return (
                <div key={qi} className={`border rounded-xl overflow-hidden transition ${isExpanded ? 'border-primary-300 dark:border-primary-700 shadow-sm' : 'border-gray-200 dark:border-gray-800'}`}>
                  {/* Question Header */}
                  <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-950 cursor-pointer" onClick={() => setExpandedQuestion(isExpanded ? null : qi)}>
                    <GripVertical className="w-4 h-4 text-gray-300 flex-shrink-0" />
                    <span className="text-xs font-bold text-primary-600 bg-primary-50 dark:bg-primary-900/30 px-2 py-0.5 rounded">{qi + 1}</span>
                    <span className="text-xs text-gray-400">{typeInfo?.icon}</span>
                    <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-200 truncate">{q.question_text || 'Untitled question'}</span>
                    <span className="text-xs text-gray-400">{q.points}pt{q.points !== 1 ? 's' : ''}</span>
                    {!q.correct_answer && <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />}
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </div>

                  {/* Expanded Editor */}
                  {isExpanded && (
                    <div className="p-4 space-y-4 bg-white dark:bg-gray-900">
                      {/* Question Text */}
                      <div>
                        <label className="text-xs font-medium text-gray-500 block mb-1">Question</label>
                        <textarea className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-primary-500 resize-none h-20"
                          value={q.question_text} onChange={e => handleUpdateQuestion(qi, { question_text: e.target.value })}
                          placeholder="Enter your question..." />
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs font-medium text-gray-500 block mb-1">Type</label>
                          <select className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm outline-none"
                            value={q.question_type} onChange={e => {
                              const newType = e.target.value as any;
                              const opts = newType === 'multiple_choice' ? [...DEFAULT_MC_OPTIONS] : newType === 'true_false' ? [...DEFAULT_TF_OPTIONS] : [];
                              handleUpdateQuestion(qi, { question_type: newType, options: opts, correct_answer: newType === 'true_false' ? 'true' : '' });
                            }}>
                            {QUESTION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 block mb-1">Points</label>
                          <input type="number" min="1" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm outline-none"
                            value={q.points} onChange={e => handleUpdateQuestion(qi, { points: parseInt(e.target.value) || 1 })} />
                        </div>
                        <div className="flex items-end gap-1">
                          <button onClick={() => handleMoveQuestion(qi, 'up')} disabled={qi === 0} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg disabled:opacity-30"><ChevronUp className="w-4 h-4" /></button>
                          <button onClick={() => handleMoveQuestion(qi, 'down')} disabled={qi === questions.length - 1} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg disabled:opacity-30"><ChevronDown className="w-4 h-4" /></button>
                          <button onClick={() => handleDuplicateQuestion(qi)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500"><Copy className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteQuestion(qi)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-500"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>

                      {/* Multiple Choice Options */}
                      {q.question_type === 'multiple_choice' && (
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-gray-500">Options (click radio to mark correct)</label>
                          {q.options.map((opt, oi) => (
                            <div key={oi} className="flex items-center gap-2">
                              <input type="radio" name={`correct-${qi}`} checked={q.correct_answer === opt.value}
                                onChange={() => handleUpdateQuestion(qi, { correct_answer: opt.value })}
                                className="text-primary-600 border-gray-300 focus:ring-primary-500" />
                              <span className="text-xs font-bold text-gray-400 uppercase w-4">{opt.value}.</span>
                              <input className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder={`Option ${opt.value.toUpperCase()}`}
                                value={opt.label} onChange={e => handleUpdateOption(qi, oi, e.target.value)} />
                              <button onClick={() => handleRemoveOption(qi, oi)} className="p-1 text-gray-400 hover:text-red-500"><X className="w-3.5 h-3.5" /></button>
                            </div>
                          ))}
                          {q.options.length < 6 && (
                            <button onClick={() => handleAddOption(qi)} className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium mt-1">
                              <Plus className="w-3 h-3" /> Add Option
                            </button>
                          )}
                        </div>
                      )}

                      {/* True/False Options */}
                      {q.question_type === 'true_false' && (
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-gray-500">Correct Answer</label>
                          <div className="flex gap-3">
                            {['true', 'false'].map(v => (
                              <label key={v} className={`flex-1 flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition ${q.correct_answer === v ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-800 hover:border-gray-300'}`}>
                                <input type="radio" name={`tf-${qi}`} checked={q.correct_answer === v} onChange={() => handleUpdateQuestion(qi, { correct_answer: v })} className="text-primary-600" />
                                <span className="text-sm font-medium capitalize">{v}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Short Answer */}
                      {q.question_type === 'short_answer' && (
                        <div>
                          <label className="text-xs font-medium text-gray-500 block mb-1">Correct Answer</label>
                          <input className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Expected answer (case-insensitive matching)"
                            value={q.correct_answer} onChange={e => handleUpdateQuestion(qi, { correct_answer: e.target.value })} />
                        </div>
                      )}

                      {/* Explanation */}
                      <div>
                        <label className="text-xs font-medium text-gray-500 block mb-1">Explanation (shown after answering)</label>
                        <textarea className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm outline-none resize-none h-16"
                          placeholder="Why is this the correct answer?"
                          value={q.explanation || ''} onChange={e => handleUpdateQuestion(qi, { explanation: e.target.value })} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {QUESTION_TYPES.map(t => (
              <button key={t.value} onClick={() => handleAddQuestion(t.value as any)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                <Plus className="w-3 h-3" /> {t.icon} {t.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSaveAll} isLoading={isSaving} leftIcon={<Save className="w-4 h-4" />}>
              Save Quiz ({questions.length})
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

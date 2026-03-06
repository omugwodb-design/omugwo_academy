import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Clock, AlertTriangle, CheckCircle, XCircle, Star } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { cn } from '../../../../lib/utils';
import { getQuiz, submitQuizAttempt } from '../../../../core/lms/lms-service';
import { toast } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

interface QuizLessonProps {
  lessonId: string;
  onComplete: () => void;
  userId: string;
}

export const QuizLesson: React.FC<QuizLessonProps> = ({ lessonId, onComplete, userId }) => {
  const location = useLocation();
  const [quizData, setQuizData] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    loadQuiz();
  }, [lessonId]);

  const loadQuiz = async () => {
    setIsLoading(true);
    try {
      const q = await getQuiz(lessonId);
      setQuizData(q);
      setCurrentIndex(0);
      if (q?.time_limit_minutes) {
        setTimeLeft(q.time_limit_minutes * 60);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || result) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, result]);

  const handleSubmit = async () => {
    if (!quizData) {
      toast.error('Quiz data not loaded');
      return;
    }

    // Instructor/admin preview should not create quiz responses (RLS will typically block)
    if (location.pathname.startsWith('/course-preview')) {
      toast.error('Quiz submission is disabled in course preview. Please take the quiz from the live course lesson.');
      return;
    }

    if (!userId) {
      toast.error('Please log in to submit the quiz');
      return;
    }
    
    // Check if all questions are answered
    const unanswered = (quizData.questions || []).filter((q: any) => !answers[q.id]);
    if (unanswered.length > 0) {
      toast.error(`Please answer all ${unanswered.length} remaining question(s)`);
      return;
    }
    
    setIsSubmitting(true);
    try {
      const res = await submitQuizAttempt(quizData.id, userId, answers);
      setResult(res);
      if (res.passed) {
        toast.success('Quiz passed successfully!');
        onComplete();
      } else {
        toast.error(`Quiz not passed. Score: ${res.score}%. Required: ${quizData.passing_score || 70}%`);
      }
    } catch (error: any) {
      console.error('Quiz submission error:', error);
      toast.error(error?.message || 'Failed to submit quiz');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full bg-white dark:bg-gray-900 rounded-2xl p-8 lg:p-12 border border-gray-200 dark:border-gray-800 flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-full" />
          <div className="w-32 h-4 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="w-full bg-white dark:bg-gray-900 rounded-2xl p-8 lg:p-12 border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center text-center min-h-[400px]">
        <HelpCircle className="w-12 h-12 text-gray-300 dark:text-gray-700 mb-4" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Quiz Data</h3>
        <p className="text-gray-500">This quiz is currently unavailable or empty.</p>
      </div>
    );
  }

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  if (result) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full bg-white dark:bg-gray-900 rounded-2xl p-8 lg:p-12 border border-gray-200 dark:border-gray-800 max-w-3xl mx-auto"
      >
        <div className="text-center mb-8">
          <div className={cn(
            "w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6",
            result.passed ? "bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400" : "bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400"
          )}>
            {result.passed ? <CheckCircle className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
          </div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
            {result.passed ? "Congratulations!" : "Keep Trying!"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            You scored <span className="font-bold text-gray-900 dark:text-white">{result.score}%</span>
          </p>
          <p className="text-sm text-gray-500 mt-2">Passing score: {quizData.passing_score}%</p>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          {!result.passed && (
            <Button onClick={() => { setResult(null); setAnswers({}); setCurrentIndex(0); if(quizData.time_limit_minutes) setTimeLeft(quizData.time_limit_minutes * 60); }} variant="outline">
              Retake Quiz
            </Button>
          )}
          {result.passed && (
            <Button onClick={onComplete} className="bg-primary-600 hover:bg-primary-700 text-white">
              Continue to Next Lesson
            </Button>
          )}
        </div>
      </motion.div>
    );
  }

  const questions = (quizData.questions || []).slice().sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0));
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];
  const currentQuestionType = currentQuestion?.question_type || 'multiple_choice';
  const isLast = currentIndex >= totalQuestions - 1;
  const currentAnswered = !!(currentQuestion && answers[currentQuestion.id]);

  const setAnswerAndAdvance = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    // Only advance if there is a next question.
    if (!isLast) {
      // Small delay so selection feedback is visible.
      setTimeout(() => setCurrentIndex((i) => Math.min(i + 1, totalQuestions - 1)), 200);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-2xl p-8 lg:p-12 border border-gray-200 dark:border-gray-800 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center text-primary-600 dark:text-primary-400">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{quizData.title}</h2>
            <p className="text-sm text-gray-500">{totalQuestions} Questions • {quizData.passing_score}% to pass</p>
          </div>
        </div>

        {timeLeft !== null && (
          <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold tracking-wider",
            timeLeft < 60 ? "bg-red-50 text-red-600 dark:bg-red-500/20 dark:text-red-400" : "bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
          )}>
            <Clock className="w-4 h-4" />
            {formatTime(timeLeft)}
          </div>
        )}
      </div>

      {/* Description */}
      {quizData.description && (
        <div className="prose dark:prose-invert max-w-none mb-10 text-gray-600 dark:text-gray-400">
          <p>{quizData.description}</p>
        </div>
      )}

      {/* One Question At A Time */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-500">
            Question {Math.min(currentIndex + 1, totalQuestions)} of {totalQuestions}
          </p>
          <div className="w-40 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-600"
              style={{ width: `${totalQuestions === 0 ? 0 : Math.round(((currentIndex + 1) / totalQuestions) * 100)}%` }}
            />
          </div>
        </div>

        {currentQuestion && (() => {
          const isFeedbackQuestion = ['survey', 'poll', 'rating'].includes(currentQuestionType);

          return (
            <div key={currentQuestion.id} className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex gap-3">
                <span className={cn("font-bold shrink-0", isFeedbackQuestion ? "text-purple-500" : "text-primary-500")}>{currentIndex + 1}.</span>
                {currentQuestion.question_text || currentQuestion.question}
                {isFeedbackQuestion && (
                  <span className="ml-2 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full">
                    {currentQuestionType === 'survey' ? '📋 Survey' : currentQuestionType === 'poll' ? '📊 Poll' : '⭐ Rating'}
                  </span>
                )}
              </h3>

              {/* Rating Question */}
              {currentQuestionType === 'rating' && (
                <div className="pl-6">
                  <div className="flex items-center gap-2">
                    {Array.from({ length: parseInt(currentQuestion.options?.[0]?.label) || 5 }).map((_, i) => {
                      const rating = i + 1;
                      const isSelected = parseInt(answers[currentQuestion.id]) >= rating;
                      return (
                        <button
                          key={i}
                          onClick={() => setAnswerAndAdvance(currentQuestion.id, String(rating))}
                          className={cn(
                            "p-1 transition-transform hover:scale-110",
                            isSelected ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"
                          )}
                          aria-label={`Rate ${rating}`}
                        >
                          <Star
                            className={cn(
                              "w-8 h-8",
                              isSelected ? "fill-current" : "fill-transparent",
                              "stroke-current"
                            )}
                          />
                        </button>
                      );
                    })}
                    {answers[currentQuestion.id] && (
                      <span className="ml-4 text-sm text-gray-500">{answers[currentQuestion.id]} / {currentQuestion.options?.[0]?.label || 5}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Poll Question */}
              {currentQuestionType === 'poll' && (
                <div className="pl-6 space-y-3">
                  {currentQuestion.options?.map((opt: any, oIdx: number) => {
                    const optionValue = typeof opt === 'object' && opt !== null ? (opt.value ?? opt.label ?? String(opt)) : String(opt);
                    const optionLabel = typeof opt === 'object' && opt !== null ? (opt.label ?? opt.value ?? String(opt)) : String(opt);
                    const isSelected = answers[currentQuestion.id] === optionValue;
                    return (
                      <button
                        key={oIdx}
                        onClick={() => setAnswerAndAdvance(currentQuestion.id, optionValue)}
                        className={cn(
                          "w-full text-left p-4 rounded-xl border-2 transition-all",
                          isSelected
                            ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                            : "border-gray-100 dark:border-gray-800 hover:border-purple-200 dark:hover:border-purple-800"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                            isSelected ? "border-purple-500 bg-purple-500" : "border-gray-300 dark:border-gray-600"
                          )}>
                            {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                          </div>
                          <span className={cn("font-medium", isSelected ? "text-purple-900 dark:text-purple-100" : "text-gray-700 dark:text-gray-300")}>
                            {optionLabel}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Survey Question */}
              {currentQuestionType === 'survey' && (
                <div className="pl-6 space-y-3">
                  {currentQuestion.options?.map((opt: any, oIdx: number) => {
                    const optionValue = typeof opt === 'object' && opt !== null ? (opt.value ?? opt.label ?? String(opt)) : String(opt);
                    const optionLabel = typeof opt === 'object' && opt !== null ? (opt.label ?? opt.value ?? String(opt)) : String(opt);
                    const isSelected = answers[currentQuestion.id] === optionValue;
                    return (
                      <label
                        key={oIdx}
                        className={cn(
                          "flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                          isSelected
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/10"
                            : "border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800"
                        )}
                      >
                        <input
                          type="radio"
                          name={currentQuestion.id}
                          value={optionValue}
                          checked={isSelected}
                          onChange={() => setAnswerAndAdvance(currentQuestion.id, optionValue)}
                          className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className={cn("text-base", isSelected ? "text-blue-900 dark:text-blue-100 font-medium" : "text-gray-700 dark:text-gray-300")}>
                          {optionLabel}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}

              {/* Multiple Choice / True-False / Text */}
              {!isFeedbackQuestion && (
                <div className="pl-6 space-y-3">
                  {currentQuestion.options?.map((opt: any, oIdx: number) => {
                    const optionValue = typeof opt === 'object' && opt !== null ? (opt.value ?? opt.label ?? String(opt)) : String(opt);
                    const optionLabel = typeof opt === 'object' && opt !== null ? (opt.label ?? opt.value ?? String(opt)) : String(opt);
                    return (
                      <label
                        key={oIdx}
                        className={cn(
                          "flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                          answers[currentQuestion.id] === optionValue
                            ? "border-primary-500 bg-primary-50 dark:bg-primary-900/10"
                            : "border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        )}
                      >
                        <input
                          type="radio"
                          name={currentQuestion.id}
                          value={optionValue}
                          checked={answers[currentQuestion.id] === optionValue}
                          onChange={() => setAnswerAndAdvance(currentQuestion.id, optionValue)}
                          className="mt-1 w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
                        />
                        <span className={cn(
                          "text-base",
                          answers[currentQuestion.id] === optionValue ? "text-primary-900 dark:text-primary-100 font-medium" : "text-gray-700 dark:text-gray-300"
                        )}>
                          {optionLabel}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* Footer Actions */}
      <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-500">
          {Object.keys(answers).length} of {totalQuestions} questions answered
        </p>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            disabled={currentIndex === 0 || isSubmitting}
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          >
            Previous
          </Button>
          {!isLast ? (
            <Button
              onClick={() => setCurrentIndex((i) => Math.min(i + 1, totalQuestions - 1))}
              disabled={!currentAnswered || isSubmitting}
              className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              isLoading={isSubmitting}
              disabled={isSubmitting || Object.keys(answers).length === 0}
              className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              Submit Quiz
            </Button>
          )}
        </div>
      </div>

    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { cn } from '../../../../lib/utils';
import { getQuiz, submitQuizAttempt } from '../../../../core/lms/lms-service';
import { toast } from 'react-hot-toast';

interface QuizLessonProps {
  lessonId: string;
  onComplete: () => void;
  userId: string;
}

export const QuizLesson: React.FC<QuizLessonProps> = ({ lessonId, onComplete, userId }) => {
  const [quizData, setQuizData] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    loadQuiz();
  }, [lessonId]);

  const loadQuiz = async () => {
    setIsLoading(true);
    try {
      const q = await getQuiz(lessonId);
      setQuizData(q);
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
    if (!quizData || !userId) return;
    setIsSubmitting(true);
    try {
      const res = await submitQuizAttempt(quizData.id, userId, answers);
      setResult(res);
      if (res.passed) {
        toast.success('Quiz passed successfully!');
        onComplete();
      } else {
        toast.error('Quiz failed. Try again.');
      }
    } catch (error) {
      toast.error('Failed to submit quiz');
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
            <Button onClick={() => { setResult(null); setAnswers({}); if(quizData.time_limit_minutes) setTimeLeft(quizData.time_limit_minutes * 60); }} variant="outline">
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
            <p className="text-sm text-gray-500">{quizData.questions?.length || 0} Questions • {quizData.passing_score}% to pass</p>
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

      {/* Questions */}
      <div className="space-y-10">
        {quizData.questions?.map((q: any, idx: number) => (
          <div key={q.id} className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex gap-3">
              <span className="text-primary-500 font-bold shrink-0">{idx + 1}.</span>
              {q.question_text}
            </h3>
            
            <div className="pl-6 space-y-3">
              {q.options?.map((opt: string, oIdx: number) => (
                <label 
                  key={oIdx} 
                  className={cn(
                    "flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                    answers[q.id] === opt 
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/10" 
                      : "border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  )}
                >
                  <input
                    type="radio"
                    name={q.id}
                    value={opt}
                    checked={answers[q.id] === opt}
                    onChange={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                    className="mt-1 w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <span className={cn(
                    "text-base",
                    answers[q.id] === opt ? "text-primary-900 dark:text-primary-100 font-medium" : "text-gray-700 dark:text-gray-300"
                  )}>
                    {opt}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 flex justify-end">
        <Button
          onClick={handleSubmit}
          isLoading={isSubmitting}
          disabled={Object.keys(answers).length !== (quizData.questions?.length || 0)}
          className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-sm hover:shadow-md transition-all"
        >
          Submit Quiz
        </Button>
      </div>

    </div>
  );
};

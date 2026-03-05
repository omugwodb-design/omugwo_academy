import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Upload, CheckCircle } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { cn } from '../../../../lib/utils';
import { supabase } from '../../../../lib/supabase';
import { submitAssignment } from '../../../../core/lms/lms-service';
import { toast } from 'react-hot-toast';

interface AssignmentLessonProps {
  lessonId: string;
  onComplete: () => void;
  userId: string;
}

export const AssignmentLesson: React.FC<AssignmentLessonProps> = ({ lessonId, onComplete, userId }) => {
  const [assignmentData, setAssignmentData] = useState<any>(null);
  const [submission, setSubmission] = useState<any>(null);
  const [textResponse, setTextResponse] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [lessonId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // 1. Get Assignment Details
      const { data: assignment, error: aError } = await supabase
        .from('assignments')
        .select('*')
        .eq('lesson_id', lessonId)
        .maybeSingle();
        
      if (aError) throw aError;
      setAssignmentData(assignment);

      // 2. Get User's Submission (if any)
      if (assignment && userId) {
        const { data: sub } = await supabase
          .from('assignment_submissions')
          .select('*')
          .eq('assignment_id', assignment.id)
          .eq('user_id', userId)
          .order('submitted_at', { ascending: false })
          .limit(1)
          .maybeSingle();
          
        if (sub) {
          setSubmission(sub);
          setTextResponse(sub.content || '');
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!assignmentData || !userId || !textResponse.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await submitAssignment(assignmentData.id, userId, { content: textResponse });
      setSubmission(res);
      toast.success('Assignment submitted successfully!');
      
      // If auto-grade or no grading required, mark complete immediately
      onComplete();
      
    } catch (error) {
      toast.error('Failed to submit assignment');
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

  if (!assignmentData) {
    return (
      <div className="w-full bg-white dark:bg-gray-900 rounded-2xl p-8 lg:p-12 border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center text-center min-h-[400px]">
        <ClipboardList className="w-12 h-12 text-gray-300 dark:text-gray-700 mb-4" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Assignment Found</h3>
        <p className="text-gray-500">There is no assignment configured for this lesson.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-2xl p-8 lg:p-12 border border-gray-200 dark:border-gray-800 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-10 pb-8 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0 mt-1">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{assignmentData.title}</h2>
            <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 text-sm">
              <div dangerouslySetInnerHTML={{ __html: assignmentData.description || '' }} />
            </div>
          </div>
        </div>

        {submission && (
          <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold shrink-0",
            submission.status === 'graded' 
              ? "bg-green-50 text-green-700 dark:bg-green-500/20 dark:text-green-400" 
              : "bg-yellow-50 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400"
          )}>
            <CheckCircle className="w-4 h-4" />
            {submission.status === 'graded' ? 'Graded' : 'Submitted for Review'}
          </div>
        )}
      </div>

      {/* Submission Area */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Submission</h3>
        
        {submission && submission.status === 'graded' ? (
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-6">{submission.content}</p>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              <p className="text-sm font-bold text-gray-900 dark:text-white mb-2">Feedback:</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                {submission.feedback || 'No written feedback provided.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <textarea
              value={textResponse}
              onChange={(e) => setTextResponse(e.target.value)}
              disabled={!!submission}
              placeholder="Type your answer or paste a link to your work here..."
              className="w-full h-64 p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none resize-none transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            />
            
            {!submission ? (
              <div className="flex justify-end">
                <Button
                  onClick={handleSubmit}
                  isLoading={isSubmitting}
                  disabled={!textResponse.trim()}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl px-8 shadow-sm"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Submit Assignment
                </Button>
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-right italic">
                Your assignment is under review. You will be notified when it is graded.
              </p>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

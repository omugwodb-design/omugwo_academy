import { useState, useEffect, useRef, useCallback } from 'react';

type ContentType = 'video' | 'text' | 'pdf' | 'quiz' | 'assignment';

interface CompletionRules {
  type: ContentType;
  threshold?: number; // e.g., 0.85 for 85% scroll or video watch
  minimum_time?: number; // minimum seconds spent
}

export function useIntelligentCompletion(
  lessonId: string,
  contentType: ContentType,
  rules: CompletionRules,
  onComplete: (lessonId: string) => void,
  isAlreadyCompleted: boolean
) {
  const [timeSpent, setTimeSpent] = useState(0);
  const [hasReachedThreshold, setHasReachedThreshold] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Time tracking
  useEffect(() => {
    if (isAlreadyCompleted) return;

    timerRef.current = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [lessonId, isAlreadyCompleted]);

  // Check completion conditions
  const checkCompletion = useCallback(() => {
    if (isAlreadyCompleted) return;

    const timeMet = !rules.minimum_time || timeSpent >= rules.minimum_time;
    const thresholdMet = hasReachedThreshold;

    if (timeMet && thresholdMet) {
      onComplete(lessonId);
    }
  }, [isAlreadyCompleted, timeSpent, hasReachedThreshold, rules, onComplete, lessonId]);

  useEffect(() => {
    checkCompletion();
  }, [timeSpent, hasReachedThreshold, checkCompletion]);

  // Handlers for different content types
  const handleScroll = useCallback((scrollPercentage: number) => {
    if (rules.type !== 'text' && rules.type !== 'pdf') return;
    if (scrollPercentage >= (rules.threshold || 0.85)) {
      setHasReachedThreshold(true);
    }
  }, [rules]);

  const handleVideoProgress = useCallback((progressPercentage: number) => {
    if (rules.type !== 'video') return;
    if (progressPercentage >= (rules.threshold || 0.90)) {
      setHasReachedThreshold(true);
    }
  }, [rules]);

  const handleActionComplete = useCallback(() => {
    // For quizzes, assignments, or manual marks
    setHasReachedThreshold(true);
  }, []);

  return {
    timeSpent,
    handleScroll,
    handleVideoProgress,
    handleActionComplete
  };
}


// Lesson Progress Tracking System
// Tracks learner engagement and completion for interactive components

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LessonBlock } from './types';

// ============================================
// TYPES
// ============================================

export interface BlockCompletionState {
  blockId: string;
  completed: boolean;
  completedAt?: Date;
  interactions: number;
  timeSpent: number; // seconds
  data?: Record<string, any>; // Additional completion data (answers, selections, etc.)
}

export interface LessonProgress {
  lessonId: string;
  userId: string;
  startedAt: Date;
  lastAccessedAt: Date;
  blocks: Record<string, BlockCompletionState>;
  overallProgress: number; // 0-100 percentage
  isComplete: boolean;
  completedAt?: Date;
  totalTimeSpent: number; // seconds
}

export interface EngagementMetrics {
  totalSessions: number;
  averageSessionDuration: number;
  mostViewedBlocks: string[];
  leastViewedBlocks: string[];
  completionRate: number;
  averageTimeToComplete: number;
  dropOffPoints: string[]; // Block IDs where users commonly exit
}

// ============================================
// PROGRESS STORE
// ============================================

interface LessonProgressStore {
  // State
  currentLessonId: string | null;
  progress: Record<string, LessonProgress>; // lessonId -> progress
  
  // Actions
  startLesson: (lessonId: string, userId: string, blocks: LessonBlock[]) => void;
  recordBlockInteraction: (lessonId: string, blockId: string, data?: Record<string, any>) => void;
  markBlockComplete: (lessonId: string, blockId: string, data?: Record<string, any>) => void;
  updateTimeSpent: (lessonId: string, blockId: string, seconds: number) => void;
  getProgress: (lessonId: string) => LessonProgress | null;
  getBlockCompletion: (lessonId: string, blockId: string) => BlockCompletionState | null;
  calculateOverallProgress: (lessonId: string, blocks: LessonBlock[]) => number;
  isLessonComplete: (lessonId: string, blocks: LessonBlock[]) => boolean;
  resetProgress: (lessonId: string) => void;
  getEngagementMetrics: (lessonId: string) => EngagementMetrics | null;
}

export const useLessonProgressStore = create<LessonProgressStore>()(
  persist(
    (set, get) => ({
      currentLessonId: null,
      progress: {},

      startLesson: (lessonId, userId, blocks) => {
        const existing = get().progress[lessonId];
        
        if (existing) {
          // Resume existing progress
          set({
            currentLessonId: lessonId,
            progress: {
              ...get().progress,
              [lessonId]: {
                ...existing,
                lastAccessedAt: new Date(),
              },
            },
          });
        } else {
          // Start new progress
          const blockStates: Record<string, BlockCompletionState> = {};
          blocks.forEach(block => {
            blockStates[block.id] = {
              blockId: block.id,
              completed: false,
              interactions: 0,
              timeSpent: 0,
            };
          });

          set({
            currentLessonId: lessonId,
            progress: {
              ...get().progress,
              [lessonId]: {
                lessonId,
                userId,
                startedAt: new Date(),
                lastAccessedAt: new Date(),
                blocks: blockStates,
                overallProgress: 0,
                isComplete: false,
                totalTimeSpent: 0,
              },
            },
          });
        }
      },

      recordBlockInteraction: (lessonId, blockId, data) => {
        const progress = get().progress[lessonId];
        if (!progress) return;

        const blockState = progress.blocks[blockId];
        if (!blockState) return;

        set({
          progress: {
            ...get().progress,
            [lessonId]: {
              ...progress,
              lastAccessedAt: new Date(),
              blocks: {
                ...progress.blocks,
                [blockId]: {
                  ...blockState,
                  interactions: blockState.interactions + 1,
                  data: data ? { ...blockState.data, ...data } : blockState.data,
                },
              },
            },
          },
        });
      },

      markBlockComplete: (lessonId, blockId, data) => {
        const progress = get().progress[lessonId];
        if (!progress) return;

        const blockState = progress.blocks[blockId];
        if (!blockState || blockState.completed) return;

        const newBlocks = {
          ...progress.blocks,
          [blockId]: {
            ...blockState,
            completed: true,
            completedAt: new Date(),
            interactions: blockState.interactions + 1,
            data: data ? { ...blockState.data, ...data } : blockState.data,
          },
        };

        set({
          progress: {
            ...get().progress,
            [lessonId]: {
              ...progress,
              lastAccessedAt: new Date(),
              blocks: newBlocks,
            },
          },
        });
      },

      updateTimeSpent: (lessonId, blockId, seconds) => {
        const progress = get().progress[lessonId];
        if (!progress) return;

        const blockState = progress.blocks[blockId];
        if (!blockState) return;

        set({
          progress: {
            ...get().progress,
            [lessonId]: {
              ...progress,
              totalTimeSpent: progress.totalTimeSpent + seconds,
              blocks: {
                ...progress.blocks,
                [blockId]: {
                  ...blockState,
                  timeSpent: blockState.timeSpent + seconds,
                },
              },
            },
          },
        });
      },

      getProgress: (lessonId) => {
        return get().progress[lessonId] || null;
      },

      getBlockCompletion: (lessonId, blockId) => {
        const progress = get().progress[lessonId];
        if (!progress) return null;
        return progress.blocks[blockId] || null;
      },

      calculateOverallProgress: (lessonId, blocks) => {
        const progress = get().progress[lessonId];
        if (!progress) return 0;

        const totalBlocks = blocks.length;
        if (totalBlocks === 0) return 0;

        const completedBlocks = Object.values(progress.blocks).filter(b => b.completed).length;
        return Math.round((completedBlocks / totalBlocks) * 100);
      },

      isLessonComplete: (lessonId, blocks) => {
        const progress = get().progress[lessonId];
        if (!progress) return false;

        return blocks.every(block => {
          const blockState = progress.blocks[block.id];
          return blockState?.completed ?? false;
        });
      },

      resetProgress: (lessonId) => {
        const progress = get().progress;
        const { [lessonId]: _, ...rest } = progress;

        set({
          progress: rest,
          currentLessonId: get().currentLessonId === lessonId ? null : get().currentLessonId,
        });
      },

      getEngagementMetrics: (lessonId) => {
        const progress = get().progress[lessonId];
        if (!progress) return null;

        const blocks = Object.values(progress.blocks);
        
        // Sort by views
        const sortedByViews = [...blocks].sort((a, b) => b.interactions - a.interactions);
        const sortedByTime = [...blocks].sort((a, b) => b.timeSpent - a.timeSpent);

        const completedCount = blocks.filter(b => b.completed).length;
        const completionRate = blocks.length > 0 
          ? Math.round((completedCount / blocks.length) * 100)
          : 0;

        return {
          totalSessions: 1, // Would need to track sessions separately
          averageSessionDuration: progress.totalTimeSpent,
          mostViewedBlocks: sortedByViews.slice(0, 5).map(b => b.blockId),
          leastViewedBlocks: sortedByViews.slice(-5).map(b => b.blockId),
          completionRate,
          averageTimeToComplete: progress.isComplete && progress.completedAt
            ? (new Date(progress.completedAt).getTime() - new Date(progress.startedAt).getTime()) / 1000
            : 0,
          dropOffPoints: [], // Would need exit tracking
        };
      },
    }),
    {
      name: 'lesson-progress-storage',
      partialize: (state) => ({
        progress: state.progress,
      }),
    }
  )
);

// ============================================
// COMPLETION RULES ENGINE
// ============================================

export type CompletionRuleType = 
  | 'view'           // Mark complete when viewed
  | 'interaction'    // Mark complete when interacted with
  | 'time'           // Mark complete after time threshold
  | 'percentage'     // Mark complete after percentage threshold (e.g., video watched)
  | 'submission'     // Mark complete when submitted
  | 'score';         // Mark complete when score threshold met

export interface CompletionRule {
  type: CompletionRuleType;
  threshold?: number;
  required?: boolean;
}

export const checkCompletion = (
  rule: CompletionRule,
  blockState: BlockCompletionState,
  additionalData?: Record<string, any>
): boolean => {
  switch (rule.type) {
    case 'view':
      return blockState.interactions >= 1;

    case 'interaction':
      return blockState.interactions >= (rule.threshold || 1);

    case 'time':
      return blockState.timeSpent >= (rule.threshold || 0);

    case 'percentage':
      return (additionalData?.percentage || 0) >= (rule.threshold || 100);

    case 'submission':
      return additionalData?.submitted === true;

    case 'score':
      return (additionalData?.score || 0) >= (rule.threshold || 0);

    default:
      return false;
  }
};

// ============================================
// PROGRESS TRACKING HOOKS
// ============================================

import { useEffect, useRef, useCallback } from 'react';

// Hook to track time spent on a block
export const useBlockTimeTracking = (
  lessonId: string,
  blockId: string,
  isActive: boolean = true
) => {
  const startTimeRef = useRef<number | null>(null);
  const { updateTimeSpent } = useLessonProgressStore();

  useEffect(() => {
    if (!isActive) {
      // Save time when becoming inactive
      if (startTimeRef.current) {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        if (elapsed > 0) {
          updateTimeSpent(lessonId, blockId, elapsed);
        }
        startTimeRef.current = null;
      }
      return;
    }

    startTimeRef.current = Date.now();

    // Track time every 30 seconds
    const interval = setInterval(() => {
      if (startTimeRef.current) {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        if (elapsed >= 30) {
          updateTimeSpent(lessonId, blockId, 30);
          startTimeRef.current = Date.now();
        }
      }
    }, 30000);

    return () => {
      clearInterval(interval);
      // Save remaining time on unmount
      if (startTimeRef.current) {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        if (elapsed > 0) {
          updateTimeSpent(lessonId, blockId, elapsed);
        }
      }
    };
  }, [lessonId, blockId, isActive, updateTimeSpent]);
};

// Hook to track block completion
export const useBlockCompletion = (
  lessonId: string,
  blockId: string,
  completionRequired?: boolean
) => {
  const { markBlockComplete, recordBlockInteraction, getBlockCompletion } = useLessonProgressStore();

  const handleComplete = useCallback((data?: Record<string, any>) => {
    if (completionRequired) {
      markBlockComplete(lessonId, blockId, data);
    }
  }, [lessonId, blockId, completionRequired, markBlockComplete]);

  const handleInteraction = useCallback((data?: Record<string, any>) => {
    recordBlockInteraction(lessonId, blockId, data);
  }, [lessonId, blockId, recordBlockInteraction]);

  const completion = getBlockCompletion(lessonId, blockId);

  return {
    isCompleted: completion?.completed ?? false,
    handleComplete,
    handleInteraction,
    completion,
  };
};

// ============================================
// PROGRESS DISPLAY COMPONENTS
// ============================================

import React from 'react';
import { cn } from '../../../lib/utils';
import { CheckCircle, Clock, TrendingUp, BarChart2 } from 'lucide-react';

interface ProgressBarProps {
  progress: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'green' | 'blue';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  showLabel = true,
  size = 'md',
  color = 'primary',
}) => {
  const sizeStyles = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const colorStyles = {
    primary: 'bg-primary-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
  };

  return (
    <div className="w-full">
      <div className={cn('w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden', sizeStyles[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', colorStyles[color])}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
          {progress}% complete
        </p>
      )}
    </div>
  );
};

interface LessonProgressHeaderProps {
  lessonId: string;
  blocks: LessonBlock[];
  title?: string;
}

export const LessonProgressHeader: React.FC<LessonProgressHeaderProps> = ({
  lessonId,
  blocks,
  title,
}) => {
  const { getProgress, calculateOverallProgress, isLessonComplete } = useLessonProgressStore();
  const progress = getProgress(lessonId);
  const overallProgress = calculateOverallProgress(lessonId, blocks);
  const complete = isLessonComplete(lessonId, blocks);

  const completedCount = progress
    ? Object.values(progress.blocks).filter(b => b.completed).length
    : 0;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      {title && (
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          {title}
        </h3>
      )}

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {complete ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <TrendingUp className="w-5 h-5 text-primary-500" />
          )}
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {complete ? 'Completed' : 'In Progress'}
          </span>
        </div>
        <span className="text-sm text-gray-500">
          {completedCount} of {blocks.length} sections
        </span>
      </div>

      <ProgressBar progress={overallProgress} color={complete ? 'green' : 'primary'} />

      {progress && (
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{Math.round(progress.totalTimeSpent / 60)} min</span>
          </div>
          <div className="flex items-center gap-1">
            <BarChart2 className="w-3.5 h-3.5" />
            <span>{overallProgress}% complete</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default useLessonProgressStore;

/**
 * Gamification System
 * 
 * Comprehensive gamification components for interactive lessons:
 * - Progress tracking
 * - Badges & achievements
 * - Score feedback
 * - Checkpoints
 * - Streaks & rewards
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { cn } from '../../../../lib/utils';
import {
  Trophy,
  Star,
  Award,
  Target,
  Zap,
  Flame,
  CheckCircle,
  Lock,
  Unlock,
  TrendingUp,
  Medal,
  Crown,
  Sparkles,
  Heart,
  ThumbsUp,
  Clock,
  BarChart3,
  ChevronRight,
  X,
  Info,
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  earnedAt?: Date;
  progress?: number;
  requirement: {
    type: 'completion' | 'score' | 'streak' | 'time' | 'interaction';
    value: number;
    metadata?: Record<string, any>;
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  progress: number;
  target: number;
  unlocked: boolean;
  unlockedAt?: Date;
  reward?: {
    points: number;
    badge?: string;
  };
}

export interface Checkpoint {
  id: string;
  name: string;
  description?: string;
  requiredScore?: number;
  requiredProgress?: number;
  bonusPoints?: number;
  reached: boolean;
  reachedAt?: Date;
}

export interface ScoreConfig {
  startingScore: number;
  correctAnswerPoints: number;
  wrongAnswerPenalty: number;
  completionBonus: number;
  speedBonus: {
    enabled: boolean;
    timeLimit: number;
    multiplier: number;
  };
  streakBonus: {
    enabled: boolean;
    threshold: number;
    multiplier: number;
  };
}

export interface GamificationState {
  score: number;
  maxScore: number;
  progress: number;
  streak: number;
  maxStreak: number;
  timeSpent: number;
  badges: Badge[];
  achievements: Achievement[];
  checkpoints: Checkpoint[];
  config: ScoreConfig;
}

// ============================================
// PROGRESS BAR COMPONENT
// ============================================

interface ProgressBarProps {
  progress: number;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'purple' | 'gradient';
  animated?: boolean;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  showPercentage = true,
  size = 'md',
  color = 'blue',
  animated = true,
  label,
}) => {
  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    gradient: 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500',
  };

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{label}</span>}
          {showPercentage && (
            <span className="text-xs font-bold text-gray-900 dark:text-white">{Math.round(progress)}%</span>
          )}
        </div>
      )}
      <div className={cn('w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden', sizeClasses[size])}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            colorClasses[color],
            animated && 'animate-pulse-once'
          )}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
};

// ============================================
// SCORE DISPLAY COMPONENT
// ============================================

interface ScoreDisplayProps {
  score: number;
  maxScore?: number;
  showAnimation?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  score,
  maxScore,
  showAnimation = false,
  size = 'md',
  label = 'Score',
}) => {
  const [displayScore, setDisplayScore] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (showAnimation && score !== displayScore) {
      setIsAnimating(true);
      const diff = score - displayScore;
      const step = Math.ceil(Math.abs(diff) / 20);
      const direction = diff > 0 ? 1 : -1;
      
      const interval = setInterval(() => {
        setDisplayScore(prev => {
          const next = prev + step * direction;
          if ((direction > 0 && next >= score) || (direction < 0 && next <= score)) {
            clearInterval(interval);
            setIsAnimating(false);
            return score;
          }
          return next;
        });
      }, 30);

      return () => clearInterval(interval);
    } else {
      setDisplayScore(score);
    }
  }, [score, showAnimation]);

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  return (
    <div className="flex flex-col items-center">
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</span>
      <div className={cn('font-bold text-gray-900 dark:text-white', sizeClasses[size])}>
        <span className={cn(isAnimating && 'animate-bounce-subtle')}>{displayScore.toLocaleString()}</span>
        {maxScore && <span className="text-gray-400 dark:text-gray-500 text-lg"> / {maxScore.toLocaleString()}</span>}
      </div>
    </div>
  );
};

// ============================================
// STREAK COUNTER COMPONENT
// ============================================

interface StreakCounterProps {
  streak: number;
  maxStreak?: number;
  onStreakBonus?: (streak: number) => void;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({
  streak,
  maxStreak = 0,
  onStreakBonus,
}) => {
  const [showBonus, setShowBonus] = useState(false);

  useEffect(() => {
    if (streak > 0 && streak % 5 === 0) {
      setShowBonus(true);
      onStreakBonus?.(streak);
      setTimeout(() => setShowBonus(false), 2000);
    }
  }, [streak, onStreakBonus]);

  const getFlameIntensity = () => {
    if (streak >= 20) return 'text-orange-500 scale-125';
    if (streak >= 10) return 'text-orange-400 scale-110';
    if (streak >= 5) return 'text-yellow-500 scale-105';
    return 'text-gray-400';
  };

  return (
    <div className="relative flex items-center gap-2 px-3 py-1.5 bg-orange-50 dark:bg-orange-950/30 rounded-full">
      <Flame className={cn('w-5 h-5 transition-all duration-300', getFlameIntensity())} />
      <span className="font-bold text-orange-600 dark:text-orange-400">{streak}</span>
      {maxStreak > 0 && (
        <span className="text-xs text-orange-400">Best: {maxStreak}</span>
      )}
      
      {showBonus && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded animate-bounce">
          🔥 Streak Bonus!
        </div>
      )}
    </div>
  );
};

// ============================================
// BADGE COMPONENT
// ============================================

interface BadgeCardProps {
  badge: Badge;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  onClick?: () => void;
}

const TIER_COLORS: Record<Badge['tier'], { border: string; bg: string; text: string }> = {
  bronze: { border: 'border-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/30', text: 'text-amber-600' },
  silver: { border: 'border-gray-400', bg: 'bg-gray-50 dark:bg-gray-800', text: 'text-gray-500' },
  gold: { border: 'border-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-950/30', text: 'text-yellow-600' },
  platinum: { border: 'border-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/30', text: 'text-purple-400' },
};

const TIER_ICONS: Record<Badge['tier'], React.ElementType> = {
  bronze: Medal,
  silver: Award,
  gold: Trophy,
  platinum: Crown,
};

export const BadgeCard: React.FC<BadgeCardProps> = ({
  badge,
  size = 'md',
  showDetails = false,
  onClick,
}) => {
  const isEarned = !!badge.earnedAt;
  const TierIcon = TIER_ICONS[badge.tier];
  const colors = TIER_COLORS[badge.tier];

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative rounded-xl border-2 p-2 transition-all duration-300',
        sizeClasses[size],
        colors.bg,
        colors.border,
        isEarned ? 'opacity-100' : 'opacity-50 grayscale',
        onClick && 'cursor-pointer hover:scale-105 hover:shadow-lg'
      )}
    >
      {/* Badge Icon */}
      <div className="w-full h-full flex items-center justify-center">
        <TierIcon className={cn('w-1/2 h-1/2', colors.text)} />
      </div>

      {/* Lock Overlay */}
      {!isEarned && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl">
          <Lock className="w-4 h-4 text-gray-400" />
        </div>
      )}

      {/* Progress Ring */}
      {badge.progress !== undefined && !isEarned && badge.progress > 0 && (
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray={`${badge.progress * 2.83} 283`}
            className="text-blue-500"
          />
        </svg>
      )}

      {/* Details Tooltip */}
      {showDetails && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="font-semibold">{badge.name}</div>
          <div className="text-gray-400">{badge.description}</div>
        </div>
      )}
    </div>
  );
};

// ============================================
// ACHIEVEMENT UNLOCK ANIMATION
// ============================================

interface AchievementUnlockProps {
  achievement: Achievement;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export const AchievementUnlock: React.FC<AchievementUnlockProps> = ({
  achievement,
  onClose,
  autoClose = true,
  autoCloseDelay = 4000,
}) => {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(onClose, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDelay, onClose]);

  const Icon = achievement.icon;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="animate-achievement-unlock pointer-events-auto">
        <div className={cn(
          'relative p-8 rounded-2xl border-2 shadow-2xl',
          'bg-gradient-to-br from-gray-900 to-gray-800',
          'border-yellow-500/50'
        )}>
          {/* Sparkles */}
          <div className="absolute -inset-4">
            <Sparkles className="absolute top-0 left-1/4 w-6 h-6 text-yellow-400 animate-pulse" />
            <Sparkles className="absolute top-1/4 right-0 w-4 h-4 text-purple-400 animate-pulse delay-100" />
            <Sparkles className="absolute bottom-0 left-1/3 w-5 h-5 text-blue-400 animate-pulse delay-200" />
          </div>

          {/* Content */}
          <div className="text-center relative z-10">
            <div className="text-xs font-bold text-yellow-400 uppercase tracking-widest mb-2">
              Achievement Unlocked!
            </div>
            
            <div className={cn(
              'w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4',
              achievement.bgColor
            )}>
              <Icon className={cn('w-10 h-10', achievement.color)} />
            </div>

            <h3 className="text-xl font-bold text-white mb-1">{achievement.title}</h3>
            <p className="text-sm text-gray-400 mb-4">{achievement.description}</p>

            {achievement.reward && (
              <div className="flex items-center justify-center gap-2 text-yellow-400">
                <Star className="w-4 h-4" />
                <span className="font-semibold">+{achievement.reward.points} points</span>
              </div>
            )}

            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium text-white transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// CHECKPOINT INDICATOR
// ============================================

interface CheckpointIndicatorProps {
  checkpoint: Checkpoint;
  position?: 'top' | 'side';
  onReach?: () => void;
}

export const CheckpointIndicator: React.FC<CheckpointIndicatorProps> = ({
  checkpoint,
  position = 'top',
  onReach,
}) => {
  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 rounded-xl transition-all duration-300',
        checkpoint.reached
          ? 'bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800'
          : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
      )}
    >
      <div className={cn(
        'w-10 h-10 rounded-full flex items-center justify-center',
        checkpoint.reached
          ? 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400'
          : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
      )}>
        {checkpoint.reached ? (
          <CheckCircle className="w-5 h-5" />
        ) : (
          <Target className="w-5 h-5" />
        )}
      </div>

      <div className="flex-1">
        <h4 className="font-semibold text-gray-900 dark:text-white">{checkpoint.name}</h4>
        {checkpoint.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400">{checkpoint.description}</p>
        )}
      </div>

      {checkpoint.bonusPoints && (
        <div className={cn(
          'px-2 py-1 rounded text-xs font-bold',
          checkpoint.reached
            ? 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
        )}>
          +{checkpoint.bonusPoints} pts
        </div>
      )}
    </div>
  );
};

// ============================================
// GAMIFICATION HUD
// ============================================

interface GamificationHUDProps {
  state: GamificationState;
  onAchievementView?: (achievement: Achievement) => void;
  onBadgeView?: (badge: Badge) => void;
  compact?: boolean;
}

export const GamificationHUD: React.FC<GamificationHUDProps> = ({
  state,
  onAchievementView,
  onBadgeView,
  compact = false,
}) => {
  const earnedBadges = state.badges.filter(b => b.earnedAt);
  const unlockedAchievements = state.achievements.filter(a => a.unlocked);

  if (compact) {
    return (
      <div className="flex items-center gap-4 px-4 py-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-full shadow-lg">
        <ScoreDisplay score={state.score} size="sm" />
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />
        <StreakCounter streak={state.streak} maxStreak={state.maxStreak} />
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />
        <div className="flex items-center gap-1">
          <Trophy className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{earnedBadges.length}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 dark:text-white">Your Progress</h3>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {Math.floor(state.timeSpent / 60)}:{(state.timeSpent % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <ProgressBar progress={state.progress} color="gradient" label="Lesson Progress" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <ScoreDisplay score={state.score} maxScore={state.maxScore} showAnimation size="sm" />
        <StreakCounter streak={state.streak} maxStreak={state.maxStreak} />
        <div className="text-center">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Badges</span>
          <div className="font-bold text-gray-900 dark:text-white">
            {earnedBadges.length}/{state.badges.length}
          </div>
        </div>
      </div>

      {/* Recent Badges */}
      {earnedBadges.length > 0 && (
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Recent Badges</h4>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {earnedBadges.slice(0, 5).map(badge => (
              <BadgeCard key={badge.id} badge={badge} size="sm" onClick={() => onBadgeView?.(badge)} />
            ))}
          </div>
        </div>
      )}

      {/* Checkpoints */}
      {state.checkpoints.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Checkpoints</h4>
          <div className="space-y-2">
            {state.checkpoints.slice(0, 3).map(checkpoint => (
              <CheckpointIndicator key={checkpoint.id} checkpoint={checkpoint} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// LEADERBOARD COMPONENT
// ============================================

interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar?: string;
  score: number;
  badges: number;
  isCurrentUser?: boolean;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  title?: string;
  showBadges?: boolean;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  entries,
  title = 'Leaderboard',
  showBadges = true,
}) => {
  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 border-yellow-300';
      case 2: return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-300';
      case 3: return 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-300';
      default: return 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-blue-500" />
          <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {entries.map((entry) => (
          <div
            key={entry.userId}
            className={cn(
              'flex items-center gap-3 px-4 py-3 transition-colors',
              entry.isCurrentUser && 'bg-blue-50 dark:bg-blue-950/30'
            )}
          >
            {/* Rank */}
            <div className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border',
              getRankStyle(entry.rank)
            )}>
              {entry.rank <= 3 ? (
                <Trophy className="w-4 h-4" />
              ) : (
                entry.rank
              )}
            </div>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
              {entry.avatar ? (
                <img src={entry.avatar} alt={entry.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                entry.name.charAt(0).toUpperCase()
              )}
            </div>

            {/* Name */}
            <div className="flex-1">
              <span className={cn(
                'font-medium',
                entry.isCurrentUser ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'
              )}>
                {entry.name}
                {entry.isCurrentUser && ' (You)'}
              </span>
            </div>

            {/* Score */}
            <div className="text-right">
              <div className="font-bold text-gray-900 dark:text-white">{entry.score.toLocaleString()}</div>
              {showBadges && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Trophy className="w-3 h-3" />
                  {entry.badges}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// EXPORTS
// ============================================

export default {
  ProgressBar,
  ScoreDisplay,
  StreakCounter,
  BadgeCard,
  AchievementUnlock,
  CheckpointIndicator,
  GamificationHUD,
  Leaderboard,
};

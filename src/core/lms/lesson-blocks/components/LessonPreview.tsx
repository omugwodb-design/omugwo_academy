/**
 * Lesson Preview / Simulation Mode
 * 
 * Preview interactive lessons before publishing:
 * - Test interactions and branching paths
 * - Simulate learner experience
 * - Debug scenario flows
 * - Track completion paths
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { cn } from '../../../../lib/utils';
import {
  InteractiveLesson,
  Scene,
  SceneSection,
} from '../scene-types';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Bug,
  Eye,
  Monitor,
  Tablet,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  X,
  Settings,
  Flag,
  CheckCircle,
  AlertTriangle,
  Info,
  MessageSquare,
  BarChart3,
  Clock,
  Zap,
  ArrowRight,
  Home,
} from 'lucide-react';
import { SceneTransition, TRANSITION_PRESETS } from './AnimatedTransitions';
import { GamificationHUD, ProgressBar, ScoreDisplay, StreakCounter } from './GamificationSystem';
import { LESSON_THEMES, useLessonTheme, ThemeProvider, LessonThemeType } from './LessonThemes';

// ============================================
// TYPES
// ============================================

export type PreviewMode = 'desktop' | 'tablet' | 'mobile';
export type SimulationState = 'idle' | 'playing' | 'paused' | 'completed';

export interface PreviewConfig {
  mode: PreviewMode;
  showDebugPanel: boolean;
  showNavigation: boolean;
  showProgress: boolean;
  showGamification: boolean;
  autoAdvance: boolean;
  autoAdvanceDelay: number;
  recordSession: boolean;
}

export interface PreviewSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  sceneVisits: string[];
  interactions: InteractionRecord[];
  score: number;
  completed: boolean;
  path: string[];
}

export interface InteractionRecord {
  id: string;
  type: 'click' | 'choice' | 'answer' | 'navigation';
  timestamp: Date;
  sceneId: string;
  blockId?: string;
  data: Record<string, any>;
}

// ============================================
// DEVICE PREVIEW SIZES
// ============================================

const DEVICE_SIZES: Record<PreviewMode, { width: string; height: string }> = {
  desktop: { width: '100%', height: '100%' },
  tablet: { width: '768px', height: '1024px' },
  mobile: { width: '375px', height: '812px' },
};

// ============================================
// PREVIEW CONTROLS COMPONENT
// ============================================

interface PreviewControlsProps {
  state: SimulationState;
  currentSceneIndex: number;
  totalScenes: number;
  onPlay: () => void;
  onPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onReset: () => void;
  onModeChange: (mode: PreviewMode) => void;
  mode: PreviewMode;
  showDebug: boolean;
  onToggleDebug: () => void;
}

const PreviewControls: React.FC<PreviewControlsProps> = ({
  state,
  currentSceneIndex,
  totalScenes,
  onPlay,
  onPause,
  onPrevious,
  onNext,
  onReset,
  onModeChange,
  mode,
  showDebug,
  onToggleDebug,
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
      {/* Playback Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onReset}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          title="Reset"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={onPrevious}
          disabled={currentSceneIndex === 0}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
          title="Previous Scene"
        >
          <SkipBack className="w-4 h-4" />
        </button>
        {state === 'playing' ? (
          <button
            onClick={onPause}
            className="p-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            title="Pause"
          >
            <Pause className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onPlay}
            className="p-2 text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
            title="Play"
          >
            <Play className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={onNext}
          disabled={currentSceneIndex === totalScenes - 1}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
          title="Next Scene"
        >
          <SkipForward className="w-4 h-4" />
        </button>
        <span className="text-sm text-gray-400 ml-2">
          Scene {currentSceneIndex + 1} / {totalScenes}
        </span>
      </div>

      {/* Device Mode */}
      <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => onModeChange('desktop')}
          className={cn(
            'p-2 rounded-md transition-colors',
            mode === 'desktop' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
          )}
          title="Desktop"
        >
          <Monitor className="w-4 h-4" />
        </button>
        <button
          onClick={() => onModeChange('tablet')}
          className={cn(
            'p-2 rounded-md transition-colors',
            mode === 'tablet' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
          )}
          title="Tablet"
        >
          <Tablet className="w-4 h-4" />
        </button>
        <button
          onClick={() => onModeChange('mobile')}
          className={cn(
            'p-2 rounded-md transition-colors',
            mode === 'mobile' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
          )}
          title="Mobile"
        >
          <Smartphone className="w-4 h-4" />
        </button>
      </div>

      {/* Debug Toggle */}
      <button
        onClick={onToggleDebug}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors',
          showDebug ? 'bg-amber-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
        )}
      >
        <Bug className="w-4 h-4" />
        Debug
      </button>
    </div>
  );
};

// ============================================
// DEBUG PANEL COMPONENT
// ============================================

interface DebugPanelProps {
  session: PreviewSession;
  currentScene: Scene;
  lesson: InteractiveLesson;
  onJumpToScene: (sceneId: string) => void;
  onClose: () => void;
}

const DebugPanel: React.FC<DebugPanelProps> = ({
  session,
  currentScene,
  lesson,
  onJumpToScene,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'flow' | 'interactions' | 'state'>('flow');

  return (
    <div className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Bug className="w-4 h-4 text-amber-500" />
          <span className="font-semibold text-white">Debug Panel</span>
        </div>
        <button onClick={onClose} className="p-1 text-gray-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        {(['flow', 'interactions', 'state'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'flex-1 px-3 py-2 text-xs font-medium capitalize',
              activeTab === tab
                ? 'text-white border-b-2 border-amber-500'
                : 'text-gray-500 hover:text-gray-300'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'flow' && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-gray-400 mb-2">Scene Flow</h4>
            {lesson.scenes.map((scene, index) => {
              const isVisited = session.sceneVisits.includes(scene.id);
              const isCurrent = scene.id === currentScene.id;

              return (
                <button
                  key={scene.id}
                  onClick={() => onJumpToScene(scene.id)}
                  className={cn(
                    'w-full flex items-center gap-2 p-2 rounded-lg text-left transition-colors',
                    isCurrent
                      ? 'bg-amber-600/20 border border-amber-500'
                      : isVisited
                        ? 'bg-green-600/10 border border-green-600/30'
                        : 'bg-gray-800 hover:bg-gray-700'
                  )}
                >
                  <div className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                    isCurrent
                      ? 'bg-amber-500 text-white'
                      : isVisited
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-700 text-gray-400'
                  )}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{scene.title}</div>
                    <div className="text-xs text-gray-500">{scene.sections.length} sections</div>
                  </div>
                  {isVisited && <CheckCircle className="w-4 h-4 text-green-500" />}
                </button>
              );
            })}
          </div>
        )}

        {activeTab === 'interactions' && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-gray-400 mb-2">Interaction Log</h4>
            {session.interactions.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No interactions recorded yet</p>
            ) : (
              session.interactions.map((interaction, index) => (
                <div key={interaction.id} className="p-2 bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-white capitalize">{interaction.type}</span>
                    <span className="text-xs text-gray-500">
                      {interaction.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Scene: {lesson.scenes.find(s => s.id === interaction.sceneId)?.title || 'Unknown'}
                  </div>
                  {interaction.blockId && (
                    <div className="text-xs text-gray-500">Block: {interaction.blockId}</div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'state' && (
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-gray-400 mb-2">Current State</h4>
            
            <div className="p-3 bg-gray-800 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Current Scene</div>
              <div className="text-sm font-medium text-white">{currentScene.title}</div>
            </div>

            <div className="p-3 bg-gray-800 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Score</div>
              <div className="text-xl font-bold text-white">{session.score}</div>
            </div>

            <div className="p-3 bg-gray-800 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Path Taken</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {session.path.map((sceneId, index) => (
                  <React.Fragment key={sceneId}>
                    <span className="text-xs text-white">{lesson.scenes.find(s => s.id === sceneId)?.title || sceneId}</span>
                    {index < session.path.length - 1 && <ArrowRight className="w-3 h-3 text-gray-500" />}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="p-3 bg-gray-800 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Session Duration</div>
              <div className="text-sm font-medium text-white">
                {Math.round((Date.now() - session.startTime.getTime()) / 1000)}s
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// SCENE PREVIEW COMPONENT
// ============================================

interface ScenePreviewProps {
  scene: Scene;
  theme: keyof typeof LESSON_THEMES;
  onInteraction: (type: InteractionRecord['type'], data?: Record<string, any>) => void;
  isPlaying: boolean;
}

const ScenePreview: React.FC<ScenePreviewProps> = ({
  scene,
  theme,
  onInteraction,
  isPlaying,
}) => {
  const themeConfig = LESSON_THEMES[theme];

  const handleBlockInteraction = (blockId: string, type: InteractionRecord['type'], data?: Record<string, any>) => {
    onInteraction(type, { blockId, ...data });
  };

  return (
    <div
      className="min-h-screen relative"
      style={{ background: scene.background.type === 'solid' ? scene.background.color : undefined }}
    >
      {/* Background */}
      {scene.background.type === 'gradient' && scene.background.gradient && (
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: `linear-gradient(${scene.background.gradient.angle || 135}deg, ${scene.background.gradient.colors.join(', ')})`,
          }}
        />
      )}
      {scene.background.type === 'image' && scene.background.image && (
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{ backgroundImage: `url(${scene.background.image.src})` }}
        />
      )}

      {/* Scene Content */}
      <div className="relative z-10 p-8 max-w-4xl mx-auto">
        {/* Scene Title */}
        <h1 className="text-4xl font-bold mb-4" style={{ color: themeConfig.colors.text }}>
          {scene.title}
        </h1>

        {/* Scene Description */}
        {scene.description && (
          <p className="text-lg mb-8" style={{ color: themeConfig.colors.textMuted }}>
            {scene.description}
          </p>
        )}

        {/* Sections */}
        {scene.sections.map((section) => (
          <div key={section.id} className="mb-8">
            {section.title && (
              <h2 className="text-2xl font-semibold mb-4" style={{ color: themeConfig.colors.text }}>
                {section.title}
              </h2>
            )}

            {/* Blocks */}
            <div className="space-y-4">
              {section.blocks.map((block) => (
                <div
                  key={block.id}
                  className={themeConfig.components.card}
                  onClick={() => handleBlockInteraction(block.id, 'click')}
                >
                  <div className="text-gray-500 text-sm">
                    Block: {block.type}
                  </div>
                  {/* In a full implementation, this would render the actual block component */}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Navigation */}
        {scene.navigation && (
          <div className="mt-12 flex items-center justify-between">
            <div className="text-sm" style={{ color: themeConfig.colors.textMuted }}>
              {scene.navigation.type === 'click' && 'Click "Next" to continue'}
              {scene.navigation.type === 'scroll' && 'Scroll to continue'}
              {scene.navigation.type === 'auto' && 'Auto-advancing...'}
            </div>
            {scene.navigation.nextButton && (
              <button
                className={themeConfig.components.button}
                onClick={() => onInteraction('navigation')}
              >
                {scene.navigation.nextButton.label}
                <ArrowRight className="w-4 h-4 ml-2 inline" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// MAIN PREVIEW COMPONENT
// ============================================

export interface LessonPreviewProps {
  lesson: InteractiveLesson;
  onClose: () => void;
  initialSceneIndex?: number;
  config?: Partial<PreviewConfig>;
}

export const LessonPreview: React.FC<LessonPreviewProps> = ({
  lesson,
  onClose,
  initialSceneIndex = 0,
  config: userConfig,
}) => {
  const config: PreviewConfig = {
    mode: 'desktop',
    showDebugPanel: false,
    showNavigation: true,
    showProgress: true,
    showGamification: true,
    autoAdvance: false,
    autoAdvanceDelay: 5,
    recordSession: true,
    ...userConfig,
  };

  const [state, setState] = useState<SimulationState>('idle');
  const [currentSceneIndex, setCurrentSceneIndex] = useState(initialSceneIndex);
  const [previewMode, setPreviewMode] = useState<PreviewMode>(config.mode);
  const [showDebug, setShowDebug] = useState(config.showDebugPanel);
  const [session, setSession] = useState<PreviewSession>({
    id: `session_${Date.now()}`,
    startTime: new Date(),
    sceneVisits: [],
    interactions: [],
    score: 0,
    completed: false,
    path: [],
  });

  const currentScene = lesson.scenes[currentSceneIndex];
  const theme: LessonThemeType = (lesson.theme as LessonThemeType) || 'immersive';

  // Record scene visit
  useEffect(() => {
    if (!session.sceneVisits.includes(currentScene.id)) {
      setSession(prev => ({
        ...prev,
        sceneVisits: [...prev.sceneVisits, currentScene.id],
        path: [...prev.path, currentScene.id],
      }));
    }
  }, [currentScene.id, session.sceneVisits]);

  // Auto-advance
  useEffect(() => {
    if (state === 'playing' && config.autoAdvance && currentSceneIndex < lesson.scenes.length - 1) {
      const timer = setTimeout(() => {
        setCurrentSceneIndex(prev => prev + 1);
      }, config.autoAdvanceDelay * 1000);
      return () => clearTimeout(timer);
    }
  }, [state, config.autoAdvance, currentSceneIndex, lesson.scenes.length, config.autoAdvanceDelay]);

  const handlePlay = useCallback(() => setState('playing'), []);
  const handlePause = useCallback(() => setState('paused'), []);
  
  const handlePrevious = useCallback(() => {
    setCurrentSceneIndex(prev => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    if (currentSceneIndex < lesson.scenes.length - 1) {
      setCurrentSceneIndex(prev => prev + 1);
    } else {
      setState('completed');
      setSession(prev => ({
        ...prev,
        completed: true,
        endTime: new Date(),
      }));
    }
  }, [currentSceneIndex, lesson.scenes.length]);

  const handleReset = useCallback(() => {
    setCurrentSceneIndex(0);
    setState('idle');
    setSession({
      id: `session_${Date.now()}`,
      startTime: new Date(),
      sceneVisits: [],
      interactions: [],
      score: 0,
      completed: false,
      path: [],
    });
  }, []);

  const handleJumpToScene = useCallback((sceneId: string) => {
    const index = lesson.scenes.findIndex(s => s.id === sceneId);
    if (index !== -1) {
      setCurrentSceneIndex(index);
    }
  }, [lesson.scenes]);

  const handleInteraction = useCallback((type: InteractionRecord['type'], data?: Record<string, any>) => {
    if (config.recordSession) {
      const interaction: InteractionRecord = {
        id: `interaction_${Date.now()}`,
        type,
        timestamp: new Date(),
        sceneId: currentScene.id,
        data: data || {},
      };
      setSession(prev => ({
        ...prev,
        interactions: [...prev.interactions, interaction],
      }));
    }

    // Handle navigation interactions
    if (type === 'navigation') {
      handleNext();
    }
  }, [config.recordSession, currentScene.id, handleNext]);

  const deviceSize = DEVICE_SIZES[previewMode];

  return (
    <div className="fixed inset-0 z-50 bg-gray-950 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <Eye className="w-5 h-5 text-blue-500" />
          <span className="font-semibold text-white">Preview Mode</span>
          <span className="text-sm text-gray-400">- {lesson.title}</span>
        </div>
        <button
          onClick={onClose}
          className="px-3 py-1.5 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          Exit Preview
        </button>
      </div>

      {/* Controls */}
      <PreviewControls
        state={state}
        currentSceneIndex={currentSceneIndex}
        totalScenes={lesson.scenes.length}
        onPlay={handlePlay}
        onPause={handlePause}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onReset={handleReset}
        onModeChange={setPreviewMode}
        mode={previewMode}
        showDebug={showDebug}
        onToggleDebug={() => setShowDebug(!showDebug)}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Preview Area */}
        <div className="flex-1 flex items-center justify-center p-4 bg-gray-950 overflow-auto">
          <div
            className={cn(
              'bg-white dark:bg-gray-900 rounded-lg shadow-2xl overflow-hidden',
              previewMode !== 'desktop' && 'border border-gray-700'
            )}
            style={{
              width: deviceSize.width,
              height: deviceSize.height,
              maxWidth: '100%',
              maxHeight: '100%',
            }}
          >
            <SceneTransition
              transition={TRANSITION_PRESETS.sceneEnter}
              key={currentScene.id}
            >
              <ScenePreview
                scene={currentScene}
                theme={theme}
                onInteraction={handleInteraction}
                isPlaying={state === 'playing'}
              />
            </SceneTransition>
          </div>
        </div>

        {/* Debug Panel */}
        {showDebug && (
          <DebugPanel
            session={session}
            currentScene={currentScene}
            lesson={lesson}
            onJumpToScene={handleJumpToScene}
            onClose={() => setShowDebug(false)}
          />
        )}
      </div>

      {/* Progress Bar */}
      {config.showProgress && (
        <div className="px-4 py-2 bg-gray-900 border-t border-gray-800">
          <ProgressBar
            progress={(session.sceneVisits.length / lesson.scenes.length) * 100}
            color="gradient"
            label="Lesson Progress"
          />
        </div>
      )}

      {/* Completion Overlay */}
      {state === 'completed' && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Preview Complete!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You've previewed all {lesson.scenes.length} scenes.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{session.interactions.length}</div>
                <div className="text-sm text-gray-500">Interactions</div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{session.score}</div>
                <div className="text-sm text-gray-500">Score</div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Preview Again
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
              >
                Exit Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonPreview;

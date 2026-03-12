/**
 * Interactive Lesson Viewer
 * 
 * Renders immersive, scene-based lessons with narrative flows,
 * visual backgrounds, interactive components, and branching logic.
 */

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../../lib/utils';
import { InteractiveLesson, Scene, SceneBackground } from '../scene-types';
import { LessonBlockRenderer } from '../LessonBlockRenderer';
import {
  useLessonProgressStore,
  ProgressBar,
  useBlockTimeTracking,
} from '../progress-tracking';
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Clock,
  CheckCircle,
  Circle,
  Play,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
} from 'lucide-react';

// ============================================
// HELPER: Get CSS background string
// ============================================

function getBackgroundStyle(background: SceneBackground): string {
  switch (background.type) {
    case 'solid':
      return background.color || '#1a1a2e';
    case 'gradient':
      if (background.gradient) {
        const angle = background.gradient.angle || 135;
        const colors = background.gradient.colors.join(', ');
        return `linear-gradient(${angle}deg, ${colors})`;
      }
      return '#1a1a2e';
    case 'image':
      if (background.image) {
        return `url(${background.image.src}) center/cover`;
      }
      return '#1a1a2e';
    default:
      return '#1a1a2e';
  }
}

// ============================================
// TYPES
// ============================================

export interface InteractiveLessonViewerProps {
  lesson: InteractiveLesson;
  userId?: string;
  onComplete?: () => void;
  onExit?: () => void;
}

// ============================================
// MAIN VIEWER COMPONENT
// ============================================

export const InteractiveLessonViewer: React.FC<InteractiveLessonViewerProps> = ({
  lesson,
  userId = 'anonymous',
  onComplete,
  onExit,
}) => {
  // State
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [history, setHistory] = useState<number[]>([0]);
  const [tocOpen, setTocOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(lesson.settings?.enableAudio ?? false);
  
  // Audio references
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);
  const narrationAudioRef = useRef<HTMLAudioElement | null>(null);

  // Current scene
  const currentScene = lesson.scenes[currentSceneIndex];

  // Store
  const {
    startLesson,
    getProgress,
    isLessonComplete,
    calculateOverallProgress,
  } = useLessonProgressStore();

  // All blocks flat array for progress tracking
  const allBlocks = useMemo(() => {
    return lesson.scenes.flatMap(scene => 
      scene.sections.flatMap(section => section.blocks)
    );
  }, [lesson]);

  // Initialize tracking
  useEffect(() => {
    startLesson(lesson.id, userId, allBlocks);
  }, [lesson.id, userId, allBlocks, startLesson]);

  const progress = getProgress(lesson.id);
  const overallProgress = calculateOverallProgress(lesson.id, allBlocks);

  // Audio handling
  useEffect(() => {
    if (!isAudioEnabled) {
      if (bgAudioRef.current) {
        bgAudioRef.current.pause();
      }
      if (narrationAudioRef.current) {
        narrationAudioRef.current.pause();
      }
      return;
    }

    // Play background audio
    if (currentScene.audio?.background?.src) {
      if (!bgAudioRef.current) {
        bgAudioRef.current = new Audio(currentScene.audio.background.src);
        bgAudioRef.current.loop = currentScene.audio.background.loop !== false;
      } else if (bgAudioRef.current.src !== currentScene.audio.background.src) {
        bgAudioRef.current.src = currentScene.audio.background.src;
      }
      
      bgAudioRef.current.volume = currentScene.audio.background.volume ?? 0.5;
      
      const playPromise = bgAudioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(e => console.log('Audio autoplay prevented', e));
      }
    } else if (bgAudioRef.current) {
      bgAudioRef.current.pause();
    }

    // Play narration audio
    if (currentScene.audio?.narration?.src && currentScene.audio.narration.autoplay !== false) {
      if (!narrationAudioRef.current) {
        narrationAudioRef.current = new Audio(currentScene.audio.narration.src);
      } else {
        narrationAudioRef.current.src = currentScene.audio.narration.src;
      }
      
      const playPromise = narrationAudioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(e => console.log('Narration autoplay prevented', e));
      }
    } else if (narrationAudioRef.current) {
      narrationAudioRef.current.pause();
    }

    return () => {
      if (narrationAudioRef.current) {
        narrationAudioRef.current.pause();
      }
    };
  }, [currentSceneIndex, currentScene.audio, isAudioEnabled]);

  // Navigation handlers
  const goToScene = useCallback((index: number) => {
    if (index >= 0 && index < lesson.scenes.length) {
      setCurrentSceneIndex(index);
      setHistory(prev => [...prev, index]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [lesson.scenes.length]);

  const goNext = useCallback(() => {
    // Check if branching
    if (currentScene.navigation?.type === 'branching' && currentScene.navigation.branches) {
      // Logic for branching could be here if we auto-advance, but usually branching is triggered by a button in the scene.
      // So goNext might not apply directly unless it's a default path.
      return;
    }
    
    goToScene(currentSceneIndex + 1);
  }, [currentSceneIndex, goToScene, currentScene.navigation]);

  const goPrevious = useCallback(() => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      const prevIndex = newHistory[newHistory.length - 1];
      setCurrentSceneIndex(prevIndex);
      setHistory(newHistory);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      goToScene(currentSceneIndex - 1);
    }
  }, [currentSceneIndex, goToScene, history]);

  // Handle branching navigation
  const handleBranchNavigation = useCallback((targetSceneId: string) => {
    const targetIndex = lesson.scenes.findIndex(s => s.id === targetSceneId);
    if (targetIndex !== -1) {
      goToScene(targetIndex);
    }
  }, [lesson.scenes, goToScene]);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Animation variants based on transition setting
  const getVariants = () => {
    const enterType = currentScene.transition?.enter || 'fade';
    const exitType = currentScene.transition?.exit || 'fade';
    
    return {
      initial: {
        opacity: 0,
        x: enterType === 'slide-left' ? 100 : enterType === 'slide-right' ? -100 : 0,
        y: enterType === 'slide-up' ? 100 : enterType === 'slide-down' ? -100 : 0,
        scale: enterType === 'zoom-in' ? 0.9 : enterType === 'zoom-out' ? 1.1 : 1,
      },
      animate: {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        transition: { 
          duration: (currentScene.transition?.duration || 500) / 1000,
          ease: 'easeOut'
        }
      },
      exit: {
        opacity: 0,
        x: exitType === 'slide-left' ? -100 : exitType === 'slide-right' ? 100 : 0,
        y: exitType === 'slide-up' ? -100 : exitType === 'slide-down' ? 100 : 0,
        scale: exitType === 'zoom-in' ? 1.1 : exitType === 'zoom-out' ? 0.9 : 1,
        transition: { 
          duration: (currentScene.transition?.duration || 500) / 1000,
          ease: 'easeIn'
        }
      }
    };
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-black text-white relative">
      {/* Background Layer */}
      <div 
        className="absolute inset-0 z-0 transition-all duration-1000 ease-in-out"
        style={{
          background: getBackgroundStyle(currentScene.background)
        }}
      >
        {/* Parallax elements or video backgrounds would go here if defined in depth */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
      </div>

      {/* Header Overlay */}
      <header className="relative z-30 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setTocOpen(true)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md"
            title="Scene Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div>
            <h1 className="text-lg font-bold text-white drop-shadow-md">
              {lesson.title}
            </h1>
            {lesson.settings?.showGlobalProgress && (
              <div className="flex items-center gap-2 mt-1">
                <div className="w-32 h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white transition-all duration-500"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-white/80">{Math.round(overallProgress)}%</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAudioEnabled(!isAudioEnabled)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md"
            title={isAudioEnabled ? 'Mute' : 'Unmute'}
          >
            {isAudioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md"
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
          {onExit && (
            <button
              onClick={onExit}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md"
              title="Exit lesson"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-gray-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScene.id}
            variants={getVariants()}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col min-h-full pb-32"
          >
            {/* Header Area for the Scene */}
            {currentScene.title && currentScene.type !== 'welcome' && (
              <div 
                className="w-full py-16 px-6 md:px-12 flex flex-col items-center justify-center text-white"
                style={{ background: getBackgroundStyle(currentScene.background) }}
              >
                <div className="w-full max-w-4xl">
                  <h2 className="text-4xl md:text-5xl font-bold drop-shadow-lg mb-4">
                    {currentScene.title}
                  </h2>
                  {currentScene.description && (
                    <p className="text-lg md:text-xl text-white/90 max-w-2xl drop-shadow">
                      {currentScene.description}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Render Sections as Continuous Bands */}
            {currentScene.sections.map((section, sIndex) => {
              const sectionBg = section.background ? getBackgroundStyle(section.background) : (sIndex % 2 === 0 ? '#ffffff' : '#f8fafc');
              const isDarkText = !section.background || section.background.type === 'solid' && ['#ffffff', '#f8fafc', '#f3f4f6'].includes(section.background.color || '');
              
              return (
                <div 
                  key={section.id} 
                  className="w-full py-16 px-6 md:px-12 flex justify-center transition-colors duration-500"
                  style={{ background: sectionBg }}
                >
                  <div className={cn(
                    "w-full",
                    section.layoutConfig?.maxWidth === 'full' ? 'max-w-none' : 
                    section.layoutConfig?.maxWidth === 'xl' ? 'max-w-6xl' :
                    section.layoutConfig?.maxWidth === 'md' ? 'max-w-3xl' :
                    section.layoutConfig?.maxWidth === 'sm' ? 'max-w-xl' :
                    'max-w-4xl', // default 'lg'
                    isDarkText ? "text-gray-900" : "text-white"
                  )}>
                    {section.title && (
                      <h3 className="text-3xl font-bold mb-8">
                        {section.title}
                      </h3>
                    )}
                    
                    <div className={cn(
                      "grid gap-8",
                      section.layout === 'two-column' ? "grid-cols-1 md:grid-cols-2" :
                      section.layout === 'three-column' ? "grid-cols-1 md:grid-cols-3" :
                      section.layout === 'grid' ? `grid-cols-1 sm:grid-cols-2 lg:grid-cols-${section.layoutConfig?.columns || 3}` :
                      "grid-cols-1"
                    )}>
                      {section.blocks.map(block => (
                        <div key={block.id} className="w-full">
                          <LessonBlockRenderer
                            block={block}
                            isEditing={false}
                            onPropChange={() => {}}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Branching Buttons if Scene is Branching Type */}
            {currentScene.navigation?.type === 'branching' && currentScene.navigation.branches && (
              <div className="w-full py-16 px-6 md:px-12 flex justify-center bg-gray-50 dark:bg-gray-800">
                <div className="w-full max-w-2xl flex flex-col gap-4">
                  <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">Choose Your Path</h3>
                  {currentScene.navigation.branches.map(branch => (
                    <button
                      key={branch.id}
                      onClick={() => handleBranchNavigation(branch.targetSceneId)}
                      className={cn(
                        "p-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] text-left border-2 flex items-center justify-between",
                        branch.style === 'primary' 
                          ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:shadow-xl" 
                          : branch.style === 'success'
                          ? "bg-green-600 text-white border-green-600 hover:bg-green-700 hover:shadow-xl"
                          : branch.style === 'danger'
                          ? "bg-red-600 text-white border-red-600 hover:bg-red-700 hover:shadow-xl"
                          : "bg-white text-gray-900 border-gray-200 hover:border-blue-500 hover:shadow-md dark:bg-gray-800 dark:text-white dark:border-gray-700"
                      )}
                    >
                      <div>
                        <div className="flex items-center gap-3">
                          {branch.label}
                        </div>
                        {branch.description && (
                          <div className="text-sm font-normal mt-1 opacity-80">{branch.description}</div>
                        )}
                      </div>
                      <ChevronRight className="w-6 h-6 opacity-50" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation Bottom Bar */}
      {currentScene.navigation?.type !== 'branching' && (
        <div className="absolute bottom-0 left-0 right-0 z-30 p-6 flex justify-center bg-gradient-to-t from-black to-transparent pointer-events-none">
          <div className="flex items-center gap-4 pointer-events-auto backdrop-blur-xl bg-black/40 p-2 rounded-2xl border border-white/10">
            <button
              onClick={goPrevious}
              disabled={currentSceneIndex === 0}
              className="p-3 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-white"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <div className="px-4 font-medium text-white/80 flex items-center gap-2">
              <div className="flex gap-1">
                {lesson.scenes.map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-300",
                      i === currentSceneIndex ? "bg-white scale-125" : "bg-white/30"
                    )}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={goNext}
              disabled={currentSceneIndex === lesson.scenes.length - 1}
              className={cn(
                "px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all",
                currentSceneIndex === lesson.scenes.length - 1
                  ? "bg-white/10 text-white/30 cursor-not-allowed"
                  : "bg-white text-black hover:bg-gray-200 hover:scale-105"
              )}
            >
              {currentScene.navigation?.nextButton?.label || 'Continue'}
              <ChevronRight className="w-5 h-5" />
            </button>
            
            {/* Complete Lesson Button on Last Scene */}
            {currentSceneIndex === lesson.scenes.length - 1 && onComplete && (
              <button
                onClick={onComplete}
                className="px-6 py-3 rounded-xl font-bold flex items-center gap-2 bg-green-500 text-white hover:bg-green-600 hover:scale-105 transition-all shadow-lg shadow-green-500/30"
              >
                Complete Lesson
                <CheckCircle className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Table of Contents Modal */}
      <AnimatePresence>
        {tocOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setTocOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="absolute left-0 top-0 bottom-0 z-50 w-80 bg-gray-900 border-r border-gray-800 flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                <h3 className="font-bold text-xl text-white">Scenes</h3>
                <button onClick={() => setTocOpen(false)} className="p-2 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                {lesson.scenes.map((scene, index) => {
                  const isCurrent = index === currentSceneIndex;
                  return (
                    <button
                      key={scene.id}
                      onClick={() => {
                        goToScene(index);
                        setTocOpen(false);
                      }}
                      className={cn(
                        "w-full text-left p-4 rounded-xl transition-all duration-200 flex gap-4 items-center group",
                        isCurrent 
                          ? "bg-white/10 ring-1 ring-white/20" 
                          : "hover:bg-gray-800"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-colors",
                        isCurrent ? "bg-white text-black" : "bg-gray-800 text-gray-400 group-hover:bg-gray-700"
                      )}>
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "font-semibold truncate",
                          isCurrent ? "text-white" : "text-gray-300 group-hover:text-white"
                        )}>
                          {scene.title || `Scene ${index + 1}`}
                        </p>
                        {scene.description && (
                          <p className="text-xs text-gray-500 truncate mt-1">
                            {scene.description}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

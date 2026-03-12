// Lesson Viewer - Student-facing interface for viewing and interacting with lessons
// Apple-inspired design with smooth navigation and progress tracking

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { cn } from '../../../lib/utils';
import { LessonBlock } from './types';
import { LessonBlockRenderer } from './LessonBlockRenderer';
import { InteractiveLessonViewer } from './components/InteractiveLessonViewer';
import { InteractiveLesson } from './scene-types';
import {
  useLessonProgressStore,
  ProgressBar,
  useBlockTimeTracking,
  useBlockCompletion,
} from './progress-tracking';
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  BookOpen,
  Clock,
  CheckCircle,
  Circle,
  Home,
  Bookmark,
  Share2,
  Settings,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Printer,
  Download,
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface LessonSection {
  id: string;
  title: string;
  blocks: LessonBlock[];
}

interface LessonViewerProps {
  lessonId: string;
  lessonTitle: string;
  lessonDescription?: string;
  blocks?: LessonBlock[];
  interactiveLesson?: InteractiveLesson;
  userId?: string;
  onComplete?: () => void;
  onExit?: () => void;
  showTableOfContents?: boolean;
  showProgress?: boolean;
  showNavigation?: boolean;
  allowBookmarks?: boolean;
  allowFullscreen?: boolean;
  allowPrint?: boolean;
}

// ============================================
// TABLE OF CONTENTS COMPONENT
// ============================================

interface TableOfContentsProps {
  sections: LessonSection[];
  currentSectionIndex: number;
  completedSections: Set<string>;
  onSectionSelect: (index: number) => void;
  isOpen: boolean;
  onClose: () => void;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({
  sections,
  currentSectionIndex,
  completedSections,
  onSectionSelect,
  isOpen,
  onClose,
}) => {
  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-50',
          'transform transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-0 lg:overflow-hidden'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-bold text-gray-900 dark:text-white">Contents</h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Section List */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {sections.map((section, index) => {
                const isCompleted = completedSections.has(section.id);
                const isCurrent = index === currentSectionIndex;

                return (
                  <li key={section.id}>
                    <button
                      onClick={() => {
                        onSectionSelect(index);
                        onClose();
                      }}
                      className={cn(
                        'w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all duration-200',
                        isCurrent && 'bg-primary-50 dark:bg-primary-950/30',
                        !isCurrent && 'hover:bg-gray-50 dark:hover:bg-gray-800'
                      )}
                    >
                      <div
                        className={cn(
                          'w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                          isCompleted && 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
                          !isCompleted && isCurrent && 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400',
                          !isCompleted && !isCurrent && 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                        )}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            'font-medium text-sm truncate',
                            isCurrent ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'
                          )}
                        >
                          {section.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {section.blocks.length} item{section.blocks.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <BookOpen className="w-4 h-4" />
              <span>{sections.length} sections</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

// ============================================
// NAVIGATION BAR COMPONENT
// ============================================

interface NavigationBarProps {
  currentSection: LessonSection;
  currentSectionIndex: number;
  totalSections: number;
  onPrevious: () => void;
  onNext: () => void;
  onToggleTOC: () => void;
  onExit: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  isCompleted: boolean;
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  currentSection,
  currentSectionIndex,
  totalSections,
  onPrevious,
  onNext,
  onToggleTOC,
  onExit,
  canGoPrevious,
  canGoNext,
  isCompleted,
}) => {
  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 z-30">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left: TOC Toggle */}
          <button
            onClick={onToggleTOC}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
            <span className="text-sm font-medium hidden sm:inline">Contents</span>
          </button>

          {/* Center: Section Info */}
          <div className="flex-1 text-center px-4">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {currentSection.title}
            </p>
            <p className="text-xs text-gray-500">
              Section {currentSectionIndex + 1} of {totalSections}
            </p>
          </div>

          {/* Right: Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={onPrevious}
              disabled={!canGoPrevious}
              className={cn(
                'flex items-center gap-1 px-3 py-2 rounded-lg font-medium text-sm transition-all',
                canGoPrevious
                  ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
              )}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            {isCompleted ? (
              <button
                onClick={onExit}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white font-medium text-sm hover:bg-green-600 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                Complete
              </button>
            ) : (
              <button
                onClick={onNext}
                disabled={!canGoNext}
                className={cn(
                  'flex items-center gap-1 px-4 py-2 rounded-lg font-medium text-sm transition-all',
                  canGoNext
                    ? 'bg-primary-500 text-white hover:bg-primary-600'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                )}
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Fix the type name
interface NavigationBarProps {
  currentSection: LessonSection;
  currentSectionIndex: number;
  totalSections: number;
  onPrevious: () => void;
  onNext: () => void;
  onToggleTOC: () => void;
  onExit: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  isCompleted: boolean;
}

// ============================================
// SECTION VIEWER COMPONENT
// ============================================

interface SectionViewerProps {
  section: LessonSection;
  lessonId: string;
  isActive: boolean;
}

const SectionViewer: React.FC<SectionViewerProps> = ({
  section,
  lessonId,
  isActive,
}) => {
  // Track time spent on this section
  useBlockTimeTracking(lessonId, section.id, isActive);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {section.title}
          </h1>
        </div>

        {/* Section Content */}
        <div className="space-y-6">
          {section.blocks.map((block) => (
            <BlockWrapper
              key={block.id}
              block={block}
              lessonId={lessonId}
              isActive={isActive}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// BLOCK WRAPPER WITH TRACKING
// ============================================

interface BlockWrapperProps {
  block: LessonBlock;
  lessonId: string;
  isActive: boolean;
}

const BlockWrapper: React.FC<BlockWrapperProps> = ({
  block,
  lessonId,
  isActive,
}) => {
  const { isCompleted, handleComplete, handleInteraction } = useBlockCompletion(
    lessonId,
    block.id,
    block.props.completionRequired
  );

  // Track time on this block
  useBlockTimeTracking(lessonId, block.id, isActive);

  // Handle completion callback from interactive components
  const handleBlockComplete = useCallback(() => {
    handleComplete({ completedAt: new Date().toISOString() });
  }, [handleComplete]);

  return (
    <div
      className={cn(
        'relative',
        isCompleted && 'opacity-90'
      )}
    >
      {/* Completion indicator */}
      {isCompleted && (
        <div className="absolute -left-6 top-4 hidden lg:flex">
          <CheckCircle className="w-4 h-4 text-green-500" />
        </div>
      )}

      <LessonBlockRenderer
        block={block}
        isEditing={false}
        onPropChange={() => {}}
      />
    </div>
  );
};

// ============================================
// MAIN LESSON VIEWER COMPONENT
// ============================================

export const LessonViewer: React.FC<LessonViewerProps> = ({
  lessonId,
  lessonTitle,
  lessonDescription,
  blocks = [],
  interactiveLesson,
  userId = 'anonymous',
  onComplete,
  onExit,
  showTableOfContents = true,
  showProgress = true,
  showNavigation = true,
  allowBookmarks = true,
  allowFullscreen = true,
  allowPrint = false,
}) => {
  // If an interactive lesson is provided, delegate to the interactive viewer
  if (interactiveLesson) {
    return (
      <InteractiveLessonViewer
        lesson={interactiveLesson}
        userId={userId}
        onComplete={onComplete}
        onExit={onExit}
      />
    );
  }

  // State
  const [tocOpen, setTocOpen] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Progress store
  const {
    startLesson,
    getProgress,
    isLessonComplete,
    calculateOverallProgress,
  } = useLessonProgressStore();

  // Group blocks into sections
  const sections = useMemo<LessonSection[]>(() => {
    const sectionMap = new Map<string, LessonSection>();
    let currentSection: LessonSection = {
      id: 'section-1',
      title: 'Introduction',
      blocks: [],
    };

    blocks.forEach((block) => {
      if (block.type === 'section') {
        // Start a new section
        const sectionId = block.id;
        const sectionTitle = (block.props.title as string) || `Section ${sectionMap.size + 1}`;
        
        if (currentSection.blocks.length > 0) {
          sectionMap.set(currentSection.id, currentSection);
        }
        
        currentSection = {
          id: sectionId,
          title: sectionTitle,
          blocks: [],
        };
      } else {
        currentSection.blocks.push(block);
      }
    });

    // Add the last section
    if (currentSection.blocks.length > 0) {
      sectionMap.set(currentSection.id, currentSection);
    }

    const result = Array.from(sectionMap.values());
    return result.length > 0 ? result : [{ id: 'section-1', title: lessonTitle, blocks }];
  }, [blocks, lessonTitle]);

  // Initialize lesson progress
  useEffect(() => {
    startLesson(lessonId, userId, blocks);
  }, [lessonId, userId, blocks, startLesson]);

  // Get progress data
  const progress = getProgress(lessonId);
  const overallProgress = calculateOverallProgress(lessonId, blocks);
  const lessonComplete = isLessonComplete(lessonId, blocks);

  // Get completed sections
  const completedSections = useMemo(() => {
    const completed = new Set<string>();
    sections.forEach((section) => {
      if (progress) {
        const allBlocksComplete = section.blocks.every(
          (block) => progress.blocks[block.id]?.completed
        );
        if (allBlocksComplete) {
          completed.add(section.id);
        }
      }
    });
    return completed;
  }, [sections, progress]);

  // Navigation handlers
  const goToSection = useCallback((index: number) => {
    if (index >= 0 && index < sections.length) {
      setCurrentSectionIndex(index);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [sections.length]);

  const goNext = useCallback(() => {
    goToSection(currentSectionIndex + 1);
  }, [currentSectionIndex, goToSection]);

  const goPrevious = useCallback(() => {
    goToSection(currentSectionIndex - 1);
  }, [currentSectionIndex, goToSection]);

  // Handle lesson completion
  useEffect(() => {
    if (lessonComplete && onComplete) {
      onComplete();
    }
  }, [lessonComplete, onComplete]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        goPrevious();
      } else if (e.key === 'Escape') {
        setTocOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrevious]);

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

  const currentSection = sections[currentSectionIndex];

  return (
    <div className={cn('min-h-screen bg-gray-50 dark:bg-gray-950')}>
      {/* Table of Contents */}
      {showTableOfContents && (
        <TableOfContents
          sections={sections}
          currentSectionIndex={currentSectionIndex}
          completedSections={completedSections}
          onSectionSelect={goToSection}
          isOpen={tocOpen}
          onClose={() => setTocOpen(false)}
        />
      )}

      {/* Header */}
      <header className="sticky top-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 z-30">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left: Menu & Title */}
            <div className="flex items-center gap-3">
              {showTableOfContents && (
                <button
                  onClick={() => setTocOpen(true)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 lg:hidden"
                >
                  <Menu className="w-5 h-5" />
                </button>
              )}
              <div>
                <h1 className="font-bold text-gray-900 dark:text-white text-lg truncate max-w-[200px] sm:max-w-none">
                  {lessonTitle}
                </h1>
                {progress && (
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {Math.round(progress.totalTimeSpent / 60)} min
                  </p>
                )}
              </div>
            </div>

            {/* Center: Progress */}
            {showProgress && (
              <div className="hidden sm:flex flex-1 max-w-xs mx-4">
                <ProgressBar progress={overallProgress} showLabel={false} size="sm" />
              </div>
            )}

            {/* Right: Actions */}
            <div className="flex items-center gap-1">
              {allowFullscreen && (
                <button
                  onClick={toggleFullscreen}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
                  title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </button>
              )}
              <button
                onClick={onExit}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
                title="Exit lesson"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile Progress */}
          {showProgress && (
            <div className="sm:hidden mt-2">
              <ProgressBar progress={overallProgress} showLabel size="sm" />
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-20">
        {currentSection && (
          <SectionViewer
            section={currentSection}
            lessonId={lessonId}
            isActive={true}
          />
        )}
      </main>

      {/* Navigation Bar */}
      {showNavigation && (
        <NavigationBar
          currentSection={currentSection}
          currentSectionIndex={currentSectionIndex}
          totalSections={sections.length}
          onPrevious={goPrevious}
          onNext={goNext}
          onToggleTOC={() => setTocOpen(!tocOpen)}
          onExit={onExit || (() => {})}
          canGoPrevious={currentSectionIndex > 0}
          canGoNext={currentSectionIndex < sections.length - 1}
          isCompleted={lessonComplete}
        />
      )}
    </div>
  );
};

export default LessonViewer;

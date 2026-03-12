// Lesson Block System - Visual content editor for LMS lessons
// Interactive course creation system inspired by Adapt Learning

// Types
export * from './types';

// Registry
export { 
  LESSON_BLOCK_DEFINITIONS, 
  LESSON_BLOCK_CATEGORIES,
  getBlocksByCategory,
  getBlockDefinition,
  createBlock,
  generateBlockId,
} from './registry';

// Components
export { LessonEditor } from './LessonEditor';
export { LessonBlockRenderer } from './LessonBlockRenderer';
export { LessonBlockSettings } from './LessonBlockSettings';
export { LessonViewer } from './LessonViewer';

// Interactive Components
export {
  FlipCard,
  Accordion,
  Tabs,
  HotspotImage,
  Timeline,
  Scenario,
  Carousel,
  ComparisonSlider,
  ProcessSteps,
  KnowledgeCheck,
  Poll,
  MatchingExercise,
  SortingExercise,
  FillBlank,
} from './components/InteractiveBlocks';

// Layout Components
export {
  Section,
  Columns,
  Grid,
  Spacer,
} from './components/LayoutBlocks';

// Progress Tracking
export {
  useLessonProgressStore,
  useBlockTimeTracking,
  useBlockCompletion,
  ProgressBar,
  LessonProgressHeader,
  checkCompletion,
} from './progress-tracking';

// Saved Components
export {
  useSavedComponentsStore,
  SavedComponentsLibrary,
  SaveComponentModal,
  type SavedComponent,
  type ComponentFolder,
  type ComponentTemplate,
} from './saved-components';

// Accessibility
export {
  useRovingTabIndex,
  useFocusTrap,
  useSkipLink,
  useAnnouncer,
  announceToScreenReader,
  VisuallyHidden,
  SkipLink,
  LiveRegion,
  generateAriaId,
  buildBlockAriaProps,
  getBlockRole,
  KEYBOARD_INTERACTIONS,
  checkAccessibility,
  getFocusableElements,
  focusFirst,
  focusLast,
  getContrastRatio,
  meetsContrastRequirements,
} from './accessibility';

// Performance
export {
  useLazyLoad,
  useLazyBlock,
  VirtualList,
  useVirtualizedBlocks,
  useAutoSave,
  AutoSaveIndicator,
  usePerformanceMonitor,
  deepMemo,
  useDeepCallback,
  lazyWithRetry,
  useDynamicImport,
  OptimizedImage,
  useDebounce,
  useThrottle,
  useBatchedUpdates,
} from './performance';

// Lesson Template Types and Metadata
// Comprehensive template system for the interactive lesson builder

import { LessonBlock, LessonBlockType } from '../lesson-blocks/types';

// ============================================
// TEMPLATE METADATA TYPES
// ============================================

export type TemplateCategory =
  | 'standard'
  | 'interactive'
  | 'assessment'
  | 'scenario'
  | 'visual'
  | 'storytelling'
  | 'practice'
  | 'resource'
  | 'microlearning'
  | 'advanced';

export type TemplateDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type InteractivityLevel = 'low' | 'medium' | 'high';
export type ContentStyle = 
  | 'instructional'
  | 'narrative'
  | 'exploratory'
  | 'evaluative'
  | 'practical'
  | 'reference';

export interface TemplateMetadata {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  subcategory?: string;
  difficulty: TemplateDifficulty;
  interactivityLevel: InteractivityLevel;
  contentStyle: ContentStyle;
  estimatedTime: number; // in minutes
  tags: string[];
  featured: boolean;
  popular: boolean;
  thumbnail?: string;
  author?: string;
  version: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateComponent {
  type: LessonBlockType;
  label: string;
  description?: string;
  isRequired: boolean;
  order: number;
}

export interface TemplateCapability {
  id: string;
  name: string;
  description: string;
}

export interface LessonTemplate {
  metadata: TemplateMetadata;
  blocks: LessonBlock[];
  components: TemplateComponent[];
  capabilities: TemplateCapability[];
  defaultSettings: TemplateSettings;
  usageNotes?: string;
  customizationTips?: string[];
}

export interface TemplateSettings {
  allowSkip: boolean;
  requireCompletion: boolean;
  trackProgress: boolean;
  enableDiscussion: boolean;
  enableNotes: boolean;
  enableBookmarks: boolean;
  passingScore?: number;
  timeLimit?: number; // in minutes
  maxAttempts?: number;
  shuffleQuestions?: boolean;
  showFeedback: boolean;
  showHints: boolean;
}

// ============================================
// TEMPLATE CATEGORY DEFINITIONS
// ============================================

export const TEMPLATE_CATEGORIES: Record<TemplateCategory, {
  label: string;
  description: string;
  icon: string;
  color: string;
}> = {
  standard: {
    label: 'Standard Lessons',
    description: 'Common course lesson formats',
    icon: 'BookOpen',
    color: 'blue',
  },
  interactive: {
    label: 'Interactive Knowledge',
    description: 'Engaging exploration-based learning',
    icon: 'Layers',
    color: 'purple',
  },
  assessment: {
    label: 'Assessments',
    description: 'Evaluation and testing formats',
    icon: 'CheckCircle',
    color: 'green',
  },
  scenario: {
    label: 'Scenario-Based',
    description: 'Branching paths and simulations',
    icon: 'GitBranch',
    color: 'orange',
  },
  visual: {
    label: 'Visual Learning',
    description: 'Diagram and image-focused content',
    icon: 'Image',
    color: 'cyan',
  },
  storytelling: {
    label: 'Storytelling',
    description: 'Narrative-driven learning experiences',
    icon: 'BookMarked',
    color: 'pink',
  },
  practice: {
    label: 'Practice & Activities',
    description: 'Hands-on learning exercises',
    icon: 'Pencil',
    color: 'yellow',
  },
  resource: {
    label: 'Resources',
    description: 'Downloadable and reference materials',
    icon: 'FolderOpen',
    color: 'gray',
  },
  microlearning: {
    label: 'Microlearning',
    description: 'Short, focused lessons',
    icon: 'Zap',
    color: 'red',
  },
  advanced: {
    label: 'Advanced',
    description: 'Complex and adaptive learning',
    icon: 'Rocket',
    color: 'indigo',
  },
};

// ============================================
// TEMPLATE CAPABILITIES REGISTRY
// ============================================

export const TEMPLATE_CAPABILITIES: Record<string, TemplateCapability> = {
  videoTracking: {
    id: 'videoTracking',
    name: 'Video Tracking',
    description: 'Track video watch progress and completion',
  },
  scrollCompletion: {
    id: 'scrollCompletion',
    name: 'Scroll Completion',
    description: 'Detect when content has been fully scrolled',
  },
  resourceDownloads: {
    id: 'resourceDownloads',
    name: 'Resource Downloads',
    description: 'Downloadable files and resources',
  },
  richTextLayout: {
    id: 'richTextLayout',
    name: 'Rich Text Layout',
    description: 'Formatted text with headings, images, and styling',
  },
  readingCompletion: {
    id: 'readingCompletion',
    name: 'Reading Completion',
    description: 'Detect reading progress and completion',
  },
  slideInteraction: {
    id: 'slideInteraction',
    name: 'Slide Interaction',
    description: 'Interactive slide navigation and progression',
  },
  progressiveReveal: {
    id: 'progressiveReveal',
    name: 'Progressive Reveal',
    description: 'Content reveals as user progresses',
  },
  tabSwitching: {
    id: 'tabSwitching',
    name: 'Tab Switching',
    description: 'Organized content in switchable tabs',
  },
  cardInteraction: {
    id: 'cardInteraction',
    name: 'Card Interaction',
    description: 'Interactive flip and expand cards',
  },
  inlineGrading: {
    id: 'inlineGrading',
    name: 'Inline Grading',
    description: 'Instant feedback on questions',
  },
  assessmentEngine: {
    id: 'assessmentEngine',
    name: 'Assessment Engine',
    description: 'Full quiz and exam functionality',
  },
  advancedTesting: {
    id: 'advancedTesting',
    name: 'Advanced Testing',
    description: 'Timed exams with randomization',
  },
  branchingLogic: {
    id: 'branchingLogic',
    name: 'Branching Logic',
    description: 'Decision trees and branching paths',
  },
  decisionTrees: {
    id: 'decisionTrees',
    name: 'Decision Trees',
    description: 'Complex decision-making scenarios',
  },
  dialogueSimulation: {
    id: 'dialogueSimulation',
    name: 'Dialogue Simulation',
    description: 'Interactive conversation simulation',
  },
  outcomeExplanation: {
    id: 'outcomeExplanation',
    name: 'Outcome Explanation',
    description: 'Explain consequences of choices',
  },
  hotspots: {
    id: 'hotspots',
    name: 'Interactive Hotspots',
    description: 'Clickable areas on images',
  },
  sequentialLearning: {
    id: 'sequentialLearning',
    name: 'Sequential Learning',
    description: 'Step-by-step progression',
  },
  timelineNavigation: {
    id: 'timelineNavigation',
    name: 'Timeline Navigation',
    description: 'Navigate through chronological content',
  },
  narrativeFlow: {
    id: 'narrativeFlow',
    name: 'Narrative Flow',
    description: 'Story-driven content progression',
  },
  analyticalThinking: {
    id: 'analyticalThinking',
    name: 'Analytical Thinking',
    description: 'Case analysis and problem solving',
  },
  emotionalStorytelling: {
    id: 'emotionalStorytelling',
    name: 'Emotional Storytelling',
    description: 'Personal stories and testimonials',
  },
  assignmentSubmission: {
    id: 'assignmentSubmission',
    name: 'Assignment Submission',
    description: 'Submit work for review',
  },
  reflectionJournaling: {
    id: 'reflectionJournaling',
    name: 'Reflection Journaling',
    description: 'Guided reflection prompts',
  },
  guidedPractice: {
    id: 'guidedPractice',
    name: 'Guided Practice',
    description: 'Structured exercises with guidance',
  },
  resourceManagement: {
    id: 'resourceManagement',
    name: 'Resource Management',
    description: 'Organized collection of materials',
  },
  checklistProgress: {
    id: 'checklistProgress',
    name: 'Checklist Progress',
    description: 'Interactive checklist with tracking',
  },
  cardFlipping: {
    id: 'cardFlipping',
    name: 'Card Flipping',
    description: 'Flashcard-style interaction',
  },
  streakTracking: {
    id: 'streakTracking',
    name: 'Streak Tracking',
    description: 'Track consecutive completions',
  },
  conditionalLogic: {
    id: 'conditionalLogic',
    name: 'Conditional Logic',
    description: 'Content adapts based on responses',
  },
  gamification: {
    id: 'gamification',
    name: 'Gamification',
    description: 'Points, badges, and achievements',
  },
  workshopFormat: {
    id: 'workshopFormat',
    name: 'Workshop Format',
    description: 'Multi-component workshop structure',
  },
};

// ============================================
// DIFFICULTY LEVELS
// ============================================

export const DIFFICULTY_LEVELS: Record<TemplateDifficulty, {
  label: string;
  description: string;
  color: string;
}> = {
  beginner: {
    label: 'Beginner',
    description: 'No prior knowledge required',
    color: 'green',
  },
  intermediate: {
    label: 'Intermediate',
    description: 'Some foundational knowledge helpful',
    color: 'yellow',
  },
  advanced: {
    label: 'Advanced',
    description: 'Prior experience recommended',
    color: 'red',
  },
};

// ============================================
// INTERACTIVITY LEVELS
// ============================================

export const INTERACTIVITY_LEVELS: Record<InteractivityLevel, {
  label: string;
  description: string;
  icon: string;
}> = {
  low: {
    label: 'Low Interactivity',
    description: 'Primarily reading/watching',
    icon: 'BookOpen',
  },
  medium: {
    label: 'Medium Interactivity',
    description: 'Some interactive elements',
    icon: 'MousePointer',
  },
  high: {
    label: 'High Interactivity',
    description: 'Highly engaging and interactive',
    icon: 'Gamepad',
  },
};

// ============================================
// CONTENT STYLES
// ============================================

export const CONTENT_STYLES: Record<ContentStyle, {
  label: string;
  description: string;
  icon: string;
}> = {
  instructional: {
    label: 'Instructional',
    description: 'Direct teaching and instruction',
    icon: 'GraduationCap',
  },
  narrative: {
    label: 'Narrative',
    description: 'Story-based learning',
    icon: 'BookMarked',
  },
  exploratory: {
    label: 'Exploratory',
    description: 'Self-guided discovery',
    icon: 'Compass',
  },
  evaluative: {
    label: 'Evaluative',
    description: 'Assessment and evaluation',
    icon: 'ClipboardCheck',
  },
  practical: {
    label: 'Practical',
    description: 'Hands-on practice',
    icon: 'Wrench',
  },
  reference: {
    label: 'Reference',
    description: 'Resource and reference material',
    icon: 'FileText',
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

export const generateTemplateId = (): string => {
  return `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const getTemplateCategoryInfo = (category: TemplateCategory) => {
  return TEMPLATE_CATEGORIES[category];
};

export const getDifficultyInfo = (difficulty: TemplateDifficulty) => {
  return DIFFICULTY_LEVELS[difficulty];
};

export const getInteractivityInfo = (level: InteractivityLevel) => {
  return INTERACTIVITY_LEVELS[level];
};

export const getContentStyleInfo = (style: ContentStyle) => {
  return CONTENT_STYLES[style];
};

export const getCapabilityInfo = (capabilityId: string): TemplateCapability | undefined => {
  return TEMPLATE_CAPABILITIES[capabilityId];
};

export const formatEstimatedTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

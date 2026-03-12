// Scene-Based Lesson Types
// Comprehensive type definitions for interactive, scene-based lessons

import { LessonBlock } from './types';

// ============================================
// BACKGROUND TYPES
// ============================================

export type BackgroundType = 'solid' | 'gradient' | 'image' | 'video' | 'parallax' | 'animated';

export interface ParallaxLayer {
  id: string;
  src: string;
  speed: number; // -1 to 1, negative = slower, positive = faster
  offset?: { x: number; y: number };
  scale?: number;
  opacity?: number;
}

export interface SceneBackground {
  type: BackgroundType;
  
  // Solid color
  color?: string;
  
  // Gradient
  gradient?: {
    type: 'linear' | 'radial' | 'conic';
    angle?: number; // for linear
    colors: string[];
    stops?: number[]; // position for each color (0-100)
  };
  
  // Image
  image?: {
    src: string;
    alt?: string;
    opacity?: number; // 0-1
    blur?: number; // 0-20px
    scale?: number; // 1-2
    position?: 'cover' | 'contain' | 'center' | 'custom';
    customPosition?: { x: number; y: number }; // percentage
  };
  
  // Video
  video?: {
    src: string;
    poster?: string;
    opacity?: number;
    muted?: boolean;
    loop?: boolean;
    playbackRate?: number; // 0.25 to 2
  };
  
  // Parallax
  parallax?: {
    layers: ParallaxLayer[];
    totalDepth?: number; // affects parallax intensity
  };
  
  // Animated (CSS-based)
  animated?: {
    type: 'particles' | 'waves' | 'gradient-shift' | 'aurora' | 'mesh';
    colors?: string[];
    speed?: 'slow' | 'medium' | 'fast';
    density?: 'sparse' | 'normal' | 'dense';
  };
  
  // Universal overlay
  overlay?: {
    color: string;
    opacity: number; // 0-1
    gradient?: {
      type: 'linear' | 'radial';
      direction?: string;
      colors: string[];
    };
  };
}

// ============================================
// BACKGROUND PRESETS
// ============================================

export const BACKGROUND_PRESETS: Record<string, SceneBackground> = {
  // Solid Colors
  'solid-white': { type: 'solid', color: '#ffffff' },
  'solid-light': { type: 'solid', color: '#f8fafc' },
  'solid-dark': { type: 'solid', color: '#0f172a' },
  'solid-midnight': { type: 'solid', color: '#111827' },
  'solid-slate': { type: 'solid', color: '#1e293b' },
  
  // Gradients
  'gradient-sunrise': {
    type: 'gradient',
    gradient: { type: 'linear', angle: 135, colors: ['#fbbf24', '#f97316'] }
  },
  'gradient-ocean': {
    type: 'gradient',
    gradient: { type: 'linear', angle: 135, colors: ['#06b6d4', '#3b82f6'] }
  },
  'gradient-forest': {
    type: 'gradient',
    gradient: { type: 'linear', angle: 135, colors: ['#22c55e', '#14b8a6'] }
  },
  'gradient-sunset': {
    type: 'gradient',
    gradient: { type: 'linear', angle: 135, colors: ['#f43f5e', '#ec4899'] }
  },
  'gradient-night': {
    type: 'gradient',
    gradient: { type: 'linear', angle: 135, colors: ['#1e1b4b', '#312e81'] }
  },
  'gradient-aurora': {
    type: 'gradient',
    gradient: { type: 'linear', angle: 135, colors: ['#8b5cf6', '#06b6d4', '#22c55e'] }
  },
  'gradient-dawn': {
    type: 'gradient',
    gradient: { type: 'linear', angle: 180, colors: ['#fef3c7', '#fde68a', '#fcd34d'] }
  },
  'gradient-dusk': {
    type: 'gradient',
    gradient: { type: 'linear', angle: 180, colors: ['#c4b5fd', '#a78bfa', '#7c3aed'] }
  },
  
  // Themed (placeholder URLs - would be replaced with actual assets)
  'theme-classroom': {
    type: 'image',
    image: { src: '/backgrounds/classroom.jpg', opacity: 0.3, blur: 2 }
  },
  'theme-hospital': {
    type: 'image',
    image: { src: '/backgrounds/hospital.jpg', opacity: 0.3, blur: 2 }
  },
  'theme-nursery': {
    type: 'image',
    image: { src: '/backgrounds/nursery.jpg', opacity: 0.3, blur: 2 }
  },
  'theme-nature': {
    type: 'image',
    image: { src: '/backgrounds/forest.jpg', opacity: 0.3, blur: 2 }
  },
  
  // Animated
  'animated-particles': {
    type: 'animated',
    animated: { type: 'particles', colors: ['#8b5cf6', '#3b82f6'], speed: 'slow', density: 'normal' }
  },
  'animated-aurora': {
    type: 'animated',
    animated: { type: 'aurora', colors: ['#22c55e', '#06b6d4', '#8b5cf6'], speed: 'medium' }
  },
  'animated-waves': {
    type: 'animated',
    animated: { type: 'waves', colors: ['#3b82f6', '#06b6d4'], speed: 'slow' }
  },
};

// ============================================
// NAVIGATION TYPES
// ============================================

export type NavigationType = 'scroll' | 'click' | 'auto' | 'branching';

export interface SceneNavigation {
  type: NavigationType;
  
  // For click navigation
  nextButton?: {
    label: string;
    style: 'minimal' | 'prominent' | 'hidden' | 'custom';
    position: 'bottom-right' | 'bottom-center' | 'bottom-left' | 'floating';
    icon?: 'arrow' | 'chevron' | 'none';
  };
  
  // For auto-advance
  autoAdvance?: {
    delay: number; // seconds
    allowSkip: boolean;
    showCountdown: boolean;
  };
  
  // For branching
  branches?: SceneBranch[];
  
  // Universal settings
  showProgress?: boolean;
  showSceneIndicator?: boolean;
  allowBackNavigation?: boolean;
}

export interface SceneBranch {
  id: string;
  label: string;
  description?: string;
  targetSceneId: string;
  style?: 'primary' | 'secondary' | 'danger' | 'success';
  icon?: string;
  condition?: BranchCondition;
}

export interface BranchCondition {
  type: 'score' | 'answer' | 'interaction' | 'time';
  
  // For score conditions
  minScore?: number;
  maxScore?: number;
  
  // For answer conditions
  questionId?: string;
  answerId?: string;
  correct?: boolean;
  
  // For interaction conditions
  interactionId?: string;
  completed?: boolean;
  
  // For time conditions
  minTime?: number;
  maxTime?: number;
}

// ============================================
// SCENARIO TYPES (Branching Scenarios)
// ============================================

export interface ScenarioChoice {
  id: string;
  label: string;
  targetNodeId: string;
  feedback?: string;
  scoreModifier?: number;
  icon?: string;
  style?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

export interface ScenarioCondition {
  id: string;
  type: 'score' | 'choice' | 'visited' | 'time' | 'interaction';
  
  // Score condition
  scoreId?: string;
  operator?: 'gte' | 'lte' | 'eq' | 'gt' | 'lt';
  value?: number;
  
  // Choice condition
  choiceId?: string;
  nodeId?: string;
  
  // Time condition
  minTime?: number;
  maxTime?: number;
  
  // Target when condition met
  targetNodeId: string;
}

export interface ScenarioScore {
  id: string;
  name: string;
  value: number;
  min: number;
  max: number;
  icon?: string;
}

export interface ScenarioNode {
  id: string;
  type: 'start' | 'choice' | 'condition' | 'outcome' | 'end';
  title: string;
  content?: string;
  choices?: ScenarioChoice[];
  conditions?: ScenarioCondition[];
  scoreModifier?: number;
  media?: {
    image?: string;
    video?: string;
    audio?: string;
  };
  position: { x: number; y: number };
  metadata?: {
    estimatedTime?: number;
    difficulty?: 'easy' | 'medium' | 'hard';
    tags?: string[];
  };
}

export interface ScenarioBranchingData {
  id: string;
  title: string;
  description?: string;
  startNodeId: string;
  nodes: ScenarioNode[];
  scores: ScenarioScore[];
  settings: {
    allowBacktracking: boolean;
    showProgress: boolean;
    trackScore: boolean;
    adaptiveDifficulty: boolean;
    maxAttempts?: number;
    timeLimit?: number;
  };
  outcomes: {
    id: string;
    name: string;
    description: string;
    scoreRange: { min: number; max: number };
    badge?: string;
    feedback: string;
  }[];
}

// ============================================
// SCENE TYPES
// ============================================

export type SceneType = 
  | 'welcome'
  | 'concept'
  | 'exploration'
  | 'activity'
  | 'assessment'
  | 'reflection'
  | 'summary'
  | 'branching'
  | 'custom';

export interface SceneSection {
  id: string;
  title?: string;
  blocks: LessonBlock[];
  layout?: 'single' | 'two-column' | 'three-column' | 'grid' | 'custom';
  layoutConfig?: {
    columns?: number;
    gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    alignment?: 'top' | 'center' | 'bottom';
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  };
  background?: SceneBackground; // Added section-level background support
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'; // To control the spacing of the color band
}

export interface CompletionCriteria {
  type: 'view' | 'interaction' | 'time' | 'score' | 'all-interactions';
  
  // For time-based completion
  minTime?: number; // seconds
  
  // For interaction-based completion
  requiredInteractions?: string[]; // block IDs
  
  // For score-based completion
  minScore?: number;
  
  // For view-based completion
  scrollThreshold?: number; // percentage 0-100
}

export interface Scene {
  id: string;
  title: string;
  description?: string;
  type: SceneType;
  
  // Visual environment
  background: SceneBackground;
  
  // Content
  sections: SceneSection[];
  
  // Navigation
  navigation: SceneNavigation;
  
  // Completion
  completionCriteria?: CompletionCriteria;
  
  // Metadata
  metadata?: {
    estimatedTime?: number; // seconds
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    tags?: string[];
  };
  
  // Animation
  transition?: SceneTransition;
  
  // Audio
  audio?: {
    background?: {
      src: string;
      volume: number; // 0-1
      loop: boolean;
    };
    narration?: {
      src: string;
      autoplay: boolean;
    };
  };
}

// ============================================
// TRANSITION TYPES
// ============================================

export type TransitionType = 
  | 'fade'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'zoom-in'
  | 'zoom-out'
  | 'flip'
  | 'rotate'
  | 'blur'
  | 'dissolve'
  | 'none';

export interface SceneTransition {
  enter: TransitionType;
  exit: TransitionType;
  duration: number; // ms
  delay?: number;
  easing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

export const TRANSITION_PRESETS: Record<string, SceneTransition> = {
  'fade': { enter: 'fade', exit: 'fade', duration: 500 },
  'slide-up': { enter: 'slide-up', exit: 'slide-up', duration: 400 },
  'slide-right': { enter: 'slide-right', exit: 'slide-right', duration: 400 },
  'zoom': { enter: 'zoom-in', exit: 'zoom-out', duration: 300 },
  'flip': { enter: 'flip', exit: 'flip', duration: 600 },
  'dissolve': { enter: 'dissolve', exit: 'dissolve', duration: 800 },
  'instant': { enter: 'none', exit: 'none', duration: 0 },
};

// ============================================
// LESSON THEME TYPES
// ============================================

export interface LessonTheme {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  
  // Typography
  fonts: {
    heading: {
      family: string;
      weight: string;
      size?: string;
    };
    body: {
      family: string;
      weight: string;
      size?: string;
    };
    accent?: {
      family: string;
      weight: string;
    };
  };
  
  // Colors
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textMuted: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  
  // Component styles
  components: {
    card: {
      borderRadius: string;
      shadow: string;
      border: string;
    };
    button: {
      borderRadius: string;
      shadow: string;
      padding: string;
    };
    input: {
      borderRadius: string;
      borderWidth: string;
    };
  };
  
  // Animation defaults
  animations: {
    transition: SceneTransition;
    entrance: {
      type: 'fade' | 'slide' | 'scale';
      duration: number;
      stagger?: number; // delay between elements
    };
  };
  
  // Default backgrounds
  backgrounds: string[]; // preset IDs
}

// ============================================
// INTERACTIVE LESSON TYPE
// ============================================

export interface InteractiveLesson {
  id: string;
  type: 'interactive';
  title: string;
  description?: string;
  
  // Scene-based structure
  scenes: Scene[];
  
  // Theme
  theme?: string; // theme ID
  
  // Global settings
  settings: {
    showGlobalProgress: boolean;
    allowSceneNavigation: boolean;
    showSceneMenu: boolean;
    enableAudio: boolean;
    autoSave: boolean;
  };
  
  // Gamification
  gamification?: {
    enabled: boolean;
    points: boolean;
    badges: boolean;
    progress: boolean;
    checkpoints: boolean;
  };
  
  // Metadata
  metadata: {
    estimatedTime: number; // total minutes
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
    version: string;
  };
}

// ============================================
// SCENE TEMPLATES
// ============================================

export interface SceneTemplate {
  id: string;
  name: string;
  description: string;
  type: SceneType;
  thumbnail: string;
  
  // Default configuration
  defaultBackground: SceneBackground;
  defaultNavigation: SceneNavigation;
  defaultSections: SceneSection[];
  defaultTransition: SceneTransition;
  
  // Suggested blocks
  suggestedBlocks: string[]; // block types
}

export const SCENE_TEMPLATES: SceneTemplate[] = [
  {
    id: 'welcome-intro',
    name: 'Welcome Scene',
    description: 'Introduction scene with title, hook, and learning objectives',
    type: 'welcome',
    thumbnail: '/scene-templates/welcome.jpg',
    defaultBackground: BACKGROUND_PRESETS['gradient-aurora'],
    defaultNavigation: { type: 'click', nextButton: { label: 'Begin', style: 'prominent', position: 'bottom-center' } },
    defaultSections: [
      { id: 's1', blocks: [] }
    ],
    defaultTransition: TRANSITION_PRESETS['fade'],
    suggestedBlocks: ['heading', 'text', 'callout', 'video'],
  },
  {
    id: 'concept-teaching',
    name: 'Concept Scene',
    description: 'Core instruction scene with content blocks and examples',
    type: 'concept',
    thumbnail: '/scene-templates/concept.jpg',
    defaultBackground: BACKGROUND_PRESETS['solid-light'],
    defaultNavigation: { type: 'scroll', showProgress: true },
    defaultSections: [
      { id: 's1', blocks: [] }
    ],
    defaultTransition: TRANSITION_PRESETS['slide-right'],
    suggestedBlocks: ['heading', 'text', 'image', 'video', 'callout', 'accordion'],
  },
  {
    id: 'exploration-interactive',
    name: 'Exploration Scene',
    description: 'Interactive discovery with hotspots, tabs, and accordions',
    type: 'exploration',
    thumbnail: '/scene-templates/exploration.jpg',
    defaultBackground: BACKGROUND_PRESETS['solid-dark'],
    defaultNavigation: { type: 'click', nextButton: { label: 'Continue', style: 'minimal', position: 'bottom-right' } },
    defaultSections: [
      { id: 's1', blocks: [] }
    ],
    defaultTransition: TRANSITION_PRESETS['fade'],
    suggestedBlocks: ['hotspot', 'accordion', 'tabs', 'flipCard', 'image'],
  },
  {
    id: 'activity-practice',
    name: 'Activity Scene',
    description: 'Hands-on practice with scenarios and interactive exercises',
    type: 'activity',
    thumbnail: '/scene-templates/activity.jpg',
    defaultBackground: BACKGROUND_PRESETS['gradient-forest'],
    defaultNavigation: { type: 'branching', branches: [] },
    defaultSections: [
      { id: 's1', blocks: [] }
    ],
    defaultTransition: TRANSITION_PRESETS['zoom'],
    suggestedBlocks: ['scenario', 'matching', 'sorting', 'fillBlank', 'process'],
  },
  {
    id: 'assessment-quiz',
    name: 'Assessment Scene',
    description: 'Knowledge check with quizzes and feedback',
    type: 'assessment',
    thumbnail: '/scene-templates/assessment.jpg',
    defaultBackground: BACKGROUND_PRESETS['solid-slate'],
    defaultNavigation: { type: 'click', nextButton: { label: 'See Results', style: 'prominent', position: 'bottom-center' } },
    defaultSections: [
      { id: 's1', blocks: [] }
    ],
    defaultTransition: TRANSITION_PRESETS['dissolve'],
    suggestedBlocks: ['knowledgeCheck', 'poll', 'quiz'],
  },
  {
    id: 'reflection-journal',
    name: 'Reflection Scene',
    description: 'Metacognition with journaling prompts and discussion',
    type: 'reflection',
    thumbnail: '/scene-templates/reflection.jpg',
    defaultBackground: BACKGROUND_PRESETS['gradient-dusk'],
    defaultNavigation: { type: 'click', nextButton: { label: 'Continue', style: 'minimal', position: 'bottom-right' } },
    defaultSections: [
      { id: 's1', blocks: [] }
    ],
    defaultTransition: TRANSITION_PRESETS['fade'],
    suggestedBlocks: ['reflection', 'discussion', 'text'],
  },
  {
    id: 'summary-conclusion',
    name: 'Summary Scene',
    description: 'Conclusion with key takeaways and badges',
    type: 'summary',
    thumbnail: '/scene-templates/summary.jpg',
    defaultBackground: BACKGROUND_PRESETS['gradient-sunrise'],
    defaultNavigation: { type: 'click', nextButton: { label: 'Complete Lesson', style: 'prominent', position: 'bottom-center' } },
    defaultSections: [
      { id: 's1', blocks: [] }
    ],
    defaultTransition: TRANSITION_PRESETS['fade'],
    suggestedBlocks: ['heading', 'text', 'badge', 'callout', 'resource'],
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function createScene(template?: SceneTemplate): Scene {
  const id = `scene_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  if (template) {
    return {
      id,
      title: template.name,
      type: template.type,
      background: template.defaultBackground,
      sections: template.defaultSections.map(s => ({
        ...s,
        id: `${id}_${s.id}`,
        blocks: [],
      })),
      navigation: template.defaultNavigation,
      transition: template.defaultTransition,
    };
  }
  
  // Default scene
  return {
    id,
    title: 'New Scene',
    type: 'custom',
    background: { type: 'solid', color: '#f8fafc' },
    sections: [{ id: `${id}_s1`, blocks: [] }],
    navigation: { type: 'click', nextButton: { label: 'Continue', style: 'minimal', position: 'bottom-right' } },
    transition: TRANSITION_PRESETS['fade'],
  };
}

export function getDefaultNavigation(type: SceneType): SceneNavigation {
  switch (type) {
    case 'welcome':
      return { type: 'click', nextButton: { label: 'Begin', style: 'prominent', position: 'bottom-center' } };
    case 'concept':
      return { type: 'scroll', showProgress: true };
    case 'exploration':
      return { type: 'click', nextButton: { label: 'Continue', style: 'minimal', position: 'bottom-right' }, showProgress: true };
    case 'activity':
      return { type: 'branching', branches: [] };
    case 'assessment':
      return { type: 'click', nextButton: { label: 'Submit', style: 'prominent', position: 'bottom-center' } };
    case 'reflection':
      return { type: 'click', nextButton: { label: 'Continue', style: 'minimal', position: 'bottom-right' } };
    case 'summary':
      return { type: 'click', nextButton: { label: 'Complete', style: 'prominent', position: 'bottom-center' } };
    default:
      return { type: 'click', nextButton: { label: 'Continue', style: 'minimal', position: 'bottom-right' } };
  }
}

export function getDefaultBackground(type: SceneType): SceneBackground {
  switch (type) {
    case 'welcome':
      return BACKGROUND_PRESETS['gradient-aurora'];
    case 'concept':
      return BACKGROUND_PRESETS['solid-light'];
    case 'exploration':
      return BACKGROUND_PRESETS['solid-dark'];
    case 'activity':
      return BACKGROUND_PRESETS['gradient-forest'];
    case 'assessment':
      return BACKGROUND_PRESETS['solid-slate'];
    case 'reflection':
      return BACKGROUND_PRESETS['gradient-dusk'];
    case 'summary':
      return BACKGROUND_PRESETS['gradient-sunrise'];
    default:
      return BACKGROUND_PRESETS['solid-light'];
  }
}

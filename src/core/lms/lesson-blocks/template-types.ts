/**
 * Interactive Scene-Based Lesson Template Types
 * 
 * Comprehensive type definitions for the template marketplace system.
 * Templates demonstrate the full power of the interactive lesson builder.
 */

import { Scene, SceneBackground, SceneNavigation, InteractiveLesson } from './scene-types';

// ============================================
// TEMPLATE METADATA
// ============================================

export type TemplateCategory =
  | 'narrative'
  | 'exploration'
  | 'step-based'
  | 'scenario'
  | 'assessment'
  | 'visual'
  | 'media-driven'
  | 'practice'
  | 'microlearning'
  | 'immersive'
  | 'gamified'
  | 'hybrid';

export type TemplateDifficulty = 'beginner' | 'intermediate' | 'advanced';

export type TemplateComponent =
  | 'video'
  | 'audio'
  | 'image'
  | 'text'
  | 'hotspot'
  | 'accordion'
  | 'tabs'
  | 'flip-card'
  | 'timeline'
  | 'scenario'
  | 'branching'
  | 'quiz'
  | 'matching'
  | 'sorting'
  | 'checklist'
  | 'reflection'
  | 'journal'
  | 'worksheet'
  | 'map'
  | 'diagram'
  | 'infographic'
  | 'progress-tracker'
  | 'badge'
  | 'score'
  | 'leaderboard'
  | 'countdown'
  | 'gallery'
  | 'carousel'
  | 'comparison'
  | 'quote'
  | 'timer'
  | 'prompt'
  | 'input'
  | 'download'
  | 'chart'
  | 'stat-card'
  | 'callout'
  | 'list'
  | 'heading'
  | 'interactive'
  | 'email-preview'
  | 'password-strength'
  | 'streak-counter';

export interface TemplateMetadata {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  category: TemplateCategory;
  subcategory?: string;
  difficulty: TemplateDifficulty;
  tags: string[];
  components: TemplateComponent[];
  estimatedTime: number; // in minutes
  sceneCount: number;
  hasBranching: boolean;
  hasAssessment: boolean;
  hasGamification: boolean;
  isInteractive: boolean;
  thumbnail: string;
  previewImages?: string[];
  author?: {
    name: string;
    avatar?: string;
  };
  ratings?: {
    average: number;
    count: number;
  };
  usageCount?: number;
  featured?: boolean;
  new?: boolean;
  premium?: boolean;
}

// ============================================
// TEMPLATE CATEGORY INFO
// ============================================

export interface TemplateCategoryInfo {
  id: TemplateCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
  templateCount: number;
}

export const TEMPLATE_CATEGORIES: Record<TemplateCategory, TemplateCategoryInfo> = {
  narrative: {
    id: 'narrative',
    name: 'Narrative Learning',
    description: 'Story-based learning experiences that guide learners through compelling narratives',
    icon: 'BookOpen',
    color: 'purple',
    templateCount: 3,
  },
  exploration: {
    id: 'exploration',
    name: 'Exploration',
    description: 'Self-guided discovery learning with interactive elements to explore',
    icon: 'Compass',
    color: 'blue',
    templateCount: 3,
  },
  'step-based': {
    id: 'step-based',
    name: 'Step-Based Learning',
    description: 'Structured step-by-step tutorials and process guides',
    icon: 'ListOrdered',
    color: 'green',
    templateCount: 3,
  },
  scenario: {
    id: 'scenario',
    name: 'Scenario-Based',
    description: 'Decision-based learning with branching paths and outcomes',
    icon: 'GitBranch',
    color: 'amber',
    templateCount: 3,
  },
  assessment: {
    id: 'assessment',
    name: 'Assessment',
    description: 'Quiz and knowledge check focused learning experiences',
    icon: 'CheckCircle',
    color: 'red',
    templateCount: 3,
  },
  visual: {
    id: 'visual',
    name: 'Visual Learning',
    description: 'Highly visual teaching with infographics and diagrams',
    icon: 'BarChart3',
    color: 'cyan',
    templateCount: 3,
  },
  'media-driven': {
    id: 'media-driven',
    name: 'Media-Driven',
    description: 'Video and audio focused learning experiences',
    icon: 'Video',
    color: 'pink',
    templateCount: 3,
  },
  practice: {
    id: 'practice',
    name: 'Practice & Activity',
    description: 'Hands-on learning with exercises and activities',
    icon: 'Edit3',
    color: 'orange',
    templateCount: 3,
  },
  microlearning: {
    id: 'microlearning',
    name: 'Microlearning',
    description: 'Short, focused learning nuggets for quick consumption',
    icon: 'Zap',
    color: 'yellow',
    templateCount: 3,
  },
  immersive: {
    id: 'immersive',
    name: 'Immersive Themes',
    description: 'Full scene-based storytelling with rich environments',
    icon: 'Film',
    color: 'indigo',
    templateCount: 3,
  },
  gamified: {
    id: 'gamified',
    name: 'Gamified Learning',
    description: 'High engagement learning with game mechanics',
    icon: 'Trophy',
    color: 'emerald',
    templateCount: 3,
  },
  hybrid: {
    id: 'hybrid',
    name: 'Hybrid Learning',
    description: 'Combined formats mixing multiple learning approaches',
    icon: 'Layers',
    color: 'violet',
    templateCount: 6,
  },
};

// ============================================
// TEMPLATE DISCOVERY FILTERS
// ============================================

export interface TemplateFilters {
  category?: TemplateCategory;
  difficulty?: TemplateDifficulty;
  components?: TemplateComponent[];
  maxTime?: number;
  hasBranching?: boolean;
  hasAssessment?: boolean;
  hasGamification?: boolean;
  search?: string;
  sortBy?: 'popular' | 'newest' | 'rating' | 'name';
  featured?: boolean;
  premium?: boolean;
}

// ============================================
// TEMPLATE DEFINITION
// ============================================

export interface LessonTemplate {
  metadata: TemplateMetadata;
  content: {
    title: string;
    description: string;
    theme: 'immersive' | 'illustrated' | 'infographic' | 'storytelling';
    settings: InteractiveLesson['settings'];
    scenes: Scene[];
  };
  placeholders: TemplatePlaceholder[];
  instructions?: string[];
}

export interface TemplatePlaceholder {
  id: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'link';
  label: string;
  description?: string;
  location: {
    sceneId: string;
    sectionId?: string;
    blockId?: string;
    property: string;
  };
  defaultValue?: string;
  required?: boolean;
}

// ============================================
// TEMPLATE HELPER FUNCTIONS
// ============================================

export function createScene(
  id: string,
  title: string,
  options: {
    type?: Scene['type'];
    description?: string;
    background?: SceneBackground;
    navigation?: SceneNavigation;
    sections?: Scene['sections'];
  } = {}
): Scene {
  return {
    id,
    type: options.type || 'concept',
    title,
    description: options.description,
    background: options.background || { type: 'solid', color: '#1a1a2e' },
    navigation: options.navigation || {
      type: 'click',
      nextButton: { label: 'Continue', style: 'prominent', position: 'bottom-right' },
    },
    sections: options.sections || [],
    transition: {
      enter: 'fade' as const,
      exit: 'fade' as const,
      duration: 500,
    },
  };
}

export function createPlaceholder(
  id: string,
  type: TemplatePlaceholder['type'],
  label: string,
  location: TemplatePlaceholder['location'],
  options: Partial<TemplatePlaceholder> = {}
): TemplatePlaceholder {
  return {
    id,
    type,
    label,
    description: options.description,
    location,
    defaultValue: options.defaultValue,
    required: options.required ?? true,
  };
}

// ============================================
// TEMPLATE MODIFIER FUNCTIONS
// ============================================

export function applyPlaceholders(
  template: LessonTemplate,
  values: Record<string, string>
): InteractiveLesson {
  const content = JSON.parse(JSON.stringify(template.content)) as InteractiveLesson;

  template.placeholders.forEach((placeholder) => {
    const value = values[placeholder.id] || placeholder.defaultValue || '';
    const scene = content.scenes.find((s) => s.id === placeholder.location.sceneId);

    if (!scene) return;

    if (placeholder.location.sectionId) {
      const section = scene.sections.find((s) => s.id === placeholder.location.sectionId);
      if (!section) return;

      if (placeholder.location.blockId) {
        const block = section.blocks.find((b) => b.id === placeholder.location.blockId);
        if (block && placeholder.location.property) {
          (block.props as any)[placeholder.location.property] = value;
        }
      } else if (placeholder.location.property) {
        (section as any)[placeholder.location.property] = value;
      }
    } else if (placeholder.location.property) {
      (scene as any)[placeholder.location.property] = value;
    }
  });

  return content;
}

// ============================================
// DEFAULT TEMPLATE SETTINGS
// ============================================

export const DEFAULT_TEMPLATE_SETTINGS: InteractiveLesson['settings'] = {
  showGlobalProgress: true,
  allowSceneNavigation: true,
  showSceneMenu: true,
  enableAudio: true,
  autoSave: true,
};

export default {
  TEMPLATE_CATEGORIES,
  createScene,
  createPlaceholder,
  applyPlaceholders,
  DEFAULT_TEMPLATE_SETTINGS,
};

// Lesson Templates Module
// Comprehensive template system for the interactive lesson builder

// Types and Metadata
export {
  // Types
  type TemplateCategory,
  type TemplateDifficulty,
  type InteractivityLevel,
  type ContentStyle,
  type TemplateMetadata,
  type TemplateComponent,
  type TemplateCapability,
  type LessonTemplate,
  type TemplateSettings,
  
  // Constants
  TEMPLATE_CATEGORIES,
  TEMPLATE_CAPABILITIES,
  DIFFICULTY_LEVELS,
  INTERACTIVITY_LEVELS,
  CONTENT_STYLES,
  
  // Helpers
  generateTemplateId,
  getTemplateCategoryInfo,
  getDifficultyInfo,
  getInteractivityInfo,
  getContentStyleInfo,
  getCapabilityInfo,
  formatEstimatedTime,
} from './types';

// Template Registry
export {
  // Registry
  LESSON_TEMPLATES,
  
  // Helper Functions
  getTemplatesByCategory,
  getTemplate,
  getFeaturedTemplates,
  getPopularTemplates,
  searchTemplates,
  filterTemplates,
  createLessonFromTemplate,
} from './registry';

// UI Components
export {
  // Main Components
  TemplateGallery,
  TemplateCategorySection,
  CompactTemplateSelector,
  
  // Sub-components (for customization)
  TemplateCard,
  TemplatePreviewModal,
  FilterPanel,
  
  // Helper Components
  CategoryBadge,
  DifficultyBadge,
  InteractivityIcon,
} from './TemplateGallery';

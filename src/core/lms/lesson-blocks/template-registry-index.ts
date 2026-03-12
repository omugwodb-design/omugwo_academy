/**
 * Template Registry Index
 * 
 * Combines all templates and exports the complete registry.
 */

import { ENRICHED_TEMPLATES } from './enriched-templates';
import { COMPREHENSIVE_TEMPLATES } from './comprehensive-templates';
import { LessonTemplate, TemplateCategory, TEMPLATE_CATEGORIES } from './template-types';

// Create a record of comprehensive templates by ID
const COMPREHENSIVE_TEMPLATES_MAP = COMPREHENSIVE_TEMPLATES.reduce((acc, template) => {
  acc[template.metadata.id] = template;
  return acc;
}, {} as Record<string, LessonTemplate>);

// Combine all templates
export const ALL_TEMPLATES: Record<string, LessonTemplate> = {
  ...ENRICHED_TEMPLATES,
  ...COMPREHENSIVE_TEMPLATES_MAP,
};

export const COMPLETE_TEMPLATE_LIST: LessonTemplate[] = Object.values(ALL_TEMPLATES);

// Helper functions
export function getTemplatesByCategory(category: TemplateCategory): LessonTemplate[] {
  return COMPLETE_TEMPLATE_LIST.filter(t => t.metadata.category === category);
}

export function getFeaturedTemplates(): LessonTemplate[] {
  return COMPLETE_TEMPLATE_LIST.filter(t => t.metadata.featured);
}

export function getTemplateById(id: string): LessonTemplate | undefined {
  return ALL_TEMPLATES[id];
}

// Re-export types
export * from './template-types';

// Export individual registries
export { ENRICHED_TEMPLATES } from './enriched-templates';

export default ALL_TEMPLATES;

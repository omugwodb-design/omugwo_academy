import React, { useState } from 'react';
import { cn } from '../../../lib/utils';
import { 
  LESSON_TEMPLATES, 
  getTemplatesByCategory,
  TEMPLATE_CATEGORIES,
  type LessonTemplate 
} from '../lesson-templates';
import { 
  Play, 
  FileText, 
  MousePointer, 
  CheckCircle, 
  Flag,
  ChevronRight,
  ChevronDown,
  Sparkles,
  X,
  Eye,
  Plus
} from 'lucide-react';

interface LessonTemplateSelectorProps {
  onSelectTemplate: (templateId: string) => void;
  onClose?: () => void;
  selectedTemplateId?: string;
}

// Category icons
const CATEGORY_ICONS: Record<string, React.FC<{ className?: string }>> = {
  standard: Play,
  interactive: MousePointer,
  assessment: CheckCircle,
  scenario: Flag,
  visual: FileText,
  storytelling: Sparkles,
  practice: FileText,
  resource: FileText,
  microlearning: Sparkles,
  advanced: Flag,
};

// Helper to extract template properties from metadata for compatibility
const getTemplateProps = (template: LessonTemplate) => ({
  id: template.metadata.id,
  name: template.metadata.name,
  description: template.metadata.description,
  thumbnail: template.metadata.thumbnail || '',
  tags: template.metadata.tags,
  category: template.metadata.category,
});

export const LessonTemplateSelector: React.FC<LessonTemplateSelectorProps> = ({
  onSelectTemplate,
  onClose,
  selectedTemplateId,
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['standard', 'interactive'])
  );
  const [previewingTemplate, setPreviewingTemplate] = useState<LessonTemplate | null>(null);
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleSelectTemplate = (templateId: string) => {
    onSelectTemplate(templateId);
    onClose?.();
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary-500" />
            <h3 className="font-black text-gray-900 dark:text-white">Lesson Templates</h3>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Start with a pre-designed lesson structure
        </p>
      </div>

      {/* Template List */}
      <div className="flex-1 overflow-y-auto p-3">
        {Object.entries(TEMPLATE_CATEGORIES).map(([categoryId, category]) => {
          const isExpanded = expandedCategories.has(categoryId);
          const categoryTemplates = getTemplatesByCategory(categoryId as any);
          const CategoryIcon = CATEGORY_ICONS[categoryId] || FileText;

          if (categoryTemplates.length === 0) return null;

          return (
            <div key={categoryId} className="mb-3">
              <button
                onClick={() => toggleCategory(categoryId)}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                {isExpanded ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
                <CategoryIcon className="w-3.5 h-3.5" />
                <span>{category.label}</span>
                <span className="ml-auto text-gray-400">{categoryTemplates.length}</span>
              </button>

              {isExpanded && (
                <div className="mt-2 space-y-2 pl-2">
                  {categoryTemplates.map(template => {
                    const templateProps = getTemplateProps(template);
                    return (
                    <div
                      key={templateProps.id}
                      onMouseEnter={() => setHoveredTemplate(templateProps.id)}
                      onMouseLeave={() => setHoveredTemplate(null)}
                      className={cn(
                        'relative group rounded-xl overflow-hidden border transition-all cursor-pointer',
                        selectedTemplateId === templateProps.id
                          ? 'border-primary-500 ring-2 ring-primary-500/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
                      )}
                      onClick={() => handleSelectTemplate(templateProps.id)}
                    >
                      {/* Thumbnail */}
                      <div className="relative h-28 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                        <img
                          src={templateProps.thumbnail}
                          alt={templateProps.name}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        
                        {/* Hover overlay */}
                        {hoveredTemplate === templateProps.id && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewingTemplate(template);
                              }}
                              className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectTemplate(templateProps.id);
                              }}
                              className="p-2 bg-primary-500 rounded-full text-white hover:bg-primary-600 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        )}

                        {/* Block count badge */}
                        <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/50 backdrop-blur-sm rounded-full text-xs text-white font-medium">
                          {template.blocks.length} blocks
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-3">
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                          {templateProps.name}
                        </h4>
                        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                          {templateProps.description}
                        </p>
                        {/* Tags */}
                        <div className="mt-2 flex flex-wrap gap-1">
                          {templateProps.tags.slice(0, 3).map(tag => (
                            <span
                              key={tag}
                              className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-500 dark:text-gray-400"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Preview Modal */}
      {previewingTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <div>
                <h3 className="font-black text-lg text-gray-900 dark:text-white">
                  {previewingTemplate.metadata.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {previewingTemplate.metadata.description}
                </p>
              </div>
              <button
                onClick={() => setPreviewingTemplate(null)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <img
                src={previewingTemplate.metadata.thumbnail || ''}
                alt={previewingTemplate.metadata.name}
                className="w-full h-48 object-cover rounded-xl mb-4"
              />
              
              <h4 className="font-bold text-sm text-gray-700 dark:text-gray-300 mb-2">
                Included Blocks ({previewingTemplate.blocks.length})
              </h4>
              
              <div className="space-y-2">
                {previewingTemplate.blocks.map((block, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="w-6 h-6 bg-primary-100 dark:bg-primary-900/30 rounded flex items-center justify-center text-xs font-bold text-primary-600">
                      {index + 1}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                        {block.type.replace('_', ' ')}
                      </span>
                      {block.props.content && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                          {typeof block.props.content === 'string' 
                            ? block.props.content.replace(/<[^>]*>/g, '').slice(0, 50)
                            : 'Content'}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-2">
              <button
                onClick={() => setPreviewingTemplate(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const templateProps = getTemplateProps(previewingTemplate);
                  handleSelectTemplate(templateProps.id);
                  setPreviewingTemplate(null);
                }}
                className="px-4 py-2 text-sm font-bold text-white bg-primary-600 rounded-lg hover:bg-primary-700"
              >
                Use This Template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-800">
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
          Templates provide a starting structure. You can customize all content.
        </p>
      </div>
    </div>
  );
};

export default LessonTemplateSelector;

// Custom Template Saving System
import React, { useState, useCallback, useEffect } from 'react';
import { cn } from '../../../lib/utils';
import { Block, Template, TemplateCategory, PageType } from '../types';
import { useEditorStore } from '../store/editor-store';
import {
  Save,
  Folder,
  Star,
  Clock,
  Trash2,
  Copy,
  Download,
  Upload,
  MoreHorizontal,
  Check,
  X,
  FileText,
  LayoutGrid,
  Eye,
  Edit2,
} from 'lucide-react';

// Local storage key for custom templates
const CUSTOM_TEMPLATES_KEY = 'omugwo_custom_templates';

// Custom template with metadata
export interface CustomTemplate extends Template {
  isCustom: true;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
  isFavorite: boolean;
  sourcePageId?: string;
}

// Template Manager Hook
export const useTemplateManager = () => {
  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([]);

  // Load templates from storage
  useEffect(() => {
    const stored = localStorage.getItem(CUSTOM_TEMPLATES_KEY);
    if (stored) {
      try {
        setCustomTemplates(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load custom templates:', e);
      }
    }
  }, []);

  // Save templates to storage
  const persistTemplates = useCallback((templates: CustomTemplate[]) => {
    localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(templates));
    setCustomTemplates(templates);
  }, []);

  // Create new template from blocks
  const createTemplate = useCallback((
    blocks: Block[],
    metadata: {
      name: string;
      description: string;
      category: TemplateCategory;
      pageType: PageType;
      tags: string[];
      thumbnail?: string;
    }
  ): CustomTemplate => {
    const now = new Date().toISOString();
    const template: CustomTemplate = {
      id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: metadata.name,
      description: metadata.description,
      thumbnail: metadata.thumbnail || generateTemplateThumbnail(blocks),
      category: metadata.category,
      pageType: metadata.pageType,
      tags: metadata.tags,
      blocks: JSON.parse(JSON.stringify(blocks)), // Deep clone
      isCustom: true,
      createdAt: now,
      updatedAt: now,
      usageCount: 0,
      isFavorite: false,
    };

    persistTemplates([...customTemplates, template]);
    return template;
  }, [customTemplates, persistTemplates]);

  // Update existing template
  const updateTemplate = useCallback((templateId: string, updates: Partial<CustomTemplate>) => {
    const updated = customTemplates.map(t =>
      t.id === templateId
        ? { ...t, ...updates, updatedAt: new Date().toISOString() }
        : t
    );
    persistTemplates(updated);
  }, [customTemplates, persistTemplates]);

  // Delete template
  const deleteTemplate = useCallback((templateId: string) => {
    const filtered = customTemplates.filter(t => t.id !== templateId);
    persistTemplates(filtered);
  }, [customTemplates, persistTemplates]);

  // Duplicate template
  const duplicateTemplate = useCallback((templateId: string) => {
    const original = customTemplates.find(t => t.id === templateId);
    if (!original) return null;

    const now = new Date().toISOString();
    const duplicate: CustomTemplate = {
      ...JSON.parse(JSON.stringify(original)),
      id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: `${original.name} (Copy)`,
      createdAt: now,
      updatedAt: now,
      usageCount: 0,
    };

    persistTemplates([...customTemplates, duplicate]);
    return duplicate;
  }, [customTemplates, persistTemplates]);

  // Toggle favorite
  const toggleFavorite = useCallback((templateId: string) => {
    const updated = customTemplates.map(t =>
      t.id === templateId ? { ...t, isFavorite: !t.isFavorite } : t
    );
    persistTemplates(updated);
  }, [customTemplates, persistTemplates]);

  // Increment usage count
  const trackUsage = useCallback((templateId: string) => {
    const updated = customTemplates.map(t =>
      t.id === templateId ? { ...t, usageCount: t.usageCount + 1 } : t
    );
    persistTemplates(updated);
  }, [customTemplates, persistTemplates]);

  // Export template as JSON
  const exportTemplate = useCallback((templateId: string): string => {
    const template = customTemplates.find(t => t.id === templateId);
    if (!template) return '';
    return JSON.stringify(template, null, 2);
  }, [customTemplates]);

  // Import template from JSON
  const importTemplate = useCallback((json: string): CustomTemplate | null => {
    try {
      const template = JSON.parse(json) as CustomTemplate;
      if (!template.blocks || !template.name) {
        throw new Error('Invalid template format');
      }

      const now = new Date().toISOString();
      const imported: CustomTemplate = {
        ...template,
        id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: now,
        updatedAt: now,
        usageCount: 0,
        isFavorite: false,
      };

      persistTemplates([...customTemplates, imported]);
      return imported;
    } catch (e) {
      console.error('Failed to import template:', e);
      return null;
    }
  }, [customTemplates, persistTemplates]);

  // Get templates by category
  const getTemplatesByCategory = useCallback((category: TemplateCategory) => {
    return customTemplates.filter(t => t.category === category);
  }, [customTemplates]);

  // Get favorite templates
  const getFavoriteTemplates = useCallback(() => {
    return customTemplates.filter(t => t.isFavorite);
  }, [customTemplates]);

  // Get recent templates (by usage)
  const getRecentTemplates = useCallback((limit = 5) => {
    return [...customTemplates]
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit);
  }, [customTemplates]);

  return {
    customTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    toggleFavorite,
    trackUsage,
    exportTemplate,
    importTemplate,
    getTemplatesByCategory,
    getFavoriteTemplates,
    getRecentTemplates,
  };
};

// Generate thumbnail from blocks (placeholder)
const generateTemplateThumbnail = (blocks: Block[]): string => {
  // Return a placeholder for now - in production, this would render blocks to an image
  const colors = ['#7c3aed', '#ec4899', '#f59e0b', '#10b981', '#0ea5e9'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  return `https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=400`;
};

// Template Save Modal
interface TemplateSaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  blocks: Block[];
  onSave: (template: CustomTemplate) => void;
}

export const TemplateSaveModal: React.FC<TemplateSaveModalProps> = ({
  isOpen,
  onClose,
  blocks,
  onSave,
}) => {
  const { createTemplate } = useTemplateManager();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TemplateCategory>('course_sales');
  const [pageType, setPageType] = useState<PageType>('course_sales');
  const [tags, setTags] = useState('');
  const [thumbnail, setThumbnail] = useState('');

  const handleSave = () => {
    if (!name.trim()) return;

    const template = createTemplate(blocks, {
      name: name.trim(),
      description: description.trim(),
      category,
      pageType,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      thumbnail: thumbnail || undefined,
    });

    onSave(template);
    onClose();
    
    // Reset form
    setName('');
    setDescription('');
    setTags('');
    setThumbnail('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full mx-4">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
              Save as Template
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Template Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Custom Template"
              className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this template is for..."
              rows={2}
              className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TemplateCategory)}
                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="course_sales">Course Sales</option>
                <option value="webinar">Webinar</option>
                <option value="landing">Landing Page</option>
                <option value="blog">Blog</option>
                <option value="community">Community</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Page Type
              </label>
              <select
                value={pageType}
                onChange={(e) => setPageType(e.target.value as PageType)}
                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="course_sales">Course Sales</option>
                <option value="webinar_registration">Webinar Registration</option>
                <option value="homepage">Homepage</option>
                <option value="lead_magnet">Lead Magnet</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="modern, dark, conversion"
              className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Thumbnail URL (optional)
            </label>
            <input
              type="text"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              <strong>{blocks.length}</strong> blocks will be saved in this template
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="px-4 py-2 text-sm font-bold text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Template
          </button>
        </div>
      </div>
    </div>
  );
};

// Custom Templates Panel
interface CustomTemplatesPanelProps {
  onSelectTemplate: (template: CustomTemplate) => void;
  className?: string;
}

export const CustomTemplatesPanel: React.FC<CustomTemplatesPanelProps> = ({
  onSelectTemplate,
  className,
}) => {
  const {
    customTemplates,
    deleteTemplate,
    duplicateTemplate,
    toggleFavorite,
    exportTemplate,
    trackUsage,
  } = useTemplateManager();

  const [viewMode, setViewMode] = useState<'all' | 'favorites' | 'recent'>('all');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const handleSelect = (template: CustomTemplate) => {
    trackUsage(template.id);
    onSelectTemplate(template);
  };

  const handleExport = (templateId: string) => {
    const json = exportTemplate(templateId);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `template-${templateId}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMenuOpen(null);
  };

  const displayedTemplates = customTemplates
    .filter(t => {
      if (viewMode === 'favorites') return t.isFavorite;
      return true;
    })
    .sort((a, b) => {
      if (viewMode === 'recent') return b.usageCount - a.usageCount;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  return (
    <div className={cn('flex flex-col h-full bg-white dark:bg-gray-900', className)}>
      {/* Header */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
            <Folder className="w-4 h-4" />
            My Templates
          </h3>
          <span className="text-xs text-gray-400">
            {customTemplates.length} saved
          </span>
        </div>

        {/* View Mode Tabs */}
        <div className="flex gap-1">
          {(['all', 'favorites', 'recent'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={cn(
                'flex-1 px-2 py-1 text-xs font-medium rounded-lg transition-colors',
                viewMode === mode
                  ? 'bg-primary-100 dark:bg-primary-950/30 text-primary-600'
                  : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
              )}
            >
              {mode === 'all' && 'All'}
              {mode === 'favorites' && <Star className="w-3 h-3 mx-auto" />}
              {mode === 'recent' && <Clock className="w-3 h-3 mx-auto" />}
            </button>
          ))}
        </div>
      </div>

      {/* Template List */}
      <div className="flex-1 overflow-y-auto p-2">
        {displayedTemplates.length === 0 ? (
          <div className="text-center py-8">
            <LayoutGrid className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {viewMode === 'favorites' ? 'No favorite templates' : 'No saved templates yet'}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Create pages and save them as templates
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {displayedTemplates.map((template) => (
              <div
                key={template.id}
                className="group relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 cursor-pointer transition-all"
                onClick={() => handleSelect(template)}
              >
                {/* Thumbnail */}
                <div className="relative h-24 bg-gray-100 dark:bg-gray-800">
                  <img
                    src={template.thumbnail}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Favorite indicator */}
                  {template.isFavorite && (
                    <div className="absolute top-2 left-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    </div>
                  )}

                  {/* Usage count */}
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/50 backdrop-blur-sm rounded text-xs text-white">
                    Used {template.usageCount}x
                  </div>

                  {/* Hover menu */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(template);
                      }}
                      className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExport(template.id);
                      }}
                      className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                        {template.name}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                        {template.description || `${template.blocks.length} blocks`}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(template.id);
                      }}
                      className={cn(
                        'p-1 rounded transition-colors',
                        template.isFavorite
                          ? 'text-yellow-500'
                          : 'text-gray-300 hover:text-yellow-400'
                      )}
                    >
                      <Star className={cn('w-4 h-4', template.isFavorite && 'fill-current')} />
                    </button>
                  </div>

                  {/* Tags */}
                  {template.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {template.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-500 dark:text-gray-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default useTemplateManager;

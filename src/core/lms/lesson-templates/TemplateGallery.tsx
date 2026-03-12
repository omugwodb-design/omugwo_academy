// Template Gallery UI Component
// Comprehensive template browser with filtering, search, and preview

import React, { useState, useMemo, useCallback } from 'react';
import {
  Search,
  Filter,
  Grid,
  List,
  Clock,
  Star,
  Zap,
  ChevronRight,
  X,
  CheckCircle,
  Info,
  AlertCircle,
} from 'lucide-react';
import {
  LessonTemplate,
  TemplateCategory,
  TemplateDifficulty,
  InteractivityLevel,
  ContentStyle,
  TEMPLATE_CATEGORIES,
  DIFFICULTY_LEVELS,
  INTERACTIVITY_LEVELS,
  CONTENT_STYLES,
  formatEstimatedTime,
} from './types';
import {
  LESSON_TEMPLATES,
  getTemplatesByCategory,
  getFeaturedTemplates,
  getPopularTemplates,
  searchTemplates,
  filterTemplates,
  createLessonFromTemplate,
} from './registry';

// ============================================
// TYPES
// ============================================

interface TemplateGalleryProps {
  onSelectTemplate: (template: LessonTemplate) => void;
  onClose?: () => void;
  className?: string;
}

interface TemplateCardProps {
  template: LessonTemplate;
  onClick: () => void;
  variant?: 'grid' | 'list';
}

interface TemplatePreviewModalProps {
  template: LessonTemplate;
  onUse: () => void;
  onClose: () => void;
}

interface FilterPanelProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
}

interface FilterState {
  category?: TemplateCategory;
  difficulty?: TemplateDifficulty;
  interactivityLevel?: InteractivityLevel;
  contentStyle?: ContentStyle;
  maxTime?: number;
  search: string;
}

// ============================================
// HELPER COMPONENTS
// ============================================

export const CategoryBadge: React.FC<{ category: TemplateCategory }> = ({ category }) => {
  const info = TEMPLATE_CATEGORIES[category];
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
    purple: 'bg-purple-100 text-purple-700 border-purple-200',
    green: 'bg-green-100 text-green-700 border-green-200',
    orange: 'bg-orange-100 text-orange-700 border-orange-200',
    cyan: 'bg-cyan-100 text-cyan-700 border-cyan-200',
    pink: 'bg-pink-100 text-pink-700 border-pink-200',
    yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    gray: 'bg-gray-100 text-gray-700 border-gray-200',
    red: 'bg-red-100 text-red-700 border-red-200',
    indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  };

  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${colorMap[info.color] || colorMap.gray}`}>
      {info.label}
    </span>
  );
};

export const DifficultyBadge: React.FC<{ difficulty: TemplateDifficulty }> = ({ difficulty }) => {
  const info = DIFFICULTY_LEVELS[difficulty];
  const colorMap: Record<string, string> = {
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded ${colorMap[info.color]}`}>
      {info.label}
    </span>
  );
};

export const InteractivityIcon: React.FC<{ level: InteractivityLevel }> = ({ level }) => {
  const info = INTERACTIVITY_LEVELS[level];
  const iconMap: Record<string, React.ReactNode> = {
    low: <Info className="w-3 h-3" />,
    medium: <Zap className="w-3 h-3" />,
    high: <Star className="w-3 h-3" />,
  };

  return (
    <span className="flex items-center gap-1 text-xs text-gray-500" title={info.description}>
      {iconMap[level]}
      {info.label}
    </span>
  );
};

// ============================================
// TEMPLATE CARD
// ============================================

export const TemplateCard: React.FC<TemplateCardProps> = ({ template, onClick, variant = 'grid' }) => {
  const { metadata } = template;

  if (variant === 'list') {
    return (
      <button
        onClick={onClick}
        className="w-full flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-left group"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 truncate">{metadata.name}</h3>
            {metadata.featured && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
          </div>
          <p className="text-sm text-gray-500 line-clamp-1 mb-2">{metadata.description}</p>
          <div className="flex items-center gap-3 flex-wrap">
            <CategoryBadge category={metadata.category} />
            <DifficultyBadge difficulty={metadata.difficulty} />
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              {formatEstimatedTime(metadata.estimatedTime)}
            </span>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="flex flex-col p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all text-left group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {metadata.featured && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
          {metadata.popular && <Zap className="w-4 h-4 text-orange-500" />}
        </div>
        <CategoryBadge category={metadata.category} />
      </div>

      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
        {metadata.name}
      </h3>
      <p className="text-sm text-gray-500 line-clamp-2 mb-3 flex-1">{metadata.description}</p>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <DifficultyBadge difficulty={metadata.difficulty} />
          <InteractivityIcon level={metadata.interactivityLevel} />
        </div>
        <span className="flex items-center gap-1 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          {formatEstimatedTime(metadata.estimatedTime)}
        </span>
      </div>
    </button>
  );
};

// ============================================
// FILTER PANEL
// ============================================

export const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onChange, onReset }) => {
  const handleChange = (key: keyof FilterState, value: any) => {
    onChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = filters.category || filters.difficulty || filters.interactivityLevel || filters.contentStyle || filters.maxTime;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={filters.category || ''}
            onChange={(e) => handleChange('category', e.target.value as TemplateCategory || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Categories</option>
            {Object.entries(TEMPLATE_CATEGORIES).map(([key, info]) => (
              <option key={key} value={key}>{info.label}</option>
            ))}
          </select>
        </div>

        {/* Difficulty Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
          <select
            value={filters.difficulty || ''}
            onChange={(e) => handleChange('difficulty', e.target.value as TemplateDifficulty || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Levels</option>
            {Object.entries(DIFFICULTY_LEVELS).map(([key, info]) => (
              <option key={key} value={key}>{info.label}</option>
            ))}
          </select>
        </div>

        {/* Interactivity Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Interactivity</label>
          <select
            value={filters.interactivityLevel || ''}
            onChange={(e) => handleChange('interactivityLevel', e.target.value as InteractivityLevel || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Levels</option>
            {Object.entries(INTERACTIVITY_LEVELS).map(([key, info]) => (
              <option key={key} value={key}>{info.label}</option>
            ))}
          </select>
        </div>

        {/* Content Style Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content Style</label>
          <select
            value={filters.contentStyle || ''}
            onChange={(e) => handleChange('contentStyle', e.target.value as ContentStyle || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Styles</option>
            {Object.entries(CONTENT_STYLES).map(([key, info]) => (
              <option key={key} value={key}>{info.label}</option>
            ))}
          </select>
        </div>

        {/* Time Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max Duration</label>
          <select
            value={filters.maxTime || ''}
            onChange={(e) => handleChange('maxTime', e.target.value ? parseInt(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Any Duration</option>
            <option value="5">5 minutes or less</option>
            <option value="15">15 minutes or less</option>
            <option value="30">30 minutes or less</option>
            <option value="60">1 hour or less</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// ============================================
// TEMPLATE PREVIEW MODAL
// ============================================

export const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({ template, onUse, onClose }) => {
  const { metadata, capabilities, components } = template;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {metadata.featured && <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />}
              <CategoryBadge category={metadata.category} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{metadata.name}</h2>
            <p className="text-gray-500 mt-1">{metadata.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Meta Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-gray-500 mb-1">Estimated Time</div>
              <div className="font-semibold text-gray-900">{formatEstimatedTime(metadata.estimatedTime)}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-gray-500 mb-1">Difficulty</div>
              <div className="font-semibold text-gray-900 capitalize">{metadata.difficulty}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-gray-500 mb-1">Interactivity</div>
              <div className="font-semibold text-gray-900 capitalize">{metadata.interactivityLevel}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-gray-500 mb-1">Style</div>
              <div className="font-semibold text-gray-900 capitalize">{metadata.contentStyle}</div>
            </div>
          </div>

          {/* Components */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Components Used</h3>
            <div className="flex flex-wrap gap-2">
              {components.map((comp, i) => (
                <span
                  key={i}
                  className={`px-3 py-1 rounded-full text-sm ${
                    comp.isRequired
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {comp.label}
                  {comp.isRequired && <span className="ml-1 text-xs">*</span>}
                </span>
              ))}
            </div>
          </div>

          {/* Capabilities */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Capabilities Demonstrated</h3>
            <div className="space-y-2">
              {capabilities.map((cap, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">{cap.name}</div>
                    <div className="text-sm text-gray-500">{cap.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {metadata.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Usage Notes */}
          {template.usageNotes && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-500 mt-0.5" />
                <div>
                  <div className="font-medium text-blue-900">Usage Notes</div>
                  <div className="text-sm text-blue-700">{template.usageNotes}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onUse}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Use This Template
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN TEMPLATE GALLERY
// ============================================

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  onSelectTemplate,
  onClose,
  className = '',
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedTemplate, setSelectedTemplate] = useState<LessonTemplate | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
  });
  const [activeTab, setActiveTab] = useState<'all' | 'featured' | 'popular'>('all');

  const filteredTemplates = useMemo(() => {
    let templates: LessonTemplate[] = [];

    // Get base templates based on tab
    if (activeTab === 'featured') {
      templates = getFeaturedTemplates();
    } else if (activeTab === 'popular') {
      templates = getPopularTemplates();
    } else {
      templates = Object.values(LESSON_TEMPLATES);
    }

    // Apply search
    if (filters.search) {
      templates = searchTemplates(filters.search);
    }

    // Apply filters
    if (filters.category || filters.difficulty || filters.interactivityLevel || filters.contentStyle || filters.maxTime) {
      templates = filterTemplates({
        category: filters.category,
        difficulty: filters.difficulty,
        interactivityLevel: filters.interactivityLevel,
        contentStyle: filters.contentStyle,
        maxTime: filters.maxTime,
      });
    }

    return templates;
  }, [activeTab, filters]);

  const handleSelectTemplate = useCallback((template: LessonTemplate) => {
    setSelectedTemplate(template);
  }, []);

  const handleUseTemplate = useCallback(() => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate);
      setSelectedTemplate(null);
    }
  }, [selectedTemplate, onSelectTemplate]);

  const handleResetFilters = useCallback(() => {
    setFilters({ search: '' });
  }, []);

  return (
    <div className={`bg-gray-50 min-h-screen ${className}`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Template Gallery</h1>
              <p className="text-gray-500 mt-1">Choose a template to start building your lesson</p>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            )}
          </div>

          {/* Search and View Toggle */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'all'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All Templates
            </button>
            <button
              onClick={() => setActiveTab('featured')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'featured'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Star className="w-4 h-4" />
              Featured
            </button>
            <button
              onClick={() => setActiveTab('popular')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'popular'
                  ? 'bg-orange-100 text-orange-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Zap className="w-4 h-4" />
              Popular
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Filter Panel - Sidebar */}
          <div className="w-64 flex-shrink-0 hidden lg:block">
            <FilterPanel
              filters={filters}
              onChange={setFilters}
              onReset={handleResetFilters}
            />
          </div>

          {/* Templates Grid/List */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found
              </p>
            </div>

            {/* Templates */}
            {filteredTemplates.length > 0 ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'
                    : 'space-y-3'
                }
              >
                {filteredTemplates.map((template) => (
                  <TemplateCard
                    key={template.metadata.id}
                    template={template}
                    onClick={() => handleSelectTemplate(template)}
                    variant={viewMode}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No templates found</h3>
                <p className="text-gray-500">Try adjusting your filters or search query</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {selectedTemplate && (
        <TemplatePreviewModal
          template={selectedTemplate}
          onUse={handleUseTemplate}
          onClose={() => setSelectedTemplate(null)}
        />
      )}
    </div>
  );
};

// ============================================
// TEMPLATE CATEGORY SECTION
// ============================================

interface TemplateCategorySectionProps {
  category: TemplateCategory;
  onSelectTemplate: (template: LessonTemplate) => void;
}

export const TemplateCategorySection: React.FC<TemplateCategorySectionProps> = ({
  category,
  onSelectTemplate,
}) => {
  const templates = getTemplatesByCategory(category);
  const categoryInfo = TEMPLATE_CATEGORIES[category];

  if (templates.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{categoryInfo.label}</h2>
          <p className="text-gray-500">{categoryInfo.description}</p>
        </div>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          View all →
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.slice(0, 3).map((template) => (
          <TemplateCard
            key={template.metadata.id}
            template={template}
            onClick={() => onSelectTemplate(template)}
          />
        ))}
      </div>
    </div>
  );
};

// ============================================
// COMPACT TEMPLATE SELECTOR
// ============================================

interface CompactTemplateSelectorProps {
  onSelectTemplate: (template: LessonTemplate) => void;
  className?: string;
}

export const CompactTemplateSelector: React.FC<CompactTemplateSelectorProps> = ({
  onSelectTemplate,
  className = '',
}) => {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredTemplates = useMemo(() => {
    if (!search) return Object.values(LESSON_TEMPLATES).slice(0, 6);
    return searchTemplates(search).slice(0, 6);
  }, [search]);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg hover:border-blue-400 transition-colors"
      >
        <span className="text-gray-500">Choose a template...</span>
        <ChevronRight className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-80 overflow-y-auto">
          <div className="p-2 border-b border-gray-100">
            <input
              type="text"
              placeholder="Search templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              autoFocus
            />
          </div>
          <div className="p-1">
            {filteredTemplates.map((template) => (
              <button
                key={template.metadata.id}
                onClick={() => {
                  onSelectTemplate(template);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded text-left"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 text-sm">{template.metadata.name}</div>
                  <div className="text-xs text-gray-500 truncate">{template.metadata.description}</div>
                </div>
                <CategoryBadge category={template.metadata.category} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// EXPORTS
// ============================================

export default TemplateGallery;

/**
 * Template Discovery Interface
 * 
 * A comprehensive UI for browsing, previewing, and selecting lesson templates.
 * Similar to Canva, Webflow, or Notion template marketplaces.
 */

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Grid,
  List,
  ChevronRight,
  Clock,
  Star,
  Users,
  Zap,
  BookOpen,
  Compass,
  ListOrdered,
  GitBranch,
  CheckCircle,
  BarChart3,
  Video,
  Edit3,
  Layers,
  Film,
  Trophy,
  X,
  Eye,
  Copy,
  Heart,
  ArrowRight,
  Tag,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { cn } from '../../../../lib/utils';
import {
  LessonTemplate,
  TemplateCategory,
  TemplateDifficulty,
  TemplateFilters,
  TEMPLATE_CATEGORIES,
  TemplateMetadata,
} from '../template-types';
import { COMPLETE_TEMPLATE_LIST, getTemplatesByCategory, getFeaturedTemplates } from '../template-registry-index';

// ============================================
// ICON MAPPING
// ============================================

const CATEGORY_ICONS: Record<TemplateCategory, React.ElementType> = {
  narrative: BookOpen,
  exploration: Compass,
  'step-based': ListOrdered,
  scenario: GitBranch,
  assessment: CheckCircle,
  visual: BarChart3,
  'media-driven': Video,
  practice: Edit3,
  microlearning: Zap,
  immersive: Film,
  gamified: Trophy,
  hybrid: Layers,
};

const DIFFICULTY_COLORS: Record<TemplateDifficulty, string> = {
  beginner: 'bg-green-100 text-green-700 border-green-200',
  intermediate: 'bg-amber-100 text-amber-700 border-amber-200',
  advanced: 'bg-red-100 text-red-700 border-red-200',
};

const CATEGORY_COLORS: Record<TemplateCategory, string> = {
  narrative: 'from-purple-500 to-purple-600',
  exploration: 'from-blue-500 to-blue-600',
  'step-based': 'from-green-500 to-green-600',
  scenario: 'from-amber-500 to-amber-600',
  assessment: 'from-red-500 to-red-600',
  visual: 'from-cyan-500 to-cyan-600',
  'media-driven': 'from-pink-500 to-pink-600',
  practice: 'from-orange-500 to-orange-600',
  microlearning: 'from-yellow-500 to-yellow-600',
  immersive: 'from-indigo-500 to-indigo-600',
  gamified: 'from-emerald-500 to-emerald-600',
  hybrid: 'from-violet-500 to-violet-600',
};

// ============================================
// TEMPLATE CARD COMPONENT
// ============================================

interface TemplateCardProps {
  template: LessonTemplate;
  onView: (template: LessonTemplate) => void;
  onUse: (template: LessonTemplate) => void;
  viewMode: 'grid' | 'list';
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onView,
  onUse,
  viewMode,
}) => {
  const { metadata } = template;
  const CategoryIcon = CATEGORY_ICONS[metadata.category];
  
  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer flex items-center gap-4"
        onClick={() => onView(template)}
      >
        {/* Thumbnail */}
        <div className="w-24 h-16 rounded-md bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0 overflow-hidden">
          <div className={cn(
            'w-full h-full bg-gradient-to-br flex items-center justify-center',
            CATEGORY_COLORS[metadata.category]
          )}>
            <CategoryIcon className="w-8 h-8 text-white" />
          </div>
        </div>
        
        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 truncate">{metadata.name}</h3>
            {metadata.featured && (
              <Sparkles className="w-4 h-4 text-amber-500" />
            )}
            {metadata.new && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">New</span>
            )}
          </div>
          <p className="text-sm text-gray-600 truncate">{metadata.description}</p>
        </div>
        
        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{metadata.estimatedTime}m</span>
          </div>
          <div className="flex items-center gap-1">
            <Layers className="w-4 h-4" />
            <span>{metadata.sceneCount}</span>
          </div>
          <span className={cn(
            'px-2 py-0.5 rounded-full text-xs font-medium border',
            DIFFICULTY_COLORS[metadata.difficulty]
          )}>
            {metadata.difficulty}
          </span>
        </div>
        
        {/* Actions */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUse(template);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Use Template
        </button>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
      onClick={() => onView(template)}
    >
      {/* Thumbnail */}
      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
        <div className={cn(
          'absolute inset-0 bg-gradient-to-br flex items-center justify-center',
          CATEGORY_COLORS[metadata.category]
        )}>
          <CategoryIcon className="w-16 h-16 text-white opacity-80" />
        </div>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1">
          {metadata.featured && (
            <span className="px-2 py-1 bg-amber-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Featured
            </span>
          )}
          {metadata.new && (
            <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
              New
            </span>
          )}
        </div>
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView(template);
            }}
            className="px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUse(template);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Use
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-1">{metadata.name}</h3>
          <span className={cn(
            'px-2 py-0.5 rounded-full text-xs font-medium border flex-shrink-0 ml-2',
            DIFFICULTY_COLORS[metadata.difficulty]
          )}>
            {metadata.difficulty}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{metadata.description}</p>
        
        {/* Meta */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{metadata.estimatedTime} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Layers className="w-4 h-4" />
              <span>{metadata.sceneCount} scenes</span>
            </div>
          </div>
          
          {metadata.ratings && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>{metadata.ratings.average.toFixed(1)}</span>
            </div>
          )}
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-3">
          {metadata.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// ============================================
// TEMPLATE PREVIEW MODAL
// ============================================

interface TemplatePreviewModalProps {
  template: LessonTemplate | null;
  onClose: () => void;
  onUse: (template: LessonTemplate) => void;
}

const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({
  template,
  onClose,
  onUse,
}) => {
  if (!template) return null;
  
  const { metadata, content, placeholders } = template;
  const CategoryIcon = CATEGORY_ICONS[metadata.category];
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className={cn(
                'w-16 h-16 rounded-xl bg-gradient-to-br flex items-center justify-center',
                CATEGORY_COLORS[metadata.category]
              )}>
                <CategoryIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold text-gray-900">{metadata.name}</h2>
                  {metadata.featured && <Sparkles className="w-5 h-5 text-amber-500" />}
                </div>
                <p className="text-gray-600">{metadata.description}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Long Description */}
            {metadata.longDescription && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">About this template</h3>
                <p className="text-gray-600">{metadata.longDescription}</p>
              </div>
            )}
            
            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <Clock className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                <div className="text-2xl font-bold text-gray-900">{metadata.estimatedTime}</div>
                <div className="text-sm text-gray-500">minutes</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <Layers className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                <div className="text-2xl font-bold text-gray-900">{metadata.sceneCount}</div>
                <div className="text-sm text-gray-500">scenes</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <Tag className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                <div className="text-2xl font-bold text-gray-900">{metadata.components.length}</div>
                <div className="text-sm text-gray-500">components</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <TrendingUp className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                <div className="text-2xl font-bold text-gray-900 capitalize">{metadata.difficulty}</div>
                <div className="text-sm text-gray-500">level</div>
              </div>
            </div>
            
            {/* Features */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Features</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className={cn(
                  'flex items-center gap-2 p-3 rounded-lg border',
                  metadata.hasBranching ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-200'
                )}>
                  <GitBranch className={cn('w-5 h-5', metadata.hasBranching ? 'text-amber-600' : 'text-gray-400')} />
                  <span className={metadata.hasBranching ? 'text-amber-700' : 'text-gray-500'}>
                    Branching Paths
                  </span>
                </div>
                <div className={cn(
                  'flex items-center gap-2 p-3 rounded-lg border',
                  metadata.hasAssessment ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                )}>
                  <CheckCircle className={cn('w-5 h-5', metadata.hasAssessment ? 'text-green-600' : 'text-gray-400')} />
                  <span className={metadata.hasAssessment ? 'text-green-700' : 'text-gray-500'}>
                    Assessment
                  </span>
                </div>
                <div className={cn(
                  'flex items-center gap-2 p-3 rounded-lg border',
                  metadata.hasGamification ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'
                )}>
                  <Trophy className={cn('w-5 h-5', metadata.hasGamification ? 'text-purple-600' : 'text-gray-400')} />
                  <span className={metadata.hasGamification ? 'text-purple-700' : 'text-gray-500'}>
                    Gamification
                  </span>
                </div>
              </div>
            </div>
            
            {/* Components */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Interactive Components</h3>
              <div className="flex flex-wrap gap-2">
                {metadata.components.map((component) => (
                  <span
                    key={component}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
                  >
                    {component}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Scene Preview */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Scene Overview</h3>
              <div className="grid grid-cols-5 gap-2">
                {content.scenes.map((scene, index) => (
                  <div
                    key={scene.id}
                    className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden"
                  >
                    <div className="absolute top-1 left-1 w-5 h-5 bg-white/80 rounded-full flex items-center justify-center text-xs font-bold text-gray-700">
                      {index + 1}
                    </div>
                    <span className="text-xs text-gray-500 text-center px-1 truncate">
                      {scene.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Instructions */}
            {template.instructions && template.instructions.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">How to Customize</h3>
                <ul className="space-y-2">
                  {template.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-gray-600">{instruction}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="p-6 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {metadata.ratings && (
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        'w-5 h-5',
                        star <= Math.round(metadata.ratings!.average)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-gray-300'
                      )}
                    />
                  ))}
                  <span className="text-sm text-gray-500 ml-1">
                    ({metadata.ratings.count} reviews)
                  </span>
                </div>
              )}
              {metadata.usageCount && (
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Users className="w-4 h-4" />
                  <span>{metadata.usageCount.toLocaleString()} uses</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => onUse(template)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Use This Template
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ============================================
// MAIN TEMPLATE DISCOVERY COMPONENT
// ============================================

interface TemplateDiscoveryProps {
  onSelectTemplate: (template: LessonTemplate) => void;
  onClose?: () => void;
  initialCategory?: TemplateCategory;
  showFeatured?: boolean;
}

export const TemplateDiscovery: React.FC<TemplateDiscoveryProps> = ({
  onSelectTemplate,
  onClose,
  initialCategory,
  showFeatured = true,
}) => {
  // State
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | null>(initialCategory || null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<TemplateDifficulty | null>(null);
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'name'>('popular');
  const [previewTemplate, setPreviewTemplate] = useState<LessonTemplate | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter and sort templates
  const filteredTemplates = useMemo(() => {
    let templates = [...COMPLETE_TEMPLATE_LIST];
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      templates = templates.filter((t) =>
        t.metadata.name.toLowerCase().includes(query) ||
        t.metadata.description.toLowerCase().includes(query) ||
        t.metadata.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }
    
    // Category filter
    if (selectedCategory) {
      templates = templates.filter((t) => t.metadata.category === selectedCategory);
    }
    
    // Difficulty filter
    if (selectedDifficulty) {
      templates = templates.filter((t) => t.metadata.difficulty === selectedDifficulty);
    }
    
    // Sort
    switch (sortBy) {
      case 'popular':
        templates.sort((a, b) => (b.metadata.usageCount || 0) - (a.metadata.usageCount || 0));
        break;
      case 'newest':
        templates.sort((a, b) => (b.metadata.new ? 1 : 0) - (a.metadata.new ? 1 : 0));
        break;
      case 'name':
        templates.sort((a, b) => a.metadata.name.localeCompare(b.metadata.name));
        break;
    }
    
    return templates;
  }, [searchQuery, selectedCategory, selectedDifficulty, sortBy]);
  
  // Featured templates
  const featuredTemplates = useMemo(() => getFeaturedTemplates(), []);
  
  // Handlers
  const handleViewTemplate = useCallback((template: LessonTemplate) => {
    setPreviewTemplate(template);
  }, []);
  
  const handleUseTemplate = useCallback((template: LessonTemplate) => {
    setPreviewTemplate(null);
    onSelectTemplate(template);
  }, [onSelectTemplate]);
  
  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedDifficulty(null);
  }, []);
  
  const hasActiveFilters = searchQuery || selectedCategory || selectedDifficulty;
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-gray-900">Template Marketplace</h1>
              <span className="text-sm text-gray-500">
                {COMPLETE_TEMPLATE_LIST.length} templates
              </span>
            </div>
            
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters Bar */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest</option>
              <option value="name">Name (A-Z)</option>
            </select>
            
            {/* View Mode */}
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2.5 transition-colors',
                  viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'
                )}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2.5 transition-colors',
                  viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'
                )}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
            
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 border rounded-lg transition-colors',
                showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-200 hover:bg-gray-50'
              )}
            >
              <Filter className="w-5 h-5" />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-blue-500 rounded-full" />
              )}
            </button>
          </div>
          
          {/* Expanded Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-lg">
                  {/* Difficulty Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty
                    </label>
                    <div className="flex gap-2">
                      {(['beginner', 'intermediate', 'advanced'] as TemplateDifficulty[]).map((diff) => (
                        <button
                          key={diff}
                          onClick={() => setSelectedDifficulty(selectedDifficulty === diff ? null : diff)}
                          className={cn(
                            'px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors capitalize',
                            selectedDifficulty === diff
                              ? DIFFICULTY_COLORS[diff]
                              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-100'
                          )}
                        >
                          {diff}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Clear Filters */}
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="ml-auto text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Category Navigation */}
        <div className="mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                !selectedCategory
                  ? 'bg-gray-900 text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              )}
            >
              <Layers className="w-4 h-4" />
              All Templates
            </button>
            {(Object.keys(TEMPLATE_CATEGORIES) as TemplateCategory[]).map((categoryId) => {
              const category = TEMPLATE_CATEGORIES[categoryId];
              const Icon = CATEGORY_ICONS[categoryId];
              
              return (
                <button
                  key={categoryId}
                  onClick={() => setSelectedCategory(selectedCategory === categoryId ? null : categoryId)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                    selectedCategory === categoryId
                      ? 'bg-gray-900 text-white'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Featured Section */}
        {showFeatured && !selectedCategory && !searchQuery && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Featured Templates
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredTemplates.slice(0, 4).map((template) => (
                <TemplateCard
                  key={template.metadata.id}
                  template={template}
                  onView={handleViewTemplate}
                  onUse={handleUseTemplate}
                  viewMode="grid"
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {selectedCategory
                ? TEMPLATE_CATEGORIES[selectedCategory].name
                : 'All Templates'}
              <span className="text-gray-500 font-normal ml-2">
                ({filteredTemplates.length})
              </span>
            </h2>
          </div>
          
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTemplates.map((template) => (
                <TemplateCard
                  key={template.metadata.id}
                  template={template}
                  onView={handleViewTemplate}
                  onUse={handleUseTemplate}
                  viewMode="grid"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTemplates.map((template) => (
                <TemplateCard
                  key={template.metadata.id}
                  template={template}
                  onView={handleViewTemplate}
                  onUse={handleUseTemplate}
                  viewMode="list"
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Preview Modal */}
      <TemplatePreviewModal
        template={previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        onUse={handleUseTemplate}
      />
    </div>
  );
};

export default TemplateDiscovery;

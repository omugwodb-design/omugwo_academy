// Enhanced Block Palette with Search, Favorites, and Recent Blocks
import React, { useState, useMemo, useCallback } from 'react';
import { cn } from '../../../lib/utils';
import { BLOCK_DEFINITIONS, BLOCK_CATEGORIES, getBlocksByCategory, getAllBlockDefinitions } from '../registry';
import { BlockType, BlockDefinition } from '../types';
import { useEditorStore } from '../store/editor-store';
import {
  Search,
  Star,
  Clock,
  ChevronDown,
  ChevronRight,
  Plus,
  StarOff,
  LayoutGrid,
  Layers,
  LucideIcon,
} from 'lucide-react';

interface BlockPaletteProps {
  onAddBlock: (type: BlockType) => void;
  onDragStart?: (type: BlockType) => void;
  className?: string;
}

export const BlockPalette: React.FC<BlockPaletteProps> = ({
  onAddBlock,
  onDragStart,
  className,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(BLOCK_CATEGORIES.map(c => c.id))
  );
  const [viewMode, setViewMode] = useState<'all' | 'favorites' | 'recent'>('all');
  
  const { favoriteBlocks, recentBlocks, toggleFavorite, trackBlockUsage, getRecentBlocks } = useEditorStore();

  // Get all blocks as array
  const allBlocks = useMemo(() => getAllBlockDefinitions(), []);

  // Search blocks
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    
    const query = searchQuery.toLowerCase();
    const results: { type: BlockType; score: number; label: string; block: BlockDefinition }[] = [];
    
    allBlocks.forEach(block => {
      let score = 0;
      
      // Exact type match
      if (block.type.toLowerCase() === query) score = 100;
      
      // Label match
      if (block.label.toLowerCase().includes(query)) {
        score = Math.max(score, 80);
        if (block.label.toLowerCase().startsWith(query)) score = 95;
      }
      
      if (score > 0) {
        results.push({ type: block.type as BlockType, score, label: block.label, block });
      }
    });
    
    return results.sort((a, b) => b.score - a.score);
  }, [searchQuery, allBlocks]);

  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  // Handle block click
  const handleBlockClick = (type: BlockType) => {
    trackBlockUsage(type);
    onAddBlock(type);
  };

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, type: BlockType) => {
    e.dataTransfer.setData('blockType', type);
    e.dataTransfer.effectAllowed = 'copy';
    onDragStart?.(type);
  };

  // Get recent blocks
  const recentBlockTypes = useMemo(() => {
    return getRecentBlocks(5);
  }, [getRecentBlocks, recentBlocks]);

  // Render block item
  const renderBlockItem = (block: BlockDefinition) => {
    const isFavorite = favoriteBlocks.includes(block.type as BlockType);
    const BlockIcon = block.icon || LayoutGrid;
    
    return (
      <div
        key={block.type}
        draggable
        onDragStart={(e) => handleDragStart(e, block.type as BlockType)}
        onClick={() => handleBlockClick(block.type as BlockType)}
        className={cn(
          'group flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer transition-all',
          'hover:bg-primary-50 dark:hover:bg-primary-950/30',
          'border border-transparent hover:border-primary-200 dark:hover:border-primary-800'
        )}
      >
        <div className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
          'bg-gray-100 dark:bg-gray-800 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30'
        )}>
          <BlockIcon className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-primary-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
            {block.label}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(block.type as BlockType);
          }}
          className={cn(
            'p-1 rounded transition-colors',
            isFavorite
              ? 'text-yellow-500 hover:text-yellow-600'
              : 'text-gray-300 hover:text-yellow-400 opacity-0 group-hover:opacity-100'
          )}
        >
          {isFavorite ? <Star className="w-3.5 h-3.5 fill-current" /> : <StarOff className="w-3.5 h-3.5" />}
        </button>
        <Plus className="w-3.5 h-3.5 text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    );
  };

  return (
    <div className={cn('flex flex-col h-full bg-white dark:bg-gray-900', className)}>
      {/* Search */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-800">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search blocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              'w-full pl-8 pr-3 py-2 text-xs rounded-lg border transition-colors',
              'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
              'placeholder:text-gray-400'
            )}
          />
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setViewMode('all')}
          className={cn(
            'flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs font-medium transition-colors',
            viewMode === 'all'
              ? 'text-primary-600 bg-primary-50 dark:bg-primary-950/30 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          )}
        >
          <Layers className="w-3 h-3" />
          All
        </button>
        <button
          onClick={() => setViewMode('favorites')}
          className={cn(
            'flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs font-medium transition-colors',
            viewMode === 'favorites'
              ? 'text-primary-600 bg-primary-50 dark:bg-primary-950/30 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          )}
        >
          <Star className="w-3 h-3" />
          Favorites
          {favoriteBlocks.length > 0 && (
            <span className="ml-0.5 px-1 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 rounded text-xs">
              {favoriteBlocks.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setViewMode('recent')}
          className={cn(
            'flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs font-medium transition-colors',
            viewMode === 'recent'
              ? 'text-primary-600 bg-primary-50 dark:bg-primary-950/30 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          )}
        >
          <Clock className="w-3 h-3" />
          Recent
        </button>
      </div>

      {/* Block List */}
      <div className="flex-1 overflow-y-auto p-2">
        {/* Search Results */}
        {searchResults && (
          <div className="space-y-1">
            <p className="px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
            </p>
            {searchResults.map(result => renderBlockItem(result.block))}
          </div>
        )}

        {/* No search, show by view mode */}
        {!searchResults && viewMode === 'all' && (
          <div className="space-y-2">
            {BLOCK_CATEGORIES.map(category => {
              const isExpanded = expandedCategories.has(category.id);
              const categoryBlocks = getBlocksByCategory(category.id);
              
              return (
                <div key={category.id}>
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-3 h-3" />
                    ) : (
                      <ChevronRight className="w-3 h-3" />
                    )}
                    <span>{category.label}</span>
                    <span className="ml-auto text-gray-400 text-xs">
                      {categoryBlocks.length}
                    </span>
                  </button>
                  
                  {isExpanded && (
                    <div className="mt-1 space-y-0.5 pl-2">
                      {categoryBlocks.map(block => renderBlockItem(block))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Favorites View */}
        {!searchResults && viewMode === 'favorites' && (
          <div className="space-y-1">
            {favoriteBlocks.length === 0 ? (
              <div className="text-center py-8">
                <Star className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  No favorite blocks yet
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Click the star icon on any block to add it here
                </p>
              </div>
            ) : (
              favoriteBlocks.map(type => {
                const block = BLOCK_DEFINITIONS[type];
                return block ? renderBlockItem(block) : null;
              })
            )}
          </div>
        )}

        {/* Recent View */}
        {!searchResults && viewMode === 'recent' && (
          <div className="space-y-1">
            {recentBlockTypes.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  No recently used blocks
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Blocks you use will appear here
                </p>
              </div>
            ) : (
              recentBlockTypes.map(type => {
                const block = BLOCK_DEFINITIONS[type];
                return block ? renderBlockItem(block) : null;
              })
            )}
          </div>
        )}
      </div>

      {/* Keyboard Shortcut Hint */}
      <div className="p-2 border-t border-gray-200 dark:border-gray-800">
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
          Press <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">Ctrl+K</kbd> for quick search
        </p>
      </div>
    </div>
  );
};

export default BlockPalette;

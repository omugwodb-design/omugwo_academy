import React, { useState, useCallback, useEffect } from 'react';
import { cn } from '../../../lib/utils';
import { LessonBlock, LessonBlockType, LessonContent } from './types';
import { LESSON_BLOCK_DEFINITIONS, LESSON_BLOCK_CATEGORIES, createBlock, getBlocksByCategory } from './registry';
import { LessonBlockRenderer } from './LessonBlockRenderer';
import { LessonBlockSettings } from './LessonBlockSettings';
import { LessonTemplateSelector } from './LessonTemplateSelector';
import { createLessonFromTemplate } from '../lesson-templates';
import { findBlock, updateBlockInTree, removeBlockFromTree, insertBlockInTree } from './tree-utils';
import { LessonTypeSelector, LessonMode } from './components/LessonTypeSelector';
import { InteractiveLessonEditor } from './components/InteractiveLessonEditor';
import {
  Type,
  Image,
  Video,
  Music,
  MousePointer,
  Minus,
  AlertCircle,
  Code,
  Download,
  HelpCircle,
  MessageSquare,
  Quote,
  List,
  Terminal,
  GripVertical,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  Eye,
  Monitor,
  Tablet,
  Smartphone,
  Save,
  Undo,
  Redo,
  Copy,
  Move,
  Sparkles,
  LayoutGrid,
  Layers,
} from 'lucide-react';

// Icon mapping
const BLOCK_ICONS: Record<string, React.FC<{ className?: string }>> = {
  Type,
  Image,
  Video,
  Music,
  MousePointer,
  Minus,
  AlertCircle,
  Code,
  Download,
  HelpCircle,
  MessageSquare,
  Quote,
  List,
  Terminal,
  Heading: Type,
};

interface LessonEditorProps {
  initialContent?: LessonContent;
  onSave?: (content: LessonContent) => void;
  onPreview?: (content: LessonContent) => void;
  readOnly?: boolean;
  /** Initial lesson mode - if provided, skips type selection */
  initialMode?: LessonMode;
  /** Callback when lesson mode changes */
  onModeChange?: (mode: LessonMode) => void;
}

export const LessonEditor: React.FC<LessonEditorProps> = ({
  initialContent,
  onSave,
  onPreview,
  readOnly = false,
  initialMode,
  onModeChange,
}) => {
  // Lesson mode state
  const [lessonMode, setLessonMode] = useState<LessonMode | null>(initialMode || null);
  const [showTypeSelector, setShowTypeSelector] = useState(!initialMode && !initialContent?.blocks?.length);

  const [blocks, setBlocks] = useState<LessonBlock[]>(initialContent?.blocks || []);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(LESSON_BLOCK_CATEGORIES.map(c => c.id))
  );
  const [history, setHistory] = useState<LessonBlock[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile' | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'blocks' | 'templates'>('blocks');
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  const selectedBlock = blocks.find(b => b.id === selectedBlockId) || null;

  // Handle lesson mode selection
  const handleModeSelect = useCallback((mode: LessonMode) => {
    setLessonMode(mode);
    setShowTypeSelector(false);
    onModeChange?.(mode);
  }, [onModeChange]);

  // Handle switching lesson mode
  const handleSwitchMode = useCallback(() => {
    setShowTypeSelector(true);
  }, []);

  // Push to history
  const pushHistory = useCallback((newBlocks: LessonBlock[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newBlocks]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  // Undo
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setBlocks(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  // Redo
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setBlocks(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  // Initialize history
  useEffect(() => {
    if (blocks.length > 0 && history.length === 0) {
      setHistory([blocks]);
      setHistoryIndex(0);
    }
  }, []);

  // Add block
  const addBlock = useCallback((type: LessonBlockType, index?: number, parentId: string | null = null, column?: number) => {
    const newBlock = createBlock(type);
    const insertIndex = index !== undefined ? index : (parentId === null ? blocks.length : 0);
    const newBlocks = insertBlockInTree(blocks, parentId, insertIndex, newBlock, column);
    setBlocks(newBlocks);
    pushHistory(newBlocks);
    setSelectedBlockId(newBlock.id);
  }, [blocks, pushHistory]);

  // Update block props
  const updateBlockProps = useCallback((blockId: string, props: Record<string, any>) => {
    const newBlocks = updateBlockInTree(blocks, blockId, (block) => ({
      ...block,
      props: { ...block.props, ...props }
    }));
    setBlocks(newBlocks);
    pushHistory(newBlocks);
  }, [blocks, pushHistory]);

  // Delete block
  const deleteBlock = useCallback((blockId: string) => {
    const newBlocks = removeBlockFromTree(blocks, blockId);
    setBlocks(newBlocks);
    pushHistory(newBlocks);
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }
  }, [blocks, selectedBlockId, pushHistory]);

  // Duplicate block
  const duplicateBlock = useCallback((blockId: string) => {
    const found = findBlock(blocks, blockId);
    if (!found) return;

    const { block, parentPath } = found;
    const parentId = parentPath.length > 0 ? parentPath[parentPath.length - 1] : null;

    let siblingArray = blocks;
    if (parentId) {
      const parent = findBlock(blocks, parentId)?.block;
      siblingArray = parent?.children || [];
    }
    const blockIndex = siblingArray.findIndex(b => b.id === blockId);

    const newBlock: LessonBlock = {
      ...block,
      id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      props: { ...block.props },
    };

    const newBlocks = insertBlockInTree(blocks, parentId, blockIndex + 1, newBlock, block.props.columnIndex);
    setBlocks(newBlocks);
    pushHistory(newBlocks);
    setSelectedBlockId(newBlock.id);
  }, [blocks, pushHistory]);

  // Move block
  const moveBlock = useCallback((sourceId: string, targetId: string | null, targetIndex: number, targetColumn?: number) => {
    const found = findBlock(blocks, sourceId);
    if (!found) return;

    let newBlocks = removeBlockFromTree(blocks, sourceId);
    newBlocks = insertBlockInTree(newBlocks, targetId, targetIndex, found.block, targetColumn);

    setBlocks(newBlocks);
    pushHistory(newBlocks);
  }, [blocks, pushHistory]);

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, blockId: string) => {
    e.stopPropagation();
    e.dataTransfer.effectAllowed = 'move';
    setDraggedBlockId(blockId);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number, parentId: string | null = null, column?: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedBlockId === null) return;
    moveBlock(draggedBlockId, parentId, targetIndex, column);
    setDraggedBlockId(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedBlockId(null);
    setDragOverIndex(null);
  };

  // Handle new block drop from palette
  const handlePaletteDrop = (e: React.DragEvent, index: number, parentId: string | null = null, column?: number) => {
    e.preventDefault();
    e.stopPropagation();
    const blockType = e.dataTransfer.getData('blockType') as LessonBlockType;
    if (blockType) {
      addBlock(blockType, index, parentId, column);
    }
  };

  // Save
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const content: LessonContent = {
        version: '1.0',
        blocks,
      };
      await onSave?.(content);
    } finally {
      setIsSaving(false);
    }
  };

  // Preview
  const handlePreview = () => {
    const content: LessonContent = {
      version: '1.0',
      blocks,
    };
    setPreviewMode('desktop');
    onPreview?.(content);
  };

  // Toggle category
  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  // Apply template
  const handleApplyTemplate = (templateId: string) => {
    try {
      const { blocks: templateBlocks } = createLessonFromTemplate(templateId);
      setBlocks(templateBlocks);
      pushHistory(templateBlocks);
      setSelectedBlockId(null);
      setShowTemplateSelector(false);
    } catch (error) {
      console.error('Failed to apply template:', error);
    }
  };

  const getPreviewWidth = () => {
    switch (previewMode) {
      case 'tablet':
        return 'max-w-2xl';
      case 'mobile':
        return 'max-w-sm';
      default:
        return 'max-w-4xl';
    }
  };

  const renderBlock = (block: LessonBlock, index: number, parentId: string | null = null, depth: number = 0) => {
    return (
      <div
        key={block.id}
        draggable
        onDragStart={(e) => handleDragStart(e, block.id)}
        onDragOver={(e) => handleDragOver(e, index)}
        onDrop={(e) => handleDrop(e, index, parentId, block.props.columnIndex)}
        onDragEnd={handleDragEnd}
        onClick={(e) => { e.stopPropagation(); setSelectedBlockId(block.id); }}
        className={cn(
          'group/block relative transition-all duration-200 animate-fadeIn',
          depth === 0 ? 'rounded-2xl' : 'rounded-xl',
          selectedBlockId === block.id
            ? 'ring-2 ring-blue-500 ring-offset-4 dark:ring-offset-gray-900 shadow-lg'
            : 'hover:ring-2 hover:ring-blue-300 dark:hover:ring-blue-700 hover:shadow-md',
          dragOverIndex === index && draggedBlockId !== block.id && 'border-t-2 border-blue-500',
          draggedBlockId === block.id && 'opacity-50 scale-95',
          depth > 0 && 'border border-gray-100 dark:border-gray-800 shadow-sm'
        )}
      >
        {/* Block Actions */}
        <div className={cn(
          'absolute -left-10 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover/block:opacity-100 transition-opacity',
          selectedBlockId === block.id && 'opacity-100'
        )}>
          <button
            className="p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-grab"
            title="Drag to reorder"
          >
            <GripVertical className="w-4 h-4" />
          </button>
        </div>
        <div className={cn(
          'absolute -right-2 -top-2 flex items-center gap-1 opacity-0 group-hover/block:opacity-100 transition-opacity z-10',
          selectedBlockId === block.id && 'opacity-100'
        )}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              duplicateBlock(block.id);
            }}
            className="p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            title="Duplicate"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteBlock(block.id);
            }}
            className="p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-gray-400 hover:text-red-500"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Block Content */}
        <div className={cn(
          'p-4 bg-white dark:bg-gray-900 border',
          depth === 0 ? 'rounded-xl' : 'rounded-lg',
          selectedBlockId === block.id
            ? 'border-primary-300 dark:border-primary-700'
            : 'border-gray-200 dark:border-gray-800'
        )}>
          <LessonBlockRenderer
            block={block}
            isEditing
            onPropChange={updateBlockProps}
            selected={selectedBlockId === block.id}
            isSelected={selectedBlockId === block.id}
            onSelect={() => setSelectedBlockId(block.id)}
            onUpdate={(props) => updateBlockProps(block.id, props)}
            onDelete={() => deleteBlock(block.id)}
            onDuplicate={() => duplicateBlock(block.id)}
            renderChildBlock={(pId, childIndex, column) => {
              const childBlocks = block.children?.filter(c => c.props.columnIndex === column) || [];
              return (
                <div
                  className="flex flex-col gap-2 min-h-[50px] flex-1 w-full"
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  onDrop={(e) => { e.stopPropagation(); handlePaletteDrop(e, childBlocks.length, pId, column); }}
                >
                  {childBlocks.map((child, i) => renderBlock(child, i, pId, depth + 1))}
                  {childBlocks.length === 0 && (
                    <div className="h-full w-full min-h-[40px] flex items-center justify-center text-gray-400 group/dropzone border-2 border-dashed border-transparent hover:border-blue-300 rounded-lg transition-colors">
                      <span className="text-xs opacity-50 group-hover/dropzone:opacity-100">Drop here</span>
                    </div>
                  )}
                </div>
              );
            }}
          />
        </div>
      </div>
    );
  };

  // Show lesson type selector for new lessons
  if (showTypeSelector) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          {lessonMode && (
            <button
              onClick={() => setShowTypeSelector(false)}
              className="mb-6 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              ← Back to Editor
            </button>
          )}
          
          <LessonTypeSelector
            selectedMode={lessonMode || undefined}
            onSelect={handleModeSelect}
            showDetails={true}
          />

          {/* Continue Button */}
          {lessonMode && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setShowTypeSelector(false)}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
              >
                Continue with {lessonMode === 'standard' ? 'Standard' : 'Interactive'} Lesson
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render interactive lesson editor for interactive mode
  if (lessonMode === 'interactive') {
    return (
      <InteractiveLessonEditor
        initialContent={undefined}
        onSave={(content) => {
          // Handle save for interactive lesson
          console.log('Save interactive lesson:', content);
        }}
        onPreview={(content) => {
          // Handle preview for interactive lesson
          console.log('Preview interactive lesson:', content);
        }}
        readOnly={readOnly}
      />
    );
  }

  if (previewMode) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-950 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreviewMode(null)}
              className="px-3 py-1.5 text-sm font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              ← Back to Editor
            </button>
          </div>
          <div className="flex items-center gap-1 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-1">
            <button
              onClick={() => setPreviewMode('desktop')}
              className={cn(
                'p-2 rounded-lg transition-colors',
                previewMode === 'desktop' ? 'bg-primary-100 text-primary-600' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
              )}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewMode('tablet')}
              className={cn(
                'p-2 rounded-lg transition-colors',
                previewMode === 'tablet' ? 'bg-primary-100 text-primary-600' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
              )}
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewMode('mobile')}
              className={cn(
                'p-2 rounded-lg transition-colors',
                previewMode === 'mobile' ? 'bg-primary-100 text-primary-600' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
              )}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className={cn('mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden', getPreviewWidth())}>
          <div className="p-6 md:p-8">
            {blocks.map((block) => (
              <div key={block.id} className="mb-6">
                <LessonBlockRenderer block={block} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      {/* Block Palette - Sleek Sidebar */}
      <div className="w-72 border-r border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl flex flex-col shadow-sm">
        {/* Sidebar Tabs - Apple Style */}
        <div className="flex border-b border-gray-200/50 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-800/50">
          <button
            onClick={() => setSidebarTab('blocks')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition-all duration-200',
              sidebarTab === 'blocks'
                ? 'text-blue-600 bg-white dark:bg-gray-900 border-b-2 border-blue-500 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
            )}
          >
            <Layers className="w-4 h-4" />
            Blocks
          </button>
          <button
            onClick={() => setSidebarTab('templates')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition-all duration-200',
              sidebarTab === 'templates'
                ? 'text-blue-600 bg-white dark:bg-gray-900 border-b-2 border-blue-500 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
            )}
          >
            <Sparkles className="w-4 h-4" />
            Templates
          </button>
        </div>

        {/* Blocks Tab Content */}
        {sidebarTab === 'blocks' && (
          <div className="flex-1 overflow-y-auto p-2">
            {LESSON_BLOCK_CATEGORIES.map(category => {
              const isExpanded = expandedCategories.has(category.id);
              const categoryBlocks = getBlocksByCategory(category.id);
              const CategoryIcon = BLOCK_ICONS[category.icon] || Type;

              return (
                <div key={category.id} className="mb-2">
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                  >
                    {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    <CategoryIcon className="w-3.5 h-3.5" />
                    {category.label}
                  </button>
                  {isExpanded && (
                    <div className="mt-1 space-y-0.5 pl-2">
                      {categoryBlocks.map(block => {
                        const BlockIcon = BLOCK_ICONS[block.icon] || Type;
                        return (
                          <div
                            key={block.type}
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('blockType', block.type);
                              e.dataTransfer.effectAllowed = 'copy';
                            }}
                            onClick={() => addBlock(block.type)}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-xl cursor-pointer group transition-all duration-200 hover-lift"
                          >
                            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition-colors">
                              <BlockIcon className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-blue-500" />
                            </div>
                            <span className="font-medium">{block.label}</span>
                            <Plus className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 text-blue-500 transition-opacity" />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Templates Tab Content */}
        {sidebarTab === 'templates' && (
          <LessonTemplateSelector
            onSelectTemplate={handleApplyTemplate}
            selectedTemplateId={undefined}
          />
        )}
      </div>

      {/* Canvas */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50/50 dark:bg-gray-900/50">
        {/* Toolbar - Figma Style */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
          <div className="flex items-center gap-1">
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg disabled:opacity-30 transition-colors"
              title="Undo (Ctrl+Z)"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg disabled:opacity-30 transition-colors"
              title="Redo (Ctrl+Y)"
            >
              <Redo className="w-4 h-4" />
            </button>
            <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-2" />
            <button
              onClick={handlePreview}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <Eye className="w-3.5 h-3.5" />
              Preview
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{blocks.length} blocks</span>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 text-white text-xs font-bold rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-4xl mx-auto">
            {blocks.length === 0 ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handlePaletteDrop(e, 0)}
                className="min-h-[500px] border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl flex flex-col items-center justify-center text-center p-12 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm animate-fadeIn"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Plus className="w-10 h-10 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Start Building Your Lesson</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                  Drag blocks from the sidebar or click below to add them. Your content will appear here.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  {['text', 'heading', 'image', 'video'].map(type => {
                    const def = LESSON_BLOCK_DEFINITIONS[type as LessonBlockType];
                    const Icon = BLOCK_ICONS[def.icon] || Type;
                    return (
                      <button
                        key={type}
                        onClick={() => addBlock(type as LessonBlockType)}
                        className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg transition-all duration-200 hover-lift"
                      >
                        <Icon className="w-4 h-4 text-blue-500" />
                        {def.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {blocks.map((block, index) => renderBlock(block, index, null, 0))}

                {/* Add block at end */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handlePaletteDrop(e, blocks.length)}
                  className="flex items-center justify-center py-4"
                >
                  <button
                    onClick={() => addBlock('text')}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl hover:border-primary-300 dark:hover:border-primary-700"
                  >
                    <Plus className="w-4 h-4" />
                    Add Block
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {selectedBlock && (
        <div className="w-80 border-l border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl flex flex-col shadow-sm">
          <div className="p-4 border-b border-gray-200/50 dark:border-gray-800/50 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
              {LESSON_BLOCK_DEFINITIONS[selectedBlock.type].label} Settings
            </h3>
            <button
              onClick={() => setSelectedBlockId(null)}
              className="p-1.5 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <LessonBlockSettings
              block={selectedBlock}
              onChange={(props) => updateBlockProps(selectedBlock.id, props)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonEditor;

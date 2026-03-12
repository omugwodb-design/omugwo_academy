/**
 * Interactive Lesson Editor
 * 
 * Scene-based editor for immersive, interactive lessons.
 * Supports visual backgrounds, scene navigation, and interactive components.
 */

import React, { useState, useCallback } from 'react';
import { cn } from '../../../../lib/utils';
import {
  Scene,
  SceneBackground,
  InteractiveLesson,
  SceneSection,
  BACKGROUND_PRESETS,
  createScene,
  SCENE_TEMPLATES,
} from '../scene-types';
import {
  Plus,
  Palette,
  ChevronLeft,
  ChevronRight,
  Eye,
  Save,
  LayoutGrid,
  Film,
  Wand2,
  X,
  LayoutTemplate,
  Sparkles,
  Layers,
  ChevronDown,
  Trash2,
  Copy,
  GripVertical,
  Type,
  Image as ImageIcon,
  Video as VideoIcon,
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
  Layout,
  CheckCircle,
  BarChart,
} from 'lucide-react';
import { TemplateDiscovery } from './TemplateDiscovery';
import { LessonTemplate, applyPlaceholders } from '../template-types';
import { COMPLETE_TEMPLATE_LIST } from '../template-registry-index';
import { LessonBlock, LessonBlockType } from '../types';
import { LESSON_BLOCK_DEFINITIONS, LESSON_BLOCK_CATEGORIES, createBlock, getBlocksByCategory, generateBlockId } from '../registry';
import { LessonBlockRenderer } from '../LessonBlockRenderer';
import { LessonBlockSettings } from '../LessonBlockSettings';
import { findBlock, updateBlockInTree, removeBlockFromTree, insertBlockInTree } from '../tree-utils';

// Icon mapping
const BLOCK_ICONS: Record<string, React.FC<{ className?: string }>> = {
  Type,
  Image: ImageIcon,
  Video: VideoIcon,
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
  Layout,
  CheckCircle,
  BarChart,
};

// ============================================
// HELPER: Get CSS background string
// ============================================

function getBackgroundStyle(background: SceneBackground): string {
  switch (background.type) {
    case 'solid':
      return background.color || '#1a1a2e';
    case 'gradient':
      if (background.gradient) {
        const angle = background.gradient.angle || 135;
        const colors = background.gradient.colors.join(', ');
        return `linear-gradient(${angle}deg, ${colors})`;
      }
      return '#1a1a2e';
    case 'image':
      if (background.image) {
        return `url(${background.image.src}) center/cover`;
      }
      return '#1a1a2e';
    default:
      return '#1a1a2e';
  }
}

// ============================================
// TYPES
// ============================================

export interface InteractiveLessonEditorProps {
  initialContent?: InteractiveLesson;
  onSave?: (content: InteractiveLesson) => void;
  onPreview?: (content: InteractiveLesson) => void;
  readOnly?: boolean;
}

// ============================================
// BACKGROUND EDITOR COMPONENT
// ============================================

interface BackgroundEditorProps {
  background: SceneBackground;
  onChange: (background: SceneBackground) => void;
}

const BackgroundEditor: React.FC<BackgroundEditorProps> = ({ background, onChange }) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Palette className="w-4 h-4 text-purple-500" />
        <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">Background</h4>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <button
          onClick={() => setActiveTab('presets')}
          className={cn(
            'flex-1 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors',
            activeTab === 'presets'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          )}
        >
          Presets
        </button>
        <button
          onClick={() => setActiveTab('custom')}
          className={cn(
            'flex-1 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors',
            activeTab === 'custom'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          )}
        >
          Custom
        </button>
      </div>

      {/* Presets */}
      {activeTab === 'presets' && (
        <div className="grid grid-cols-4 gap-2">
          {Object.entries(BACKGROUND_PRESETS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => onChange(preset)}
              className={cn(
                'aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105',
                JSON.stringify(background) === JSON.stringify(preset)
                  ? 'border-purple-500 ring-2 ring-purple-500/30'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              )}
            >
              <div
                className="w-full h-full"
                style={{ background: getBackgroundStyle(preset) }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Custom */}
      {activeTab === 'custom' && (
        <div className="space-y-3">
          {/* Background Type */}
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
              Type
            </label>
            <select
              value={background.type}
              onChange={(e) => onChange({ type: e.target.value as SceneBackground['type'] })}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <option value="solid">Solid Color</option>
              <option value="gradient">Gradient</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
              <option value="parallax">Parallax</option>
            </select>
          </div>

          {/* Type-specific options */}
          {background.type === 'solid' && (
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                Color
              </label>
              <input
                type="color"
                value={background.color || '#1a1a2e'}
                onChange={(e) => onChange({ type: 'solid', color: e.target.value })}
                className="w-full h-10 rounded-lg cursor-pointer"
              />
            </div>
          )}

          {background.type === 'gradient' && (
            <>
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                  Colors
                </label>
                <div className="flex gap-2">
                  {(background.gradient?.colors || ['#667eea', '#764ba2']).map((color, i) => (
                    <input
                      key={i}
                      type="color"
                      value={color}
                      onChange={(e) => {
                        const colors = [...(background.gradient?.colors || ['#667eea', '#764ba2'])];
                        colors[i] = e.target.value;
                        onChange({
                          type: 'gradient',
                          gradient: { ...background.gradient, type: 'linear', colors },
                        });
                      }}
                      className="flex-1 h-10 rounded-lg cursor-pointer"
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                  Angle: {background.gradient?.angle || 135}°
                </label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={background.gradient?.angle || 135}
                  onChange={(e) => onChange({
                    type: 'gradient',
                    gradient: { ...background.gradient, type: 'linear', angle: parseInt(e.target.value), colors: background.gradient?.colors || ['#667eea', '#764ba2'] },
                  })}
                  className="w-full"
                />
              </div>
            </>
          )}

          {background.type === 'image' && (
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                Image URL
              </label>
              <input
                type="url"
                value={background.image?.src || ''}
                onChange={(e) => onChange({
                  type: 'image',
                  image: { src: e.target.value },
                })}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================
// SCENE CARD COMPONENT
// ============================================

interface SceneCardProps {
  scene: Scene;
  index: number;
  isActive: boolean;
  onSelect: () => void;
  onEdit: () => void;
}

const SceneCard: React.FC<SceneCardProps> = ({ scene, index, isActive, onSelect, onEdit }) => {
  return (
    <div
      onClick={onSelect}
      className={cn(
        'relative group cursor-pointer rounded-xl overflow-hidden transition-all duration-200',
        'border-2',
        isActive
          ? 'border-purple-500 ring-2 ring-purple-500/20 shadow-lg'
          : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
      )}
    >
      {/* Scene Preview Background */}
      <div
        className="h-24 w-full relative"
        style={{ background: getBackgroundStyle(scene.background) }}
      >
        {/* Scene Number */}
        <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/30 backdrop-blur-sm rounded text-xs font-bold text-white">
          {index + 1}
        </div>

        {/* Block Count */}
        <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/30 backdrop-blur-sm rounded text-xs text-white/80">
          {scene.sections.reduce((acc, s) => acc + s.blocks.length, 0)} blocks
        </div>
      </div>

      {/* Scene Info */}
      <div className="p-3 bg-white dark:bg-gray-900">
        <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">
          {scene.title || `Scene ${index + 1}`}
        </h4>
        {scene.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
            {scene.description}
          </p>
        )}
      </div>

      {/* Hover Actions */}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          className="px-3 py-1.5 bg-white rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100"
        >
          Edit
        </button>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

export const InteractiveLessonEditor: React.FC<InteractiveLessonEditorProps> = ({
  initialContent,
  onSave,
  onPreview,
  readOnly = false,
}) => {
  // Initialize with default content or provided content
  const [lesson, setLesson] = useState<InteractiveLesson>(
    initialContent || {
      id: `lesson_${Date.now()}`,
      type: 'interactive',
      title: 'New Interactive Lesson',
      scenes: [createScene()],
      theme: 'immersive',
      settings: {
        showGlobalProgress: true,
        allowSceneNavigation: true,
        showSceneMenu: true,
        enableAudio: false,
        autoSave: true,
      },
      metadata: {
        estimatedTime: 10,
        difficulty: 'beginner',
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        version: '1.0',
      },
    }
  );

  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [showBackgroundEditor, setShowBackgroundEditor] = useState(false);
  const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(null);
  const [showSceneTemplates, setShowSceneTemplates] = useState(false);
  const [showTemplateMarketplace, setShowTemplateMarketplace] = useState(false);
  
  // Block Editor State
  const [sidebarTab, setSidebarTab] = useState<'scenes' | 'blocks'>('scenes');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(LESSON_BLOCK_CATEGORIES.map(c => c.id))
  );
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<{sectionIndex: number, blockIndex: number} | null>(null);

  const activeScene = lesson.scenes[activeSceneIndex];

  // Update lesson
  const updateLesson = useCallback((updates: Partial<InteractiveLesson>) => {
    setLesson(prev => ({ ...prev, ...updates }));
  }, []);

  // Update scene
  const updateScene = useCallback((sceneIndex: number, updates: Partial<Scene>) => {
    setLesson(prev => ({
      ...prev,
      scenes: prev.scenes.map((scene, i) =>
        i === sceneIndex ? { ...scene, ...updates } : scene
      ),
    }));
  }, []);

  // Add new scene from template
  const addSceneFromTemplate = useCallback((template: typeof SCENE_TEMPLATES[0]) => {
    const newScene = createScene(template);
    setLesson(prev => ({
      ...prev,
      scenes: [...prev.scenes, newScene],
    }));
    setActiveSceneIndex(lesson.scenes.length);
    setShowSceneTemplates(false);
  }, [lesson.scenes.length]);

  // Add default scene
  const addDefaultScene = useCallback(() => {
    const newScene = createScene();
    setLesson(prev => ({
      ...prev,
      scenes: [...prev.scenes, newScene],
    }));
    setActiveSceneIndex(lesson.scenes.length);
  }, [lesson.scenes.length]);

  // Use full lesson template
  const useTemplate = useCallback((template: LessonTemplate) => {
    // Apply placeholder defaults
    const placeholderValues: Record<string, string> = {};
    template.placeholders.forEach(p => {
      placeholderValues[p.id] = p.defaultValue || '';
    });
    
    const content = applyPlaceholders(template, placeholderValues);
    setLesson({
      id: `lesson_${Date.now()}`,
      type: 'interactive',
      title: content.title,
      scenes: content.scenes,
      theme: content.theme,
      settings: content.settings,
      metadata: {
        estimatedTime: template.metadata.estimatedTime,
        difficulty: template.metadata.difficulty,
        tags: template.metadata.tags,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: '1.0',
      },
    });
    setActiveSceneIndex(0);
    setShowTemplateMarketplace(false);
  }, []);

  // Delete scene
  const deleteScene = useCallback((sceneIndex: number) => {
    if (lesson.scenes.length <= 1) return; // Keep at least one scene
    setLesson(prev => ({
      ...prev,
      scenes: prev.scenes.filter((_, i) => i !== sceneIndex),
    }));
    if (activeSceneIndex >= lesson.scenes.length - 1) {
      setActiveSceneIndex(Math.max(0, lesson.scenes.length - 2));
    }
  }, [lesson.scenes.length, activeSceneIndex]);

  // Block Category Toggle
  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  // Block Manipulation Helpers
  const addBlockToSection = useCallback((sectionIndex: number, type: LessonBlockType, targetIndex?: number, parentId: string | null = null, column?: number) => {
    const newBlock = createBlock(type);
    
    setLesson(prev => {
      const scenes = [...prev.scenes];
      const scene = { ...scenes[activeSceneIndex] };
      const sections = [...scene.sections];
      const section = { ...sections[sectionIndex] };
      
      const insertIndex = targetIndex !== undefined ? targetIndex : (parentId === null ? section.blocks.length : 0);
      section.blocks = insertBlockInTree(section.blocks, parentId, insertIndex, newBlock, column);
      
      sections[sectionIndex] = section;
      scene.sections = sections;
      scenes[activeSceneIndex] = scene;
      
      return { ...prev, scenes };
    });
    
    setSelectedBlockId(newBlock.id);
  }, [activeSceneIndex]);

  const updateBlockProps = useCallback((sectionIndex: number, blockId: string, props: Record<string, any>) => {
    setLesson(prev => {
      const scenes = [...prev.scenes];
      const scene = { ...scenes[activeSceneIndex] };
      const sections = [...scene.sections];
      const section = { ...sections[sectionIndex] };
      
      section.blocks = updateBlockInTree(section.blocks, blockId, (block) => ({
        ...block,
        props: { ...block.props, ...props }
      }));
      
      sections[sectionIndex] = section;
      scene.sections = sections;
      scenes[activeSceneIndex] = scene;
      
      return { ...prev, scenes };
    });
  }, [activeSceneIndex]);

  const deleteBlock = useCallback((sectionIndex: number, blockId: string) => {
    setLesson(prev => {
      const scenes = [...prev.scenes];
      const scene = { ...scenes[activeSceneIndex] };
      const sections = [...scene.sections];
      const section = { ...sections[sectionIndex] };
      
      section.blocks = removeBlockFromTree(section.blocks, blockId);
      
      sections[sectionIndex] = section;
      scene.sections = sections;
      scenes[activeSceneIndex] = scene;
      
      return { ...prev, scenes };
    });
    
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }
  }, [activeSceneIndex, selectedBlockId]);

  const duplicateBlock = useCallback((sectionIndex: number, blockId: string) => {
    setLesson(prev => {
      const scenes = [...prev.scenes];
      const scene = { ...scenes[activeSceneIndex] };
      const sections = [...scene.sections];
      const section = { ...sections[sectionIndex] };
      
      const found = findBlock(section.blocks, blockId);
      if (!found) return prev;

      const { block, parentPath } = found;
      const parentId = parentPath.length > 0 ? parentPath[parentPath.length - 1] : null;

      let siblingArray = section.blocks;
      if (parentId) {
        const parent = findBlock(section.blocks, parentId)?.block;
        siblingArray = parent?.children || [];
      }
      const blockIndex = siblingArray.findIndex(b => b.id === blockId);

      const newBlock: LessonBlock = {
        ...block,
        id: generateBlockId(),
        props: { ...block.props },
      };

      section.blocks = insertBlockInTree(section.blocks, parentId, blockIndex + 1, newBlock, block.props.columnIndex);
      
      sections[sectionIndex] = section;
      scene.sections = sections;
      scenes[activeSceneIndex] = scene;
      
      // We set the selected block ID asynchronously since state update is queued
      setTimeout(() => setSelectedBlockId(newBlock.id), 0);
      
      return { ...prev, scenes };
    });
  }, [activeSceneIndex]);

  const moveBlock = useCallback((sectionIndex: number, sourceId: string, targetId: string | null, targetIndex: number, targetColumn?: number) => {
    setLesson(prev => {
      const scenes = [...prev.scenes];
      const scene = { ...scenes[activeSceneIndex] };
      const sections = [...scene.sections];
      const section = { ...sections[sectionIndex] };
      
      const found = findBlock(section.blocks, sourceId);
      if (!found) return prev;

      let newBlocks = removeBlockFromTree(section.blocks, sourceId);
      section.blocks = insertBlockInTree(newBlocks, targetId, targetIndex, found.block, targetColumn);
      
      sections[sectionIndex] = section;
      scene.sections = sections;
      scenes[activeSceneIndex] = scene;
      
      return { ...prev, scenes };
    });
  }, [activeSceneIndex]);

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, blockId: string) => {
    e.stopPropagation();
    e.dataTransfer.effectAllowed = 'move';
    setDraggedBlockId(blockId);
  };

  const handleDragOver = (e: React.DragEvent, sectionIndex: number, blockIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex({ sectionIndex, blockIndex });
  };

  const handleDrop = (e: React.DragEvent, sectionIndex: number, targetIndex: number, parentId: string | null = null, column?: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedBlockId) {
      moveBlock(sectionIndex, draggedBlockId, parentId, targetIndex, column);
    } else {
      const blockType = e.dataTransfer.getData('blockType') as LessonBlockType;
      if (blockType) {
        addBlockToSection(sectionIndex, blockType, targetIndex, parentId, column);
      }
    }
    setDraggedBlockId(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedBlockId(null);
    setDragOverIndex(null);
  };

  const handlePaletteDrop = (e: React.DragEvent, sectionIndex: number, index: number, parentId: string | null = null, column?: number) => {
    e.preventDefault();
    e.stopPropagation();
    const blockType = e.dataTransfer.getData('blockType') as LessonBlockType;
    if (blockType) {
      addBlockToSection(sectionIndex, blockType, index, parentId, column);
    }
    setDragOverIndex(null);
  };

  const getSelectedBlock = () => {
    for (const section of activeScene.sections) {
      if (selectedBlockId) {
        const found = findBlock(section.blocks, selectedBlockId);
        if (found) return { block: found.block, sectionIndex: activeScene.sections.indexOf(section) };
      }
    }
    return null;
  };
  
  const selectedBlockInfo = getSelectedBlock();

  // Handle save
  const handleSave = async () => {
    await onSave?.(lesson);
  };

  // Handle preview
  const handlePreview = () => {
    onPreview?.(lesson);
  };

  const renderBlock = (sectionIndex: number, block: LessonBlock, index: number, parentId: string | null = null, depth: number = 0) => {
    return (
      <div
        key={block.id}
        draggable
        onDragStart={(e) => handleDragStart(e, block.id)}
        onDragOver={(e) => handleDragOver(e, sectionIndex, index)}
        onDrop={(e) => handleDrop(e, sectionIndex, index, parentId, block.props.columnIndex)}
        onDragEnd={handleDragEnd}
        onClick={(e) => { e.stopPropagation(); setSelectedBlockId(block.id); }}
        className={cn(
          'group/block relative transition-all duration-200 animate-fadeIn',
          depth === 0 ? 'rounded-2xl' : 'rounded-xl',
          selectedBlockId === block.id
            ? 'ring-2 ring-blue-500 ring-offset-4 dark:ring-offset-gray-900 shadow-lg'
            : 'hover:ring-2 hover:ring-blue-300 dark:hover:ring-blue-700 hover:shadow-md',
          dragOverIndex?.sectionIndex === sectionIndex && dragOverIndex?.blockIndex === index && draggedBlockId !== block.id && 'border-t-2 border-blue-500',
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
              duplicateBlock(sectionIndex, block.id);
            }}
            className="p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            title="Duplicate"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteBlock(sectionIndex, block.id);
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
            onPropChange={(blockId, props) => updateBlockProps(sectionIndex, blockId, props)}
            selected={selectedBlockId === block.id}
            isSelected={selectedBlockId === block.id}
            onSelect={() => setSelectedBlockId(block.id)}
            onUpdate={(props) => updateBlockProps(sectionIndex, block.id, props)}
            onDelete={() => deleteBlock(sectionIndex, block.id)}
            onDuplicate={() => duplicateBlock(sectionIndex, block.id)}
            renderChildBlock={(pId, childIndex, column) => {
              const childBlocks = block.children?.filter(c => c.props.columnIndex === column) || [];
              return (
                <div
                  className="flex flex-col gap-2 min-h-[50px] flex-1 w-full"
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  onDrop={(e) => { e.stopPropagation(); handlePaletteDrop(e, sectionIndex, childBlocks.length, pId, column); }}
                >
                  {childBlocks.map((child, i) => renderBlock(sectionIndex, child, i, pId, depth + 1))}
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

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-950 via-gray-950 to-pink-950">
      {/* Sidebar: Block Palette or Scenes */}
      <div className="w-72 border-r border-purple-500/20 bg-black/20 backdrop-blur-xl flex flex-col">
        {/* Sidebar Tabs */}
        <div className="flex border-b border-purple-500/20 bg-black/40">
          <button
            onClick={() => setSidebarTab('scenes')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition-all duration-200',
              sidebarTab === 'scenes'
                ? 'text-purple-400 border-b-2 border-purple-500 bg-purple-900/20'
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
            )}
          >
            <Film className="w-4 h-4" />
            Scenes
          </button>
          <button
            onClick={() => setSidebarTab('blocks')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition-all duration-200',
              sidebarTab === 'blocks'
                ? 'text-purple-400 border-b-2 border-purple-500 bg-purple-900/20'
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
            )}
          >
            <Layers className="w-4 h-4" />
            Blocks
          </button>
        </div>

        {/* Scenes Tab Content */}
        {sidebarTab === 'scenes' && (
          <div className="flex-1 overflow-y-auto p-3 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">Scenes Map</h3>
              <button
                onClick={() => setShowTemplateMarketplace(true)}
                className="p-1.5 text-purple-300 hover:bg-purple-500/20 rounded-lg transition-colors"
                title="Template Marketplace"
              >
                <LayoutTemplate className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-2 flex-1">
              {lesson.scenes.map((scene, index) => (
                <SceneCard
                  key={scene.id}
                  scene={scene}
                  index={index}
                  isActive={index === activeSceneIndex}
                  onSelect={() => setActiveSceneIndex(index)}
                  onEdit={() => setActiveSceneIndex(index)}
                />
              ))}
              
              <button
                onClick={() => setShowSceneTemplates(true)}
                className="w-full p-3 border-2 border-dashed border-purple-500/30 rounded-xl text-purple-300 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all flex items-center justify-center gap-2 mt-4"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Add Scene</span>
              </button>
            </div>
            
            {/* Theme Selector */}
            <div className="p-4 border-t border-purple-500/20 mt-auto bg-black/20 rounded-xl mb-2">
              <label className="text-xs font-medium text-purple-300/60 mb-2 block">Theme</label>
              <select
                value={lesson.theme || 'immersive'}
                onChange={(e) => updateLesson({ theme: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-purple-900/50 border border-purple-500/30 rounded-lg text-white outline-none"
              >
                <option value="immersive">Immersive</option>
                <option value="illustrated">Illustrated</option>
                <option value="infographic">Infographic</option>
                <option value="storytelling">Storytelling</option>
              </select>
            </div>
          </div>
        )}

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
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-xs font-bold text-gray-300 hover:bg-white/10 rounded-lg"
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
                            onClick={() => addBlockToSection(0, block.type as LessonBlockType)}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:bg-purple-900/30 rounded-xl cursor-pointer group transition-all duration-200"
                          >
                            <div className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                              <BlockIcon className="w-4 h-4 text-gray-400 group-hover:text-purple-400" />
                            </div>
                            <span className="font-medium">{block.label}</span>
                            <Plus className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 text-purple-400 transition-opacity" />
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
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-purple-500/20 bg-black/20 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            {/* Scene Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveSceneIndex(Math.max(0, activeSceneIndex - 1))}
                disabled={activeSceneIndex === 0}
                className="p-2 text-purple-300 hover:bg-purple-500/20 rounded-lg disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium text-white">
                {activeSceneIndex + 1} / {lesson.scenes.length}
              </span>
              <button
                onClick={() => setActiveSceneIndex(Math.min(lesson.scenes.length - 1, activeSceneIndex + 1))}
                disabled={activeSceneIndex === lesson.scenes.length - 1}
                className="p-2 text-purple-300 hover:bg-purple-500/20 rounded-lg disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="w-px h-5 bg-purple-500/30" />

            {/* Background Toggle */}
            <button
              onClick={() => setShowBackgroundEditor(!showBackgroundEditor)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors',
                showBackgroundEditor
                  ? 'bg-purple-500/30 text-purple-200'
                  : 'text-purple-300 hover:bg-purple-500/20'
              )}
            >
              <Palette className="w-3.5 h-3.5" />
              Background
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePreview}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-purple-300 hover:bg-purple-500/20 rounded-lg"
            >
              <Eye className="w-3.5 h-3.5" />
              Preview
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-700"
            >
              <Save className="w-3.5 h-3.5" />
              Save
            </button>
          </div>
        </div>

        {/* Scene Editor */}
        <div className="flex-1 flex overflow-hidden">
          {/* Canvas */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
              {/* Scene Title */}
              <input
                type="text"
                value={activeScene.title}
                onChange={(e) => updateScene(activeSceneIndex, { title: e.target.value })}
                placeholder="Scene Title"
                className="w-full text-2xl font-bold bg-transparent border-none outline-none text-white placeholder-purple-400/50 mb-4"
              />

              {/* Scene Description */}
              <textarea
                value={activeScene.description || ''}
                onChange={(e) => updateScene(activeSceneIndex, { description: e.target.value })}
                placeholder="Scene description (optional)"
                rows={2}
                className="w-full text-sm bg-transparent border-none outline-none text-purple-200/70 placeholder-purple-400/30 resize-none mb-6"
              />

              {/* Sections */}
              {activeScene.sections.map((section, sectionIndex) => {
                const sectionBg = section.background ? getBackgroundStyle(section.background) : 'transparent';
                
                return (
                  <div 
                    key={section.id} 
                    className={cn(
                      "mb-8 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300",
                      "hover:border-purple-500/30"
                    )}
                  >
                    {/* Section Header / Toolbar */}
                    <div className="flex items-center justify-between px-4 py-3 bg-black/40 border-b border-white/5">
                      {section.title ? (
                        <h3 className="text-sm font-semibold text-white/90">{section.title}</h3>
                      ) : (
                        <h3 className="text-sm font-semibold text-white/50 italic">Section {sectionIndex + 1}</h3>
                      )}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingSectionIndex(sectionIndex);
                            setShowBackgroundEditor(true);
                          }}
                          className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-blue-400"
                          title="Section Settings"
                        >
                          <Palette className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            const newSections = [...activeScene.sections];
                            newSections.splice(sectionIndex, 1);
                            updateScene(activeSceneIndex, { sections: newSections });
                          }}
                          className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-red-400"
                          title="Delete Section"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Section Content Area with Background Preview */}
                    <div 
                      className="p-6 relative"
                      style={{ background: sectionBg }}
                    >
                      {/* Blocks Editor */}
                      <div className="space-y-4 relative z-10">
                        {section.blocks.map((block, index) => renderBlock(sectionIndex, block, index, null, 0))}

                        {/* Add block dropzone at end */}
                        <div
                          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                          onDrop={(e) => handlePaletteDrop(e, sectionIndex, section.blocks.length)}
                          className={cn(
                            "flex items-center justify-center py-6 border-2 border-dashed rounded-xl transition-all duration-200 backdrop-blur-sm",
                            section.blocks.length === 0 
                              ? "border-purple-500/50 bg-purple-500/10 min-h-[150px]" 
                              : "border-gray-500/30 hover:border-purple-500/50 mt-4 bg-black/10"
                          )}
                        >
                          {section.blocks.length === 0 ? (
                            <div className="text-center">
                              <LayoutGrid className="w-10 h-10 mx-auto mb-3 opacity-50 text-purple-400" />
                              <p className="text-sm text-purple-200">Empty Section</p>
                              <p className="text-xs mt-1 text-purple-300/60">Drag blocks from the sidebar to start building</p>
                            </div>
                          ) : (
                            <span className="text-sm font-medium text-gray-300">Drag blocks here or click Add Block</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Add Section Button */}
              <button
                onClick={() => {
                  const newSection: SceneSection = {
                    id: `section_${Date.now()}`,
                    blocks: [],
                  };
                  updateScene(activeSceneIndex, {
                    sections: [...activeScene.sections, newSection],
                  });
                }}
                className="w-full p-4 border-2 border-dashed border-purple-500/30 rounded-xl text-purple-300 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Add Section</span>
              </button>
            </div>
          </div>

          {/* Background Editor Panel */}
          {showBackgroundEditor && (
            <div className="w-72 border-l border-purple-500/20 bg-black/30 backdrop-blur-xl flex flex-col relative z-20 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-purple-500/20 flex items-center justify-between bg-black/40">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-purple-400">
                  {editingSectionIndex !== null ? `Section ${editingSectionIndex + 1} Background` : 'Scene Background'}
                </h3>
                <button
                  onClick={() => {
                    setShowBackgroundEditor(false);
                    setEditingSectionIndex(null);
                  }}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <BackgroundEditor
                  background={editingSectionIndex !== null 
                    ? (activeScene.sections[editingSectionIndex].background || { type: 'solid', color: 'transparent' }) 
                    : activeScene.background}
                  onChange={(bg) => {
                    if (editingSectionIndex !== null) {
                      const newSections = [...activeScene.sections];
                      newSections[editingSectionIndex] = {
                        ...newSections[editingSectionIndex],
                        background: bg
                      };
                      updateScene(activeSceneIndex, { sections: newSections });
                    } else {
                      updateScene(activeSceneIndex, { background: bg });
                    }
                  }}
                />
                
                {/* Section Layout Options (only show when editing a section) */}
                {editingSectionIndex !== null && (
                  <div className="p-4 border-t border-purple-500/20">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Layout Settings</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-medium text-gray-300 mb-1.5 block">Max Width</label>
                        <select
                          className="w-full bg-black/40 border border-purple-500/30 rounded-lg text-sm text-white px-3 py-2 outline-none"
                          value={activeScene.sections[editingSectionIndex].layoutConfig?.maxWidth || 'lg'}
                          onChange={(e) => {
                            const newSections = [...activeScene.sections];
                            const section = newSections[editingSectionIndex];
                            newSections[editingSectionIndex] = {
                              ...section,
                              layoutConfig: {
                                ...(section.layoutConfig || {}),
                                maxWidth: e.target.value as any
                              }
                            };
                            updateScene(activeSceneIndex, { sections: newSections });
                          }}
                        >
                          <option value="sm">Small (Content focused)</option>
                          <option value="md">Medium (Article standard)</option>
                          <option value="lg">Large (Default)</option>
                          <option value="xl">Extra Large</option>
                          <option value="full">Full Width</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="text-xs font-medium text-gray-300 mb-1.5 block">Internal Grid Layout</label>
                        <select
                          className="w-full bg-black/40 border border-purple-500/30 rounded-lg text-sm text-white px-3 py-2 outline-none"
                          value={activeScene.sections[editingSectionIndex].layout || 'single'}
                          onChange={(e) => {
                            const newSections = [...activeScene.sections];
                            newSections[editingSectionIndex] = {
                              ...newSections[editingSectionIndex],
                              layout: e.target.value as any
                            };
                            updateScene(activeSceneIndex, { sections: newSections });
                          }}
                        >
                          <option value="single">Single Column</option>
                          <option value="two-column">Two Columns (50/50)</option>
                          <option value="three-column">Three Columns</option>
                          <option value="grid">Responsive Grid</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Settings Panel */}
          {selectedBlockInfo && (
            <div className="w-80 border-l border-purple-500/20 bg-black/30 backdrop-blur-xl flex flex-col shadow-sm">
              <div className="p-4 border-b border-purple-500/20 flex items-center justify-between bg-black/40">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-purple-400">
                  {LESSON_BLOCK_DEFINITIONS[selectedBlockInfo.block.type].label} Settings
                </h3>
                <button
                  onClick={() => setSelectedBlockId(null)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <LessonBlockSettings
                  block={selectedBlockInfo.block}
                  onChange={(props) => updateBlockProps(selectedBlockInfo.sectionIndex, selectedBlockInfo.block.id, props)}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scene Templates Modal */}
      {showSceneTemplates && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-2xl border border-purple-500/30 shadow-2xl max-w-3xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-purple-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Wand2 className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-bold text-white">Choose Scene Template</h3>
                </div>
                <button
                  onClick={() => setShowSceneTemplates(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-3 gap-4">
                {SCENE_TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => addSceneFromTemplate(template)}
                    className="text-left p-4 bg-gray-800/50 border border-purple-500/20 rounded-xl hover:border-purple-500/50 hover:bg-purple-500/10 transition-all"
                  >
                    <div
                      className="h-20 rounded-lg mb-3"
                      style={{ background: getBackgroundStyle(template.defaultBackground) }}
                    />
                    <h4 className="text-sm font-bold text-white">{template.name}</h4>
                    <p className="text-xs text-gray-400 mt-1">{template.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template Marketplace Modal */}
      {showTemplateMarketplace && (
        <div className="fixed inset-0 z-50 bg-black">
          <button
            onClick={() => setShowTemplateMarketplace(false)}
            className="absolute top-4 right-4 z-10 p-2 bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
          <TemplateDiscovery
            onSelectTemplate={useTemplate}
            onClose={() => setShowTemplateMarketplace(false)}
          />
        </div>
      )}
    </div>
  );
};

export default InteractiveLessonEditor;

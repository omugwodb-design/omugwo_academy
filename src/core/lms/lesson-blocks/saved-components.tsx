// Content Reusability System - Saved Components Library
// Allows users to save, organize, and reuse lesson blocks

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cn } from '../../../lib/utils';
import { LessonBlock, LessonBlockType, LessonBlockDefinition } from './types';
import { LESSON_BLOCK_DEFINITIONS, createBlock } from './registry';
import {
  Folder,
  FolderPlus,
  Star,
  StarOff,
  Trash2,
  Copy,
  Search,
  MoreVertical,
  Edit2,
  Check,
  X,
  Grid,
  List,
  Clock,
  Filter,
  SortAsc,
  SortDesc,
  Bookmark,
  Plus,
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

export interface SavedComponent {
  id: string;
  name: string;
  description?: string;
  block: LessonBlock;
  folderId?: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
}

export interface ComponentFolder {
  id: string;
  name: string;
  color?: string;
  parentId?: string;
  createdAt: Date;
}

export interface ComponentTemplate {
  id: string;
  name: string;
  description?: string;
  category: LessonBlockType;
  thumbnail?: string;
  blocks: LessonBlock[];
  isOfficial?: boolean;
}

// ============================================
// SAVED COMPONENTS STORE
// ============================================

interface SavedComponentsStore {
  components: Record<string, SavedComponent>;
  folders: Record<string, ComponentFolder>;
  templates: Record<string, ComponentTemplate>;
  recentComponents: string[]; // IDs of recently used components

  // Component actions
  saveComponent: (name: string, block: LessonBlock, folderId?: string, tags?: string[]) => string;
  updateComponent: (id: string, updates: Partial<SavedComponent>) => void;
  deleteComponent: (id: string) => void;
  duplicateComponent: (id: string) => string | null;
  toggleFavorite: (id: string) => void;
  incrementUsage: (id: string) => void;

  // Folder actions
  createFolder: (name: string, color?: string, parentId?: string) => string;
  updateFolder: (id: string, updates: Partial<ComponentFolder>) => void;
  deleteFolder: (id: string, deleteComponents?: boolean) => void;
  moveComponentToFolder: (componentId: string, folderId: string | undefined) => void;

  // Template actions
  saveAsTemplate: (name: string, blocks: LessonBlock[], description?: string) => string;
  deleteTemplate: (id: string) => void;

  // Query actions
  getComponentsByFolder: (folderId?: string) => SavedComponent[];
  getFavoriteComponents: () => SavedComponent[];
  getRecentComponents: (limit?: number) => SavedComponent[];
  searchComponents: (query: string) => SavedComponent[];
}

export const useSavedComponentsStore = create<SavedComponentsStore>()(
  persist(
    (set, get) => ({
      components: {},
      folders: {},
      templates: {},
      recentComponents: [],

      saveComponent: (name, block, folderId, tags = []) => {
        const id = `saved_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const now = new Date();

        set((state) => ({
          components: {
            ...state.components,
            [id]: {
              id,
              name,
              block,
              folderId,
              tags,
              isFavorite: false,
              createdAt: now,
              updatedAt: now,
              usageCount: 0,
            },
          },
        }));

        return id;
      },

      updateComponent: (id, updates) => {
        set((state) => {
          if (!state.components[id]) return state;

          return {
            components: {
              ...state.components,
              [id]: {
                ...state.components[id],
                ...updates,
                updatedAt: new Date(),
              },
            },
          };
        });
      },

      deleteComponent: (id) => {
        set((state) => {
          const { [id]: _, ...rest } = state.components;
          return {
            components: rest,
            recentComponents: state.recentComponents.filter((cId) => cId !== id),
          };
        });
      },

      duplicateComponent: (id) => {
        const component = get().components[id];
        if (!component) return null;

        const newId = get().saveComponent(
          `${component.name} (Copy)`,
          component.block,
          component.folderId,
          component.tags
        );

        return newId;
      },

      toggleFavorite: (id) => {
        set((state) => {
          if (!state.components[id]) return state;

          return {
            components: {
              ...state.components,
              [id]: {
                ...state.components[id],
                isFavorite: !state.components[id].isFavorite,
                updatedAt: new Date(),
              },
            },
          };
        });
      },

      incrementUsage: (id) => {
        set((state) => {
          if (!state.components[id]) return state;

          const newRecent = [
            id,
            ...state.recentComponents.filter((cId) => cId !== id),
          ].slice(0, 20);

          return {
            components: {
              ...state.components,
              [id]: {
                ...state.components[id],
                usageCount: state.components[id].usageCount + 1,
              },
            },
            recentComponents: newRecent,
          };
        });
      },

      createFolder: (name, color, parentId) => {
        const id = `folder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        set((state) => ({
          folders: {
            ...state.folders,
            [id]: {
              id,
              name,
              color,
              parentId,
              createdAt: new Date(),
            },
          },
        }));

        return id;
      },

      updateFolder: (id, updates) => {
        set((state) => {
          if (!state.folders[id]) return state;

          return {
            folders: {
              ...state.folders,
              [id]: {
                ...state.folders[id],
                ...updates,
              },
            },
          };
        });
      },

      deleteFolder: (id, deleteComponents = false) => {
        set((state) => {
          const { [id]: _, ...restFolders } = state.folders;

          let newComponents = state.components;
          if (deleteComponents) {
            newComponents = Object.fromEntries(
              Object.entries(state.components).filter(
                ([_, c]) => c.folderId !== id
              )
            );
          } else {
            // Move components to root
            newComponents = Object.fromEntries(
              Object.entries(state.components).map(([cId, c]) => [
                cId,
                c.folderId === id ? { ...c, folderId: undefined } : c,
              ])
            );
          }

          return {
            folders: restFolders,
            components: newComponents,
          };
        });
      },

      moveComponentToFolder: (componentId, folderId) => {
        set((state) => {
          if (!state.components[componentId]) return state;

          return {
            components: {
              ...state.components,
              [componentId]: {
                ...state.components[componentId],
                folderId,
                updatedAt: new Date(),
              },
            },
          };
        });
      },

      saveAsTemplate: (name, blocks, description) => {
        const id = `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        set((state) => ({
          templates: {
            ...state.templates,
            [id]: {
              id,
              name,
              description,
              category: blocks[0]?.type || 'text',
              blocks,
              isOfficial: false,
            },
          },
        }));

        return id;
      },

      deleteTemplate: (id) => {
        set((state) => {
          const { [id]: _, ...rest } = state.templates;
          return { templates: rest };
        });
      },

      getComponentsByFolder: (folderId) => {
        return Object.values(get().components).filter(
          (c) => c.folderId === folderId
        );
      },

      getFavoriteComponents: () => {
        return Object.values(get().components).filter((c) => c.isFavorite);
      },

      getRecentComponents: (limit = 10) => {
        const { components, recentComponents } = get();
        return recentComponents
          .slice(0, limit)
          .map((id) => components[id])
          .filter(Boolean);
      },

      searchComponents: (query) => {
        const lowerQuery = query.toLowerCase();
        return Object.values(get().components).filter(
          (c) =>
            c.name.toLowerCase().includes(lowerQuery) ||
            c.description?.toLowerCase().includes(lowerQuery) ||
            c.tags.some((t) => t.toLowerCase().includes(lowerQuery))
        );
      },
    }),
    {
      name: 'saved-components-storage',
      partialize: (state) => ({
        components: state.components,
        folders: state.folders,
        templates: state.templates,
        recentComponents: state.recentComponents,
      }),
    }
  )
);

// ============================================
// SAVED COMPONENTS LIBRARY UI
// ============================================

interface SavedComponentsLibraryProps {
  onSelectComponent: (block: LessonBlock) => void;
  onClose?: () => void;
  showTemplates?: boolean;
}

export const SavedComponentsLibrary: React.FC<SavedComponentsLibraryProps> = ({
  onSelectComponent,
  onClose,
  showTemplates = true,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | undefined>();
  const [showFavorites, setShowFavorites] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'usage'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolder, setShowNewFolder] = useState(false);

  const {
    components,
    folders,
    templates,
    deleteComponent,
    duplicateComponent,
    toggleFavorite,
    incrementUsage,
    createFolder,
    deleteFolder,
  } = useSavedComponentsStore();

  // Filter and sort components
  const filteredComponents = useMemo(() => {
    let result = Object.values(components);

    // Apply search filter
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(lowerQuery) ||
          c.description?.toLowerCase().includes(lowerQuery) ||
          c.tags.some((t) => t.toLowerCase().includes(lowerQuery))
      );
    }

    // Apply folder filter
    if (showFavorites) {
      result = result.filter((c) => c.isFavorite);
    } else if (selectedFolder !== undefined) {
      result = result.filter((c) => c.folderId === selectedFolder);
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case 'usage':
          comparison = a.usageCount - b.usageCount;
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [components, searchQuery, selectedFolder, showFavorites, sortBy, sortOrder]);

  const handleSelectComponent = useCallback(
    (component: SavedComponent) => {
      incrementUsage(component.id);
      onSelectComponent(component.block);
    },
    [incrementUsage, onSelectComponent]
  );

  const handleCreateFolder = useCallback(() => {
    if (newFolderName.trim()) {
      createFolder(newFolderName.trim());
      setNewFolderName('');
      setShowNewFolder(false);
    }
  }, [newFolderName, createFolder]);

  return (
    <div className="flex h-full bg-white dark:bg-gray-900 rounded-xl overflow-hidden">
      {/* Sidebar - Folders */}
      <div className="w-56 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
            Library
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {/* All Components */}
          <button
            onClick={() => {
              setSelectedFolder(undefined);
              setShowFavorites(false);
            }}
            className={cn(
              'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors',
              !selectedFolder && !showFavorites
                ? 'bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
            )}
          >
            <Grid className="w-4 h-4" />
            <span>All Components</span>
            <span className="ml-auto text-xs text-gray-400">
              {Object.keys(components).length}
            </span>
          </button>

          {/* Favorites */}
          <button
            onClick={() => {
              setShowFavorites(true);
              setSelectedFolder(undefined);
            }}
            className={cn(
              'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors',
              showFavorites
                ? 'bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
            )}
          >
            <Star className="w-4 h-4" />
            <span>Favorites</span>
            <span className="ml-auto text-xs text-gray-400">
              {Object.values(components).filter((c) => c.isFavorite).length}
            </span>
          </button>

          {/* Folders */}
          <div className="mt-4">
            <div className="flex items-center justify-between px-3 py-1">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Folders
              </span>
              <button
                onClick={() => setShowNewFolder(true)}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"
              >
                <FolderPlus className="w-3.5 h-3.5" />
              </button>
            </div>

            {showNewFolder && (
              <div className="px-2 py-1">
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreateFolder();
                    if (e.key === 'Escape') setShowNewFolder(false);
                  }}
                  placeholder="Folder name"
                  className="w-full px-2 py-1 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded focus:ring-1 focus:ring-primary-500 outline-none"
                  autoFocus
                />
              </div>
            )}

            {Object.values(folders).map((folder) => (
              <button
                key={folder.id}
                onClick={() => {
                  setSelectedFolder(folder.id);
                  setShowFavorites(false);
                }}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors group',
                  selectedFolder === folder.id
                    ? 'bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                )}
              >
                <Folder
                  className="w-4 h-4"
                  style={{ color: folder.color }}
                />
                <span className="truncate flex-1">{folder.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Delete this folder?')) {
                      deleteFolder(folder.id);
                      if (selectedFolder === folder.id) {
                        setSelectedFolder(undefined);
                      }
                    }
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search components..."
                className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-1.5 rounded',
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-gray-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                )}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-1.5 rounded',
                  viewMode === 'list'
                    ? 'bg-white dark:bg-gray-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Sort */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [by, order] = e.target.value.split('-') as ['name' | 'date' | 'usage', 'asc' | 'desc'];
                setSortBy(by);
                setSortOrder(order);
              }}
              className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="usage-desc">Most Used</option>
              <option value="usage-asc">Least Used</option>
            </select>
          </div>
        </div>

        {/* Components Grid/List */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredComponents.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Bookmark className="w-12 h-12 mb-3" />
              <p className="text-sm">No saved components</p>
              <p className="text-xs mt-1">Save blocks to reuse them later</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredComponents.map((component) => (
                <ComponentCard
                  key={component.id}
                  component={component}
                  onSelect={() => handleSelectComponent(component)}
                  onToggleFavorite={() => toggleFavorite(component.id)}
                  onDuplicate={() => duplicateComponent(component.id)}
                  onDelete={() => deleteComponent(component.id)}
                  isEditing={editingId === component.id}
                  onStartEdit={() => setEditingId(component.id)}
                  onStopEdit={() => setEditingId(null)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredComponents.map((component) => (
                <ComponentListItem
                  key={component.id}
                  component={component}
                  onSelect={() => handleSelectComponent(component)}
                  onToggleFavorite={() => toggleFavorite(component.id)}
                  onDuplicate={() => duplicateComponent(component.id)}
                  onDelete={() => deleteComponent(component.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// COMPONENT CARD (Grid View)
// ============================================

interface ComponentCardProps {
  component: SavedComponent;
  onSelect: () => void;
  onToggleFavorite: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  isEditing: boolean;
  onStartEdit: () => void;
  onStopEdit: () => void;
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  component,
  onSelect,
  onToggleFavorite,
  onDuplicate,
  onDelete,
  isEditing,
  onStartEdit,
  onStopEdit,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const definition = LESSON_BLOCK_DEFINITIONS[component.block.type];

  return (
    <div
      className="group relative bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-200 cursor-pointer"
      onClick={onSelect}
    >
      {/* Preview Area */}
      <div className="h-24 flex items-center justify-center p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="text-gray-400">
          {definition?.icon && (
            <span className="text-2xl">{definition.icon}</span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
          {component.name}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">{definition?.label}</p>
      </div>

      {/* Favorite Badge */}
      {component.isFavorite && (
        <div className="absolute top-2 right-2">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        </div>
      )}

      {/* Actions Menu */}
      <div
        className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-1.5 rounded-lg bg-white dark:bg-gray-900 shadow-md hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <MoreVertical className="w-4 h-4 text-gray-500" />
        </button>

        {showMenu && (
          <div className="absolute top-full left-0 mt-1 w-36 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
            <button
              onClick={() => {
                onToggleFavorite();
                setShowMenu(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              {component.isFavorite ? (
                <>
                  <StarOff className="w-4 h-4" />
                  Unfavorite
                </>
              ) : (
                <>
                  <Star className="w-4 h-4" />
                  Favorite
                </>
              )}
            </button>
            <button
              onClick={() => {
                onDuplicate();
                setShowMenu(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <Copy className="w-4 h-4" />
              Duplicate
            </button>
            <button
              onClick={() => {
                onDelete();
                setShowMenu(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// COMPONENT LIST ITEM (List View)
// ============================================

interface ComponentListItemProps {
  component: SavedComponent;
  onSelect: () => void;
  onToggleFavorite: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

const ComponentListItem: React.FC<ComponentListItemProps> = ({
  component,
  onSelect,
  onToggleFavorite,
  onDuplicate,
  onDelete,
}) => {
  const definition = LESSON_BLOCK_DEFINITIONS[component.block.type];

  return (
    <div
      className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 transition-colors cursor-pointer group"
      onClick={onSelect}
    >
      {/* Icon */}
      <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400">
        {definition?.icon && <span className="text-lg">{definition.icon}</span>}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
          {component.name}
        </p>
        <p className="text-xs text-gray-500">{definition?.label}</p>
      </div>

      {/* Usage Count */}
      <div className="text-xs text-gray-400">
        Used {component.usageCount}x
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Star
            className={cn(
              'w-4 h-4',
              component.isFavorite
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-400'
            )}
          />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
          }}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400"
        >
          <Copy className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-gray-400 hover:text-red-500"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ============================================
// SAVE COMPONENT MODAL
// ============================================

interface SaveComponentModalProps {
  block: LessonBlock;
  onSave: (name: string, folderId?: string, tags?: string[]) => void;
  onClose: () => void;
}

export const SaveComponentModal: React.FC<SaveComponentModalProps> = ({
  block,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | undefined>();
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const { folders } = useSavedComponentsStore();
  const definition = LESSON_BLOCK_DEFINITIONS[block.type];

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim(), selectedFolder, tags);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Save Component
        </h2>

        {/* Preview */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl mb-4">
          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400">
            {definition?.icon && <span className="text-lg">{definition.icon}</span>}
          </div>
          <div>
            <p className="font-medium text-sm text-gray-900 dark:text-white">
              {definition?.label}
            </p>
            <p className="text-xs text-gray-500">Save this block for reuse</p>
          </div>
        </div>

        {/* Name Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter component name"
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
            autoFocus
          />
        </div>

        {/* Folder Select */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Folder
          </label>
          <select
            value={selectedFolder || ''}
            onChange={(e) => setSelectedFolder(e.target.value || undefined)}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
          >
            <option value="">No folder</option>
            {Object.values(folders).map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tags
          </label>
          <div className="flex flex-wrap gap-1 mb-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-xs"
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-primary-900 dark:hover:text-primary-100"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              placeholder="Add tag"
              className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
            />
            <button
              onClick={handleAddTag}
              className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              Add
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-lg',
              name.trim()
                ? 'bg-primary-500 text-white hover:bg-primary-600'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
            )}
          >
            Save Component
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavedComponentsLibrary;

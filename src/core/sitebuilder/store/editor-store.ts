// Enhanced Editor Store with Zustand
// Central state management for the site builder

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Block, Template, GlobalStyles, BlockType } from '../types';
import { EditorHistoryManager, getHistoryManager, HistorySnapshot, HistoryBranch } from './editor-history';

// Default global styles
const DEFAULT_GLOBAL_STYLES: GlobalStyles = {
  primaryColor: '#7c3aed',
  secondaryColor: '#ec4899',
  accentColor: '#f59e0b',
  backgroundColor: '#ffffff',
  textColor: '#111827',
  fontFamily: 'Inter, sans-serif',
  headingFont: 'Inter, sans-serif',
  borderRadius: 'lg',
  buttonStyle: 'rounded',
};

// Favorite/recent block tracking
interface BlockUsage {
  type: BlockType;
  lastUsed: number;
  useCount: number;
}

// Editor state interface
interface EditorState {
  // Page state
  currentPageId: string | null;
  blocks: Block[];
  selectedBlockIds: string[];
  hoveredBlockId: string | null;

  // Global styles
  globalStyles: GlobalStyles;

  // History
  historyManager: EditorHistoryManager;
  isUndoable: boolean;
  isRedoable: boolean;

  // UI State
  zoom: number;
  showGrid: boolean;
  showOutlines: boolean;
  devicePreview: 'desktop' | 'tablet' | 'mobile';
  sidebarTab: 'blocks' | 'templates' | 'layers' | 'assets' | 'settings';
  isPreviewMode: boolean;

  // Clipboard
  clipboard: Block[];

  // Search
  searchQuery: string;
  searchResults: { type: BlockType; score: number }[];

  // Favorites & Recent
  favoriteBlocks: BlockType[];
  recentBlocks: BlockUsage[];

  // Drag state
  draggedBlockId: string | null;
  draggedBlockType: BlockType | null;
  dragOverIndex: number | null;

  // Actions
  setPage: (pageId: string, blocks: Block[]) => void;
  setBlocks: (blocks: Block[]) => void;
  addBlock: (block: Block, index?: number) => void;
  updateBlock: (blockId: string, props: Partial<Block['props']>) => void;
  deleteBlock: (blockId: string) => void;
  duplicateBlock: (blockId: string) => void;
  moveBlock: (fromIndex: number, toIndex: number) => void;
  reorderBlocks: (blocks: Block[]) => void;

  // Selection
  selectBlock: (blockId: string | null, multi?: boolean) => void;
  selectBlocks: (blockIds: string[]) => void;
  clearSelection: () => void;
  setHoveredBlock: (blockId: string | null) => void;

  // Global styles
  setGlobalStyles: (styles: Partial<GlobalStyles>) => void;
  resetGlobalStyles: () => void;

  // History
  undo: () => void;
  redo: () => void;
  createCheckpoint: (label: string) => void;
  jumpToSnapshot: (snapshotId: string) => void;
  createBranch: (name: string) => void;
  switchBranch: (branchId: string) => void;
  getHistoryState: () => { snapshots: HistorySnapshot[]; branches: HistoryBranch[]; currentSnapshotId: string | null };

  // UI
  setZoom: (zoom: number) => void;
  toggleGrid: () => void;
  toggleOutlines: () => void;
  setDevicePreview: (device: 'desktop' | 'tablet' | 'mobile') => void;
  setSidebarTab: (tab: EditorState['sidebarTab']) => void;
  togglePreviewMode: () => void;

  // Clipboard
  copyBlocks: (blockIds: string[]) => void;
  cutBlocks: (blockIds: string[]) => void;
  pasteBlocks: (index?: number) => void;

  // Search
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;

  // Favorites & Recent
  toggleFavorite: (blockType: BlockType) => void;
  trackBlockUsage: (blockType: BlockType) => void;
  getRecentBlocks: (limit?: number) => BlockType[];

  // Drag
  setDraggedBlock: (blockId: string | null) => void;
  setDraggedBlockType: (type: BlockType | null) => void;
  setDragOverIndex: (index: number | null) => void;

  // Template
  applyTemplate: (template: Template) => void;

  // Persistence
  exportState: () => string;
  importState: (stateJson: string) => void;
}

// Generate unique block ID
const generateBlockId = () => `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Create the store
export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentPageId: null,
      blocks: [],
      selectedBlockIds: [],
      hoveredBlockId: null,
      globalStyles: DEFAULT_GLOBAL_STYLES,
      historyManager: getHistoryManager(),
      isUndoable: false,
      isRedoable: false,
      zoom: 100,
      showGrid: false,
      showOutlines: true,
      devicePreview: 'desktop',
      sidebarTab: 'blocks',
      isPreviewMode: false,
      clipboard: [],
      searchQuery: '',
      searchResults: [],
      favoriteBlocks: [],
      recentBlocks: [],
      draggedBlockId: null,
      draggedBlockType: null,
      dragOverIndex: null,

      // Page actions
      setPage: (pageId, blocks) => {
        const { historyManager } = get();
        historyManager.clear();
        historyManager.push(blocks, { label: 'Initial State', isCheckpoint: true });
        set({
          currentPageId: pageId,
          blocks,
          selectedBlockIds: [],
          isUndoable: false,
          isRedoable: false,
        });
      },

      setBlocks: (blocks) => {
        const { historyManager } = get();
        historyManager.push(blocks, { globalStyles: get().globalStyles });
        set({
          blocks,
          isUndoable: historyManager.canUndo(),
          isRedoable: historyManager.canRedo(),
        });
      },

      addBlock: (block, index) => {
        const { blocks, historyManager, trackBlockUsage } = get();
        const insertIndex = index !== undefined ? index : blocks.length;
        const newBlocks = [...blocks];
        newBlocks.splice(insertIndex, 0, block);
        
        historyManager.push(newBlocks, {
          metadata: { action: 'Added block', blockType: block.type },
          globalStyles: get().globalStyles,
        });
        
        trackBlockUsage(block.type);
        
        set({
          blocks: newBlocks,
          selectedBlockIds: [block.id],
          isUndoable: historyManager.canUndo(),
          isRedoable: historyManager.canRedo(),
        });
      },

      updateBlock: (blockId, props) => {
        const { blocks, historyManager, selectedBlockIds } = get();
        const newBlocks = blocks.map(block =>
          block.id === blockId
            ? { ...block, props: { ...block.props, ...props } }
            : block
        );
        
        historyManager.push(newBlocks, {
          metadata: { action: 'Updated block', blockId },
          globalStyles: get().globalStyles,
        });
        
        set({
          blocks: newBlocks,
          isUndoable: historyManager.canUndo(),
          isRedoable: historyManager.canRedo(),
        });
      },

      deleteBlock: (blockId) => {
        const { blocks, historyManager, selectedBlockIds } = get();
        const newBlocks = blocks.filter(block => block.id !== blockId);
        
        historyManager.push(newBlocks, {
          metadata: { action: 'Deleted block', blockId },
          globalStyles: get().globalStyles,
        });
        
        set({
          blocks: newBlocks,
          selectedBlockIds: selectedBlockIds.filter(id => id !== blockId),
          isUndoable: historyManager.canUndo(),
          isRedoable: historyManager.canRedo(),
        });
      },

      duplicateBlock: (blockId) => {
        const { blocks, historyManager } = get();
        const blockIndex = blocks.findIndex(b => b.id === blockId);
        if (blockIndex === -1) return;
        
        const block = blocks[blockIndex];
        const newBlock: Block = {
          ...block,
          id: generateBlockId(),
          props: { ...block.props },
        };
        
        const newBlocks = [...blocks];
        newBlocks.splice(blockIndex + 1, 0, newBlock);
        
        historyManager.push(newBlocks, {
          metadata: { action: 'Duplicated block', blockId },
          globalStyles: get().globalStyles,
        });
        
        set({
          blocks: newBlocks,
          selectedBlockIds: [newBlock.id],
          isUndoable: historyManager.canUndo(),
          isRedoable: historyManager.canRedo(),
        });
      },

      moveBlock: (fromIndex, toIndex) => {
        const { blocks, historyManager } = get();
        const newBlocks = [...blocks];
        const [removed] = newBlocks.splice(fromIndex, 1);
        newBlocks.splice(toIndex, 0, removed);
        
        historyManager.push(newBlocks, {
          metadata: { action: 'Moved block' },
          globalStyles: get().globalStyles,
        });
        
        set({
          blocks: newBlocks,
          isUndoable: historyManager.canUndo(),
          isRedoable: historyManager.canRedo(),
        });
      },

      reorderBlocks: (blocks) => {
        const { historyManager } = get();
        historyManager.push(blocks, {
          metadata: { action: 'Reordered blocks' },
          globalStyles: get().globalStyles,
        });
        
        set({
          blocks,
          isUndoable: historyManager.canUndo(),
          isRedoable: historyManager.canRedo(),
        });
      },

      // Selection
      selectBlock: (blockId, multi = false) => {
        const { selectedBlockIds } = get();
        if (blockId === null) {
          set({ selectedBlockIds: [] });
          return;
        }
        
        if (multi) {
          const isSelected = selectedBlockIds.includes(blockId);
          set({
            selectedBlockIds: isSelected
              ? selectedBlockIds.filter(id => id !== blockId)
              : [...selectedBlockIds, blockId],
          });
        } else {
          set({ selectedBlockIds: [blockId] });
        }
      },

      selectBlocks: (blockIds) => set({ selectedBlockIds: blockIds }),

      clearSelection: () => set({ selectedBlockIds: [] }),

      setHoveredBlock: (blockId) => set({ hoveredBlockId: blockId }),

      // Global styles
      setGlobalStyles: (styles) => {
        const { globalStyles, blocks, historyManager } = get();
        const newStyles = { ...globalStyles, ...styles };
        
        historyManager.push(blocks, {
          label: 'Style Update',
          globalStyles: newStyles,
        });
        
        set({
          globalStyles: newStyles,
          isUndoable: historyManager.canUndo(),
          isRedoable: historyManager.canRedo(),
        });
      },

      resetGlobalStyles: () => {
        const { blocks, historyManager } = get();
        historyManager.push(blocks, {
          label: 'Reset Styles',
          globalStyles: DEFAULT_GLOBAL_STYLES,
        });
        
        set({
          globalStyles: DEFAULT_GLOBAL_STYLES,
          isUndoable: historyManager.canUndo(),
          isRedoable: historyManager.canRedo(),
        });
      },

      // History
      undo: () => {
        const { historyManager } = get();
        const blocks = historyManager.undo();
        if (blocks) {
          set({
            blocks,
            isUndoable: historyManager.canUndo(),
            isRedoable: historyManager.canRedo(),
          });
        }
      },

      redo: () => {
        const { historyManager } = get();
        const blocks = historyManager.redo();
        if (blocks) {
          set({
            blocks,
            isUndoable: historyManager.canUndo(),
            isRedoable: historyManager.canRedo(),
          });
        }
      },

      createCheckpoint: (label) => {
        const { blocks, globalStyles, historyManager } = get();
        historyManager.createCheckpoint(blocks, label, globalStyles);
        set({
          isUndoable: historyManager.canUndo(),
          isRedoable: historyManager.canRedo(),
        });
      },

      jumpToSnapshot: (snapshotId) => {
        const { historyManager } = get();
        const blocks = historyManager.jumpTo(snapshotId);
        if (blocks) {
          set({
            blocks,
            isUndoable: historyManager.canUndo(),
            isRedoable: historyManager.canRedo(),
          });
        }
      },

      createBranch: (name) => {
        const { historyManager } = get();
        historyManager.createBranch(name);
        set({
          isUndoable: historyManager.canUndo(),
          isRedoable: historyManager.canRedo(),
        });
      },

      switchBranch: (branchId) => {
        const { historyManager } = get();
        historyManager.switchBranch(branchId);
        const state = historyManager.getCurrentState();
        if (state) {
          set({
            blocks: state.blocks,
            globalStyles: state.globalStyles || DEFAULT_GLOBAL_STYLES,
            isUndoable: historyManager.canUndo(),
            isRedoable: historyManager.canRedo(),
          });
        }
      },

      getHistoryState: () => {
        const { historyManager } = get();
        return {
          snapshots: historyManager.getBranchHistory(),
          branches: historyManager.getBranches(),
          currentSnapshotId: historyManager.getCurrentBranch()?.snapshots.slice(-1)[0] || null,
        };
      },

      // UI
      setZoom: (zoom) => set({ zoom: Math.max(25, Math.min(200, zoom)) }),
      toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
      toggleOutlines: () => set((state) => ({ showOutlines: !state.showOutlines })),
      setDevicePreview: (device) => set({ devicePreview: device }),
      setSidebarTab: (tab) => set({ sidebarTab: tab }),
      togglePreviewMode: () => set((state) => ({ isPreviewMode: !state.isPreviewMode })),

      // Clipboard
      copyBlocks: (blockIds) => {
        const { blocks } = get();
        const copied = blocks.filter(b => blockIds.includes(b.id));
        set({ clipboard: JSON.parse(JSON.stringify(copied)) });
      },

      cutBlocks: (blockIds) => {
        const { blocks, historyManager } = get();
        const copied = blocks.filter(b => blockIds.includes(b.id));
        const newBlocks = blocks.filter(b => !blockIds.includes(b.id));
        
        historyManager.push(newBlocks, {
          metadata: { action: 'Cut blocks' },
          globalStyles: get().globalStyles,
        });
        
        set({
          blocks: newBlocks,
          clipboard: JSON.parse(JSON.stringify(copied)),
          selectedBlockIds: [],
          isUndoable: historyManager.canUndo(),
          isRedoable: historyManager.canRedo(),
        });
      },

      pasteBlocks: (index) => {
        const { blocks, clipboard, historyManager } = get();
        if (clipboard.length === 0) return;
        
        const insertIndex = index !== undefined ? index : blocks.length;
        const pastedBlocks = clipboard.map(b => ({
          ...b,
          id: generateBlockId(),
        }));
        
        const newBlocks = [...blocks];
        newBlocks.splice(insertIndex, 0, ...pastedBlocks);
        
        historyManager.push(newBlocks, {
          metadata: { action: 'Pasted blocks' },
          globalStyles: get().globalStyles,
        });
        
        set({
          blocks: newBlocks,
          selectedBlockIds: pastedBlocks.map(b => b.id),
          isUndoable: historyManager.canUndo(),
          isRedoable: historyManager.canRedo(),
        });
      },

      // Search
      setSearchQuery: (query) => {
        set({ searchQuery: query });
        // Search results will be computed in the component using BLOCK_DEFINITIONS
      },

      clearSearch: () => set({ searchQuery: '', searchResults: [] }),

      // Favorites & Recent
      toggleFavorite: (blockType) => {
        const { favoriteBlocks } = get();
        const isFavorite = favoriteBlocks.includes(blockType);
        set({
          favoriteBlocks: isFavorite
            ? favoriteBlocks.filter(t => t !== blockType)
            : [...favoriteBlocks, blockType],
        });
      },

      trackBlockUsage: (blockType) => {
        const { recentBlocks } = get();
        const existing = recentBlocks.find(b => b.type === blockType);
        
        let newRecent: BlockUsage[];
        if (existing) {
          newRecent = recentBlocks
            .map(b => b.type === blockType
              ? { ...b, lastUsed: Date.now(), useCount: b.useCount + 1 }
              : b
            )
            .sort((a, b) => b.lastUsed - a.lastUsed);
        } else {
          newRecent = [
            { type: blockType, lastUsed: Date.now(), useCount: 1 },
            ...recentBlocks,
          ].slice(0, 20);
        }
        
        set({ recentBlocks: newRecent });
      },

      getRecentBlocks: (limit = 5) => {
        const { recentBlocks } = get();
        return recentBlocks
          .sort((a, b) => b.lastUsed - a.lastUsed)
          .slice(0, limit)
          .map(b => b.type);
      },

      // Drag
      setDraggedBlock: (blockId) => set({ draggedBlockId: blockId }),
      setDraggedBlockType: (type) => set({ draggedBlockType: type }),
      setDragOverIndex: (index) => set({ dragOverIndex: index }),

      // Template
      applyTemplate: (template) => {
        const { historyManager } = get();
        const blocks = JSON.parse(JSON.stringify(template.blocks));
        
        historyManager.push(blocks, {
          label: `Applied: ${template.name}`,
          isCheckpoint: true,
          globalStyles: get().globalStyles,
        });
        
        set({
          blocks,
          selectedBlockIds: [],
          isUndoable: historyManager.canUndo(),
          isRedoable: historyManager.canRedo(),
        });
      },

      // Persistence
      exportState: () => {
        const state = get();
        return JSON.stringify({
          blocks: state.blocks,
          globalStyles: state.globalStyles,
          favoriteBlocks: state.favoriteBlocks,
          recentBlocks: state.recentBlocks,
          history: state.historyManager.export(),
        });
      },

      importState: (stateJson) => {
        try {
          const data = JSON.parse(stateJson);
          const { historyManager } = get();
          
          if (data.history) {
            historyManager.import(data.history);
          }
          
          set({
            blocks: data.blocks || [],
            globalStyles: data.globalStyles || DEFAULT_GLOBAL_STYLES,
            favoriteBlocks: data.favoriteBlocks || [],
            recentBlocks: data.recentBlocks || [],
            isUndoable: historyManager.canUndo(),
            isRedoable: historyManager.canRedo(),
          });
        } catch (e) {
          console.error('Failed to import state:', e);
        }
      },
    }),
    {
      name: 'site-builder-editor',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        favoriteBlocks: state.favoriteBlocks,
        recentBlocks: state.recentBlocks,
        globalStyles: state.globalStyles,
      }),
    }
  )
);

// Hook shortcuts
export const useBlocks = () => useEditorStore((state) => state.blocks);
export const useSelectedBlocks = () => useEditorStore((state) => state.selectedBlockIds);
export const useGlobalStyles = () => useEditorStore((state) => state.globalStyles);
export const useHistory = () => useEditorStore((state) => ({
  isUndoable: state.isUndoable,
  isRedoable: state.isRedoable,
  undo: state.undo,
  redo: state.redo,
  createCheckpoint: state.createCheckpoint,
  jumpToSnapshot: state.jumpToSnapshot,
  createBranch: state.createBranch,
  switchBranch: state.switchBranch,
  getHistoryState: state.getHistoryState,
}));
export const useEditorUI = () => useEditorStore((state) => ({
  zoom: state.zoom,
  showGrid: state.showGrid,
  showOutlines: state.showOutlines,
  devicePreview: state.devicePreview,
  sidebarTab: state.sidebarTab,
  isPreviewMode: state.isPreviewMode,
  setZoom: state.setZoom,
  toggleGrid: state.toggleGrid,
  toggleOutlines: state.toggleOutlines,
  setDevicePreview: state.setDevicePreview,
  setSidebarTab: state.setSidebarTab,
  togglePreviewMode: state.togglePreviewMode,
}));

export default useEditorStore;

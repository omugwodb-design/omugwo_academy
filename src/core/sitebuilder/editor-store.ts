import { create } from "zustand";
import { Block, SitePage, GlobalStyles, PageStatus } from "./types";
import { TEMPLATES } from "./templates";

const generateId = () => Math.random().toString(36).substr(2, 9);

const MAX_HISTORY = 50;
const DEFAULT_HOME_BLOCKS = TEMPLATES.find(t => t.id === "omugwo-default-home")?.blocks || [];

interface EditorState {
  // Pages
  pages: SitePage[];
  currentPageId: string;

  // Blocks (derived from current page)
  selectedBlockId: string | null;

  // History per page
  historyMap: Record<string, Block[][]>;
  historyIndexMap: Record<string, number>;

  // UI State
  device: "desktop" | "tablet" | "mobile";
  leftPanel: "layers" | "blocks" | "templates" | "theme" | "pages" | "menus";
  showLeftPanel: boolean;
  showRightPanel: boolean;
  isDirty: boolean;
  isSaving: boolean;

  // Global Styles
  globalStyles: GlobalStyles;

  // Computed
  getCurrentPage: () => SitePage | undefined;
  getBlocks: () => Block[];
  getHistory: () => Block[][];
  getHistoryIndex: () => number;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // Page Actions
  setPages: (pages: SitePage[]) => void;
  addPage: (title: string, pageType: SitePage["pageType"], slugOverride?: string) => string;
  deletePage: (pageId: string) => void;
  updatePageTitle: (pageId: string, title: string) => void;
  setHomePage: (pageId: string) => void;
  switchPage: (pageId: string) => void;
  setPageStatus: (pageId: string, status: PageStatus) => void;
  publishCurrentPage: () => void;

  // Block Actions
  setSelectedBlockId: (id: string | null) => void;
  addBlock: (type: string, defaultProps: Record<string, any>, label: string) => void;
  deleteBlock: (id: string) => void;
  duplicateBlock: (id: string) => void;
  moveBlock: (id: string, direction: "up" | "down") => void;
  reorderBlocks: (newBlocks: Block[]) => void;
  updateBlockProps: (id: string, props: Record<string, any>) => void;
  applyTemplate: (blocks: Block[]) => void;

  // History
  undo: () => void;
  redo: () => void;

  // UI
  setDevice: (device: "desktop" | "tablet" | "mobile") => void;
  setLeftPanel: (panel: EditorState["leftPanel"]) => void;
  toggleLeftPanel: () => void;
  toggleRightPanel: () => void;

  // Global Styles
  setGlobalStyles: (styles: GlobalStyles) => void;
  updateGlobalStyle: (key: string, value: any) => void;

  // Save
  setIsSaving: (saving: boolean) => void;
  markClean: () => void;
}

const DEFAULT_GLOBAL_STYLES: GlobalStyles = {
  fontFamily: "Inter",
  headingFont: "Inter",
  primaryColor: "#e85d75",
  secondaryColor: "#f8a4b8",
  accentColor: "#fbbf24",
  backgroundColor: "#ffffff",
  textColor: "#1f2937",
  borderRadius: "12px",
};

export const useEditorStore = create<EditorState>((set, get) => {
  // Helper to update blocks for current page
  const setBlocksForCurrentPage = (newBlocks: Block[]) => {
    const { currentPageId } = get();
    set((state) => ({
      pages: state.pages.map((p) =>
        p.id === currentPageId ? { ...p, draftBlocks: newBlocks } : p
      ),
      isDirty: true,
    }));
  };

  // Helper to push to history
  const pushHistory = (newBlocks: Block[]) => {
    const { currentPageId, historyMap, historyIndexMap } = get();
    const currentHistory = historyMap[currentPageId] || [[]];
    const currentIndex = historyIndexMap[currentPageId] || 0;

    // Trim future history
    const trimmed = currentHistory.slice(0, currentIndex + 1);
    trimmed.push(newBlocks);

    // Cap history size
    if (trimmed.length > MAX_HISTORY) {
      trimmed.shift();
    }

    set({
      historyMap: { ...historyMap, [currentPageId]: trimmed },
      historyIndexMap: {
        ...historyIndexMap,
        [currentPageId]: trimmed.length - 1,
      },
    });

    setBlocksForCurrentPage(newBlocks);
  };

  return {
    // Initial state
    pages: [
      {
        id: "home",
        title: "Home",
        slug: "/",
        pageType: "homepage",
        sortOrder: 0,
        status: "DRAFT",
        draftBlocks: [],
        publishedBlocks: [],
        isHomePage: true,
        version: 1
      }
    ],
    currentPageId: "home",
    selectedBlockId: null,
    historyMap: { home: [DEFAULT_HOME_BLOCKS] },
    historyIndexMap: { home: 0 },
    device: "desktop",
    leftPanel: "blocks",
    showLeftPanel: true,
    showRightPanel: true,
    isDirty: false,
    isSaving: false,
    globalStyles: DEFAULT_GLOBAL_STYLES,

    // Computed
    getCurrentPage: () => {
      const { pages, currentPageId } = get();
      return pages.find((p) => p.id === currentPageId);
    },
    getBlocks: () => {
      const page = get().getCurrentPage();
      return page?.draftBlocks || [];
    },
    getHistory: () => {
      const { historyMap, currentPageId } = get();
      return historyMap[currentPageId] || [[]];
    },
    getHistoryIndex: () => {
      const { historyIndexMap, currentPageId } = get();
      return historyIndexMap[currentPageId] || 0;
    },
    canUndo: () => get().getHistoryIndex() > 0,
    canRedo: () => {
      const history = get().getHistory();
      return get().getHistoryIndex() < history.length - 1;
    },

    // Page Actions
    setPages: (pages) => set({ pages }),

    addPage: (title, pageType, slugOverride) => {
      const id = generateId();
      const slug =
        slugOverride ||
        title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");
      const newPage: SitePage = {
        id,
        title,
        slug,
        pageType,
        sortOrder: get().pages.length,
        status: "DRAFT",
        draftBlocks: [],
        publishedBlocks: [],
        isHomePage: false,
        version: 1
      };
      set((state) => ({
        pages: [...state.pages, newPage],
        currentPageId: id,
        historyMap: { ...state.historyMap, [id]: [[]] },
        historyIndexMap: { ...state.historyIndexMap, [id]: 0 },
        selectedBlockId: null,
      }));
      return id;
    },

    deletePage: (pageId) => {
      const { pages } = get();
      if (pages.length <= 1) return;
      const page = pages.find((p) => p.id === pageId);
      if (page?.isHomePage) return;

      set((state) => {
        const newPages = state.pages.filter((p) => p.id !== pageId);
        return {
          pages: newPages,
          currentPageId:
            state.currentPageId === pageId
              ? newPages[0]?.id || "home"
              : state.currentPageId,
          selectedBlockId:
            state.currentPageId === pageId ? null : state.selectedBlockId,
        };
      });
    },

    updatePageTitle: (pageId, title) => {
      set((state) => ({
        pages: state.pages.map((p) =>
          p.id === pageId
            ? {
              ...p,
              title,
              slug: p.isHomePage
                ? ""
                : title
                  .toLowerCase()
                  .replace(/\s+/g, "-")
                  .replace(/[^a-z0-9-]/g, ""),
            }
            : p
        ),
        isDirty: true,
      }));
    },

    setHomePage: (pageId) => {
      set((state) => ({
        pages: state.pages.map((p) => ({
          ...p,
          isHomePage: p.id === pageId,
          slug: p.id === pageId ? "" : p.slug,
        })),
        isDirty: true,
      }));
    },

    switchPage: (pageId) => {
      const { historyMap, pages } = get();
      if (!historyMap[pageId]) {
        const page = pages.find((p) => p.id === pageId);
        set((state) => ({
          historyMap: {
            ...state.historyMap,
            [pageId]: [page?.draftBlocks || []],
          },
          historyIndexMap: { ...state.historyIndexMap, [pageId]: 0 },
        }));
      }
      set({ currentPageId: pageId, selectedBlockId: null });
    },

    setPageStatus: (pageId, status) => {
      set((state) => ({
        pages: state.pages.map((p) =>
          p.id === pageId ? { ...p, status } : p
        ),
      }));
    },

    publishCurrentPage: () => {
      const { currentPageId } = get();
      set((state) => ({
        pages: state.pages.map((p) =>
          p.id === currentPageId
            ? {
              ...p,
              publishedBlocks: [...p.draftBlocks],
              status: "PUBLISHED" as const,
            }
            : p
        ),
      }));
    },

    // Block Actions
    setSelectedBlockId: (id) => set({ selectedBlockId: id }),

    addBlock: (type, defaultProps, label) => {
      const blocks = get().getBlocks();
      const { selectedBlockId } = get();
      const newBlock: Block = {
        id: generateId(),
        type: type as any,
        props: { ...defaultProps },
        label,
      };

      let insertIndex = blocks.length;
      if (selectedBlockId) {
        const idx = blocks.findIndex((b) => b.id === selectedBlockId);
        if (idx !== -1) insertIndex = idx;
      }

      const newBlocks = [
        ...blocks.slice(0, insertIndex),
        newBlock,
        ...blocks.slice(insertIndex),
      ];
      pushHistory(newBlocks);
      set({ selectedBlockId: newBlock.id });
    },

    deleteBlock: (id) => {
      const blocks = get().getBlocks();
      const newBlocks = blocks.filter((b) => b.id !== id);
      pushHistory(newBlocks);
      set((state) => ({
        selectedBlockId: state.selectedBlockId === id ? null : state.selectedBlockId,
      }));
    },

    duplicateBlock: (id) => {
      const blocks = get().getBlocks();
      const idx = blocks.findIndex((b) => b.id === id);
      if (idx === -1) return;

      const original = blocks[idx];
      const duplicate: Block = {
        ...original,
        id: generateId(),
        label: original.label ? `${original.label} (copy)` : undefined,
      };

      const newBlocks = [
        ...blocks.slice(0, idx + 1),
        duplicate,
        ...blocks.slice(idx + 1),
      ];
      pushHistory(newBlocks);
      set({ selectedBlockId: duplicate.id });
    },

    moveBlock: (id, direction) => {
      const blocks = get().getBlocks();
      const idx = blocks.findIndex((b) => b.id === id);
      if (idx === -1) return;
      if (direction === "up" && idx === 0) return;
      if (direction === "down" && idx === blocks.length - 1) return;

      const newBlocks = [...blocks];
      const targetIdx = direction === "up" ? idx - 1 : idx + 1;
      [newBlocks[idx], newBlocks[targetIdx]] = [
        newBlocks[targetIdx],
        newBlocks[idx],
      ];
      pushHistory(newBlocks);
    },

    reorderBlocks: (newBlocks) => {
      pushHistory(newBlocks);
    },

    updateBlockProps: (id, props) => {
      const blocks = get().getBlocks();
      const newBlocks = blocks.map((b) =>
        b.id === id ? { ...b, props } : b
      );
      // Update without pushing to history (for live editing)
      setBlocksForCurrentPage(newBlocks);
      // Replace current history head
      const { historyMap, historyIndexMap, currentPageId } = get();
      const history = [...(historyMap[currentPageId] || [[]])];
      const idx = historyIndexMap[currentPageId] || 0;
      history[idx] = newBlocks;
      set({ historyMap: { ...historyMap, [currentPageId]: history } });
    },

    applyTemplate: (blocks) => {
      pushHistory(blocks);
      set({ selectedBlockId: null });
    },

    // History
    undo: () => {
      const { historyMap, historyIndexMap, currentPageId } = get();
      const history = historyMap[currentPageId] || [[]];
      const idx = historyIndexMap[currentPageId] || 0;
      if (idx > 0) {
        const newIdx = idx - 1;
        set({
          historyIndexMap: { ...historyIndexMap, [currentPageId]: newIdx },
        });
        setBlocksForCurrentPage(history[newIdx]);
      }
    },

    redo: () => {
      const { historyMap, historyIndexMap, currentPageId } = get();
      const history = historyMap[currentPageId] || [[]];
      const idx = historyIndexMap[currentPageId] || 0;
      if (idx < history.length - 1) {
        const newIdx = idx + 1;
        set({
          historyIndexMap: { ...historyIndexMap, [currentPageId]: newIdx },
        });
        setBlocksForCurrentPage(history[newIdx]);
      }
    },

    // UI
    setDevice: (device) => set({ device }),
    setLeftPanel: (panel) => set({ leftPanel: panel, showLeftPanel: true }),
    toggleLeftPanel: () =>
      set((state) => ({ showLeftPanel: !state.showLeftPanel })),
    toggleRightPanel: () =>
      set((state) => ({ showRightPanel: !state.showRightPanel })),

    // Global Styles
    setGlobalStyles: (styles) => set({ globalStyles: styles, isDirty: true }),
    updateGlobalStyle: (key, value) =>
      set((state) => ({
        globalStyles: { ...state.globalStyles, [key]: value },
        isDirty: true,
      })),

    // Save
    setIsSaving: (saving) => set({ isSaving: saving }),
    markClean: () => set({ isDirty: false }),
  };
});

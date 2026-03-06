import React, { useMemo, useState } from "react";
import { cn } from "../../lib/utils";
import { useEditorStore } from "./editor-store";
import { BLOCK_DEFINITIONS, BLOCK_CATEGORIES } from "./registry";
import { Block } from "./types";
import { TEMPLATES } from "./templates";
import { SiteRenderer } from "./renderer";
import {
  Layers,
  Plus,
  Trash2,
  Search,
  Palette,
  LayoutTemplate,
  FileText,
  Menu as MenuIcon,
  Home,
  GripVertical,
  ChevronDown,
  ChevronRight,
  Eye,
  Heart,
} from "lucide-react";

const TABS = [
  { id: "blocks" as const, label: "Blocks", icon: Plus },
  { id: "layers" as const, label: "Layers", icon: Layers },
  { id: "menus" as const, label: "Menus", icon: MenuIcon },
  { id: "pages" as const, label: "Pages", icon: FileText },
  { id: "theme" as const, label: "Theme", icon: Palette },
  { id: "templates" as const, label: "Templates", icon: LayoutTemplate },
];

const THEME_PRESETS = [
  { name: "Omugwo Default", primary: "#e85d75", secondary: "#f8a4b8", bg: "#ffffff", font: "Inter" },
  { name: "Warm Earth", primary: "#d97706", secondary: "#fbbf24", bg: "#fffbeb", font: "Poppins" },
  { name: "Ocean Calm", primary: "#0891b2", secondary: "#22d3ee", bg: "#f0fdfa", font: "Inter" },
  { name: "Royal Purple", primary: "#7c3aed", secondary: "#a78bfa", bg: "#faf5ff", font: "Playfair Display" },
  { name: "Forest Green", primary: "#059669", secondary: "#34d399", bg: "#f0fdf4", font: "Inter" },
  { name: "Midnight", primary: "#e85d75", secondary: "#f8a4b8", bg: "#0f172a", font: "Inter" },
];

interface SidebarLeftProps {
  canEdit: boolean;
  canEditTheme: boolean;
  canManagePages: boolean;
  canManageTemplates: boolean;
  builderMode: 'website' | 'course' | 'community';
}

export const SidebarLeft: React.FC<SidebarLeftProps> = ({
  canEdit,
  canEditTheme,
  canManagePages,
  canManageTemplates,
  builderMode,
}) => {
  const {
    leftPanel,
    setLeftPanel,
    getBlocks,
    selectedBlockId,
    setSelectedBlockId,
    deleteBlock,
    pages,
    currentPageId,
    switchPage,
    addPage,
    deletePage,
    updatePageTitle,
    setHomePage,
    globalStyles,
    updateGlobalStyle,
    setGlobalStyles,
    applyTemplate,
  } = useEditorStore();

  const blocks = getBlocks();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(BLOCK_CATEGORIES.map((c) => c.id))
  );

  const filteredTemplates = useMemo(() => {
    if (builderMode === 'course') {
      return TEMPLATES.filter((t: any) => t.pageType === 'course_sales' || t.category === 'course_sales');
    }
    return TEMPLATES.filter((t: any) => !(t.pageType === 'course_sales' || t.category === 'course_sales'));
  }, [builderMode]);

  const visibleTabs = useMemo(() => {
    const filtered = TABS.filter((t) => {
      if (t.id === "theme") return canEditTheme;
      if (t.id === "templates") return canManageTemplates;
      if (t.id === "pages") return canManagePages;
      return true;
    });
    return filtered;
  }, [canEditTheme, canManagePages, canManageTemplates]);

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleBlockDragStart = (
    event: React.DragEvent<HTMLButtonElement>,
    type: string
  ) => {
    event.dataTransfer.setData("site-builder/block-type", type);
    event.dataTransfer.effectAllowed = "copyMove";
  };

  const handleAddBlock = (type: string) => {
    const def = BLOCK_DEFINITIONS[type];
    if (def) {
      useEditorStore.getState().addBlock(type, def.defaultProps, def.label);
    }
  };

  return (
    <div className="w-[320px] border-r bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 flex flex-col h-full shrink-0">
      <div className="border-b border-gray-200 dark:border-gray-800 shrink-0">
        <div className="grid grid-cols-2 gap-1 p-2">
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setLeftPanel(tab.id)}
              className={cn(
                "flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap",
                leftPanel === tab.id
                  ? "bg-primary-50 dark:bg-primary-500/10 text-primary-600"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900/60"
              )}
              title={tab.label}
            >
              <tab.icon className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {leftPanel === "blocks" && (
          <div className="p-3">
            <div className="mb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search blocks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                />
              </div>
            </div>

            {BLOCK_CATEGORIES.map((category) => {
              const filteredBlocks = category.blocks.filter((type) => {
                const def = BLOCK_DEFINITIONS[type];
                if (!def) return false;
                if (!searchQuery) return true;
                return def.label.toLowerCase().includes(searchQuery.toLowerCase());
              });
              if (filteredBlocks.length === 0) return null;

              return (
                <div key={category.id} className="mb-3">
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="flex items-center justify-between w-full px-2 py-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    {category.label}
                    {expandedCategories.has(category.id) ? (
                      <ChevronDown className="w-3 h-3" />
                    ) : (
                      <ChevronRight className="w-3 h-3" />
                    )}
                  </button>
                  {expandedCategories.has(category.id) && (
                    <div className="grid grid-cols-2 gap-1.5 mt-1">
                      {filteredBlocks.map((type) => {
                        const def = BLOCK_DEFINITIONS[type];
                        if (!def) return null;
                        const Icon = def.icon;
                        return (
                          <button
                            key={type}
                            draggable={canEdit}
                            onDragStart={(e) => handleBlockDragStart(e, type)}
                            onClick={() => handleAddBlock(type)}
                            className={cn(
                              "flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all text-center",
                              canEdit
                                ? "border-gray-100 hover:border-primary-200 hover:bg-primary-50/50 cursor-grab active:cursor-grabbing"
                                : "border-gray-100 bg-gray-50 dark:bg-gray-900 text-gray-400 cursor-not-allowed opacity-60"
                            )}
                            disabled={!canEdit}
                          >
                            <Icon className="w-5 h-5 text-gray-500" />
                            <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-300 leading-tight">
                              {def.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {leftPanel === "layers" && (
          <div className="p-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-2 mb-2">
              Layers ({blocks.length})
            </p>
            {blocks.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-8">No blocks yet</p>
            )}
            <div className="space-y-1">
              {blocks.map((block) => {
                const def = BLOCK_DEFINITIONS[block.type];
                if (!def) return null;
                const Icon = def.icon;
                return (
                  <div
                    key={block.id}
                    onClick={() => setSelectedBlockId(block.id)}
                    className={cn(
                      "group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all",
                      selectedBlockId === block.id
                        ? "bg-primary-50 dark:bg-primary-500/10 border border-primary-200 dark:border-primary-500/30"
                        : "hover:bg-gray-50 dark:hover:bg-gray-900/60 border border-transparent"
                    )}
                  >
                    <GripVertical className="w-3 h-3 text-gray-300" />
                    <Icon className="w-4 h-4 text-gray-500 shrink-0" />
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-200 truncate flex-1">
                      {def.label}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteBlock(block.id);
                      }}
                      className="p-1 hover:bg-red-50 rounded text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {leftPanel === "theme" && (
          !canEditTheme ? (
            <div className="p-6 text-center">
              <p className="text-sm font-bold text-gray-900">Theme editing locked</p>
              <p className="text-xs text-gray-500 mt-1">You don't have permission to edit global theme settings.</p>
            </div>
          ) : (
            <div className="p-3 space-y-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-2 mb-2">Presets</p>
                <div className="grid grid-cols-2 gap-2">
                  {THEME_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() =>
                        setGlobalStyles({
                          ...globalStyles,
                          primaryColor: preset.primary,
                          secondaryColor: preset.secondary,
                          backgroundColor: preset.bg,
                          fontFamily: preset.font,
                        })
                      }
                      className="p-3 rounded-xl border border-gray-100 hover:border-primary-200 transition-all text-left"
                    >
                      <div className="flex gap-1 mb-2">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.primary }} />
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.secondary }} />
                        <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: preset.bg }} />
                      </div>
                      <span className="text-[10px] font-semibold text-gray-600">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-2">Custom Colors</p>
                {[
                  { key: "primaryColor", label: "Primary" },
                  { key: "secondaryColor", label: "Secondary" },
                  { key: "accentColor", label: "Accent" },
                  { key: "backgroundColor", label: "Background" },
                  { key: "textColor", label: "Text" },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center gap-3 px-2">
                    <input
                      type="color"
                      value={(globalStyles as any)[key] || "#000000"}
                      onChange={(e) => updateGlobalStyle(key, e.target.value)}
                      className="w-8 h-8 rounded-lg border border-gray-200 cursor-pointer"
                    />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-700">{label}</p>
                      <p className="text-[10px] text-gray-400 font-mono">{(globalStyles as any)[key]}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-2">Typography</p>
                <div className="px-2">
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Font Family</label>
                  <select
                    value={globalStyles.fontFamily}
                    onChange={(e) => updateGlobalStyle("fontFamily", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  >
                    {["Inter", "Poppins", "Playfair Display", "Outfit", "DM Sans", "Nunito"].map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )
        )}

        {leftPanel === "menus" && (
          <div className="p-6 text-center text-gray-500">
            <MenuIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-sm font-bold text-gray-900 mb-1">Menu Management</p>
            <p className="text-xs">Configure your site's navigation and mega menus here.</p>
            <button className="mt-4 px-4 py-2 bg-primary-50 text-primary-600 rounded-lg text-xs font-bold hover:bg-primary-100 transition-colors">
              Create New Menu
            </button>
          </div>
        )}

        {leftPanel === "pages" && (
          !canManagePages ? (
            <div className="p-6 text-center">
              <p className="text-sm font-bold text-gray-900">Pages locked</p>
              <p className="text-xs text-gray-500 mt-1">You don't have permission to create/delete pages.</p>
            </div>
          ) : (
            <div className="p-3">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Pages ({pages.length})
                </p>
                <button
                  onClick={() => addPage("New Page", "custom")}
                  className="flex items-center gap-1 px-2 py-1 bg-primary-600 text-white rounded-lg text-[10px] font-bold"
                >
                  <Plus className="w-3 h-3" />
                  Add Page
                </button>
              </div>
              <div className="space-y-2">
                {pages.map((page) => (
                  <div
                    key={page.id}
                    onClick={() => switchPage(page.id)}
                    className={cn(
                      "group flex flex-col p-3 rounded-xl cursor-pointer transition-all border",
                      currentPageId === page.id
                        ? "bg-primary-50 border-primary-200"
                        : "hover:bg-gray-50 border-gray-100"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          {page.isHomePage && <Home className="w-3 h-3 text-primary-600 shrink-0" />}
                          <input
                            type="text"
                            value={page.title}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => updatePageTitle(page.id, e.target.value)}
                            className="bg-transparent text-xs font-bold text-gray-900 border-none p-0 focus:ring-0 w-full"
                          />
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-[10px] text-gray-400 font-mono">/{page.slug || ""}</span>
                          <div className="flex items-center gap-1 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                            {!page.isHomePage && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setHomePage(page.id);
                                }}
                                className="text-[9px] text-primary-600 hover:underline font-bold"
                              >
                                Set Home
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span
                          className={cn(
                            "text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded",
                            page.status === "PUBLISHED"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          )}
                        >
                          {page.status}
                        </span>
                        {!page.isHomePage && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deletePage(page.id);
                            }}
                            className="p-1 hover:bg-red-50 rounded text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}

        {leftPanel === "templates" && (
          !canManageTemplates ? (
            <div className="p-6 text-center">
              <p className="text-sm font-bold text-gray-900">Templates locked</p>
              <p className="text-xs text-gray-500 mt-1">You don't have permission to browse/apply templates.</p>
            </div>
          ) : (
            <TemplatePanel onApply={applyTemplate} templates={filteredTemplates} globalStyles={globalStyles} />
          )
        )}
      </div>
    </div>
  );
};

//  Template Panel with Preview 
const TemplatePanel: React.FC<{
  onApply: (blocks: Block[]) => void;
  templates: any[];
  globalStyles: any;
}> = ({ onApply, templates, globalStyles }) => {
  const [previewingTemplate, setPreviewingTemplate] = useState<any | null>(null);

  return (
    <div className="p-3">
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-2 mb-3">
        Omugwo Academy Templates
      </p>
      <div className="space-y-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className="group relative rounded-2xl border border-gray-100 overflow-hidden hover:border-primary-200 transition-all cursor-pointer"
            onClick={() => setPreviewingTemplate(template)}
          >
            <div className="aspect-video w-full relative">
              <img
                src={template.thumbnail}
                alt={template.name}
                className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                <p className="text-xs font-bold text-white mb-2">View Preview</p>
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Eye className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
            <div className="p-3 bg-white">
              <p className="text-sm font-bold text-gray-900">{template.name}</p>
              <p className="text-[10px] text-gray-500 mt-1">{template.description}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {template.tags.map((tag: string) => (
                  <span key={tag} className="text-[8px] bg-gray-50 text-gray-400 px-1.5 py-0.5 rounded border border-gray-100">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {previewingTemplate && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex flex-col animate-in fade-in duration-300">
          <div className="h-16 flex items-center justify-between px-8 bg-gray-900 border-b border-gray-700 shrink-0 shadow-lg">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setPreviewingTemplate(null)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg transition-colors border border-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back
              </button>
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">{previewingTemplate.name}</h3>
                <p className="text-xs text-gray-400">Template Preview</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setPreviewingTemplate(null)}
                className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg transition-colors border border-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onApply(previewingTemplate.blocks);
                  setPreviewingTemplate(null);
                }}
                className="px-8 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-black shadow-2xl shadow-primary-500/50 transition-colors"
              >
                Apply Template
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden p-8 flex justify-center">
            <div className="w-full max-w-5xl h-full bg-white rounded-t-3xl shadow-2xl overflow-y-auto scrollbar-hide border-x-[12px] border-t-[12px] border-white">
              <SiteRenderer blocks={previewingTemplate.blocks} globalStyles={globalStyles} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

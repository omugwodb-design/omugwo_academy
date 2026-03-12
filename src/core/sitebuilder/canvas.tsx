import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ArrowDown,
  ArrowUp,
  Copy,
  GripVertical,
  Monitor,
  Smartphone,
  Tablet,
  Trash2,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useEditorStore } from "./editor-store";
import { BLOCK_DEFINITIONS } from "./registry";
import { DeviceProvider } from "./device-context";
import { InlineTextToolbar } from "./components/InlineTextToolbar";
import type { Block } from "./types";

// --- UNIVERSAL BLOCK CONTAINER ---
const BlockContainer = ({ block, children }: { block: Block; children: React.ReactNode }) => {
  const props = block.props || {};

  // Padding & Margin
  const padding = props.padding || {};
  const margin = props.margin || {};

  const style: React.CSSProperties = {
    // Spacing
    paddingTop: padding.top ? `${padding.top}px` : undefined,
    paddingBottom: padding.bottom ? `${padding.bottom}px` : undefined,
    paddingLeft: padding.left ? `${padding.left}px` : undefined,
    paddingRight: padding.right ? `${padding.right}px` : undefined,

    marginTop: margin.top ? `${margin.top}px` : undefined,
    marginBottom: margin.bottom ? `${margin.bottom}px` : undefined,
    marginLeft: margin.left ? `${margin.left}px` : undefined,
    marginRight: margin.right ? `${margin.right}px` : undefined,

    // Background
    backgroundColor: props.backgroundColor || undefined,
    backgroundImage: props.backgroundImage ? `url(${props.backgroundImage})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',

    // Border & Radius
    borderRadius: props.borderRadius?.borderRadius ? `${props.borderRadius.borderRadius}px` : undefined,
    borderWidth: props.borderWidth ? `${props.borderWidth}px` : undefined,
    borderStyle: props.borderWidth ? 'solid' : undefined,
    borderColor: props.borderColor || undefined,
  };

  // Shadow Mapping
  const shadows: Record<string, string> = {
    'none': 'none',
    'sm': 'var(--shadow-sm)',
    'md': 'var(--shadow-md)',
    'lg': 'var(--shadow-lg)',
    'xl': 'var(--shadow-xl)',
    '2xl': 'var(--shadow-2xl)',
    'inner': 'var(--shadow-inner)',
  };
  if (props.shadow && shadows[props.shadow]) {
    style.boxShadow = shadows[props.shadow];
  }

  return (
    <div
      className={cn(
        "w-full transition-all duration-300",
        props.animation === 'fadeIn' && "animate-in fade-in duration-700",
        props.animation === 'slideUp' && "animate-in fade-in slide-in-from-bottom-10 duration-700",
        props.animation === 'scaleUp' && "animate-in fade-in zoom-in-95 duration-700",
      )}
      style={style}
    >
      <div className={cn("mx-auto", props.maxWidth || "max-w-screen-xl")}>
        {children}
      </div>
    </div>
  );
};


//  Sortable Block Wrapper 
const SortableBlock = ({ block }: { block: Block }) => {
  const {
    selectedBlockId,
    setSelectedBlockId,
    updateBlockProps,
    deleteBlock,
    moveBlock,
    duplicateBlock,
  } = useEditorStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    position: "relative" as const,
    zIndex: isDragging ? 50 : undefined,
  };

  const def = BLOCK_DEFINITIONS[block.type];
  if (!def) return null;
  const Component = def.component;
  const isSelected = selectedBlockId === block.id;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group transition-all",
        isSelected ? "z-10" : "hover:z-10",
        isDragging && "ring-2 ring-primary-500/50 rounded-lg shadow-2xl"
      )}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedBlockId(block.id);
      }}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className={cn(
          "absolute left-1/2 -translate-x-1/2 -top-3 z-30 flex items-center gap-1 px-3 py-1 rounded-full bg-primary-600 text-white shadow-lg cursor-grab active:cursor-grabbing transition-all duration-200",
          isSelected || isDragging
            ? "opacity-100 scale-100"
            : "opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="h-3.5 w-3.5" />
        <span className="text-[9px] font-bold uppercase tracking-wider">
          {def.label}
        </span>
      </div>

      {/* Selection Outline */}
      <div
        className={cn(
          "absolute inset-0 border-2 border-transparent pointer-events-none transition-colors rounded-sm z-20",
          isSelected
            ? "border-primary-500"
            : "group-hover:border-primary-300/40"
        )}
      />

      {/* Action Buttons */}
      {isSelected && (
        <div className="absolute top-0 right-2 -translate-y-full flex items-center gap-0.5 bg-primary-600 text-white text-[10px] px-1.5 py-1 rounded-t-lg font-bold shadow-lg pointer-events-auto z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              moveBlock(block.id, "up");
            }}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            title="Move Up"
          >
            <ArrowUp className="h-3 w-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              moveBlock(block.id, "down");
            }}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            title="Move Down"
          >
            <ArrowDown className="h-3 w-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              duplicateBlock(block.id);
            }}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            title="Duplicate"
          >
            <Copy className="h-3 w-3" />
          </button>
          <div className="h-3 w-px bg-white/30 mx-0.5" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteBlock(block.id);
            }}
            className="p-1 hover:bg-red-500 rounded transition-colors"
            title="Delete"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      )}

      <BlockContainer block={block}>
        <Component
          block={block}
          onChange={(id: string, props: any) => updateBlockProps(id, props)}
          selected={isSelected}
        />
      </BlockContainer>
    </div>
  );
};

//  Canvas Component 
export const Canvas: React.FC = () => {
  const {
    device,
    setDevice,
    getBlocks,
    setSelectedBlockId,
    reorderBlocks,
    globalStyles,
  } = useEditorStore();

  const blocks = getBlocks();
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const targetWidthNumber =
    device === "desktop" ? 1440 : device === "tablet" ? 768 : 375;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveDragId(null);
      if (over && active.id !== over.id) {
        const oldIndex = blocks.findIndex((b) => b.id === active.id);
        const newIndex = blocks.findIndex((b) => b.id === over.id);
        if (oldIndex !== -1 && newIndex !== -1) {
          reorderBlocks(arrayMove(blocks, oldIndex, newIndex));
        }
      }
    },
    [blocks, reorderBlocks]
  );

  // Accept sidebar drag-and-drop
  const handleSidebarDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      if (
        Array.from(event.dataTransfer.types || []).includes(
          "site-builder/block-type"
        )
      ) {
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
      }
    },
    []
  );

  const handleSidebarDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      const blockType = event.dataTransfer.getData("site-builder/block-type");
      if (blockType) {
        event.preventDefault();
        const def = BLOCK_DEFINITIONS[blockType];
        if (def) {
          useEditorStore
            .getState()
            .addBlock(blockType, def.defaultProps, def.label);
        }
      }
    },
    []
  );

  // Auto-scale
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      if (device !== "desktop") {
        setScale(1);
        return;
      }

      const containerWidth = containerRef.current.offsetWidth;
      const s = (containerWidth - 96) / targetWidthNumber;
      setScale(Math.min(s, 1));
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [device, targetWidthNumber]);

  const targetWidth =
    device === "desktop" ? "1440px" : device === "tablet" ? "768px" : "375px";

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-100 dark:bg-gray-950 relative overflow-hidden">
      {/* Device Toolbar */}
      <div className="h-12 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm flex items-center justify-between px-4 shrink-0 z-40">
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-900 p-1 rounded-lg">
          {[
            { mode: "desktop" as const, icon: Monitor },
            { mode: "tablet" as const, icon: Tablet },
            { mode: "mobile" as const, icon: Smartphone },
          ].map(({ mode, icon: Icon }) => (
            <button
              key={mode}
              onClick={() => setDevice(mode)}
              className={cn(
                "p-2 rounded-md transition-colors",
                device === mode
                  ? "bg-white dark:bg-gray-950 shadow-sm text-primary-600"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              )}
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
        <span className="text-xs text-gray-400 font-mono">
          {device === "desktop" ? `${Math.round(scale * 100)}%` : `${targetWidthNumber}px`}
        </span>
      </div>

      {/* Viewport */}
      <div
        ref={containerRef}
        className="flex-1 w-full relative overflow-hidden flex items-start justify-center p-8 overflow-y-auto"
        onClick={() => setSelectedBlockId(null)}
        onDragOver={handleSidebarDragOver}
        onDrop={handleSidebarDrop}
      >
        <InlineTextToolbar />
        <div
          className="bg-white dark:bg-gray-950 shadow-2xl transition-all duration-300 origin-top overflow-y-auto overflow-x-hidden antialiased text-gray-900 dark:text-gray-100"
          style={{
            width: targetWidth,
            minHeight: "100%",
            transform: device === "desktop" ? `scale(${scale})` : undefined,
            transformOrigin: device === "desktop" ? "top center" : undefined,
            fontFamily: globalStyles?.fontFamily || "Inter",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <DeviceProvider device={device}>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={blocks.map((b) => b.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="min-h-full flex flex-col bg-white dark:bg-gray-950">
                  {blocks.map((block) => (
                    <SortableBlock key={block.id} block={block} />
                  ))}

                  {blocks.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-[500px] border-2 border-dashed border-gray-200 m-12 rounded-xl">
                      <GripVertical className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-400 font-medium">
                        Add blocks from the sidebar
                      </p>
                      <p className="text-gray-300 text-sm mt-1">
                        Or drag blocks here to get started
                      </p>
                    </div>
                  )}
                </div>
              </SortableContext>

              <DragOverlay>
                {activeDragId ? (
                  <div className="opacity-80 shadow-2xl rounded-lg ring-2 ring-primary-500 scale-[1.02] pointer-events-none">
                    <div className="bg-primary-50 backdrop-blur-sm p-4 rounded-lg text-center">
                      <span className="text-sm font-bold text-primary-600">
                        {BLOCK_DEFINITIONS[
                          blocks.find((b) => b.id === activeDragId)?.type || ""
                        ]?.label || "Block"}
                      </span>
                    </div>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          </DeviceProvider>
        </div>
      </div>
    </div>
  );
};

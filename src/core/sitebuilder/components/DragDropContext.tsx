// Enhanced Drag & Drop System with Visual Drop Zones
import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { cn } from '../../../lib/utils';
import { Block, BlockType } from '../types';
import { useEditorStore } from '../store/editor-store';
import {
  Plus,
  ArrowDown,
  ArrowUp,
  GripVertical,
  Copy,
  Trash2,
  MoreHorizontal,
} from 'lucide-react';

// Drag Context
interface DragContextValue {
  isDragging: boolean;
  draggedBlockId: string | null;
  draggedBlockType: BlockType | null;
  dragOverIndex: number | null;
  dragPosition: 'before' | 'after' | 'inside' | null;
  startDrag: (blockId: string) => void;
  startDragNew: (type: BlockType) => void;
  endDrag: () => void;
  setDragOver: (index: number | null, position?: 'before' | 'after' | 'inside') => void;
}

const DragContext = createContext<DragContextValue | null>(null);

export const useDragContext = () => {
  const context = useContext(DragContext);
  if (!context) {
    throw new Error('useDragContext must be used within DragDropProvider');
  }
  return context;
};

// Provider Component
interface DragDropProviderProps {
  children: React.ReactNode;
  onDropNew: (type: BlockType, index: number) => void;
  onDropExisting: (blockId: string, newIndex: number) => void;
}

export const DragDropProvider: React.FC<DragDropProviderProps> = ({
  children,
  onDropNew,
  onDropExisting,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const [draggedBlockType, setDraggedBlockType] = useState<BlockType | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [dragPosition, setDragPosition] = useState<'before' | 'after' | 'inside' | null>(null);

  const startDrag = useCallback((blockId: string) => {
    setIsDragging(true);
    setDraggedBlockId(blockId);
    setDraggedBlockType(null);
  }, []);

  const startDragNew = useCallback((type: BlockType) => {
    setIsDragging(true);
    setDraggedBlockId(null);
    setDraggedBlockType(type);
  }, []);

  const endDrag = useCallback(() => {
    setIsDragging(false);
    setDraggedBlockId(null);
    setDraggedBlockType(null);
    setDragOverIndex(null);
    setDragPosition(null);
  }, []);

  const setDragOver = useCallback((index: number | null, position: 'before' | 'after' | 'inside' = 'before') => {
    setDragOverIndex(index);
    setDragPosition(position);
  }, []);

  // Handle drop
  const handleDrop = useCallback((index: number, position: 'before' | 'after' | 'inside') => {
    if (draggedBlockType) {
      // New block from palette
      const insertIndex = position === 'after' ? index + 1 : index;
      onDropNew(draggedBlockType, insertIndex);
    } else if (draggedBlockId) {
      // Existing block being moved
      const insertIndex = position === 'after' ? index + 1 : index;
      onDropExisting(draggedBlockId, insertIndex);
    }
    endDrag();
  }, [draggedBlockType, draggedBlockId, onDropNew, onDropExisting, endDrag]);

  return (
    <DragContext.Provider
      value={{
        isDragging,
        draggedBlockId,
        draggedBlockType,
        dragOverIndex,
        dragPosition,
        startDrag,
        startDragNew,
        endDrag,
        setDragOver,
      }}
    >
      {children}
    </DragContext.Provider>
  );
};

// Drop Zone Component
interface DropZoneProps {
  index: number;
  className?: string;
  onDrop: (index: number, position: 'before' | 'after') => void;
}

export const DropZone: React.FC<DropZoneProps> = ({ index, className, onDrop }) => {
  const { isDragging, dragOverIndex, dragPosition, setDragOver, endDrag } = useDragContext();
  const [localPosition, setLocalPosition] = useState<'before' | 'after' | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    // Determine position based on mouse Y position
    const rect = e.currentTarget.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const position = e.clientY < midY ? 'before' : 'after';

    setLocalPosition(position);
    setDragOver(index, position);
  };

  const handleDragLeave = () => {
    setLocalPosition(null);
    setDragOver(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (localPosition) {
      onDrop(index, localPosition);
    }
    setLocalPosition(null);
    endDrag();
  };

  if (!isDragging) return null;

  const isActive = dragOverIndex === index && dragPosition === localPosition;

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'h-2 transition-all duration-150',
        isActive && localPosition === 'before' && 'h-12 border-t-2 border-primary-500 bg-primary-50/50',
        isActive && localPosition === 'after' && 'h-12 border-b-2 border-primary-500 bg-primary-50/50',
        className
      )}
    >
      {isActive && (
        <div className={cn(
          'absolute left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-1 rounded-full',
          'bg-primary-500 text-white text-xs font-medium shadow-lg',
          localPosition === 'before' ? '-top-4' : '-bottom-4'
        )}>
          <Plus className="w-3 h-3" />
          Drop here
        </div>
      )}
    </div>
  );
};

// Draggable Block Wrapper
interface DraggableBlockProps {
  block: Block;
  index: number;
  children: React.ReactNode;
  isSelected: boolean;
  onSelect: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export const DraggableBlock: React.FC<DraggableBlockProps> = ({
  block,
  index,
  children,
  isSelected,
  onSelect,
  onDuplicate,
  onDelete,
}) => {
  const { isDragging: globalDragging, draggedBlockId, startDrag, endDrag } = useDragContext();
  const [isLocalDragging, setIsLocalDragging] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const blockRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', block.id);
    startDrag(block.id);
    setIsLocalDragging(true);
  };

  const handleDragEnd = () => {
    setIsLocalDragging(false);
    endDrag();
  };

  const isBeingDragged = isLocalDragging || draggedBlockId === block.id;

  return (
    <div
      ref={blockRef}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={onSelect}
      className={cn(
        'relative group transition-all duration-200',
        isBeingDragged && 'opacity-50 scale-[0.98]',
        globalDragging && !isBeingDragged && 'ring-1 ring-dashed ring-gray-300 dark:ring-gray-700',
        isSelected && 'ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-gray-900'
      )}
    >
      {/* Drag Handle */}
      <div
        className={cn(
          'absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full pr-2',
          'flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity',
          'cursor-grab active:cursor-grabbing'
        )}
      >
        <div className="p-1 bg-white dark:bg-gray-800 rounded shadow-sm border border-gray-200 dark:border-gray-700">
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Block Actions */}
      {showActions && !globalDragging && (
        <div className={cn(
          'absolute -top-3 right-4 flex items-center gap-1 p-1 rounded-lg',
          'bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700',
          'z-10'
        )}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/30 rounded transition-colors"
            title="Duplicate"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded transition-colors"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Block Content */}
      <div className="relative">
        {children}
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute inset-0 pointer-events-none ring-2 ring-primary-500 rounded-lg" />
      )}
    </div>
  );
};

// Visual Drop Indicator
interface DropIndicatorProps {
  visible: boolean;
  position: 'before' | 'after';
  index: number;
}

export const DropIndicator: React.FC<DropIndicatorProps> = ({ visible, position, index }) => {
  if (!visible) return null;

  return (
    <div
      className={cn(
        'h-1 bg-primary-500 rounded-full transition-all duration-150',
        position === 'before' && 'mb-2',
        position === 'after' && 'mt-2'
      )}
      style={{
        boxShadow: '0 0 10px rgba(124, 58, 237, 0.5)',
      }}
    />
  );
};

// Empty Canvas Drop Zone
interface EmptyCanvasDropZoneProps {
  onDrop: (type: BlockType) => void;
  isEmpty: boolean;
}

export const EmptyCanvasDropZone: React.FC<EmptyCanvasDropZoneProps> = ({ onDrop, isEmpty }) => {
  const { isDragging, draggedBlockType, endDrag } = useDragContext();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const blockType = e.dataTransfer.getData('blockType') as BlockType;
    if (blockType) {
      onDrop(blockType);
    }
    endDrag();
  };

  if (!isEmpty && !isDragging) return null;

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={cn(
        'flex flex-col items-center justify-center p-12 rounded-2xl border-2 border-dashed transition-all',
        isDragging && draggedBlockType
          ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/20 scale-[1.02]'
          : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900'
      )}
    >
      {isDragging && draggedBlockType ? (
        <div className="flex items-center gap-2 text-primary-600">
          <Plus className="w-6 h-6" />
          <span className="font-medium">Drop to add block</span>
        </div>
      ) : (
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Drag blocks here to start building
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
            or click a block from the sidebar
          </p>
        </div>
      )}
    </div>
  );
};

export default DragDropProvider;

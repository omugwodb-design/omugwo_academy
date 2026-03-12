// Layout Components for Lesson Builder
// Flexible layout system with sections, columns, grids, and spacers

import React from 'react';
import { cn } from '../../../../lib/utils';
import { LessonBlock } from '../types';
import { LessonBlockRenderer } from '../LessonBlockRenderer';

// ============================================
// SECTION COMPONENT
// ============================================

interface SectionProps {
  title?: string;
  background?: 'transparent' | 'white' | 'gray' | 'primary';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  borderRadius?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: boolean;
  fullWidth?: boolean;
  children?: LessonBlock[];
  isEditing?: boolean;
  selectedBlockId?: string | null;
  onPropChange?: (blockId: string, props: Record<string, any>) => void;
}

export const Section: React.FC<SectionProps> = ({
  title,
  background = 'transparent',
  padding = 'md',
  borderRadius = 'lg',
  shadow = false,
  fullWidth = false,
  children = [],
  isEditing,
  selectedBlockId,
  onPropChange,
}) => {
  const backgroundStyles = {
    transparent: 'bg-transparent',
    white: 'bg-white dark:bg-gray-900',
    gray: 'bg-gray-50 dark:bg-gray-800',
    primary: 'bg-primary-50 dark:bg-primary-950/30',
  };

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  };

  const borderRadiusStyles = {
    none: 'rounded-none',
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
  };

  return (
    <div
      className={cn(
        'w-full transition-all duration-300',
        backgroundStyles[background],
        paddingStyles[padding],
        borderRadiusStyles[borderRadius],
        shadow && 'shadow-lg',
        !fullWidth && 'max-w-4xl mx-auto'
      )}
    >
      {title && (
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          {title}
        </h2>
      )}
      
      <div className="space-y-4">
        {children.map((block) => (
          <LessonBlockRenderer
            key={block.id}
            block={block}
            isEditing={isEditing}
            selected={selectedBlockId === block.id}
            onPropChange={onPropChange}
          />
        ))}
      </div>

      {isEditing && children.length === 0 && (
        <div className="min-h-[100px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex items-center justify-center text-gray-400">
          <span className="text-sm">Drop blocks here</span>
        </div>
      )}
    </div>
  );
};

// ============================================
// COLUMNS COMPONENT
// ============================================

interface ColumnsProps {
  count?: 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  distribution?: 'equal' | 'sidebar-left' | 'sidebar-right';
  stackOnMobile?: boolean;
  children?: LessonBlock[];
  isEditing?: boolean;
  selectedBlockId?: string | null;
  onPropChange?: (blockId: string, props: Record<string, any>) => void;
}

export const Columns: React.FC<ColumnsProps> = ({
  count = 2,
  gap = 'md',
  distribution = 'equal',
  stackOnMobile = true,
  children = [],
  isEditing,
  selectedBlockId,
  onPropChange,
}) => {
  const gapStyles = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  };

  const distributionStyles = {
    equal: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-' + count,
    'sidebar-left': 'grid-cols-1 md:grid-cols-[1fr_2fr]',
    'sidebar-right': 'grid-cols-1 md:grid-cols-[2fr_1fr]',
  };

  // Split children into columns
  const columnChildren: LessonBlock[][] = Array.from({ length: count }, () => []);
  children.forEach((block, index) => {
    columnChildren[index % count].push(block);
  });

  return (
    <div
      className={cn(
        'w-full grid',
        gapStyles[gap],
        distributionStyles[distribution],
        stackOnMobile && 'grid-cols-1 md:grid-cols-' + (distribution === 'equal' ? count : 2)
      )}
    >
      {columnChildren.map((columnBlocks, columnIndex) => (
        <div
          key={columnIndex}
          className={cn(
            'flex flex-col',
            gapStyles[gap]
          )}
        >
          {columnBlocks.map((block) => (
            <LessonBlockRenderer
              key={block.id}
              block={block}
              isEditing={isEditing}
              selected={selectedBlockId === block.id}
              onPropChange={onPropChange}
            />
          ))}

          {isEditing && columnBlocks.length === 0 && (
            <div className="min-h-[100px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex items-center justify-center text-gray-400 flex-1">
              <span className="text-sm">Column {columnIndex + 1}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// ============================================
// GRID COMPONENT
// ============================================

interface GridProps {
  columns?: number;
  gap?: 'sm' | 'md' | 'lg';
  autoFit?: boolean;
  minColumnWidth?: number;
  children?: LessonBlock[];
  isEditing?: boolean;
  selectedBlockId?: string | null;
  onPropChange?: (blockId: string, props: Record<string, any>) => void;
}

export const Grid: React.FC<GridProps> = ({
  columns = 3,
  gap = 'md',
  autoFit = false,
  minColumnWidth = 200,
  children = [],
  isEditing,
  selectedBlockId,
  onPropChange,
}) => {
  const gapStyles = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  };

  const gridStyle = autoFit
    ? {
        gridTemplateColumns: `repeat(auto-fit, minmax(${minColumnWidth}px, 1fr))`,
      }
    : {
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      };

  return (
    <div
      className={cn('w-full grid', gapStyles[gap])}
      style={gridStyle}
    >
      {children.map((block) => (
        <LessonBlockRenderer
          key={block.id}
          block={block}
          isEditing={isEditing}
          selected={selectedBlockId === block.id}
          onPropChange={onPropChange}
        />
      ))}

      {isEditing && children.length === 0 && (
        <div className="min-h-[100px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex items-center justify-center text-gray-400 col-span-full">
          <span className="text-sm">Drop blocks here</span>
        </div>
      )}
    </div>
  );
};

// ============================================
// SPACER COMPONENT
// ============================================

interface SpacerProps {
  height?: 'sm' | 'md' | 'lg' | 'xl';
  showDivider?: boolean;
  dividerColor?: string;
}

export const Spacer: React.FC<SpacerProps> = ({
  height = 'md',
  showDivider = false,
  dividerColor = '#e5e7eb',
}) => {
  const heightStyles = {
    sm: 'h-4',
    md: 'h-8',
    lg: 'h-16',
    xl: 'h-24',
  };

  return (
    <div className={cn('w-full relative', heightStyles[height])}>
      {showDivider && (
        <div
          className="absolute top-1/2 left-0 right-0"
          style={{ 
            height: 1, 
            backgroundColor: dividerColor 
          }}
        />
      )}
    </div>
  );
};

export default Section;

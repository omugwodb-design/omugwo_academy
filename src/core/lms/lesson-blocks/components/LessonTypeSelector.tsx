import React, { useState } from 'react';
import { cn } from '../../../../lib/utils';
import {
  FileText,
  Sparkles,
  Layers,
  Play,
  Image,
  MousePointer,
  CheckCircle,
  ChevronRight,
  Zap,
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

export type LessonMode = 'standard' | 'interactive';

export interface LessonTypeOption {
  id: LessonMode;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  icon: React.FC<{ className?: string }>;
  gradient: string;
  accentColor: string;
  recommended?: boolean;
}

export interface LessonTypeSelectorProps {
  onSelect: (mode: LessonMode) => void;
  selectedMode?: LessonMode;
  showDetails?: boolean;
  className?: string;
}

// ============================================
// LESSON TYPE OPTIONS
// ============================================

const LESSON_TYPE_OPTIONS: LessonTypeOption[] = [
  {
    id: 'standard',
    title: 'Standard Lesson',
    subtitle: 'Text & Media',
    description: 'Create traditional lessons with rich text, embedded media, videos, images, and basic quizzes. Perfect for straightforward content delivery.',
    features: [
      'Rich text content with formatting',
      'Embedded videos and images',
      'PDF attachments and downloads',
      'Basic knowledge checks',
      'Quick to create and edit',
    ],
    icon: FileText,
    gradient: 'from-blue-500 to-cyan-500',
    accentColor: 'blue',
    recommended: false,
  },
  {
    id: 'interactive',
    title: 'Interactive Lesson',
    subtitle: 'Advanced Builder',
    description: 'Design immersive learning experiences with scene-based navigation, interactive components, visual storytelling, and adaptive learning paths.',
    features: [
      'Scene-based lesson structure',
      'Immersive visual backgrounds',
      'Interactive components (flip cards, hotspots, accordions)',
      'Branching scenarios and simulations',
      'Gamification and progress tracking',
      'Animated transitions',
      'Adaptive learning logic',
    ],
    icon: Sparkles,
    gradient: 'from-purple-500 to-pink-500',
    accentColor: 'purple',
    recommended: true,
  },
];

// ============================================
// COMPONENT PREVIEW CARDS
// ============================================

const StandardPreview: React.FC = () => (
  <div className="relative w-full h-48 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
    {/* Simulated standard lesson layout */}
    <div className="p-4 space-y-3">
      {/* Title */}
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
      {/* Text blocks */}
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/5" />
      </div>
      {/* Image placeholder */}
      <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg w-full flex items-center justify-center">
        <Image className="w-8 h-8 text-gray-400" />
      </div>
      {/* Video placeholder */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
          <Play className="w-4 h-4 text-blue-500" />
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded flex-1" />
      </div>
    </div>
    {/* Label */}
    <div className="absolute bottom-2 right-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/50 rounded text-xs font-medium text-blue-600 dark:text-blue-400">
      Traditional Layout
    </div>
  </div>
);

const InteractivePreview: React.FC = () => (
  <div className="relative w-full h-48 bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900 rounded-xl overflow-hidden border border-purple-500/30">
    {/* Animated background effect */}
    <div className="absolute inset-0 opacity-30">
      <div className="absolute top-0 left-1/4 w-32 h-32 bg-purple-500 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-pink-500 rounded-full blur-2xl animate-pulse delay-500" />
    </div>
    
    {/* Scene-based layout */}
    <div className="relative p-4 space-y-3">
      {/* Scene indicator */}
      <div className="flex items-center gap-2">
        <div className="px-2 py-0.5 bg-white/20 backdrop-blur rounded text-xs text-white font-medium">
          Scene 1 of 4
        </div>
        <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full w-1/4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" />
        </div>
      </div>
      
      {/* Interactive content */}
      <div className="flex gap-2">
        {/* Flip card */}
        <div className="flex-1 h-16 bg-gradient-to-br from-purple-500/50 to-pink-500/50 backdrop-blur rounded-lg border border-white/20 flex items-center justify-center">
          <MousePointer className="w-6 h-6 text-white" />
        </div>
        {/* Accordion */}
        <div className="flex-1 space-y-1">
          <div className="h-4 bg-white/20 backdrop-blur rounded text-xs text-white px-2 flex items-center">
            Click to reveal
          </div>
          <div className="h-4 bg-white/10 backdrop-blur rounded text-xs text-white/50 px-2" />
          <div className="h-4 bg-white/10 backdrop-blur rounded text-xs text-white/50 px-2" />
        </div>
      </div>
      
      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex gap-1">
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className={cn(
                "w-2 h-2 rounded-full",
                i === 1 ? "bg-white" : "bg-white/30"
              )}
            />
          ))}
        </div>
        <div className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs text-white font-medium flex items-center gap-1">
          Continue
          <ChevronRight className="w-3 h-3" />
        </div>
      </div>
    </div>
    
    {/* Label */}
    <div className="absolute bottom-2 right-2 px-2 py-1 bg-purple-500/50 backdrop-blur rounded text-xs font-medium text-white">
      Immersive Experience
    </div>
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================

export const LessonTypeSelector: React.FC<LessonTypeSelectorProps> = ({
  onSelect,
  selectedMode,
  showDetails = true,
  className,
}) => {
  const [hoveredMode, setHoveredMode] = useState<LessonMode | null>(null);
  const [expandedMode, setExpandedMode] = useState<LessonMode | null>(null);

  const handleSelect = (mode: LessonMode) => {
    onSelect(mode);
  };

  const toggleExpand = (mode: LessonMode) => {
    setExpandedMode(expandedMode === mode ? null : mode);
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
          Choose Lesson Type
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Select the format that best fits your content and teaching style
        </p>
      </div>

      {/* Type Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {LESSON_TYPE_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedMode === option.id;
          const isHovered = hoveredMode === option.id;
          const isExpanded = expandedMode === option.id;

          return (
            <div
              key={option.id}
              onMouseEnter={() => setHoveredMode(option.id)}
              onMouseLeave={() => setHoveredMode(null)}
              onClick={() => handleSelect(option.id)}
              className={cn(
                'relative group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300',
                'border-2',
                isSelected
                  ? `border-${option.accentColor}-500 ring-4 ring-${option.accentColor}-500/20 shadow-xl`
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600',
                isHovered && !isSelected && 'shadow-lg scale-[1.02]',
                isSelected && 'scale-[1.02]'
              )}
            >
              {/* Recommended Badge */}
              {option.recommended && (
                <div className={cn(
                  'absolute -top-0 -right-0 px-3 py-1 text-xs font-bold text-white z-10',
                  `bg-gradient-to-r ${option.gradient}`
                )}>
                  <Zap className="w-3 h-3 inline mr-1" />
                  Recommended
                </div>
              )}

              {/* Card Header */}
              <div className={cn(
                'p-6 pb-4',
                isSelected
                  ? `bg-gradient-to-br ${option.gradient} text-white`
                  : 'bg-gray-50 dark:bg-gray-800'
              )}>
                <div className="flex items-start gap-4">
                  <div className={cn(
                    'w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0',
                    isSelected
                      ? 'bg-white/20 backdrop-blur'
                      : `bg-gradient-to-br ${option.gradient}`
                  )}>
                    <Icon className={cn(
                      'w-7 h-7',
                      isSelected ? 'text-white' : 'text-white'
                    )} />
                  </div>
                  <div className="flex-1">
                    <h3 className={cn(
                      'text-xl font-black',
                      isSelected ? 'text-white' : 'text-gray-900 dark:text-white'
                    )}>
                      {option.title}
                    </h3>
                    <p className={cn(
                      'text-sm font-medium',
                      isSelected ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
                    )}>
                      {option.subtitle}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <CheckCircle className={cn(`w-5 h-5 text-${option.accentColor}-500`)} />
                    </div>
                  )}
                </div>
              </div>

              {/* Preview */}
              <div className="p-4 bg-white dark:bg-gray-900">
                {option.id === 'standard' ? <StandardPreview /> : <InteractivePreview />}
              </div>

              {/* Description */}
              <div className="p-6 pt-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {option.description}
                </p>

                {/* Features Toggle */}
                {showDetails && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpand(option.id);
                      }}
                      className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      <span>Features</span>
                      <ChevronRight className={cn(
                        'w-4 h-4 transition-transform',
                        isExpanded && 'rotate-90'
                      )} />
                    </button>

                    {/* Features List */}
                    <div className={cn(
                      'overflow-hidden transition-all duration-300',
                      isExpanded ? 'max-h-96 mt-3' : 'max-h-0'
                    )}>
                      <ul className="space-y-2">
                        {option.features.map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                          >
                            <div className={cn(
                              'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                              isSelected
                                ? 'bg-white/20'
                                : 'bg-gray-100 dark:bg-gray-800'
                            )}>
                              <CheckCircle className={cn(
                                'w-3 h-3',
                                isSelected
                                  ? 'text-white'
                                  : `text-${option.accentColor}-500`
                              )} />
                            </div>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>

              {/* Selection Indicator */}
              {isSelected && (
                <div className={cn(
                  'absolute inset-0 pointer-events-none',
                  `ring-4 ring-${option.accentColor}-500/20 rounded-2xl`
                )} />
              )}
            </div>
          );
        })}
      </div>

      {/* Comparison Table (Optional) */}
      {showDetails && (
        <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Quick Comparison
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 text-gray-500 dark:text-gray-400 font-medium">Feature</th>
                  <th className="text-center py-2 text-gray-500 dark:text-gray-400 font-medium">Standard</th>
                  <th className="text-center py-2 text-gray-500 dark:text-gray-400 font-medium">Interactive</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {[
                  { feature: 'Rich Text', standard: true, interactive: true },
                  { feature: 'Videos & Images', standard: true, interactive: true },
                  { feature: 'Basic Quizzes', standard: true, interactive: true },
                  { feature: 'Scene-Based Navigation', standard: false, interactive: true },
                  { feature: 'Immersive Backgrounds', standard: false, interactive: true },
                  { feature: 'Interactive Components', standard: false, interactive: true },
                  { feature: 'Branching Scenarios', standard: false, interactive: true },
                  { feature: 'Gamification', standard: false, interactive: true },
                  { feature: 'Animated Transitions', standard: false, interactive: true },
                  { feature: 'Adaptive Learning', standard: false, interactive: true },
                  { feature: 'Creation Time', standard: 'Fast', interactive: 'Moderate' },
                  { feature: 'Learning Curve', standard: 'Low', interactive: 'Medium' },
                ].map((row, index) => (
                  <tr key={index}>
                    <td className="py-2 text-gray-700 dark:text-gray-300">{row.feature}</td>
                    <td className="py-2 text-center">
                      {typeof row.standard === 'boolean' ? (
                        row.standard ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-gray-300 dark:text-gray-600">—</span>
                        )
                      ) : (
                        <span className="text-gray-600 dark:text-gray-400">{row.standard}</span>
                      )}
                    </td>
                    <td className="py-2 text-center">
                      {typeof row.interactive === 'boolean' ? (
                        row.interactive ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-gray-300 dark:text-gray-600">—</span>
                        )
                      ) : (
                        <span className="text-gray-600 dark:text-gray-400">{row.interactive}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Action Hint */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-400 dark:text-gray-500">
          {selectedMode
            ? `Selected: ${selectedMode === 'standard' ? 'Standard Lesson' : 'Interactive Lesson'} — Click "Continue" to proceed`
            : 'Select a lesson type to continue'}
        </p>
      </div>
    </div>
  );
};

export default LessonTypeSelector;

// Interactive Learning Components - Adapt Learning-style interactive blocks
// Apple-inspired design with smooth animations and elegant UI

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { cn } from '../../../../lib/utils';
import {
  RotateCcw,
  ChevronDown,
  ChevronRight,
  Target,
  Clock,
  GitBranch,
  Images,
  Sliders,
  CheckCircle,
  BarChart2,
  Link,
  ListOrdered,
  TextCursor,
  Check,
  X,
  ArrowRight,
  ArrowLeft,
  Play,
  Pause,
  Eye,
  EyeOff,
  Lightbulb,
  AlertCircle,
  Sparkles,
  FileText,
  Download,
  Award,
  ListChecks,
  MessageSquare,
  Send,
  Grid as GridIcon,
  HelpCircle,
  Info,
} from 'lucide-react';
import { InlineText } from '../../../sitebuilder/components/InlineText';

// ============================================
// HERO COMPONENT
// ============================================

interface HeroProps {
  image: string;
  title: string;
  subtitle?: string;
  height?: 'small' | 'medium' | 'large' | 'full';
  alignment?: 'left' | 'center' | 'right';
  overlayOpacity?: number;
  overlayColor?: string;
  isEditing?: boolean;
  onUpdate?: (props: any) => void;
}

export const HeroImage: React.FC<HeroProps> = ({
  image,
  title,
  subtitle,
  height = 'large',
  alignment = 'center',
  overlayOpacity = 50,
  overlayColor = '#000000',
  isEditing,
  onUpdate,
}) => {
  const heightClass = {
    small: 'h-[30vh] min-h-[300px]',
    medium: 'h-[50vh] min-h-[400px]',
    large: 'h-[70vh] min-h-[500px]',
    full: 'h-screen min-h-[600px]',
  }[height];

  const alignmentClass = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
  }[alignment];

  return (
    <div className={cn('relative w-full overflow-hidden rounded-2xl', heightClass)}>
      {/* Background Image */}
      {image ? (
        <img
          src={image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
          <Images className="w-16 h-16 text-gray-400" />
        </div>
      )}

      {/* Overlay */}
      <div 
        className="absolute inset-0 mix-blend-multiply"
        style={{ 
          backgroundColor: overlayColor,
          opacity: overlayOpacity / 100
        }}
      />

      {/* Content */}
      <div className={cn(
        'relative h-full flex flex-col justify-center px-8 md:px-16 max-w-5xl mx-auto z-10',
        alignmentClass
      )}>
        <InlineText
          element="h1"
          className="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg leading-tight"
          value={title}
          onChange={(val) => onUpdate?.({ title: val })}
          selected={isEditing}
          placeholder="Hero Title"
        />
        {(subtitle || isEditing) && (
          <InlineText
            element="p"
            className="text-xl md:text-2xl text-white/90 drop-shadow-md max-w-3xl"
            value={subtitle || ''}
            onChange={(val) => onUpdate?.({ subtitle: val })}
            selected={isEditing}
            placeholder="Add a subtitle..."
          />
        )}
      </div>
    </div>
  );
};

// ============================================
// FLIP CARD COMPONENT
// ============================================

interface FlipCardProps {
  frontContent: string;
  backContent: string;
  frontImage?: string;
  backImage?: string;
  flipDirection?: 'horizontal' | 'vertical';
  color?: string;
  completionRequired?: boolean;
  onFlip?: () => void;
  isEditing?: boolean;
  onUpdate?: (props: any) => void;
}

export const FlipCard: React.FC<FlipCardProps> = ({
  frontContent,
  backContent,
  frontImage,
  backImage,
  flipDirection = 'horizontal',
  color = '#6366f1',
  completionRequired,
  onFlip,
  isEditing,
  onUpdate,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleFlip = () => {
    if (isEditing) return;
    setIsFlipped(!isFlipped);
    if (!hasInteracted) {
      setHasInteracted(true);
      onFlip?.();
    }
  };

  const flipTransform = flipDirection === 'horizontal'
    ? 'rotate-y-180'
    : 'rotate-x-180';

  return (
    <div
      className="relative w-full perspective-1000 cursor-pointer group"
      onClick={handleFlip}
      style={{ minHeight: '300px' }}
    >
      <div
        className={cn(
          'relative w-full h-full transition-transform duration-700 ease-out transform-gpu',
          'preserve-3d min-h-[300px]',
          isFlipped && flipDirection === 'horizontal' && '[transform:rotateY(180deg)]',
          isFlipped && flipDirection === 'vertical' && '[transform:rotateX(180deg)]'
        )}
      >
        {/* Front Face */}
        <div
          className={cn(
            'absolute inset-0 w-full h-full backface-hidden overflow-hidden',
            'rounded-2xl flex flex-col',
            'shadow-lg hover:shadow-xl transition-shadow duration-300',
            'border border-white/20'
          )}
          style={{ backgroundColor: color }}
        >
          {frontImage ? (
            <>
              <div className="absolute inset-0 z-0">
                <img
                  src={frontImage}
                  alt=""
                  className="w-full h-full object-cover opacity-60 mix-blend-overlay transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="relative z-10 p-8 flex flex-col items-center justify-center text-center h-full">
                <InlineText
                  element="h3"
                  className="text-white font-bold text-2xl md:text-3xl drop-shadow-md leading-tight"
                  value={frontContent}
                  onChange={(val) => onUpdate?.({ frontContent: val })}
                  selected={isEditing}
                />
                <div className="mt-8 inline-flex items-center gap-2 text-white/90 text-sm font-medium bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm">
                  <RotateCcw className="w-4 h-4" />
                  <span>Click to reveal</span>
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 flex flex-col items-center justify-center text-center h-full">
              <InlineText
                element="h3"
                className="text-white font-bold text-2xl md:text-3xl leading-tight"
                value={frontContent}
                onChange={(val) => onUpdate?.({ frontContent: val })}
                selected={isEditing}
              />
              <div className="mt-8 flex items-center gap-2 text-white/70 text-sm bg-black/10 px-4 py-2 rounded-full">
                <RotateCcw className="w-4 h-4" />
                <span>Click to reveal</span>
              </div>
            </div>
          )}
        </div>

        {/* Back Face */}
        <div
          className={cn(
            'absolute inset-0 w-full h-full backface-hidden overflow-hidden',
            'rounded-2xl flex flex-col',
            'bg-white dark:bg-gray-900 shadow-xl',
            'border border-gray-200 dark:border-gray-700',
            flipDirection === 'horizontal' && '[transform:rotateY(180deg)]',
            flipDirection === 'vertical' && '[transform:rotateX(180deg)]'
          )}
        >
          {backImage && (
            <div className="h-40 w-full relative shrink-0">
              <img
                src={backImage}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-gray-900 to-transparent" />
            </div>
          )}
          
          <div className={cn("p-8 flex-1 flex flex-col justify-center", !backImage && "items-center text-center")}>
            <div className="prose prose-blue dark:prose-invert max-w-none w-full">
              <InlineText
                element="div"
                className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg"
                value={backContent}
                onChange={(val) => onUpdate?.({ backContent: val })}
                selected={isEditing}
              />
            </div>
            
            {hasInteracted && completionRequired && (
              <div className={cn("mt-6 flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-bold bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-lg w-fit", !backImage && "mx-auto")}>
                <CheckCircle className="w-4 h-4" />
                <span>Completed</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// ACCORDION COMPONENT
// ============================================

interface AccordionItem {
  title: string;
  content: string;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  style?: 'default' | 'bordered' | 'minimal';
  completionRequired?: boolean;
  onComplete?: () => void;
  isEditing?: boolean;
  onUpdate?: (props: any) => void;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  style = 'default',
  completionRequired,
  onComplete,
  isEditing,
  onUpdate,
}) => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const [viewedItems, setViewedItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    if (isEditing) return;

    const newOpenItems = new Set(openItems);
    const newViewedItems = new Set(viewedItems);

    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
      newViewedItems.add(index);
    }

    if (!allowMultiple && newOpenItems.size > 1) {
      newOpenItems.clear();
      newOpenItems.add(index);
    }

    setOpenItems(newOpenItems);
    setViewedItems(newViewedItems);

    if (completionRequired && newViewedItems.size === items.length) {
      onComplete?.();
    }
  };

  const containerStyles = {
    default: 'divide-y divide-gray-200 dark:divide-gray-700 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900',
    bordered: 'space-y-2',
    minimal: 'space-y-1',
  };

  const itemStyles = {
    default: '',
    bordered: 'rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden',
    minimal: 'rounded-lg bg-gray-50 dark:bg-gray-800/50',
  };

  return (
    <div className={cn('w-full', containerStyles[style])}>
      {items.map((item, index) => {
        const isOpen = openItems.has(index);
        const isViewed = viewedItems.has(index);

        return (
          <div
            key={index}
            className={cn(
              'transition-all duration-200',
              style !== 'default' && itemStyles[style]
            )}
          >
            <button
              onClick={() => toggleItem(index)}
              className={cn(
                'w-full flex items-center justify-between p-4 text-left',
                'hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset'
              )}
            >
              <div className="flex items-center gap-3">
                {completionRequired && (
                  <span className={cn(
                    'w-5 h-5 rounded-full flex items-center justify-center text-xs',
                    isViewed
                      ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
                  )}>
                    {isViewed ? <Check className="w-3 h-3" /> : index + 1}
                  </span>
                )}
                <InlineText
                  element="span"
                  className="font-semibold text-gray-900 dark:text-white"
                  value={item.title}
                  onChange={(val) => {
                    const next = [...items];
                    next[index].title = val;
                    onUpdate?.({ items: next });
                  }}
                  selected={isEditing}
                />
              </div>
              <ChevronDown
                className={cn(
                  'w-5 h-5 text-gray-400 transition-transform duration-300',
                  isOpen && 'rotate-180'
                )}
              />
            </button>

            <div
              className={cn(
                'overflow-hidden transition-all duration-300 ease-out',
                isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              )}
            >
              <div className="p-4 pt-0 text-gray-600 dark:text-gray-300">
                <InlineText
                  element="div"
                  value={item.content}
                  onChange={(val) => {
                    const next = [...items];
                    next[index].content = val;
                    onUpdate?.({ items: next });
                  }}
                  selected={isEditing}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ============================================
// TABS COMPONENT
// ============================================

interface TabItem {
  label: string;
  content: string;
}

interface TabsProps {
  tabs: TabItem[];
  style?: 'default' | 'pills' | 'underline';
  position?: 'top' | 'left';
  completionRequired?: boolean;
  onComplete?: () => void;
  isEditing?: boolean;
  onUpdate?: (props: any) => void;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  style = 'default',
  position = 'top',
  completionRequired,
  onComplete,
  isEditing,
  onUpdate,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [viewedTabs, setViewedTabs] = useState<Set<number>>(new Set([0]));

  const handleTabChange = (index: number) => {
    if (isEditing) return;
    setActiveTab(index);
    const newViewedTabs = new Set(viewedTabs);
    newViewedTabs.add(index);
    setViewedTabs(newViewedTabs);

    if (completionRequired && newViewedTabs.size === tabs.length) {
      onComplete?.();
    }
  };

  const tabStyles = {
    default: {
      list: 'flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg',
      tab: (isActive: boolean) => cn(
        'px-4 py-2 rounded-md font-medium transition-all duration-200',
        isActive
          ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
      ),
    },
    pills: {
      list: 'flex gap-2',
      tab: (isActive: boolean) => cn(
        'px-4 py-2 rounded-full font-medium transition-all duration-200',
        isActive
          ? 'bg-primary-500 text-white'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
      ),
    },
    underline: {
      list: 'flex gap-4 border-b border-gray-200 dark:border-gray-700',
      tab: (isActive: boolean) => cn(
        'px-4 py-2 font-medium transition-all duration-200 border-b-2 -mb-px',
        isActive
          ? 'border-primary-500 text-primary-600 dark:text-primary-400'
          : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
      ),
    },
  };

  const isVertical = position === 'left';

  return (
    <div className={cn('w-full', isVertical && 'flex gap-4')}>
      {/* Tab List */}
      <div
        className={cn(
          isVertical ? 'flex-col w-48 shrink-0' : 'flex-row',
          tabStyles[style].list
        )}
        role="tablist"
      >
        {tabs.map((tab, index) => {
          const isActive = activeTab === index;
          const isViewed = viewedTabs.has(index);

          return (
            <button
              key={index}
              role="tab"
              aria-selected={isActive}
              onClick={() => handleTabChange(index)}
              className={cn(
                tabStyles[style].tab(isActive),
                'flex items-center gap-2'
              )}
            >
              {completionRequired && (
                <span className={cn(
                  'w-4 h-4 rounded-full flex items-center justify-center text-[10px]',
                  isViewed
                    ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                )}>
                  {isViewed ? <Check className="w-2.5 h-2.5" /> : ''}
                </span>
              )}
              <InlineText
                element="span"
                value={tab.label}
                onChange={(val) => {
                  const next = [...tabs];
                  next[index].label = val;
                  onUpdate?.({ tabs: next });
                }}
                selected={isEditing}
              />
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div
        className={cn(
          'flex-1 p-4 bg-white dark:bg-gray-900 rounded-lg',
          style === 'default' && 'border border-gray-200 dark:border-gray-700'
        )}
        role="tabpanel"
      >
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <InlineText
            element="div"
            value={tabs[activeTab]?.content}
            onChange={(val) => {
              const next = [...tabs];
              next[activeTab].content = val;
              onUpdate?.({ tabs: next });
            }}
            selected={isEditing}
          />
        </div>
      </div>
    </div>
  );
};

// ============================================
// HOTSPOT IMAGE COMPONENT
// ============================================

interface Hotspot {
  x: number;
  y: number;
  label?: string;
  content: string;
}

interface HotspotImageProps {
  image: string;
  hotspots: Hotspot[];
  hotspotStyle?: 'pulse' | 'static' | 'icon';
  completionRequired?: boolean;
  onComplete?: () => void;
  isEditing?: boolean;
  onUpdate?: (props: any) => void;
}

export const HotspotImage: React.FC<HotspotImageProps> = ({
  image,
  hotspots,
  hotspotStyle = 'pulse',
  completionRequired,
  onComplete,
  isEditing,
  onUpdate,
}) => {
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const [clickedHotspots, setClickedHotspots] = useState<Set<number>>(new Set());

  const handleHotspotClick = (index: number) => {
    if (isEditing) return;

    setActiveHotspot(activeHotspot === index ? null : index);

    const newClicked = new Set(clickedHotspots);
    newClicked.add(index);
    setClickedHotspots(newClicked);

    if (completionRequired && newClicked.size === hotspots.length) {
      onComplete?.();
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 shadow-sm overflow-hidden">
      {/* Image Container */}
      <div className="relative flex-1 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 min-h-[300px]">
        {image ? (
          <img
            src={image}
            alt="Hotspot interactive area"
            className="w-full h-auto object-contain"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 min-h-[300px]">
            <Target className="w-12 h-12 mb-2 opacity-50" />
            <p className="text-sm">Add background image</p>
          </div>
        )}

        {/* Hotspots */}
        {hotspots.map((hotspot, index) => {
          const isActive = activeHotspot === index;
          const isClicked = clickedHotspots.has(index);

          return (
            <div
              key={index}
              className="absolute z-10"
              style={{
                left: `${hotspot.x}%`,
                top: `${hotspot.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {/* Hotspot Button */}
              <button
                onClick={() => handleHotspotClick(index)}
                className={cn(
                  'relative w-10 h-10 rounded-full flex items-center justify-center',
                  'transition-all duration-300 transform',
                  hotspotStyle === 'pulse' && !isClicked && !isActive && 'animate-pulse',
                  isActive
                    ? 'bg-blue-600 text-white scale-110 shadow-lg ring-4 ring-blue-600/30'
                    : isClicked
                      ? 'bg-green-500 text-white shadow-md'
                      : 'bg-white text-gray-800 shadow-md hover:scale-105 hover:bg-gray-50'
                )}
              >
                {isClicked ? (
                  <Check className="w-5 h-5" />
                ) : hotspotStyle === 'icon' ? (
                  <Info className="w-5 h-5" />
                ) : (
                  <span className="font-bold">{index + 1}</span>
                )}

                {/* Pulse Ring */}
                {hotspotStyle === 'pulse' && !isClicked && !isActive && (
                  <span className="absolute inset-0 rounded-full border-2 border-blue-500 animate-ping opacity-75" />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Info Panel Container - Appears on side in desktop, bottom in mobile */}
      <div className={cn(
        "flex-1 md:max-w-md transition-all duration-500",
        activeHotspot !== null ? "opacity-100 translate-x-0" : "opacity-50"
      )}>
        {activeHotspot !== null ? (
          <div className="h-full bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800/50 flex flex-col">
            <div className="flex items-center gap-3 mb-4 border-b border-blue-200/50 dark:border-blue-800/50 pb-4">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                {activeHotspot + 1}
              </div>
              <InlineText
                element="h3"
                className="text-xl font-bold text-blue-900 dark:text-blue-100 flex-1"
                value={hotspots[activeHotspot].label || `Point ${activeHotspot + 1}`}
                onChange={(val) => {
                  const next = [...hotspots];
                  next[activeHotspot].label = val;
                  onUpdate?.({ hotspots: next });
                }}
                selected={isEditing}
                placeholder="Add a title..."
              />
            </div>
            
            <div className="prose prose-blue dark:prose-invert max-w-none flex-1">
              <InlineText
                element="div"
                className="text-gray-700 dark:text-gray-300 leading-relaxed"
                value={hotspots[activeHotspot].content}
                onChange={(val) => {
                  const next = [...hotspots];
                  next[activeHotspot].content = val;
                  onUpdate?.({ hotspots: next });
                }}
                selected={isEditing}
                placeholder="Describe this part of the image in detail..."
              />
            </div>
            
            <div className="mt-6 flex items-center justify-between text-sm text-blue-600 dark:text-blue-400 font-medium">
              <span>{clickedHotspots.size} of {hotspots.length} discovered</span>
              <button 
                onClick={() => setActiveHotspot(null)}
                className="px-3 py-1.5 bg-blue-100 dark:bg-blue-800/50 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl text-gray-500">
            <Target className="w-12 h-12 mb-4 opacity-20" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Explore the Image</h3>
            <p className="text-sm">Click on the numbered markers on the image to reveal more information.</p>
            
            {/* Progress indicator */}
            <div className="mt-8 w-full max-w-xs">
              <div className="flex justify-between text-xs mb-2">
                <span>Discovery Progress</span>
                <span className="font-bold">{Math.round((clickedHotspots.size / hotspots.length) * 100) || 0}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-500" 
                  style={{ width: `${(clickedHotspots.size / hotspots.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// TIMELINE COMPONENT
// ============================================

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
}

interface TimelineProps {
  events: TimelineEvent[];
  orientation?: 'vertical' | 'horizontal';
  style?: 'default' | 'cards' | 'minimal';
  completionRequired?: boolean;
  onComplete?: () => void;
  isEditing?: boolean;
  onUpdate?: (props: any) => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  events,
  orientation = 'vertical',
  style = 'default',
  completionRequired,
  onComplete,
  isEditing,
  onUpdate,
}) => {
  const [viewedEvents, setViewedEvents] = useState<Set<number>>(new Set());
  const [activeEvent, setActiveEvent] = useState<number | null>(null);

  const handleEventView = (index: number) => {
    if (isEditing) return;

    setActiveEvent(activeEvent === index ? null : index);
    const newViewed = new Set(viewedEvents);
    newViewed.add(index);
    setViewedEvents(newViewed);

    if (completionRequired && newViewed.size === events.length) {
      onComplete?.();
    }
  };

  const isVertical = orientation === 'vertical';

  return (
    <div
      className={cn(
        'w-full',
        isVertical ? 'flex flex-col' : 'flex flex-row overflow-x-auto pb-4'
      )}
    >
      {events.map((event, index) => {
        const isViewed = viewedEvents.has(index);
        const isActive = activeEvent === index;
        const isLast = index === events.length - 1;

        return (
          <div
            key={index}
            className={cn(
              'flex',
              isVertical
                ? 'flex-row'
                : 'flex-col items-center',
              !isLast && (isVertical ? 'pb-4' : 'pr-8')
            )}
          >
            {/* Date/Marker */}
            <div
              className={cn(
                'flex flex-col items-center',
                isVertical ? 'mr-4' : 'mb-2'
              )}
            >
              <button
                onClick={() => handleEventView(index)}
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center',
                  'font-semibold text-sm transition-all duration-200',
                  isActive
                    ? 'bg-primary-500 text-white scale-110'
                    : isViewed
                      ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
                  style === 'cards' && 'shadow-md'
                )}
              >
                {isViewed ? <Check className="w-5 h-5" /> : index + 1}
              </button>

              {/* Connector Line */}
              {!isLast && (
                <div
                  className={cn(
                    'bg-gray-200 dark:bg-gray-700',
                    isVertical
                      ? 'w-0.5 flex-1 min-h-[40px] mt-2'
                      : 'h-0.5 w-8 ml-10'
                  )}
                />
              )}
            </div>

            {/* Content */}
            <div
              className={cn(
                'flex-1',
                style === 'cards' && [
                  'p-4 rounded-xl',
                  'bg-white dark:bg-gray-900',
                  'border border-gray-200 dark:border-gray-700',
                  'shadow-sm',
                  isActive && 'ring-2 ring-primary-500'
                ]
              )}
            >
              <InlineText
                element="p"
                className="text-xs text-gray-500 dark:text-gray-400 mb-1"
                value={event.date}
                onChange={(val) => {
                  const next = [...events];
                  next[index].date = val;
                  onUpdate?.({ events: next });
                }}
                selected={isEditing}
              />
              <InlineText
                element="h4"
                className="font-semibold text-gray-900 dark:text-white mb-1"
                value={event.title}
                onChange={(val) => {
                  const next = [...events];
                  next[index].title = val;
                  onUpdate?.({ events: next });
                }}
                selected={isEditing}
              />
              {(style !== 'minimal' || isActive) && (
                <InlineText
                  element="p"
                  className="text-sm text-gray-600 dark:text-gray-300"
                  value={event.description}
                  onChange={(val) => {
                    const next = [...events];
                    next[index].description = val;
                    onUpdate?.({ events: next });
                  }}
                  selected={isEditing}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ============================================
// KNOWLEDGE CHECK COMPONENT
// ============================================

interface KnowledgeCheckOption {
  text: string;
  correct: boolean;
}

interface KnowledgeCheckProps {
  question: string;
  type: 'single' | 'multiple';
  options: KnowledgeCheckOption[];
  feedback?: {
    correct: string;
    incorrect: string;
  };
  allowRetry?: boolean;
  showFeedback?: boolean;
  completionRequired?: boolean;
  onComplete?: () => void;
  isEditing?: boolean;
  onUpdate?: (props: any) => void;
}

export const KnowledgeCheck: React.FC<KnowledgeCheckProps> = ({
  question,
  type = 'single',
  options,
  feedback = { correct: 'Correct!', incorrect: 'Try again.' },
  allowRetry = true,
  showFeedback = true,
  completionRequired,
  onComplete,
  isEditing,
  onUpdate,
}) => {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleSelect = (index: number) => {
    if (isEditing || (submitted && !allowRetry)) return;

    if (type === 'single') {
      setSelected(new Set([index]));
    } else {
      const newSelected = new Set(selected);
      if (newSelected.has(index)) {
        newSelected.delete(index);
      } else {
        newSelected.add(index);
      }
      setSelected(newSelected);
    }

    if (submitted) {
      setSubmitted(false);
    }
  };

  const handleSubmit = () => {
    if (selected.size === 0) return;

    setSubmitted(true);
    setAttempts(prev => prev + 1);

    // Check if correct
    const correctIndices = options
      .map((opt, idx) => (opt.correct ? idx : -1))
      .filter(idx => idx !== -1);

    const selectedArray = Array.from(selected);
    const correct =
      selectedArray.length === correctIndices.length &&
      selectedArray.every(idx => correctIndices.includes(idx));

    setIsCorrect(correct);

    if (correct && completionRequired) {
      onComplete?.();
    }
  };

  const handleRetry = () => {
    setSelected(new Set());
    setSubmitted(false);
    setIsCorrect(false);
  };

  return (
    <div className="w-full p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
      {/* Question */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="w-5 h-5 text-primary-500" />
          <span className="text-xs font-semibold text-primary-500 uppercase tracking-wider">
            Knowledge Check
          </span>
        </div>
        <InlineText
          element="p"
          className="text-lg font-semibold text-gray-900 dark:text-white"
          value={question}
          onChange={(val) => onUpdate?.({ question: val })}
          selected={isEditing}
        />
        <p className="text-xs text-gray-500 mt-1">
          {type === 'single' ? 'Select one answer' : 'Select all correct answers'}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-2 mb-4">
        {options.map((option, index) => {
          const isSelected = selected.has(index);
          const showCorrect = submitted && option.correct;
          const showIncorrect = submitted && isSelected && !option.correct;

          return (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={submitted && !allowRetry}
              className={cn(
                'w-full flex items-center gap-3 p-4 rounded-xl text-left',
                'transition-all duration-200',
                'border-2',
                isSelected && !submitted && [
                  'border-primary-500',
                  'bg-primary-50 dark:bg-primary-950/30'
                ],
                !isSelected && !submitted && [
                  'border-gray-200 dark:border-gray-700',
                  'hover:border-gray-300 dark:hover:border-gray-600',
                  'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                ],
                showCorrect && [
                  'border-green-500 bg-green-50 dark:bg-green-950/30'
                ],
                showIncorrect && [
                  'border-red-500 bg-red-50 dark:bg-red-950/30'
                ],
                submitted && !allowRetry && 'cursor-default'
              )}
            >
              {/* Selection Indicator */}
              <div
                className={cn(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                  'transition-all duration-200',
                  type === 'single' ? 'rounded-full' : 'rounded-md',
                  isSelected
                    ? 'border-primary-500 bg-primary-500'
                    : 'border-gray-300 dark:border-gray-600',
                  showCorrect && 'border-green-500 bg-green-500',
                  showIncorrect && 'border-red-500 bg-red-500'
                )}
              >
                {isSelected && (
                  type === 'single'
                    ? <div className="w-2 h-2 rounded-full bg-white" />
                    : <Check className="w-3 h-3 text-white" />
                )}
                {showCorrect && <Check className="w-3 h-3 text-white" />}
                {showIncorrect && <X className="w-3 h-3 text-white" />}
              </div>

              <InlineText
                element="span"
                className={cn(
                  'font-medium',
                  showCorrect && 'text-green-700 dark:text-green-400',
                  showIncorrect && 'text-red-700 dark:text-red-400',
                  !showCorrect && !showIncorrect && 'text-gray-900 dark:text-white'
                )}
                value={option.text}
                onChange={(val) => {
                  const next = [...options];
                  next[index].text = val;
                  onUpdate?.({ options: next });
                }}
                selected={isEditing}
              />
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {submitted && showFeedback && (
        <div
          className={cn(
            'p-4 rounded-xl mb-4 flex items-start gap-3',
            'animate-in fade-in slide-in-from-bottom-4 duration-300',
            isCorrect
              ? 'bg-green-100 dark:bg-green-950/30 border border-green-200 dark:border-green-800'
              : 'bg-red-100 dark:bg-red-950/30 border border-red-200 dark:border-red-800'
          )}
        >
          {isCorrect ? (
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
          )}
          <p
            className={cn(
              'font-medium',
              isCorrect
                ? 'text-green-700 dark:text-green-300'
                : 'text-red-700 dark:text-red-300'
            )}
          >
            {isCorrect ? feedback.correct : feedback.incorrect}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        {!submitted && (
          <button
            onClick={handleSubmit}
            disabled={selected.size === 0}
            className={cn(
              'px-6 py-2 rounded-xl font-semibold',
              'transition-all duration-200',
              selected.size > 0
                ? 'bg-primary-500 text-white hover:bg-primary-600'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
            )}
          >
            Submit Answer
          </button>
        )}

        {submitted && !isCorrect && allowRetry && (
          <button
            onClick={handleRetry}
            className={cn(
              'px-6 py-2 rounded-xl font-semibold',
              'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
              'hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors'
            )}
          >
            Try Again
          </button>
        )}

        {submitted && (
          <span className="text-xs text-gray-500">
            Attempt {attempts}
          </span>
        )}
      </div>
    </div>
  );
};

// ============================================
// SCENARIO COMPONENT (Branching)
// ============================================

interface ScenarioChoice {
  label: string;
  nextId: string;
}

interface ScenarioNode {
  id: string;
  content: string;
  choices: ScenarioChoice[];
}

interface ScenarioProps {
  title: string;
  scenario: ScenarioNode;
  nodes: ScenarioNode[];
  completionRequired?: boolean;
  onComplete?: () => void;
  isEditing?: boolean;
  onUpdate?: (props: any) => void;
}

export const Scenario: React.FC<ScenarioProps> = ({
  title,
  scenario,
  nodes,
  completionRequired,
  onComplete,
  isEditing,
  onUpdate,
}) => {
  const [currentNode, setCurrentNode] = useState<ScenarioNode>(scenario);
  const [history, setHistory] = useState<string[]>(['start']);
  const [isComplete, setIsComplete] = useState(false);

  const handleChoice = (choice: ScenarioChoice) => {
    if (isEditing) return;

    const nextNode = nodes.find(n => n.id === choice.nextId) ||
      { id: choice.nextId, content: 'End of scenario', choices: [] };

    setCurrentNode(nextNode);
    setHistory([...history, choice.nextId]);

    if (nextNode.choices.length === 0) {
      setIsComplete(true);
      if (completionRequired) {
        onComplete?.();
      }
    }
  };

  const handleRestart = () => {
    setCurrentNode(scenario);
    setHistory(['start']);
    setIsComplete(false);
  };

  const handleGoBack = () => {
    if (history.length <= 1) return;
    const newHistory = history.slice(0, -1);
    const prevId = newHistory[newHistory.length - 1];
    const prevNode = prevId === 'start'
      ? scenario
      : nodes.find(n => n.id === prevId) || scenario;

    setCurrentNode(prevNode);
    setHistory(newHistory);
    setIsComplete(false);
  };

  return (
    <div className="w-full p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-200 dark:border-indigo-800">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <GitBranch className="w-5 h-5 text-indigo-500" />
        <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">
          Interactive Scenario
        </span>
      </div>

      <InlineText
        element="h3"
        className="text-xl font-bold text-gray-900 dark:text-white mb-4"
        value={title}
        onChange={(val) => onUpdate?.({ title: val })}
        selected={isEditing}
      />

      {/* Progress */}
      <div className="flex items-center gap-2 mb-4">
        {history.map((_, index) => (
          <div
            key={index}
            className={cn(
              'w-2 h-2 rounded-full',
              index === history.length - 1
                ? 'bg-indigo-500'
                : 'bg-indigo-200 dark:bg-indigo-800'
            )}
          />
        ))}
      </div>

      {/* Current Content */}
      <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 mb-4">
        <InlineText
          element="p"
          className="text-gray-700 dark:text-gray-300"
          value={currentNode.content}
          onChange={(val) => {
            if (currentNode.id === scenario.id) {
              onUpdate?.({ scenario: { ...scenario, content: val } });
            } else {
              const nextNodes = nodes.map(n => n.id === currentNode.id ? { ...n, content: val } : n);
              onUpdate?.({ nodes: nextNodes });
            }
          }}
          selected={isEditing}
        />
      </div>

      {/* Choices */}
      {currentNode.choices.length > 0 ? (
        <div className="space-y-2">
          {currentNode.choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => handleChoice(choice)}
              disabled={isEditing}
              className={cn(
                'w-full flex items-center justify-between p-4 rounded-xl',
                'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700',
                'hover:border-indigo-300 dark:hover:border-indigo-700',
                'hover:bg-indigo-50 dark:hover:bg-indigo-950/30',
                'transition-all duration-200',
                'group'
              )}
            >
              <span className="font-medium text-gray-900 dark:text-white">
                {choice.label}
              </span>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center">
          {isComplete && (
            <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 mb-4">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Scenario Complete</span>
            </div>
          )}
          <button
            onClick={handleRestart}
            className="px-6 py-2 rounded-xl font-semibold bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
          >
            Start Over
          </button>
        </div>
      )}

      {/* Back Button */}
      {history.length > 1 && currentNode.choices.length > 0 && (
        <button
          onClick={handleGoBack}
          className="mt-4 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <ArrowLeft className="w-4 h-4" />
          Go back
        </button>
      )}
    </div>
  );
};

// ============================================
// CAROUSEL COMPONENT
// ============================================

interface CarouselItem {
  image: string;
  caption?: string;
}

interface CarouselProps {
  items: CarouselItem[];
  autoplay?: boolean;
  autoplaySpeed?: number;
  showDots?: boolean;
  showArrows?: boolean;
  completionRequired?: boolean;
  onComplete?: () => void;
  isEditing?: boolean;
  onUpdate?: (props: any) => void;
}

export const Carousel: React.FC<CarouselProps> = ({
  items,
  autoplay = false,
  autoplaySpeed = 5000,
  showDots = true,
  showArrows = true,
  completionRequired,
  onComplete,
  isEditing,
  onUpdate,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewedSlides, setViewedSlides] = useState<Set<number>>(new Set([0]));
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isPlaying && !isEditing) {
      timerRef.current = setInterval(() => {
        setCurrentIndex(prev => {
          const next = (prev + 1) % items.length;
          handleView(next);
          return next;
        });
      }, autoplaySpeed);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, autoplaySpeed, items.length, isEditing]);

  const handleView = (index: number) => {
    const newViewed = new Set(viewedSlides);
    newViewed.add(index);
    setViewedSlides(newViewed);

    if (completionRequired && newViewed.size === items.length) {
      onComplete?.();
    }
  };

  const goTo = (index: number) => {
    if (isEditing) return;
    setCurrentIndex(index);
    handleView(index);
  };

  const goNext = () => {
    const next = (currentIndex + 1) % items.length;
    goTo(next);
  };

  const goPrev = () => {
    const prev = (currentIndex - 1 + items.length) % items.length;
    goTo(prev);
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
      {/* Slides */}
      <div className="relative aspect-video">
        {items.map((item, index) => (
          <div
            key={index}
            className={cn(
              'absolute inset-0 transition-opacity duration-500',
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            )}
          >
            {item.image ? (
              <img
                src={item.image}
                alt={item.caption || ''}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                <Images className="w-16 h-16 text-gray-400" />
              </div>
            )}

            {item.caption && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <InlineText
                  element="p"
                  className="text-white font-medium"
                  value={item.caption}
                  onChange={(val) => {
                    const next = [...items];
                    next[index].caption = val;
                    onUpdate?.({ items: next });
                  }}
                  selected={isEditing}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {showArrows && items.length > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-900 transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Play/Pause */}
      {autoplay && (
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-900 transition-colors"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
      )}

      {/* Dots */}
      {showDots && items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-200',
                index === currentIndex
                  ? 'bg-white w-4'
                  : 'bg-white/50 hover:bg-white/75'
              )}
            />
          ))}
        </div>
      )}

      {/* Progress indicator */}
      {completionRequired && (
        <div className="absolute top-4 left-4 z-20 flex gap-1">
          {items.map((_, index) => (
            <div
              key={index}
              className={cn(
                'w-1.5 h-1.5 rounded-full',
                viewedSlides.has(index)
                  ? 'bg-green-400'
                  : 'bg-white/30'
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================
// COMPARISON SLIDER COMPONENT
// ============================================

interface ComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  orientation?: 'horizontal' | 'vertical';
  startPosition?: number;
  isEditing?: boolean;
  onUpdate?: (props: any) => void;
}

export const ComparisonSlider: React.FC<ComparisonSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After',
  orientation = 'horizontal',
  startPosition = 50,
  isEditing,
  onUpdate,
}) => {
  const [position, setPosition] = useState(startPosition);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current || isEditing) return;

    const rect = containerRef.current.getBoundingClientRect();
    const newPos = orientation === 'horizontal'
      ? ((clientX - rect.left) / rect.width) * 100
      : ((clientY - rect.top) / rect.height) * 100;

    setPosition(Math.max(0, Math.min(100, newPos)));
  }, [orientation, isEditing]);

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    handleMove(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX, e.touches[0].clientY);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video rounded-2xl overflow-hidden cursor-ew-resize select-none"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {/* After Image (Bottom Layer) */}
      <img
        src={afterImage}
        alt={afterLabel}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* After Label */}
      <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/80 dark:bg-gray-900/80 text-sm font-medium">
        <InlineText
          element="span"
          value={afterLabel}
          onChange={(val) => onUpdate?.({ afterLabel: val })}
          selected={isEditing}
        />
      </div>

      {/* Before Image (Top Layer with clip) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          clipPath: orientation === 'horizontal'
            ? `inset(0 ${100 - position}% 0 0)`
            : `inset(0 0 ${100 - position}% 0)`
        }}
      >
        <img
          src={beforeImage}
          alt={beforeLabel}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Before Label */}
        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/80 dark:bg-gray-900/80 text-sm font-medium">
          <InlineText
            element="span"
            value={beforeLabel}
            onChange={(val) => onUpdate?.({ beforeLabel: val })}
            selected={isEditing}
          />
        </div>
      </div>

      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize"
        style={{
          left: orientation === 'horizontal' ? `${position}%` : undefined,
          top: orientation === 'vertical' ? undefined : 0,
          bottom: orientation === 'vertical' ? undefined : 0,
          height: orientation === 'horizontal' ? '100%' : undefined,
          width: orientation === 'vertical' ? '100%' : 4,
          transform: orientation === 'horizontal' ? 'translateX(-50%)' : undefined,
        }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center">
          <Sliders className="w-5 h-5 text-gray-600" />
        </div>
      </div>
    </div>
  );
};

// ============================================
// PROCESS STEPS COMPONENT
// ============================================

interface ProcessStep {
  title: string;
  description: string;
  icon?: string;
}

interface ProcessStepsProps {
  steps: ProcessStep[];
  style?: 'numbered' | 'icons' | 'timeline';
  allowNavigation?: boolean;
  completionRequired?: boolean;
  onComplete?: () => void;
  isEditing?: boolean;
  onUpdate?: (props: any) => void;
}

export const ProcessSteps: React.FC<ProcessStepsProps> = ({
  steps,
  style = 'numbered',
  allowNavigation = true,
  completionRequired,
  onComplete,
  isEditing,
  onUpdate,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const goToStep = (index: number) => {
    if (isEditing) return;
    if (!allowNavigation && index > currentStep) return;

    setCurrentStep(index);
    const newCompleted = new Set(completedSteps);
    for (let i = 0; i < index; i++) {
      newCompleted.add(i);
    }
    setCompletedSteps(newCompleted);

    if (index === steps.length - 1 && completionRequired) {
      newCompleted.add(index);
      setCompletedSteps(newCompleted);
      if (newCompleted.size === steps.length) {
        onComplete?.();
      }
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      goToStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  };

  return (
    <div className="w-full">
      {/* Step Indicators */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.has(index);
          const isCurrent = currentStep === index;
          const isAccessible = allowNavigation || index <= currentStep;

          return (
            <button
              key={index}
              onClick={() => isAccessible && goToStep(index)}
              disabled={!isAccessible}
              className={cn(
                'flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200',
                isCurrent && 'bg-primary-50 dark:bg-primary-950/30',
                isCompleted && 'text-green-600 dark:text-green-400',
                isCurrent && 'text-primary-600 dark:text-primary-400',
                !isCurrent && !isCompleted && 'text-gray-400',
                isAccessible && 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50',
                !isAccessible && 'cursor-not-allowed opacity-50'
              )}
            >
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center font-bold',
                  'transition-all duration-200',
                  isCompleted && 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
                  isCurrent && !isCompleted && 'bg-primary-500 text-white',
                  !isCurrent && !isCompleted && 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : style === 'numbered' ? (
                  index + 1
                ) : (
                  step.icon || index + 1
                )}
              </div>
              <InlineText
                element="span"
                className="text-xs font-medium max-w-[80px] text-center truncate"
                value={step.title}
                onChange={(val) => {
                  const next = [...steps];
                  next[index].title = val;
                  onUpdate?.({ steps: next });
                }}
                selected={isEditing}
              />
            </button>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <InlineText
          element="h4"
          className="text-lg font-bold text-gray-900 dark:text-white mb-2"
          value={steps[currentStep].title}
          onChange={(val) => {
            const next = [...steps];
            next[currentStep].title = val;
            onUpdate?.({ steps: next });
          }}
          selected={isEditing}
        />
        <InlineText
          element="p"
          className="text-gray-600 dark:text-gray-300 mb-4"
          value={steps[currentStep].description}
          onChange={(val) => {
            const next = [...steps];
            next[currentStep].description = val;
            onUpdate?.({ steps: next });
          }}
          selected={isEditing}
        />

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl font-medium',
              'transition-all duration-200',
              currentStep > 0
                ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
            )}
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          <span className="text-sm text-gray-500">
            Step {currentStep + 1} of {steps.length}
          </span>

          <button
            onClick={nextStep}
            disabled={currentStep === steps.length - 1}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl font-medium',
              'transition-all duration-200',
              currentStep < steps.length - 1
                ? 'bg-primary-500 text-white hover:bg-primary-600'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
            )}
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// POLL COMPONENT
// ============================================

interface PollOption {
  text: string;
  votes: number;
}

interface PollProps {
  question: string;
  options: PollOption[];
  showResults?: boolean;
  allowMultiple?: boolean;
  onVote?: (selectedIndices: number[]) => void;
  isEditing?: boolean;
  onUpdate?: (props: any) => void;
}

export const Poll: React.FC<PollProps> = ({
  question,
  options,
  showResults = true,
  allowMultiple = false,
  onVote,
  isEditing,
  onUpdate,
}) => {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [hasVoted, setHasVoted] = useState(false);

  const totalVotes = options.reduce((sum, opt) => sum + opt.votes, 0);

  const handleSelect = (index: number) => {
    if (isEditing || hasVoted) return;

    if (allowMultiple) {
      const newSelected = new Set(selected);
      if (newSelected.has(index)) {
        newSelected.delete(index);
      } else {
        newSelected.add(index);
      }
      setSelected(newSelected);
    } else {
      setSelected(new Set([index]));
    }
  };

  const handleVote = () => {
    if (selected.size === 0) return;
    setHasVoted(true);
    onVote?.(Array.from(selected));
  };

  return (
    <div className="w-full p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <BarChart2 className="w-5 h-5 text-amber-500" />
        <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">
          Poll
        </span>
      </div>

      <InlineText
        element="h3"
        className="text-lg font-bold text-gray-900 dark:text-white mb-4"
        value={question}
        onChange={(val) => onUpdate?.({ question: val })}
        selected={isEditing}
      />

      {/* Options */}
      <div className="space-y-2 mb-4">
        {options.map((option, index) => {
          const isSelected = selected.has(index);
          const percentage = totalVotes > 0
            ? Math.round((option.votes / totalVotes) * 100)
            : 0;

          return (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={hasVoted || isEditing}
              className={cn(
                'w-full relative overflow-hidden rounded-xl',
                'transition-all duration-200',
                !hasVoted && 'hover:scale-[1.01]'
              )}
            >
              {/* Progress Bar Background */}
              {hasVoted && showResults && (
                <div
                  className="absolute inset-0 bg-amber-200 dark:bg-amber-900/30 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              )}

              <div
                className={cn(
                  'relative flex items-center justify-between p-4 rounded-xl',
                  'border-2 transition-all duration-200',
                  isSelected && !hasVoted && 'border-amber-500 bg-amber-50 dark:bg-amber-950/30',
                  !isSelected && !hasVoted && 'border-gray-200 dark:border-gray-700',
                  hasVoted && isSelected && 'border-amber-500',
                  hasVoted && !isSelected && 'border-transparent'
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'w-5 h-5 border-2 flex items-center justify-center transition-all',
                      allowMultiple ? 'rounded-md' : 'rounded-full',
                      isSelected
                        ? 'border-amber-500 bg-amber-500'
                        : 'border-gray-300 dark:border-gray-600'
                    )}
                  >
                    {isSelected && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <InlineText
                    element="span"
                    className="font-medium text-gray-900 dark:text-white"
                    value={option.text}
                    onChange={(val) => {
                      const next = [...options];
                      next[index].text = val;
                      onUpdate?.({ options: next });
                    }}
                    selected={isEditing}
                  />
                </div>

                {hasVoted && showResults && (
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {percentage}%
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Actions */}
      {!hasVoted && (
        <button
          onClick={handleVote}
          disabled={selected.size === 0}
          className={cn(
            'w-full py-3 rounded-xl font-semibold transition-all duration-200',
            selected.size > 0
              ? 'bg-amber-500 text-white hover:bg-amber-600'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
          )}
        >
          Submit Vote
        </button>
      )}

      {hasVoted && showResults && (
        <p className="text-center text-sm text-gray-500">
          {totalVotes} total votes
        </p>
      )}
    </div>
  );
};

// ============================================
// MATCHING EXERCISE COMPONENT
// ============================================

interface MatchingPair {
  left: string;
  right: string;
}

interface MatchingExerciseProps {
  instructions: string;
  pairs: MatchingPair[];
  shuffle?: boolean;
  completionRequired?: boolean;
  onComplete?: () => void;
  isEditing?: boolean;
  onUpdate?: (props: any) => void;
}

export const MatchingExercise: React.FC<MatchingExerciseProps> = ({
  instructions,
  pairs,
  shuffle: shouldShuffle = true,
  completionRequired,
  onComplete,
  isEditing,
  onUpdate,
}) => {
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  // Shuffle right items
  const [rightItems] = useState(() => {
    const items = pairs.map(p => p.right);
    if (shouldShuffle) {
      return items.sort(() => Math.random() - 0.5);
    }
    return items;
  });

  const handleLeftSelect = (left: string) => {
    if (isEditing || isComplete) return;
    setSelectedLeft(left);
  };

  const handleRightSelect = (right: string) => {
    if (isEditing || isComplete || !selectedLeft) return;

    const newMatches = { ...matches };

    // Remove any existing match for this left item
    Object.keys(newMatches).forEach(key => {
      if (newMatches[key] === right) {
        delete newMatches[key];
      }
    });

    newMatches[selectedLeft] = right;
    setMatches(newMatches);
    setSelectedLeft(null);

    // Check if all matched
    if (Object.keys(newMatches).length === pairs.length) {
      const allCorrect = pairs.every(
        pair => newMatches[pair.left] === pair.right
      );

      if (allCorrect) {
        setIsComplete(true);
        if (completionRequired) {
          onComplete?.();
        }
      }
    }
  };

  const handleReset = () => {
    setMatches({});
    setSelectedLeft(null);
    setIsComplete(false);
  };

  return (
    <div className="w-full p-6 rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 border border-cyan-200 dark:border-cyan-800">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Link className="w-5 h-5 text-cyan-500" />
        <span className="text-xs font-semibold text-cyan-500 uppercase tracking-wider">
          Matching Exercise
        </span>
      </div>

      <InlineText
        element="p"
        className="text-gray-600 dark:text-gray-300 mb-6"
        value={instructions}
        onChange={(val) => onUpdate?.({ instructions: val })}
        selected={isEditing}
      />

      <div className="grid grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-2">
          {pairs.map((pair, index) => {
            const isSelected = selectedLeft === pair.left;
            const isMatched = matches[pair.left];
            const isCorrect = isMatched === pair.right;

            return (
              <button
                key={index}
                onClick={() => handleLeftSelect(pair.left)}
                disabled={isEditing || isComplete}
                className={cn(
                  'w-full p-4 rounded-xl text-left font-medium',
                  'transition-all duration-200',
                  'border-2',
                  isSelected && 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/30',
                  isMatched && isCorrect && 'border-green-500 bg-green-50 dark:bg-green-950/30',
                  isMatched && !isCorrect && 'border-red-500 bg-red-50 dark:bg-red-950/30',
                  !isSelected && !isMatched && 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                )}
              >
                <InlineText
                  element="span"
                  value={pair.left}
                  onChange={(val) => {
                    const next = [...pairs];
                    next[index].left = val;
                    onUpdate?.({ pairs: next });
                  }}
                  selected={isEditing}
                />
              </button>
            );
          })}
        </div>

        {/* Right Column */}
        <div className="space-y-2">
          {rightItems.map((right, index) => {
            const isMatched = Object.values(matches).includes(right);
            const isTargeted = selectedLeft !== null;

            return (
              <button
                key={index}
                onClick={() => handleRightSelect(right)}
                disabled={isEditing || isComplete || isMatched}
                className={cn(
                  'w-full p-4 rounded-xl text-left font-medium',
                  'transition-all duration-200',
                  'border-2',
                  isMatched && 'border-green-500 bg-green-50 dark:bg-green-950/30',
                  !isMatched && isTargeted && 'border-cyan-300 dark:border-cyan-700 hover:border-cyan-500',
                  !isMatched && !isTargeted && 'border-gray-200 dark:border-gray-700'
                )}
              >
                <InlineText
                  element="span"
                  value={right}
                  onChange={(val) => {
                    // Update right in pairs if matched, or just directly in data
                    // For matching, updating right is tricky because it's a separate list
                    // but usually it maps to a pair.
                    const pairIndex = pairs.findIndex(p => p.right === right);
                    if (pairIndex !== -1) {
                      const next = [...pairs];
                      next[pairIndex].right = val;
                      onUpdate?.({ pairs: next });
                    }
                  }}
                  selected={isEditing}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Status */}
      {isComplete && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">All matched correctly!</span>
          </div>
          <button
            onClick={handleReset}
            className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================
// SORTING EXERCISE COMPONENT
// ============================================

interface SortingItem {
  text: string;
  order: number;
}

interface SortingExerciseProps {
  instructions: string;
  items: SortingItem[];
  completionRequired?: boolean;
  onComplete?: () => void;
  isEditing?: boolean;
  onUpdate?: (props: any) => void;
}

export const SortingExercise: React.FC<SortingExerciseProps> = ({
  instructions,
  items,
  completionRequired,
  onComplete,
  isEditing,
  onUpdate,
}) => {
  const [currentItems, setCurrentItems] = useState(() =>
    [...items].sort(() => Math.random() - 0.5)
  );
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const handleDragStart = (index: number) => {
    if (isEditing || isComplete) return;
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newItems = [...currentItems];
    const [draggedItem] = newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, draggedItem);
    setCurrentItems(newItems);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    checkCompletion();
  };

  const checkCompletion = () => {
    const isCorrect = currentItems.every(
      (item, index) => item.order === index + 1
    );

    if (isCorrect) {
      setIsComplete(true);
      if (completionRequired) {
        onComplete?.();
      }
    }
  };

  const handleReset = () => {
    setCurrentItems([...items].sort(() => Math.random() - 0.5));
    setIsComplete(false);
  };

  return (
    <div className="w-full p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <ListOrdered className="w-5 h-5 text-emerald-500" />
        <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">
          Sorting Exercise
        </span>
      </div>

      <InlineText
        element="p"
        className="text-gray-600 dark:text-gray-300 mb-6"
        value={instructions}
        onChange={(val) => onUpdate?.({ instructions: val })}
        selected={isEditing}
      />

      <div className="space-y-2">
        {currentItems.map((item, index) => (
          <div
            key={item.text}
            draggable={!isEditing && !isComplete}
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={cn(
              'flex items-center gap-3 p-4 rounded-xl',
              'bg-white dark:bg-gray-900 border-2',
              'transition-all duration-200',
              draggedIndex === index && 'opacity-50 scale-95',
              !isEditing && !isComplete && 'cursor-grab active:cursor-grabbing',
              isComplete && 'border-green-500'
            )}
          >
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center',
                'font-bold text-sm',
                isComplete
                  ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              )}
            >
              {index + 1}
            </div>
            <InlineText
              element="span"
              className="font-medium text-gray-900 dark:text-white"
              value={item.text}
              onChange={(val) => {
                const next = [...items];
                next[index].text = val;
                onUpdate?.({ items: next });
              }}
              selected={isEditing}
            />
          </div>
        ))}
      </div>

      {/* Status */}
      {isComplete && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Correct order!</span>
          </div>
          <button
            onClick={handleReset}
            className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================
// FILL IN THE BLANK COMPONENT
// ============================================

interface BlankAnswer {
  id: string;
  answer: string;
  hints?: string[];
}

interface FillBlankProps {
  text: string;
  blanks: BlankAnswer[];
  caseSensitive?: boolean;
  completionRequired?: boolean;
  onComplete?: () => void;
  isEditing?: boolean;
  onUpdate?: (props: any) => void;
}

export const FillBlank: React.FC<FillBlankProps> = ({
  text,
  blanks,
  caseSensitive = false,
  completionRequired,
  onComplete,
  isEditing,
  onUpdate,
}) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Parse text and replace blanks with inputs
  const parseText = () => {
    let result = text;
    blanks.forEach(blank => {
      result = result.replace(
        `[${blank.answer}]`,
        `__BLANK_${blank.id}__`
      );
    });
    return result.split(/(__BLANK_\w+__)/);
  };

  const handleAnswerChange = (blankId: string, value: string) => {
    if (isEditing || submitted) return;
    setAnswers(prev => ({ ...prev, [blankId]: value }));
  };

  const checkAnswers = () => {
    const allCorrect = blanks.every(blank => {
      const userAnswer = answers[blank.id] || '';
      const correctAnswer = blank.answer;

      if (caseSensitive) {
        return userAnswer === correctAnswer;
      }
      return userAnswer.toLowerCase() === correctAnswer.toLowerCase();
    });

    if (allCorrect) {
      setIsComplete(true);
      if (completionRequired) {
        onComplete?.();
      }
    }

    setSubmitted(true);
  };

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
    setIsComplete(false);
  };

  const isAnswerCorrect = (blankId: string) => {
    if (!submitted) return null;
    const blank = blanks.find(b => b.id === blankId);
    if (!blank) return false;

    const userAnswer = answers[blankId] || '';
    if (caseSensitive) {
      return userAnswer === blank.answer;
    }
    return userAnswer.toLowerCase() === blank.answer.toLowerCase();
  };

  return (
    <div className="w-full p-6 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 border border-violet-200 dark:border-violet-800">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <TextCursor className="w-5 h-5 text-violet-500" />
        <span className="text-xs font-semibold text-violet-500 uppercase tracking-wider">
          Fill in the Blank
        </span>
      </div>

      {/* Text with blanks */}
      <div className="text-lg text-gray-900 dark:text-white leading-relaxed mb-4">
        {parseText().map((part, index) => {
          if (part.startsWith('__BLANK_')) {
            const blankId = part.replace('__BLANK_', '').replace('__', '');
            const blank = blanks.find(b => b.id === blankId);
            const isCorrect = isAnswerCorrect(blankId);

            return (
              <span key={index} className="inline-flex items-center mx-1">
                <input
                  type="text"
                  value={answers[blankId] || ''}
                  onChange={(e) => handleAnswerChange(blankId, e.target.value)}
                  disabled={isEditing || submitted}
                  placeholder={blank?.answer.length ? '_'.repeat(blank.answer.length) : '____'}
                  className={cn(
                    'w-32 px-2 py-1 rounded-lg text-center font-medium',
                    'border-2 transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-violet-500',
                    submitted && isCorrect && 'border-green-500 bg-green-50 dark:bg-green-950/30',
                    submitted && !isCorrect && 'border-red-500 bg-red-50 dark:bg-red-950/30',
                    !submitted && 'border-violet-300 dark:border-violet-700 bg-white dark:bg-gray-900'
                  )}
                />
              </span>
            );
          }
          return <span key={index}>{part}</span>;
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {!submitted && (
          <button
            onClick={checkAnswers}
            disabled={Object.keys(answers).length !== blanks.length}
            className={cn(
              'px-6 py-2 rounded-xl font-semibold',
              'transition-all duration-200',
              Object.keys(answers).length === blanks.length
                ? 'bg-violet-500 text-white hover:bg-violet-600'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
            )}
          >
            Check Answers
          </button>
        )}

        {submitted && !isComplete && (
          <button
            onClick={handleRetry}
            className="px-6 py-2 rounded-xl font-semibold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Try Again
          </button>
        )}

        {isComplete && (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">All correct!</span>
          </div>
        )}
      </div>
    </div>
  );
};


// ============================================
// RESOURCE BLOCK COMPONENT
// ============================================

interface ResourceItem {
  title: string;
  description: string;
  url: string;
  type: 'pdf' | 'link' | 'video' | 'file';
}

interface ResourceProps {
  title: string;
  resources: ResourceItem[];
  isEditing?: boolean;
  onUpdate?: (props: any) => void;
}

export const Resource: React.FC<ResourceProps> = ({ title, resources, isEditing, onUpdate }) => {
  return (
    <div className="w-full p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="w-5 h-5 text-blue-500" />
        <InlineText
          element="h3"
          className="text-xl font-bold text-gray-900 dark:text-white"
          value={title}
          onChange={(val) => onUpdate?.({ title: val })}
          selected={isEditing}
        />
      </div>
      <div className="grid gap-4">
        {resources.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                {item.type === 'pdf' ? <FileText className="w-5 h-5" /> : <Download className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <InlineText
                  element="p"
                  className="font-bold text-gray-900 dark:text-white"
                  value={item.title}
                  onChange={(val) => {
                    const next = [...resources];
                    next[idx].title = val;
                    onUpdate?.({ resources: next });
                  }}
                  selected={isEditing}
                />
                <InlineText
                  element="p"
                  className="text-sm text-gray-500 dark:text-gray-400"
                  value={item.description}
                  onChange={(val) => {
                    const next = [...resources];
                    next[idx].description = val;
                    onUpdate?.({ resources: next });
                  }}
                  selected={isEditing}
                />
              </div>
            </div>
            <a href={item.url} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-white dark:bg-gray-700 shadow-sm text-gray-400 hover:text-blue-500 transition-colors">
              <Link className="w-4 h-4" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// REFLECTION BLOCK COMPONENT
// ============================================

interface ReflectionProps {
  prompt: string;
  placeholder?: string;
  isEditing?: boolean;
  onUpdate?: (props: any) => void;
}

export const Reflection: React.FC<ReflectionProps> = ({ prompt, placeholder = "Type your thoughts here...", isEditing, onUpdate }) => {
  const [value, setValue] = useState("");
  return (
    <div className="w-full p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-amber-500" />
        <InlineText
          element="h3"
          className="text-lg font-bold text-amber-900 dark:text-amber-100"
          value={prompt}
          onChange={(val) => onUpdate?.({ prompt: val })}
          selected={isEditing}
        />
      </div>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        disabled={isEditing}
        className="w-full h-32 p-4 rounded-xl border-2 border-amber-200 dark:border-amber-800 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all resize-none"
      />
    </div>
  );
};

// ============================================
// BADGE BLOCK COMPONENT
// ============================================

interface BadgeProps {
  title: string;
  description: string;
  icon?: string;
  isEditing?: boolean;
  onUpdate?: (props: any) => void;
}

export const Badge: React.FC<BadgeProps> = ({ title, description, isEditing, onUpdate }) => {
  return (
    <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border border-yellow-200 dark:border-yellow-900 shadow-xl">
      <div className="w-20 h-20 rounded-full bg-yellow-400 flex items-center justify-center mb-4 shadow-lg animate-bounce-slow">
        <Award className="w-10 h-10 text-yellow-900" />
      </div>
      <InlineText
        element="h3"
        className="text-2xl font-black text-gray-900 dark:text-white mb-2"
        value={title}
        onChange={(val) => onUpdate?.({ title: val })}
        selected={isEditing}
      />
      <InlineText
        element="p"
        className="text-gray-600 dark:text-gray-400"
        value={description}
        onChange={(val) => onUpdate?.({ description: val })}
        selected={isEditing}
      />
    </div>
  );
};

// ============================================
// CHECKLIST BLOCK COMPONENT
// ============================================

interface ChecklistItem {
  text: string;
  checked: boolean;
}

interface ChecklistProps {
  title: string;
  items: ChecklistItem[];
  isEditing?: boolean;
  onUpdate?: (props: any) => void;
}

export const Checklist: React.FC<ChecklistProps> = ({ title, items, isEditing, onUpdate }) => {
  const [list, setList] = useState(items);
  const toggle = (idx: number) => {
    if (isEditing) return;
    const next = [...list];
    next[idx].checked = !next[idx].checked;
    setList(next);
  };
  return (
    <div className="w-full p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900">
      <div className="flex items-center gap-2 mb-4">
        <ListChecks className="w-5 h-5 text-emerald-600" />
        <InlineText
          element="h3"
          className="text-lg font-bold text-emerald-900 dark:text-emerald-100"
          value={title}
          onChange={(val) => onUpdate?.({ title: val })}
          selected={isEditing}
        />
      </div>
      <div className="space-y-2">
        {list.map((item, idx) => (
          <button
            key={idx}
            onClick={() => toggle(idx)}
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all",
              item.checked ? "bg-emerald-100 border-emerald-300 dark:bg-emerald-900/40 dark:border-emerald-700" : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700"
            )}
          >
            <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors", item.checked ? "bg-emerald-500 border-emerald-500" : "border-gray-300 dark:border-gray-600")}>
              {item.checked && <Check className="w-4 h-4 text-white" />}
            </div>
            <InlineText
              element="span"
              className={cn("font-medium transition-all", item.checked ? "text-emerald-900 dark:text-emerald-100 line-through opacity-70" : "text-gray-900 dark:text-white")}
              value={item.text}
              onChange={(val) => {
                const next = [...list];
                next[idx].text = val;
                onUpdate?.({ items: next });
              }}
              selected={isEditing}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

// ============================================
// DISCUSSION BLOCK COMPONENT
// ============================================

interface DiscussionProps {
  title: string;
  prompt: string;
  isEditing?: boolean;
  onUpdate?: (props: any) => void;
}

export const Discussion: React.FC<DiscussionProps> = ({ title, prompt, isEditing, onUpdate }) => {
  return (
    <div className="w-full p-6 rounded-2xl bg-violet-50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-900">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-5 h-5 text-violet-600" />
        <InlineText
          element="h3"
          className="text-lg font-bold text-violet-900 dark:text-violet-100"
          value={title}
          onChange={(val) => onUpdate?.({ title: val })}
          selected={isEditing}
        />
      </div>
      <div className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-violet-100 dark:border-violet-800 mb-4 shadow-sm">
        <InlineText
          element="p"
          className="text-gray-700 dark:text-gray-300"
          value={prompt}
          onChange={(val) => onUpdate?.({ prompt: val })}
          selected={isEditing}
        />
      </div>
      <div className="flex gap-2">
        <div className="flex-1 h-10 px-4 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex items-center text-gray-400 text-sm">
          Join the discussion...
        </div>
        <button disabled={isEditing} className="p-2.5 rounded-full bg-violet-600 text-white shadow-lg hover:bg-violet-700 transition-colors">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ============================================
// EXERCISE SUBMISSION COMPONENT
// ============================================

interface ExerciseProps {
  title: string;
  instructions: string;
  onUpload?: (file: File) => void;
  isEditing?: boolean;
  onUpdate?: (props: any) => void;
}

export const Exercise: React.FC<ExerciseProps> = ({ title, instructions, isEditing, onUpdate }) => {
  return (
    <div className="w-full p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <Send className="w-24 h-24" />
      </div>
      <div className="relative z-10">
        <InlineText
          element="h3"
          className="text-2xl font-black text-gray-900 dark:text-white mb-4"
          value={title}
          onChange={(val) => onUpdate?.({ title: val })}
          selected={isEditing}
        />
        <InlineText
          element="p"
          className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed"
          value={instructions}
          onChange={(val) => onUpdate?.({ instructions: val })}
          selected={isEditing}
        />
        <div className="flex flex-col gap-4">
          <textarea className="w-full h-40 p-6 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700 focus:border-primary-500 outline-none transition-colors resize-none" placeholder="Your response..." disabled={isEditing} />
          <button disabled={isEditing} className="w-full py-4 rounded-2xl bg-primary-600 text-white font-black uppercase tracking-widest shadow-lg shadow-primary-600/20 hover:bg-primary-700 transition-all flex items-center justify-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Submit Exercise
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// GRID BLOCK COMPONENT
// ============================================

interface GridProps {
  columns?: number;
  gap?: number;
  children: React.ReactNode;
  isEditing?: boolean;
  onUpdate?: (props: any) => void;
}

export const Grid: React.FC<GridProps> = ({ columns = 2, gap = 4, children, isEditing, onUpdate }) => {
  return (
    <div
      className="grid w-full"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: `${gap * 0.25}rem`
      }}
    >
      {children}
    </div>
  );
};

export default FlipCard;

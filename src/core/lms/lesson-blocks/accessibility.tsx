// Accessibility Utilities for Lesson Blocks
// Keyboard navigation, screen reader support, and WCAG compliance helpers

import React, { useEffect, useCallback, useRef, useState } from 'react';
import { LessonBlock } from './types';

// ============================================
// KEYBOARD NAVIGATION HOOKS
// ============================================

// Hook for managing focus within a container (roving tabindex)
export const useRovingTabIndex = <T extends HTMLElement>(
  items: { id: string; disabled?: boolean }[],
  orientation: 'horizontal' | 'vertical' = 'vertical'
) => {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const containerRef = useRef<T>(null);

  const enabledItems = items.filter((item) => !item.disabled);
  const enabledIndices = items
    .map((item, index) => (!item.disabled ? index : -1))
    .filter((i) => i !== -1);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const currentEnabledIndex = enabledIndices.indexOf(focusedIndex);
      
      switch (e.key) {
        case 'ArrowDown':
          if (orientation === 'vertical') {
            e.preventDefault();
            const nextIndex = enabledIndices[(currentEnabledIndex + 1) % enabledIndices.length];
            setFocusedIndex(nextIndex);
          }
          break;
        case 'ArrowUp':
          if (orientation === 'vertical') {
            e.preventDefault();
            const prevIndex = enabledIndices[(currentEnabledIndex - 1 + enabledIndices.length) % enabledIndices.length];
            setFocusedIndex(prevIndex);
          }
          break;
        case 'ArrowRight':
          if (orientation === 'horizontal') {
            e.preventDefault();
            const nextIndex = enabledIndices[(currentEnabledIndex + 1) % enabledIndices.length];
            setFocusedIndex(nextIndex);
          }
          break;
        case 'ArrowLeft':
          if (orientation === 'horizontal') {
            e.preventDefault();
            const prevIndex = enabledIndices[(currentEnabledIndex - 1 + enabledIndices.length) % enabledIndices.length];
            setFocusedIndex(prevIndex);
          }
          break;
        case 'Home':
          e.preventDefault();
          setFocusedIndex(enabledIndices[0]);
          break;
        case 'End':
          e.preventDefault();
          setFocusedIndex(enabledIndices[enabledIndices.length - 1]);
          break;
      }
    },
    [focusedIndex, enabledIndices, orientation]
  );

  const focusItem = useCallback((index: number) => {
    if (enabledIndices.includes(index)) {
      setFocusedIndex(index);
    }
  }, [enabledIndices]);

  return {
    containerRef,
    focusedIndex,
    focusItem,
    handleKeyDown,
    getTabIndex: (index: number) => (index === focusedIndex ? 0 : -1),
  };
};

// Hook for focus trap within a modal or dialog
export const useFocusTrap = <T extends HTMLElement>(isActive: boolean) => {
  const containerRef = useRef<T>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isActive) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      // Focus the first focusable element
      const focusableElements = containerRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements?.length) {
        (focusableElements[0] as HTMLElement).focus();
      }
    } else {
      // Restore focus when deactivated
      previousFocusRef.current?.focus();
    }
  }, [isActive]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isActive || e.key !== 'Tab') return;

      const focusableElements = containerRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements?.length) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    },
    [isActive]
  );

  return { containerRef, handleKeyDown };
};

// Hook for skip links
export const useSkipLink = (targetId: string) => {
  const handleSkip = useCallback(() => {
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [targetId]);

  return { handleSkip };
};

// ============================================
// SCREEN READER UTILITIES
// ============================================

// Announce message to screen readers
export const announceToScreenReader = (
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
) => {
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', priority);
  announcer.setAttribute('aria-atomic', 'true');
  announcer.setAttribute('class', 'sr-only');
  announcer.style.cssText = `
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  `;
  
  document.body.appendChild(announcer);
  
  // Small delay to ensure the element is in the DOM
  setTimeout(() => {
    announcer.textContent = message;
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  }, 100);
};

// Hook for announcing changes
export const useAnnouncer = () => {
  const announce = useCallback(
    (message: string, priority: 'polite' | 'assertive' = 'polite') => {
      announceToScreenReader(message, priority);
    },
    []
  );

  return { announce };
};

// ============================================
// ACCESSIBILITY COMPONENTS
// ============================================

// Visually hidden component for screen readers
export const VisuallyHidden: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <span
    style={{
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: 0,
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      border: 0,
    }}
  >
    {children}
  </span>
);

// Skip link component
interface SkipLinkProps {
  targetId: string;
  label?: string;
}

export const SkipLink: React.FC<SkipLinkProps> = ({
  targetId,
  label = 'Skip to main content',
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-500 focus:text-white focus:rounded-lg focus:shadow-lg"
    >
      {label}
    </a>
  );
};

// Live region for dynamic content announcements
interface LiveRegionProps {
  message: string;
  priority?: 'polite' | 'assertive';
  clearDelay?: number;
}

export const LiveRegion: React.FC<LiveRegionProps> = ({
  message,
  priority = 'polite',
  clearDelay = 0,
}) => {
  const [currentMessage, setCurrentMessage] = useState(message);

  useEffect(() => {
    setCurrentMessage(message);
    
    if (clearDelay > 0) {
      const timer = setTimeout(() => {
        setCurrentMessage('');
      }, clearDelay);
      
      return () => clearTimeout(timer);
    }
  }, [message, clearDelay]);

  return (
    <div
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {currentMessage}
    </div>
  );
};

// ============================================
// ARIA ATTRIBUTES HELPERS
// ============================================

// Generate unique IDs for ARIA associations
let idCounter = 0;
export const generateAriaId = (prefix: string = 'aria') => {
  return `${prefix}-${++idCounter}`;
};

// Build ARIA attributes for interactive blocks
export const buildBlockAriaProps = (
  block: LessonBlock,
  options: {
    isExpanded?: boolean;
    isSelected?: boolean;
    isDisabled?: boolean;
    hasPopup?: boolean;
    controls?: string;
    describedBy?: string;
    labelledBy?: string;
  } = {}
): Record<string, string | boolean | undefined> => {
  const props: Record<string, string | boolean | undefined> = {
    role: getBlockRole(block.type),
    'aria-label': block.props.title || block.props.content?.slice(0, 50),
  };

  if (options.isExpanded !== undefined) {
    props['aria-expanded'] = options.isExpanded;
  }

  if (options.isSelected !== undefined) {
    props['aria-selected'] = options.isSelected;
  }

  if (options.isDisabled !== undefined) {
    props['aria-disabled'] = options.isDisabled;
  }

  if (options.hasPopup) {
    props['aria-haspopup'] = true;
  }

  if (options.controls) {
    props['aria-controls'] = options.controls;
  }

  if (options.describedBy) {
    props['aria-describedby'] = options.describedBy;
  }

  if (options.labelledBy) {
    props['aria-labelledby'] = options.labelledBy;
  }

  return props;
};

// Get appropriate ARIA role for block type
export const getBlockRole = (blockType: string): string | undefined => {
  const roleMap: Record<string, string> = {
    accordion: 'region',
    tabs: 'tablist',
    tab: 'tab',
    carousel: 'region',
    slider: 'slider',
    hotspot: 'img',
    timeline: 'list',
    process: 'list',
    knowledgeCheck: 'form',
    poll: 'form',
    matching: 'form',
    sorting: 'application',
    fillBlank: 'form',
    scenario: 'application',
    flipCard: 'button',
    quiz: 'form',
    video: 'application',
    audio: 'application',
    embed: 'application',
    button: 'button',
    link: 'link',
    image: 'img',
    list: 'list',
    quote: 'blockquote',
    code: 'code',
  };

  return roleMap[blockType];
};

// ============================================
// KEYBOARD INTERACTION PATTERNS
// ============================================

// Standard keyboard interaction for interactive components
export const KEYBOARD_INTERACTIONS = {
  // Buttons
  button: {
    activate: ['Enter', 'Space'],
  },
  
  // Tabs
  tabs: {
    navigate: ['ArrowLeft', 'ArrowRight'],
    activate: ['Enter', 'Space'],
    home: ['Home'],
    end: ['End'],
  },
  
  // Accordion
  accordion: {
    navigate: ['ArrowDown', 'ArrowUp'],
    toggle: ['Enter', 'Space'],
    home: ['Home'],
    end: ['End'],
  },
  
  // Carousel
  carousel: {
    next: ['ArrowRight'],
    prev: ['ArrowLeft'],
    playPause: ['Space'],
  },
  
  // Slider
  slider: {
    increase: ['ArrowRight', 'ArrowUp'],
    decrease: ['ArrowLeft', 'ArrowDown'],
    pageIncrease: ['PageUp'],
    pageDecrease: ['PageDown'],
    home: ['Home'],
    end: ['End'],
  },
  
  // Dialog/Modal
  dialog: {
    close: ['Escape'],
    navigate: ['Tab'],
  },
  
  // Listbox
  listbox: {
    navigate: ['ArrowDown', 'ArrowUp'],
    select: ['Enter', 'Space'],
    multiSelect: ['Space'],
    home: ['Home'],
    end: ['End'],
    typeAhead: ['type'],
  },
};

// ============================================
// ACCESSIBILITY CHECK HELPER
// ============================================

export const checkAccessibility = (element: HTMLElement): string[] => {
  const issues: string[] = [];

  // Check for missing alt text on images
  if (element.tagName === 'IMG') {
    if (!element.getAttribute('alt')) {
      issues.push('Image missing alt attribute');
    }
  }

  // Check for empty buttons
  if (element.tagName === 'BUTTON') {
    const hasText = element.textContent?.trim();
    const hasAriaLabel = element.getAttribute('aria-label');
    const hasAriaLabelledBy = element.getAttribute('aria-labelledby');
    
    if (!hasText && !hasAriaLabel && !hasAriaLabelledBy) {
      issues.push('Button has no accessible name');
    }
  }

  // Check for missing labels on inputs
  if (element.tagName === 'INPUT' || element.tagName === 'SELECT' || element.tagName === 'TEXTAREA') {
    const hasLabel = element.id && document.querySelector(`label[for="${element.id}"]`);
    const hasAriaLabel = element.getAttribute('aria-label');
    const hasAriaLabelledBy = element.getAttribute('aria-labelledby');
    
    if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
      issues.push('Form control has no associated label');
    }
  }

  // Check for proper heading hierarchy
  if (/^H[1-6]$/.test(element.tagName)) {
    const level = parseInt(element.tagName[1]);
    const previousHeadings = Array.from(
      document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    ).filter((h) => {
      const hLevel = parseInt(h.tagName[1]);
      return hLevel < level && h.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING;
    });
    
    if (previousHeadings.length === 0 && level > 1) {
      issues.push(`Heading level ${level} found without preceding heading`);
    }
  }

  // Check for positive tabindex
  const tabIndex = element.getAttribute('tabindex');
  if (tabIndex && parseInt(tabIndex) > 0) {
    issues.push('Positive tabindex found - use 0 or -1');
  }

  return issues;
};

// ============================================
// FOCUS MANAGEMENT UTILITIES
// ============================================

// Get all focusable elements within a container
export const getFocusableElements = (
  container: HTMLElement
): HTMLElement[] => {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  return Array.from(container.querySelectorAll(selector)) as HTMLElement[];
};

// Focus first focusable element
export const focusFirst = (container: HTMLElement) => {
  const focusable = getFocusableElements(container);
  if (focusable.length > 0) {
    focusable[0].focus();
  }
};

// Focus last focusable element
export const focusLast = (container: HTMLElement) => {
  const focusable = getFocusableElements(container);
  if (focusable.length > 0) {
    focusable[focusable.length - 1].focus();
  }
};

// ============================================
// COLOR CONTRAST UTILITIES
// ============================================

// Calculate relative luminance
const getLuminance = (r: number, g: number, b: number): number => {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

// Calculate contrast ratio between two colors
export const getContrastRatio = (
  color1: { r: number; g: number; b: number },
  color2: { r: number; g: number; b: number }
): number => {
  const l1 = getLuminance(color1.r, color1.g, color1.b);
  const l2 = getLuminance(color2.r, color2.g, color2.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
};

// Check if contrast meets WCAG requirements
export const meetsContrastRequirements = (
  ratio: number,
  level: 'AA' | 'AAA' = 'AA',
  isLargeText: boolean = false
): boolean => {
  const requirements = {
    AA: {
      normal: 4.5,
      large: 3,
    },
    AAA: {
      normal: 7,
      large: 4.5,
    },
  };

  const threshold = requirements[level][isLargeText ? 'large' : 'normal'];
  return ratio >= threshold;
};

export default {
  useRovingTabIndex,
  useFocusTrap,
  useSkipLink,
  useAnnouncer,
  announceToScreenReader,
  VisuallyHidden,
  SkipLink,
  LiveRegion,
  generateAriaId,
  buildBlockAriaProps,
  getBlockRole,
  KEYBOARD_INTERACTIONS,
  checkAccessibility,
  getFocusableElements,
  focusFirst,
  focusLast,
  getContrastRatio,
  meetsContrastRequirements,
};

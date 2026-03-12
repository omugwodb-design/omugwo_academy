// Performance Optimization Utilities
// Lazy loading, virtualization, auto-save, and performance monitoring

import React, { useState, useEffect, useCallback, useRef, useMemo, memo } from 'react';
import { LessonBlock } from './types';

// ============================================
// LAZY LOADING HOOKS
// ============================================

// Hook for lazy loading images
export function useLazyLoad<T extends HTMLElement>(
  options: IntersectionObserverInit = {}
) {
  const ref = useRef<T>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(element);
        }
      },
      {
        rootMargin: '100px',
        threshold: 0.1,
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [options]);

  return { ref, isLoaded, setIsLoaded, isInView };
}

// Hook for lazy loading blocks with suspense-like behavior
export function useLazyBlock<T extends HTMLElement>(
  loadFn: () => Promise<void>,
  deps: React.DependencyList = []
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { ref, isInView } = useLazyLoad<T>();

  useEffect(() => {
    if (isInView && !isLoading) {
      setIsLoading(true);
      loadFn()
        .then(() => setIsLoading(false))
        .catch((err) => {
          setError(err);
          setIsLoading(false);
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView, isLoading, ...deps]);

  return { ref, isLoading, error, isInView };
}

// ============================================
// VIRTUALIZATION
// ============================================

interface VirtualListProps {
  items: unknown[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: unknown, index: number) => React.ReactNode;
  overscan?: number;
  className?: string;
}

// Virtual list component for rendering large lists efficiently
export const VirtualList: React.FC<VirtualListProps> = memo(function VirtualList({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 3,
  className,
}) {
  const [scrollTop, setScrollTop] = useState(0);

  const { startIndex, endIndex, visibleItems, totalHeight, offsetY } = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.min(
      start + Math.ceil(containerHeight / itemHeight) + overscan,
      items.length
    );
    
    return {
      startIndex: Math.max(0, start - overscan),
      endIndex: end,
      visibleItems: items.slice(Math.max(0, start - overscan), end),
      totalHeight: items.length * itemHeight,
      offsetY: Math.max(0, start - overscan) * itemHeight,
    };
  }, [items, itemHeight, containerHeight, scrollTop, overscan]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return (
    <div
      onScroll={handleScroll}
      style={{ height: containerHeight, overflow: 'auto' }}
      className={className}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            top: offsetY,
            left: 0,
            right: 0,
          }}
        >
          {visibleItems.map((item, i) => (
            <div
              key={startIndex + i}
              style={{ height: itemHeight }}
            >
              {renderItem(item, startIndex + i)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

// Hook for virtualized block rendering
export function useVirtualizedBlocks(
  blocks: LessonBlock[],
  containerHeight: number,
  blockHeight: number = 200
) {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 10 });

  const calculateVisibleRange = useCallback(
    (scrollTop: number) => {
      const start = Math.floor(scrollTop / blockHeight);
      const visibleCount = Math.ceil(containerHeight / blockHeight);
      const end = Math.min(start + visibleCount + 2, blocks.length);
      
      return {
        start: Math.max(0, start - 1),
        end,
      };
    },
    [blockHeight, containerHeight, blocks.length]
  );

  const handleScroll = useCallback(
    (scrollTop: number) => {
      setVisibleRange(calculateVisibleRange(scrollTop));
    },
    [calculateVisibleRange]
  );

  const visibleBlocks = useMemo(
    () => blocks.slice(visibleRange.start, visibleRange.end),
    [blocks, visibleRange]
  );

  return {
    visibleBlocks,
    visibleRange,
    handleScroll,
    totalHeight: blocks.length * blockHeight,
  };
}

// ============================================
// AUTO-SAVE
// ============================================

interface AutoSaveOptions {
  debounceMs?: number;
  onSave: (data: unknown) => Promise<void> | void;
  onError?: (error: Error) => void;
  onSuccess?: () => void;
}

// Hook for auto-saving with debouncing
export function useAutoSave<T>(
  data: T,
  options: AutoSaveOptions
) {
  const { debounceMs = 1000, onSave, onError, onSuccess } = options;
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousDataRef = useRef<T>(data);

  const save = useCallback(async (dataToSave: T) => {
    setIsSaving(true);
    setError(null);

    try {
      await onSave(dataToSave);
      setLastSaved(new Date());
      onSuccess?.();
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
    } finally {
      setIsSaving(false);
    }
  }, [onSave, onError, onSuccess]);

  useEffect(() => {
    // Skip if data hasn't changed
    if (JSON.stringify(data) === JSON.stringify(previousDataRef.current)) {
      return;
    }

    previousDataRef.current = data;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for debounced save
    timeoutRef.current = setTimeout(() => {
      save(data);
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, debounceMs, save]);

  const saveNow = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    save(data);
  }, [data, save]);

  return {
    isSaving,
    lastSaved,
    error,
    saveNow,
  };
}

// Auto-save status indicator component
interface AutoSaveIndicatorProps {
  isSaving: boolean;
  lastSaved: Date | null;
  error: Error | null;
  className?: string;
}

export const AutoSaveIndicator: React.FC<AutoSaveIndicatorProps> = ({
  isSaving,
  lastSaved,
  error,
  className,
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`flex items-center gap-2 text-sm ${className || ''}`}>
      {error ? (
        <span className="text-red-500">Save failed</span>
      ) : isSaving ? (
        <>
          <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
          <span className="text-gray-500">Saving...</span>
        </>
      ) : lastSaved ? (
        <>
          <div className="w-2 h-2 rounded-full bg-green-400" />
          <span className="text-gray-500">Saved at {formatTime(lastSaved)}</span>
        </>
      ) : (
        <span className="text-gray-400">Not saved</span>
      )}
    </div>
  );
};

// ============================================
// PERFORMANCE MONITORING
// ============================================

interface PerformanceMetrics {
  renderTime: number;
  interactionLatency: number;
  memoryUsage?: number;
  blockCount: number;
}

// Hook for measuring component render performance
export function usePerformanceMonitor(
  componentName: string,
  enabled: boolean = false
) {
  const renderStartRef = useRef<number>(0);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);

  useEffect(() => {
    if (!enabled) return;

    renderStartRef.current = performance.now();

    return () => {
      const renderTime = performance.now() - renderStartRef.current;
      
      setMetrics((prev) => ({
        renderTime,
        interactionLatency: prev?.interactionLatency || 0,
        memoryUsage: (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize,
        blockCount: prev?.blockCount || 0,
      }));

      if (process.env.NODE_ENV === 'development') {
        console.log(`[${componentName}] Render time: ${renderTime.toFixed(2)}ms`);
      }
    };
  });

  const measureInteraction = useCallback(
    (interactionName: string, fn: () => void) => {
      if (!enabled) {
        fn();
        return;
      }

      const start = performance.now();
      fn();
      const latency = performance.now() - start;

      setMetrics((prev) => ({
        ...prev!,
        interactionLatency: latency,
      }));

      if (process.env.NODE_ENV === 'development') {
        console.log(
          `[${componentName}] Interaction "${interactionName}": ${latency.toFixed(2)}ms`
        );
      }
    },
    [componentName, enabled]
  );

  return { metrics, measureInteraction };
}

// ============================================
// MEMOIZATION HELPERS
// ============================================

// Deep comparison memo for complex objects
export function deepMemo<P extends object>(
  Component: React.FC<P>,
  deps: (props: P) => unknown[] = (p) => [p]
): React.FC<P> {
  const MemoizedComponent = memo(Component, (prevProps, nextProps) => {
    const prevDeps = deps(prevProps);
    const nextDeps = deps(nextProps);
    
    return JSON.stringify(prevDeps) === JSON.stringify(nextDeps);
  });

  MemoizedComponent.displayName = `DeepMemo(${Component.displayName || Component.name || 'Component'})`;
  
  return MemoizedComponent;
}

// Hook for memoized callbacks with deep comparison
export function useDeepCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  deps: unknown[]
): T {
  const depsRef = useRef(deps);
  
  if (JSON.stringify(depsRef.current) !== JSON.stringify(deps)) {
    depsRef.current = deps;
  }
  
  return useCallback(callback, depsRef.current) as T;
}

// ============================================
// CODE SPLITTING
// ============================================

// Lazy load component with retry
export function lazyWithRetry<T extends React.ComponentType<unknown>>(
  importFn: () => Promise<{ default: T }>,
  retries: number = 3
): React.LazyExoticComponent<T> {
  return React.lazy(() => {
    const retry = (retriesLeft: number): Promise<{ default: T }> => {
      return importFn().catch((error) => {
        if (retriesLeft <= 0) {
          throw error;
        }
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(retry(retriesLeft - 1));
          }, 1000);
        });
      });
    };
    
    return retry(retries);
  });
}

// ============================================
// BUNDLE SIZE OPTIMIZATION
// ============================================

// Dynamic import with loading state
export function useDynamicImport<T>(
  importFn: () => Promise<T>,
  deps: React.DependencyList = []
) {
  const [module, setModule] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);

    importFn()
      .then((mod) => {
        if (mounted) {
          setModule(mod);
          setError(null);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      })
      .finally(() => {
        if (mounted) {
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { module, isLoading, error };
}

// ============================================
// IMAGE OPTIMIZATION
// ============================================

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholder?: string;
  loading?: 'lazy' | 'eager';
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3C/svg%3E',
  loading = 'lazy',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(placeholder);
  const { ref, isInView } = useLazyLoad<HTMLImageElement>();

  useEffect(() => {
    if (isInView && loading === 'lazy') {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setCurrentSrc(src);
        setIsLoaded(true);
      };
    }
  }, [isInView, src, loading]);

  useEffect(() => {
    if (loading === 'eager') {
      setCurrentSrc(src);
      setIsLoaded(true);
    }
  }, [src, loading]);

  return (
    <img
      ref={ref}
      src={currentSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={loading}
      style={{
        transition: 'opacity 0.3s ease-in-out',
        opacity: isLoaded ? 1 : 0.7,
      }}
    />
  );
};

// ============================================
// DEBOUNCE & THROTTLE
// ============================================

// Debounce hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Throttle hook
export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
}

// ============================================
// BATCHING
// ============================================

// Batch multiple state updates
export function useBatchedUpdates() {
  const pendingUpdates = useRef<(() => void)[]>([]);
  const isScheduled = useRef(false);

  const scheduleUpdate = useCallback((update: () => void) => {
    pendingUpdates.current.push(update);

    if (!isScheduled.current) {
      isScheduled.current = true;
      
      requestAnimationFrame(() => {
        const updates = pendingUpdates.current;
        pendingUpdates.current = [];
        isScheduled.current = false;

        // Execute all updates
        updates.forEach((update) => update());
      });
    }
  }, []);

  return { scheduleUpdate };
}

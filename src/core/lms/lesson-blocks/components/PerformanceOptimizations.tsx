/**
 * Performance Optimization Utilities
 * 
 * Optimizations for interactive lessons:
 * - Lazy loading of scenes and media
 * - Media optimization (images, videos)
 * - Progressive rendering
 * - Caching strategies
 * - Bundle code splitting
 */

import React, { useState, useEffect, useCallback, useRef, useMemo, Suspense, lazy } from 'react';
import { cn } from '../../../../lib/utils';

// ============================================
// LAZY LOADING HOOKS
// ============================================

/**
 * Hook for lazy loading content when it enters the viewport
 */
export function useLazyLoad<T>(
  loader: () => Promise<T>,
  options: {
    threshold?: number;
    rootMargin?: string;
    triggerOnce?: boolean;
  } = {}
): {
  ref: React.RefObject<HTMLDivElement>;
  data: T | null;
  isLoading: boolean;
  error: Error | null;
} {
  const { threshold = 0.1, rootMargin = '100px', triggerOnce = true } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (!ref.current || (triggerOnce && hasLoaded.current)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasLoaded.current) {
            setIsLoading(true);
            loader()
              .then((result) => {
                setData(result);
                hasLoaded.current = true;
              })
              .catch((err) => setError(err))
              .finally(() => setIsLoading(false));
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [loader, threshold, rootMargin, triggerOnce]);

  return { ref, data, isLoading, error };
}

/**
 * Hook for preloading next scenes
 */
export function useScenePreload<T>(
  scenes: T[],
  currentIndex: number,
  loader: (scene: T) => Promise<void>,
  preloadCount: number = 2
): void {
  useEffect(() => {
    const scenesToPreload = scenes.slice(
      currentIndex + 1,
      currentIndex + 1 + preloadCount
    );

    scenesToPreload.forEach((scene) => {
      loader(scene).catch(() => {
        // Silently fail preloading
      });
    });
  }, [scenes, currentIndex, loader, preloadCount]);
}

// ============================================
// IMAGE OPTIMIZATION
// ============================================

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png' | 'auto';
  lazy?: boolean;
  placeholder?: 'blur' | 'skeleton' | 'none';
}

/**
 * Optimized image component with lazy loading and placeholder
 */
interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  options?: ImageOptimizationOptions;
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  options = {},
  onLoad,
  onError,
}) => {
  const {
    lazy = true,
    placeholder = 'blur',
  } = options;

  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!lazy || !imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [lazy]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    onError?.();
  }, [onError]);

  return (
    <div
      ref={imgRef}
      className={cn('relative overflow-hidden', className)}
      style={{ width, height }}
    >
      {/* Placeholder */}
      {!isLoaded && placeholder !== 'none' && (
        <div
          className={cn(
            'absolute inset-0',
            placeholder === 'blur' && 'bg-gray-200 dark:bg-gray-800 animate-pulse',
            placeholder === 'skeleton' && 'bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 animate-shimmer'
          )}
        />
      )}

      {/* Actual Image */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={lazy ? 'lazy' : 'eager'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
        />
      )}
    </div>
  );
};

/**
 * Responsive image with srcset generation
 */
interface ResponsiveImageProps {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  breakpoints?: number[];
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  sizes,
  className,
  breakpoints = [320, 640, 768, 1024, 1280],
}) => {
  const generateSrcSet = useMemo(() => {
    // In production, this would generate actual resized images
    // For now, we'll use the same image with different size hints
    return breakpoints
      .map((w) => `${src} ${w}w`)
      .join(', ');
  }, [src, breakpoints]);

  return (
    <img
      src={src}
      srcSet={generateSrcSet}
      sizes={sizes}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
    />
  );
};

// ============================================
// VIDEO OPTIMIZATION
// ============================================

interface OptimizedVideoProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  className?: string;
  lazy?: boolean;
  onPlay?: () => void;
  onEnd?: () => void;
}

export const OptimizedVideo: React.FC<OptimizedVideoProps> = ({
  src,
  poster,
  autoPlay = false,
  loop = false,
  muted = true,
  controls = false,
  className,
  lazy = true,
  onPlay,
  onEnd,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);

  useEffect(() => {
    if (!lazy || !videoRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, [lazy]);

  useEffect(() => {
    if (!videoRef.current) return;

    if (isInView && autoPlay) {
      videoRef.current.play().catch(() => {
        // Autoplay blocked
      });
    } else if (!isInView && videoRef.current.paused === false) {
      videoRef.current.pause();
    }
  }, [isInView, autoPlay]);

  const handleLoadedData = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {!isLoaded && poster && (
        <img
          src={poster}
          alt="Video thumbnail"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {isInView && (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          controls={controls}
          playsInline
          preload="metadata"
          onLoadedData={handleLoadedData}
          onPlay={onPlay}
          onEnded={onEnd}
          className={cn(
            'w-full h-full object-cover',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
        />
      )}
    </div>
  );
};

// ============================================
// PROGRESSIVE RENDERING
// ============================================

interface ProgressiveRenderProps {
  children: React.ReactNode;
  priority?: 'high' | 'medium' | 'low';
  delay?: number;
  placeholder?: React.ReactNode;
  className?: string;
}

export const ProgressiveRender: React.FC<ProgressiveRenderProps> = ({
  children,
  priority = 'medium',
  delay = 0,
  placeholder,
  className,
}) => {
  const [shouldRender, setShouldRender] = useState(priority === 'high');

  useEffect(() => {
    if (priority === 'high') return;

    const baseDelay = priority === 'medium' ? 100 : 300;
    const totalDelay = baseDelay + delay;

    const timer = setTimeout(() => {
      setShouldRender(true);
    }, totalDelay);

    return () => clearTimeout(timer);
  }, [priority, delay]);

  if (!shouldRender) {
    return placeholder ? <div className={className}>{placeholder}</div> : null;
  }

  return <div className={className}>{children}</div>;
};

/**
 * Chunked rendering for large lists
 */
interface ChunkedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  chunkSize?: number;
  delay?: number;
  className?: string;
}

export function ChunkedList<T>({
  items,
  renderItem,
  chunkSize = 10,
  delay = 50,
  className,
}: ChunkedListProps<T>): React.ReactElement {
  const [visibleCount, setVisibleCount] = useState(chunkSize);

  useEffect(() => {
    if (visibleCount >= items.length) return;

    const timer = setInterval(() => {
      setVisibleCount((prev) => Math.min(prev + chunkSize, items.length));
    }, delay);

    return () => clearInterval(timer);
  }, [items.length, chunkSize, delay]);

  return (
    <div className={className}>
      {items.slice(0, visibleCount).map((item, index) => renderItem(item, index))}
    </div>
  );
}

// ============================================
// CACHING UTILITIES
// ============================================

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of items
}

class SimpleCache<T> {
  private cache: Map<string, { data: T; timestamp: number }> = new Map();
  private options: CacheOptions;

  constructor(options: CacheOptions = {}) {
    this.options = { ttl: 5 * 60 * 1000, maxSize: 100, ...options };
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > (this.options.ttl || 0)) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set(key: string, data: T): void {
    if (this.cache.size >= (this.options.maxSize || 100)) {
      // Remove oldest entry
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }

    this.cache.set(key, { data, timestamp: Date.now() });
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}

// Global caches
export const imageCache = new SimpleCache<string>();
export const dataCache = new SimpleCache<any>();

/**
 * Hook for cached data fetching
 */
export function useCachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
): {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
} {
  const [data, setData] = useState<T | null>(() => dataCache.get(key));
  const [isLoading, setIsLoading] = useState(!data);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    const cached = dataCache.get(key);
    if (cached) {
      setData(cached);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      dataCache.set(key, result);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [key, fetcher]);

  useEffect(() => {
    if (!data) {
      fetchData();
    }
  }, [data, fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

// ============================================
// CODE SPLITTING HELPERS
// ============================================

/**
 * Lazy load a component with retry logic
 */
export function lazyWithRetry<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  retries: number = 3
): React.LazyExoticComponent<T> {
  return lazy(() => {
    const retry = (attempt: number): Promise<{ default: T }> => {
      return importFn().catch((error) => {
        if (attempt >= retries) throw error;
        return new Promise((resolve) => {
          setTimeout(() => resolve(retry(attempt + 1)), 1000);
        });
      });
    };
    return retry(1);
  });
}

/**
 * Preload a lazy component
 */
export function preloadComponent(
  importFn: () => Promise<{ default: React.ComponentType<any> }>
): void {
  importFn().catch(() => {
    // Silently fail preloading
  });
}

// ============================================
// BUNDLE ANALYSIS HELPERS
// ============================================

/**
 * Track component mount time for performance monitoring
 */
export function usePerformanceTracker(componentName: string): void {
  useEffect(() => {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const mountTime = endTime - startTime;

      if (process.env.NODE_ENV === 'development') {
        console.log(`[Perf] ${componentName} mount time: ${mountTime.toFixed(2)}ms`);
      }

      // In production, send to analytics
      // trackPerformance(componentName, mountTime);
    };
  }, [componentName]);
}

/**
 * Memory usage tracker
 */
export function useMemoryTracker(): { usedJSHeapSize: number; totalJSHeapSize: number } | null {
  const [memory, setMemory] = useState<{ usedJSHeapSize: number; totalJSHeapSize: number } | null>(null);

  useEffect(() => {
    if ('memory' in performance && (performance as any).memory) {
      const updateMemory = () => {
        const { usedJSHeapSize, totalJSHeapSize } = (performance as any).memory;
        setMemory({ usedJSHeapSize, totalJSHeapSize });
      };

      updateMemory();
      const interval = setInterval(updateMemory, 5000);
      return () => clearInterval(interval);
    }
    return undefined;
  }, []);

  return memory;
}

// ============================================
// EXPORTS
// ============================================

export default {
  useLazyLoad,
  useScenePreload,
  OptimizedImage,
  ResponsiveImage,
  OptimizedVideo,
  ProgressiveRender,
  ChunkedList,
  SimpleCache,
  imageCache,
  dataCache,
  useCachedFetch,
  lazyWithRetry,
  preloadComponent,
  usePerformanceTracker,
  useMemoryTracker,
};

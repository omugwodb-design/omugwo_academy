// Performance Optimizations - Code Splitting and Lazy Loading
import React, { lazy, Suspense, ComponentType, LazyExoticComponent } from 'react';
import { BlockType } from '../types';
import { Loader2 } from 'lucide-react';

// Loading fallback component
const LoadingFallback: React.FC<{ minHeight?: string }> = ({ minHeight = '200px' }) => (
  <div
    className="flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg animate-pulse"
    style={{ minHeight }}
  >
    <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
  </div>
);

// Error boundary for lazy loaded components
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

class LazyLoadErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg text-center">
          <p className="text-red-600 dark:text-red-400 text-sm">
            Failed to load component
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-2 text-xs text-red-500 hover:underline"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Lazy block component loader
type BlockComponentLoader = () => Promise<{ default: ComponentType<any> }>;

// Lazy loaded block components map
const lazyBlockComponents: Partial<Record<BlockType, LazyExoticComponent<ComponentType<any>>>> = {};

// Register lazy block component
export const registerLazyBlock = (
  type: BlockType,
  loader: BlockComponentLoader
): void => {
  lazyBlockComponents[type] = lazy(loader);
};

// Get lazy block component
export const getLazyBlockComponent = (
  type: BlockType
): LazyExoticComponent<ComponentType<any>> | null => {
  return lazyBlockComponents[type] || null;
};

// Lazy block wrapper with suspense
interface LazyBlockProps {
  type: BlockType;
  fallback?: React.ReactNode;
  minHeight?: string;
  [key: string]: any;
}

export const LazyBlock: React.FC<LazyBlockProps> = ({
  type,
  fallback,
  minHeight,
  ...props
}) => {
  const LazyComponent = getLazyBlockComponent(type);

  if (!LazyComponent) {
    return (
      <div className="p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg text-center">
        <p className="text-yellow-600 dark:text-yellow-400 text-sm">
          Unknown block type: {type}
        </p>
      </div>
    );
  }

  return (
    <LazyLoadErrorBoundary fallback={fallback}>
      <Suspense fallback={fallback || <LoadingFallback minHeight={minHeight} />}>
        <LazyComponent {...props} />
      </Suspense>
    </LazyLoadErrorBoundary>
  );
};

// Preload block component
export const preloadBlock = async (type: BlockType): Promise<void> => {
  const LazyComponent = lazyBlockComponents[type];
  if (LazyComponent) {
    // Trigger the lazy load
    try {
      await (LazyComponent as any)._payload;
    } catch {
      console.warn(`Failed to preload block: ${type}`);
    }
  }
};

// Preload multiple blocks
export const preloadBlocks = async (types: BlockType[]): Promise<void> => {
  await Promise.all(types.map(type => preloadBlock(type)));
};

// Preload blocks by priority
export const preloadPriorityBlocks = async (
  blocks: { type: BlockType; priority: 'high' | 'medium' | 'low' }[]
): Promise<void> => {
  // Load high priority first
  const highPriority = blocks.filter(b => b.priority === 'high').map(b => b.type);
  await preloadBlocks(highPriority);

  // Then medium
  const mediumPriority = blocks.filter(b => b.priority === 'medium').map(b => b.type);
  preloadBlocks(mediumPriority); // Don't await, load in background

  // Low priority last
  const lowPriority = blocks.filter(b => b.priority === 'low').map(b => b.type);
  setTimeout(() => preloadBlocks(lowPriority), 1000);
};

// Intersection Observer for lazy loading visible blocks
interface LazyLoadObserverOptions {
  rootMargin?: string;
  threshold?: number;
}

export class LazyLoadObserver {
  private observer: IntersectionObserver;
  private callbacks: Map<string, () => void> = new Map();

  constructor(options: LazyLoadObserverOptions = {}) {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            const callback = this.callbacks.get(id);
            if (callback) {
              callback();
              this.callbacks.delete(id);
              this.observer.unobserve(entry.target);
            }
          }
        });
      },
      {
        rootMargin: options.rootMargin || '200px',
        threshold: options.threshold || 0.1,
      }
    );
  }

  observe(element: HTMLElement, onVisible: () => void): void {
    this.callbacks.set(element.id, onVisible);
    this.observer.observe(element);
  }

  unobserve(element: HTMLElement): void {
    this.callbacks.delete(element.id);
    this.observer.unobserve(element);
  }

  disconnect(): void {
    this.observer.disconnect();
    this.callbacks.clear();
  }
}

// Virtual list for large block lists
interface VirtualListProps {
  items: any[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: any, index: number) => React.ReactNode;
  overscan?: number;
}

export const VirtualList: React.FC<VirtualListProps> = ({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 3,
}) => {
  const [scrollTop, setScrollTop] = React.useState(0);

  const totalHeight = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.floor((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div
      onScroll={handleScroll}
      style={{ height: containerHeight, overflow: 'auto' }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            top: startIndex * itemHeight,
            width: '100%',
          }}
        >
          {visibleItems.map((item, i) => renderItem(item, startIndex + i))}
        </div>
      </div>
    </div>
  );
};

// Debounce utility
export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

// Throttle utility
export const throttle = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  };
};

// Request idle callback polyfill
export const requestIdleCallback =
  (typeof window !== 'undefined' && 'requestIdleCallback' in window)
    ? window.requestIdleCallback
    : (cb: IdleRequestCallback) => setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 50 }) as IdleDeadline, 1);

// Cancel idle callback polyfill
export const cancelIdleCallback =
  (typeof window !== 'undefined' && 'cancelIdleCallback' in window)
    ? window.cancelIdleCallback
    : (id: number) => clearTimeout(id);

// Schedule low priority task
export const scheduleLowPriorityTask = (task: () => void): number => {
  return requestIdleCallback(task, { timeout: 2000 });
};

// Batch updates utility
interface BatchUpdateOptions {
  maxBatchSize?: number;
  flushInterval?: number;
}

export class BatchUpdater<T> {
  private queue: T[] = [];
  private timeoutId?: ReturnType<typeof setTimeout>;
  private readonly maxBatchSize: number;
  private readonly flushInterval: number;

  constructor(
    private onFlush: (items: T[]) => void,
    options: BatchUpdateOptions = {}
  ) {
    this.maxBatchSize = options.maxBatchSize || 50;
    this.flushInterval = options.flushInterval || 100;
  }

  add(item: T): void {
    this.queue.push(item);

    if (this.queue.length >= this.maxBatchSize) {
      this.flush();
    } else if (!this.timeoutId) {
      this.timeoutId = setTimeout(() => this.flush(), this.flushInterval);
    }
  }

  flush(): void {
    if (this.queue.length === 0) return;

    const items = [...this.queue];
    this.queue = [];

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }

    this.onFlush(items);
  }

  clear(): void {
    this.queue = [];
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
  }
}

// Memory-efficient block state manager
export class BlockStateManager<T> {
  private states: Map<string, T> = new Map();
  private accessOrder: string[] = [];
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  get(id: string): T | undefined {
    const state = this.states.get(id);
    if (state !== undefined) {
      // Move to end (most recently used)
      this.accessOrder = this.accessOrder.filter(i => i !== id);
      this.accessOrder.push(id);
    }
    return state;
  }

  set(id: string, state: T): void {
    // Remove if exists
    if (this.states.has(id)) {
      this.accessOrder = this.accessOrder.filter(i => i !== id);
    }

    // Add new
    this.states.set(id, state);
    this.accessOrder.push(id);

    // Evict oldest if over limit
    while (this.accessOrder.length > this.maxSize) {
      const oldest = this.accessOrder.shift()!;
      this.states.delete(oldest);
    }
  }

  delete(id: string): boolean {
    this.accessOrder = this.accessOrder.filter(i => i !== id);
    return this.states.delete(id);
  }

  clear(): void {
    this.states.clear();
    this.accessOrder = [];
  }

  size(): number {
    return this.states.size;
  }
}

// Performance metrics collector
interface PerformanceMetrics {
  blockLoadTimes: Map<string, number[]>;
  renderTimes: Map<string, number[]>;
  interactionLatencies: number[];
  memoryUsage: number[];
}

export class PerformanceCollector {
  private metrics: PerformanceMetrics = {
    blockLoadTimes: new Map(),
    renderTimes: new Map(),
    interactionLatencies: [],
    memoryUsage: [],
  };

  private enabled: boolean = true;

  enable(): void {
    this.enabled = true;
  }

  disable(): void {
    this.enabled = false;
  }

  recordBlockLoad(blockType: string, duration: number): void {
    if (!this.enabled) return;
    const times = this.metrics.blockLoadTimes.get(blockType) || [];
    times.push(duration);
    this.metrics.blockLoadTimes.set(blockType, times);
  }

  recordRender(componentName: string, duration: number): void {
    if (!this.enabled) return;
    const times = this.metrics.renderTimes.get(componentName) || [];
    times.push(duration);
    this.metrics.renderTimes.set(componentName, times);
  }

  recordInteractionLatency(latency: number): void {
    if (!this.enabled) return;
    this.metrics.interactionLatencies.push(latency);
  }

  recordMemoryUsage(): void {
    if (!this.enabled) return;
    // @ts-ignore - performance.memory is not in standard types
    const memory = performance.memory?.usedJSHeapSize;
    if (memory) {
      this.metrics.memoryUsage.push(memory);
    }
  }

  getReport(): {
    avgBlockLoadTime: Record<string, number>;
    avgRenderTime: Record<string, number>;
    avgInteractionLatency: number;
    peakMemoryUsage: number;
  } {
    const avgBlockLoadTime: Record<string, number> = {};
    this.metrics.blockLoadTimes.forEach((times, type) => {
      avgBlockLoadTime[type] = times.reduce((a, b) => a + b, 0) / times.length;
    });

    const avgRenderTime: Record<string, number> = {};
    this.metrics.renderTimes.forEach((times, name) => {
      avgRenderTime[name] = times.reduce((a, b) => a + b, 0) / times.length;
    });

    const avgInteractionLatency =
      this.metrics.interactionLatencies.length > 0
        ? this.metrics.interactionLatencies.reduce((a, b) => a + b, 0) /
          this.metrics.interactionLatencies.length
        : 0;

    const peakMemoryUsage =
      this.metrics.memoryUsage.length > 0
        ? Math.max(...this.metrics.memoryUsage)
        : 0;

    return {
      avgBlockLoadTime,
      avgRenderTime,
      avgInteractionLatency,
      peakMemoryUsage,
    };
  }

  clear(): void {
    this.metrics = {
      blockLoadTimes: new Map(),
      renderTimes: new Map(),
      interactionLatencies: [],
      memoryUsage: [],
    };
  }
}

// Singleton performance collector
export const performanceCollector = new PerformanceCollector();

// Measure render time HOC
export const withRenderTimeTracking = <P extends object>(
  Component: React.ComponentType<P>,
  name: string
): React.FC<P> => {
  const TrackedComponent: React.FC<P> = (props) => {
    const startTime = performance.now();
    
    React.useEffect(() => {
      const endTime = performance.now();
      performanceCollector.recordRender(name, endTime - startTime);
    });

    return <Component {...props} />;
  };

  TrackedComponent.displayName = `withRenderTimeTracking(${name})`;
  return TrackedComponent;
};

export default LazyBlock;

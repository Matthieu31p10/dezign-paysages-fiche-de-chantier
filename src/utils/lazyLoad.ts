import { ComponentType, lazy, LazyExoticComponent } from 'react';

interface LazyLoadOptions {
  fallback?: React.ComponentType;
  retries?: number;
  retryDelay?: number;
}

/**
 * Lazy load a component with automatic retry on failure
 */
export const lazyLoadWithRetry = <T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options: LazyLoadOptions = {}
): LazyExoticComponent<T> => {
  const { retries = 3, retryDelay = 1000 } = options;

  return lazy(() => {
    return new Promise<{ default: T }>((resolve, reject) => {
      const attemptLoad = (attemptsLeft: number) => {
        importFunc()
          .then(resolve)
          .catch((error) => {
            if (attemptsLeft === 0) {
              reject(error);
              return;
            }

            console.warn(
              `Failed to load component. Retrying... (${attemptsLeft} attempts left)`,
              error
            );

            setTimeout(() => {
              attemptLoad(attemptsLeft - 1);
            }, retryDelay);
          });
      };

      attemptLoad(retries);
    });
  });
};

/**
 * Preload a lazy component
 */
export const preloadComponent = (importFunc: () => Promise<any>) => {
  importFunc().catch((error) => {
    console.error('Failed to preload component:', error);
  });
};

/**
 * Create a route-based lazy loader with automatic retry
 */
export const lazyLoadRoute = <T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  preload: boolean = false
): LazyExoticComponent<T> => {
  const loader = lazyLoadWithRetry(importFunc, { retries: 3, retryDelay: 1500 });
  
  if (preload) {
    // Preload after a short delay to not block initial render
    setTimeout(() => preloadComponent(importFunc), 100);
  }
  
  return loader;
};

/**
 * Prefetch components on hover or focus
 */
export const prefetchOnInteraction = (
  importFunc: () => Promise<any>,
  element: HTMLElement | null
) => {
  if (!element) return;

  let prefetched = false;

  const prefetch = () => {
    if (prefetched) return;
    prefetched = true;
    preloadComponent(importFunc);
  };

  element.addEventListener('mouseenter', prefetch, { once: true });
  element.addEventListener('focus', prefetch, { once: true });

  return () => {
    element.removeEventListener('mouseenter', prefetch);
    element.removeEventListener('focus', prefetch);
  };
};

/**
 * Dynamic import with timeout
 */
export const importWithTimeout = <T>(
  importFunc: () => Promise<T>,
  timeout: number = 10000
): Promise<T> => {
  return Promise.race([
    importFunc(),
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Import timeout')), timeout)
    )
  ]);
};

/**
 * Chunk priorities for route-based code splitting
 */
export const ChunkPriority = {
  HIGH: 'high', // Critical routes loaded immediately
  MEDIUM: 'medium', // Important routes preloaded on idle
  LOW: 'low' // Rarely used routes loaded on demand
} as const;

/**
 * Preload chunks during browser idle time
 */
export const preloadOnIdle = (importFunc: () => Promise<any>) => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => preloadComponent(importFunc));
  } else {
    setTimeout(() => preloadComponent(importFunc), 1);
  }
};

import { useEffect, useRef } from 'react';
import { preloadComponent, prefetchOnInteraction } from '@/utils/lazyLoad';

interface UsePreloadRouteOptions {
  enabled?: boolean;
  delay?: number;
  onHover?: boolean;
}

/**
 * Hook to preload a route component
 */
export const usePreloadRoute = (
  importFunc: () => Promise<any>,
  options: UsePreloadRouteOptions = {}
) => {
  const { enabled = true, delay = 0, onHover = false } = options;
  const preloadedRef = useRef(false);

  useEffect(() => {
    if (!enabled || preloadedRef.current) return;

    const timer = setTimeout(() => {
      preloadedRef.current = true;
      preloadComponent(importFunc);
    }, delay);

    return () => clearTimeout(timer);
  }, [importFunc, enabled, delay]);

  const prefetchOnInteractionRef = (element: HTMLElement | null) => {
    if (!onHover || !element) return;
    return prefetchOnInteraction(importFunc, element);
  };

  return { prefetchOnInteractionRef };
};

/**
 * Hook to preload multiple routes
 */
export const usePreloadRoutes = (
  routes: Array<() => Promise<any>>,
  options: UsePreloadRouteOptions = {}
) => {
  const { enabled = true, delay = 0 } = options;
  const preloadedRef = useRef(false);

  useEffect(() => {
    if (!enabled || preloadedRef.current) return;

    const timer = setTimeout(() => {
      preloadedRef.current = true;
      routes.forEach(importFunc => {
        preloadComponent(importFunc);
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [routes, enabled, delay]);
};

/**
 * Hook to preload routes on idle
 */
export const usePreloadOnIdle = (importFunc: () => Promise<any>) => {
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const handle = requestIdleCallback(() => {
        preloadComponent(importFunc);
      });
      return () => cancelIdleCallback(handle);
    } else {
      const timer = setTimeout(() => {
        preloadComponent(importFunc);
      }, 1);
      return () => clearTimeout(timer);
    }
  }, [importFunc]);
};

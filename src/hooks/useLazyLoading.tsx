import { useState, useEffect, useRef, useCallback } from 'react';

interface LazyLoadOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * Hook pour le lazy loading basé sur l'Intersection Observer
 */
export const useLazyLoading = (options: LazyLoadOptions = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    triggerOnce = true
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Si déjà déclenché et triggerOnce est activé, ne pas observer à nouveau
    if (hasTriggered && triggerOnce) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting;
        setIsVisible(isIntersecting);

        if (isIntersecting && triggerOnce) {
          setHasTriggered(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, hasTriggered]);

  return {
    elementRef,
    isVisible,
    hasTriggered
  };
};

/**
 * Hook pour le chargement différé de composants
 */
export const useLazyComponent = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options: LazyLoadOptions = {}
) => {
  const [Component, setComponent] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { isVisible, elementRef } = useLazyLoading(options);

  const loadComponent = useCallback(async () => {
    if (Component || loading) return;

    setLoading(true);
    setError(null);

    try {
      const module = await importFunc();
      setComponent(() => module.default);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load component'));
    } finally {
      setLoading(false);
    }
  }, [Component, loading, importFunc]);

  useEffect(() => {
    if (isVisible) {
      loadComponent();
    }
  }, [isVisible, loadComponent]);

  return {
    Component,
    loading,
    error,
    elementRef,
    isVisible
  };
};

/**
 * Hook pour le préchargement de composants
 */
export const usePrefetchComponent = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  delay = 0
) => {
  const [Component, setComponent] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const prefetch = useCallback(async () => {
    if (Component || loading) return;

    setLoading(true);
    setError(null);

    try {
      const module = await importFunc();
      setComponent(() => module.default);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to prefetch component'));
    } finally {
      setLoading(false);
    }
  }, [Component, loading, importFunc]);

  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(prefetch, delay);
      return () => clearTimeout(timer);
    } else {
      prefetch();
    }
  }, [prefetch, delay]);

  return {
    Component,
    loading,
    error,
    prefetch
  };
};

/**
 * Hook pour le chargement différé d'images
 */
export const useLazyImage = (src: string, options: LazyLoadOptions = {}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const { isVisible, elementRef } = useLazyLoading(options);

  useEffect(() => {
    if (!isVisible || loaded || error) return;

    const img = new Image();
    img.onload = () => setLoaded(true);
    img.onerror = () => setError(true);
    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [isVisible, src, loaded, error]);

  return {
    elementRef,
    loaded,
    error,
    isVisible,
    shouldLoad: isVisible
  };
};
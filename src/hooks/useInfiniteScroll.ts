import { useEffect, useRef, useCallback, useState } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

interface UseInfiniteScrollReturn {
  loadMoreRef: (node: HTMLElement | null) => void;
  isIntersecting: boolean;
}

export function useInfiniteScroll(
  onLoadMore: () => void | Promise<void>,
  options: UseInfiniteScrollOptions = {}
): UseInfiniteScrollReturn {
  const {
    threshold = 0.5,
    rootMargin = '100px',
    enabled = true,
  } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef(false);

  const loadMoreRef = useCallback(
    (node: HTMLElement | null) => {
      if (!enabled) return;

      // Disconnect previous observer
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      if (!node) return;

      // Create new observer
      observerRef.current = new IntersectionObserver(
        async (entries) => {
          const [entry] = entries;
          setIsIntersecting(entry.isIntersecting);

          if (entry.isIntersecting && !loadingRef.current) {
            loadingRef.current = true;
            try {
              await onLoadMore();
            } finally {
              loadingRef.current = false;
            }
          }
        },
        {
          threshold,
          rootMargin,
        }
      );

      observerRef.current.observe(node);
    },
    [enabled, onLoadMore, threshold, rootMargin]
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return { loadMoreRef, isIntersecting };
}

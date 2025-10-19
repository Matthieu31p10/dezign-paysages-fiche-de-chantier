import { useState, useEffect, useCallback, useRef } from 'react';

interface UseVirtualScrollOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  itemCount: number;
}

interface VirtualScrollResult {
  virtualItems: Array<{
    index: number;
    start: number;
    size: number;
  }>;
  totalHeight: number;
  scrollOffset: number;
  onScroll: (e: React.UIEvent<HTMLElement>) => void;
}

export function useVirtualScroll({
  itemHeight,
  containerHeight,
  overscan = 3,
  itemCount,
}: UseVirtualScrollOptions): VirtualScrollResult {
  const [scrollOffset, setScrollOffset] = useState(0);
  const scrollingRef = useRef(false);

  const onScroll = useCallback((e: React.UIEvent<HTMLElement>) => {
    const { scrollTop } = e.currentTarget;
    scrollingRef.current = true;
    setScrollOffset(scrollTop);
    
    // Reset scrolling flag after a delay
    setTimeout(() => {
      scrollingRef.current = false;
    }, 150);
  }, []);

  // Calculate visible range
  const startIndex = Math.max(0, Math.floor(scrollOffset / itemHeight) - overscan);
  const endIndex = Math.min(
    itemCount - 1,
    Math.ceil((scrollOffset + containerHeight) / itemHeight) + overscan
  );

  // Generate virtual items
  const virtualItems = [];
  for (let i = startIndex; i <= endIndex; i++) {
    virtualItems.push({
      index: i,
      start: i * itemHeight,
      size: itemHeight,
    });
  }

  const totalHeight = itemCount * itemHeight;

  return {
    virtualItems,
    totalHeight,
    scrollOffset,
    onScroll,
  };
}

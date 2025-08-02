import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useDebounce, useThrottle } from '@/utils/performance';
import { useDataCache } from './useDataCache';

interface OptimizationOptions {
  enableDebounce?: boolean;
  debounceDelay?: number;
  enableThrottle?: boolean;
  throttleLimit?: number;
  enableMemoization?: boolean;
  enableCache?: boolean;
  cacheKey?: string;
  cacheTTL?: number;
}

export const usePerformanceOptimization = <T = any,>(
  operation: (...args: any[]) => T | Promise<T>,
  dependencies: any[] = [],
  options: OptimizationOptions = {}
) => {
  const {
    enableDebounce = false,
    debounceDelay = 300,
    enableThrottle = false,
    throttleLimit = 100,
    enableMemoization = true,
    enableCache = false,
    cacheKey,
    cacheTTL = 5 * 60 * 1000
  } = options;

  const operationRef = useRef(operation);
  operationRef.current = operation;

  const debouncedOperation = useDebounce(
    (...args: any[]) => operationRef.current(...args),
    debounceDelay
  );

  const throttledOperation = useThrottle(
    (...args: any[]) => operationRef.current(...args),
    throttleLimit
  );

  const { data: cachedData, fetchData: fetchCachedData } = useDataCache(
    cacheKey || 'default',
    () => operationRef.current(),
    { ttl: cacheTTL, enabled: enableCache && !!cacheKey }
  );

  const optimizedOperation = useMemo(() => {
    if (enableCache && cacheKey) {
      return fetchCachedData;
    }
    
    if (enableDebounce) {
      return debouncedOperation;
    }
    
    if (enableThrottle) {
      return throttledOperation;
    }
    
    return operationRef.current;
  }, [
    enableCache,
    enableDebounce,
    enableThrottle,
    cacheKey,
    fetchCachedData,
    debouncedOperation,
    throttledOperation,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ...dependencies
  ]);

  const memoizedResult = useMemo(() => {
    if (!enableMemoization) return null;
    return enableCache && cachedData ? cachedData : null;
  }, [enableMemoization, enableCache, cachedData, ...dependencies]);

  return {
    optimizedOperation,
    memoizedResult,
    cachedData
  };
};

export const useListOptimization = <T,>(
  items: T[],
  options: {
    pageSize?: number;
    enableVirtualization?: boolean;
    itemHeight?: number;
    searchTerm?: string;
    searchFields?: (keyof T)[];
    sortBy?: keyof T;
    sortOrder?: 'asc' | 'desc';
  } = {}
) => {
  const {
    pageSize = 50,
    enableVirtualization = false,
    itemHeight = 50,
    searchTerm = '',
    searchFields = [],
    sortBy,
    sortOrder = 'asc'
  } = options;

  const [currentPage, setCurrentPage] = useState(0);

  const filteredItems = useMemo(() => {
    if (!searchTerm || searchFields.length === 0) return items;

    return items.filter(item =>
      searchFields.some(field => {
        const value = item[field];
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [items, searchTerm, searchFields]);

  const sortedItems = useMemo(() => {
    if (!sortBy) return filteredItems;

    return [...filteredItems].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredItems, sortBy, sortOrder]);

  const paginatedItems = useMemo(() => {
    if (enableVirtualization) return sortedItems;

    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedItems.slice(startIndex, endIndex);
  }, [sortedItems, currentPage, pageSize, enableVirtualization]);

  const stats = useMemo(() => ({
    totalItems: items.length,
    filteredItems: filteredItems.length,
    totalPages: Math.ceil(sortedItems.length / pageSize),
    currentPage: currentPage + 1,
    itemsPerPage: pageSize
  }), [items.length, filteredItems.length, sortedItems.length, pageSize, currentPage]);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(0, Math.min(page, stats.totalPages - 1)));
  }, [stats.totalPages]);

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm, sortBy, sortOrder]);

  return {
    items: paginatedItems,
    stats,
    navigation: {
      goToPage,
      nextPage,
      prevPage,
      canGoNext: currentPage < stats.totalPages - 1,
      canGoPrev: currentPage > 0
    },
    virtualization: enableVirtualization ? {
      itemHeight,
      totalHeight: sortedItems.length * itemHeight
    } : null
  };
};
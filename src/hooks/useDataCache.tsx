import { useState, useEffect, useCallback, useRef } from 'react';
import { memoryCache } from '@/utils/performance';

interface CacheOptions {
  ttl?: number;
  enabled?: boolean;
  refreshInterval?: number;
}

interface CacheState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  lastFetch: number | null;
}

export const useDataCache = <T,>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
) => {
  const {
    ttl = 5 * 60 * 1000,
    enabled = true,
    refreshInterval
  } = options;

  const [state, setState] = useState<CacheState<T>>({
    data: null,
    loading: false,
    error: null,
    lastFetch: null
  });

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const refreshIntervalRef = useRef<NodeJS.Timeout>();

  const fetchData = useCallback(async (forceRefresh = false) => {
    if (!enabled) return;

    if (!forceRefresh) {
      const cached = memoryCache.get(key) as T | null;
      if (cached !== null) {
        setState(prev => ({
          ...prev,
          data: cached,
          loading: false,
          error: null,
          lastFetch: Date.now()
        }));
        return cached;
      }
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const data = await fetcherRef.current();
      memoryCache.set(key, data, ttl);
      
      setState({
        data,
        loading: false,
        error: null,
        lastFetch: Date.now()
      });

      return data;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      setState(prev => ({
        ...prev,
        loading: false,
        error: err
      }));
      throw err;
    }
  }, [key, ttl, enabled]);

  const invalidate = useCallback(() => {
    memoryCache.delete(key);
    setState(prev => ({
      ...prev,
      data: null,
      lastFetch: null
    }));
  }, [key]);

  const refresh = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  useEffect(() => {
    if (enabled && !state.data && !state.loading) {
      fetchData();
    }
  }, [enabled, fetchData, state.data, state.loading]);

  useEffect(() => {
    if (refreshInterval && enabled) {
      refreshIntervalRef.current = setInterval(() => {
        fetchData(true);
      }, refreshInterval);

      return () => {
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current);
        }
      };
    }
  }, [refreshInterval, enabled, fetchData]);

  useEffect(() => {
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, []);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    lastFetch: state.lastFetch,
    refresh,
    invalidate,
    fetchData
  };
};

export const usePrefetch = <T,>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
) => {
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const prefetch = useCallback(async () => {
    const { ttl = 5 * 60 * 1000 } = options;
    
    const cached = memoryCache.get(key) as T | null;
    if (cached !== null) return cached;

    try {
      const data = await fetcherRef.current();
      memoryCache.set(key, data, ttl);
      return data;
    } catch (error) {
      console.warn(`Failed to prefetch data for key: ${key}`, error);
      throw error;
    }
  }, [key, options]);

  return { prefetch };
};
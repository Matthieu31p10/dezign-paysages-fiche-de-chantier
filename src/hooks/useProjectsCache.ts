import { useState, useEffect, useMemo, useCallback } from 'react';
import { ProjectInfo } from '@/types/models';

interface CacheStats {
  size: number;
  hits: number;
  misses: number;
  hitRate: number;
}

interface CachedProjectData {
  projects: ProjectInfo[];
  filteredProjects: ProjectInfo[];
  timestamp: number;
  filterKey: string;
}

export const useProjectsCache = (projects: ProjectInfo[]) => {
  const [cache, setCache] = useState<Map<string, CachedProjectData>>(new Map());
  const [stats, setStats] = useState<CacheStats>({
    size: 0,
    hits: 0,
    misses: 0,
    hitRate: 0
  });

  // Cache key generator
  const generateCacheKey = useCallback((filters: any) => {
    return JSON.stringify(filters);
  }, []);

  // Get cached data
  const getCachedData = useCallback((filterKey: string): CachedProjectData | null => {
    const cached = cache.get(filterKey);
    if (cached && Date.now() - cached.timestamp < 30000) { // 30 seconds TTL
      setStats(prev => ({
        ...prev,
        hits: prev.hits + 1,
        hitRate: (prev.hits + 1) / (prev.hits + prev.misses + 1)
      }));
      return cached;
    }
    
    setStats(prev => ({
      ...prev,
      misses: prev.misses + 1,
      hitRate: prev.hits / (prev.hits + prev.misses + 1)
    }));
    return null;
  }, [cache]);

  // Set cached data
  const setCachedData = useCallback((filterKey: string, data: Omit<CachedProjectData, 'timestamp' | 'filterKey'>) => {
    const cachedData: CachedProjectData = {
      ...data,
      timestamp: Date.now(),
      filterKey
    };

    setCache(prev => {
      const newCache = new Map(prev);
      
      // Limit cache size to 50 entries
      if (newCache.size >= 50) {
        const firstKey = newCache.keys().next().value;
        newCache.delete(firstKey);
      }
      
      newCache.set(filterKey, cachedData);
      return newCache;
    });

    setStats(prev => ({
      ...prev,
      size: cache.size + 1
    }));
  }, [cache.size]);

  // Clear cache
  const clearCache = useCallback(() => {
    setCache(new Map());
    setStats({
      size: 0,
      hits: 0,
      misses: 0,
      hitRate: 0
    });
  }, []);

  // Auto-cleanup expired entries
  useEffect(() => {
    const cleanup = setInterval(() => {
      setCache(prev => {
        const newCache = new Map();
        const now = Date.now();
        
        prev.forEach((value, key) => {
          if (now - value.timestamp < 30000) {
            newCache.set(key, value);
          }
        });
        
        return newCache;
      });
    }, 60000); // Cleanup every minute

    return () => clearInterval(cleanup);
  }, []);

  // Update cache size in stats
  useEffect(() => {
    setStats(prev => ({ ...prev, size: cache.size }));
  }, [cache.size]);

  return {
    getCachedData,
    setCachedData,
    clearCache,
    generateCacheKey,
    stats
  };
};
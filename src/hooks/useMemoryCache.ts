import { useMemo, useCallback } from 'react';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheStats {
  size: number;
  hits: number;
  misses: number;
  hitRate: number;
}

class MemoryCache {
  private cache = new Map<string, CacheItem<any>>();
  private hits = 0;
  private misses = 0;

  get<T>(key: string, factory: () => T, ttl: number = 5 * 60 * 1000): T {
    const now = Date.now();
    const item = this.cache.get(key);

    if (item && (now - item.timestamp) < item.ttl) {
      this.hits++;
      return item.data;
    }

    this.misses++;
    const data = factory();
    this.cache.set(key, {
      data,
      timestamp: now,
      ttl
    });

    return data;
  }

  clear(): void {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  size(): number {
    return this.cache.size;
  }

  getStats(): CacheStats {
    const total = this.hits + this.misses;
    return {
      size: this.cache.size,
      hits: this.hits,
      misses: this.misses,
      hitRate: total > 0 ? (this.hits / total) * 100 : 0
    };
  }

  // Nettoie les entrées expirées
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if ((now - item.timestamp) >= item.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

export const useMemoryCache = () => {
  const cache = useMemo(() => new MemoryCache(), []);

  // Nettoyage automatique toutes les 5 minutes
  useMemo(() => {
    const interval = setInterval(() => {
      cache.cleanup();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [cache]);

  const get = useCallback(<T>(key: string, factory: () => T, ttl?: number) => {
    return cache.get(key, factory, ttl);
  }, [cache]);

  const clear = useCallback(() => {
    cache.clear();
  }, [cache]);

  const deleteKey = useCallback((key: string) => {
    cache.delete(key);
  }, [cache]);

  const getStats = useCallback(() => {
    return cache.getStats();
  }, [cache]);

  const size = useCallback(() => {
    return cache.size();
  }, [cache]);

  return {
    get,
    clear,
    delete: deleteKey,
    getStats,
    size,
    cleanup: cache.cleanup.bind(cache)
  };
};
import { useCallback, useMemo, useRef } from 'react';

/**
 * Utilitaires de performance pour l'optimisation des composants
 */

// Debounce function pour limiter les appels fréquents
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function pour limiter la fréquence d'exécution
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Hook pour le debouncing
export const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  return useMemo(
    () => debounce((...args: Parameters<T>) => callbackRef.current(...args), delay) as T,
    [delay]
  );
};

// Hook pour le throttling
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  limit: number
): T => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  return useMemo(
    () => throttle((...args: Parameters<T>) => callbackRef.current(...args), limit) as T,
    [limit]
  );
};

// Mesure des performances d'un composant
export const measurePerformance = (name: string) => {
  const start = performance.now();
  return {
    end: () => {
      const end = performance.now();
      console.log(`[Performance] ${name}: ${end - start}ms`);
    }
  };
};

// Hook pour mesurer les performances de rendu
export const useRenderPerformance = (componentName: string) => {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(performance.now());

  renderCount.current += 1;
  const currentTime = performance.now();
  const timeSinceLastRender = currentTime - lastRenderTime.current;
  lastRenderTime.current = currentTime;

  console.log(`[Render] ${componentName} - Count: ${renderCount.current}, Time since last: ${timeSinceLastRender}ms`);
};

// Cache simple en mémoire
class MemoryCache<T> {
  private cache = new Map<string, { value: T; timestamp: number; ttl: number }>();

  set(key: string, value: T, ttl = 5 * 60 * 1000): void { // 5 minutes par défaut
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}

export const memoryCache = new MemoryCache();

// Hook pour le cache de données
export const useDataCache = <T>(
  key: string,
  fetcher: () => Promise<T>,
  options: { ttl?: number; enabled?: boolean } = {}
) => {
  const { ttl = 5 * 60 * 1000, enabled = true } = options;

  return useCallback(async (): Promise<T> => {
    if (!enabled) {
      return fetcher();
    }

    const cached = memoryCache.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const data = await fetcher();
    memoryCache.set(key, data, ttl);
    return data;
  }, [key, fetcher, ttl, enabled]);
};
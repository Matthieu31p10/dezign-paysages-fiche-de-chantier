import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { memoryCache } from '@/utils/performance';

interface PerformanceMetrics {
  renderCount: number;
  averageRenderTime: number;
  lastRenderTime: number;
  totalRenderTime: number;
  cacheHitRate: number;
  cacheSize: number;
}

interface PerformanceSettings {
  enableMetrics: boolean;
  enableCache: boolean;
  cacheDefaultTTL: number;
  maxCacheSize: number;
  logPerformance: boolean;
}

interface PerformanceContextType {
  metrics: PerformanceMetrics;
  settings: PerformanceSettings;
  updateSettings: (newSettings: Partial<PerformanceSettings>) => void;
  measureRender: (componentName: string) => () => void;
  clearCache: () => void;
  getCacheStats: () => { size: number; hitRate: number };
  resetMetrics: () => void;
}

const defaultSettings: PerformanceSettings = {
  enableMetrics: process.env.NODE_ENV === 'development',
  enableCache: true,
  cacheDefaultTTL: 5 * 60 * 1000, // 5 minutes
  maxCacheSize: 100,
  logPerformance: process.env.NODE_ENV === 'development'
};

const defaultMetrics: PerformanceMetrics = {
  renderCount: 0,
  averageRenderTime: 0,
  lastRenderTime: 0,
  totalRenderTime: 0,
  cacheHitRate: 0,
  cacheSize: 0
};

const PerformanceContext = createContext<PerformanceContextType | null>(null);

interface PerformanceProviderProps {
  children: React.ReactNode;
  initialSettings?: Partial<PerformanceSettings>;
}

/**
 * Provider pour la gestion des performances de l'application
 */
export const PerformanceProvider = ({ 
  children, 
  initialSettings = {} 
}: PerformanceProviderProps) => {
  const [settings, setSettings] = useState<PerformanceSettings>({
    ...defaultSettings,
    ...initialSettings
  });
  const [metrics, setMetrics] = useState<PerformanceMetrics>(defaultMetrics);
  
  const cacheHits = useRef(0);
  const cacheRequests = useRef(0);

  const updateSettings = useCallback((newSettings: Partial<PerformanceSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const measureRender = useCallback((componentName: string) => {
    if (!settings.enableMetrics) return () => {};

    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      setMetrics(prev => {
        const newRenderCount = prev.renderCount + 1;
        const newTotalRenderTime = prev.totalRenderTime + renderTime;
        const newAverageRenderTime = newTotalRenderTime / newRenderCount;

        if (settings.logPerformance) {
          console.log(`[Performance] ${componentName}: ${renderTime.toFixed(2)}ms`);
        }

        return {
          ...prev,
          renderCount: newRenderCount,
          averageRenderTime: newAverageRenderTime,
          lastRenderTime: renderTime,
          totalRenderTime: newTotalRenderTime
        };
      });
    };
  }, [settings.enableMetrics, settings.logPerformance]);

  const clearCache = useCallback(() => {
    memoryCache.clear();
    cacheHits.current = 0;
    cacheRequests.current = 0;
    setMetrics(prev => ({ ...prev, cacheSize: 0, cacheHitRate: 0 }));
  }, []);

  const getCacheStats = useCallback(() => {
    const hitRate = cacheRequests.current > 0 ? (cacheHits.current / cacheRequests.current) * 100 : 0;
    return {
      size: 0, // TODO: Implémenter le comptage de taille du cache
      hitRate
    };
  }, []);

  const resetMetrics = useCallback(() => {
    setMetrics(defaultMetrics);
    cacheHits.current = 0;
    cacheRequests.current = 0;
  }, []);

  // Mise à jour périodique des métriques de cache
  useEffect(() => {
    if (!settings.enableMetrics) return;

    const interval = setInterval(() => {
      const stats = getCacheStats();
      setMetrics(prev => ({
        ...prev,
        cacheSize: stats.size,
        cacheHitRate: stats.hitRate
      }));
    }, 5000); // Mise à jour toutes les 5 secondes

    return () => clearInterval(interval);
  }, [settings.enableMetrics, getCacheStats]);

  const value: PerformanceContextType = {
    metrics,
    settings,
    updateSettings,
    measureRender,
    clearCache,
    getCacheStats,
    resetMetrics
  };

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  );
};

/**
 * Hook pour utiliser le contexte de performance
 */
export const usePerformance = (): PerformanceContextType => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformance must be used within a PerformanceProvider');
  }
  return context;
};

/**
 * HOC pour mesurer automatiquement les performances d'un composant
 */
export const withPerformanceMonitoring = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string
) => {
  return React.memo((props: P) => {
    const { measureRender } = usePerformance();
    const name = componentName || WrappedComponent.displayName || WrappedComponent.name || 'UnknownComponent';
    
    useEffect(() => {
      const endMeasure = measureRender(name);
      return endMeasure;
    });

    return <WrappedComponent {...props} />;
  });
};
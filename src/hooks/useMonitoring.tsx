import { useState, useEffect, useCallback, useRef } from 'react';
import { useAnalytics } from '@/context/AnalyticsContext';

interface MonitoringOptions {
  enableErrorTracking?: boolean;
  enablePerformanceTracking?: boolean;
  enableUserBehaviorTracking?: boolean;
  errorThreshold?: number;
  performanceThreshold?: number;
}

interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  cpu: number;
  memory: number;
  errors: number;
  responseTime: number;
  uptime: number;
}

interface Alert {
  id: string;
  type: 'error' | 'performance' | 'security' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: number;
  resolved: boolean;
  data?: Record<string, any>;
}

/**
 * Hook pour le monitoring système en temps réel
 */
export const useSystemMonitoring = (options: MonitoringOptions = {}) => {
  const {
    enableErrorTracking = true,
    enablePerformanceTracking = true,
    enableUserBehaviorTracking = true,
    errorThreshold = 10,
    performanceThreshold = 3000
  } = options;

  const { trackError, trackPerformance, metrics } = useAnalytics();
  const [health, setHealth] = useState<SystemHealth>({
    status: 'healthy',
    cpu: 0,
    memory: 0,
    errors: 0,
    responseTime: 0,
    uptime: Date.now()
  });
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const monitoringInterval = useRef<NodeJS.Timeout>();

  // Monitoring des performances
  const monitorPerformance = useCallback(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const responseTime = navigation?.responseEnd - navigation?.requestStart || 0;
    
    // Monitoring de la mémoire (si disponible)
    const memoryInfo = (performance as any).memory;
    const memoryUsage = memoryInfo ? 
      (memoryInfo.usedJSHeapSize / memoryInfo.totalJSHeapSize) * 100 : 0;

    setHealth(prev => ({
      ...prev,
      responseTime,
      memory: memoryUsage,
      errors: metrics.errors.length
    }));

    // Alertes basées sur les seuils
    if (responseTime > performanceThreshold) {
      createAlert('performance', 'high', `Temps de réponse élevé: ${responseTime}ms`, {
        responseTime,
        threshold: performanceThreshold
      });
    }

    if (metrics.errors.length > errorThreshold) {
      createAlert('error', 'critical', `Nombre d'erreurs élevé: ${metrics.errors.length}`, {
        errorCount: metrics.errors.length,
        threshold: errorThreshold
      });
    }

    // Tracking des performances
    if (enablePerformanceTracking) {
      trackPerformance('response_time', responseTime);
      trackPerformance('memory_usage', memoryUsage);
    }
  }, [metrics.errors.length, performanceThreshold, errorThreshold, enablePerformanceTracking, trackPerformance]);

  // Création d'alertes
  const createAlert = useCallback((
    type: Alert['type'],
    severity: Alert['severity'],
    message: string,
    data?: Record<string, any>
  ) => {
    const alert: Alert = {
      id: Math.random().toString(36).substring(7),
      type,
      severity,
      message,
      timestamp: Date.now(),
      resolved: false,
      data
    };

    setAlerts(prev => [...prev.slice(-99), alert]); // Garder les 100 dernières alertes
  }, []);

  // Résolution d'alertes
  const resolveAlert = useCallback((alertId: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, resolved: true } : alert
      )
    );
  }, []);

  // Nettoyage des alertes résolues
  const clearResolvedAlerts = useCallback(() => {
    setAlerts(prev => prev.filter(alert => !alert.resolved));
  }, []);

  // Monitoring des erreurs globales
  useEffect(() => {
    if (!enableErrorTracking) return;

    const handleError = (event: ErrorEvent) => {
      trackError(new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });

      createAlert('error', 'medium', `Erreur JavaScript: ${event.message}`, {
        filename: event.filename,
        line: event.lineno
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      trackError(new Error('Unhandled Promise Rejection'), {
        reason: event.reason
      });

      createAlert('error', 'high', 'Promise rejetée non gérée', {
        reason: event.reason
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [enableErrorTracking, trackError, createAlert]);

  // Monitoring périodique
  useEffect(() => {
    monitoringInterval.current = setInterval(() => {
      monitorPerformance();
      
      // Mise à jour du statut système
      const errorRate = metrics.errors.length;
      const responseTime = health.responseTime;
      
      let status: SystemHealth['status'] = 'healthy';
      
      if (errorRate > errorThreshold || responseTime > performanceThreshold) {
        status = 'warning';
      }
      
      if (errorRate > errorThreshold * 2 || responseTime > performanceThreshold * 2) {
        status = 'critical';
      }

      setHealth(prev => ({
        ...prev,
        status,
        uptime: Date.now() - prev.uptime
      }));
    }, 5000); // Monitoring toutes les 5 secondes

    return () => {
      if (monitoringInterval.current) {
        clearInterval(monitoringInterval.current);
      }
    };
  }, [monitorPerformance, metrics.errors.length, health.responseTime, errorThreshold, performanceThreshold]);

  return {
    health,
    alerts: alerts.filter(alert => !alert.resolved),
    allAlerts: alerts,
    createAlert,
    resolveAlert,
    clearResolvedAlerts,
    monitorPerformance
  };
};

/**
 * Hook pour le monitoring des erreurs spécifiques
 */
export const useErrorMonitoring = () => {
  const { trackError } = useAnalytics();
  const [errorHistory, setErrorHistory] = useState<Error[]>([]);

  const captureError = useCallback((error: Error, context?: Record<string, any>) => {
    setErrorHistory(prev => [...prev.slice(-49), error]); // Garder les 50 dernières erreurs
    trackError(error, context);
  }, [trackError]);

  const captureException = useCallback((message: string, context?: Record<string, any>) => {
    const error = new Error(message);
    captureError(error, context);
  }, [captureError]);

  return {
    errorHistory,
    captureError,
    captureException
  };
};

/**
 * Hook pour le monitoring des performances de composants
 */
export const useComponentPerformance = (componentName: string) => {
  const { trackPerformance } = useAnalytics();
  const renderStart = useRef<number>();
  const renderCount = useRef(0);

  const startRender = useCallback(() => {
    renderStart.current = performance.now();
  }, []);

  const endRender = useCallback(() => {
    if (renderStart.current) {
      const renderTime = performance.now() - renderStart.current;
      renderCount.current += 1;
      
      trackPerformance(`${componentName}_render_time`, renderTime);
      trackPerformance(`${componentName}_render_count`, renderCount.current);
    }
  }, [componentName, trackPerformance]);

  // Auto-tracking du rendu
  useEffect(() => {
    startRender();
    return endRender;
  });

  return {
    startRender,
    endRender,
    renderCount: renderCount.current
  };
};
import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

interface AnalyticsEvent {
  id: string;
  type: string;
  data: Record<string, any>;
  timestamp: number;
  session: string;
  user?: string;
}

interface AnalyticsMetrics {
  pageViews: Record<string, number>;
  events: Record<string, number>;
  errors: AnalyticsEvent[];
  performance: {
    averageLoadTime: number;
    totalSessions: number;
    bounceRate: number;
  };
  userBehavior: {
    mostUsedFeatures: Record<string, number>;
    settingsChanges: Record<string, number>;
    searchQueries: string[];
  };
}

interface AnalyticsContextType {
  metrics: AnalyticsMetrics;
  trackEvent: (type: string, data?: Record<string, any>) => void;
  trackPageView: (page: string) => void;
  trackError: (error: Error, context?: Record<string, any>) => void;
  trackPerformance: (metric: string, value: number) => void;
  trackUserAction: (action: string, feature: string) => void;
  getEventHistory: (type?: string, limit?: number) => AnalyticsEvent[];
  clearMetrics: () => void;
  exportAnalytics: () => string;
}

const defaultMetrics: AnalyticsMetrics = {
  pageViews: {},
  events: {},
  errors: [],
  performance: {
    averageLoadTime: 0,
    totalSessions: 0,
    bounceRate: 0
  },
  userBehavior: {
    mostUsedFeatures: {},
    settingsChanges: {},
    searchQueries: []
  }
};

const AnalyticsContext = createContext<AnalyticsContextType | null>(null);

interface AnalyticsProviderProps {
  children: React.ReactNode;
  userId?: string;
  enableAutoTracking?: boolean;
}

/**
 * Provider pour le système d'analytics et monitoring
 */
export const AnalyticsProvider = ({ 
  children, 
  userId,
  enableAutoTracking = true 
}: AnalyticsProviderProps) => {
  const [metrics, setMetrics] = useState<AnalyticsMetrics>(defaultMetrics);
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const sessionId = useRef(Math.random().toString(36).substring(7));
  const sessionStart = useRef(Date.now());

  // Tracking des événements
  const trackEvent = useCallback((type: string, data: Record<string, any> = {}) => {
    const event: AnalyticsEvent = {
      id: Math.random().toString(36).substring(7),
      type,
      data,
      timestamp: Date.now(),
      session: sessionId.current,
      user: userId
    };

    setEvents(prev => [...prev.slice(-999), event]); // Garder les 1000 derniers événements

    setMetrics(prev => ({
      ...prev,
      events: {
        ...prev.events,
        [type]: (prev.events[type] || 0) + 1
      }
    }));
  }, [userId]);

  // Tracking des vues de page
  const trackPageView = useCallback((page: string) => {
    trackEvent('page_view', { page });
    
    setMetrics(prev => ({
      ...prev,
      pageViews: {
        ...prev.pageViews,
        [page]: (prev.pageViews[page] || 0) + 1
      }
    }));
  }, [trackEvent]);

  // Tracking des erreurs
  const trackError = useCallback((error: Error, context: Record<string, any> = {}) => {
    const errorEvent: AnalyticsEvent = {
      id: Math.random().toString(36).substring(7),
      type: 'error',
      data: {
        message: error.message,
        stack: error.stack,
        name: error.name,
        ...context
      },
      timestamp: Date.now(),
      session: sessionId.current,
      user: userId
    };

    setEvents(prev => [...prev.slice(-999), errorEvent]);
    
    setMetrics(prev => ({
      ...prev,
      errors: [...prev.errors.slice(-99), errorEvent] // Garder les 100 dernières erreurs
    }));
  }, [userId]);

  // Tracking des performances
  const trackPerformance = useCallback((metric: string, value: number) => {
    trackEvent('performance', { metric, value });
    
    if (metric === 'load_time') {
      setMetrics(prev => {
        const totalSessions = prev.performance.totalSessions + 1;
        const totalLoadTime = prev.performance.averageLoadTime * prev.performance.totalSessions + value;
        
        return {
          ...prev,
          performance: {
            ...prev.performance,
            averageLoadTime: totalLoadTime / totalSessions,
            totalSessions
          }
        };
      });
    }
  }, [trackEvent]);

  // Tracking des actions utilisateur
  const trackUserAction = useCallback((action: string, feature: string) => {
    trackEvent('user_action', { action, feature });
    
    setMetrics(prev => ({
      ...prev,
      userBehavior: {
        ...prev.userBehavior,
        mostUsedFeatures: {
          ...prev.userBehavior.mostUsedFeatures,
          [feature]: (prev.userBehavior.mostUsedFeatures[feature] || 0) + 1
        }
      }
    }));
  }, [trackEvent]);

  // Récupération de l'historique des événements
  const getEventHistory = useCallback((type?: string, limit = 100) => {
    let filteredEvents = events;
    
    if (type) {
      filteredEvents = events.filter(event => event.type === type);
    }
    
    return filteredEvents.slice(-limit).reverse();
  }, [events]);

  // Nettoyage des métriques
  const clearMetrics = useCallback(() => {
    setMetrics(defaultMetrics);
    setEvents([]);
    sessionId.current = Math.random().toString(36).substring(7);
    sessionStart.current = Date.now();
  }, []);

  // Export des analytics
  const exportAnalytics = useCallback(() => {
    const exportData = {
      metrics,
      events: events.slice(-1000),
      session: {
        id: sessionId.current,
        startTime: sessionStart.current,
        duration: Date.now() - sessionStart.current,
        userId
      },
      exportTimestamp: Date.now()
    };
    
    return JSON.stringify(exportData, null, 2);
  }, [metrics, events, userId]);

  // Auto-tracking des performances de navigation
  useEffect(() => {
    if (!enableAutoTracking) return;

    const handleLoad = () => {
      const loadTime = performance.now();
      trackPerformance('load_time', loadTime);
    };

    const handleError = (event: ErrorEvent) => {
      trackError(new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      trackError(new Error('Unhandled Promise Rejection'), {
        reason: event.reason
      });
    };

    window.addEventListener('load', handleLoad);
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Tracking de la session
    trackEvent('session_start', { timestamp: sessionStart.current });

    return () => {
      window.removeEventListener('load', handleLoad);
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      
      // Tracking de fin de session
      trackEvent('session_end', { 
        duration: Date.now() - sessionStart.current 
      });
    };
  }, [enableAutoTracking, trackEvent, trackError, trackPerformance]);

  const value: AnalyticsContextType = {
    metrics,
    trackEvent,
    trackPageView,
    trackError,
    trackPerformance,
    trackUserAction,
    getEventHistory,
    clearMetrics,
    exportAnalytics
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

/**
 * Hook pour utiliser le contexte d'analytics
 */
export const useAnalytics = (): AnalyticsContextType => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

/**
 * HOC pour tracker automatiquement les composants
 */
export const withAnalytics = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  trackingName?: string
) => {
  return React.memo((props: P) => {
    const { trackUserAction, trackPageView } = useAnalytics();
    const componentName = trackingName || WrappedComponent.displayName || WrappedComponent.name || 'UnknownComponent';
    
    useEffect(() => {
      trackPageView(componentName);
    }, [trackPageView, componentName]);

    const trackedProps = {
      ...props,
      onAnalyticsTrack: (action: string) => trackUserAction(action, componentName)
    } as P;

    return <WrappedComponent {...trackedProps} />;
  });
};
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Zap, 
  Timer, 
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Monitor,
  Smartphone,
  RefreshCw
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  networkRequests: number;
  cacheHitRate: number;
  fps: number;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  connection: string;
}

interface PerformanceThresholds {
  loadTime: { good: number; fair: number; };
  renderTime: { good: number; fair: number; };
  memoryUsage: { good: number; fair: number; };
  fps: { good: number; fair: number; };
  cacheHitRate: { good: number; fair: number; };
}

const PERFORMANCE_THRESHOLDS: PerformanceThresholds = {
  loadTime: { good: 1000, fair: 3000 }, // ms
  renderTime: { good: 16, fair: 33 }, // ms (60fps = 16ms, 30fps = 33ms)
  memoryUsage: { good: 50, fair: 100 }, // MB
  fps: { good: 55, fair: 30 },
  cacheHitRate: { good: 80, fair: 60 } // %
};

export const PerformanceMonitor: React.FC = () => {
  const isMobile = useIsMobile();
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [history, setHistory] = useState<PerformanceMetrics[]>([]);

  // Collect performance metrics
  const collectMetrics = useMemo(() => {
    return () => {
      const navigation = performance.getEntriesByType('navigation')[0] as any;
      const memory = (performance as any).memory;
      const connection = (navigator as any).connection;
      
      const newMetrics: PerformanceMetrics = {
        loadTime: navigation?.loadEventEnd - navigation?.loadEventStart || 0,
        renderTime: performance.now(),
        memoryUsage: memory ? Math.round(memory.usedJSHeapSize / 1024 / 1024) : 0,
        networkRequests: performance.getEntriesByType('resource').length,
        cacheHitRate: calculateCacheHitRate(),
        fps: calculateFPS(),
        deviceType: isMobile ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop',
        connection: connection?.effectiveType || 'unknown'
      };

      setMetrics(newMetrics);
      setHistory(prev => [...prev.slice(-9), newMetrics]);
    };
  }, [isMobile]);

  // Calculate cache hit rate (simplified)
  const calculateCacheHitRate = (): number => {
    const resources = performance.getEntriesByType('resource');
    const cachedResources = resources.filter((resource: any) => 
      resource.transferSize === 0 && resource.decodedBodySize > 0
    );
    return resources.length > 0 ? Math.round((cachedResources.length / resources.length) * 100) : 0;
  };

  // Calculate FPS (simplified estimation)
  const calculateFPS = (): number => {
    return 60; // Simplified - in real implementation, you'd measure frame times
  };

  // Start/stop monitoring
  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(collectMetrics, 5000);
      collectMetrics(); // Initial collection
      return () => clearInterval(interval);
    }
  }, [isMonitoring, collectMetrics]);

  // Performance status helper
  const getPerformanceStatus = (value: number, thresholds: { good: number; fair: number; }, higherIsBetter = false) => {
    if (higherIsBetter) {
      if (value >= thresholds.good) return { status: 'good', color: 'success' };
      if (value >= thresholds.fair) return { status: 'fair', color: 'warning' };
      return { status: 'poor', color: 'destructive' };
    } else {
      if (value <= thresholds.good) return { status: 'good', color: 'success' };
      if (value <= thresholds.fair) return { status: 'fair', color: 'warning' };
      return { status: 'poor', color: 'destructive' };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'fair': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  if (!metrics && !isMonitoring) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Moniteur de Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Monitor className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">
              Surveillez les performances de l'application en temps réel
            </p>
            <Button onClick={() => setIsMonitoring(true)}>
              <Activity className="h-4 w-4 mr-2" />
              Démarrer le monitoring
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Performance Dashboard */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Performance en Temps Réel
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={metrics?.deviceType === 'mobile' ? 'default' : 'secondary'}>
                {metrics?.deviceType === 'mobile' ? <Smartphone className="h-3 w-3 mr-1" /> : <Monitor className="h-3 w-3 mr-1" />}
                {metrics?.deviceType}
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsMonitoring(!isMonitoring)}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isMonitoring ? 'animate-spin' : ''}`} />
                {isMonitoring ? 'Arrêter' : 'Redémarrer'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {metrics && (
            <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3'}`}>
              {/* Load Time */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Timer className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Temps de Chargement</p>
                    <p className="text-2xl font-bold">{metrics.loadTime}ms</p>
                  </div>
                </div>
                {getStatusIcon(getPerformanceStatus(metrics.loadTime, PERFORMANCE_THRESHOLDS.loadTime).status)}
              </div>

              {/* Render Time */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-sm font-medium">Temps de Rendu</p>
                    <p className="text-2xl font-bold">{Math.round(metrics.renderTime)}ms</p>
                  </div>
                </div>
                {getStatusIcon(getPerformanceStatus(metrics.renderTime, PERFORMANCE_THRESHOLDS.renderTime).status)}
              </div>

              {/* Memory Usage */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm font-medium">Mémoire Utilisée</p>
                    <p className="text-2xl font-bold">{metrics.memoryUsage}MB</p>
                  </div>
                </div>
                {getStatusIcon(getPerformanceStatus(metrics.memoryUsage, PERFORMANCE_THRESHOLDS.memoryUsage).status)}
              </div>

              {/* Network Requests */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Activity className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Requêtes Réseau</p>
                    <p className="text-2xl font-bold">{metrics.networkRequests}</p>
                  </div>
                </div>
                <Badge variant="outline">{metrics.connection}</Badge>
              </div>

              {/* Cache Hit Rate */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <TrendingDown className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm font-medium">Taux de Cache</p>
                    <p className="text-2xl font-bold">{metrics.cacheHitRate}%</p>
                  </div>
                </div>
                {getStatusIcon(getPerformanceStatus(metrics.cacheHitRate, PERFORMANCE_THRESHOLDS.cacheHitRate, true).status)}
              </div>

              {/* FPS */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Monitor className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-sm font-medium">FPS</p>
                    <p className="text-2xl font-bold">{metrics.fps}</p>
                  </div>
                </div>
                {getStatusIcon(getPerformanceStatus(metrics.fps, PERFORMANCE_THRESHOLDS.fps, true).status)}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance History */}
      {history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historique des Performances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {history.slice(-5).map((record, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">{record.deviceType}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span>Chargement: {record.loadTime}ms</span>
                    <span>Mémoire: {record.memoryUsage}MB</span>
                    <span>Cache: {record.cacheHitRate}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommandations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics && metrics.loadTime > PERFORMANCE_THRESHOLDS.loadTime.fair && (
              <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium">Temps de chargement élevé</p>
                  <p className="text-sm text-muted-foreground">
                    Considérez l'optimisation du code JavaScript et la compression des ressources.
                  </p>
                </div>
              </div>
            )}
            
            {metrics && metrics.memoryUsage > PERFORMANCE_THRESHOLDS.memoryUsage.fair && (
              <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-medium">Utilisation mémoire élevée</p>
                  <p className="text-sm text-muted-foreground">
                    Vérifiez les fuites mémoire et optimisez les composants React.
                  </p>
                </div>
              </div>
            )}
            
            {metrics && metrics.cacheHitRate < PERFORMANCE_THRESHOLDS.cacheHitRate.fair && (
              <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium">Taux de cache faible</p>
                  <p className="text-sm text-muted-foreground">
                    Implémentez une stratégie de cache plus efficace pour améliorer les performances.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
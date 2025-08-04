import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Database, Timer, TrendingUp } from 'lucide-react';

interface PerformanceMetrics {
  filterTime: number;
  sortTime: number;
  renderTime: number;
  totalProjects: number;
  filteredProjects: number;
}

interface CacheStats {
  size: number;
  hits: number;
  misses: number;
  hitRate: number;
}

interface PerformanceIndicatorProps {
  metrics: PerformanceMetrics;
  cacheStats: CacheStats;
  onClearCache?: () => void;
  visible?: boolean;
}

const PerformanceIndicator: React.FC<PerformanceIndicatorProps> = ({
  metrics,
  cacheStats,
  onClearCache,
  visible = false
}) => {
  if (!visible) return null;

  const formatTime = (ms: number) => {
    if (ms < 1) return `${(ms * 1000).toFixed(0)}μs`;
    if (ms < 1000) return `${ms.toFixed(1)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const getPerformanceColor = (time: number) => {
    if (time < 5) return 'text-green-600 bg-green-50';
    if (time < 20) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getCacheColor = (hitRate: number) => {
    if (hitRate > 80) return 'text-green-600 bg-green-50';
    if (hitRate > 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <Card className="mb-4 border-2 border-blue-200 bg-blue-50/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Métriques de performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          {/* Temps de filtrage */}
          <div className="flex items-center gap-2">
            <Timer className="h-3 w-3 text-blue-500" />
            <div>
              <div className="font-medium">Filtrage</div>
              <Badge variant="outline" className={getPerformanceColor(metrics.filterTime)}>
                {formatTime(metrics.filterTime)}
              </Badge>
            </div>
          </div>

          {/* Temps de tri */}
          <div className="flex items-center gap-2">
            <TrendingUp className="h-3 w-3 text-purple-500" />
            <div>
              <div className="font-medium">Tri</div>
              <Badge variant="outline" className={getPerformanceColor(metrics.sortTime)}>
                {formatTime(metrics.sortTime)}
              </Badge>
            </div>
          </div>

          {/* Temps de rendu */}
          <div className="flex items-center gap-2">
            <Activity className="h-3 w-3 text-orange-500" />
            <div>
              <div className="font-medium">Rendu</div>
              <Badge variant="outline" className={getPerformanceColor(metrics.renderTime)}>
                {formatTime(metrics.renderTime)}
              </Badge>
            </div>
          </div>

          {/* Cache */}
          <div className="flex items-center gap-2">
            <Database className="h-3 w-3 text-green-500" />
            <div>
              <div className="font-medium">Cache</div>
              <Badge variant="outline" className={getCacheColor(cacheStats.hitRate)}>
                {cacheStats.hitRate.toFixed(1)}%
              </Badge>
            </div>
          </div>
        </div>

        {/* Détails additionnels */}
        <div className="mt-3 pt-3 border-t border-blue-200 grid grid-cols-2 gap-4 text-xs text-gray-600">
          <div>
            <span className="font-medium">Projets:</span> {metrics.filteredProjects}/{metrics.totalProjects}
          </div>
          <div>
            <span className="font-medium">Cache:</span> {cacheStats.size} entrées
          </div>
          <div>
            <span className="font-medium">Hits:</span> {cacheStats.hits}
          </div>
          <div>
            <span className="font-medium">Misses:</span> {cacheStats.misses}
          </div>
        </div>

        {onClearCache && (
          <div className="mt-3 pt-3 border-t border-blue-200">
            <button
              onClick={onClearCache}
              className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
            >
              Vider le cache
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PerformanceIndicator;
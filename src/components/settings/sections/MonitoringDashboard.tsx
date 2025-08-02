import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAnalytics } from '@/context/AnalyticsContext';
import { useSystemMonitoring, useComponentPerformance } from '@/hooks/useMonitoring';
import { 
  Activity, 
  AlertTriangle, 
  BarChart3, 
  Clock, 
  Download, 
  Eye, 
  Shield, 
  TrendingUp,
  Users,
  Zap,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const MonitoringDashboard = () => {
  const { 
    metrics, 
    trackEvent, 
    trackUserAction, 
    getEventHistory, 
    clearMetrics, 
    exportAnalytics 
  } = useAnalytics();
  
  const { 
    health, 
    alerts, 
    resolveAlert, 
    clearResolvedAlerts 
  } = useSystemMonitoring({
    errorThreshold: 5,
    performanceThreshold: 2000
  });

  const { renderCount } = useComponentPerformance('MonitoringDashboard');
  const [selectedTab, setSelectedTab] = useState('overview');

  // Tracking des interactions utilisateur
  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
    trackUserAction('tab_change', `monitoring_${tab}`);
  };

  const handleExportAnalytics = () => {
    const data = exportAnalytics();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    trackUserAction('export', 'analytics_data');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-blue-100 text-blue-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Simulation d'événements pour la démonstration
  useEffect(() => {
    const timer = setInterval(() => {
      if (Math.random() > 0.8) {
        trackEvent('demo_event', { type: 'automated', value: Math.random() * 100 });
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [trackEvent]);

  const recentEvents = getEventHistory(undefined, 10);
  const totalEvents = Object.values(metrics.events).reduce((sum, count) => sum + count, 0);
  const totalPageViews = Object.values(metrics.pageViews).reduce((sum, count) => sum + count, 0);

  return (
    <div className="space-y-6">
      {/* Vue d'ensemble du système */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Statut système</CardTitle>
            {getStatusIcon(health.status)}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{health.status}</div>
            <p className="text-xs text-muted-foreground">
              Temps de réponse: {health.responseTime.toFixed(0)}ms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Événements totaux</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvents.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {recentEvents.length} récents
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vues de page</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPageViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Depuis le début de session
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertes actives</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts.length}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.errors.length} erreurs totales
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Onglets détaillés */}
      <Tabs value={selectedTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="events">Événements</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="alerts">Alertes</TabsTrigger>
          <TabsTrigger value="behavior">Comportement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Métriques système
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Mémoire utilisée:</span>
                  <span>{health.memory.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Erreurs:</span>
                  <span>{health.errors}</span>
                </div>
                <div className="flex justify-between">
                  <span>Temps de réponse:</span>
                  <span>{health.responseTime.toFixed(0)}ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Rendus du composant:</span>
                  <span>{renderCount}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Tendances
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Performance moyenne:</span>
                  <span>{metrics.performance.averageLoadTime.toFixed(0)}ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Sessions totales:</span>
                  <span>{metrics.performance.totalSessions}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taux de rebond:</span>
                  <span>{metrics.performance.bounceRate.toFixed(1)}%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Événements récents
              </CardTitle>
              <CardDescription>
                Les 10 derniers événements trackés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {recentEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <Badge variant="outline">{event.type}</Badge>
                      <span className="ml-2 text-sm">{JSON.stringify(event.data)}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Métriques de performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 border rounded">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{health.responseTime.toFixed(0)}ms</div>
                  <div className="text-sm text-muted-foreground">Temps de réponse</div>
                </div>
                <div className="text-center p-4 border rounded">
                  <Activity className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{health.memory.toFixed(1)}%</div>
                  <div className="text-sm text-muted-foreground">Mémoire</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Alertes système
                </CardTitle>
                <CardDescription>
                  {alerts.length} alertes actives
                </CardDescription>
              </div>
              <Button variant="outline" onClick={clearResolvedAlerts}>
                Nettoyer résolues
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {alerts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucune alerte active
                  </div>
                ) : (
                  alerts.map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                          <Badge variant="outline">{alert.type}</Badge>
                        </div>
                        <div className="text-sm">{alert.message}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(alert.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => resolveAlert(alert.id)}
                      >
                        Résoudre
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Comportement utilisateur
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Fonctionnalités les plus utilisées</h4>
                  <div className="space-y-2">
                    {Object.entries(metrics.userBehavior.mostUsedFeatures).map(([feature, count]) => (
                      <div key={feature} className="flex justify-between items-center">
                        <span className="text-sm">{feature}</span>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Pages vues</h4>
                  <div className="space-y-2">
                    {Object.entries(metrics.pageViews).map(([page, views]) => (
                      <div key={page} className="flex justify-between items-center">
                        <span className="text-sm">{page}</span>
                        <Badge variant="secondary">{views}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <div className="flex gap-2">
        <Button onClick={handleExportAnalytics} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Exporter analytics
        </Button>
        <Button variant="outline" onClick={clearMetrics}>
          Nettoyer métriques
        </Button>
        <Button 
          variant="outline" 
          onClick={() => trackEvent('manual_test', { timestamp: Date.now() })}
        >
          Test événement
        </Button>
      </div>
    </div>
  );
};

export default MonitoringDashboard;
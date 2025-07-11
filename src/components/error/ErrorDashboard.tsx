import React, { useState, useEffect } from 'react';
import { ErrorLogger, ErrorInfo } from '@/utils/errorHandler';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, BarChart3, Trash2, Download, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export const ErrorDashboard: React.FC = () => {
  const [errors, setErrors] = useState<ErrorInfo[]>([]);
  const [stats, setStats] = useState(ErrorLogger.getErrorStats());

  const refreshData = () => {
    setErrors(ErrorLogger.getErrors());
    setStats(ErrorLogger.getErrorStats());
  };

  useEffect(() => {
    refreshData();
    
    // Refresh automatique toutes les 30 secondes
    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const clearAllErrors = () => {
    ErrorLogger.clearErrors();
    refreshData();
  };

  const exportErrors = () => {
    const dataStr = JSON.stringify(errors, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `errors-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Tableau de bord des erreurs</h2>
          <p className="text-muted-foreground">
            Monitoring et gestion des erreurs de l'application
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshData} size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button variant="outline" onClick={exportErrors} size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button variant="destructive" onClick={clearAllErrors} size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Effacer tout
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dernière heure</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lastHour}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dernières 24h</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.last24h}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critiques</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {stats.bySeverity.critical}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des erreurs */}
      <Card>
        <CardHeader>
          <CardTitle>Erreurs récentes</CardTitle>
          <CardDescription>
            Liste des {errors.length} erreurs enregistrées
          </CardDescription>
        </CardHeader>
        <CardContent>
          {errors.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucune erreur enregistrée
            </div>
          ) : (
            <div className="space-y-4">
              {errors.map((error, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={getSeverityColor(error.severity)}>
                          {error.severity}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatDistanceToNow(error.timestamp, { 
                            addSuffix: true, 
                            locale: fr 
                          })}
                        </span>
                      </div>
                      <p className="font-medium">{error.message}</p>
                      <p className="text-sm text-muted-foreground">
                        {error.url}
                      </p>
                    </div>
                  </div>
                  
                  {error.context && (
                    <details className="text-sm">
                      <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                        Contexte
                      </summary>
                      <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                        {JSON.stringify(error.context, null, 2)}
                      </pre>
                    </details>
                  )}
                  
                  {error.stack && (
                    <details className="text-sm">
                      <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                        Stack trace
                      </summary>
                      <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto max-h-32">
                        {error.stack}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorDashboard;
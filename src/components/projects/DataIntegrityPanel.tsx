import React, { useState, useEffect, useCallback } from 'react';
import { ProjectInfo, WorkLog } from '@/types/models';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Database, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  RefreshCw,
  Wifi,
  WifiOff,
  Clock,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProjectSync } from '@/hooks/useProjectSync';
import { toast } from 'sonner';

interface DataIntegrityPanelProps {
  projects: ProjectInfo[];
  workLogs: WorkLog[];
  className?: string;
}

export const DataIntegrityPanel: React.FC<DataIntegrityPanelProps> = ({
  projects,
  workLogs,
  className
}) => {
  const [integrityCheck, setIntegrityCheck] = useState<{
    isValid: boolean;
    issues: string[];
    lastCheck: Date | null;
    checking: boolean;
  }>({
    isValid: true,
    issues: [],
    lastCheck: null,
    checking: false
  });

  const { 
    syncStatus, 
    syncPendingChanges, 
    clearPendingChanges, 
    validateDataIntegrity 
  } = useProjectSync();

  const runIntegrityCheck = useCallback(async () => {
    setIntegrityCheck(prev => ({ ...prev, checking: true }));
    
    try {
      const result = await validateDataIntegrity(projects, workLogs);
      setIntegrityCheck({
        isValid: result.isValid,
        issues: result.issues,
        lastCheck: new Date(),
        checking: false
      });

      if (result.isValid) {
        toast.success('Vérification d\'intégrité réussie');
      } else {
        toast.warning(`${result.issues.length} problème(s) détecté(s)`);
      }
    } catch (error) {
      console.error('Integrity check failed:', error);
      setIntegrityCheck(prev => ({ 
        ...prev, 
        checking: false,
        issues: ['Erreur lors de la vérification d\'intégrité']
      }));
      toast.error('Échec de la vérification d\'intégrité');
    }
  }, [projects, workLogs, validateDataIntegrity]);

  // Auto-check on mount and when data changes
  useEffect(() => {
    const timer = setTimeout(() => {
      runIntegrityCheck();
    }, 1000);

    return () => clearTimeout(timer);
  }, [projects.length, workLogs.length, runIntegrityCheck]);

  const getSyncStatusIcon = () => {
    if (!syncStatus.isOnline) {
      return <WifiOff className="h-4 w-4 text-red-500" />;
    }
    if (syncStatus.syncInProgress) {
      return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
    }
    if (syncStatus.pendingChanges > 0) {
      return <Clock className="h-4 w-4 text-yellow-500" />;
    }
    return <Wifi className="h-4 w-4 text-green-500" />;
  };

  const getSyncStatusText = () => {
    if (!syncStatus.isOnline) return 'Hors ligne';
    if (syncStatus.syncInProgress) return 'Synchronisation...';
    if (syncStatus.pendingChanges > 0) return `${syncStatus.pendingChanges} en attente`;
    return 'Synchronisé';
  };

  const getIntegrityIcon = () => {
    if (integrityCheck.checking) {
      return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
    }
    if (integrityCheck.isValid) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  return (
    <Card className={cn("border-2", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Intégrité des données
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Sync Status */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            {getSyncStatusIcon()}
            <span className="text-sm font-medium">Synchronisation</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={syncStatus.isOnline ? 'default' : 'destructive'}>
              {getSyncStatusText()}
            </Badge>
            {syncStatus.lastSync && (
              <span className="text-xs text-muted-foreground">
                {syncStatus.lastSync.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        {/* Pending Changes */}
        {syncStatus.pendingChanges > 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>
                {syncStatus.pendingChanges} changement(s) en attente de synchronisation
              </span>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={syncPendingChanges}
                  disabled={syncStatus.syncInProgress}
                >
                  Synchroniser
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={clearPendingChanges}
                >
                  Annuler
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Sync Errors */}
        {syncStatus.errors.length > 0 && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                <p className="font-medium">Erreurs de synchronisation:</p>
                {syncStatus.errors.map((error, index) => (
                  <p key={index} className="text-sm">• {error}</p>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Data Integrity */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getIntegrityIcon()}
              <span className="text-sm font-medium">Intégrité des données</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={runIntegrityCheck}
              disabled={integrityCheck.checking}
            >
              {integrityCheck.checking ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Shield className="h-4 w-4" />
              )}
              Vérifier
            </Button>
          </div>

          {/* Integrity Status */}
          {integrityCheck.lastCheck && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  {integrityCheck.isValid ? 'Données intègres' : 'Problèmes détectés'}
                </span>
                <Badge variant={integrityCheck.isValid ? 'default' : 'destructive'}>
                  {integrityCheck.isValid ? 'OK' : `${integrityCheck.issues.length} problème(s)`}
                </Badge>
              </div>
              
              <div className="text-xs text-muted-foreground">
                Dernière vérification: {integrityCheck.lastCheck.toLocaleString()}
              </div>
            </div>
          )}

          {/* Issues List */}
          {integrityCheck.issues.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-medium">Problèmes détectés:</p>
                  {integrityCheck.issues.map((issue, index) => (
                    <p key={index} className="text-sm">• {issue}</p>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Data Statistics */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{projects.length}</div>
            <div className="text-xs text-muted-foreground">Projets</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{workLogs.length}</div>
            <div className="text-xs text-muted-foreground">Fiches de suivi</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
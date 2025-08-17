import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Shield, Users, Activity, Lock, Eye, Settings } from 'lucide-react';
import { usePermissions } from '@/context/PermissionsContext';
import { useSecurity } from '@/hooks/useSecurity';
import SecurityAuditLog from './SecurityAuditLog';
import AdvancedPermissionManager from './AdvancedPermissionManager';
import SessionMonitor from './SessionMonitor';
import ThreatDetection from './ThreatDetection';

interface SecurityMetric {
  label: string;
  value: string | number;
  status: 'success' | 'warning' | 'danger';
  icon: React.ElementType;
}

const SecurityDashboard = () => {
  const { userLevel, hasPermission } = usePermissions();
  const { securityState } = useSecurity();
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetric[]>([]);
  const [alerts, setAlerts] = useState<Array<{
    id: string;
    type: 'warning' | 'danger' | 'info';
    message: string;
    timestamp: Date;
  }>>([]);

  useEffect(() => {
    // Calculer les métriques de sécurité
    const metrics: SecurityMetric[] = [
      {
        label: 'Statut de sécurité',
        value: securityState.isBlocked ? 'Bloqué' : 'Actif',
        status: securityState.isBlocked ? 'danger' : 'success',
        icon: Shield
      },
      {
        label: 'Tentatives de connexion',
        value: securityState.loginAttempts,
        status: securityState.loginAttempts > 3 ? 'warning' : 'success',
        icon: Lock
      },
      {
        label: 'Session valide',
        value: securityState.sessionValid ? 'Oui' : 'Non',
        status: securityState.sessionValid ? 'success' : 'danger',
        icon: Activity
      },
      {
        label: 'Niveau utilisateur',
        value: userLevel.toUpperCase(),
        status: userLevel === 'admin' ? 'success' : userLevel === 'manager' ? 'warning' : 'success',
        icon: Users
      }
    ];

    setSecurityMetrics(metrics);

    // Générer des alertes basées sur l'état de sécurité
    const newAlerts = [];
    if (securityState.isBlocked) {
      newAlerts.push({
        id: 'blocked',
        type: 'danger' as const,
        message: 'Compte temporairement bloqué en raison de tentatives de connexion multiples',
        timestamp: new Date()
      });
    }
    if (securityState.loginAttempts > 3) {
      newAlerts.push({
        id: 'attempts',
        type: 'warning' as const,
        message: `${securityState.loginAttempts} tentatives de connexion détectées`,
        timestamp: new Date()
      });
    }
    if (!securityState.sessionValid) {
      newAlerts.push({
        id: 'session',
        type: 'warning' as const,
        message: 'Session invalide détectée',
        timestamp: new Date()
      });
    }

    setAlerts(newAlerts);
  }, [securityState, userLevel]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-success/10 text-success border-success/20';
      case 'warning': return 'bg-warning/10 text-warning border-warning/20';
      case 'danger': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (!hasPermission('system.security')) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Accès refusé
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Vous n'avez pas les permissions nécessaires pour accéder au tableau de bord de sécurité.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec alertes */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sécurité & Permissions</h1>
          <p className="text-muted-foreground">
            Surveillez et gérez la sécurité de votre application
          </p>
        </div>
        {alerts.length > 0 && (
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <Badge variant="destructive">{alerts.length} alerte(s)</Badge>
          </div>
        )}
      </div>

      {/* Métriques de sécurité */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {securityMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {metric.label}
                    </p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${getStatusColor(metric.status)}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Alertes de sécurité */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alertes de sécurité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border ${getStatusColor(alert.type)}`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{alert.message}</p>
                    <span className="text-xs opacity-70">
                      {alert.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs principales */}
      <Tabs defaultValue="monitoring" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="monitoring" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Surveillance
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Permissions
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Sessions
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Audit
          </TabsTrigger>
          <TabsTrigger value="threats" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Menaces
          </TabsTrigger>
        </TabsList>

        <TabsContent value="monitoring" className="space-y-4">
          <SessionMonitor />
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <AdvancedPermissionManager />
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des sessions</CardTitle>
              <CardDescription>
                Surveillez et gérez les sessions utilisateur actives
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Fonctionnalité de gestion des sessions en cours de développement
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <SecurityAuditLog />
        </TabsContent>

        <TabsContent value="threats" className="space-y-4">
          <ThreatDetection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityDashboard;
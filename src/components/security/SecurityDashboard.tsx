import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  AlertTriangle, 
  Activity, 
  Eye, 
  Users, 
  Database,
  TrendingUp,
  Clock,
  MapPin,
  RefreshCw
} from 'lucide-react';
import { useSecurityMonitoring } from '@/hooks/useSecurityMonitoring';
import { formatDistanceToNow, format } from 'date-fns';
import { fr } from 'date-fns/locale';

const SecurityDashboard = () => {
  const {
    securityEvents,
    activeSessions,
    dataAccessLogs,
    securityStats,
    loading,
    error,
    resolveSecurityEvent,
    markSessionSuspicious,
    refreshData
  } = useSecurityMonitoring();

  const [selectedTab, setSelectedTab] = useState('overview');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-destructive text-destructive-foreground';
      case 'high': return 'bg-warning text-warning-foreground';
      case 'medium': return 'bg-secondary text-secondary-foreground';
      case 'low': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getEventTypeIcon = (eventType: string) => {
    switch (eventType) {
      case 'login_attempt': return <Users className="h-4 w-4" />;
      case 'mfa_challenge': return <Shield className="h-4 w-4" />;
      case 'password_change': return <Eye className="h-4 w-4" />;
      case 'data_access': return <Database className="h-4 w-4" />;
      case 'suspicious_activity': return <AlertTriangle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        <span>Chargement du tableau de bord sécurité...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Erreur lors du chargement des données de sécurité: {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tableau de Bord Sécurité</h1>
          <p className="text-muted-foreground">
            Surveillance et audit de la sécurité en temps réel
          </p>
        </div>
        <Button onClick={refreshData} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="events">Événements</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="access">Accès Données</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Métriques principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Événements (24h)</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{securityStats.totalEvents}</div>
                <p className="text-xs text-muted-foreground">
                  Toutes les activités de sécurité
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Alertes Critiques</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">
                  {securityStats.criticalEvents}
                </div>
                <p className="text-xs text-muted-foreground">
                  Nécessitent une attention immédiate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sessions Suspectes</CardTitle>
                <Shield className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">
                  {securityStats.suspiciousSessions}
                </div>
                <p className="text-xs text-muted-foreground">
                  Sessions marquées comme suspectes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Accès Récents</CardTitle>
                <Database className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{securityStats.recentDataAccess}</div>
                <p className="text-xs text-muted-foreground">
                  Accès aux données (1h)
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Alertes critiques */}
          {securityStats.criticalEvents > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>{securityStats.criticalEvents} alertes critiques</strong> nécessitent votre attention immédiate.
                Consultez l'onglet "Événements" pour plus de détails.
              </AlertDescription>
            </Alert>
          )}

          {/* IP à risque et types d'événements */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Top IP à Risque
                </CardTitle>
                <CardDescription>
                  Adresses IP avec le score de risque le plus élevé
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {securityStats.topRiskIPs.slice(0, 5).map((item, index) => (
                    <div key={item.ip} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-xs">
                          #{index + 1}
                        </Badge>
                        <code className="text-sm font-mono">{item.ip}</code>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {item.count} événements
                        </span>
                        <Badge variant={item.risk_score >= 70 ? 'destructive' : item.risk_score >= 40 ? 'secondary' : 'outline'}>
                          {item.risk_score}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {securityStats.topRiskIPs.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Aucune activité à risque détectée
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Types d'Événements
                </CardTitle>
                <CardDescription>
                  Répartition des événements de sécurité
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {securityStats.eventsByType.slice(0, 5).map((item) => (
                    <div key={item.type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getEventTypeIcon(item.type)}
                        <span className="text-sm capitalize">
                          {item.type.replace('_', ' ')}
                        </span>
                      </div>
                      <Badge variant="outline">{item.count}</Badge>
                    </div>
                  ))}
                  {securityStats.eventsByType.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Aucun événement récent
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Événements de Sécurité Récents</CardTitle>
              <CardDescription>
                Liste des derniers événements de sécurité avec leur niveau de gravité
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityEvents.slice(0, 20).map((event) => (
                  <div key={event.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getEventTypeIcon(event.event_type)}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium capitalize">
                              {event.event_type.replace('_', ' ')}
                            </span>
                            <Badge className={getSeverityColor(event.severity)}>
                              {event.severity}
                            </Badge>
                            {event.risk_score > 0 && (
                              <Badge variant="outline">
                                Risque: {event.risk_score}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {event.user_email && `Utilisateur: ${event.user_email} • `}
                            {event.ip_address && `IP: ${event.ip_address} • `}
                            <Clock className="inline h-3 w-3 mr-1" />
                            {formatDistanceToNow(new Date(event.created_at), {
                              addSuffix: true,
                              locale: fr
                            })}
                          </p>
                          {Object.keys(event.event_details).length > 0 && (
                            <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                              <code>{JSON.stringify(event.event_details, null, 2)}</code>
                            </div>
                          )}
                        </div>
                      </div>
                      {!event.resolved_at && event.severity === 'critical' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => resolveSecurityEvent(event.id, 'Résolu par l\'administrateur')}
                        >
                          Résoudre
                        </Button>
                      )}
                    </div>
                    {event.resolved_at && (
                      <div className="mt-2 pt-2 border-t text-xs text-success">
                        ✓ Résolu le {format(new Date(event.resolved_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                        {event.resolution_notes && ` - ${event.resolution_notes}`}
                      </div>
                    )}
                  </div>
                ))}
                {securityEvents.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Aucun événement de sécurité récent
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sessions Actives</CardTitle>
              <CardDescription>
                Surveillance en temps réel des sessions utilisateurs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeSessions.map((session) => (
                  <div key={session.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={session.is_suspicious ? 'destructive' : 'default'}>
                            {session.is_suspicious ? 'Suspecte' : 'Normale'}
                          </Badge>
                          {session.mfa_verified && (
                            <Badge variant="outline">
                              <Shield className="h-3 w-3 mr-1" />
                              MFA Vérifié
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>IP: <code>{session.ip_address}</code></p>
                          <p>Connexion: {format(new Date(session.login_time), 'dd/MM/yyyy à HH:mm', { locale: fr })}</p>
                          <p>Dernière activité: {formatDistanceToNow(new Date(session.last_activity), {
                            addSuffix: true,
                            locale: fr
                          })}</p>
                          {session.user_agent && (
                            <p className="truncate">Agent: {session.user_agent}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={session.is_suspicious ? "default" : "destructive"}
                          onClick={() => markSessionSuspicious(session.id, !session.is_suspicious)}
                        >
                          {session.is_suspicious ? 'Réhabiliter' : 'Marquer Suspecte'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {activeSessions.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Aucune session active
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Logs d'Accès aux Données</CardTitle>
              <CardDescription>
                Audit des accès aux tables sensibles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dataAccessLogs.slice(0, 20).map((log) => (
                  <div key={log.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={log.success ? 'default' : 'destructive'}>
                            {log.operation}
                          </Badge>
                          <span className="font-medium">{log.table_name}</span>
                          {log.row_count > 0 && (
                            <Badge variant="outline">
                              {log.row_count} enregistrement{log.row_count > 1 ? 's' : ''}
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {log.ip_address && `IP: ${log.ip_address} • `}
                          <Clock className="inline h-3 w-3 mr-1" />
                          {format(new Date(log.created_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                          {log.execution_time_ms && ` • ${log.execution_time_ms}ms`}
                        </div>
                        {log.error_message && (
                          <p className="text-sm text-destructive">
                            Erreur: {log.error_message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {dataAccessLogs.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Aucun accès aux données récent
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityDashboard;
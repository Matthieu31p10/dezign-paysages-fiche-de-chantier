import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Activity, 
  Clock, 
  MapPin, 
  Monitor, 
  Smartphone, 
  Tablet,
  LogOut,
  AlertTriangle,
  Wifi,
  WifiOff
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ActiveSession {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  device: {
    type: 'desktop' | 'mobile' | 'tablet';
    browser: string;
    os: string;
  };
  location: {
    ip: string;
    city: string;
    country: string;
  };
  startTime: Date;
  lastActivity: Date;
  isOnline: boolean;
  sessionDuration: number; // en minutes
  pagesVisited: number;
  actionsPerformed: number;
}

interface SystemMetrics {
  totalActiveSessions: number;
  averageSessionDuration: number;
  peakConcurrentUsers: number;
  totalUniqueUsers: number;
  securityAlerts: number;
}

const SessionMonitor = () => {
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'1h' | '24h' | '7d'>('24h');

  useEffect(() => {
    // Générer des sessions factices
    const generateMockSessions = (): ActiveSession[] => {
      const users = [
        { id: '1', name: 'Jean Dupont', email: 'jean@example.com', role: 'admin' },
        { id: '2', name: 'Marie Martin', email: 'marie@example.com', role: 'manager' },
        { id: '3', name: 'Pierre Durand', email: 'pierre@example.com', role: 'user' },
        { id: '4', name: 'Sophie Moreau', email: 'sophie@example.com', role: 'user' },
        { id: '5', name: 'Lucas Bernard', email: 'lucas@example.com', role: 'manager' }
      ];

      const devices = [
        { type: 'desktop' as const, browser: 'Chrome', os: 'Windows 10' },
        { type: 'mobile' as const, browser: 'Safari', os: 'iOS 17' },
        { type: 'tablet' as const, browser: 'Firefox', os: 'Android 13' },
        { type: 'desktop' as const, browser: 'Edge', os: 'Windows 11' },
        { type: 'mobile' as const, browser: 'Chrome', os: 'Android 14' }
      ];

      const locations = [
        { ip: '192.168.1.100', city: 'Paris', country: 'France' },
        { ip: '10.0.0.50', city: 'Lyon', country: 'France' },
        { ip: '172.16.0.25', city: 'Marseille', country: 'France' },
        { ip: '192.168.1.200', city: 'Toulouse', country: 'France' },
        { ip: '10.1.1.75', city: 'Nice', country: 'France' }
      ];

      return Array.from({ length: 8 }, (_, i) => {
        const user = users[i % users.length];
        const device = devices[i % devices.length];
        const location = locations[i % locations.length];
        const startTime = new Date(Date.now() - Math.floor(Math.random() * 4 * 60 * 60 * 1000));
        const lastActivity = new Date(Date.now() - Math.floor(Math.random() * 30 * 60 * 1000));
        
        return {
          id: `session-${i}`,
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          userRole: user.role,
          device,
          location,
          startTime,
          lastActivity,
          isOnline: Math.random() > 0.2,
          sessionDuration: Math.floor((Date.now() - startTime.getTime()) / (1000 * 60)),
          pagesVisited: Math.floor(Math.random() * 20) + 5,
          actionsPerformed: Math.floor(Math.random() * 50) + 10
        };
      });
    };

    const sessions = generateMockSessions();
    setActiveSessions(sessions);

    // Calculer les métriques
    const activeSessions = sessions.filter(s => s.isOnline);
    const totalDuration = sessions.reduce((sum, s) => sum + s.sessionDuration, 0);
    
    setMetrics({
      totalActiveSessions: activeSessions.length,
      averageSessionDuration: Math.floor(totalDuration / sessions.length),
      peakConcurrentUsers: Math.max(12, activeSessions.length + Math.floor(Math.random() * 5)),
      totalUniqueUsers: new Set(sessions.map(s => s.userId)).size,
      securityAlerts: Math.floor(Math.random() * 3)
    });
  }, [selectedTimeRange]);

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile': return Smartphone;
      case 'tablet': return Tablet;
      default: return Monitor;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'manager': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-green-500/10 text-green-500 border-green-500/20';
    }
  };

  const terminateSession = (sessionId: string) => {
    setActiveSessions(prev => prev.filter(s => s.id !== sessionId));
  };

  const getActivityStatus = (lastActivity: Date) => {
    const minutesAgo = Math.floor((Date.now() - lastActivity.getTime()) / (1000 * 60));
    if (minutesAgo < 5) return { status: 'active', label: 'Actif', color: 'text-green-500' };
    if (minutesAgo < 15) return { status: 'idle', label: 'Inactif', color: 'text-yellow-500' };
    return { status: 'away', label: 'Absent', color: 'text-red-500' };
  };

  return (
    <div className="space-y-6">
      {/* Métriques système */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Sessions actives</p>
                  <p className="text-2xl font-bold">{metrics.totalActiveSessions}</p>
                </div>
                <div className="p-2 rounded-lg bg-green-500/10">
                  <Activity className="h-4 w-4 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Durée moyenne</p>
                  <p className="text-2xl font-bold">{metrics.averageSessionDuration}min</p>
                </div>
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Clock className="h-4 w-4 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pic concurrent</p>
                  <p className="text-2xl font-bold">{metrics.peakConcurrentUsers}</p>
                </div>
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Users className="h-4 w-4 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Utilisateurs uniques</p>
                  <p className="text-2xl font-bold">{metrics.totalUniqueUsers}</p>
                </div>
                <div className="p-2 rounded-lg bg-orange-500/10">
                  <Users className="h-4 w-4 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Alertes sécurité</p>
                  <p className="text-2xl font-bold">{metrics.securityAlerts}</p>
                </div>
                <div className="p-2 rounded-lg bg-red-500/10">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sessions actives */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Sessions actives
              </CardTitle>
              <CardDescription>
                Surveillez les sessions utilisateur en temps réel
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={selectedTimeRange === '1h' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTimeRange('1h')}
              >
                1h
              </Button>
              <Button
                variant={selectedTimeRange === '24h' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTimeRange('24h')}
              >
                24h
              </Button>
              <Button
                variant={selectedTimeRange === '7d' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTimeRange('7d')}
              >
                7j
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <div className="space-y-4">
              {activeSessions.map((session) => {
                const DeviceIcon = getDeviceIcon(session.device.type);
                const activity = getActivityStatus(session.lastActivity);
                const ConnectionIcon = session.isOnline ? Wifi : WifiOff;
                
                return (
                  <Card key={session.id} className="hover:bg-muted/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="p-2 rounded-lg bg-muted">
                              <DeviceIcon className="h-4 w-4" />
                            </div>
                            <div className="absolute -bottom-1 -right-1">
                              <ConnectionIcon className={`h-3 w-3 ${session.isOnline ? 'text-green-500' : 'text-red-500'}`} />
                            </div>
                          </div>
                          
                          <div className="min-w-0">
                            <h4 className="font-medium truncate">{session.userName}</h4>
                            <p className="text-sm text-muted-foreground truncate">{session.userEmail}</p>
                          </div>
                        </div>

                        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Appareil</p>
                            <p className="font-medium">{session.device.browser}</p>
                            <p className="text-xs text-muted-foreground">{session.device.os}</p>
                          </div>
                          
                          <div>
                            <p className="text-muted-foreground">Localisation</p>
                            <p className="font-medium">{session.location.city}</p>
                            <p className="text-xs text-muted-foreground">{session.location.ip}</p>
                          </div>
                          
                          <div>
                            <p className="text-muted-foreground">Activité</p>
                            <p className={`font-medium ${activity.color}`}>{activity.label}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(session.lastActivity, 'HH:mm', { locale: fr })}
                            </p>
                          </div>
                          
                          <div>
                            <p className="text-muted-foreground">Durée</p>
                            <p className="font-medium">{session.sessionDuration}min</p>
                            <p className="text-xs text-muted-foreground">
                              {session.pagesVisited} pages
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge className={getRoleColor(session.userRole)}>
                            {session.userRole}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => terminateSession(session.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <LogOut className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Barre de progression d'activité */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                          <span>Activité de session</span>
                          <span>{session.actionsPerformed} actions</span>
                        </div>
                        <Progress 
                          value={Math.min((session.actionsPerformed / 100) * 100, 100)} 
                          className="h-2"
                        />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionMonitor;
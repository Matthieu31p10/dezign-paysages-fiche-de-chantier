import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WorkLog, ProjectInfo, Team } from '@/types/models';
import { 
  Bell, 
  AlertTriangle, 
  Clock, 
  Euro, 
  TrendingUp, 
  Calendar, 
  Settings, 
  CheckCircle,
  XCircle,
  Users,
  Target,
  FileText
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

interface WorkLogNotificationsProps {
  workLogs: WorkLog[];
  projects: ProjectInfo[];
  teams: Team[];
}

interface NotificationSettings {
  overdueInvoices: boolean;
  budgetExceeded: boolean;
  visitReminders: boolean;
  projectDeadlines: boolean;
  teamPerformance: boolean;
  financialAlerts: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  reminderTime: string;
}

interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  category: 'financial' | 'project' | 'team' | 'schedule';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionRequired: boolean;
  createdAt: Date;
  projectId?: string;
  amount?: number;
}

export const WorkLogNotifications: React.FC<WorkLogNotificationsProps> = ({
  workLogs,
  projects,
  teams
}) => {
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    overdueInvoices: true,
    budgetExceeded: true,
    visitReminders: true,
    projectDeadlines: true,
    teamPerformance: false,
    financialAlerts: true,
    emailNotifications: true,
    pushNotifications: false,
    reminderTime: '08:00'
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showRead, setShowRead] = useState(false);
  const [readAlerts, setReadAlerts] = useState<Set<string>>(new Set());

  // Generate alerts based on worklog data
  const alerts = useMemo(() => {
    const generatedAlerts: Alert[] = [];
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Financial alerts
    if (notificationSettings.financialAlerts) {
      // Overdue invoices
      const overdueRevenue = workLogs
        .filter(log => !log.invoiced && new Date(log.date) < oneMonthAgo)
        .reduce((sum, log) => {
          const hourlyRate = log.hourlyRate || 45;
          const personnel = log.personnel?.length || 1;
          const hours = log.timeTracking?.totalHours || 0;
          return sum + (hourlyRate * hours * personnel);
        }, 0);

      if (overdueRevenue > 0 && notificationSettings.overdueInvoices) {
        generatedAlerts.push({
          id: 'overdue-invoices',
          type: 'error',
          category: 'financial',
          title: 'Factures en retard',
          description: `${formatCurrency(overdueRevenue)} de revenus non facturés depuis plus d'un mois`,
          priority: 'high',
          actionRequired: true,
          createdAt: now,
          amount: overdueRevenue
        });
      }

      // Recent unbilled work
      const recentUnbilled = workLogs
        .filter(log => !log.invoiced && new Date(log.date) > oneWeekAgo)
        .reduce((sum, log) => {
          const hourlyRate = log.hourlyRate || 45;
          const personnel = log.personnel?.length || 1;
          const hours = log.timeTracking?.totalHours || 0;
          return sum + (hourlyRate * hours * personnel);
        }, 0);

      if (recentUnbilled > 1000) {
        generatedAlerts.push({
          id: 'recent-unbilled',
          type: 'warning',
          category: 'financial',
          title: 'Travaux récents non facturés',
          description: `${formatCurrency(recentUnbilled)} de travaux récents en attente de facturation`,
          priority: 'medium',
          actionRequired: false,
          createdAt: now,
          amount: recentUnbilled
        });
      }
    }

    // Project alerts
    if (notificationSettings.budgetExceeded) {
      projects.forEach(project => {
        const projectLogs = workLogs.filter(log => log.projectId === project.id);
        const totalHours = projectLogs.reduce((sum, log) => {
          const personnel = log.personnel?.length || 1;
          const hours = log.timeTracking?.totalHours || 0;
          return sum + (hours * personnel);
        }, 0);

        if (project.annualTotalHours && totalHours > project.annualTotalHours * 0.9) {
          const percentage = (totalHours / project.annualTotalHours) * 100;
          generatedAlerts.push({
            id: `budget-${project.id}`,
            type: totalHours > project.annualTotalHours ? 'error' : 'warning',
            category: 'project',
            title: `Budget heures ${totalHours > project.annualTotalHours ? 'dépassé' : 'bientôt atteint'}`,
            description: `Projet "${project.name}" : ${totalHours.toFixed(1)}h / ${project.annualTotalHours}h (${percentage.toFixed(1)}%)`,
            priority: totalHours > project.annualTotalHours ? 'high' : 'medium',
            actionRequired: totalHours > project.annualTotalHours,
            createdAt: now,
            projectId: project.id
          });
        }
      });
    }

    // Team performance alerts
    if (notificationSettings.teamPerformance) {
      const teamStats = teams.map(team => {
        const teamLogs = workLogs.filter(log => 
          log.personnel?.some(member => member.includes(team.name)) &&
          new Date(log.date) > oneMonthAgo
        );

        const totalHours = teamLogs.reduce((sum, log) => {
          const hours = log.timeTracking?.totalHours || 0;
          return sum + hours;
        }, 0);

        const invoicedHours = teamLogs
          .filter(log => log.invoiced)
          .reduce((sum, log) => {
            const hours = log.timeTracking?.totalHours || 0;
            return sum + hours;
          }, 0);

        const invoicingRate = totalHours > 0 ? (invoicedHours / totalHours) * 100 : 0;

        return { team, totalHours, invoicingRate };
      });

      teamStats.forEach(({ team, totalHours, invoicingRate }) => {
        if (invoicingRate < 70 && totalHours > 10) {
          generatedAlerts.push({
            id: `team-performance-${team.id}`,
            type: 'warning',
            category: 'team',
            title: 'Performance équipe à surveiller',
            description: `Équipe "${team.name}" : taux de facturation de ${invoicingRate.toFixed(1)}% ce mois`,
            priority: 'medium',
            actionRequired: false,
            createdAt: now
          });
        }
      });
    }

    // Schedule alerts
    if (notificationSettings.visitReminders) {
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const upcomingVisits = workLogs.filter(log => {
        const logDate = new Date(log.date);
        return logDate.toDateString() === tomorrow.toDateString();
      });

      if (upcomingVisits.length > 0) {
        generatedAlerts.push({
          id: 'upcoming-visits',
          type: 'info',
          category: 'schedule',
          title: 'Visites prévues demain',
          description: `${upcomingVisits.length} visite(s) prévue(s) pour demain`,
          priority: 'low',
          actionRequired: false,
          createdAt: now
        });
      }
    }

    return generatedAlerts.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }, [workLogs, projects, teams, notificationSettings]);

  const filteredAlerts = useMemo(() => {
    let filtered = alerts;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(alert => alert.category === selectedCategory);
    }

    if (!showRead) {
      filtered = filtered.filter(alert => !readAlerts.has(alert.id));
    }

    return filtered;
  }, [alerts, selectedCategory, showRead, readAlerts]);

  const markAsRead = (alertId: string) => {
    setReadAlerts(prev => new Set([...prev, alertId]));
  };

  const markAllAsRead = () => {
    setReadAlerts(new Set(alerts.map(alert => alert.id)));
    toast.success('Toutes les notifications marquées comme lues');
  };

  const updateSetting = (key: keyof NotificationSettings, value: boolean | string) => {
    setNotificationSettings(prev => ({ ...prev, [key]: value }));
    toast.success('Paramètres de notification mis à jour');
  };

  const testNotification = () => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('Test Lovable WorkLogs', {
          body: 'Les notifications fonctionnent correctement !',
          icon: '/favicon.ico'
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('Test Lovable WorkLogs', {
              body: 'Les notifications sont maintenant activées !',
              icon: '/favicon.ico'
            });
          }
        });
      }
    }
    toast.success('Notification de test envoyée');
  };

  const alertsByCategory = {
    all: alerts.length,
    financial: alerts.filter(a => a.category === 'financial').length,
    project: alerts.filter(a => a.category === 'project').length,
    team: alerts.filter(a => a.category === 'team').length,
    schedule: alerts.filter(a => a.category === 'schedule').length
  };

  const getAlertIcon = (alert: Alert) => {
    switch (alert.category) {
      case 'financial': return Euro;
      case 'project': return Target;
      case 'team': return Users;
      case 'schedule': return Calendar;
      default: return Bell;
    }
  };

  const getAlertColor = (alert: Alert) => {
    switch (alert.type) {
      case 'error': return 'destructive';
      case 'warning': return 'secondary';
      case 'success': return 'default';
      case 'info': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Notifications & Alertes</h2>
          <p className="text-muted-foreground">
            Suivi automatisé et alertes intelligentes
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={testNotification} variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Test notification
          </Button>
          <Button onClick={markAllAsRead} variant="outline" size="sm">
            <CheckCircle className="h-4 w-4 mr-2" />
            Tout marquer lu
          </Button>
        </div>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">Total</span>
            </div>
            <div className="text-2xl font-bold mt-2">{alertsByCategory.all}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Euro className="h-5 w-5 text-red-500" />
              <span className="text-sm font-medium">Financier</span>
            </div>
            <div className="text-2xl font-bold mt-2">{alertsByCategory.financial}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-orange-500" />
              <span className="text-sm font-medium">Projets</span>
            </div>
            <div className="text-2xl font-bold mt-2">{alertsByCategory.project}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium">Équipes</span>
            </div>
            <div className="text-2xl font-bold mt-2">{alertsByCategory.team}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium">Planning</span>
            </div>
            <div className="text-2xl font-bold mt-2">{alertsByCategory.schedule}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="alerts">Alertes actives</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-4 items-center">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  <SelectItem value="financial">Financier</SelectItem>
                  <SelectItem value="project">Projets</SelectItem>
                  <SelectItem value="team">Équipes</SelectItem>
                  <SelectItem value="schedule">Planning</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-2">
                <Switch
                  id="show-read"
                  checked={showRead}
                  onCheckedChange={setShowRead}
                />
                <label htmlFor="show-read" className="text-sm">Afficher les lues</label>
              </div>
            </div>

            <Badge variant="outline">
              {filteredAlerts.length} alerte(s)
            </Badge>
          </div>

          {/* Alerts List */}
          <div className="space-y-3">
            {filteredAlerts.map((alert) => {
              const IconComponent = getAlertIcon(alert);
              const isRead = readAlerts.has(alert.id);

              return (
                <Card 
                  key={alert.id} 
                  className={`cursor-pointer hover:shadow-md transition-shadow ${isRead ? 'opacity-60' : ''}`}
                  onClick={() => markAsRead(alert.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-full ${{
                        error: 'bg-red-100 text-red-600',
                        warning: 'bg-orange-100 text-orange-600',
                        info: 'bg-blue-100 text-blue-600',
                        success: 'bg-green-100 text-green-600'
                      }[alert.type]}`}>
                        <IconComponent className="h-5 w-5" />
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className={`font-medium ${isRead ? 'text-muted-foreground' : ''}`}>
                              {alert.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {alert.description}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant={getAlertColor(alert) as any}>
                              {alert.priority}
                            </Badge>
                            {alert.actionRequired && (
                              <Badge variant="destructive">
                                Action requise
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{alert.createdAt.toLocaleDateString('fr-FR')}</span>
                          {alert.amount && (
                            <span className="font-medium">{formatCurrency(alert.amount)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {filteredAlerts.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Aucune alerte</h3>
                  <p className="text-muted-foreground">
                    {alerts.length === 0 
                      ? 'Tout va bien ! Aucune alerte détectée.'
                      : 'Toutes les alertes ont été lues.'}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Types d'alertes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium">Factures en retard</label>
                    <p className="text-sm text-muted-foreground">Alertes pour les revenus non facturés</p>
                  </div>
                  <Switch
                    checked={notificationSettings.overdueInvoices}
                    onCheckedChange={(checked) => updateSetting('overdueInvoices', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium">Budget dépassé</label>
                    <p className="text-sm text-muted-foreground">Alertes sur les budgets de projets</p>
                  </div>
                  <Switch
                    checked={notificationSettings.budgetExceeded}
                    onCheckedChange={(checked) => updateSetting('budgetExceeded', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium">Rappels de visites</label>
                    <p className="text-sm text-muted-foreground">Notifications pour les visites prévues</p>
                  </div>
                  <Switch
                    checked={notificationSettings.visitReminders}
                    onCheckedChange={(checked) => updateSetting('visitReminders', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium">Performance équipe</label>
                    <p className="text-sm text-muted-foreground">Alertes sur les performances des équipes</p>
                  </div>
                  <Switch
                    checked={notificationSettings.teamPerformance}
                    onCheckedChange={(checked) => updateSetting('teamPerformance', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium">Alertes financières</label>
                    <p className="text-sm text-muted-foreground">Toutes les alertes financières</p>
                  </div>
                  <Switch
                    checked={notificationSettings.financialAlerts}
                    onCheckedChange={(checked) => updateSetting('financialAlerts', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Méthodes de notification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium">Notifications email</label>
                    <p className="text-sm text-muted-foreground">Recevoir les alertes par email</p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium">Notifications push</label>
                    <p className="text-sm text-muted-foreground">Notifications dans le navigateur</p>
                  </div>
                  <Switch
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) => updateSetting('pushNotifications', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-medium">Heure des rappels</label>
                  <Select 
                    value={notificationSettings.reminderTime}
                    onValueChange={(value) => updateSetting('reminderTime', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="07:00">07:00</SelectItem>
                      <SelectItem value="08:00">08:00</SelectItem>
                      <SelectItem value="09:00">09:00</SelectItem>
                      <SelectItem value="10:00">10:00</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={testNotification}
                  variant="outline" 
                  className="w-full"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Tester les notifications
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique des notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Historique à venir</h3>
                <p className="text-muted-foreground">
                  L'historique des notifications sera disponible dans une prochaine version.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
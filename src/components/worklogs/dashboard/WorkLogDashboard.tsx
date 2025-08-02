import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  FileText, 
  Euro, 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  Calendar,
  Target,
  CheckCircle,
  Clipboard,
  FileCheck
} from 'lucide-react';
import { WorkLog } from '@/types/models';
import { formatCurrency } from '@/utils/format-utils';
import { differenceInDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subWeeks, subMonths } from 'date-fns';

interface WorkLogDashboardProps {
  workLogs: WorkLog[];
  teams: Array<{ id: string; name: string; color: string }>;
}

export const WorkLogDashboard: React.FC<WorkLogDashboardProps> = ({
  workLogs,
  teams
}) => {
  const stats = useMemo(() => {
    const now = new Date();
    const thisWeekStart = startOfWeek(now, { weekStartsOn: 1 });
    const thisWeekEnd = endOfWeek(now, { weekStartsOn: 1 });
    const lastWeekStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
    const lastWeekEnd = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    // Séparer les fiches de suivi des fiches vierges
    const isBlankWorksheet = (log: WorkLog) => 
      log.projectId && (log.projectId.startsWith('blank-') || log.projectId.startsWith('DZFV'));
    
    const workLogsSuivi = workLogs.filter(log => !isBlankWorksheet(log));
    const workLogsVierges = workLogs.filter(log => isBlankWorksheet(log));

    // Calculs pour les fiches de suivi
    const calculateStats = (logs: WorkLog[]) => {
      const totalHours = logs.reduce((sum, log) => {
        const hours = log.timeTracking?.totalHours || log.duration || 0;
        const personnel = log.personnel?.length || 1;
        return sum + (hours * personnel);
      }, 0);

      const totalCost = logs.reduce((sum, log) => {
        const hours = log.timeTracking?.totalHours || log.duration || 0;
        const personnel = log.personnel?.length || 1;
        const rate = log.hourlyRate || 45;
        return sum + (hours * personnel * rate);
      }, 0);

      const invoicedLogs = logs.filter(log => log.invoiced);
      const invoicedAmount = invoicedLogs.reduce((sum, log) => {
        const hours = log.timeTracking?.totalHours || log.duration || 0;
        const personnel = log.personnel?.length || 1;
        const rate = log.hourlyRate || 45;
        return sum + (hours * personnel * rate);
      }, 0);

      const invoicingRate = logs.length > 0 ? (invoicedLogs.length / logs.length) * 100 : 0;

      return {
        count: logs.length,
        totalHours,
        totalCost,
        invoicedAmount,
        pendingAmount: totalCost - invoicedAmount,
        invoicingRate
      };
    };

    // Statistiques séparées
    const suiviStats = calculateStats(workLogsSuivi);
    const viergeStats = calculateStats(workLogsVierges);
    const globalStats = calculateStats(workLogs);

    // Fiches de cette semaine - toutes
    const thisWeekLogs = workLogs.filter(log => {
      const logDate = new Date(log.date);
      return logDate >= thisWeekStart && logDate <= thisWeekEnd;
    });

    const lastWeekLogs = workLogs.filter(log => {
      const logDate = new Date(log.date);
      return logDate >= lastWeekStart && logDate <= lastWeekEnd;
    });

    // Fiches de cette semaine séparées
    const thisWeekLogsSuivi = workLogsSuivi.filter(log => {
      const logDate = new Date(log.date);
      return logDate >= thisWeekStart && logDate <= thisWeekEnd;
    });

    const thisWeekLogsVierges = workLogsVierges.filter(log => {
      const logDate = new Date(log.date);
      return logDate >= thisWeekStart && logDate <= thisWeekEnd;
    });

    // Fiches de ce mois
    const thisMonthLogs = workLogs.filter(log => {
      const logDate = new Date(log.date);
      return logDate >= thisMonthStart && logDate <= thisMonthEnd;
    });

    const lastMonthLogs = workLogs.filter(log => {
      const logDate = new Date(log.date);
      return logDate >= lastMonthStart && logDate <= lastMonthEnd;
    });

    // Fiches en retard (non facturées depuis plus de 30 jours)
    const overdueInvoices = workLogs.filter(log => {
      if (log.invoiced) return false;
      const daysSince = differenceInDays(now, new Date(log.date));
      return daysSince > 30;
    });

    // Heures cette semaine vs semaine précédente
    const thisWeekHours = thisWeekLogs.reduce((sum, log) => {
      const hours = log.timeTracking?.totalHours || log.duration || 0;
      const personnel = log.personnel?.length || 1;
      return sum + (hours * personnel);
    }, 0);

    const lastWeekHours = lastWeekLogs.reduce((sum, log) => {
      const hours = log.timeTracking?.totalHours || log.duration || 0;
      const personnel = log.personnel?.length || 1;
      return sum + (hours * personnel);
    }, 0);

    const weeklyGrowth = lastWeekHours > 0 ? ((thisWeekHours - lastWeekHours) / lastWeekHours) * 100 : 0;

    // Statistiques par équipe
    const teamStats = teams.map(team => {
      const teamLogs = workLogs.filter(log => log.personnel?.[0] === team.name);
      const teamHours = teamLogs.reduce((sum, log) => {
        const hours = log.timeTracking?.totalHours || log.duration || 0;
        const personnel = log.personnel?.length || 1;
        return sum + (hours * personnel);
      }, 0);
      const teamCost = teamLogs.reduce((sum, log) => {
        const hours = log.timeTracking?.totalHours || log.duration || 0;
        const personnel = log.personnel?.length || 1;
        const rate = log.hourlyRate || 45;
        return sum + (hours * personnel * rate);
      }, 0);

      return {
        id: team.id,
        name: team.name,
        color: team.color,
        logsCount: teamLogs.length,
        hours: teamHours,
        cost: teamCost,
        invoicingRate: teamLogs.length > 0 ? (teamLogs.filter(l => l.invoiced).length / teamLogs.length) * 100 : 0
      };
    }).sort((a, b) => b.hours - a.hours);

    return {
      // Statistiques globales
      totalLogs: globalStats.count,
      totalHours: globalStats.totalHours,
      totalCost: globalStats.totalCost,
      invoicingRate: globalStats.invoicingRate,
      invoicedAmount: globalStats.invoicedAmount,
      pendingAmount: globalStats.pendingAmount,
      
      // Statistiques séparées
      suiviStats,
      viergeStats,
      
      // Données temporelles
      overdueInvoices: overdueInvoices.length,
      thisWeekLogs: thisWeekLogs.length,
      thisWeekLogsSuivi: thisWeekLogsSuivi.length,
      thisWeekLogsVierges: thisWeekLogsVierges.length,
      lastWeekLogs: lastWeekLogs.length,
      thisWeekHours,
      lastWeekHours,
      weeklyGrowth,
      thisMonthLogs: thisMonthLogs.length,
      lastMonthLogs: lastMonthLogs.length,
      teamStats
    };
  }, [workLogs, teams]);

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return '↗️';
    if (growth < 0) return '↘️';
    return '➡️';
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="global" className="space-y-4">
        <TabsList>
          <TabsTrigger value="global">Vue globale</TabsTrigger>
          <TabsTrigger value="suivi">Fiches de suivi</TabsTrigger>
          <TabsTrigger value="vierges">Fiches vierges</TabsTrigger>
        </TabsList>

        <TabsContent value="global" className="space-y-6">
          {/* KPIs principaux - Vue globale */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Fiches</p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.totalLogs}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      {stats.thisWeekLogs} cette semaine
                    </p>
                  </div>
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700 dark:text-green-300">Heures Totales</p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.totalHours.toFixed(1)}h</p>
                    <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                      <span className={getGrowthColor(stats.weeklyGrowth)}>
                        {getGrowthIcon(stats.weeklyGrowth)} {Math.abs(stats.weeklyGrowth).toFixed(1)}%
                      </span>
                      vs sem. précédente
                    </p>
                  </div>
                  <div className="p-2 bg-green-500 rounded-lg">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Chiffre d'Affaires</p>
                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                      {formatCurrency(stats.totalCost)}
                    </p>
                    <p className="text-xs text-purple-600 dark:text-purple-400">
                      {formatCurrency(stats.pendingAmount)} en attente
                    </p>
                  </div>
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <Euro className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Taux Facturation</p>
                    <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                      {stats.invoicingRate.toFixed(1)}%
                    </p>
                    <Progress 
                      value={stats.invoicingRate} 
                      className="h-2 mt-1"
                    />
                  </div>
                  <div className="p-2 bg-orange-500 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Comparaison Fiches de Suivi vs Fiches Vierges */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-blue-500" />
                  Fiches de Suivi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <p className="text-lg font-bold text-blue-900 dark:text-blue-100">{stats.suiviStats.count}</p>
                    <p className="text-xs text-blue-700 dark:text-blue-300">Fiches</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <p className="text-lg font-bold text-blue-900 dark:text-blue-100">{stats.suiviStats.totalHours.toFixed(1)}h</p>
                    <p className="text-xs text-blue-700 dark:text-blue-300">Heures</p>
                  </div>
                </div>
                <div className="text-center p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <p className="text-xl font-bold text-blue-900 dark:text-blue-100">{formatCurrency(stats.suiviStats.totalCost)}</p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">Chiffre d'affaires</p>
                </div>
                <div className="text-center">
                  <Badge variant="outline" className="text-blue-700 border-blue-300">
                    {stats.suiviStats.invoicingRate.toFixed(1)}% facturé
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clipboard className="h-5 w-5 text-teal-500" />
                  Fiches Vierges
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-teal-50 dark:bg-teal-950 rounded-lg">
                    <p className="text-lg font-bold text-teal-900 dark:text-teal-100">{stats.viergeStats.count}</p>
                    <p className="text-xs text-teal-700 dark:text-teal-300">Fiches</p>
                  </div>
                  <div className="text-center p-3 bg-teal-50 dark:bg-teal-950 rounded-lg">
                    <p className="text-lg font-bold text-teal-900 dark:text-teal-100">{stats.viergeStats.totalHours.toFixed(1)}h</p>
                    <p className="text-xs text-teal-700 dark:text-teal-300">Heures</p>
                  </div>
                </div>
                <div className="text-center p-3 bg-teal-100 dark:bg-teal-900 rounded-lg">
                  <p className="text-xl font-bold text-teal-900 dark:text-teal-100">{formatCurrency(stats.viergeStats.totalCost)}</p>
                  <p className="text-xs text-teal-700 dark:text-teal-300">Chiffre d'affaires</p>
                </div>
                <div className="text-center">
                  <Badge variant="outline" className="text-teal-700 border-teal-300">
                    {stats.viergeStats.invoicingRate.toFixed(1)}% facturé
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alertes et statistiques hebdomadaires */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Alertes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {stats.overdueInvoices > 0 ? (
                  <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                    <div>
                      <p className="font-medium text-red-900 dark:text-red-100">
                        Factures en retard
                      </p>
                      <p className="text-sm text-red-700 dark:text-red-300">
                        {stats.overdueInvoices} fiche{stats.overdueInvoices > 1 ? 's' : ''} non facturée{stats.overdueInvoices > 1 ? 's' : ''} depuis plus de 30 jours
                      </p>
                    </div>
                    <Badge variant="destructive">{stats.overdueInvoices}</Badge>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                    <div>
                      <p className="font-medium text-green-900 dark:text-green-100">
                        Facturation à jour
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Aucune facture en retard
                      </p>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2 bg-muted/50 rounded-lg">
                    <p className="text-sm font-bold">{stats.thisWeekLogsSuivi}</p>
                    <p className="text-xs text-muted-foreground">Suivi</p>
                  </div>
                  <div className="text-center p-2 bg-muted/50 rounded-lg">
                    <p className="text-sm font-bold">{stats.thisWeekLogsVierges}</p>
                    <p className="text-xs text-muted-foreground">Vierges</p>
                  </div>
                  <div className="text-center p-2 bg-muted/50 rounded-lg">
                    <p className="text-sm font-bold">{stats.thisMonthLogs}</p>
                    <p className="text-xs text-muted-foreground">Ce mois</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance par équipe */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Performance par Équipe
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.teamStats.slice(0, 4).map((team) => (
                    <div key={team.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: team.color }}
                        />
                        <div>
                          <p className="font-medium text-sm">{team.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {team.logsCount} fiches • {team.hours.toFixed(1)}h
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{formatCurrency(team.cost)}</p>
                        <p className="text-xs text-muted-foreground">
                          {team.invoicingRate.toFixed(0)}% facturé
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="suivi" className="space-y-6">
          {/* KPIs pour fiches de suivi uniquement */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Fiches de Suivi</p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.suiviStats.count}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      {stats.thisWeekLogsSuivi} cette semaine
                    </p>
                  </div>
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <FileCheck className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700 dark:text-green-300">Heures Suivi</p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.suiviStats.totalHours.toFixed(1)}h</p>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      Projets contractuels
                    </p>
                  </div>
                  <div className="p-2 bg-green-500 rounded-lg">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-700 dark:text-purple-300">CA Suivi</p>
                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                      {formatCurrency(stats.suiviStats.totalCost)}
                    </p>
                    <p className="text-xs text-purple-600 dark:text-purple-400">
                      {formatCurrency(stats.suiviStats.pendingAmount)} en attente
                    </p>
                  </div>
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <Euro className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Taux Facturation</p>
                    <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                      {stats.suiviStats.invoicingRate.toFixed(1)}%
                    </p>
                    <Progress 
                      value={stats.suiviStats.invoicingRate} 
                      className="h-2 mt-1"
                    />
                  </div>
                  <div className="p-2 bg-orange-500 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vierges" className="space-y-6">
          {/* KPIs pour fiches vierges uniquement */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950 dark:to-teal-900 border-teal-200 dark:border-teal-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-teal-700 dark:text-teal-300">Fiches Vierges</p>
                    <p className="text-2xl font-bold text-teal-900 dark:text-teal-100">{stats.viergeStats.count}</p>
                    <p className="text-xs text-teal-600 dark:text-teal-400">
                      {stats.thisWeekLogsVierges} cette semaine
                    </p>
                  </div>
                  <div className="p-2 bg-teal-500 rounded-lg">
                    <Clipboard className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950 dark:to-cyan-900 border-cyan-200 dark:border-cyan-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-cyan-700 dark:text-cyan-300">Heures Vierges</p>
                    <p className="text-2xl font-bold text-cyan-900 dark:text-cyan-100">{stats.viergeStats.totalHours.toFixed(1)}h</p>
                    <p className="text-xs text-cyan-600 dark:text-cyan-400">
                      Interventions ponctuelles
                    </p>
                  </div>
                  <div className="p-2 bg-cyan-500 rounded-lg">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 border-indigo-200 dark:border-indigo-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300">CA Vierges</p>
                    <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                      {formatCurrency(stats.viergeStats.totalCost)}
                    </p>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400">
                      {formatCurrency(stats.viergeStats.pendingAmount)} en attente
                    </p>
                  </div>
                  <div className="p-2 bg-indigo-500 rounded-lg">
                    <Euro className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950 dark:to-pink-900 border-pink-200 dark:border-pink-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-pink-700 dark:text-pink-300">Taux Facturation</p>
                    <p className="text-2xl font-bold text-pink-900 dark:text-pink-100">
                      {stats.viergeStats.invoicingRate.toFixed(1)}%
                    </p>
                    <Progress 
                      value={stats.viergeStats.invoicingRate} 
                      className="h-2 mt-1"
                    />
                  </div>
                  <div className="p-2 bg-pink-500 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Résumé rapide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-indigo-500" />
            Résumé de Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-1">
                {stats.thisWeekHours.toFixed(1)}h
              </div>
              <p className="text-sm text-muted-foreground">Heures cette semaine</p>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.lastWeekHours.toFixed(1)}h la semaine dernière
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {formatCurrency(stats.invoicedAmount)}
              </div>
              <p className="text-sm text-muted-foreground">Montant facturé</p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(stats.pendingAmount)} en attente
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {(stats.totalHours / stats.totalLogs || 0).toFixed(1)}h
              </div>
              <p className="text-sm text-muted-foreground">Moyenne par fiche</p>
              <p className="text-xs text-muted-foreground mt-1">
                Temps moyen d'intervention
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  FileText, 
  Euro, 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  Calendar,
  Target,
  CheckCircle
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

    // Fiches de cette semaine et semaine précédente
    const thisWeekLogs = workLogs.filter(log => {
      const logDate = new Date(log.date);
      return logDate >= thisWeekStart && logDate <= thisWeekEnd;
    });

    const lastWeekLogs = workLogs.filter(log => {
      const logDate = new Date(log.date);
      return logDate >= lastWeekStart && logDate <= lastWeekEnd;
    });

    // Fiches de ce mois et mois précédent
    const thisMonthLogs = workLogs.filter(log => {
      const logDate = new Date(log.date);
      return logDate >= thisMonthStart && logDate <= thisMonthEnd;
    });

    const lastMonthLogs = workLogs.filter(log => {
      const logDate = new Date(log.date);
      return logDate >= lastMonthStart && logDate <= lastMonthEnd;
    });

    // Calculs généraux
    const totalHours = workLogs.reduce((sum, log) => {
      const hours = log.timeTracking?.totalHours || log.duration || 0;
      const personnel = log.personnel?.length || 1;
      return sum + (hours * personnel);
    }, 0);

    const totalCost = workLogs.reduce((sum, log) => {
      const hours = log.timeTracking?.totalHours || log.duration || 0;
      const personnel = log.personnel?.length || 1;
      const rate = log.hourlyRate || 0;
      return sum + (hours * personnel * rate);
    }, 0);

    const invoicedLogs = workLogs.filter(log => log.invoiced);
    const invoicedAmount = invoicedLogs.reduce((sum, log) => {
      const hours = log.timeTracking?.totalHours || log.duration || 0;
      const personnel = log.personnel?.length || 1;
      const rate = log.hourlyRate || 0;
      return sum + (hours * personnel * rate);
    }, 0);

    const invoicingRate = workLogs.length > 0 ? (invoicedLogs.length / workLogs.length) * 100 : 0;

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
        const rate = log.hourlyRate || 0;
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
      totalLogs: workLogs.length,
      totalHours,
      totalCost,
      invoicingRate,
      invoicedAmount,
      pendingAmount: totalCost - invoicedAmount,
      overdueInvoices: overdueInvoices.length,
      thisWeekLogs: thisWeekLogs.length,
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
      {/* KPIs principaux */}
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

      {/* Alertes et indicateurs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Alertes */}
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

            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-lg font-bold">{stats.thisWeekLogs}</p>
                <p className="text-xs text-muted-foreground">Cette semaine</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-lg font-bold">{stats.thisMonthLogs}</p>
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
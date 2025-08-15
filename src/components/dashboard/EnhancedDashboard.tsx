import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  DollarSign
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { calculateTotalHoursForYear, calculateProjectCompletion } from '@/utils/stats-utils';
import { getCurrentYear } from '@/utils/date-utils';
import { formatNumber } from '@/utils/helpers';
import OverviewCharts from './OverviewCharts';
import ActivityFeed from './ActivityFeed';
import QuickActions from './QuickActions';

const EnhancedDashboard = () => {
  const { projectInfos, workLogs, teams } = useApp();
  const currentYear = getCurrentYear();

  const dashboardData = useMemo(() => {
    const validProjects = Array.isArray(projectInfos) ? projectInfos : [];
    const validWorkLogs = Array.isArray(workLogs) ? workLogs : [];
    const validTeams = Array.isArray(teams) ? teams : [];

    const activeProjects = validProjects.filter(p => !p.isArchived);
    const totalHours = calculateTotalHoursForYear(validWorkLogs, currentYear);
    
    // Calculs avancés
    const totalTargetHours = activeProjects.reduce((sum, p) => sum + (p.annualTotalHours || 0), 0);
    const averageCompletion = activeProjects.length > 0 
      ? activeProjects.reduce((sum, project) => 
          sum + calculateProjectCompletion(project, validWorkLogs, currentYear), 0) / activeProjects.length
      : 0;

    // Projets urgents (< 50% de completion)
    const urgentProjects = activeProjects.filter(project => 
      calculateProjectCompletion(project, validWorkLogs, currentYear) < 50
    );

    // Coût total estimé
    const totalEstimatedCost = validWorkLogs.reduce((sum, log) => {
      const hours = log.timeTracking?.totalHours || 0;
      const rate = log.hourlyRate || 45;
      const personnel = log.personnel?.length || 1;
      return sum + (hours * personnel * rate);
    }, 0);

    // Équipes actives aujourd'hui
    const today = new Date().toISOString().split('T')[0];
    const activeTeamsToday = new Set(
      validWorkLogs
        .filter(log => log.date === today)
        .flatMap(log => log.personnel || [])
    ).size;

    return {
      activeProjects: activeProjects.length,
      totalProjects: validProjects.length,
      totalHours,
      totalTargetHours,
      averageCompletion,
      urgentProjects: urgentProjects.length,
      totalEstimatedCost,
      activeTeamsToday,
      totalTeams: validTeams.length,
      recentActivity: validWorkLogs
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)
    };
  }, [projectInfos, workLogs, teams, currentYear]);

  const kpiCards = [
    {
      title: 'Projets actifs',
      value: dashboardData.activeProjects,
      total: dashboardData.totalProjects,
      icon: BarChart3,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Heures travaillées',
      value: formatNumber(dashboardData.totalHours),
      subtitle: `/${formatNumber(dashboardData.totalTargetHours)} h prévues`,
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      progress: dashboardData.totalTargetHours > 0 
        ? (dashboardData.totalHours / dashboardData.totalTargetHours) * 100 
        : 0
    },
    {
      title: 'Completion moyenne',
      value: `${Math.round(dashboardData.averageCompletion)}%`,
      icon: TrendingUp,
      color: dashboardData.averageCompletion >= 70 ? 'text-green-600' : 'text-orange-600',
      bgColor: dashboardData.averageCompletion >= 70 ? 'bg-green-100' : 'bg-orange-100',
      progress: dashboardData.averageCompletion
    },
    {
      title: 'Équipes actives',
      value: dashboardData.activeTeamsToday,
      total: dashboardData.totalTeams,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Chiffre d\'affaires estimé',
      value: `${formatNumber(dashboardData.totalEstimatedCost)}€`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Projets urgents',
      value: dashboardData.urgentProjects,
      icon: AlertTriangle,
      color: dashboardData.urgentProjects > 0 ? 'text-red-600' : 'text-green-600',
      bgColor: dashboardData.urgentProjects > 0 ? 'bg-red-100' : 'bg-green-100'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* En-tête */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Dashboard Avancé</h1>
        <p className="text-muted-foreground">
          Vue d'ensemble complète de vos activités {currentYear}
        </p>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {kpiCards.map((kpi, index) => (
          <Card key={index} className="hover-scale">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {kpi.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${kpi.bgColor}`}>
                  <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-semibold">
                    {kpi.value}
                  </span>
                  {kpi.total && (
                    <span className="text-sm text-muted-foreground">
                      /{kpi.total}
                    </span>
                  )}
                  {kpi.subtitle && (
                    <span className="text-sm text-muted-foreground">
                      {kpi.subtitle}
                    </span>
                  )}
                </div>
                
                {kpi.progress !== undefined && (
                  <div className="space-y-1">
                    <Progress value={kpi.progress} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {Math.round(kpi.progress)}% complété
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Graphiques et Analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <OverviewCharts 
          projects={projectInfos} 
          workLogs={workLogs} 
          teams={teams}
          selectedYear={currentYear}
        />
        <ActivityFeed recentActivity={dashboardData.recentActivity} />
      </div>

      {/* Actions rapides */}
      <QuickActions />
    </div>
  );
};

export default EnhancedDashboard;
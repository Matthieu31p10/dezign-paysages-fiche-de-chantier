import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Clock, 
  Target,
  AlertTriangle,
  CheckCircle,
  Activity,
  BarChart3
} from 'lucide-react';
import { ProjectInfo, WorkLog } from '@/types/models';
import { cn } from '@/lib/utils';

interface ProjectAnalyticsCardProps {
  projects: ProjectInfo[];
  workLogs: WorkLog[];
  className?: string;
}

interface AnalyticsData {
  totalProjects: number;
  activeProjects: number;
  archivedProjects: number;
  totalAnnualHours: number;
  averageVisitsPerProject: number;
  completionRate: number;
  upcomingDeadlines: number;
  recentActivity: number;
}

const ProjectAnalyticsCard: React.FC<ProjectAnalyticsCardProps> = ({
  projects,
  workLogs,
  className
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  // Calcul des métriques
  const analytics: AnalyticsData = useMemo(() => {
    const now = new Date();
    const periodDays = selectedPeriod === '7d' ? 7 : selectedPeriod === '30d' ? 30 : 90;
    const periodStart = new Date(now.getTime() - (periodDays * 24 * 60 * 60 * 1000));

    const activeProjects = projects.filter(p => !p.isArchived);
    const archivedProjects = projects.filter(p => p.isArchived);
    
    const recentWorkLogs = workLogs.filter(log => 
      new Date(log.date) >= periodStart
    );

    const totalAnnualHours = projects.reduce((sum, p) => sum + (p.annualTotalHours || 0), 0);
    const averageVisits = projects.length > 0 
      ? projects.reduce((sum, p) => sum + (p.annualVisits || 0), 0) / projects.length 
      : 0;

    // Taux de completion basé sur les visites effectuées vs prévues
    const totalExpectedVisits = projects.reduce((sum, p) => sum + (p.annualVisits || 0), 0);
    const totalCompletedVisits = workLogs.length;
    const completionRate = totalExpectedVisits > 0 
      ? Math.min((totalCompletedVisits / totalExpectedVisits) * 100, 100)
      : 0;

    return {
      totalProjects: projects.length,
      activeProjects: activeProjects.length,
      archivedProjects: archivedProjects.length,
      totalAnnualHours,
      averageVisitsPerProject: Math.round(averageVisits),
      completionRate: Math.round(completionRate),
      upcomingDeadlines: 0, // À implémenter avec les dates de fin de projet
      recentActivity: recentWorkLogs.length
    };
  }, [projects, workLogs, selectedPeriod]);

  const stats = [
    {
      title: 'Projets actifs',
      value: analytics.activeProjects,
      total: analytics.totalProjects,
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: analytics.activeProjects > analytics.archivedProjects ? 'up' : 'down'
    },
    {
      title: 'Heures annuelles',
      value: analytics.totalAnnualHours,
      suffix: 'h',
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: 'up'
    },
    {
      title: 'Taux de completion',
      value: analytics.completionRate,
      suffix: '%',
      icon: Target,
      color: analytics.completionRate > 80 ? 'text-green-600' : analytics.completionRate > 60 ? 'text-yellow-600' : 'text-red-600',
      bgColor: analytics.completionRate > 80 ? 'bg-green-50' : analytics.completionRate > 60 ? 'bg-yellow-50' : 'bg-red-50',
      showProgress: true
    },
    {
      title: 'Activité récente',
      value: analytics.recentActivity,
      suffix: ' visites',
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      period: selectedPeriod
    }
  ];

  return (
    <Card className={cn("border-2 bg-gradient-to-br from-slate-50 to-white", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Tableau de bord
          </CardTitle>
          
          {/* Sélecteur de période */}
          <div className="flex items-center gap-1 bg-white rounded-lg border p-1">
            {(['7d', '30d', '90d'] as const).map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
                className="text-xs h-7 px-2"
              >
                {period}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Grille des statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div 
              key={stat.title}
              className={cn(
                "p-4 rounded-xl border transition-all duration-200 hover:shadow-md group",
                stat.bgColor
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={cn("p-2 rounded-lg bg-white/80", stat.bgColor)}>
                  <stat.icon className={cn("h-4 w-4", stat.color)} />
                </div>
                {stat.trend && (
                  <div className={cn(
                    "flex items-center text-xs",
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  )}>
                    {stat.trend === 'up' ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                  </div>
                )}
              </div>
              
              <div className="space-y-1">
                <div className={cn("text-2xl font-bold", stat.color)}>
                  {stat.value.toLocaleString()}{stat.suffix}
                </div>
                <div className="text-xs text-gray-600 font-medium">
                  {stat.title}
                  {stat.period && ` (${stat.period})`}
                </div>
                
                {stat.showProgress && (
                  <div className="mt-2">
                    <Progress 
                      value={stat.value} 
                      className="h-2"
                    />
                  </div>
                )}
                
                {stat.total && (
                  <div className="text-xs text-gray-500">
                    sur {stat.total} total
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Alertes et notifications */}
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <div className="text-sm text-amber-800">
            <span className="font-medium">
              {analytics.activeProjects} projets actifs
            </span>
            {analytics.completionRate < 70 && (
              <span className="ml-2">• Taux de completion faible</span>
            )}
          </div>
        </div>

        {/* Actions rapides */}
        <div className="flex items-center gap-2 pt-2 border-t">
          <Badge variant="outline" className="text-xs">
            <CheckCircle className="h-3 w-3 mr-1" />
            Mis à jour il y a 2 min
          </Badge>
          <Button variant="ghost" size="sm" className="text-xs ml-auto">
            Voir le rapport complet →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectAnalyticsCard;
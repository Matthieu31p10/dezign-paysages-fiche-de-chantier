import React from 'react';
import { useDashboard } from '@/hooks/useDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import MetricCard from '@/components/dashboard/MetricCard';
import DashboardChart from '@/components/dashboard/DashboardChart';
import { 
  TrendingUp, 
  Users, 
  FolderOpen, 
  Clock, 
  DollarSign, 
  FileText,
  RefreshCw,
  Activity
} from 'lucide-react';

const Dashboard = () => {
  const { 
    metrics, 
    projectStats, 
    monthlyStats, 
    personnelStats, 
    loading, 
    refetch 
  } = useDashboard();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatHours = (hours: number) => {
    return `${hours.toFixed(1)}h`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Tableau de Bord</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-8 bg-muted rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Prepare chart data
  const topProjectsChartData = projectStats.slice(0, 5).map(p => ({
    name: p.projectName.length > 15 ? p.projectName.substring(0, 15) + '...' : p.projectName,
    hours: p.totalHours,
    revenue: p.revenue
  }));

  const monthlyChartData = monthlyStats.map(m => ({
    name: new Date(m.month + '-01').toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
    hours: m.hours,
    revenue: m.revenue,
    workLogs: m.workLogs
  }));

  const personnelChartData = personnelStats.slice(0, 8).map(p => ({
    name: p.name.length > 10 ? p.name.substring(0, 10) + '...' : p.name,
    hours: p.totalHours
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tableau de Bord</h1>
          <p className="text-muted-foreground">
            Vue d'ensemble de vos activités et performances
          </p>
        </div>
        <Button onClick={refetch} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Projets Actifs"
          value={metrics.activeProjects}
          subtitle={`sur ${metrics.totalProjects} projets total`}
          icon={<FolderOpen className="h-4 w-4" />}
        />
        <MetricCard
          title="Heures Totales"
          value={formatHours(metrics.totalHours)}
          subtitle={`${metrics.totalWorkLogs} fiches de travail`}
          icon={<Clock className="h-4 w-4" />}
        />
        <MetricCard
          title="Chiffre d'Affaires"
          value={formatCurrency(metrics.totalRevenue)}
          subtitle="Basé sur les heures facturées"
          icon={<DollarSign className="h-4 w-4" />}
        />
        <MetricCard
          title="Moyenne/Projet"
          value={formatHours(metrics.averageHoursPerProject)}
          subtitle="Heures par projet"
          icon={<Activity className="h-4 w-4" />}
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Monthly Evolution */}
        <DashboardChart
          title="Évolution Mensuelle des Heures"
          data={monthlyChartData}
          type="line"
          dataKey="hours"
          xAxisKey="name"
          color="#8884d8"
          height={300}
        />

        {/* Monthly Revenue */}
        <DashboardChart
          title="Évolution Mensuelle du CA"
          data={monthlyChartData}
          type="bar"
          dataKey="revenue"
          xAxisKey="name"
          color="#82ca9d"
          height={300}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Projects */}
        <DashboardChart
          title="Top 5 Projets (Heures)"
          data={topProjectsChartData}
          type="bar"
          dataKey="hours"
          xAxisKey="name"
          color="#ffc658"
          height={300}
        />

        {/* Personnel Performance */}
        <DashboardChart
          title="Performance du Personnel"
          data={personnelChartData}
          type="bar"
          dataKey="hours"
          xAxisKey="name"
          color="#ff7300"
          height={300}
        />
      </div>

      {/* Detailed Tables */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Project Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              Détails des Projets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {projectStats.slice(0, 5).map((project, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{project.projectName}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatHours(project.totalHours)} • {project.totalWorkLogs} fiches
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {formatCurrency(project.revenue)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Personnel Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Performance du Personnel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {personnelStats.slice(0, 5).map((person, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{person.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {person.totalWorkLogs} fiches de travail
                    </p>
                  </div>
                  <Badge variant="outline">
                    {formatHours(person.totalHours)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
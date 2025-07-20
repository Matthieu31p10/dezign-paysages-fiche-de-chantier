import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, Calendar, TrendingUp } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';

const Dashboard: React.FC = () => {
  const { metrics, recentActivity, upcomingDeadlines } = useDashboardData();
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Tableau de bord</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-hover border border-border/50 bg-card shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Chantiers actifs</CardTitle>
            <BarChart3 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{metrics.activeProjects}</div>
            <p className="text-xs text-muted-foreground">{metrics.activeProjectsChange}</p>
          </CardContent>
        </Card>

        <Card className="card-hover border border-border/50 bg-card shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Équipes sur site</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{metrics.teamsOnSite}</div>
            <p className="text-xs text-muted-foreground">{metrics.teamsChange}</p>
          </CardContent>
        </Card>

        <Card className="card-hover border border-border/50 bg-card shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Passages planifiés</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{metrics.scheduledVisits}</div>
            <p className="text-xs text-muted-foreground">{metrics.scheduledVisitsChange}</p>
          </CardContent>
        </Card>

        <Card className="card-hover border border-border/50 bg-card shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Progression globale</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{metrics.globalProgress}%</div>
            <p className="text-xs text-muted-foreground">{metrics.progressChange}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-hover border border-border/50 bg-card shadow-soft">
          <CardHeader>
            <CardTitle className="text-card-foreground">Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'project' ? 'bg-orange-500' : 
                      activity.type === 'worklog' ? 'bg-blue-500' : 'bg-primary animate-pulse-glow'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">Aucune activité récente</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover border border-border/50 bg-card shadow-soft">
          <CardHeader>
            <CardTitle className="text-card-foreground">Prochaines échéances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingDeadlines.map((deadline) => (
                <div key={deadline.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{deadline.title}</p>
                    <p className="text-xs text-muted-foreground">{deadline.date}</p>
                  </div>
                  <div className={`badge px-2 py-1 text-xs rounded ${
                    deadline.priority === 'urgent' ? 'warning-state' :
                    deadline.priority === 'normal' ? 'success-state' : 'info-state'
                  }`}>
                    {deadline.priority === 'urgent' ? 'Urgent' :
                     deadline.priority === 'normal' ? 'Normal' : 'Planifié'}
                  </div>
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
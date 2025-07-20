import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, Calendar, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
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
            <div className="text-2xl font-bold text-foreground">12</div>
            <p className="text-xs text-muted-foreground">+2 depuis le mois dernier</p>
          </CardContent>
        </Card>

        <Card className="card-hover border border-border/50 bg-card shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Équipes sur site</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">8</div>
            <p className="text-xs text-muted-foreground">+1 depuis la semaine dernière</p>
          </CardContent>
        </Card>

        <Card className="card-hover border border-border/50 bg-card shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Passages planifiés</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">24</div>
            <p className="text-xs text-muted-foreground">Cette semaine</p>
          </CardContent>
        </Card>

        <Card className="card-hover border border-border/50 bg-card shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Progression globale</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">68%</div>
            <p className="text-xs text-muted-foreground">+5% ce mois-ci</p>
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
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse-glow"></div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">Nouveau passage planifié sur Chantier A</p>
                  <p className="text-xs text-muted-foreground">Il y a 2 heures</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">Rapport de suivi complété</p>
                  <p className="text-xs text-muted-foreground">Il y a 4 heures</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">Nouveau chantier créé</p>
                  <p className="text-xs text-muted-foreground">Hier</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover border border-border/50 bg-card shadow-soft">
          <CardHeader>
            <CardTitle className="text-card-foreground">Prochaines échéances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Passage Chantier B</p>
                  <p className="text-xs text-muted-foreground">Demain, 14h00</p>
                </div>
                <div className="badge badge warning-state px-2 py-1 text-xs rounded">
                  Urgent
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Rapport mensuel</p>
                  <p className="text-xs text-muted-foreground">Dans 3 jours</p>
                </div>
                <div className="badge success-state px-2 py-1 text-xs rounded">
                  Normal
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Réunion équipe</p>
                  <p className="text-xs text-muted-foreground">Vendredi, 10h00</p>
                </div>
                <div className="badge info-state px-2 py-1 text-xs rounded">
                  Planifié
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
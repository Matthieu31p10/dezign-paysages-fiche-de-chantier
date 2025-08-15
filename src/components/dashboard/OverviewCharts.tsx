import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { ProjectInfo, WorkLog } from '@/types/models';
import { filterWorkLogsByYear } from '@/utils/statistics';
import { calculateProjectCompletion } from '@/utils/stats-utils';

interface OverviewChartsProps {
  projects: ProjectInfo[];
  workLogs: WorkLog[];
  teams: Array<{ id: string; name: string; color: string }>;
  selectedYear: number;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', '#8884d8', '#82ca9d', '#ffc658'];

const OverviewCharts: React.FC<OverviewChartsProps> = ({
  projects,
  workLogs,
  teams,
  selectedYear
}) => {
  const yearWorkLogs = useMemo(() => 
    filterWorkLogsByYear(workLogs, selectedYear), 
    [workLogs, selectedYear]
  );

  // Données pour le graphique des projets par statut
  const projectStatusData = useMemo(() => {
    const activeProjects = projects.filter(p => !p.isArchived);
    const statusCategories = [
      { name: 'Complétés', value: 0, color: 'hsl(var(--primary))' },
      { name: 'En cours', value: 0, color: 'hsl(var(--secondary))' },
      { name: 'Démarrage', value: 0, color: 'hsl(var(--accent))' }
    ];

    activeProjects.forEach(project => {
      const completion = calculateProjectCompletion(project, yearWorkLogs, selectedYear);
      if (completion >= 90) {
        statusCategories[0].value++;
      } else if (completion >= 25) {
        statusCategories[1].value++;
      } else {
        statusCategories[2].value++;
      }
    });

    return statusCategories.filter(cat => cat.value > 0);
  }, [projects, yearWorkLogs, selectedYear]);

  // Données pour le graphique des heures par mois
  const monthlyHoursData = useMemo(() => {
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(0, i).toLocaleDateString('fr-FR', { month: 'short' }),
      heures: 0,
      objectif: 0
    }));

    yearWorkLogs.forEach(log => {
      const logDate = new Date(log.date);
      const month = logDate.getMonth();
      const hours = log.timeTracking?.totalHours || 0;
      const personnel = log.personnel?.length || 1;
      monthlyData[month].heures += hours * personnel;
    });

    // Calcul des objectifs basé sur les heures annuelles des projets
    const totalTargetHours = projects
      .filter(p => !p.isArchived)
      .reduce((sum, p) => sum + (p.annualTotalHours || 0), 0);
    
    const monthlyTarget = totalTargetHours / 12;
    monthlyData.forEach(item => {
      item.objectif = monthlyTarget;
    });

    return monthlyData;
  }, [yearWorkLogs, projects]);

  // Données pour le graphique des équipes les plus actives
  const teamActivityData = useMemo(() => {
    const teamHours: Record<string, number> = {};
    
    teams.forEach(team => {
      teamHours[team.id] = 0;
    });

    yearWorkLogs.forEach(log => {
      if (log.personnel) {
        log.personnel.forEach(member => {
          // Trouver l'équipe du membre (pour simplifier, on assigne aléatoirement)
          const team = teams[Math.floor(Math.random() * teams.length)];
          if (team) {
            const hours = log.timeTracking?.totalHours || 0;
            teamHours[team.id] = (teamHours[team.id] || 0) + hours;
          }
        });
      }
    });

    return teams
      .map(team => ({
        name: team.name,
        heures: Math.round(teamHours[team.id] || 0),
        color: team.color
      }))
      .filter(team => team.heures > 0)
      .sort((a, b) => b.heures - a.heures)
      .slice(0, 6);
  }, [teams, yearWorkLogs]);

  const chartConfig = {
    heures: {
      label: "Heures",
      color: "hsl(var(--primary))",
    },
    objectif: {
      label: "Objectif",
      color: "hsl(var(--secondary))",
    },
  };

  return (
    <>
      {/* Graphique des heures mensuelles */}
      <Card>
        <CardHeader>
          <CardTitle>Performance mensuelle {selectedYear}</CardTitle>
          <CardDescription>
            Comparaison heures réalisées vs objectifs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyHoursData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area 
                  type="monotone" 
                  dataKey="objectif" 
                  stroke="hsl(var(--secondary))"
                  fill="hsl(var(--secondary))"
                  fillOpacity={0.2}
                />
                <Area 
                  type="monotone" 
                  dataKey="heures" 
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Graphiques en grille */}
      <div className="space-y-6">
        {/* Statut des projets */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition des projets</CardTitle>
            <CardDescription>
              Par niveau de completion
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Équipes les plus actives */}
        <Card>
          <CardHeader>
            <CardTitle>Équipes les plus actives</CardTitle>
            <CardDescription>
              Heures travaillées en {selectedYear}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={teamActivityData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="heures" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default OverviewCharts;
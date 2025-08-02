import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { WorkLog } from '@/types/models';
import { format, parseISO, startOfWeek, startOfMonth, subWeeks, subMonths, eachWeekOfInterval, eachMonthOfInterval } from 'date-fns';
import { fr } from 'date-fns/locale';
import { formatCurrency } from '@/utils/format-utils';

interface WorkLogAnalyticsProps {
  workLogs: WorkLog[];
  teams: Array<{ id: string; name: string; color: string }>;
  viewType?: 'all' | 'suivi' | 'vierges';
}

export const WorkLogAnalytics: React.FC<WorkLogAnalyticsProps> = ({
  workLogs,
  teams,
  viewType = 'all'
}) => {
  // Filtrer les données selon le type de vue
  const filteredWorkLogs = useMemo(() => {
    if (viewType === 'all') return workLogs;
    
    const isBlankWorksheet = (log: WorkLog) => 
      log.projectId && (log.projectId.startsWith('blank-') || log.projectId.startsWith('DZFV'));
    
    if (viewType === 'suivi') {
      return workLogs.filter(log => !isBlankWorksheet(log));
    } else if (viewType === 'vierges') {
      return workLogs.filter(log => isBlankWorksheet(log));
    }
    
    return workLogs;
  }, [workLogs, viewType]);

  const analyticsData = useMemo(() => {
    const now = new Date();
    
    // Données pour le graphique temporel (12 dernières semaines)
    const weeklyData = eachWeekOfInterval({
      start: subWeeks(now, 11),
      end: now
    }).map(weekStart => {
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      const weekLogs = filteredWorkLogs.filter(log => {
        const logDate = parseISO(log.date);
        return logDate >= weekStart && logDate <= weekEnd;
      });
      
      const weekHours = weekLogs.reduce((sum, log) => {
        const hours = log.timeTracking?.totalHours || log.duration || 0;
        const personnel = log.personnel?.length || 1;
        return sum + (hours * personnel);
      }, 0);
      
      const weekRevenue = weekLogs.reduce((sum, log) => {
        const hours = log.timeTracking?.totalHours || log.duration || 0;
        const personnel = log.personnel?.length || 1;
        const rate = log.hourlyRate || 45;
        return sum + (hours * personnel * rate);
      }, 0);
      
      return {
        week: format(weekStart, 'dd MMM', { locale: fr }),
        date: weekStart,
        fiches: weekLogs.length,
        heures: Number(weekHours.toFixed(1)),
        revenus: Number(weekRevenue.toFixed(0))
      };
    });

    // Données mensuelles (6 derniers mois)
    const monthlyData = eachMonthOfInterval({
      start: subMonths(now, 5),
      end: now
    }).map(monthStart => {
      const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
      
      const monthLogs = filteredWorkLogs.filter(log => {
        const logDate = parseISO(log.date);
        return logDate >= monthStart && logDate <= monthEnd;
      });
      
      const monthHours = monthLogs.reduce((sum, log) => {
        const hours = log.timeTracking?.totalHours || log.duration || 0;
        const personnel = log.personnel?.length || 1;
        return sum + (hours * personnel);
      }, 0);
      
      const monthRevenue = monthLogs.reduce((sum, log) => {
        const hours = log.timeTracking?.totalHours || log.duration || 0;
        const personnel = log.personnel?.length || 1;
        const rate = log.hourlyRate || 45;
        return sum + (hours * personnel * rate);
      }, 0);
      
      return {
        mois: format(monthStart, 'MMM yyyy', { locale: fr }),
        fiches: monthLogs.length,
        heures: Number(monthHours.toFixed(1)),
        revenus: Number(monthRevenue.toFixed(0)),
        factures: monthLogs.filter(log => log.invoiced).length
      };
    });

    // Répartition par équipe
    const teamData = teams.map(team => {
      const teamLogs = filteredWorkLogs.filter(log => log.personnel?.[0] === team.name);
      const teamHours = teamLogs.reduce((sum, log) => {
        const hours = log.timeTracking?.totalHours || log.duration || 0;
        const personnel = log.personnel?.length || 1;
        return sum + (hours * personnel);
      }, 0);
      
      const teamRevenue = teamLogs.reduce((sum, log) => {
        const hours = log.timeTracking?.totalHours || log.duration || 0;
        const personnel = log.personnel?.length || 1;
        const rate = log.hourlyRate || 45;
        return sum + (hours * personnel * rate);
      }, 0);
      
      return {
        equipe: team.name,
        fiches: teamLogs.length,
        heures: Number(teamHours.toFixed(1)),
        revenus: Number(teamRevenue.toFixed(0)),
        color: team.color
      };
    }).filter(team => team.fiches > 0);

    // Analyse des projets les plus actifs
    const projectStats = new Map();
    filteredWorkLogs.forEach(log => {
      const key = log.projectId;
      if (!projectStats.has(key)) {
        projectStats.set(key, {
          projectId: key,
          fiches: 0,
          heures: 0,
          revenus: 0
        });
      }
      
      const stats = projectStats.get(key);
      const hours = log.timeTracking?.totalHours || log.duration || 0;
      const personnel = log.personnel?.length || 1;
      const rate = log.hourlyRate || 45;
      
      stats.fiches += 1;
      stats.heures += hours * personnel;
      stats.revenus += hours * personnel * rate;
    });

    const topProjects = Array.from(projectStats.values())
      .sort((a, b) => b.heures - a.heures)
      .slice(0, 5)
      .map(project => ({
        ...project,
        heures: Number(project.heures.toFixed(1)),
        revenus: Number(project.revenus.toFixed(0))
      }));

    // Analyse facturation
    const invoicingData = [
      { 
        statut: 'Facturé', 
        nombre: filteredWorkLogs.filter(log => log.invoiced).length,
        color: '#10B981'
      },
      { 
        statut: 'En attente', 
        nombre: filteredWorkLogs.filter(log => !log.invoiced).length,
        color: '#F59E0B'
      }
    ];

    return {
      weeklyData,
      monthlyData,
      teamData,
      topProjects,
      invoicingData
    };
  }, [filteredWorkLogs, teams]);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey === 'revenus' ? 
                `${entry.name}: ${formatCurrency(entry.value)}` :
                `${entry.name}: ${entry.value}${entry.dataKey === 'heures' ? 'h' : ''}`
              }
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Évolution temporelle */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Évolution hebdomadaire</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData.weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="week" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="fiches" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    name="Fiches"
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="heures" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    name="Heures"
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tendances mensuelles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="mois" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar 
                    dataKey="revenus" 
                    fill="#8B5CF6" 
                    name="Revenus (€)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Répartition par équipe */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance par équipe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.teamData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis 
                    type="category" 
                    dataKey="equipe" 
                    tick={{ fontSize: 12 }}
                    width={80}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="heures" 
                    fill="#10B981"
                    name="Heures"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statut facturation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsData.invoicingData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ statut, nombre, percent }) => 
                      `${statut}: ${nombre} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="nombre"
                  >
                    {analyticsData.invoicingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top projets */}
      <Card>
        <CardHeader>
          <CardTitle>Top 5 des projets les plus actifs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.topProjects}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="projectId" 
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                          <p className="font-medium">{`Projet: ${label}`}</p>
                          {payload.map((entry: any, index: number) => (
                            <p key={index} style={{ color: entry.color }}>
                              {entry.dataKey === 'revenus' ? 
                                `Revenus: ${formatCurrency(entry.value)}` :
                                entry.dataKey === 'heures' ?
                                `Heures: ${entry.value}h` :
                                `Fiches: ${entry.value}`
                              }
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="fiches" 
                  fill="#3B82F6" 
                  name="Fiches"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="heures" 
                  fill="#10B981" 
                  name="Heures"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Résumé analytique */}
      <Card>
        <CardHeader>
          <CardTitle>Insights et Tendances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {analyticsData.weeklyData.slice(-1)[0]?.heures || 0}h
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300">Cette semaine</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                {analyticsData.weeklyData.slice(-2)[0]?.heures || 0}h la semaine dernière
              </p>
            </div>
            
            <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {analyticsData.teamData.length}
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">Équipes actives</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                {analyticsData.teamData.reduce((sum, team) => sum + team.fiches, 0)} fiches au total
              </p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                {((analyticsData.invoicingData[0]?.nombre || 0) / filteredWorkLogs.length * 100).toFixed(0)}%
              </div>
              <p className="text-sm text-purple-700 dark:text-purple-300">Taux facturation</p>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                {analyticsData.invoicingData[1]?.nombre || 0} en attente
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
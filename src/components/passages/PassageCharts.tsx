import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { WorkLog } from '@/types/models';
import { format, startOfWeek, addDays, parseISO, startOfMonth, addMonths } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PassageChartsProps {
  passages: WorkLog[];
  getProjectName: (projectId: string) => string;
}

export const PassageCharts: React.FC<PassageChartsProps> = ({
  passages,
  getProjectName
}) => {
  // Données pour le graphique de fréquence hebdomadaire
  const weeklyData = useMemo(() => {
    const last8Weeks = Array.from({ length: 8 }, (_, i) => {
      const weekStart = startOfWeek(addDays(new Date(), -i * 7), { weekStartsOn: 1 });
      return {
        week: format(weekStart, 'dd MMM', { locale: fr }),
        date: weekStart,
        passages: 0
      };
    }).reverse();

    passages.forEach(passage => {
      const passageDate = parseISO(passage.date);
      const weekStart = startOfWeek(passageDate, { weekStartsOn: 1 });
      
      const weekData = last8Weeks.find(w => 
        w.date.getTime() === weekStart.getTime()
      );
      
      if (weekData) {
        weekData.passages++;
      }
    });

    return last8Weeks;
  }, [passages]);

  // Données pour le graphique par équipe
  const teamData = useMemo(() => {
    const teamCounts: Record<string, number> = {};
    
    passages.forEach(passage => {
      const team = passage.personnel?.[0] || 'Non assigné';
      teamCounts[team] = (teamCounts[team] || 0) + 1;
    });

    return Object.entries(teamCounts)
      .map(([team, count]) => ({ team, passages: count }))
      .sort((a, b) => b.passages - a.passages)
      .slice(0, 6); // Top 6 équipes
  }, [passages]);

  // Données pour le graphique des tendances mensuelles
  const monthlyData = useMemo(() => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const monthStart = startOfMonth(addMonths(new Date(), -i));
      return {
        month: format(monthStart, 'MMM', { locale: fr }),
        date: monthStart,
        passages: 0,
        heures: 0
      };
    }).reverse();

    passages.forEach(passage => {
      const passageDate = parseISO(passage.date);
      const monthStart = startOfMonth(passageDate);
      
      const monthData = last6Months.find(m => 
        m.date.getMonth() === monthStart.getMonth() && 
        m.date.getFullYear() === monthStart.getFullYear()
      );
      
      if (monthData) {
        monthData.passages++;
        monthData.heures += passage.timeTracking?.totalHours || passage.duration || 0;
      }
    });

    return last6Months;
  }, [passages]);

  // Données pour le graphique des projets les plus fréquentés
  const projectData = useMemo(() => {
    const projectCounts: Record<string, number> = {};
    
    passages.forEach(passage => {
      const projectName = getProjectName(passage.projectId);
      projectCounts[projectName] = (projectCounts[projectName] || 0) + 1;
    });

    return Object.entries(projectCounts)
      .map(([project, count]) => ({ 
        project: project.length > 20 ? project.substring(0, 20) + '...' : project,
        passages: count,
        fullName: project
      }))
      .sort((a, b) => b.passages - a.passages)
      .slice(0, 5); // Top 5 projets
  }, [passages, getProjectName]);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Graphique de fréquence hebdomadaire */}
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Fréquence des passages (8 dernières semaines)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="week" 
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="passages" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Graphique par équipe */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Passages par équipe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  type="number"
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  type="category"
                  dataKey="team" 
                  className="text-xs"
                  tick={{ fontSize: 11 }}
                  width={80}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="passages" 
                  fill="#10B981"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Graphique des tendances mensuelles */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Tendances mensuelles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="month" 
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value, name) => [
                    value, 
                    name === 'passages' ? 'Passages' : 'Heures'
                  ]}
                />
                <Bar 
                  dataKey="passages" 
                  fill="#F59E0B"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top 5 des projets */}
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Top 5 des projets les plus fréquentés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="project" 
                  className="text-xs"
                  tick={{ fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value, name, props) => [
                    value, 
                    'Passages'
                  ]}
                  labelFormatter={(label, payload) => {
                    const item = payload?.[0]?.payload;
                    return item?.fullName || label;
                  }}
                />
                <Bar 
                  dataKey="passages" 
                  fill="#8B5CF6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
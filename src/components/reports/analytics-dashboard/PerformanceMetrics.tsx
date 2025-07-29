import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { WorkLog, ProjectInfo } from '@/types/models';
import { formatNumber } from '@/utils/helpers';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface PerformanceMetricsProps {
  projects: ProjectInfo[];
  workLogs: WorkLog[];
  insights: any;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
  projects,
  workLogs,
  insights
}) => {
  // Project performance data
  const projectPerformance = useMemo(() => {
    return projects
      .filter(p => !p.isArchived)
      .map(project => {
        const projectLogs = workLogs.filter(log => log.projectId === project.id);
        const actualHours = projectLogs.reduce((sum, log) => sum + (log.timeTracking?.totalHours || 0), 0);
        const plannedHours = project.annualTotalHours || 0;
        const completionRate = plannedHours > 0 ? (actualHours / plannedHours) * 100 : 0;
        
        return {
          name: project.name.length > 20 ? project.name.substring(0, 20) + '...' : project.name,
          fullName: project.name,
          planned: plannedHours,
          actual: actualHours,
          completion: Math.min(100, completionRate),
          visits: projectLogs.length
        };
      })
      .sort((a, b) => b.actual - a.actual)
      .slice(0, 10);
  }, [projects, workLogs]);

  // Efficiency analysis
  const efficiencyData = useMemo(() => {
    const ranges = [
      { name: 'Sous-utilisé (<70%)', value: 0, color: '#ef4444' },
      { name: 'Normal (70-90%)', value: 0, color: '#f59e0b' },
      { name: 'Optimal (90-110%)', value: 0, color: '#10b981' },
      { name: 'Sur-utilisé (>110%)', value: 0, color: '#8b5cf6' }
    ];

    projectPerformance.forEach(project => {
      if (project.completion < 70) ranges[0].value++;
      else if (project.completion < 90) ranges[1].value++;
      else if (project.completion <= 110) ranges[2].value++;
      else ranges[3].value++;
    });

    return ranges.filter(range => range.value > 0);
  }, [projectPerformance]);

  // Time distribution
  const timeDistribution = useMemo(() => {
    const blankSheetHours = workLogs
      .filter(log => log.projectId && (log.projectId.startsWith('blank-') || log.projectId.startsWith('DZFV')))
      .reduce((sum, log) => sum + (log.timeTracking?.totalHours || 0), 0);
    
    const projectHours = insights.totalHours - blankSheetHours;

    return [
      { name: 'Projets réguliers', value: projectHours, color: '#3b82f6' },
      { name: 'Fiches vierges', value: blankSheetHours, color: '#f59e0b' }
    ];
  }, [workLogs, insights.totalHours]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Project Performance Chart */}
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Performance par projet (Top 10)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={projectPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  `${formatNumber(value as number)}h`,
                  name === 'planned' ? 'Planifié' : 'Réalisé'
                ]}
                labelFormatter={(label) => {
                  const project = projectPerformance.find(p => p.name === label);
                  return project?.fullName || label;
                }}
              />
              <Bar dataKey="planned" fill="#94a3b8" name="planned" />
              <Bar dataKey="actual" fill="#3b82f6" name="actual" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Project Efficiency Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Répartition de l'efficacité</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={efficiencyData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {efficiencyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Time Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Répartition du temps</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={timeDistribution}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${formatNumber(value)}h`}
              >
                {timeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${formatNumber(value as number)}h`} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Project List */}
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Détail des performances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projectPerformance.slice(0, 8).map((project, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{project.fullName}</span>
                  <div className="text-right text-sm text-muted-foreground">
                    <div>{formatNumber(project.actual)}h / {formatNumber(project.planned)}h</div>
                    <div>{project.visits} visites</div>
                  </div>
                </div>
                <Progress 
                  value={project.completion} 
                  className="h-2"
                />
                <div className="text-xs text-muted-foreground">
                  {project.completion.toFixed(1)}% de réalisation
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceMetrics;
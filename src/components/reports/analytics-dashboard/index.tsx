import React, { useMemo } from 'react';
import { WorkLog, ProjectInfo } from '@/types/models';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, AlertTriangle, Users, Target } from 'lucide-react';
import PerformanceMetrics from './PerformanceMetrics';
import TrendAnalysis from './TrendAnalysis';
import InsightCards from './InsightCards';
import ProductivityAnalysis from './ProductivityAnalysis';

interface AnalyticsDashboardProps {
  projects: ProjectInfo[];
  workLogs: WorkLog[];
  teams: { id: string; name: string }[];
  selectedYear: number;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  projects,
  workLogs,
  teams,
  selectedYear
}) => {
  // Filter work logs for selected year
  const yearWorkLogs = useMemo(() => {
    return workLogs.filter(log => {
      const logYear = new Date(log.date).getFullYear();
      return logYear === selectedYear;
    });
  }, [workLogs, selectedYear]);

  // Calculate insights
  const insights = useMemo(() => {
    const totalHours = yearWorkLogs.reduce((sum, log) => sum + (log.timeTracking?.totalHours || 0), 0);
    const totalPlannedHours = projects.reduce((sum, p) => sum + (p.annualTotalHours || 0), 0);
    const completionRate = totalPlannedHours > 0 ? (totalHours / totalPlannedHours) * 100 : 0;
    
    const blankSheets = yearWorkLogs.filter(log => 
      log.projectId && (log.projectId.startsWith('blank-') || log.projectId.startsWith('DZFV'))
    );
    
    const averageHoursPerVisit = yearWorkLogs.length > 0 ? totalHours / yearWorkLogs.length : 0;
    
    const teamProductivity = teams.map(team => {
      const teamProjects = projects.filter(p => p.team === team.id);
      const teamLogs = yearWorkLogs.filter(log => 
        teamProjects.some(p => p.id === log.projectId)
      );
      const teamHours = teamLogs.reduce((sum, log) => sum + (log.timeTracking?.totalHours || 0), 0);
      return { team: team.name, hours: teamHours, visits: teamLogs.length };
    });

    return {
      totalHours,
      totalPlannedHours,
      completionRate,
      blankSheets: blankSheets.length,
      averageHoursPerVisit,
      teamProductivity,
      totalVisits: yearWorkLogs.length,
      activeProjects: projects.filter(p => !p.isArchived).length
    };
  }, [yearWorkLogs, projects, teams]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tableau de bord analytique</h2>
          <p className="text-muted-foreground">
            Analyse détaillée des performances pour {selectedYear}
          </p>
        </div>
      </div>

      <InsightCards insights={insights} />

      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="performance" className="flex items-center gap-1.5">
            <Target className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4" />
            Tendances
          </TabsTrigger>
          <TabsTrigger value="productivity" className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            Productivité
          </TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <PerformanceMetrics 
            projects={projects}
            workLogs={yearWorkLogs}
            insights={insights}
          />
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <TrendAnalysis 
            workLogs={workLogs}
            selectedYear={selectedYear}
          />
        </TabsContent>

        <TabsContent value="productivity" className="space-y-6">
          <ProductivityAnalysis 
            teams={teams}
            workLogs={yearWorkLogs}
            projects={projects}
            insights={insights}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
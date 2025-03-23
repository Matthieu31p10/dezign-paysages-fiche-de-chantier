
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { getCurrentYear } from '@/utils/helpers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import GlobalStats from '@/components/reports/GlobalStats';
import ProjectReportCard from '@/components/reports/ProjectReportCard';
import { BarChart3, Calendar } from 'lucide-react';

const Reports = () => {
  const { projectInfos, workLogs, teams } = useApp();
  const [selectedYear, setSelectedYear] = useState<number>(getCurrentYear());
  
  // Get available years from work logs
  const currentYear = getCurrentYear();
  const availableYears = [currentYear];
  
  // Add past years if we have work logs for them
  workLogs.forEach(log => {
    const year = new Date(log.date).getFullYear();
    if (!availableYears.includes(year)) {
      availableYears.push(year);
    }
  });
  
  // Sort years descending
  availableYears.sort((a, b) => b - a);
  
  // Filter work logs by year
  const yearFilteredLogs = workLogs.filter(log => {
    const logDate = new Date(log.date);
    return logDate.getFullYear() === selectedYear;
  });
  
  // Group work logs by project
  const projectWorkLogs = projectInfos.map(project => ({
    project,
    logs: yearFilteredLogs.filter(log => log.projectId === project.id),
  }));
  
  // Sort by most active projects first
  projectWorkLogs.sort((a, b) => b.logs.length - a.logs.length);
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Bilans</h1>
          <p className="text-muted-foreground">
            Consultez les bilans de vos chantiers
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Select
            value={selectedYear.toString()}
            onValueChange={(value) => setSelectedYear(parseInt(value))}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Année" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map(year => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <GlobalStats
        projects={projectInfos}
        workLogs={workLogs}
        teams={teams}
        selectedYear={selectedYear}
      />
      
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <CardTitle>Bilans par chantier</CardTitle>
          </div>
          <CardDescription>
            Progression des chantiers pour l'année {selectedYear}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {projectWorkLogs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Aucun chantier disponible
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectWorkLogs.map(({ project, logs }) => (
                <ProjectReportCard
                  key={project.id}
                  project={project}
                  workLogs={logs}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;

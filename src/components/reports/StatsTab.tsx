
import React, { useState } from 'react';
import { useWorkLogs } from '@/context/WorkLogsContext/WorkLogsContext';
import { useProjects } from '@/context/ProjectsContext';
import { useApp } from '@/context/AppContext';
import GlobalStats from './GlobalStats';
import YearlyAnalysisTab from './YearlyAnalysisTab';
import { getCurrentYear, filterWorkLogsByYear } from '@/utils/helpers';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const StatsTab: React.FC = () => {
  const { workLogs } = useWorkLogs();
  const { projectInfos } = useProjects();
  const { teams } = useApp();
  const [selectedYear, setSelectedYear] = useState<number>(getCurrentYear());

  // Get available years from work logs
  const getAvailableYears = () => {
    const years = workLogs.map(log => new Date(log.date).getFullYear());
    return [...new Set(years)].sort((a, b) => b - a);
  };

  const availableYears = getAvailableYears();
  
  // Filter projects to only include active ones (non-archived)
  const activeProjects = projectInfos.filter(project => !project.isArchived);
  
  // Filter work logs by year and active projects
  const filteredWorkLogs = filterWorkLogsByYear(workLogs, selectedYear)
    .filter(log => activeProjects.some(project => project.id === log.projectId));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-48">
          <Select
            value={selectedYear.toString()}
            onValueChange={(value) => setSelectedYear(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une année" />
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
        projects={activeProjects}
        workLogs={filteredWorkLogs}
        teams={teams}
        selectedYear={selectedYear}
      />
      
      <YearlyAnalysisTab workLogs={workLogs} />
    </div>
  );
};

export default StatsTab;


import { useState, useTransition } from 'react';
import { useApp } from '@/context/AppContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import GlobalStats from '@/components/reports/global-stats';
import { getCurrentYear } from '@/utils/date-utils';
import { getYearsFromWorkLogs } from '@/utils/worklog-utils';
import WaterConsumptionReport from '@/components/reports/WaterConsumptionReport';

const StatsTab = () => {
  const { projectInfos, workLogs, teams } = useApp();
  const [isPending, startTransition] = useTransition();
  const [selectedYear, setSelectedYear] = useState<number>(getCurrentYear());
  
  const validProjectInfos = Array.isArray(projectInfos) ? projectInfos : [];
  const validWorkLogs = Array.isArray(workLogs) ? workLogs : [];
  const validTeams = Array.isArray(teams) ? teams : [];
  
  const activeProjects = validProjectInfos.filter(project => !project.isArchived);
  
  const availableYears = getYearsFromWorkLogs(validWorkLogs);
  
  const handleYearChange = (value: string) => {
    startTransition(() => {
      setSelectedYear(parseInt(value));
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-4">
        <Select
          value={selectedYear.toString()}
          onValueChange={handleYearChange}
        >
          <SelectTrigger className="w-[120px]">
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
      
      <GlobalStats 
        projects={activeProjects} 
        workLogs={validWorkLogs} 
        teams={validTeams} 
        selectedYear={selectedYear} 
      />

      <WaterConsumptionReport />
    </div>
  );
};

export default StatsTab;

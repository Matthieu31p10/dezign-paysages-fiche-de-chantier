
import { useState, useTransition } from 'react';
import { useApp } from '@/context/AppContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import GlobalStats from '@/components/reports/global-stats';
import { getCurrentYear } from '@/utils/date-utils';
import { getYearsFromWorkLogs } from '@/utils/statistics';
import WaterConsumptionReport from '@/components/reports/WaterConsumptionReport';
import BlankSheetAnalysis from '@/components/reports/blank-sheet-analysis';
import AnalyticsDashboard from '@/components/reports/analytics-dashboard';
import { useWorkLogs } from '@/context/WorkLogsContext/WorkLogsContext';

const StatsTab = () => {
  const { projectInfos, teams } = useApp();
  const { workLogs } = useWorkLogs();
  const [isPending, startTransition] = useTransition();
  const [selectedYear, setSelectedYear] = useState<number>(getCurrentYear());
  const [selectedTab, setSelectedTab] = useState<string>('global');
  
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

  const tabs = [
    { id: 'global', label: 'Statistiques globales' },
    { id: 'analytics', label: 'Analytics avancé' },
    { id: 'blank', label: 'Analyse fiches vierges' },
    { id: 'water', label: 'Consommation d\'eau' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`px-4 py-2 rounded-md ${
                selectedTab === tab.id 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
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
      
      {selectedTab === 'global' && (
        <GlobalStats 
          projects={activeProjects} 
          workLogs={validWorkLogs} 
          teams={validTeams} 
          selectedYear={selectedYear} 
        />
      )}

      {selectedTab === 'analytics' && (
        <AnalyticsDashboard 
          projects={activeProjects} 
          workLogs={validWorkLogs} 
          teams={validTeams} 
          selectedYear={selectedYear} 
        />
      )}

      {selectedTab === 'water' && (
        <WaterConsumptionReport />
      )}

      {selectedTab === 'blank' && (
        <BlankSheetAnalysis 
          workLogs={validWorkLogs} 
          selectedYear={selectedYear} 
        />
      )}
    </div>
  );
};

export default StatsTab;

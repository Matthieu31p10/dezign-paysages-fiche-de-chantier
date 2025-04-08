
import { useState, useEffect } from 'react';
import { ProjectInfo, WorkLog } from '@/types/models';
import { Card } from '@/components/ui/card';
import { filterWorkLogsByYear } from '@/utils/helpers';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart2, User } from 'lucide-react';
import ProjectsOverview from './ProjectsOverview';
import PersonnelOverview from './PersonnelOverview';

interface GlobalStatsProps {
  projects: ProjectInfo[];  // These are already filtered projects (non archived)
  workLogs: WorkLog[];      // Logs filtered by year and active projects
  teams: { id: string; name: string }[];
  selectedYear: number;
}

const GlobalStats = ({ projects, workLogs, teams, selectedYear }: GlobalStatsProps) => {
  const [filteredLogs, setFilteredLogs] = useState<WorkLog[]>([]);
  const [statView, setStatView] = useState<'main' | 'personnel'>('main');
  
  // Filter logs by selected year when component mounts or when selectedYear changes
  useEffect(() => {
    if (!workLogs || !Array.isArray(workLogs)) {
      setFilteredLogs([]);
      return;
    }
    setFilteredLogs(filterWorkLogsByYear(workLogs, selectedYear));
  }, [workLogs, selectedYear]);
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="main" className="w-full mb-4" onValueChange={(value) => setStatView(value as 'main' | 'personnel')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="main" className="flex items-center gap-1.5">
            <BarChart2 className="h-4 w-4" />
            <span>Chantiers</span>
          </TabsTrigger>
          <TabsTrigger value="personnel" className="flex items-center gap-1.5">
            <User className="h-4 w-4" />
            <span>Personnel</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      {statView === 'main' ? (
        <ProjectsOverview 
          projects={projects} 
          filteredLogs={filteredLogs} 
          teams={teams}
        />
      ) : (
        <PersonnelOverview 
          filteredLogs={filteredLogs}
        />
      )}
    </div>
  );
};

export default GlobalStats;

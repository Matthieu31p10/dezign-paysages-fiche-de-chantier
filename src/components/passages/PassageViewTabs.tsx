import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Building2 } from 'lucide-react';
import { PassageList } from './PassageList';
import { ProjectHistoryTable } from './ProjectHistoryTable';
import { WorkLog, ProjectInfo } from '@/types/models';

interface Team {
  id: string;
  name: string;
}

interface PassageViewTabsProps {
  workLogs: WorkLog[];
  projectInfos: ProjectInfo[];
  teams: Team[];
  sortedPassages: WorkLog[];
  selectedProject: string;
  selectedTeam: string;
  getProjectName: (projectId: string) => string;
}

export const PassageViewTabs: React.FC<PassageViewTabsProps> = ({
  workLogs,
  projectInfos,
  teams,
  sortedPassages,
  selectedProject,
  selectedTeam,
  getProjectName
}) => {
  return (
    <Tabs defaultValue="history" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="history" className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          Historique des chantiers
        </TabsTrigger>
        <TabsTrigger value="passages" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Liste des passages
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="history" className="mt-6">
        <ProjectHistoryTable
          workLogs={workLogs}
          projectInfos={projectInfos}
          teams={teams}
          selectedTeam={selectedTeam}
        />
      </TabsContent>
      
      <TabsContent value="passages" className="mt-6">
        <PassageList
          sortedPassages={sortedPassages}
          selectedProject={selectedProject}
          selectedTeam={selectedTeam}
          getProjectName={getProjectName}
        />
      </TabsContent>
    </Tabs>
  );
};
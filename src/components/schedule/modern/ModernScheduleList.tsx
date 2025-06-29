
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import ModernTeamGroup from './ModernTeamGroup';

interface ScheduledEvent {
  id: string;
  projectId: string;
  projectName: string;
  teams: string[];
  date: string;
  passageNumber: number;
  totalPassages: number;
  address: string;
  visitDuration: number;
}

interface TeamGroup {
  teamId: string;
  teamName: string;
  teamColor: string;
  projects: Record<string, ScheduledEvent[]>;
}

interface ModernScheduleListProps {
  selectedYear: number;
  selectedTeams: string[];
  teamGroups: TeamGroup[];
  isLoading: boolean;
}

const ModernScheduleList: React.FC<ModernScheduleListProps> = ({
  selectedYear,
  selectedTeams,
  teamGroups,
  isLoading
}) => {
  if (isLoading) {
    return (
      <CardContent className="p-6">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="space-y-2">
                {Array.from({ length: 2 }).map((_, j) => (
                  <div key={j} className="h-16 bg-gray-100 rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    );
  }

  const filteredTeamGroups = teamGroups.filter(group => 
    selectedTeams.includes('all') || selectedTeams.includes(group.teamId)
  );

  if (filteredTeamGroups.length === 0) {
    return (
      <CardContent className="p-6">
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">Aucun passage programmé</div>
          <div className="text-gray-500 text-sm">
            Aucun passage n'est programmé pour les équipes sélectionnées en {selectedYear}
          </div>
        </div>
      </CardContent>
    );
  }

  return (
    <CardContent className="p-0 h-full">
      <ScrollArea className="h-full">
        <div className="p-6 space-y-6">
          {filteredTeamGroups.map((teamGroup) => (
            <ModernTeamGroup
              key={teamGroup.teamId}
              teamGroup={teamGroup}
            />
          ))}
        </div>
      </ScrollArea>
    </CardContent>
  );
};

export default ModernScheduleList;

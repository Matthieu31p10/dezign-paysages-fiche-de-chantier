
import React from 'react';
import { WorkLog } from '@/types/models';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import TeamBadge from '@/components/ui/team-badge';
import { useApp } from '@/context/AppContext';
import BlankSheetHeader from './BlankSheetHeader';
import BlankSheetContent from './BlankSheetContent';
import BlankSheetStats from './BlankSheetStats';
import BlankSheetActions from './BlankSheetActions';

interface BlankSheetItemProps {
  workLog: WorkLog;
}

const BlankSheetItem: React.FC<BlankSheetItemProps> = ({ workLog }) => {
  const { teams, getProjectById } = useApp();
  
  const linkedProject = workLog.linkedProjectId ? getProjectById(workLog.linkedProjectId) : undefined;
  const team = linkedProject ? teams.find(t => t.id === linkedProject.team) : undefined;
  
  return (
    <Card className="hover:shadow-md transition-shadow duration-200 border-l-4" 
          style={{ borderLeftColor: team?.color || '#6B7280' }}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <BlankSheetHeader workLog={workLog} />
              <div className="flex items-center gap-2">
                {team && <TeamBadge teamName={team.name} teamColor={team.color} />}
                {workLog.invoiced && (
                  <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                    Facturé
                  </Badge>
                )}
                {workLog.isQuoteSigned && (
                  <Badge variant="default" className="bg-blue-100 text-blue-800 text-xs">
                    Devis signé
                  </Badge>
                )}
              </div>
            </div>

            <BlankSheetContent workLog={workLog} linkedProject={linkedProject} />
            <BlankSheetStats workLog={workLog} />
          </div>

          <BlankSheetActions workLog={workLog} />
        </div>
      </CardContent>
    </Card>
  );
};

export default BlankSheetItem;

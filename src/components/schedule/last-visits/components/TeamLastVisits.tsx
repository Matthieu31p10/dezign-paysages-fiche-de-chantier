
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
import { TeamLastVisitsProps } from '../types';
import { useLastVisits } from '../hooks/useLastVisits';
import LastVisitCard from './LastVisitCard';

const TeamLastVisits: React.FC<TeamLastVisitsProps> = ({ teamId, teamName, projects }) => {
  const lastVisits = useLastVisits(teamId, projects);

  if (lastVisits.length === 0) {
    return null;
  }

  const criticalProjects = lastVisits.filter(v => v.daysSinceLastVisit === null || v.daysSinceLastVisit > 30);

  return (
    <Card className="shadow-lg border-0 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-orange-50 via-orange-25 to-white border-b border-orange-100">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Users className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{teamName}</h3>
              <p className="text-sm text-gray-600 font-normal">Suivi des derniers passages</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">
              {lastVisits.length} chantier{lastVisits.length !== 1 ? 's' : ''}
            </Badge>
            {criticalProjects.length > 0 && (
              <Badge variant="destructive">
                {criticalProjects.length} en retard
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid gap-4">
          {lastVisits.map((visitInfo) => (
            <LastVisitCard key={visitInfo.projectId} visitInfo={visitInfo} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamLastVisits;

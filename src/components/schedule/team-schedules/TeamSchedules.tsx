
import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TeamSchedulesProps } from './types';
import { useTeamEvents } from './hooks/useTeamEvents';
import TeamCard from './components/TeamCard';
import EmptyTeamState from './components/EmptyTeamState';

const TeamSchedules: React.FC<TeamSchedulesProps> = ({ 
  month, 
  year, 
  teamId, 
  teams, 
  projects 
}) => {
  const teamsToDisplay = useMemo(() => 
    teamId === 'all' ? teams : teams.filter(t => t.id === teamId)
  , [teamId, teams]);

  const monthName = new Date(year, month - 1).toLocaleString('fr-FR', { month: 'long', year: 'numeric' });
  
  if (teamsToDisplay.length === 0) {
    return (
      <Card className="shadow-lg border-0">
        <CardContent>
          <EmptyTeamState 
            title="Aucune équipe sélectionnée"
            description="Veuillez sélectionner une équipe pour voir les passages programmés."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {teamsToDisplay.map(team => {
        const events = useTeamEvents(projects, team.id, month, year);
        
        return (
          <TeamCard 
            key={team.id} 
            team={team} 
            events={events} 
            monthName={monthName} 
          />
        );
      })}
    </div>
  );
};

export default React.memo(TeamSchedules);

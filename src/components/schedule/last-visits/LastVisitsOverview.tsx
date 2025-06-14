
import React from 'react';
import { useApp } from '@/context/AppContext';
import TeamLastVisits from './components/TeamLastVisits';

interface LastVisitsOverviewProps {
  selectedTeam: string;
}

const LastVisitsOverview: React.FC<LastVisitsOverviewProps> = ({ selectedTeam }) => {
  const { projectInfos, teams } = useApp();

  const teamsToDisplay = selectedTeam === 'all' 
    ? teams 
    : teams.filter(t => t.id === selectedTeam);

  if (teamsToDisplay.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Sélectionnez une équipe pour voir le suivi des derniers passages.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {teamsToDisplay.map(team => (
        <TeamLastVisits
          key={team.id}
          teamId={team.id}
          teamName={team.name}
          projects={projectInfos}
        />
      ))}
    </div>
  );
};

export default LastVisitsOverview;

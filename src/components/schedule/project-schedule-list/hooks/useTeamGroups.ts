
import { useMemo } from 'react';
import { Team } from '@/types/models';

interface ScheduledEvent {
  projectId: string;
  projectName: string;
  team: string;
  date: string;
  passageNumber: number;
  totalPassages: number;
  address: string;
  visitDuration: number;
  isLocked?: boolean;
}

interface TeamGroupData {
  teamId: string;
  teamName: string;
  teamColor: string;
  projects: Record<string, ScheduledEvent[]>;
}

export const useTeamGroups = (scheduledEvents: ScheduledEvent[], teams: Team[]) => {
  return useMemo(() => {
    const teamGroups: Record<string, TeamGroupData> = {};
    
    scheduledEvents.forEach(event => {
      const team = teams.find(t => t.id === event.team);
      const teamName = team ? team.name : 'Équipe inconnue';
      const teamColor = team ? team.color : '#6B7280';
      
      if (!teamGroups[event.team]) {
        teamGroups[event.team] = {
          teamId: event.team,
          teamName,
          teamColor,
          projects: {}
        };
      }
      
      if (!teamGroups[event.team].projects[event.projectId]) {
        teamGroups[event.team].projects[event.projectId] = [];
      }
      
      teamGroups[event.team].projects[event.projectId].push(event);
    });

    // Trier les projets dans chaque équipe par nom
    Object.values(teamGroups).forEach(teamGroup => {
      Object.keys(teamGroup.projects).forEach(projectId => {
        teamGroup.projects[projectId].sort((a, b) => a.date.localeCompare(b.date));
      });
    });

    return Object.values(teamGroups).sort((a, b) => a.teamName.localeCompare(b.teamName));
  }, [scheduledEvents, teams]);
};

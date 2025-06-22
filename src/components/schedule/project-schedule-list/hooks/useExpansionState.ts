
import { useState, useCallback } from 'react';

interface TeamGroupData {
  teamId: string;
  teamName: string;
  teamColor: string;
  projects: Record<string, any[]>;
}

export const useExpansionState = () => {
  const [expandedTeams, setExpandedTeams] = useState<Record<string, boolean>>({});
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});

  const toggleTeamExpansion = useCallback((teamId: string) => {
    setExpandedTeams(prev => ({
      ...prev,
      [teamId]: !prev[teamId]
    }));
  }, []);

  const toggleProjectExpansion = useCallback((projectId: string) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  }, []);

  const toggleAllProjects = useCallback((teamId: string, expand: boolean, groupedByTeam: TeamGroupData[]) => {
    const teamGroup = groupedByTeam.find(g => g.teamId === teamId);
    if (teamGroup) {
      const updates: Record<string, boolean> = {};
      Object.keys(teamGroup.projects).forEach(projectId => {
        updates[projectId] = expand;
      });
      setExpandedProjects(prev => ({ ...prev, ...updates }));
    }
  }, []);

  return {
    expandedTeams,
    expandedProjects,
    toggleTeamExpansion,
    toggleProjectExpansion,
    toggleAllProjects,
  };
};

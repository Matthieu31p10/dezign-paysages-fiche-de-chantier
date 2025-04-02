
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Team } from '@/types/models';
import { TeamsContextType } from './types';
import { toast } from 'sonner';
import { useProjects } from './ProjectsContext';

const TeamsContext = createContext<TeamsContextType | undefined>(undefined);

// Local storage key
const TEAMS_STORAGE_KEY = 'landscaping-teams';

export const TeamsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const { projectInfos } = useProjects();

  // Load data from localStorage on initial render
  useEffect(() => {
    try {
      const storedTeams = localStorage.getItem(TEAMS_STORAGE_KEY);
      
      if (storedTeams) {
        setTeams(JSON.parse(storedTeams));
      } else {
        // Add default team if none exists
        const defaultTeam = { id: crypto.randomUUID(), name: 'Équipe principale' };
        setTeams([defaultTeam]);
        localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify([defaultTeam]));
      }
    } catch (error) {
      console.error('Error loading teams from localStorage:', error);
      toast.error('Erreur lors du chargement des équipes');
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(teams));
  }, [teams]);

  const addTeam = (team: Omit<Team, 'id'>) => {
    const newTeam: Team = {
      ...team,
      id: crypto.randomUUID(),
    };
    setTeams((prev) => [...prev, newTeam]);
    toast.success('Équipe ajoutée');
    return newTeam;
  };

  const updateTeam = (team: Team) => {
    setTeams((prev) =>
      prev.map((t) => (t.id === team.id ? team : t))
    );
    toast.success('Équipe mise à jour');
  };

  const deleteTeam = (id: string) => {
    const teamInUse = projectInfos.some(project => project.team === id);
    if (teamInUse) {
      toast.error('Impossible de supprimer l\'équipe car elle est assignée à un chantier');
      return;
    }
    setTeams((prev) => prev.filter((t) => t.id !== id));
    toast.success('Équipe supprimée');
  };

  return (
    <TeamsContext.Provider
      value={{
        teams,
        addTeam,
        updateTeam,
        deleteTeam,
      }}
    >
      {children}
    </TeamsContext.Provider>
  );
};

export const useTeams = () => {
  const context = useContext(TeamsContext);
  if (context === undefined) {
    throw new Error('useTeams must be used within a TeamsProvider');
  }
  return context;
};

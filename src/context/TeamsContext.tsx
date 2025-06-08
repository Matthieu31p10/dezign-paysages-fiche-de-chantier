
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Team } from '@/types/models';
import { TeamsContextType } from './types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const TeamsContext = createContext<TeamsContextType | undefined>(undefined);

export const TeamsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load teams from Supabase on mount
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('teams')
          .select('*')
          .order('name');

        if (error) throw error;

        const formattedTeams: Team[] = data.map(team => ({
          id: team.id,
          name: team.name
        }));

        setTeams(formattedTeams);
      } catch (error) {
        console.error("Error loading teams:", error);
        toast.error("Erreur lors du chargement des équipes");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTeams();
  }, []);

  const addTeam = async (team: Omit<Team, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .insert([{ name: team.name }])
        .select()
        .single();

      if (error) throw error;

      const newTeam: Team = {
        id: data.id,
        name: data.name
      };

      setTeams((prev) => [...prev, newTeam]);
      toast.success('Équipe ajoutée');
      return newTeam;
    } catch (error) {
      console.error("Error adding team:", error);
      toast.error('Erreur lors de l\'ajout de l\'équipe');
      throw error;
    }
  };

  const updateTeam = async (team: Team) => {
    try {
      const { error } = await supabase
        .from('teams')
        .update({ name: team.name })
        .eq('id', team.id);

      if (error) throw error;

      setTeams((prev) => prev.map((t) => (t.id === team.id ? team : t)));
      toast.success('Équipe mise à jour');
    } catch (error) {
      console.error("Error updating team:", error);
      toast.error('Erreur lors de la mise à jour de l\'équipe');
      throw error;
    }
  };

  const deleteTeam = async (id: string) => {
    try {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTeams((prev) => prev.filter((t) => t.id !== id));
      toast.success('Équipe supprimée');
    } catch (error) {
      console.error("Error deleting team:", error);
      toast.error('Erreur lors de la suppression de l\'équipe');
      throw error;
    }
  };

  return (
    <TeamsContext.Provider value={{ teams, isLoading, addTeam, updateTeam, deleteTeam }}>
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

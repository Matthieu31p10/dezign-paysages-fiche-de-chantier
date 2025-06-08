
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TeamsContextType } from '../types';
import { Team } from '@/types/models';

const TeamsContext = createContext<TeamsContextType | undefined>(undefined);

export const TeamsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const queryClient = useQueryClient();

  // Fetch teams from Supabase
  const { data: teamsData, isLoading } = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  // Update local state when data changes
  useEffect(() => {
    if (teamsData) {
      const formattedTeams = teamsData.map(team => ({
        id: team.id,
        name: team.name,
      }));
      setTeams(formattedTeams);
    }
  }, [teamsData]);

  // Add team mutation
  const addTeamMutation = useMutation({
    mutationFn: async (team: Omit<Team, 'id'>) => {
      const { data, error } = await supabase
        .from('teams')
        .insert([{ name: team.name }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });

  // Update team mutation
  const updateTeamMutation = useMutation({
    mutationFn: async (team: Team) => {
      const { data, error } = await supabase
        .from('teams')
        .update({ name: team.name })
        .eq('id', team.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });

  // Delete team mutation
  const deleteTeamMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });

  const addTeam = (team: Omit<Team, 'id'>) => {
    const newTeam: Team = {
      ...team,
      id: crypto.randomUUID(),
    };
    addTeamMutation.mutate(team);
    return newTeam;
  };

  const updateTeam = (team: Team) => {
    updateTeamMutation.mutate(team);
  };

  const deleteTeam = (id: string) => {
    deleteTeamMutation.mutate(id);
  };

  const value: TeamsContextType = {
    teams,
    addTeam,
    updateTeam,
    deleteTeam,
  };

  return (
    <TeamsContext.Provider value={value}>
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

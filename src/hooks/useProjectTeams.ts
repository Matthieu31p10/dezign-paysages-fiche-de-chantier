
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProjectTeam } from '@/types/models';
import { toast } from 'sonner';

export const useProjectTeams = () => {
  const [projectTeams, setProjectTeams] = useState<ProjectTeam[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProjectTeams = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('project_teams')
        .select('*')
        .order('created_at');

      if (error) throw error;

      const formattedTeams: ProjectTeam[] = data.map(team => ({
        id: team.id,
        projectId: team.project_id,
        teamId: team.team_id,
        isPrimary: team.is_primary || false,
        createdAt: new Date(team.created_at || Date.now())
      }));

      setProjectTeams(formattedTeams);
    } catch (error) {
      console.error('Error fetching project teams:', error);
      toast.error('Erreur lors du chargement des équipes de projets');
    } finally {
      setIsLoading(false);
    }
  };

  const addProjectTeam = async (projectId: string, teamId: string, isPrimary = false) => {
    try {
      const { data, error } = await supabase
        .from('project_teams')
        .insert([{ project_id: projectId, team_id: teamId, is_primary: isPrimary }])
        .select()
        .single();

      if (error) throw error;

      const newProjectTeam: ProjectTeam = {
        id: data.id,
        projectId: data.project_id,
        teamId: data.team_id,
        isPrimary: data.is_primary || false,
        createdAt: new Date(data.created_at)
      };

      setProjectTeams(prev => [...prev, newProjectTeam]);
      toast.success('Équipe ajoutée au projet');
      return newProjectTeam;
    } catch (error) {
      console.error('Error adding project team:', error);
      toast.error('Erreur lors de l\'ajout de l\'équipe au projet');
      throw error;
    }
  };

  const removeProjectTeam = async (projectTeamId: string) => {
    try {
      const { error } = await supabase
        .from('project_teams')
        .delete()
        .eq('id', projectTeamId);

      if (error) throw error;

      setProjectTeams(prev => prev.filter(pt => pt.id !== projectTeamId));
      toast.success('Équipe retirée du projet');
    } catch (error) {
      console.error('Error removing project team:', error);
      toast.error('Erreur lors de la suppression de l\'équipe du projet');
      throw error;
    }
  };

  const updateProjectTeam = async (projectTeamId: string, updates: Partial<ProjectTeam>) => {
    try {
      const { data, error } = await supabase
        .from('project_teams')
        .update({
          is_primary: updates.isPrimary
        })
        .eq('id', projectTeamId)
        .select()
        .single();

      if (error) throw error;

      setProjectTeams(prev => prev.map(pt => 
        pt.id === projectTeamId 
          ? { ...pt, isPrimary: data.is_primary || false }
          : pt
      ));

      toast.success('Équipe mise à jour');
    } catch (error) {
      console.error('Error updating project team:', error);
      toast.error('Erreur lors de la mise à jour de l\'équipe');
      throw error;
    }
  };

  const getTeamsByProject = (projectId: string) => {
    return projectTeams.filter(pt => pt.projectId === projectId);
  };

  const getPrimaryTeam = (projectId: string) => {
    return projectTeams.find(pt => pt.projectId === projectId && pt.isPrimary);
  };

  useEffect(() => {
    fetchProjectTeams();
  }, []);

  return {
    projectTeams,
    isLoading,
    addProjectTeam,
    removeProjectTeam,
    updateProjectTeam,
    getTeamsByProject,
    getPrimaryTeam,
    refreshProjectTeams: fetchProjectTeams
  };
};

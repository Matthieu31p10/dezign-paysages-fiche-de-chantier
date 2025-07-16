import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ProjectPrimaryTeam {
  projectId: string;
  teamId: string;
  teamName: string;
}

export const useProjectPrimaryTeams = () => {
  const [projectPrimaryTeams, setProjectPrimaryTeams] = useState<ProjectPrimaryTeam[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProjectPrimaryTeams = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('project_teams')
          .select(`
            project_id,
            team_id,
            teams (
              name
            )
          `)
          .eq('is_primary', true);

        if (error) throw error;

        const formattedData: ProjectPrimaryTeam[] = data.map(item => ({
          projectId: item.project_id,
          teamId: item.team_id,
          teamName: (item.teams as any)?.name || 'Équipe inconnue'
        }));

        setProjectPrimaryTeams(formattedData);
      } catch (error) {
        console.error('Erreur lors du chargement des équipes principales:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectPrimaryTeams();
  }, []);

  const getPrimaryTeamForProject = (projectId: string): string | null => {
    const primaryTeam = projectPrimaryTeams.find(pt => pt.projectId === projectId);
    return primaryTeam?.teamName || null;
  };

  return {
    projectPrimaryTeams,
    isLoading,
    getPrimaryTeamForProject
  };
};
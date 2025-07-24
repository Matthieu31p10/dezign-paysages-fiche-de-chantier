import { useMemo } from 'react';
import { differenceInDays } from 'date-fns';
import { WorkLog, ProjectInfo, Team } from '@/types/models';
import { filterWorkLogsByTeam } from '@/utils/teamUtils';
import { getProjectName, getActiveProjects } from '@/utils/projectUtils';
import { getRealWorkLogs, sortWorkLogsByDate } from '@/utils/workLogUtils';

interface UseProjectPassageHistoryProps {
  workLogs: WorkLog[];
  projectInfos: ProjectInfo[];
  teams: Team[];
  selectedProject: string;
  selectedTeam: string;
}

export const useProjectPassageHistory = ({
  workLogs,
  projectInfos,
  teams,
  selectedProject,
  selectedTeam
}: UseProjectPassageHistoryProps) => {
  // Filtrer les projets actifs
  const activeProjects = useMemo(() => 
    getActiveProjects(projectInfos), 
    [projectInfos]
  );

  // Utiliser les équipes définies dans les paramètres
  const activeTeams = useMemo(() => 
    teams.filter(team => team.name && team.name.trim() !== ''), 
    [teams]
  );

  // Filtrer les passages selon les sélections projet et équipe
  const filteredPassages = useMemo(() => {
    // Filtrer d'abord pour exclure les blank worksheets
    let realWorkLogs = getRealWorkLogs(workLogs);
    
    // Filtrer par projet sélectionné
    if (selectedProject && selectedProject !== 'all') {
      realWorkLogs = realWorkLogs.filter(log => log.projectId === selectedProject);
    }
    
    // Filtrer par équipe sélectionnée
    realWorkLogs = filterWorkLogsByTeam(realWorkLogs, selectedTeam, teams);
    
    return realWorkLogs;
  }, [workLogs, selectedProject, selectedTeam, teams]);

  // Trier les passages par date (plus récent en premier)
  const sortedPassages = useMemo(() => {
    return sortWorkLogsByDate(filteredPassages);
  }, [filteredPassages]);

  // Calculer les statistiques
  const stats = useMemo(() => {
    if (sortedPassages.length === 0) {
      return {
        lastPassageDate: null,
        daysSinceLastPassage: null,
        totalPassages: 0
      };
    }

    const lastPassage = sortedPassages[0];
    const lastPassageDate = new Date(lastPassage.date);
    const today = new Date();
    const daysSinceLastPassage = differenceInDays(today, lastPassageDate);

    return {
      lastPassageDate,
      daysSinceLastPassage,
      totalPassages: sortedPassages.length
    };
  }, [sortedPassages]);

  const getProjectNameHelper = (projectId: string) => {
    return getProjectName(projectInfos, projectId);
  };

  return {
    activeProjects,
    activeTeams,
    sortedPassages,
    stats,
    getProjectName: getProjectNameHelper
  };
};
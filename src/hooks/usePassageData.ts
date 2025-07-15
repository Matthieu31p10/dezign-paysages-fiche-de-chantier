import { useMemo } from 'react';
import { differenceInDays } from 'date-fns';
import { WorkLog, ProjectInfo } from '@/types/models';

interface Team {
  id: string;
  name: string;
}

interface UsePassageDataProps {
  workLogs: WorkLog[];
  projectInfos: ProjectInfo[];
  teams: Team[];
  selectedProject: string;
  selectedTeam: string;
}

export const usePassageData = ({
  workLogs,
  projectInfos,
  teams,
  selectedProject,
  selectedTeam
}: UsePassageDataProps) => {
  // Filtrer les projets actifs
  const activeProjects = useMemo(() => 
    projectInfos.filter(p => !p.isArchived), 
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
    let realWorkLogs = workLogs.filter(log => !log.isBlankWorksheet);
    
    // Filtrer par projet sélectionné
    if (selectedProject && selectedProject !== 'all') {
      realWorkLogs = realWorkLogs.filter(log => log.projectId === selectedProject);
    }
    
    // Filtrer par équipe sélectionnée
    if (selectedTeam && selectedTeam !== 'all') {
      realWorkLogs = realWorkLogs.filter(log => {
        // Chercher dans le personnel ou dans les équipes assignées au projet
        const matchPersonnel = log.personnel && log.personnel.some(person => 
          person.toLowerCase().includes(selectedTeam.toLowerCase())
        );
        
        // Chercher aussi dans les équipes assignées au projet
        const matchTeam = teams.some(team => 
          team.name.toLowerCase() === selectedTeam.toLowerCase() &&
          log.personnel && log.personnel.some(person => 
            person.toLowerCase().includes(team.name.toLowerCase())
          )
        );
        
        return matchPersonnel || matchTeam;
      });
    }
    
    return realWorkLogs;
  }, [workLogs, selectedProject, selectedTeam, teams]);

  // Trier les passages par date (plus récent en premier)
  const sortedPassages = useMemo(() => {
    return [...filteredPassages].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
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

  const getProjectName = (projectId: string) => {
    const project = projectInfos.find(p => p.id === projectId);
    return project?.name || 'Projet inconnu';
  };

  return {
    activeProjects,
    activeTeams,
    sortedPassages,
    stats,
    getProjectName
  };
};
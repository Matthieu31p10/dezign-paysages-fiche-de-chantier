
import { useMemo } from 'react';
import { useWorkLogs } from '@/context/WorkLogsContext/WorkLogsContext';
import { LastVisitInfo } from '../types';

export const useLastVisits = (teamId: string, projects: any[]) => {
  const { getLastVisitDate } = useWorkLogs();

  return useMemo(() => {
    const teamProjects = teamId === 'all' 
      ? projects.filter(p => !p.isArchived)
      : projects.filter(p => p.team === teamId && !p.isArchived);

    const lastVisits: LastVisitInfo[] = teamProjects.map(project => {
      const lastVisitDate = getLastVisitDate(project.id);
      const daysSinceLastVisit = lastVisitDate 
        ? Math.floor((new Date().getTime() - lastVisitDate.getTime()) / (1000 * 60 * 60 * 24))
        : null;

      return {
        projectId: project.id,
        projectName: project.name,
        lastVisitDate,
        daysSinceLastVisit,
        address: project.address
      };
    });

    // Trier par nombre de jours depuis le dernier passage (décroissant)
    return lastVisits.sort((a, b) => {
      if (a.daysSinceLastVisit === null && b.daysSinceLastVisit === null) return 0;
      if (a.daysSinceLastVisit === null) return 1;
      if (b.daysSinceLastVisit === null) return -1;
      return b.daysSinceLastVisit - a.daysSinceLastVisit;
    });
  }, [teamId, projects, getLastVisitDate]);
};

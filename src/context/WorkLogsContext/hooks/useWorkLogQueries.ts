
import { WorkLog } from '@/types/models';

export const useWorkLogQueries = (workLogs: WorkLog[]) => {
  const getWorkLogById = (id: string) => {
    return workLogs.find((log) => log.id === id);
  };

  const getWorkLogsByProjectId = (projectId: string) => {
    return workLogs.filter((log) => log.projectId === projectId);
  };

  const getTotalDuration = (projectId: string) => {
    const projectWorkLogs = getWorkLogsByProjectId(projectId);
    return projectWorkLogs.reduce((total, log) => {
      return total + (log.timeTracking?.totalHours || 0);
    }, 0);
  };

  const getTotalVisits = (projectId: string) => {
    return getWorkLogsByProjectId(projectId).length;
  };

  const getLastVisitDate = (projectId: string) => {
    const projectWorkLogs = getWorkLogsByProjectId(projectId);
    if (projectWorkLogs.length === 0) return null;
    
    const sortedLogs = projectWorkLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return new Date(sortedLogs[0].date);
  };

  return {
    getWorkLogById,
    getWorkLogsByProjectId,
    getTotalDuration,
    getTotalVisits,
    getLastVisitDate
  };
};

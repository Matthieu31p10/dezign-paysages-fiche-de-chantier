
import { ProjectDayLock } from '../types';

export const useProjectLocksQueries = (projectLocks: ProjectDayLock[]) => {
  const getLocksForProject = (projectId: string) => {
    return projectLocks.filter(lock => lock.projectId === projectId && lock.isActive);
  };

  const isProjectLockedOnDay = (projectId: string, dayOfWeek: number) => {
    return projectLocks.some(
      lock => lock.projectId === projectId && 
               lock.dayOfWeek === dayOfWeek && 
               lock.isActive
    );
  };

  return {
    getLocksForProject,
    isProjectLockedOnDay,
  };
};

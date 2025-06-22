
import { useMemo } from 'react';
import { ProjectDayLock } from '../types';

export const useProjectLocksQueries = (projectLocks: ProjectDayLock[]) => {
  const isProjectLockedOnDay = useMemo(() => {
    return (projectId: string, dayOfWeek: number): boolean => {
      const lock = projectLocks.find(
        l => l.projectId === projectId && 
            l.dayOfWeek === dayOfWeek && 
            l.isActive
      );
      return !!lock;
    };
  }, [projectLocks]);

  const getProjectLockDetails = useMemo(() => {
    return (projectId: string, dayOfWeek: number): { minDaysBetweenVisits?: number } | null => {
      const lock = projectLocks.find(
        l => l.projectId === projectId && 
            l.dayOfWeek === dayOfWeek && 
            l.isActive
      );
      
      if (!lock) return null;
      
      return {
        minDaysBetweenVisits: lock.minDaysBetweenVisits
      };
    };
  }, [projectLocks]);

  const getLocksForProject = useMemo(() => {
    return (projectId: string): ProjectDayLock[] => {
      return projectLocks.filter(l => l.projectId === projectId && l.isActive);
    };
  }, [projectLocks]);

  const getLocksForDay = useMemo(() => {
    return (dayOfWeek: number): ProjectDayLock[] => {
      return projectLocks.filter(l => l.dayOfWeek === dayOfWeek && l.isActive);
    };
  }, [projectLocks]);

  return {
    isProjectLockedOnDay,
    getProjectLockDetails,
    getLocksForProject,
    getLocksForDay,
  };
};

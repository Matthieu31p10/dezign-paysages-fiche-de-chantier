
import { useMemo } from 'react';
import { ProjectDayLock } from '../types';
import { isProjectLockedOnDay, getProjectLockDetails } from '@/utils/scheduleUtils';

export const useProjectLocksQueries = (projectLocks: ProjectDayLock[]) => {
  const isProjectLockedOnDayCallback = useMemo(() => {
    return (projectId: string, dayOfWeek: number): boolean => {
      return isProjectLockedOnDay(projectLocks, projectId, dayOfWeek);
    };
  }, [projectLocks]);

  const getProjectLockDetailsCallback = useMemo(() => {
    return (projectId: string, dayOfWeek: number): { minDaysBetweenVisits?: number } | null => {
      return getProjectLockDetails(projectLocks, projectId, dayOfWeek);
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
    isProjectLockedOnDay: isProjectLockedOnDayCallback,
    getProjectLockDetails: getProjectLockDetailsCallback,
    getLocksForProject,
    getLocksForDay,
  };
};

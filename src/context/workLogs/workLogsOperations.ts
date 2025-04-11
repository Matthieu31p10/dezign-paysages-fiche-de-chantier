
import { WorkLog } from '@/types/models';

/**
 * Get all workLogs for a specific project
 */
export const getWorkLogsByProjectId = (workLogs: WorkLog[], projectId: string): WorkLog[] => {
  return workLogs.filter((workLog) => workLog.projectId === projectId);
};

/**
 * Get a workLog by its ID
 */
export const getWorkLogById = (workLogs: WorkLog[], id: string): WorkLog | undefined => {
  return workLogs.find((workLog) => workLog.id === id);
};

/**
 * Calculate the total duration for a project's workLogs
 */
export const getTotalDuration = (workLogs: WorkLog[], projectId: string): number => {
  return getWorkLogsByProjectId(workLogs, projectId).reduce((total, log) => total + (log.duration || 0), 0);
};

/**
 * Count the total number of visits for a project
 */
export const getTotalVisits = (workLogs: WorkLog[], projectId: string): number => {
  return getWorkLogsByProjectId(workLogs, projectId).length;
};

/**
 * Get the date of the last visit for a project
 */
export const getLastVisitDate = (workLogs: WorkLog[], projectId: string): Date | null => {
  const logs = getWorkLogsByProjectId(workLogs, projectId);
  if (logs.length === 0) return null;
  
  return new Date(
    Math.max(...logs.map(log => new Date(log.date).getTime()))
  );
};

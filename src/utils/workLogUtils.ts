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
 * Calculate the total duration for a project's workLogs using duration field
 */
export const getTotalDuration = (workLogs: WorkLog[], projectId: string): number => {
  return getWorkLogsByProjectId(workLogs, projectId).reduce((total, log) => total + (log.duration || 0), 0);
};

/**
 * Calculate the total hours for a project's workLogs using timeTracking
 */
export const getTotalHours = (workLogs: WorkLog[], projectId: string): number => {
  return getWorkLogsByProjectId(workLogs, projectId).reduce((total, log) => {
    return total + (log.timeTracking?.totalHours || 0);
  }, 0);
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
  
  const sortedLogs = logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return new Date(sortedLogs[0].date);
};

/**
 * Filter work logs to exclude blank worksheets
 */
export const getRealWorkLogs = (workLogs: WorkLog[]): WorkLog[] => {
  return workLogs.filter(log => !log.isBlankWorksheet);
};

/**
 * Sort work logs by date (most recent first)
 */
export const sortWorkLogsByDate = (workLogs: WorkLog[]): WorkLog[] => {
  return [...workLogs].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });
};
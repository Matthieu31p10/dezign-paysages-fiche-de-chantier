
import { WorkLog, ProjectInfo } from '@/types/models';
import { filterWorkLogsByYear } from './date-helpers';

// Calculate total hours for a specific year
export const calculateTotalHoursForYear = (workLogs: WorkLog[], year: number): number => {
  const logsForYear = filterWorkLogsByYear(workLogs, year);
  
  return logsForYear.reduce((total, log) => {
    const hours = log.timeTracking?.totalHours || 0;
    return total + (typeof hours === 'string' ? parseFloat(hours) : hours);
  }, 0);
};

// Calculate completion percentage for a project
export const calculateProjectCompletion = (
  project: ProjectInfo, 
  workLogs: WorkLog[], 
  year?: number
): number => {
  if (!project || !workLogs || workLogs.length === 0) return 0;
  
  // Filter logs for this project
  let projectLogs = workLogs.filter(log => log.projectId === project.id);
  
  // Further filter by year if specified
  if (year) {
    projectLogs = filterWorkLogsByYear(projectLogs, year);
  }
  
  // Calculate total hours
  const totalHours = projectLogs.reduce((sum, log) => {
    const hours = log.timeTracking?.totalHours || 0;
    return sum + (typeof hours === 'string' ? parseFloat(hours) : hours);
  }, 0);
  
  // Calculate percentage based on annual total hours
  const targetHours = project.annualTotalHours || 0;
  if (targetHours === 0) return 0;
  
  return Math.min(100, Math.round((totalHours / targetHours) * 100));
};

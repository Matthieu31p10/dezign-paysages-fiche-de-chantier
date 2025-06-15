
import { WorkLog, ProjectInfo } from '@/types/models';
import { filterWorkLogsByYear } from './date-helpers';

// Calculate total team hours for a specific year
export const calculateTotalHoursForYear = (workLogs: WorkLog[], year: number): number => {
  const logsForYear = filterWorkLogsByYear(workLogs, year);
  
  return logsForYear.reduce((total, log) => {
    const individualHours = log.timeTracking?.totalHours || 0;
    const personnelCount = log.personnel?.length || 1;
    // Calculer le temps total équipe (heures individuelles * nombre de personnel)
    return total + (individualHours * personnelCount);
  }, 0);
};

// Calculate completion percentage for a project based on team hours
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
  
  // Calculate total team hours
  const totalTeamHours = projectLogs.reduce((sum, log) => {
    const individualHours = log.timeTracking?.totalHours || 0;
    const personnelCount = log.personnel?.length || 1;
    return sum + (individualHours * personnelCount);
  }, 0);
  
  // Calculate percentage based on annual total hours
  const targetHours = project.annualTotalHours || 0;
  if (targetHours === 0) return 0;
  
  return Math.min(100, Math.round((totalTeamHours / targetHours) * 100));
};


import { WorkLog } from '@/types/models';

// Calculate average hours per visit
export const calculateAverageHoursPerVisit = (workLogs: WorkLog[]): number => {
  if (workLogs.length === 0) return 0;
  
  const totalHours = workLogs.reduce((sum, log) => sum + log.timeTracking.totalHours, 0);
  return Math.round((totalHours / workLogs.length) * 100) / 100;
};

// Get years from work logs
export const getYearsFromWorkLogs = (workLogs: WorkLog[]): number[] => {
  if (!workLogs.length) return [new Date().getFullYear()];
  
  const years = new Set<number>();
  
  workLogs.forEach(log => {
    const date = new Date(log.date);
    years.add(date.getFullYear());
  });
  
  // Add current year if not in the set
  years.add(new Date().getFullYear());
  
  return Array.from(years).sort((a, b) => b - a); // Sort in descending order
};

// Filter work logs by year
export const filterWorkLogsByYear = (workLogs: WorkLog[], year: number): WorkLog[] => {
  return workLogs.filter(log => {
    const date = new Date(log.date);
    return date.getFullYear() === year;
  });
};

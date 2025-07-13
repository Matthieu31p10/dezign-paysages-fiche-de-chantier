// Date utility functions

import { format, addMonths, subMonths, differenceInDays, parse } from 'date-fns';
import { fr } from 'date-fns/locale';
import { WorkLog } from '@/types/models';

// Current year and month helpers
export const getCurrentYear = (): number => {
  return new Date().getFullYear();
};

export const getCurrentMonth = (): number => {
  return new Date().getMonth() + 1; // getMonth() returns 0-11, so +1 for 1-12
};

// Month name helper
export const getMonthName = (monthIndex: number): string => {
  const date = new Date();
  date.setMonth(monthIndex - 1); // monthIndex is 1-12, setMonth expects 0-11
  return date.toLocaleString('fr-FR', { month: 'long' });
};

// Get last N months
export const getLastNMonths = (n: number): { month: number; year: number }[] => {
  const result = [];
  const now = new Date();
  
  for (let i = 0; i < n; i++) {
    const date = subMonths(now, i);
    result.push({
      month: date.getMonth() + 1,
      year: date.getFullYear()
    });
  }
  
  return result;
};

// Calculate days between dates
export const getDaysBetweenDates = (startDate: Date, endDate: Date): number => {
  return differenceInDays(endDate, startDate);
};

// Calculate days since last entry
export const getDaysSinceLastEntry = (workLogs: WorkLog[]): number | null => {
  if (!workLogs.length) return null;
  
  // Get dates from all work logs
  const dates = workLogs.map(log => new Date(log.date));
  
  // Find most recent date
  const mostRecent = new Date(Math.max(...dates.map(date => date.getTime())));
  
  // Calculate days since that date
  const today = new Date();
  const timeDiff = today.getTime() - mostRecent.getTime();
  const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
  
  return dayDiff;
};

// Calculate average hours per visit for a project using team hours
export const calculateAverageHoursPerVisit = (workLogs: WorkLog[]): number => {
  if (workLogs.length === 0) return 0;
  
  // Calculate total team hours instead of individual hours
  const totalTeamHours = workLogs.reduce((sum, log) => {
    const individualHours = log.timeTracking?.totalHours || 0;
    const personnelCount = log.personnel?.length || 1;
    return sum + (individualHours * personnelCount);
  }, 0);
  
  return Math.round((totalTeamHours / workLogs.length) * 100) / 100;
};

// Group work logs by month
export const groupWorkLogsByMonth = (workLogs: WorkLog[]): Record<string, WorkLog[]> => {
  const grouped: Record<string, WorkLog[]> = {};
  
  workLogs.forEach(log => {
    if (!log.date) return;
    
    const date = new Date(log.date);
    const monthName = date.toLocaleString('fr-FR', { month: 'long' });
    const year = date.getFullYear();
    const key = `${monthName} ${year}`;
    
    if (!grouped[key]) {
      grouped[key] = [];
    }
    
    grouped[key].push(log);
  });
  
  return grouped;
};

// Filter work logs by year
export const filterWorkLogsByYear = (workLogs: WorkLog[], year: number): WorkLog[] => {
  return workLogs.filter(log => {
    if (!log.date) return false;
    return new Date(log.date).getFullYear() === year;
  });
};

// Get years from work logs
export const getYearsFromWorkLogs = (workLogs: WorkLog[]): number[] => {
  const years = new Set<number>();
  
  workLogs.forEach(log => {
    if (log.date) {
      const year = new Date(log.date).getFullYear();
      years.add(year);
    }
  });
  
  return Array.from(years).sort((a, b) => b - a); // Sort descending
};

// Parse time string to hours and minutes
export const parseTimeString = (timeString: string): { hours: number; minutes: number } => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return { hours, minutes };
};

// Calculate hours between two time strings
export const calculateHoursBetween = (
  startTime: string, 
  endTime: string, 
  breakTimeInMinutes: number = 0
): number => {
  const start = parseTimeString(startTime);
  const end = parseTimeString(endTime);
  
  const startInMinutes = start.hours * 60 + start.minutes;
  const endInMinutes = end.hours * 60 + end.minutes;
  
  // Adjust if end time is on the next day
  const adjustedEndInMinutes = endInMinutes < startInMinutes
    ? endInMinutes + 24 * 60
    : endInMinutes;
  
  const totalMinutes = adjustedEndInMinutes - startInMinutes - breakTimeInMinutes;
  
  return totalMinutes / 60;
};

// Re-export the extractRegistrationTime function from notes-extraction
export { extractRegistrationTime } from './notes-extraction';

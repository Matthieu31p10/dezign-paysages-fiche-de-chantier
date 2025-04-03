
import { WorkLog } from '@/types/models';

export const getCurrentYear = (): number => {
  return new Date().getFullYear();
};

export const getCurrentMonth = (): number => {
  return new Date().getMonth() + 1; // getMonth() retourne 0-11, donc +1 pour avoir 1-12
};

export const formatDate = (date: Date): string => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateTime = (date: Date): string => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatTime = (time: string): string => {
  if (!time) return '';
  return time;
};

// Group work logs by month
export const groupWorkLogsByMonth = (workLogs: WorkLog[]): Record<string, WorkLog[]> => {
  const grouped: Record<string, WorkLog[]> = {};
  
  workLogs.forEach(log => {
    const date = new Date(log.date);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const key = `${month}-${year}`;
    
    if (!grouped[key]) {
      grouped[key] = [];
    }
    
    grouped[key].push(log);
  });
  
  return grouped;
};

// Format month and year
export const formatMonthYear = (monthYear: string): string => {
  const [month, year] = monthYear.split('-').map(Number);
  
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric'
  });
};

// Days since last entry
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


import { WorkLog } from '@/types/models';

// Helper function to ensure we're working with actual Date objects
const ensureDate = (date: string | Date): Date => {
  if (typeof date === 'string') {
    return new Date(date);
  }
  return date;
};

export const getCurrentYear = (): number => {
  return new Date().getFullYear();
};

export const getCurrentMonth = (): number => {
  return new Date().getMonth() + 1; // getMonth() retourne 0-11, donc +1 pour avoir 1-12
};

export const formatDate = (date: string | Date): string => {
  if (!date) return '';
  return ensureDate(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateTime = (date: string | Date): string => {
  if (!date) return '';
  return ensureDate(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatTime = (date: Date | string): string => {
  if (!date) return '';
  
  // If date is a string that appears to be just a time (contains : but not / or -), return it directly
  if (typeof date === 'string' && date.includes(':') && !date.includes('/') && !date.includes('-')) {
    return date;
  }
  
  // If date is a Date object or date string, format it to HH:MM
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  } catch (error) {
    console.error('Error formatting time:', error);
    return '';
  }
};

// Group work logs by month
export const groupWorkLogsByMonth = (workLogs: WorkLog[]): Record<string, WorkLog[]> => {
  const grouped: Record<string, WorkLog[]> = {};
  
  workLogs.forEach(log => {
    const date = ensureDate(log.date);
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
  const dates = workLogs.map(log => ensureDate(log.date));
  
  // Find most recent date
  const mostRecent = new Date(Math.max(...dates.map(date => date.getTime())));
  
  // Calculate days since that date
  const today = new Date();
  const timeDiff = today.getTime() - mostRecent.getTime();
  const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
  
  return dayDiff;
};

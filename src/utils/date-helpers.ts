
import { WorkLog } from '@/types/models';
import { format, formatDistanceToNow, isThisYear, getMonth, getYear } from 'date-fns';
import { fr } from 'date-fns/locale';

// Format date
export const formatDate = (date: Date | string): string => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'dd/MM/yyyy', { locale: fr });
};

// Get current month
export const getCurrentMonth = (): number => {
  return getMonth(new Date()) + 1; // January is 0
};

// Get current year
export const getCurrentYear = (): number => {
  return getYear(new Date());
};

// Days since last entry
export const getDaysSinceLastEntry = (lastEntryDate: string): string => {
  if (!lastEntryDate) return 'Aucune entrée';
  const date = new Date(lastEntryDate);
  return formatDistanceToNow(date, { addSuffix: true, locale: fr });
};

// Calculate average hours per visit
export const calculateAverageHoursPerVisit = (workLogs: WorkLog[], precision: number = 1): number => {
  if (!workLogs || workLogs.length === 0) return 0;
  
  const totalHours = workLogs.reduce((sum, log) => {
    const hours = log.timeTracking?.totalHours || 0;
    return sum + (typeof hours === 'string' ? parseFloat(hours) : hours);
  }, 0);
  
  return Number((totalHours / workLogs.length).toFixed(precision));
};

// Filter work logs by year
export const filterWorkLogsByYear = (workLogs: WorkLog[], year: number): WorkLog[] => {
  return workLogs.filter(log => {
    const date = new Date(log.date);
    return getYear(date) === year;
  });
};

// Group work logs by month
export const groupWorkLogsByMonth = (workLogs: WorkLog[]): Record<string, WorkLog[]> => {
  const grouped: Record<string, WorkLog[]> = {};
  
  workLogs.forEach(log => {
    const date = new Date(log.date);
    const monthYear = format(date, 'MMMM yyyy', { locale: fr });
    
    if (!grouped[monthYear]) {
      grouped[monthYear] = [];
    }
    
    grouped[monthYear].push(log);
  });
  
  return grouped;
};

// Get years from work logs
export const getYearsFromWorkLogs = (workLogs: WorkLog[]): number[] => {
  const years = new Set<number>();
  
  workLogs.forEach(log => {
    const date = new Date(log.date);
    years.add(getYear(date));
  });
  
  return Array.from(years).sort((a, b) => b - a); // Sort descending
};

// Extract registration time from notes
export const extractRegistrationTime = (notes: string): string | null => {
  const match = notes.match(/HEURE D'ENREGISTREMENT:\s*(.+)/);
  return match ? match[1].trim() : null;
};

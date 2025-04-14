
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
export const getDaysSinceLastEntry = (workLogs: WorkLog[]): number | null => {
  if (!workLogs || workLogs.length === 0) return null;
  
  // Trouver la date la plus récente
  const lastEntryDate = workLogs
    .map(log => new Date(log.date))
    .sort((a, b) => b.getTime() - a.getTime())[0];
  
  // Calculer la différence en jours
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - lastEntryDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

// Calculer la durée entre deux heures (ex: "08:00" et "12:00") en heures
export const calculateHoursBetween = (startTime: string, endTime: string): number => {
  if (!startTime || !endTime) return 0;
  
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  
  const start = startHours + startMinutes / 60;
  const end = endHours + endMinutes / 60;
  
  return end - start;
};

// Parser une chaîne d'heure (ex: "08:00") en objet Date
export const parseTimeString = (timeString: string): Date | null => {
  if (!timeString) return null;
  
  const [hours, minutes] = timeString.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) return null;
  
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  
  return date;
};

// Calculer la moyenne d'heures par visite
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

// Get month name
export const getMonthName = (month: number): string => {
  const date = new Date();
  date.setMonth(month - 1);
  return format(date, 'MMMM', { locale: fr });
};

// Get last N months
export const getLastNMonths = (n: number): { month: number; year: number }[] => {
  const result = [];
  const now = new Date();
  
  for (let i = 0; i < n; i++) {
    const date = new Date();
    date.setMonth(now.getMonth() - i);
    result.push({
      month: date.getMonth() + 1,
      year: date.getFullYear()
    });
  }
  
  return result;
};

// Get days between dates
export const getDaysBetweenDates = (startDate: Date, endDate: Date): number => {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

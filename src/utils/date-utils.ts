
import { format, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { WorkLog } from '@/types/models';

// Helper function to ensure we're working with actual Date objects
export const ensureDate = (date: string | Date): Date => {
  if (typeof date === 'string') {
    return new Date(date);
  }
  return date;
};

export const formatDate = (date: string | Date): string => {
  if (!date) return '';
  return format(ensureDate(date), 'dd/MM/yyyy', { locale: fr });
};

export const formatDateTime = (date: string | Date): string => {
  if (!date) return '';
  return format(ensureDate(date), 'dd/MM/yyyy HH:mm', { locale: fr });
};

export const formatTime = (date: Date | string): string => {
  if (!date) return '';
  
  // If date is a string representing a time, return it directly
  if (typeof date === 'string' && (date.includes(':') && !date.includes('-') && !date.includes('/'))) {
    return date;
  }
  
  // If date is a Date object or date string, format it to HH:MM
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'HH:mm', { locale: fr });
  } catch (error) {
    console.error('Error formatting time:', error);
    return '';
  }
};

export const isToday = (date: string | Date): boolean => {
  return isSameDay(ensureDate(date), new Date());
};

export const getCurrentYear = (): number => {
  return new Date().getFullYear();
};

export const getCurrentMonth = (): number => {
  return new Date().getMonth();
};

export const formatMonthYear = (month: string): string => {
  const [year, monthNum] = month.split('-');
  const date = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
  return format(date, 'MMMM yyyy', { locale: fr });
};

export const getDaysSinceLastEntry = (workLogs: WorkLog[]): number => {
  if (workLogs.length === 0) return 0;
  
  const sortedLogs = [...workLogs].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const lastDate = new Date(sortedLogs[0].date);
  const today = new Date();
  
  // Différence en millisecondes
  const diffTime = today.getTime() - lastDate.getTime();
  
  // Convertir en jours
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

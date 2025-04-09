
// Most date utility functions are now centralized in helpers.ts
// This file remains for backward compatibility

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

export const formatDateTime = (date: string | Date): string => {
  if (!date) return '';
  return format(ensureDate(date), 'dd/MM/yyyy HH:mm', { locale: fr });
};

export const isToday = (date: string | Date): boolean => {
  return isSameDay(ensureDate(date), new Date());
};

// Re-export common functions from helpers to maintain backward compatibility
export {
  formatDate,
  formatTime,
  getCurrentMonth,
  getCurrentYear,
  formatMonthYear,
  getDaysSinceLastEntry,
  groupWorkLogsByMonth
} from './helpers';

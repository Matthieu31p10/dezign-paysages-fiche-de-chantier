
import { getCurrentYear, getCurrentMonth, getMonthName } from './date-helpers';
import { formatMonthYear } from './format-utils';

// Re-export functions from date-helpers
export {
  getCurrentYear,
  getCurrentMonth,
  getMonthName
};

// Format a date to string (handles both string and Date inputs)
export const formatDate = (date: string | Date): string => {
  if (!date) return '';
  
  // If it's already a string, use it directly
  if (typeof date === 'string') {
    return new Date(date).toLocaleDateString('fr-FR');
  }
  
  // If it's a Date object, format directly
  return date.toLocaleDateString('fr-FR');
};

// Create a wrapper for formatTime
export const formatTime = (time: string): string => {
  return time;
};

// Format a date range (handling Date objects)
export const formatDateRange = (startDate: Date, endDate: Date): string => {
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

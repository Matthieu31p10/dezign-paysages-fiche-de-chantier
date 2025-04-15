
import { getCurrentYear, getCurrentMonth, getMonthName } from './date-helpers';
import { formatDate as formatDateUtil, formatTime as formatTimeUtil } from './format-utils';

// Re-export functions from date-helpers and format-utils
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
    return formatDateUtil(date);
  }
  
  // If it's a Date object, convert to ISO string first
  return formatDateUtil(date.toISOString());
};

// Create a wrapper for formatTime to avoid naming conflicts
export const formatTime = (time: string): string => {
  return formatTimeUtil(time);
};

// Format a date range (handling Date objects)
export const formatDateRange = (startDate: Date, endDate: Date): string => {
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

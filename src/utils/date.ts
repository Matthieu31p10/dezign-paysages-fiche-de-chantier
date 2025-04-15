
import { getCurrentYear, getCurrentMonth, getMonthName } from './date-helpers';
import { formatDate, formatTime as formatTimeUtil } from './format-utils';

// Re-export some functions from date-helpers and format-utils
export {
  getCurrentYear,
  getCurrentMonth,
  getMonthName,
  formatDate
};

// Create a wrapper for formatTime to avoid naming conflicts
export const formatTime = (time: string): string => {
  return formatTimeUtil(time);
};

// Format a date range
export const formatDateRange = (startDate: Date, endDate: Date): string => {
  return `${formatDate(startDate.toISOString())} - ${formatDate(endDate.toISOString())}`;
};

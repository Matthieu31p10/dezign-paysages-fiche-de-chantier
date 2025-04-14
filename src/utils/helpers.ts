
// Export essentials from other utility files
export { formatDate, formatPrice, formatNumber, formatPercentage } from './format-utils';
export { 
  getCurrentYear, 
  getMonthName, 
  getLastNMonths,
  getDaysBetweenDates,
} from './date-utils';

// Re-export from date-helpers without the duplicate
export { 
  filterWorkLogsByYear,
  parseTimeString,
  calculateHoursBetween,
  // Note: We're excluding extractRegistrationTime which was causing the error
} from './date-helpers';

// Original helper functions
export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

export const generateInitials = (name: string): string => {
  if (!name) return '';
  return name
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
};

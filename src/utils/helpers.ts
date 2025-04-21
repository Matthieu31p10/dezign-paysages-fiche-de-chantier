
// Export essentials from other utility files
export { 
  formatDate, 
  formatCurrency as formatPrice, 
  formatNumber, 
  formatPercent as formatPercentage, 
  formatTime,
  formatMonthYear 
} from './format-utils';

export { 
  getCurrentYear, 
  getCurrentMonth,
  getMonthName, 
  getLastNMonths,
  getDaysBetweenDates,
  getDaysSinceLastEntry,
  calculateAverageHoursPerVisit,
  filterWorkLogsByYear,
  groupWorkLogsByMonth,
  getYearsFromWorkLogs,
  parseTimeString,
  calculateHoursBetween
} from './date-helpers';

// Export from notes-extraction
export {
  extractClientName,
  extractAddress,
  extractDescription,
  extractLinkedProjectId,
  extractRegistrationTime,
  extractHourlyRate,
  extractQuoteValue,
  extractSignedQuote,
  extractVatRate
} from './notes-extraction';

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

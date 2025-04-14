
// This file now acts as a central re-export file for all helper utilities
// to maintain backward compatibility

// Re-export all date helper functions
export * from './date-helpers';

// Re-export notes extraction functions
export * from './notes-extraction';

// Re-export format utility functions
export * from './format-utils';

// Re-export statistics utility functions
export * from './stats-utils';

// Re-export notes utils but avoid name conflicts
import { extractRegistrationTime as extractRegTime } from './notes-utils';
export { 
  extractClientName,
  extractAddress,
  extractContactPhone,
  extractContactEmail,
  extractDescription,
  extractHourlyRate,
  extractVatRate,
  extractSignedQuote,
  extractQuoteValue,
  extractLinkedProjectId,
  extractRegTime as extractRegistrationTimeFromNotes
} from './notes-utils';

// Function to get days since last entry from work logs
export const getDaysSinceLastEntry = (workLogs: any[]): number | null => {
  if (!workLogs || workLogs.length === 0) return null;
  
  // Find the most recent date
  const dates = workLogs.map(log => new Date(log.date));
  const mostRecentDate = new Date(Math.max(...dates.map(date => date.getTime())));
  
  // Calculate days difference
  const today = new Date();
  const diffTime = today.getTime() - mostRecentDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

// Utility function to calculate average hours per visit
export const calculateAverageHoursPerVisit = (workLogs: any[]): number => {
  if (!workLogs || workLogs.length === 0) return 0;
  
  const totalHours = workLogs.reduce((sum, log) => {
    const hours = log.timeTracking?.totalHours || 0;
    return sum + (typeof hours === 'string' ? parseFloat(hours) : hours);
  }, 0);
  
  return totalHours / workLogs.length;
};

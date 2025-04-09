
// Main entry point that re-exports all the utility functions

// Export helpers directly but exclude functions that would cause conflicts
export {
  // Date formatting functions
  getCurrentYear,
  getCurrentMonth,
  formatDate,
  formatDateWithDay,
  formatTime,
  formatMonthYear,
  
  // Number formatting
  formatNumber,
  
  // Notes extraction (these don't conflict with anything else)
  extractClientName,
  extractAddress,
  extractContactPhone,
  extractContactEmail,
  extractDescription,
  extractLinkedProjectId,
  extractHourlyRate,
  extractVatRate,
  extractSignedQuote,
  extractQuoteValue,
  extractRegistrationTime,
  
  // Statistics calculations
  calculateWaterConsumption
} from './helpers';

// Export specific utilities that don't overlap with helpers
export * from './projects';
export * from './time';

// Re-export with namespace to avoid ambiguity
import * as worklogUtils from './worklog-utils';
import * as statisticsUtils from './statistics';

export { worklogUtils, statisticsUtils };

// Export getDaysSinceLastEntry explicitly since it's used in many places
export { getDaysSinceLastEntry } from './helpers';


// Main entry point that re-exports all the utility functions for backward compatibility

// Date and time formatting
export * from './date-utils';

// Time calculations and worklog utilities
export * from './worklog-utils';

// Number formatting
export * from './format-utils';

// Notes parsing utilities
export * from './notes-utils';

// Project-related utilities
export * from './projects';

// Statistics and analysis (re-export them with explicit names to avoid conflicts)
import {
  calculateAverageHoursPerVisit as statsCalculateAverageHoursPerVisit,
  calculateTimeDeviation,
  filterWorkLogsByYear as statsFilterWorkLogsByYear,
  getYearsFromWorkLogs as statsGetYearsFromWorkLogs,
  calculateWaterConsumptionStats,
  calculateTaskStatistics
} from './statistics';

export {
  statsCalculateAverageHoursPerVisit,
  calculateTimeDeviation,
  statsFilterWorkLogsByYear,
  statsGetYearsFromWorkLogs,
  calculateWaterConsumptionStats,
  calculateTaskStatistics
};

// Re-export types properly with the 'export type' syntax
export type { TimeDeviation, WaterConsumptionStats, TaskStatistics } from './statistics';

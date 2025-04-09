
// Main entry point that re-exports all the utility functions

// Export helpers directly (all date and format utilities are now in helpers)
export * from './helpers';

// Export specific utilities that don't overlap with helpers
export * from './projects';
export * from './worklog-utils';

// Re-export statistics with explicit naming to avoid ambiguity
import * as statisticsUtils from './statistics';
export { statisticsUtils };

// These files are kept for backward compatibility but their contents
// have been moved to helpers.ts
// We don't re-export them to avoid duplication errors
// export * from './date-utils';
// export * from './format-utils';
// export * from './notes-utils';

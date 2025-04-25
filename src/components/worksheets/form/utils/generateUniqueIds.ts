
import { WorkLog } from '@/types/models';

/**
 * Generates a unique temporary ID for new work logs
 */
export const generateTemporaryId = (): string => {
  return 'temp_' + Date.now().toString() + '_' + Math.random().toString(36).substring(2, 9);
};

/**
 * Generates a unique ID for blank worksheets
 * Format: DZFV (Date Zeroes Far Verified) + timestamp
 */
export const generateUniqueBlankSheetId = (existingWorkLogs: WorkLog[]): string => {
  // Generate base ID with DZFV prefix and timestamp
  const baseId = 'DZFV' + Date.now().toString();
  
  // Check if the ID is already used
  const isIdUnique = (id: string) => !existingWorkLogs.some(log => log.projectId === id);
  
  // If the base ID is unique, return it
  if (isIdUnique(baseId)) {
    return baseId;
  }
  
  // Otherwise, append a random string until we get a unique ID
  let counter = 0;
  let uniqueId = baseId;
  
  while (!isIdUnique(uniqueId) && counter < 10) {
    uniqueId = baseId + '_' + Math.random().toString(36).substring(2, 6);
    counter++;
  }
  
  return uniqueId;
};

/**
 * Generates a sequential ID for regular work logs
 * Format: DZFS + 5 digit sequential number
 */
export const generateSequentialWorkLogId = (existingWorkLogs: WorkLog[]): string => {
  // Filter out non-DZFS IDs and get the highest number
  const existingNumbers = existingWorkLogs
    .filter(log => log.projectId?.startsWith('DZFS'))
    .map(log => {
      const num = parseInt(log.projectId?.substring(4) || '0', 10);
      return isNaN(num) ? 0 : num;
    });

  // Get the highest number or start at 0
  const highestNumber = existingNumbers.length > 0 
    ? Math.max(...existingNumbers) 
    : 0;

  // Generate the next number in sequence
  const nextNumber = highestNumber + 1;
  
  // Format with leading zeros to ensure 5 digits
  return `DZFS${String(nextNumber).padStart(5, '0')}`;
};

/**
 * Checks if a projectId corresponds to a blank worksheet
 * This is the single source of truth for identifying blank worksheets
 */
export const isBlankWorksheet = (projectId?: string): boolean => {
  if (!projectId) return false;
  return projectId.startsWith('DZFV');
};


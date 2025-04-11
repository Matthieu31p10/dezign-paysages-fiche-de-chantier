
import { WorkLog } from '@/types/models';

/**
 * Generates a unique ID for blank worksheets based on the existing worklog IDs
 * Format: DZFV + padded number (e.g., DZFV00001)
 */
export const generateUniqueBlankSheetId = (workLogs: WorkLog[] = []): string => {
  // Find the highest number used for blank sheets
  let maxNumber = 0;
  
  workLogs.forEach(log => {
    if (log.projectId && log.projectId.startsWith('DZFV')) {
      const numberPart = log.projectId.substring(4); // Extract the numeric part after "DZFV"
      const number = parseInt(numberPart, 10);
      if (!isNaN(number) && number > maxNumber) {
        maxNumber = number;
      }
    }
  });
  
  // Create a new ID with the next number
  const nextNumber = maxNumber + 1;
  const paddedNumber = nextNumber.toString().padStart(5, '0');
  return `DZFV${paddedNumber}`;
};

/**
 * Generates a temporary ID for a new worksheet before it's saved
 */
export const generateTemporaryId = (): string => {
  return `blank-${Date.now()}`;
};

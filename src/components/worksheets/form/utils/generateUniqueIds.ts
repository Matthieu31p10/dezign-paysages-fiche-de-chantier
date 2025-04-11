
import { WorkLog } from '@/types/models';

/**
 * Generates a unique ID for blank worksheets based on the existing worklog IDs
 * Format: DZFV + padded number (e.g., DZFV00001)
 */
export const generateUniqueBlankSheetId = (workLogs: WorkLog[] = []): string => {
  // Find the highest number used for blank sheets
  let maxNumber = 0;
  
  workLogs.forEach(log => {
    // Chercher à la fois les anciens formats (blank-) et les nouveaux (DZFV)
    if (log.projectId) {
      if (log.projectId.startsWith('DZFV')) {
        const numberPart = log.projectId.substring(4); // Extract the numeric part after "DZFV"
        const number = parseInt(numberPart, 10);
        if (!isNaN(number) && number > maxNumber) {
          maxNumber = number;
        }
      }
      // Conversion des anciens IDs si nécessaire
      else if (log.projectId.startsWith('blank-')) {
        // Maintenir la séquence en considérant les anciens IDs
        maxNumber = Math.max(maxNumber, 1);
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
  return `temp-${Date.now()}`;
};

/**
 * Vérifie si un projectId correspond à une fiche vierge
 */
export const isBlankWorksheet = (projectId?: string): boolean => {
  if (!projectId) return false;
  return projectId.startsWith('DZFV') || projectId.startsWith('blank-');
};

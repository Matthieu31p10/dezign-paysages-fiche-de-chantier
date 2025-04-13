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
 * Vérifie si un projectId correspond à une fiche vierge
 */
export const isBlankWorksheet = (projectId?: string): boolean => {
  if (!projectId) return false;
  return projectId.startsWith('DZFV') || projectId.startsWith('blank-');
};

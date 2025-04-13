
import { WorkLog } from '@/types/models';

/**
 * Generates a unique blank sheet ID with the DZFV prefix
 * Example: DZFV20250101001 for the first sheet of January 1, 2025
 */
export const generateUniqueBlankSheetId = (workLogs: WorkLog[] = []): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const datePrefix = `DZFV${year}${month}${day}`;
  
  // Find existing sheet IDs with the same date prefix and get the highest sequence number
  const existingIds = workLogs
    .filter(log => log.projectId && log.projectId.startsWith(datePrefix))
    .map(log => {
      const seqStr = log.projectId?.substring(datePrefix.length) || '';
      return parseInt(seqStr) || 0;
    });

  // Get the highest sequence number or default to 0 if none found
  const highestSeq = existingIds.length > 0 ? Math.max(...existingIds) : 0;
  
  // Create a new ID with incremented sequence
  const nextSeq = highestSeq + 1;
  const sequenceStr = String(nextSeq).padStart(3, '0');
  
  return `${datePrefix}${sequenceStr}`;
};

/**
 * Generates a temporary ID for new work logs
 */
export const generateTemporaryId = (): string => {
  return `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

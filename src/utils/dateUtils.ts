import { format, parseISO, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Safely parse a date string with error handling
 */
export const safeParseDateString = (dateString: string | Date): Date | null => {
  if (!dateString) return null;
  
  try {
    // If it's already a Date object
    if (dateString instanceof Date) {
      return isValid(dateString) ? dateString : null;
    }
    
    // Try to parse as ISO string first
    const parsedDate = parseISO(dateString);
    if (isValid(parsedDate)) {
      return parsedDate;
    }
    
    // Fallback to new Date() constructor
    const fallbackDate = new Date(dateString);
    return isValid(fallbackDate) ? fallbackDate : null;
  } catch (error) {
    console.warn('Failed to parse date:', dateString, error);
    return null;
  }
};

/**
 * Safely format a date with fallback
 */
export const safeFormatDate = (
  date: string | Date | null | undefined,
  formatString: string = 'PPP',
  fallback: string = 'Date invalide'
): string => {
  if (!date) return fallback;
  
  const parsedDate = safeParseDateString(date);
  if (!parsedDate) return fallback;
  
  try {
    return format(parsedDate, formatString, { locale: fr });
  } catch (error) {
    console.warn('Failed to format date:', date, error);
    return fallback;
  }
};

/**
 * Safely calculate days difference with error handling
 */
export const safeDateDifference = (
  dateLeft: string | Date,
  dateRight: string | Date
): number | null => {
  const leftDate = safeParseDateString(dateLeft);
  const rightDate = safeParseDateString(dateRight);
  
  if (!leftDate || !rightDate) return null;
  
  try {
    return Math.floor((leftDate.getTime() - rightDate.getTime()) / (1000 * 60 * 60 * 24));
  } catch (error) {
    console.warn('Failed to calculate date difference:', dateLeft, dateRight, error);
    return null;
  }
};

/**
 * Check if a date string/object is valid
 */
export const isValidDate = (date: string | Date | null | undefined): boolean => {
  return safeParseDateString(date) !== null;
};
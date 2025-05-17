
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Format a date to a French localized string
 */
export const formatDate = (date: Date | string | undefined): string => {
  if (!date) return '';
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  return format(parsedDate, 'dd MMMM yyyy', { locale: fr });
};

/**
 * Format a number to a Euro currency string
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};

/**
 * Format time (HH:MM)
 */
export const formatTime = (time: string | undefined): string => {
  if (!time) return '--:--';
  return time;
};

/**
 * Format hours amount with proper unit
 */
export const formatHours = (hours: number): string => {
  return `${hours.toFixed(2)} heure${hours !== 1 ? 's' : ''}`;
};

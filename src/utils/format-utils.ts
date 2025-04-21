
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Formate une date au format "mois année" (ex: "janvier 2023")
 */
export const formatMonthYear = (dateStr: string): string => {
  try {
    // Traitez différentes formes de dates (YYYY-MM ou Date)
    let date;
    if (dateStr.includes('-')) {
      const [year, month] = dateStr.split('-').map(Number);
      date = new Date(year, month - 1, 1);
    } else {
      date = new Date(dateStr);
    }
    
    return format(date, 'MMMM yyyy', { locale: fr });
  } catch (error) {
    console.error('Erreur de formatage de date:', error);
    return dateStr;
  }
};

/**
 * Formate un nombre en devise (euros)
 */
export const formatCurrency = (amount: number): string => {
  if (isNaN(amount)) return '0,00 €';
  
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Formate un pourcentage
 */
export const formatPercent = (value: number): string => {
  if (isNaN(value)) return '0%';
  
  return new Intl.NumberFormat('fr-FR', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1
  }).format(value / 100);
};

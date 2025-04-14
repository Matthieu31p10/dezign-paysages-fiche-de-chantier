
// Utilitaires de formatage

// Format une date au format DD/MM/YYYY
export const formatDate = (date: Date | string): string => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(dateObj);
};

// Format un prix en euros avec le symbole €
export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  }).format(amount);
};

// Format un nombre avec des séparateurs de milliers
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('fr-FR').format(num);
};

// Format un pourcentage avec le symbole %
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
};

// Format une heure au format HH:MM
export const formatTime = (time: string): string => {
  if (!time) return '';
  return time;
};

// Format un mois et une année pour l'affichage (ex: "Janvier 2023")
export const formatMonthYear = (monthYear: string): string => {
  if (!monthYear) return '';
  return monthYear.charAt(0).toUpperCase() + monthYear.slice(1);
};

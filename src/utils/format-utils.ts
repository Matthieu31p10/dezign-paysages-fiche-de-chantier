// Format pour l'affichage des montants
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

// Format pour l'affichage des dates
export const formatDate = (date: Date | string): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('fr-FR');
};

// Format pour l'affichage du temps
export const formatTime = (time: string): string => {
  return time;
};

// Format pour l'affichage des nombres
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('fr-FR').format(num);
};

// Format pour l'affichage des pourcentages
export const formatPercent = (value: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1
  }).format(value / 100);
};

// Alias de formatPercent pour la compatibilité
export const formatPercentage = formatPercent;

// Format pour l'affichage du mois et de l'année
export const formatMonthYear = (date: Date | string): string => {
  if (typeof date === 'string') {
    // If already a formatted string, return it
    if (!date.includes('-') && !date.includes('/')) {
      return date;
    }
    // Otherwise, try to convert it to a Date
    try {
      return new Date(date).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    } catch (e) {
      console.error('Error parsing date string:', date);
      return date;
    }
  }
  
  return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
};

// Alias de formatCurrency pour la compatibilité
export const formatPrice = formatCurrency;

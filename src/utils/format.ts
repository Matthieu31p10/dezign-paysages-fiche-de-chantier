
// Format numbers for display
export const formatNumber = (num: number): string => {
  return num.toLocaleString('fr-FR', { maximumFractionDigits: 2 });
};

// Format date as month and year (e.g., "Janvier 2025")
export const formatMonthYear = (date: Date): string => {
  return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
};

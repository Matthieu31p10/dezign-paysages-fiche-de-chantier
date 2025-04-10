
// Number Formatting
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('fr-FR', { 
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  }).format(num);
};

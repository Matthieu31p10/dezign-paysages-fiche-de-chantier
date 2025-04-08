
// Fonction pour formatter des nombres avec séparateurs de milliers
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('fr-FR', { 
    maximumFractionDigits: 1,
    minimumFractionDigits: 0
  }).format(num);
};

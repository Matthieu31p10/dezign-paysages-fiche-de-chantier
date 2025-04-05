
// Format numbers for display
export const formatNumber = (num: number): string => {
  return num.toLocaleString('fr-FR', { maximumFractionDigits: 2 });
};

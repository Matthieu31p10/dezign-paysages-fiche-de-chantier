
// Number Formatting
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('fr-FR', { 
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  }).format(num);
};

// Format time
export const formatTime = (time: string): string => {
  if (!time) return '';
  // Ensure format HH:MM
  const timeParts = time.split(':');
  if (timeParts.length !== 2) return time;
  
  const hours = timeParts[0].padStart(2, '0');
  const minutes = timeParts[1].padStart(2, '0');
  
  return `${hours}:${minutes}`;
};

// Format month and year
export const formatMonthYear = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
};

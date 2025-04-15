
// Format date to string in French format
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

// Format price to string with Euro symbol
export const formatPrice = (price: number | string): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return `${numPrice.toFixed(2)} €`;
};

// Format number with thousands separator
export const formatNumber = (num: number): string => {
  return num.toLocaleString('fr-FR');
};

// Format percentage to string with % symbol
export const formatPercentage = (percentage: number): string => {
  return `${percentage.toFixed(1)}%`;
};

// Format time from 24h format (e.g. "14:30") to display format (e.g. "14h30")
export const formatTime = (time: string): string => {
  if (!time) return '';
  
  // Handle ISO date strings
  if (time.includes('T')) {
    const date = new Date(time);
    return `${date.getHours()}h${date.getMinutes().toString().padStart(2, '0')}`;
  }
  
  // Handle HH:MM format
  const [hours, minutes] = time.split(':');
  return `${hours}h${minutes}`;
};

// Format month and year (input format: "YYYY-MM" or "MM YYYY")
export const formatMonthYear = (monthYearString: string): string => {
  // Check the format (either "YYYY-MM" or "Month YYYY")
  if (monthYearString.includes('-')) {
    // Format is "YYYY-MM"
    const [year, month] = monthYearString.split('-').map(Number);
    const monthNames = [
      'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
      'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
    ];
    return `${monthNames[month - 1]} ${year}`;
  } else {
    // Format is already "Month YYYY"
    return monthYearString;
  }
};

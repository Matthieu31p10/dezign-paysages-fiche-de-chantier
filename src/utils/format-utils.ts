// Format utilities for numbers, dates, currency, etc.

export const formatNumber = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined || value === '') {
    return '0';
  }
  
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) {
    return '0';
  }
  
  return num.toLocaleString('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
};

export const formatCurrency = (value: number | string | null | undefined, currency = '€'): string => {
  if (value === null || value === undefined || value === '') {
    return `0 ${currency}`;
  }
  
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) {
    return `0 ${currency}`;
  }
  
  return `${formatNumber(num)} ${currency}`;
};

export const formatPrice = (value: number | string | null | undefined): string => {
  return formatCurrency(value, '€');
};

export const formatPercent = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined || value === '') {
    return '0%';
  }
  
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) {
    return '0%';
  }
  
  return `${formatNumber(num)}%`;
};

export const formatPercentage = (current: number, total: number): string => {
  if (total === 0) return '0%';
  const percentage = (current / total) * 100;
  return formatPercent(percentage);
};

export const formatTime = (hours: number | string | null | undefined): string => {
  if (hours === null || hours === undefined || hours === '') {
    return '0h';
  }
  
  const num = typeof hours === 'string' ? parseFloat(hours) : hours;
  
  if (isNaN(num)) {
    return '0h';
  }
  
  if (num < 1) {
    const minutes = Math.round(num * 60);
    return `${minutes}min`;
  }
  
  const wholeHours = Math.floor(num);
  const minutes = Math.round((num - wholeHours) * 60);
  
  if (minutes === 0) {
    return `${wholeHours}h`;
  }
  
  return `${wholeHours}h${minutes.toString().padStart(2, '0')}`;
};

export const formatDate = (date: Date | string | null | undefined, format = 'short'): string => {
  if (!date) return 'Non définie';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Date invalide';
  }
  
  const options: Intl.DateTimeFormatOptions = format === 'short' 
    ? { day: '2-digit', month: '2-digit', year: 'numeric' }
    : { day: 'numeric', month: 'long', year: 'numeric' };
  
  return dateObj.toLocaleDateString('fr-FR', options);
};

export const formatMonthYear = (date: Date | string | null | undefined): string => {
  if (!date) return 'Non défini';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Date invalide';
  }
  
  return dateObj.toLocaleDateString('fr-FR', { 
    month: 'long', 
    year: 'numeric' 
  });
};
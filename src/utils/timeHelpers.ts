
export const formatTimeTo24H = (time: string): string => {
  // Si l'heure est déjà au format 24h, la retourner telle quelle
  if (/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return time;
  
  // Convertir les heures AM/PM en format 24h
  const [timeValue, modifier] = time.split(' ');
  let [hours, minutes] = timeValue.split(':');
  
  if (hours === '12') {
    hours = modifier === 'PM' ? '12' : '00';
  } else if (modifier === 'PM') {
    hours = (parseInt(hours, 10) + 12).toString();
  }
  
  return `${hours.padStart(2, '0')}:${minutes}`;
};

export const validateTime24H = (time: string): boolean => {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(time);
};

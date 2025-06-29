
import { parseISO, isToday, isTomorrow, format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const getDateLabel = (dateString: string) => {
  try {
    const date = parseISO(dateString);
    
    if (isToday(date)) {
      return "Aujourd'hui";
    } else if (isTomorrow(date)) {
      return "Demain";
    } else {
      return format(date, 'EEEE d MMMM yyyy', { locale: fr });
    }
  } catch (error) {
    console.error('Error formatting date:', dateString, error);
    return dateString;
  }
};

export const getDateBadgeVariant = (dateString: string) => {
  try {
    const date = parseISO(dateString);
    
    if (isToday(date)) {
      return "default" as const;
    } else if (isTomorrow(date)) {
      return "secondary" as const;
    } else {
      return "outline" as const;
    }
  } catch (error) {
    console.error('Error parsing date for badge:', dateString, error);
    return "outline" as const;
  }
};

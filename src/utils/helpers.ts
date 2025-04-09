
import { WorkLog } from '@/types/models';
import { format, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';

// Date Formatting Functions
export const getCurrentYear = (): number => {
  return new Date().getFullYear();
};

export const getCurrentMonth = (): number => {
  return new Date().getMonth() + 1; // Les mois commencent à 0 dans JavaScript
};

export const formatDate = (date: Date | string | undefined): string => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'dd/MM/yyyy', { locale: fr });
};

export const formatDateWithDay = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'EEEE dd MMMM yyyy', { locale: fr });
};

export const formatTime = (timeString: string | undefined): string => {
  return timeString || '';
};

export const formatMonthYear = (monthYear: string): string => {
  const [year, month] = monthYear.split('-').map(Number);
  
  const date = new Date(year, month - 1, 1);
  return format(date, 'MMMM yyyy', { locale: fr });
};

// WorkLog Analysis Functions
export const getDaysSinceLastEntry = (logs: WorkLog[]): number | null => {
  if (!logs || logs.length === 0) return null;

  // Trouve la date la plus récente parmi les logs
  const dates = logs.map(log => new Date(log.date));
  const mostRecentDate = new Date(Math.max(...dates.map(d => d.getTime())));
  
  // Calcule la différence avec la date actuelle
  return differenceInDays(new Date(), mostRecentDate);
};

export const getMonthName = (month: number): string => {
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  return monthNames[month - 1] || '';
};

export const groupWorkLogsByMonth = (workLogs: WorkLog[]) => {
  const groupedLogs: Record<string, WorkLog[]> = {};
  
  workLogs.forEach(log => {
    const date = new Date(log.date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Les mois commencent à 0
    
    const key = `${year}-${month}`;
    
    if (!groupedLogs[key]) {
      groupedLogs[key] = [];
    }
    
    groupedLogs[key].push(log);
  });
  
  return groupedLogs;
};

export const getYearsFromWorkLogs = (workLogs: WorkLog[]): number[] => {
  const yearsSet = new Set<number>();
  
  workLogs.forEach(log => {
    const date = new Date(log.date);
    yearsSet.add(date.getFullYear());
  });
  
  // S'il n'y a pas d'années, ajouter l'année courante
  if (yearsSet.size === 0) {
    yearsSet.add(getCurrentYear());
  }
  
  return Array.from(yearsSet).sort((a, b) => b - a); // Ordre décroissant
};

export const filterWorkLogsByYear = (workLogs: WorkLog[], year: number): WorkLog[] => {
  return workLogs.filter(log => {
    const logDate = new Date(log.date);
    return logDate.getFullYear() === year;
  });
};

export const filterWorkLogsByMonth = (workLogs: WorkLog[], year: number, month: number): WorkLog[] => {
  return workLogs.filter(log => {
    const logDate = new Date(log.date);
    return logDate.getFullYear() === year && logDate.getMonth() === month - 1;
  });
};

// Notes Extraction Functions
export const extractClientName = (notes: string): string => {
  const clientMatch = notes.match(/Client\s*:\s*([^\n]+)/i);
  return clientMatch ? clientMatch[1].trim() : '';
};

export const extractAddress = (notes: string): string => {
  const addressMatch = notes.match(/Adresse\s*:\s*([^\n]+)/i);
  return addressMatch ? addressMatch[1].trim() : '';
};

export const extractContactPhone = (notes: string): string => {
  const phoneMatch = notes.match(/Téléphone\s*:\s*([^\n]+)/i);
  return phoneMatch ? phoneMatch[1].trim() : '';
};

export const extractContactEmail = (notes: string): string => {
  const emailMatch = notes.match(/Email\s*:\s*([^\n]+)/i);
  return emailMatch ? emailMatch[1].trim() : '';
};

export const extractDescription = (notes: string): string => {
  // Remove all known fields from notes
  let description = notes;
  
  const fieldsToRemove = [
    /Client\s*:\s*[^\n]+\n?/i,
    /Adresse\s*:\s*[^\n]+\n?/i,
    /Téléphone\s*:\s*[^\n]+\n?/i,
    /Email\s*:\s*[^\n]+\n?/i,
    /ID Projet\s*:\s*[^\n]+\n?/i,
    /Projet Associé\s*:\s*[^\n]+\n?/i,
    /Taux Horaire\s*:\s*[^\n]+\n?/i,
    /TVA\s*:\s*[^\n]+\n?/i,
    /Devis Signé\s*:\s*[^\n]+\n?/i,
    /Valeur Devis\s*:\s*[^\n]+\n?/i
  ];
  
  fieldsToRemove.forEach(field => {
    description = description.replace(field, '');
  });
  
  return description.trim();
};

export const extractLinkedProjectId = (notes: string): string => {
  const projectMatch = notes.match(/ID Projet\s*:\s*([^\n]+)/i) || 
                       notes.match(/Projet Associé\s*:\s*([^\n]+)/i);
  return projectMatch ? projectMatch[1].trim() : '';
};

export const extractHourlyRate = (notes: string): string => {
  const rateMatch = notes.match(/Taux Horaire\s*:\s*([^\n]+)/i);
  return rateMatch ? rateMatch[1].trim() : '';
};

export const extractVatRate = (notes: string): string => {
  const vatMatch = notes.match(/TVA\s*:\s*([^\n]+)/i);
  return vatMatch ? vatMatch[1].trim() : '';
};

export const extractSignedQuote = (notes: string): boolean => {
  const quoteMatch = notes.match(/Devis Signé\s*:\s*([^\n]+)/i);
  if (!quoteMatch) return false;
  
  const value = quoteMatch[1].trim().toLowerCase();
  return value === 'oui' || value === 'true' || value === 'yes';
};

export const extractQuoteValue = (notes: string): number => {
  const valueMatch = notes.match(/Valeur Devis\s*:\s*([^\n]+)/i);
  if (!valueMatch) return 0;
  
  // Try to parse as number
  const valueStr = valueMatch[1].trim().replace(/,/g, '.').replace(/[^\d.]/g, '');
  const value = parseFloat(valueStr);
  return isNaN(value) ? 0 : value;
};

export const extractRegistrationTime = (notes: string): string => {
  const timeMatch = notes.match(/Heure d'enregistrement\s*:\s*([^\n]+)/i);
  return timeMatch ? timeMatch[1].trim() : '';
};

// Number Formatting
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('fr-FR', { 
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  }).format(num);
};

// Statistics Calculations
export const calculateAverageHoursPerVisit = (
  totalHours: number, 
  totalVisits: number
): number => {
  if (totalVisits === 0) return 0;
  return totalHours / totalVisits;
};

// Water Consumption Stats
export const calculateWaterConsumption = (workLogs: WorkLog[]): number => {
  let totalConsumption = 0;
  
  workLogs.forEach(log => {
    if (log.waterConsumption && typeof log.waterConsumption === 'number') {
      totalConsumption += log.waterConsumption;
    }
  });
  
  return totalConsumption;
};

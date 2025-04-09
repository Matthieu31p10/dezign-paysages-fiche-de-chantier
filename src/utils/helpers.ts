
import { WorkLog } from '@/types/models';
import { format, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';

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

export const extractClientName = (notes: string): string => {
  const clientMatch = notes.match(/Client\s*:\s*([^\n]+)/i);
  return clientMatch ? clientMatch[1].trim() : '';
};

export const extractAddress = (notes: string): string => {
  const addressMatch = notes.match(/Adresse\s*:\s*([^\n]+)/i);
  return addressMatch ? addressMatch[1].trim() : '';
};

export const extractLinkedProjectId = (notes: string): string => {
  const projectMatch = notes.match(/ID Projet\s*:\s*([^\n]+)/i) || 
                       notes.match(/Projet Associé\s*:\s*([^\n]+)/i);
  return projectMatch ? projectMatch[1].trim() : '';
};

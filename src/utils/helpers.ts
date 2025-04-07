import { format, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { WorkLog } from '@/types/models';

export const formatDate = (date: Date): string => {
  return format(date, 'dd/MM/yyyy', { locale: fr });
};

export const formatDateTime = (date: Date): string => {
  return format(date, 'dd/MM/yyyy HH:mm', { locale: fr });
};

export const formatTime = (date: Date): string => {
  return format(date, 'HH:mm', { locale: fr });
};

export const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date());
};

export const calculateTotalHours = (
  departureTime: string,
  arrivalTime: string,
  endTime: string,
  breakTimeValue: string,
  personnelCount: number
): number => {
  const [departureHours, departureMinutes] = departureTime.split(':').map(Number);
  const [arrivalHours, arrivalMinutes] = arrivalTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  const [breakHours, breakMinutes] = breakTimeValue.split(':').map(Number);

  const departureInMinutes = departureHours * 60 + departureMinutes;
  const arrivalInMinutes = arrivalHours * 60 + arrivalMinutes;
  const endInMinutes = endHours * 60 + endMinutes;
  const breakInMinutes = breakHours * 60 + breakMinutes;

  const totalWorkTime = endInMinutes - departureInMinutes - breakInMinutes;
  const travelTime = arrivalInMinutes - departureInMinutes;
  const effectiveWorkTime = totalWorkTime - travelTime;

  if (effectiveWorkTime < 0) {
    throw new Error("Total work time cannot be negative.");
  }

  return (effectiveWorkTime / 60) * personnelCount;
};

export const getCurrentYear = (): number => {
  return new Date().getFullYear();
};

export const filterWorkLogsByYear = (workLogs: WorkLog[], year: number): WorkLog[] => {
  return workLogs.filter(log => new Date(log.date).getFullYear() === year);
};

export const getYearsFromWorkLogs = (workLogs: WorkLog[]): number[] => {
  const years = new Set<number>();
  workLogs.forEach(log => {
    years.add(new Date(log.date).getFullYear());
  });
  return Array.from(years).sort((a, b) => b - a);
};

// Fonction pour extraire le nom du client des notes
export function extractClientName(notes: string): string {
  const match = notes.match(/CLIENT_NAME: (.*?)(?:\n|$)/);
  return match ? match[1] : '';
}

// Fonction pour extraire l'adresse des notes
export function extractAddress(notes: string): string {
  const match = notes.match(/ADDRESS: (.*?)(?:\n|$)/);
  return match ? match[1] : '';
}

// Fonction pour extraire le numéro de téléphone de contact
export function extractContactPhone(notes: string): string {
  const match = notes.match(/CONTACT_PHONE: (.*?)(?:\n|$)/);
  return match ? match[1] : '';
}

// Fonction pour extraire l'email de contact
export function extractContactEmail(notes: string): string {
  const match = notes.match(/CONTACT_EMAIL: (.*?)(?:\n|$)/);
  return match ? match[1] : '';
}

// Fonction pour extraire la description des travaux des notes
export function extractDescription(notes: string): string {
  const match = notes.match(/DESCRIPTION: ([\s\S]*?)(?=\n\w+:|$)/);
  return match ? match[1].trim() : '';
}

// Fonction pour extraire le taux horaire
export function extractHourlyRate(notes: string): number {
  const match = notes.match(/HOURLY_RATE: ([\d.]+)(?:\n|$)/);
  return match ? parseFloat(match[1]) : 0;
}

// Fonction pour extraire le taux de TVA
export function extractVatRate(notes: string): "10" | "20" {
  const match = notes.match(/VAT_RATE: (10|20)(?:\n|$)/);
  return match ? (match[1] as "10" | "20") : "20";
}

// Fonction pour extraire si un devis a été signé
export function extractSignedQuote(notes: string): boolean {
  const match = notes.match(/SIGNED_QUOTE: (true|false)(?:\n|$)/);
  return match ? match[1] === 'true' : false;
}

// Fonction pour extraire l'ID du projet lié
export function extractLinkedProjectId(notes: string): string {
  const match = notes.match(/LINKED_PROJECT_ID: (.*?)(?:\n|$)/);
  return match ? match[1] : '';
}

// Formatter les notes des consommables pour le stockage
export function formatConsumableNotes(consumables: any[]): string {
  if (!consumables || consumables.length === 0) return '';
  
  return consumables.map((item, index) => {
    return `CONSUMABLE_${index + 1}: ${item.supplier || ''},${item.product || ''},${item.unit || ''},${item.quantity},${item.unitPrice},${item.totalPrice}`; 
  }).join('\n');
}
